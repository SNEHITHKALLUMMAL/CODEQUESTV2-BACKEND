import { Schema, model, Document, Types } from "mongoose";

export interface IPlaygroundSave extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  practicalId: Types.ObjectId;
  code: { html: string; css: string; js: string };
  updatedAt: Date;
  createdAt: Date;
}

const playgroundSaveSchema = new Schema<IPlaygroundSave>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    practicalId: { type: Schema.Types.ObjectId, ref: "Practical", required: true, index: true },
    code: {
      html: { type: String, default: "" },
      css: { type: String, default: "" },
      js: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

playgroundSaveSchema.index({ userId: 1, practicalId: 1 }, { unique: true });

export const PlaygroundSave = model<IPlaygroundSave>("PlaygroundSave", playgroundSaveSchema);
