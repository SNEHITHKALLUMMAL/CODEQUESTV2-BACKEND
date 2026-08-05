import { Router } from "express";
import { quizController } from "../../controllers/quiz.controller";
import { protect } from "../../middleware/auth.middleware";
import { quizSubmitLimiter } from "../../middleware/rateLimiter";
import { validate } from "../../middleware/validate";
import { quizIdParamSchema, moduleIdParamSchema, submitQuizSchema } from "../../validators/course.validators";

export const quizRouter = Router();

quizRouter.get("/module/:moduleId", validate(moduleIdParamSchema, "params"), quizController.getForModule);
quizRouter.post(
  "/:quizId/submit",
  protect,
  quizSubmitLimiter,
  validate(quizIdParamSchema, "params"),
  validate(submitQuizSchema),
  quizController.submit
);
quizRouter.get("/:quizId/attempts", protect, validate(quizIdParamSchema, "params"), quizController.getAttempts);
quizRouter.get("/:quizId/best", protect, validate(quizIdParamSchema, "params"), quizController.getBest);
