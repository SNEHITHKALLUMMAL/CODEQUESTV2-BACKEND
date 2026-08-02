"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
exports.toPublicUser = toPublicUser;
const User_model_1 = require("../models/User.model");
const ApiError_1 = require("../utils/ApiError");
const tokenGenerator_1 = require("../utils/tokenGenerator");
const token_service_1 = require("./token.service");
const email_service_1 = require("./email.service");
const enums_1 = require("../../shared/types/enums");
const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // 1h
function toPublicUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
    };
}
async function issueSessionTokens(user) {
    const accessToken = (0, token_service_1.signAccessToken)({ sub: user._id.toString(), role: user.role });
    const refreshToken = (0, token_service_1.signRefreshToken)({ sub: user._id.toString() });
    // Store only a hash of the refresh token (same principle as password storage) —
    // a DB leak shouldn't hand out usable session tokens.
    user.refreshTokenHash = (0, tokenGenerator_1.hashToken)(refreshToken);
    await user.save();
    return { accessToken, refreshToken };
}
exports.authService = {
    async register(input) {
        const existing = await User_model_1.User.findOne({ email: input.email });
        if (existing)
            throw ApiError_1.ApiError.conflict("An account with this email already exists");
        const { raw, hash } = (0, tokenGenerator_1.generateSecureToken)();
        const user = await User_model_1.User.create({
            name: input.name,
            email: input.email,
            passwordHash: input.password, // hashed by the pre-save hook
            role: enums_1.UserRole.STUDENT,
            isEmailVerified: false,
            emailVerificationToken: hash,
            emailVerificationExpires: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
        });
        await email_service_1.emailService.sendVerificationEmail(user.email, user.name, raw);
        const { accessToken, refreshToken } = await issueSessionTokens(user);
        return { user: toPublicUser(user), accessToken, refreshToken };
    },
    async login(input) {
        const user = await User_model_1.User.findOne({ email: input.email }).select("+passwordHash");
        if (!user)
            throw ApiError_1.ApiError.unauthorized("Invalid email or password");
        if (!user.isActive)
            throw ApiError_1.ApiError.forbidden("This account has been deactivated");
        const isMatch = await user.comparePassword(input.password);
        if (!isMatch)
            throw ApiError_1.ApiError.unauthorized("Invalid email or password");
        user.lastLoginAt = new Date();
        const { accessToken, refreshToken } = await issueSessionTokens(user);
        return { user: toPublicUser(user), accessToken, refreshToken };
    },
    async refresh(refreshToken) {
        if (!refreshToken)
            throw ApiError_1.ApiError.unauthorized("No refresh token provided");
        let payload;
        try {
            payload = (0, token_service_1.verifyRefreshToken)(refreshToken);
        }
        catch {
            throw ApiError_1.ApiError.unauthorized("Invalid or expired session, please log in again");
        }
        const user = await User_model_1.User.findById(payload.sub).select("+refreshTokenHash");
        if (!user || !user.refreshTokenHash)
            throw ApiError_1.ApiError.unauthorized("Session not found, please log in again");
        if ((0, tokenGenerator_1.hashToken)(refreshToken) !== user.refreshTokenHash) {
            // Token reuse / mismatch — possible theft. Invalidate the session defensively.
            user.refreshTokenHash = undefined;
            await user.save();
            throw ApiError_1.ApiError.unauthorized("Session invalid, please log in again");
        }
        // Rotate the refresh token on every use.
        const { accessToken, refreshToken: newRefreshToken } = await issueSessionTokens(user);
        return { user: toPublicUser(user), accessToken, refreshToken: newRefreshToken };
    },
    async logout(userId) {
        await User_model_1.User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
    },
    async verifyEmail(rawToken) {
        const hash = (0, tokenGenerator_1.hashToken)(rawToken);
        const user = await User_model_1.User.findOne({
            emailVerificationToken: hash,
            emailVerificationExpires: { $gt: new Date() },
        }).select("+emailVerificationToken +emailVerificationExpires");
        if (!user)
            throw ApiError_1.ApiError.badRequest("Verification link is invalid or has expired");
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
        return toPublicUser(user);
    },
    async resendVerification(email) {
        const user = await User_model_1.User.findOne({ email });
        // Always respond success-shaped from the controller regardless of whether
        // the user exists, to avoid leaking which emails are registered.
        if (!user || user.isEmailVerified)
            return;
        const { raw, hash } = (0, tokenGenerator_1.generateSecureToken)();
        user.emailVerificationToken = hash;
        user.emailVerificationExpires = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);
        await user.save();
        await email_service_1.emailService.sendVerificationEmail(user.email, user.name, raw);
    },
    async forgotPassword(email) {
        const user = await User_model_1.User.findOne({ email });
        if (!user)
            return; // don't leak account existence
        const { raw, hash } = (0, tokenGenerator_1.generateSecureToken)();
        user.passwordResetToken = hash;
        user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_TTL_MS);
        await user.save();
        await email_service_1.emailService.sendPasswordResetEmail(user.email, user.name, raw);
    },
    async resetPassword(input) {
        const hash = (0, tokenGenerator_1.hashToken)(input.token);
        const user = await User_model_1.User.findOne({
            passwordResetToken: hash,
            passwordResetExpires: { $gt: new Date() },
        }).select("+passwordResetToken +passwordResetExpires +refreshTokenHash");
        if (!user)
            throw ApiError_1.ApiError.badRequest("Reset link is invalid or has expired");
        user.passwordHash = input.newPassword; // re-hashed by pre-save hook
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.refreshTokenHash = undefined; // force re-login everywhere — a changed password should kill old sessions
        await user.save();
    },
    async changePassword(userId, currentPassword, newPassword) {
        const user = await User_model_1.User.findById(userId).select("+passwordHash +refreshTokenHash");
        if (!user)
            throw ApiError_1.ApiError.notFound("User not found");
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch)
            throw ApiError_1.ApiError.badRequest("Current password is incorrect");
        user.passwordHash = newPassword;
        user.refreshTokenHash = undefined;
        await user.save();
    },
    async getProfile(userId) {
        const user = await User_model_1.User.findById(userId);
        if (!user)
            throw ApiError_1.ApiError.notFound("User not found");
        return toPublicUser(user);
    },
    async updateProfile(userId, updates) {
        const user = await User_model_1.User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
        if (!user)
            throw ApiError_1.ApiError.notFound("User not found");
        return toPublicUser(user);
    },
};
//# sourceMappingURL=auth.service.js.map