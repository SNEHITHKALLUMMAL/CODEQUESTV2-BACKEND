import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { authService } from "../services/auth.service";
import { durationToMs } from "../services/token.service";
import { env } from "../config/env";

const REFRESH_COOKIE_NAME = "cq_refresh_token";

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? "none" : "lax",
    domain: env.isProd ? env.cookieDomain : undefined,
    maxAge: durationToMs(env.jwt.refreshExpires),
    path: "/api/v1/auth",
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/v1/auth" });
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    setRefreshCookie(res, refreshToken);
    ApiResponse.created(res, { user, accessToken }, "Account created. Check your email to verify your address.");
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setRefreshCookie(res, refreshToken);
    ApiResponse.ok(res, { user, accessToken }, "Logged in successfully");
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    const { user, accessToken, refreshToken } = await authService.refresh(token);
    setRefreshCookie(res, refreshToken);
    ApiResponse.ok(res, { user, accessToken }, "Session refreshed");
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    if (req.user) await authService.logout(req.user.id);
    clearRefreshCookie(res);
    ApiResponse.ok(res, null, "Logged out");
  }),

  verifyEmail: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.verifyEmail(req.body.token);
    ApiResponse.ok(res, { user }, "Email verified successfully");
  }),

  resendVerification: asyncHandler(async (req: Request, res: Response) => {
    await authService.resendVerification(req.body.email);
    ApiResponse.ok(res, null, "If that email is registered and unverified, a new verification link has been sent.");
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body.email);
    ApiResponse.ok(res, null, "If that email is registered, a password reset link has been sent.");
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body);
    ApiResponse.ok(res, null, "Password reset successfully. Please log in with your new password.");
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);
    ApiResponse.ok(res, null, "Password changed successfully");
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const user = await authService.getProfile(req.user.id);
    ApiResponse.ok(res, { user });
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const user = await authService.updateProfile(req.user.id, req.body);
    ApiResponse.ok(res, { user }, "Profile updated");
  }),
};
