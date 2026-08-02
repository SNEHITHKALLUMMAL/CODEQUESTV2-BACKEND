"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = protect;
exports.attachUserIfPresent = attachUserIfPresent;
exports.authorize = authorize;
const ApiError_1 = require("../utils/ApiError");
const token_service_1 = require("../services/token.service");
/** Requires a valid access token; attaches { id, role } to req.user. */
function protect(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        next(ApiError_1.ApiError.unauthorized("Authentication required"));
        return;
    }
    const token = header.slice("Bearer ".length);
    try {
        const payload = (0, token_service_1.verifyAccessToken)(token);
        req.user = { id: payload.sub, role: payload.role };
        next();
    }
    catch {
        next(ApiError_1.ApiError.unauthorized("Invalid or expired access token"));
    }
}
/** Like protect, but doesn't fail if no token is present — for optionally-personalized routes. */
function attachUserIfPresent(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        next();
        return;
    }
    try {
        const payload = (0, token_service_1.verifyAccessToken)(header.slice("Bearer ".length));
        req.user = { id: payload.sub, role: payload.role };
    }
    catch {
        // ignore invalid token in optional-auth context
    }
    next();
}
/** Restricts a route to one or more roles. Must run after `protect`. */
function authorize(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            next(ApiError_1.ApiError.unauthorized("Authentication required"));
            return;
        }
        if (!roles.includes(req.user.role)) {
            next(ApiError_1.ApiError.forbidden("You do not have permission to perform this action"));
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map