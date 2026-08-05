import { Schema, model, Document, Types } from "mongoose";

export interface ICodeExample {
  label: string;
  html?: string;
  css?: string;
  js?: string;
}

export interface ITopic extends Document {
  _id: Types.ObjectId;
  moduleId: Types.ObjectId;
  courseId: Types.ObjectId;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  codeExamples: ICodeExample[];
  order: number;
  estimatedMinutes: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const codeExampleSchema = new Schema<ICodeExample>(
  {
    label: { type: String, required: true },
    html: { type: String, default: "" },
    css: { type: String, default: "" },
    js: { type: String, default: "" },
  },
  { _id: false }
);

const topicSchema = new Schema<ITopic>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    summary: { type: String, maxlength: 300, default: "" },
    content: { type: String, required: true },
    codeExamples: { type: [codeExampleSchema], default: [] },
    order: { type: Number, required: true, default: 0 },
    estimatedMinutes: { type: Number, default: 5 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

topicSchema.index({ moduleId: 1, slug: 1 }, { unique: true });
topicSchema.index({ moduleId: 1, order: 1 });
topicSchema.index({ title: "text", summary: "text", content: "text" });

export const Topic = model<ITopic>("Topic", topicSchema);
