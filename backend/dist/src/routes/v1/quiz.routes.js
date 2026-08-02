"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizRouter = void 0;
const express_1 = require("express");
const quiz_controller_1 = require("../../controllers/quiz.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const validate_1 = require("../../middleware/validate");
const course_validators_1 = require("../../validators/course.validators");
exports.quizRouter = (0, express_1.Router)();
/**
 * @openapi
 * /quizzes/module/{moduleId}:
 *   get:
 *     summary: Get a module's quiz with questions (correct answers stripped)
 *     tags: [Quizzes]
 *     security: []
 *     responses:
 *       200: { description: Quiz ready to attempt }
 *       404: { description: No quiz for this module }
 */
exports.quizRouter.get("/module/:moduleId", (0, validate_1.validate)(course_validators_1.moduleIdParamSchema, "params"), quiz_controller_1.quizController.getForModule);
/**
 * @openapi
 * /quizzes/{quizId}/submit:
 *   post:
 *     summary: Submit answers for grading
 *     tags: [Quizzes]
 *     responses:
 *       200: { description: Graded result with per-question feedback }
 *       400: { description: Answer count mismatch or invalid question id }
 */
exports.quizRouter.post("/:quizId/submit", auth_middleware_1.protect, rateLimiter_1.quizSubmitLimiter, (0, validate_1.validate)(course_validators_1.quizIdParamSchema, "params"), (0, validate_1.validate)(course_validators_1.submitQuizSchema), quiz_controller_1.quizController.submit);
/**
 * @openapi
 * /quizzes/{quizId}/attempts:
 *   get:
 *     summary: List the current user's attempts for this quiz, most recent first
 *     tags: [Quizzes]
 *     responses:
 *       200: { description: Attempt history }
 */
exports.quizRouter.get("/:quizId/attempts", auth_middleware_1.protect, (0, validate_1.validate)(course_validators_1.quizIdParamSchema, "params"), quiz_controller_1.quizController.getAttempts);
/**
 * @openapi
 * /quizzes/{quizId}/best:
 *   get:
 *     summary: Get the current user's best attempt and total attempt count
 *     tags: [Quizzes]
 *     responses:
 *       200: { description: Best attempt summary }
 */
exports.quizRouter.get("/:quizId/best", auth_middleware_1.protect, (0, validate_1.validate)(course_validators_1.quizIdParamSchema, "params"), quiz_controller_1.quizController.getBest);
//# sourceMappingURL=quiz.routes.js.map