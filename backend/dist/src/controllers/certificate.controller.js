"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const certificate_service_1 = require("../services/certificate.service");
exports.certificateController = {
    list: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const certificates = await certificate_service_1.certificateService.listForUser(req.user.id);
        ApiResponse_1.ApiResponse.ok(res, certificates);
    }),
};
//# sourceMappingURL=certificate.controller.js.map