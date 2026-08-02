"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../../shared/types/enums");
const quizQuestionSchema = new mongoose_1.Schema({
    type: { type: String, enum: Object.values(enums_1.QuestionType), required: true },
    question: { type: String, required: true },
    options: {
        type: [String],
        default: [],
        validate: {
            validator: function (val) {
                return this.type !== enums_1.QuestionType.MCQ || val.length >= 2;
            },
            message: "MCQ questions require at least 2 options",
        },
    },
    correctAnswer: { type: String, required: true },
    explanation: { type: String, default: "" },
    points: { type: Number, default: 1, min: 1 },
});
const quizSchema = new mongoose_1.Schema({
    moduleId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Module", required: true, unique: true, index: true },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    passingScorePercent: { type: Number, default: 70, min: 0, max: 100 },
    questions: {
        type: [quizQuestionSchema],
        validate: {
            validator: (v) => v.length > 0,
            message: "A quiz must have at least one question",
        },
    },
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });
exports.Quiz = (0, mongoose_1.model)("Quiz", quizSchema);
//# sourceMappingURL=Quiz.model.js.map