"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
const mongoose_1 = require("mongoose");
const codeExampleSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    html: { type: String, default: "" },
    css: { type: String, default: "" },
    js: { type: String, default: "" },
}, { _id: false });
const topicSchema = new mongoose_1.Schema({
    moduleId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Module", required: true, index: true },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    summary: { type: String, maxlength: 300, default: "" },
    content: { type: String, required: true },
    codeExamples: { type: [codeExampleSchema], default: [] },
    order: { type: Number, required: true, default: 0 },
    estimatedMinutes: { type: Number, default: 5 },
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });
topicSchema.index({ moduleId: 1, slug: 1 }, { unique: true });
topicSchema.index({ moduleId: 1, order: 1 });
// Full-text search across title/summary/content — backs FR-9.
topicSchema.index({ title: "text", summary: "text", content: "text" });
exports.Topic = (0, mongoose_1.model)("Topic", topicSchema);
//# sourceMappingURL=Topic.model.js.map