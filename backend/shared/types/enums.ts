// Shared across backend (Mongoose enums) and frontend (TS unions).
// Keep this file framework-agnostic — plain TS only.

export const UserRole = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const CourseSlug = {
  HTML: "html",
  CSS: "css",
} as const;
export type CourseSlug = (typeof CourseSlug)[keyof typeof CourseSlug];

export const ImportanceLevel = {
  STANDARD: "standard",
  IMPORTANT: "important",
  CRITICAL: "critical",
} as const;
export type ImportanceLevel = (typeof ImportanceLevel)[keyof typeof ImportanceLevel];

export const ProgressStatus = {
  NOT_STARTED: "not-started",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
} as const;
export type ProgressStatus = (typeof ProgressStatus)[keyof typeof ProgressStatus];

export const QuestionType = {
  MCQ: "mcq",
  FILL_BLANK: "fill-blank",
} as const;
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export const EntityType = {
  MODULE: "module",
  TOPIC: "topic",
} as const;
export type EntityType = (typeof EntityType)[keyof typeof EntityType];
