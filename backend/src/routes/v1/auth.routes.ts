import { Router } from "express";
import { authController } from "../../controllers/auth.controller";
import { validate } from "../../middleware/validate";
import { protect } from "../../middleware/auth.middleware";
import { authLimiter } from "../../middleware/rateLimiter";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../../validators/auth.validators";

export const authRouter = Router();

authRouter.post("/register", authLimiter, validate(registerSchema), authController.register);
authRouter.post("/login", authLimiter, validate(loginSchema), authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", protect, authController.logout);
authRouter.post("/verify-email", validate(verifyEmailSchema), authController.verifyEmail);
authRouter.post(
  "/resend-verification",
  authLimiter,
  validate(resendVerificationSchema),
  authController.resendVerification
);
authRouter.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
authRouter.post("/reset-password", authLimiter, validate(resetPasswordSchema), authController.resetPassword);
authRouter.post("/change-password", protect, validate(changePasswordSchema), authController.changePassword);
authRouter.get("/me", protect, authController.me);
authRouter.patch("/me", protect, validate(updateProfileSchema), authController.updateProfile);
