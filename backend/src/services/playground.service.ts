import { PlaygroundSave } from "../models/PlaygroundSave.model";
import { Practical } from "../models/Practical.model";
import { ApiError } from "../utils/ApiError";
import type { SavePlaygroundInput } from "../validators/course.validators";

export const playgroundService = {
  async save(userId: string, practicalId: string, code: SavePlaygroundInput) {
    const practical = await Practical.findById(practicalId);
    if (!practical) throw ApiError.notFound("Practical exercise not found");

    return PlaygroundSave.findOneAndUpdate(
      { userId, practicalId },
      { $set: { code, userId, practicalId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  },

  async get(userId: string, practicalId: string) {
    return PlaygroundSave.findOne({ userId, practicalId });
  },

  async reset(userId: string, practicalId: string) {
    await PlaygroundSave.findOneAndDelete({ userId, practicalId });
  },
};
