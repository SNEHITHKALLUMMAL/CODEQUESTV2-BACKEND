import { Schema, model, Document, Types } from "mongoose";

export interface IQuizAnswer {
  questionId: Types.ObjectId;
  submittedAnswer: string;
  isCorrect: boolean;
}

export interface IQuizAttempt extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  quizId: Types.ObjectId;
  moduleId: Types.ObjectId;
  answers: IQuizAnswer[];
  scorePercent: number;
  passed: boolean;
  attemptNumber: number;
  durationSeconds: number;
  createdAt: Date;
}

const quizAnswerSchema = new Schema<IQuizAnswer>(
  {
    questionId: { type: Schema.Types.ObjectId, required: true },
    submittedAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true, index: true },
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true, index: true },
    answers: { type: [quizAnswerSchema], required: true },
    scorePercent: { type: Number, required: true, min: 0, max: 100 },
    passed: { type: Boolean, required: true },
    attemptNumber: { type: Number, required: true, default: 1 },
    durationSeconds: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

quizAttemptSchema.index({ userId: 1, quizId: 1, scorePercent: -1 });
quizAttemptSchema.index({ userId: 1, quizId: 1, createdAt: -1 });

export const QuizAttempt = model<IQuizAttempt>("QuizAttempt", quizAttemptSchema);
