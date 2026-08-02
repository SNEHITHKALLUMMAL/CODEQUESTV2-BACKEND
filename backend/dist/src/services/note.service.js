"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteService = void 0;
const Note_model_1 = require("../models/Note.model");
const Topic_model_1 = require("../models/Topic.model");
const ApiError_1 = require("../utils/ApiError");
exports.noteService = {
    async upsert(userId, topicId, input) {
        const topic = await Topic_model_1.Topic.findById(topicId);
        if (!topic)
            throw ApiError_1.ApiError.notFound("Topic not found");
        return Note_model_1.Note.findOneAndUpdate({ userId, topicId }, { $set: { ...input, userId, topicId } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    },
    async remove(userId, topicId) {
        await Note_model_1.Note.findOneAndDelete({ userId, topicId });
    },
    async listBookmarks(userId) {
        return Note_model_1.Note.find({ userId, isBookmarked: true })
            .sort({ updatedAt: -1 })
            .populate({
            path: "topicId",
            select: "title slug moduleId courseId",
            populate: [
                { path: "moduleId", select: "title slug" },
                { path: "courseId", select: "title slug" },
            ],
        });
    },
    async listAllNotes(userId) {
        return Note_model_1.Note.find({ userId, text: { $ne: "" } })
            .sort({ updatedAt: -1 })
            .populate("topicId", "title slug");
    },
};
//# sourceMappingURL=note.service.js.map