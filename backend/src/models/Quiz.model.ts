import { Schema, model, Document, Types } from "mongoose";
import { QuestionType } from "../../shared/types/enums";

export interface IQuizQuestion {
  _id: Types.ObjectId;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

export interface IQuiz extends Document {
  _id: Types.ObjectId;
  moduleId: Types.ObjectId;
  courseId: Types.ObjectId;
  title: string;
  passingScorePercent: number;
  questions: IQuizQuestion[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const quizQuestionSchema = new Schema<IQuizQuestion>({
  type: { type: String, enum: Object.values(QuestionType), required: true },
  question: { type: String, required: true },
  options: {
    type: [String],
    default: [],
    validate: {
      validator: function (this: IQuizQuestion, val: string[]) {
        return this.type !== QuestionType.MCQ || val.length >= 2;
      },
      message: "MCQ questions require at least 2 options",
    },
  },
  correctAnswer: { type: String, required: true },
  explanation: { type: String, default: "" },
  points: { type: Number, default: 1, min: 1 },
});

const quizSchema = new Schema<IQuiz>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true, unique: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    passingScorePercent: { type: Number, default: 70, min: 0, max: 100 },
    questions: {
      type: [quizQuestionSchema],
      validate: {
        validator: (v: IQuizQuestion[]) => v.length > 0,
        message: "A quiz must have at least one question",
      },
    },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Quiz = model<IQuiz>("Quiz", quizSchema);
