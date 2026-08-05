import { Schema, model, Document, Types } from "mongoose";

export interface ICertificate extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  certificateNumber: string;
  pdfUrl: string;
  issuedAt: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    certificateNumber: { type: String, required: true, unique: true },
    pdfUrl: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Certificate = model<ICertificate>("Certificate", certificateSchema);
