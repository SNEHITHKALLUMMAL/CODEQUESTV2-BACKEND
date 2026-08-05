import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { noteService } from "../services/note.service";

export const noteController = {
  upsert: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const note = await noteService.upsert(req.user.id, req.params.topicId, req.body);
    ApiResponse.ok(res, note, "Note saved");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    await noteService.remove(req.user.id, req.params.topicId);
    ApiResponse.noContent(res);
  }),

  listBookmarks: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const bookmarks = await noteService.listBookmarks(req.user.id);
    ApiResponse.ok(res, bookmarks);
  }),

  listNotes: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const notes = await noteService.listAllNotes(req.user.id);
    ApiResponse.ok(res, notes);
  }),
};
