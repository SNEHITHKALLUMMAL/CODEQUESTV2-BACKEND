import { Note } from "../models/Note.model";
import { Topic } from "../models/Topic.model";
import { ApiError } from "../utils/ApiError";
import type { UpsertNoteInput } from "../validators/course.validators";

export const noteService = {
  async upsert(userId: string, topicId: string, input: UpsertNoteInput) {
    const topic = await Topic.findById(topicId);
    if (!topic) throw ApiError.notFound("Topic not found");

    return Note.findOneAndUpdate(
      { userId, topicId },
      { $set: { ...input, userId, topicId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  },

  async remove(userId: string, topicId: string) {
    await Note.findOneAndDelete({ userId, topicId });
  },

  async listBookmarks(userId: string) {
    return Note.find({ userId, isBookmarked: true })
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

  async listAllNotes(userId: string) {
    return Note.find({ userId, text: { $ne: "" } })
      .sort({ updatedAt: -1 })
      .populate("topicId", "title slug");
  },
};
