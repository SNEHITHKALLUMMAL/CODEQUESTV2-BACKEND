"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
/**
 * Thrown anywhere in controllers/services/middleware. Caught by the global
 * errorHandler, which knows how to serialize it into the standard envelope.
 * Anything thrown that is NOT an ApiError is treated as an unexpected 500.
 */
class ApiError extends Error {
    statusCode;
    errors;
    isOperational;
    constructor(statusCode, message, errors = [], isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, ApiError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message = "Bad request", errors = []) {
        return new ApiError(400, message, errors);
    }
    static unauthorized(message = "Unauthorized") {
        return new ApiError(401, message);
    }
    static forbidden(message = "Forbidden") {
        return new ApiError(403, message);
    }
    static notFound(message = "Resource not found") {
        return new ApiError(404, message);
    }
    static conflict(message = "Conflict") {
        return new ApiError(409, message);
    }
    static tooManyRequests(message = "Too many requests, please try again later") {
        return new ApiError(429, message);
    }
    static internal(message = "Internal server error") {
        return new ApiError(500, message, [], false);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map