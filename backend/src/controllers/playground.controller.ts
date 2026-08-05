import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { playgroundService } from "../services/playground.service";

export const playgroundController = {
  save: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const saved = await playgroundService.save(req.user.id, req.params.practicalId, req.body);
    ApiResponse.ok(res, saved, "Saved");
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const saved = await playgroundService.get(req.user.id, req.params.practicalId);
    ApiResponse.ok(res, saved);
  }),

  reset: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    await playgroundService.reset(req.user.id, req.params.practicalId);
    ApiResponse.noContent(res);
  }),
};
