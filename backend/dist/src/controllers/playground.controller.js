"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playgroundController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const playground_service_1 = require("../services/playground.service");
exports.playgroundController = {
    save: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const saved = await playground_service_1.playgroundService.save(req.user.id, req.params.practicalId, req.body);
        ApiResponse_1.ApiResponse.ok(res, saved, "Saved");
    }),
    get: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const saved = await playground_service_1.playgroundService.get(req.user.id, req.params.practicalId);
        ApiResponse_1.ApiResponse.ok(res, saved);
    }),
    reset: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        await playground_service_1.playgroundService.reset(req.user.id, req.params.practicalId);
        ApiResponse_1.ApiResponse.noContent(res);
    }),
};
//# sourceMappingURL=playground.controller.js.map