import { Schema, model, Document, Types } from "mongoose";
import { ProgressStatus } from "../../shared/types/enums";

export interface IProgress extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  moduleId: Types.ObjectId;
  topicId: Types.ObjectId;
  status: ProgressStatus;
  completedAt?: Date;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true, index: true },
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    status: {
      type: String,
      enum: Object.values(ProgressStatus),
      default: ProgressStatus.NOT_STARTED,
    },
    completedAt: { type: Date, default: null },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, topicId: 1 }, { unique: true });
progressSchema.index({ userId: 1, courseId: 1, status: 1 });
progressSchema.index({ userId: 1, moduleId: 1, status: 1 });

export const Progress = model<IProgress>("Progress", progressSchema);
