"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const mongoose_1 = require("mongoose");
const noteSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    topicId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Topic", required: true, index: true },
    text: { type: String, default: "", maxlength: 5000 },
    isBookmarked: { type: Boolean, default: false },
}, { timestamps: true });
noteSchema.index({ userId: 1, topicId: 1 }, { unique: true });
noteSchema.index({ userId: 1, isBookmarked: 1 });
exports.Note = (0, mongoose_1.model)("Note", noteSchema);
//# sourceMappingURL=Note.model.js.map