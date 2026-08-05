import PDFDocument from "pdfkit";
import { Certificate } from "../models/Certificate.model";
import { Course } from "../models/Course.model";
import { User } from "../models/User.model";
import { getCloudinary } from "../config/cloudinary";
import { logger } from "../utils/logger";
import crypto from "crypto";

function generateCertificateNumber(courseSlug: string): string {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `CQ-${courseSlug.toUpperCase()}-${random}`;
}

function renderCertificatePdf(studentName: string, courseTitle: string, certificateNumber: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ layout: "landscape", size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f8f9fb");
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(2).stroke("#12142b");

    doc.fillColor("#12142b").fontSize(32).font("Helvetica-Bold").text("Certificate of Completion", 0, 100, { align: "center" });
    doc.fontSize(14).font("Helvetica").fillColor("#464a68").text("This certifies that", 0, 170, { align: "center" });
    doc.fontSize(28).font("Helvetica-Bold").fillColor("#2965f1").text(studentName, 0, 200, { align: "center" });
    doc.fontSize(14).font("Helvetica").fillColor("#464a68").text(`has successfully completed the`, 0, 250, { align: "center" });
    doc.fontSize(22).font("Helvetica-Bold").fillColor("#e6541f").text(`${courseTitle} Course`, 0, 275, { align: "center" });
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#8a8fae")
      .text(`Certificate No. ${certificateNumber}`, 0, 340, { align: "center" })
      .text(`Issued by CodeQuest LMS on ${new Date().toLocaleDateString()}`, 0, 356, { align: "center" });

    doc.end();
  });
}

export const certificateService = {
  async issueCertificateIfEligible(userId: string, courseId: string) {
    const existing = await Certificate.findOne({ userId, courseId });
    if (existing) return existing;

    const [user, course] = await Promise.all([User.findById(userId), Course.findById(courseId)]);
    if (!user || !course) return null;

    const certificateNumber = generateCertificateNumber(course.slug);
    const pdfBuffer = await renderCertificatePdf(user.name, course.title, certificateNumber);
    const pdfUrl = await uploadCertificatePdf(pdfBuffer, certificateNumber);

    return Certificate.create({ userId, courseId, certificateNumber, pdfUrl, issuedAt: new Date() });
  },

  async listForUser(userId: string) {
    return Certificate.find({ userId }).populate("courseId", "title slug").sort({ issuedAt: -1 });
  },
};

async function uploadCertificatePdf(buffer: Buffer, certificateNumber: string): Promise<string> {
  const cloudinary = getCloudinary();

  if (!cloudinary) {
    logger.info(`[certificate:dev-fallback] Generated ${certificateNumber} as a data URL (Cloudinary not configured)`);
    return `data:application/pdf;base64,${buffer.toString("base64")}`;
  }

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "codequest/certificates", public_id: certificateNumber, format: "pdf" },
      (error, uploadResult) => {
        if (error || !uploadResult) return reject(error);
        resolve(uploadResult as { secure_url: string });
      }
    );
    stream.end(buffer);
  });

  return result.secure_url;
}
