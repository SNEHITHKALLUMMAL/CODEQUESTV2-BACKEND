import { Schema, model, Document, Types } from "mongoose";

export interface IStarterCode {
  html: string;
  css: string;
  js: string;
}

export interface IPractical extends Document {
  _id: Types.ObjectId;
  moduleId: Types.ObjectId;
  courseId: Types.ObjectId;
  topicId?: Types.ObjectId;
  title: string;
  slug: string;
  instructions: string;
  starterCode: IStarterCode;
  solutionCode?: IStarterCode;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const codeSchema = new Schema<IStarterCode>(
  {
    html: { type: String, default: "<!-- write your HTML here -->\n" },
    css: { type: String, default: "/* write your CSS here */\n" },
    js: { type: String, default: "// write your JavaScript here\n" },
  },
  { _id: false }
);

const practicalSchema = new Schema<IPractical>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", default: null },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    instructions: { type: String, required: true },
    starterCode: { type: codeSchema, default: () => ({}) },
    solutionCode: { type: codeSchema, select: false },
    order: { type: Number, required: true, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

practicalSchema.index({ moduleId: 1, slug: 1 }, { unique: true });
practicalSchema.index({ moduleId: 1, order: 1 });

export const Practical = model<IPractical>("Practical", practicalSchema);
