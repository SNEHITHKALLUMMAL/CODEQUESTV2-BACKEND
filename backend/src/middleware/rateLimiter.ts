import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError";
import { Request, Response, NextFunction } from "express";

function handler(_req: Request, _res: Response, next: NextFunction) {
  next(ApiError.tooManyRequests());
}

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  skipSuccessfulRequests: true,
});

export const quizSubmitLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});
