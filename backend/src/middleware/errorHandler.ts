import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";
import { env } from "../config/env";

function normalizeError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;

  const e = err as { name?: string; code?: number; errors?: Record<string, { path: string; message: string }>; keyValue?: Record<string, unknown> };

  if (e?.name === "ValidationError" && e.errors) {
    const fieldErrors = Object.values(e.errors).map((v) => ({ field: v.path, message: v.message }));
    return ApiError.badRequest("Validation failed", fieldErrors);
  }

  if (e?.code === 11000) {
    const field = Object.keys(e.keyValue ?? {})[0] ?? "field";
    return ApiError.conflict(`A record with this ${field} already exists`);
  }

  if (e?.name === "CastError") {
    return ApiError.badRequest("Invalid identifier supplied");
  }

  if (e?.name === "JsonWebTokenError") return ApiError.unauthorized("Invalid authentication token");
  if (e?.name === "TokenExpiredError") return ApiError.unauthorized("Authentication token expired");

  return ApiError.internal(env.isProd ? "Internal server error" : (err as Error)?.message || "Internal server error");
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const apiError = normalizeError(err);

  if (!apiError.isOperational || apiError.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} -> ${apiError.statusCode} ${apiError.message}`, {
      stack: err instanceof Error ? err.stack : undefined,
    });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${apiError.statusCode} ${apiError.message}`);
  }

  res.status(apiError.statusCode).json({
    success: false,
    message: apiError.message,
    errors: apiError.errors,
    ...(env.isProd ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });
}
