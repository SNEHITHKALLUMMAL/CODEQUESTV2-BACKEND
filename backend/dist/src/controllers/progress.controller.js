"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const progress_service_1 = require("../services/progress.service");
exports.progressController = {
    getForCourse: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const summary = await progress_service_1.progressService.getCourseProgress(req.user.id, req.params.slug);
        ApiResponse_1.ApiResponse.ok(res, summary);
    }),
    getDashboard: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const summary = await progress_service_1.progressService.getDashboardSummary(req.user.id);
        ApiResponse_1.ApiResponse.ok(res, summary);
    }),
};
//# sourceMappingURL=progress.controller.js.map