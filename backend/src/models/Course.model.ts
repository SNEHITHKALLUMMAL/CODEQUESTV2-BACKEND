import { Schema, model, Document, Types } from "mongoose";
import { CourseSlug } from "../../shared/types/enums";

export interface ICourse extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: CourseSlug;
  description: string;
  iconUrl?: string;
  order: number;
  isPublished: boolean;
  moduleCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, enum: Object.values(CourseSlug), required: true, unique: true },
    description: { type: String, required: true, maxlength: 1000 },
    iconUrl: { type: String, default: null },
    order: { type: Number, required: true, default: 0 },
    isPublished: { type: Boolean, default: true },
    moduleCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

courseSchema.index({ order: 1 });

export const Course = model<ICourse>("Course", courseSchema);
