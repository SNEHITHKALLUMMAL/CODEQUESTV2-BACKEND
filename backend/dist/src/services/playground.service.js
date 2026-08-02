"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playgroundService = void 0;
const PlaygroundSave_model_1 = require("../models/PlaygroundSave.model");
const Practical_model_1 = require("../models/Practical.model");
const ApiError_1 = require("../utils/ApiError");
exports.playgroundService = {
    async save(userId, practicalId, code) {
        const practical = await Practical_model_1.Practical.findById(practicalId);
        if (!practical)
            throw ApiError_1.ApiError.notFound("Practical exercise not found");
        return PlaygroundSave_model_1.PlaygroundSave.findOneAndUpdate({ userId, practicalId }, { $set: { code, userId, practicalId } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    },
    async get(userId, practicalId) {
        return PlaygroundSave_model_1.PlaygroundSave.findOne({ userId, practicalId });
    },
    async reset(userId, practicalId) {
        await PlaygroundSave_model_1.PlaygroundSave.findOneAndDelete({ userId, practicalId });
    },
};
//# sourceMappingURL=playground.service.js.map