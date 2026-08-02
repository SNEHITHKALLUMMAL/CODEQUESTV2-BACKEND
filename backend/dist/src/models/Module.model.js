"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../../shared/types/enums");
const moduleSchema = new mongoose_1.Schema({
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, maxlength: 500, default: "" },
    order: { type: Number, required: true, default: 0 },
    importance: {
        type: String,
        enum: Object.values(enums_1.ImportanceLevel),
        default: enums_1.ImportanceLevel.STANDARD,
    },
    topicCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });
// A module's slug must be unique within its course, and modules of a course
// are always listed ordered — both are hot paths, so both are indexed.
moduleSchema.index({ courseId: 1, slug: 1 }, { unique: true });
moduleSchema.index({ courseId: 1, order: 1 });
exports.Module = (0, mongoose_1.model)("Module", moduleSchema);
//# sourceMappingURL=Module.model.js.map