"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth.controller");
const validate_1 = require("../../middleware/validate");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const auth_validators_1 = require("../../validators/auth.validators");
exports.authRouter = (0, express_1.Router)();
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new student account
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201: { description: Account created }
 *       409: { description: Email already registered }
 */
exports.authRouter.post("/register", rateLimiter_1.authLimiter, (0, validate_1.validate)(auth_validators_1.registerSchema), auth_controller_1.authController.register);
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200: { description: Logged in }
 *       401: { description: Invalid credentials }
 */
exports.authRouter.post("/login", rateLimiter_1.authLimiter, (0, validate_1.validate)(auth_validators_1.loginSchema), auth_controller_1.authController.login);
/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Exchange the httpOnly refresh cookie for a new access token
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200: { description: New access token issued }
 *       401: { description: Session invalid or expired }
 */
exports.authRouter.post("/refresh", auth_controller_1.authController.refresh);
/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out and invalidate the current session
 *     tags: [Auth]
 *     responses:
 *       200: { description: Logged out }
 */
exports.authRouter.post("/logout", auth_middleware_1.protect, auth_controller_1.authController.logout);
/**
 * @openapi
 * /auth/verify-email:
 *   post:
 *     summary: Verify an email address using the token from the verification email
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200: { description: Email verified }
 *       400: { description: Invalid or expired token }
 */
exports.authRouter.post("/verify-email", (0, validate_1.validate)(auth_validators_1.verifyEmailSchema), auth_controller_1.authController.verifyEmail);
/**
 * @openapi
 * /auth/resend-verification:
 *   post:
 *     summary: Resend the email verification link
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200: { description: Verification email resent if applicable }
 */
exports.authRouter.post("/resend-verification", rateLimiter_1.authLimiter, (0, validate_1.validate)(auth_validators_1.resendVerificationSchema), auth_controller_1.authController.resendVerification);
/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200: { description: Reset email sent if applicable }
 */
exports.authRouter.post("/forgot-password", rateLimiter_1.authLimiter, (0, validate_1.validate)(auth_validators_1.forgotPasswordSchema), auth_controller_1.authController.forgotPassword);
/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using the token from the reset email
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200: { description: Password reset }
 *       400: { description: Invalid or expired token }
 */
exports.authRouter.post("/reset-password", rateLimiter_1.authLimiter, (0, validate_1.validate)(auth_validators_1.resetPasswordSchema), auth_controller_1.authController.resetPassword);
/**
 * @openapi
 * /auth/change-password:
 *   post:
 *     summary: Change password while logged in
 *     tags: [Auth]
 *     responses:
 *       200: { description: Password changed }
 */
exports.authRouter.post("/change-password", auth_middleware_1.protect, (0, validate_1.validate)(auth_validators_1.changePasswordSchema), auth_controller_1.authController.changePassword);
/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get the current authenticated user's profile
 *     tags: [Auth]
 *     responses:
 *       200: { description: Current user }
 *   patch:
 *     summary: Update the current user's profile
 *     tags: [Auth]
 *     responses:
 *       200: { description: Profile updated }
 */
exports.authRouter.get("/me", auth_middleware_1.protect, auth_controller_1.authController.me);
exports.authRouter.patch("/me", auth_middleware_1.protect, (0, validate_1.validate)(auth_validators_1.updateProfileSchema), auth_controller_1.authController.updateProfile);
//# sourceMappingURL=auth.routes.js.map