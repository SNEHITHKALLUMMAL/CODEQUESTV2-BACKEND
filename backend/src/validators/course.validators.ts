import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const listQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().min(2, "Search query must be at least 2 characters"),
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});

export const idParamSchema = z.object({
  id: objectId,
});
export type IdParam = z.infer<typeof idParamSchema>;

export const quizIdParamSchema = z.object({
  quizId: objectId,
});

export const moduleIdParamSchema = z.object({
  moduleId: objectId,
});

export const courseSlugParamSchema = z.object({
  slug: z.enum(["html", "css"]),
});

export const upsertNoteSchema = z.object({
  text: z.string().max(5000).optional().default(""),
  isBookmarked: z.boolean().optional(),
});
export type UpsertNoteInput = z.infer<typeof upsertNoteSchema>;

export const savePlaygroundSchema = z.object({
  html: z.string().max(50_000).optional().default(""),
  css: z.string().max(50_000).optional().default(""),
  js: z.string().max(50_000).optional().default(""),
});
export type SavePlaygroundInput = z.infer<typeof savePlaygroundSchema>;

export const submitQuizSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: objectId,
        submittedAnswer: z.string().min(1),
      })
    )
    .min(1, "At least one answer is required"),
  durationSeconds: z.number().int().min(0).max(24 * 60 * 60).optional().default(0),
});
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
