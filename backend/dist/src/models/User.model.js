"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const enums_1 = require("../../shared/types/enums");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(enums_1.UserRole), default: enums_1.UserRole.STUDENT, index: true },
    avatarUrl: { type: String, default: null },
    bio: { type: String, maxlength: 500, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    refreshTokenHash: { type: String, select: false },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
}, { timestamps: true });
userSchema.index({ role: 1, isActive: 1 });
userSchema.pre("save", async function (next) {
    if (!this.isModified("passwordHash"))
        return next();
    const salt = await bcrypt_1.default.genSalt(12);
    this.passwordHash = await bcrypt_1.default.hash(this.passwordHash, salt);
    next();
});
userSchema.methods.comparePassword = function (candidate) {
    return bcrypt_1.default.compare(candidate, this.passwordHash);
};
userSchema.set("toJSON", {
    transform: (_doc, ret) => {
        delete ret.passwordHash;
        delete ret.refreshTokenHash;
        delete ret.emailVerificationToken;
        delete ret.passwordResetToken;
        return ret;
    },
});
exports.User = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=User.model.js.map