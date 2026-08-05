import { Router } from "express";
import { healthRouter } from "./health.routes";
import { authRouter } from "./auth.routes";
import { courseRouter } from "./course.routes";
import { moduleRouter } from "./module.routes";
import { topicRouter } from "./topic.routes";
import { practicalRouter } from "./practical.routes";
import { progressRouter } from "./progress.routes";
import { noteRouter } from "./note.routes";
import { certificateRouter } from "./certificate.routes";
import { quizRouter } from "./quiz.routes";
import { adminRouter } from "./admin/index";

export const v1Router = Router();

v1Router.use("/health", healthRouter);
v1Router.use("/auth", authRouter);
v1Router.use("/courses", courseRouter);
v1Router.use("/modules", moduleRouter);
v1Router.use("/topics", topicRouter);
v1Router.use("/practicals", practicalRouter);
v1Router.use("/progress", progressRouter);
v1Router.use("/notes", noteRouter);
v1Router.use("/certificates", certificateRouter);
v1Router.use("/quizzes", quizRouter);
v1Router.use("/admin", adminRouter);
