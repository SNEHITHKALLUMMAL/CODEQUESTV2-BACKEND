"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certificate = void 0;
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
const certificateSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    certificateNumber: { type: String, required: true, unique: true },
    pdfUrl: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
}, { timestamps: false });
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });
certificateSchema.statics.generateCertificateNumber = function (courseSlug) {
    const random = crypto_1.default.randomBytes(4).toString("hex").toUpperCase();
    return `CQ-${courseSlug.toUpperCase()}-${random}`;
};
exports.Certificate = (0, mongoose_1.model)("Certificate", certificateSchema);
//# sourceMappingURL=Certificate.model.js.map