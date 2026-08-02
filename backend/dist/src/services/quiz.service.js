"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizService = void 0;
const mongoose_1 = require("mongoose");
const Quiz_model_1 = require("../models/Quiz.model");
const QuizAttempt_model_1 = require("../models/QuizAttempt.model");
const ApiError_1 = require("../utils/ApiError");
const gradeQuiz_1 = require("../utils/gradeQuiz");
exports.quizService = {
    /** Returns the quiz with correctAnswer/explanation stripped — safe to send before submission. */
    async getForAttempt(moduleId) {
        const quiz = await Quiz_model_1.Quiz.findOne({ moduleId, isPublished: true });
        if (!quiz)
            throw ApiError_1.ApiError.notFound("No quiz found for this module");
        const questions = quiz.questions.map((q) => ({
            _id: q._id.toString(),
            type: q.type,
            question: q.question,
            options: q.options,
            points: q.points,
        }));
        return {
            id: quiz._id.toString(),
            moduleId: quiz.moduleId.toString(),
            title: quiz.title,
            passingScorePercent: quiz.passingScorePercent,
            questions,
        };
    },
    async submit(userId, quizId, input) {
        const quiz = await Quiz_model_1.Quiz.findById(quizId);
        if (!quiz)
            throw ApiError_1.ApiError.notFound("Quiz not found");
        // Every question must be answered — partial submissions are rejected rather
        // than silently graded as wrong, since that's usually a client bug.
        if (input.answers.length !== quiz.questions.length) {
            throw ApiError_1.ApiError.badRequest(`This quiz has ${quiz.questions.length} questions; received ${input.answers.length} answers`);
        }
        const gradableQuestions = quiz.questions.map((q) => ({
            id: q._id.toString(),
            correctAnswer: q.correctAnswer,
            points: q.points,
            explanation: q.explanation,
        }));
        let result;
        try {
            result = (0, gradeQuiz_1.gradeQuiz)(gradableQuestions, input.answers, quiz.passingScorePercent);
        }
        catch (err) {
            throw ApiError_1.ApiError.badRequest(err.message);
        }
        const previousAttempts = await QuizAttempt_model_1.QuizAttempt.countDocuments({ userId, quizId });
        const attempt = await QuizAttempt_model_1.QuizAttempt.create({
            userId,
            quizId,
            moduleId: quiz.moduleId,
            answers: result.gradedAnswers.map((a) => ({
                questionId: new mongoose_1.Types.ObjectId(a.questionId),
                submittedAnswer: a.submittedAnswer,
                isCorrect: a.isCorrect,
            })),
            scorePercent: result.scorePercent,
            passed: result.passed,
            attemptNumber: previousAttempts + 1,
            durationSeconds: input.durationSeconds,
        });
        return {
            attemptId: attempt._id.toString(),
            scorePercent: result.scorePercent,
            passed: result.passed,
            passingScorePercent: quiz.passingScorePercent,
            attemptNumber: attempt.attemptNumber,
            feedback: result.feedback,
        };
    },
    async getAttempts(userId, quizId) {
        return QuizAttempt_model_1.QuizAttempt.find({ userId, quizId }).sort({ attemptNumber: -1 });
    },
    async getBest(userId, quizId) {
        const best = await QuizAttempt_model_1.QuizAttempt.findOne({ userId, quizId }).sort({ scorePercent: -1, attemptNumber: 1 });
        const attemptCount = await QuizAttempt_model_1.QuizAttempt.countDocuments({ userId, quizId });
        return { best, attemptCount };
    },
};
//# sourceMappingURL=quiz.service.js.map