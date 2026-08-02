"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizSubmitLimiter = exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const ApiError_1 = require("../utils/ApiError");
function handler(_req, _res, next) {
    next(ApiError_1.ApiError.tooManyRequests());
}
/** General API traffic: generous, protects against abuse without hurting normal use. */
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    handler,
});
/** Auth endpoints (login/register/forgot-password): strict, brute-force protection. */
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler,
    skipSuccessfulRequests: true,
});
/** Quiz submission: prevents rapid-fire retake abuse. */
exports.quizSubmitLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler,
});
//# sourceMappingURL=rateLimiter.js.map