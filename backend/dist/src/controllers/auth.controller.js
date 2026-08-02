"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const auth_service_1 = require("../services/auth.service");
const token_service_1 = require("../services/token.service");
const env_1 = require("../config/env");
const REFRESH_COOKIE_NAME = "cq_refresh_token";
function setRefreshCookie(res, token) {
    res.cookie(REFRESH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: env_1.env.isProd,
        sameSite: env_1.env.isProd ? "none" : "lax",
        domain: env_1.env.isProd ? env_1.env.cookieDomain : undefined,
        maxAge: (0, token_service_1.durationToMs)(env_1.env.jwt.refreshExpires),
        path: "/api/v1/auth",
    });
}
function clearRefreshCookie(res) {
    res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/v1/auth" });
}
exports.authController = {
    register: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { user, accessToken, refreshToken } = await auth_service_1.authService.register(req.body);
        setRefreshCookie(res, refreshToken);
        ApiResponse_1.ApiResponse.created(res, { user, accessToken }, "Account created. Check your email to verify your address.");
    }),
    login: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { user, accessToken, refreshToken } = await auth_service_1.authService.login(req.body);
        setRefreshCookie(res, refreshToken);
        ApiResponse_1.ApiResponse.ok(res, { user, accessToken }, "Logged in successfully");
    }),
    refresh: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const token = req.cookies?.[REFRESH_COOKIE_NAME];
        const { user, accessToken, refreshToken } = await auth_service_1.authService.refresh(token);
        setRefreshCookie(res, refreshToken);
        ApiResponse_1.ApiResponse.ok(res, { user, accessToken }, "Session refreshed");
    }),
    logout: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (req.user)
            await auth_service_1.authService.logout(req.user.id);
        clearRefreshCookie(res);
        ApiResponse_1.ApiResponse.ok(res, null, "Logged out");
    }),
    verifyEmail: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const user = await auth_service_1.authService.verifyEmail(req.body.token);
        ApiResponse_1.ApiResponse.ok(res, { user }, "Email verified successfully");
    }),
    resendVerification: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await auth_service_1.authService.resendVerification(req.body.email);
        ApiResponse_1.ApiResponse.ok(res, null, "If that email is registered and unverified, a new verification link has been sent.");
    }),
    forgotPassword: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await auth_service_1.authService.forgotPassword(req.body.email);
        ApiResponse_1.ApiResponse.ok(res, null, "If that email is registered, a password reset link has been sent.");
    }),
    resetPassword: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await auth_service_1.authService.resetPassword(req.body);
        ApiResponse_1.ApiResponse.ok(res, null, "Password reset successfully. Please log in with your new password.");
    }),
    changePassword: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const { currentPassword, newPassword } = req.body;
        await auth_service_1.authService.changePassword(req.user.id, currentPassword, newPassword);
        ApiResponse_1.ApiResponse.ok(res, null, "Password changed successfully");
    }),
    me: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const user = await auth_service_1.authService.getProfile(req.user.id);
        ApiResponse_1.ApiResponse.ok(res, { user });
    }),
    updateProfile: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const user = await auth_service_1.authService.updateProfile(req.user.id, req.body);
        ApiResponse_1.ApiResponse.ok(res, { user }, "Profile updated");
    }),
};
//# sourceMappingURL=auth.controller.js.map