"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Practical = void 0;
const mongoose_1 = require("mongoose");
const codeSchema = new mongoose_1.Schema({
    html: { type: String, default: "<!-- write your HTML here -->\n" },
    css: { type: String, default: "/* write your CSS here */\n" },
    js: { type: String, default: "// write your JavaScript here\n" },
}, { _id: false });
const practicalSchema = new mongoose_1.Schema({
    moduleId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Module", required: true, index: true },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    topicId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Topic", default: null },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    instructions: { type: String, required: true },
    starterCode: { type: codeSchema, default: () => ({}) },
    solutionCode: { type: codeSchema, select: false },
    order: { type: Number, required: true, default: 0 },
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });
practicalSchema.index({ moduleId: 1, slug: 1 }, { unique: true });
practicalSchema.index({ moduleId: 1, order: 1 });
exports.Practical = (0, mongoose_1.model)("Practical", practicalSchema);
//# sourceMappingURL=Practical.model.js.map