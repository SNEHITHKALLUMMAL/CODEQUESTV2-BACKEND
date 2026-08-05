import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { certificateService } from "../services/certificate.service";

export const certificateController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const certificates = await certificateService.listForUser(req.user.id);
    ApiResponse.ok(res, certificates);
  }),
};
