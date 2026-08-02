"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettingsSchema = exports.adminQuizUpdateSchema = exports.adminQuizSchema = exports.adminPracticalUpdateSchema = exports.adminPracticalSchema = exports.adminTopicUpdateSchema = exports.adminTopicSchema = exports.adminModuleUpdateSchema = exports.adminModuleSchema = exports.adminCourseUpdateSchema = exports.adminCourseSchema = exports.updateUserStatusSchema = exports.updateUserRoleSchema = exports.adminListUsersQuerySchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../shared/types/enums");
const objectId = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
exports.adminListUsersQuerySchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).optional(),
    limit: zod_1.z.string().regex(/^\d+$/).optional(),
    search: zod_1.z.string().trim().optional(),
    role: zod_1.z.enum(Object.values(enums_1.UserRole)).optional(),
});
exports.updateUserRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(Object.values(enums_1.UserRole)),
});
exports.updateUserStatusSchema = zod_1.z.object({
    isActive: zod_1.z.boolean(),
});
exports.adminCourseSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(2).max(120),
    slug: zod_1.z.enum(["html", "css"]),
    description: zod_1.z.string().trim().min(10).max(1000),
    order: zod_1.z.number().int().min(0).optional(),
    isPublished: zod_1.z.boolean().optional(),
});
exports.adminCourseUpdateSchema = exports.adminCourseSchema.partial();
exports.adminModuleSchema = zod_1.z.object({
    courseId: objectId,
    title: zod_1.z.string().trim().min(2).max(150),
    slug: zod_1.z.string().trim().min(2).max(150),
    description: zod_1.z.string().max(500).optional(),
    order: zod_1.z.number().int().min(0).optional(),
    importance: zod_1.z.enum(Object.values(enums_1.ImportanceLevel)).optional(),
    isPublished: zod_1.z.boolean().optional(),
});
exports.adminModuleUpdateSchema = exports.adminModuleSchema.partial();
const codeExampleSchema = zod_1.z.object({
    label: zod_1.z.string().min(1),
    html: zod_1.z.string().optional(),
    css: zod_1.z.string().optional(),
    js: zod_1.z.string().optional(),
});
exports.adminTopicSchema = zod_1.z.object({
    moduleId: objectId,
    courseId: objectId,
    title: zod_1.z.string().trim().min(2).max(150),
    slug: zod_1.z.string().trim().min(2).max(150),
    summary: zod_1.z.string().max(300).optional(),
    content: zod_1.z.string().min(1),
    codeExamples: zod_1.z.array(codeExampleSchema).optional(),
    order: zod_1.z.number().int().min(0).optional(),
    estimatedMinutes: zod_1.z.number().int().min(1).max(120).optional(),
    isPublished: zod_1.z.boolean().optional(),
});
exports.adminTopicUpdateSchema = exports.adminTopicSchema.partial();
const starterCodeSchema = zod_1.z.object({
    html: zod_1.z.string().optional(),
    css: zod_1.z.string().optional(),
    js: zod_1.z.string().optional(),
});
exports.adminPracticalSchema = zod_1.z.object({
    moduleId: objectId,
    courseId: objectId,
    topicId: objectId.optional().nullable(),
    title: zod_1.z.string().trim().min(2).max(150),
    slug: zod_1.z.string().trim().min(2).max(150),
    instructions: zod_1.z.string().min(1),
    starterCode: starterCodeSchema.optional(),
    order: zod_1.z.number().int().min(0).optional(),
    isPublished: zod_1.z.boolean().optional(),
});
exports.adminPracticalUpdateSchema = exports.adminPracticalSchema.partial();
const quizQuestionSchema = zod_1.z.object({
    type: zod_1.z.enum(Object.values(enums_1.QuestionType)),
    question: zod_1.z.string().min(1),
    options: zod_1.z.array(zod_1.z.string()).default([]),
    correctAnswer: zod_1.z.string().min(1),
    explanation: zod_1.z.string().optional(),
    points: zod_1.z.number().int().min(1).optional(),
});
exports.adminQuizSchema = zod_1.z.object({
    moduleId: objectId,
    courseId: objectId,
    title: zod_1.z.string().trim().min(2).max(150),
    passingScorePercent: zod_1.z.number().int().min(0).max(100).optional(),
    questions: zod_1.z.array(quizQuestionSchema).min(1),
    isPublished: zod_1.z.boolean().optional(),
});
exports.adminQuizUpdateSchema = exports.adminQuizSchema.partial();
exports.updateSettingsSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.string());
//# sourceMappingURL=admin.validators.js.map