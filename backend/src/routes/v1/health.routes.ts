import { Router } from "express";
import mongoose from "mongoose";
import { ApiResponse } from "../../utils/ApiResponse";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  const dbStateMap: Record<number, string> = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  ApiResponse.ok(res, {
    status: "ok",
    uptimeSeconds: Math.round(process.uptime()),
    database: dbStateMap[mongoose.connection.readyState] ?? "unknown",
    timestamp: new Date().toISOString(),
  });
});
