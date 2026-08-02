"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateService = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const Certificate_model_1 = require("../models/Certificate.model");
const Course_model_1 = require("../models/Course.model");
const User_model_1 = require("../models/User.model");
const cloudinary_1 = require("../config/cloudinary");
const logger_1 = require("../utils/logger");
const crypto_1 = __importDefault(require("crypto"));
function generateCertificateNumber(courseSlug) {
    const random = crypto_1.default.randomBytes(4).toString("hex").toUpperCase();
    return `CQ-${courseSlug.toUpperCase()}-${random}`;
}
function renderCertificatePdf(studentName, courseTitle, certificateNumber) {
    return new Promise((resolve, reject) => {
        const doc = new pdfkit_1.default({ layout: "landscape", size: "A4", margin: 50 });
        const chunks = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);
        doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f8f9fb");
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(2).stroke("#12142b");
        doc
            .fillColor("#12142b")
            .fontSize(32)
            .font("Helvetica-Bold")
            .text("Certificate of Completion", 0, 100, { align: "center" });
        doc
            .fontSize(14)
            .font("Helvetica")
            .fillColor("#464a68")
            .text("This certifies that", 0, 170, { align: "center" });
        doc
            .fontSize(28)
            .font("Helvetica-Bold")
            .fillColor("#2965f1")
            .text(studentName, 0, 200, { align: "center" });
        doc
            .fontSize(14)
            .font("Helvetica")
            .fillColor("#464a68")
            .text(`has successfully completed the`, 0, 250, { align: "center" });
        doc
            .fontSize(22)
            .font("Helvetica-Bold")
            .fillColor("#e6541f")
            .text(`${courseTitle} Course`, 0, 275, { align: "center" });
        doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor("#8a8fae")
            .text(`Certificate No. ${certificateNumber}`, 0, 340, { align: "center" })
            .text(`Issued by CodeQuest LMS on ${new Date().toLocaleDateString()}`, 0, 356, { align: "center" });
        doc.end();
    });
}
exports.certificateService = {
    async issueCertificateIfEligible(userId, courseId) {
        const existing = await Certificate_model_1.Certificate.findOne({ userId, courseId });
        if (existing)
            return existing;
        const [user, course] = await Promise.all([User_model_1.User.findById(userId), Course_model_1.Course.findById(courseId)]);
        if (!user || !course)
            return null;
        const certificateNumber = generateCertificateNumber(course.slug);
        const pdfBuffer = await renderCertificatePdf(user.name, course.title, certificateNumber);
        const pdfUrl = await uploadCertificatePdf(pdfBuffer, certificateNumber);
        return Certificate_model_1.Certificate.create({
            userId,
            courseId,
            certificateNumber,
            pdfUrl,
            issuedAt: new Date(),
        });
    },
    async listForUser(userId) {
        return Certificate_model_1.Certificate.find({ userId }).populate("courseId", "title slug").sort({ issuedAt: -1 });
    },
};
async function uploadCertificatePdf(buffer, certificateNumber) {
    const cloudinary = (0, cloudinary_1.getCloudinary)();
    if (!cloudinary) {
        // Dev fallback (no Cloudinary configured): embed as a base64 data URL so the
        // feature is fully functional end-to-end without external credentials.
        logger_1.logger.info(`[certificate:dev-fallback] Generated ${certificateNumber} as a data URL (Cloudinary not configured)`);
        return `data:application/pdf;base64,${buffer.toString("base64")}`;
    }
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: "raw", folder: "codequest/certificates", public_id: certificateNumber, format: "pdf" }, (error, uploadResult) => {
            if (error || !uploadResult)
                return reject(error);
            resolve(uploadResult);
        });
        stream.end(buffer);
    });
    return result.secure_url;
}
//# sourceMappingURL=certificate.service.js.map