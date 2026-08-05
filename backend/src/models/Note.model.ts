import { Schema, model, Document, Types } from "mongoose";

export interface INote extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  topicId: Types.ObjectId;
  text: string;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true, index: true },
    text: { type: String, default: "", maxlength: 5000 },
    isBookmarked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

noteSchema.index({ userId: 1, topicId: 1 }, { unique: true });
noteSchema.index({ userId: 1, isBookmarked: 1 });

export const Note = model<INote>("Note", noteSchema);
