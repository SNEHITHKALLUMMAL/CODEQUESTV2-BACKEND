"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const quiz_service_1 = require("../services/quiz.service");
exports.quizController = {
    getForModule: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const quiz = await quiz_service_1.quizService.getForAttempt(req.params.moduleId);
        ApiResponse_1.ApiResponse.ok(res, quiz);
    }),
    submit: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const result = await quiz_service_1.quizService.submit(req.user.id, req.params.quizId, req.body);
        ApiResponse_1.ApiResponse.ok(res, result, result.passed ? "Quiz passed!" : "Quiz submitted");
    }),
    getAttempts: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const attempts = await quiz_service_1.quizService.getAttempts(req.user.id, req.params.quizId);
        ApiResponse_1.ApiResponse.ok(res, attempts);
    }),
    getBest: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const best = await quiz_service_1.quizService.getBest(req.user.id, req.params.quizId);
        ApiResponse_1.ApiResponse.ok(res, best);
    }),
};
//# sourceMappingURL=quiz.controller.js.map