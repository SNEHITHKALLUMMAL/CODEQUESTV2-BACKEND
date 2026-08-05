import { Schema, model, Document, Types } from "mongoose";
import { ImportanceLevel } from "../../shared/types/enums";

export interface IModule extends Document {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  order: number;
  importance: ImportanceLevel;
  topicCount: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema = new Schema<IModule>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, maxlength: 500, default: "" },
    order: { type: Number, required: true, default: 0 },
    importance: {
      type: String,
      enum: Object.values(ImportanceLevel),
      default: ImportanceLevel.STANDARD,
    },
    topicCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

moduleSchema.index({ courseId: 1, slug: 1 }, { unique: true });
moduleSchema.index({ courseId: 1, order: 1 });

export const Module = model<IModule>("Module", moduleSchema);
