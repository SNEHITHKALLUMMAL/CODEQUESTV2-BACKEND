"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitQuizSchema = exports.savePlaygroundSchema = exports.upsertNoteSchema = exports.courseSlugParamSchema = exports.moduleIdParamSchema = exports.quizIdParamSchema = exports.idParamSchema = exports.searchQuerySchema = exports.listQuerySchema = void 0;
const zod_1 = require("zod");
const objectId = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
exports.listQuerySchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).optional(),
    limit: zod_1.z.string().regex(/^\d+$/).optional(),
});
exports.searchQuerySchema = zod_1.z.object({
    q: zod_1.z.string().trim().min(2, "Search query must be at least 2 characters"),
    page: zod_1.z.string().regex(/^\d+$/).optional(),
    limit: zod_1.z.string().regex(/^\d+$/).optional(),
});
exports.idParamSchema = zod_1.z.object({
    id: objectId,
});
exports.quizIdParamSchema = zod_1.z.object({
    quizId: objectId,
});
exports.moduleIdParamSchema = zod_1.z.object({
    moduleId: objectId,
});
exports.courseSlugParamSchema = zod_1.z.object({
    slug: zod_1.z.enum(["html", "css"]),
});
exports.upsertNoteSchema = zod_1.z.object({
    text: zod_1.z.string().max(5000).optional().default(""),
    isBookmarked: zod_1.z.boolean().optional(),
});
exports.savePlaygroundSchema = zod_1.z.object({
    html: zod_1.z.string().max(50_000).optional().default(""),
    css: zod_1.z.string().max(50_000).optional().default(""),
    js: zod_1.z.string().max(50_000).optional().default(""),
});
exports.submitQuizSchema = zod_1.z.object({
    answers: zod_1.z
        .array(zod_1.z.object({
        questionId: objectId,
        submittedAnswer: zod_1.z.string().min(1),
    }))
        .min(1, "At least one answer is required"),
    durationSeconds: zod_1.z.number().int().min(0).max(24 * 60 * 60).optional().default(0),
});
//# sourceMappingURL=course.validators.js.map