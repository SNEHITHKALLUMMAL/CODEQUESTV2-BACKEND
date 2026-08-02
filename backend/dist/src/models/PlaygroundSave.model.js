"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaygroundSave = void 0;
const mongoose_1 = require("mongoose");
const playgroundSaveSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    practicalId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Practical", required: true, index: true },
    code: {
        html: { type: String, default: "" },
        css: { type: String, default: "" },
        js: { type: String, default: "" },
    },
}, { timestamps: true });
// One saved snapshot per user per practical; autosave upserts this document.
playgroundSaveSchema.index({ userId: 1, practicalId: 1 }, { unique: true });
exports.PlaygroundSave = (0, mongoose_1.model)("PlaygroundSave", playgroundSaveSchema);
//# sourceMappingURL=PlaygroundSave.model.js.map