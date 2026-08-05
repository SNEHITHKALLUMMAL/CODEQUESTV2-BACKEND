import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { progressService } from "../services/progress.service";

export const progressController = {
  getForCourse: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const summary = await progressService.getCourseProgress(req.user.id, req.params.slug);
    ApiResponse.ok(res, summary);
  }),

  getDashboard: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const summary = await progressService.getDashboardSummary(req.user.id);
    ApiResponse.ok(res, summary);
  }),
};
