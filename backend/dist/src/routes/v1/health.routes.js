"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = void 0;
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const ApiResponse_1 = require("../../utils/ApiResponse");
exports.healthRouter = (0, express_1.Router)();
/**
 * @openapi
 * /health:
 *   get:
 *     summary: Liveness/readiness check
 *     tags: [System]
 *     security: []
 *     responses:
 *       200:
 *         description: Service is up
 */
exports.healthRouter.get("/", (_req, res) => {
    const dbStateMap = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
    ApiResponse_1.ApiResponse.ok(res, {
        status: "ok",
        uptimeSeconds: Math.round(process.uptime()),
        database: dbStateMap[mongoose_1.default.connection.readyState] ?? "unknown",
        timestamp: new Date().toISOString(),
    });
});
//# sourceMappingURL=health.routes.js.map