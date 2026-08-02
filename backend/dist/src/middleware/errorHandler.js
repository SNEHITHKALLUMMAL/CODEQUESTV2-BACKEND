"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const ApiError_1 = require("../utils/ApiError");
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
/**
 * Normalizes Mongoose/JWT/unexpected errors into ApiError so downstream
 * handling is uniform, then serializes to the standard error envelope.
 */
function normalizeError(err) {
    if (err instanceof ApiError_1.ApiError)
        return err;
    const e = err;
    // Mongoose validation error
    if (e?.name === "ValidationError" && e.errors) {
        const fieldErrors = Object.values(e.errors).map((v) => ({ field: v.path, message: v.message }));
        return ApiError_1.ApiError.badRequest("Validation failed", fieldErrors);
    }
    // Mongoose duplicate key error
    if (e?.code === 11000) {
        const field = Object.keys(e.keyValue ?? {})[0] ?? "field";
        return ApiError_1.ApiError.conflict(`A record with this ${field} already exists`);
    }
    // Mongoose invalid ObjectId cast
    if (e?.name === "CastError") {
        return ApiError_1.ApiError.badRequest("Invalid identifier supplied");
    }
    // JWT errors
    if (e?.name === "JsonWebTokenError")
        return ApiError_1.ApiError.unauthorized("Invalid authentication token");
    if (e?.name === "TokenExpiredError")
        return ApiError_1.ApiError.unauthorized("Authentication token expired");
    // Unknown error -> 500, never leak internals to the client
    return ApiError_1.ApiError.internal(env_1.env.isProd ? "Internal server error" : err?.message || "Internal server error");
}
function errorHandler(err, req, res, _next) {
    const apiError = normalizeError(err);
    if (!apiError.isOperational || apiError.statusCode >= 500) {
        logger_1.logger.error(`${req.method} ${req.originalUrl} -> ${apiError.statusCode} ${apiError.message}`, {
            stack: err instanceof Error ? err.stack : undefined,
        });
    }
    else {
        logger_1.logger.warn(`${req.method} ${req.originalUrl} -> ${apiError.statusCode} ${apiError.message}`);
    }
    res.status(apiError.statusCode).json({
        success: false,
        message: apiError.message,
        errors: apiError.errors,
        ...(env_1.env.isProd ? {} : { stack: err instanceof Error ? err.stack : undefined }),
    });
}
//# sourceMappingURL=errorHandler.js.map