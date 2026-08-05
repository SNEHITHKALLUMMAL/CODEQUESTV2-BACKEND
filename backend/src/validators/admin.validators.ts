import { z } from "zod";
import { UserRole, ImportanceLevel, QuestionType } from "../../shared/types/enums";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const adminListUsersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  search: z.string().trim().optional(),
  role: z.enum(Object.values(UserRole) as [string, ...string[]]).optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(Object.values(UserRole) as [string, ...string[]]),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

export const adminCourseSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.enum(["html", "css"]),
  description: z.string().trim().min(10).max(1000),
  order: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
});
export const adminCourseUpdateSchema = adminCourseSchema.partial();

export const adminModuleSchema = z.object({
  courseId: objectId,
  title: z.string().trim().min(2).max(150),
  slug: z.string().trim().min(2).max(150),
  description: z.string().max(500).optional(),
  order: z.number().int().min(0).optional(),
  importance: z.enum(Object.values(ImportanceLevel) as [string, ...string[]]).optional(),
  isPublished: z.boolean().optional(),
});
export const adminModuleUpdateSchema = adminModuleSchema.partial();

const codeExampleSchema = z.object({
  label: z.string().min(1),
  html: z.string().optional(),
  css: z.string().optional(),
  js: z.string().optional(),
});

export const adminTopicSchema = z.object({
  moduleId: objectId,
  courseId: objectId,
  title: z.string().trim().min(2).max(150),
  slug: z.string().trim().min(2).max(150),
  summary: z.string().max(300).optional(),
  content: z.string().min(1),
  codeExamples: z.array(codeExampleSchema).optional(),
  order: z.number().int().min(0).optional(),
  estimatedMinutes: z.number().int().min(1).max(120).optional(),
  isPublished: z.boolean().optional(),
});
export const adminTopicUpdateSchema = adminTopicSchema.partial();

const starterCodeSchema = z.object({
  html: z.string().optional(),
  css: z.string().optional(),
  js: z.string().optional(),
});

export const adminPracticalSchema = z.object({
  moduleId: objectId,
  courseId: objectId,
  topicId: objectId.optional().nullable(),
  title: z.string().trim().min(2).max(150),
  slug: z.string().trim().min(2).max(150),
  instructions: z.string().min(1),
  starterCode: starterCodeSchema.optional(),
  order: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
});
export const adminPracticalUpdateSchema = adminPracticalSchema.partial();

const quizQuestionSchema = z.object({
  type: z.enum(Object.values(QuestionType) as [string, ...string[]]),
  question: z.string().min(1),
  options: z.array(z.string()).default([]),
  correctAnswer: z.string().min(1),
  explanation: z.string().optional(),
  points: z.number().int().min(1).optional(),
});

export const adminQuizSchema = z.object({
  moduleId: objectId,
  courseId: objectId,
  title: z.string().trim().min(2).max(150),
  passingScorePercent: z.number().int().min(0).max(100).optional(),
  questions: z.array(quizQuestionSchema).min(1),
  isPublished: z.boolean().optional(),
});
export const adminQuizUpdateSchema = adminQuizSchema.partial();

export const updateSettingsSchema = z.record(z.string(), z.string());
