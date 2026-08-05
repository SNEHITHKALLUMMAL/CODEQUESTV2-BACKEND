import { User, IUser } from "../models/User.model";
import { ApiError } from "../utils/ApiError";
import { generateSecureToken, hashToken } from "../utils/tokenGenerator";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./token.service";
import { emailService } from "./email.service";
import { UserRole } from "../../shared/types/enums";
import type { RegisterInput, LoginInput, ResetPasswordInput } from "../validators/auth.validators";

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

function toPublicUser(user: IUser) {
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

async function issueSessionTokens(user: IUser): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ sub: user._id.toString() });

  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  return { accessToken, refreshToken };
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await User.findOne({ email: input.email });
    if (existing) throw ApiError.conflict("An account with this email already exists");

    const { raw, hash } = generateSecureToken();

    const user = await User.create({
      name: input.name,
      email: input.email,
      passwordHash: input.password,
      role: UserRole.STUDENT,
      isEmailVerified: false,
      emailVerificationToken: hash,
      emailVerificationExpires: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
    });

    await emailService.sendVerificationEmail(user.email, user.name, raw);

    const { accessToken, refreshToken } = await issueSessionTokens(user);
    return { user: toPublicUser(user), accessToken, refreshToken };
  },

  async login(input: LoginInput) {
    const user = await User.findOne({ email: input.email }).select("+passwordHash");
    if (!user) throw ApiError.unauthorized("Invalid email or password");

    if (!user.isActive) throw ApiError.forbidden("This account has been deactivated");

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) throw ApiError.unauthorized("Invalid email or password");

    user.lastLoginAt = new Date();
    const { accessToken, refreshToken } = await issueSessionTokens(user);

    return { user: toPublicUser(user), accessToken, refreshToken };
  },

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) throw ApiError.unauthorized("No refresh token provided");

    let payload: { sub: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized("Invalid or expired session, please log in again");
    }

    const user = await User.findById(payload.sub).select("+refreshTokenHash");
    if (!user || !user.refreshTokenHash) throw ApiError.unauthorized("Session not found, please log in again");

    if (hashToken(refreshToken) !== user.refreshTokenHash) {
      user.refreshTokenHash = undefined;
      await user.save();
      throw ApiError.unauthorized("Session invalid, please log in again");
    }

    const { accessToken, refreshToken: newRefreshToken } = await issueSessionTokens(user);
    return { user: toPublicUser(user), accessToken, refreshToken: newRefreshToken };
  },

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
  },

  async verifyEmail(rawToken: string) {
    const hash = hashToken(rawToken);
    const user = await User.findOne({
      emailVerificationToken: hash,
      emailVerificationExpires: { $gt: new Date() },
    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) throw ApiError.badRequest("Verification link is invalid or has expired");

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return toPublicUser(user);
  },

  async resendVerification(email: string) {
    const user = await User.findOne({ email });
    if (!user || user.isEmailVerified) return;

    const { raw, hash } = generateSecureToken();
    user.emailVerificationToken = hash;
    user.emailVerificationExpires = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);
    await user.save();

    await emailService.sendVerificationEmail(user.email, user.name, raw);
  },

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) return;

    const { raw, hash } = generateSecureToken();
    user.passwordResetToken = hash;
    user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_TTL_MS);
    await user.save();

    await emailService.sendPasswordResetEmail(user.email, user.name, raw);
  },

  async resetPassword(input: ResetPasswordInput) {
    const hash = hashToken(input.token);
    const user = await User.findOne({
      passwordResetToken: hash,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpires +refreshTokenHash");

    if (!user) throw ApiError.badRequest("Reset link is invalid or has expired");

    user.passwordHash = input.newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokenHash = undefined;
    await user.save();
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId).select("+passwordHash +refreshTokenHash");
    if (!user) throw ApiError.notFound("User not found");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw ApiError.badRequest("Current password is incorrect");

    user.passwordHash = newPassword;
    user.refreshTokenHash = undefined;
    await user.save();
  },

  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("User not found");
    return toPublicUser(user);
  },

  async updateProfile(userId: string, updates: Partial<Pick<IUser, "name" | "bio" | "avatarUrl">>) {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
    if (!user) throw ApiError.notFound("User not found");
    return toPublicUser(user);
  },
};

export { toPublicUser };
