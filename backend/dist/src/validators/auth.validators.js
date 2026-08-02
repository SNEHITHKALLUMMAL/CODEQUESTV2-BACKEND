"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.updateProfileSchema = exports.resendVerificationSchema = exports.verifyEmailSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const passwordSchema = zod_1.z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2, "Name must be at least 2 characters").max(80),
    email: zod_1.z.string().trim().toLowerCase().email("Invalid email address"),
    password: passwordSchema,
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase().email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase().email("Invalid email address"),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(10, "Invalid or missing reset token"),
    newPassword: passwordSchema,
});
exports.verifyEmailSchema = zod_1.z.object({
    token: zod_1.z.string().min(10, "Invalid or missing verification token"),
});
exports.resendVerificationSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase().email("Invalid email address"),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(80).optional(),
    bio: zod_1.z.string().max(500).optional(),
    avatarUrl: zod_1.z.string().url().optional().nullable(),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
});
//# sourceMappingURL=auth.validators.js.map