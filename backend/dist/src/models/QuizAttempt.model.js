"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizAttempt = void 0;
const mongoose_1 = require("mongoose");
const quizAnswerSchema = new mongoose_1.Schema({
    questionId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    submittedAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
}, { _id: false });
const quizAttemptSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    quizId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Quiz", required: true, index: true },
    moduleId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Module", required: true, index: true },
    answers: { type: [quizAnswerSchema], required: true },
    scorePercent: { type: Number, required: true, min: 0, max: 100 },
    passed: { type: Boolean, required: true },
    attemptNumber: { type: Number, required: true, default: 1 },
    durationSeconds: { type: Number, default: 0 },
}, { timestamps: { createdAt: true, updatedAt: false } });
// "Best score" and "latest attempt" are both hot queries (FR-24) — this index serves both,
// sorted by scorePercent desc or createdAt desc.
quizAttemptSchema.index({ userId: 1, quizId: 1, scorePercent: -1 });
quizAttemptSchema.index({ userId: 1, quizId: 1, createdAt: -1 });
exports.QuizAttempt = (0, mongoose_1.model)("QuizAttempt", quizAttemptSchema);
//# sourceMappingURL=QuizAttempt.model.js.map