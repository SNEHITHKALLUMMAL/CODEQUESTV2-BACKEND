"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const note_service_1 = require("../services/note.service");
exports.noteController = {
    upsert: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const note = await note_service_1.noteService.upsert(req.user.id, req.params.topicId, req.body);
        ApiResponse_1.ApiResponse.ok(res, note, "Note saved");
    }),
    remove: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        await note_service_1.noteService.remove(req.user.id, req.params.topicId);
        ApiResponse_1.ApiResponse.noContent(res);
    }),
    listBookmarks: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const bookmarks = await note_service_1.noteService.listBookmarks(req.user.id);
        ApiResponse_1.ApiResponse.ok(res, bookmarks);
    }),
    listNotes: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const notes = await note_service_1.noteService.listAllNotes(req.user.id);
        ApiResponse_1.ApiResponse.ok(res, notes);
    }),
};
//# sourceMappingURL=note.controller.js.map