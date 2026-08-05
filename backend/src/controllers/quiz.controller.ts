import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { quizService } from "../services/quiz.service";

export const quizController = {
  getForModule: asyncHandler(async (req: Request, res: Response) => {
    const quiz = await quizService.getForAttempt(req.params.moduleId);
    ApiResponse.ok(res, quiz);
  }),

  submit: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const result = await quizService.submit(req.user.id, req.params.quizId, req.body);
    ApiResponse.ok(res, result, result.passed ? "Quiz passed!" : "Quiz submitted");
  }),

  getAttempts: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const attempts = await quizService.getAttempts(req.user.id, req.params.quizId);
    ApiResponse.ok(res, attempts);
  }),

  getBest: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const best = await quizService.getBest(req.user.id, req.params.quizId);
    ApiResponse.ok(res, best);
  }),
};
