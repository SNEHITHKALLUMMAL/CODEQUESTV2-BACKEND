"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../../shared/types/enums");
const courseSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, enum: Object.values(enums_1.CourseSlug), required: true, unique: true },
    description: { type: String, required: true, maxlength: 1000 },
    iconUrl: { type: String, default: null },
    order: { type: Number, required: true, default: 0 },
    isPublished: { type: Boolean, default: true },
    moduleCount: { type: Number, default: 0 },
}, { timestamps: true });
courseSchema.index({ order: 1 });
exports.Course = (0, mongoose_1.model)("Course", courseSchema);
//# sourceMappingURL=Course.model.js.map