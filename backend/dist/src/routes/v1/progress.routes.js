"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressRouter = void 0;
const express_1 = require("express");
const progress_controller_1 = require("../../controllers/progress.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_1 = require("../../middleware/validate");
const course_validators_1 = require("../../validators/course.validators");
exports.progressRouter = (0, express_1.Router)();
/**
 * @openapi
 * /progress/dashboard:
 *   get:
 *     summary: Get the current user's cross-course dashboard summary
 *     tags: [Progress]
 *     responses:
 *       200: { description: Dashboard summary }
 */
exports.progressRouter.get("/dashboard", auth_middleware_1.protect, progress_controller_1.progressController.getDashboard);
/**
 * @openapi
 * /progress/{slug}:
 *   get:
 *     summary: Get the current user's progress for one course
 *     tags: [Progress]
 *     responses:
 *       200: { description: Course progress summary }
 */
exports.progressRouter.get("/:slug", auth_middleware_1.protect, (0, validate_1.validate)(course_validators_1.courseSlugParamSchema, "params"), progress_controller_1.progressController.getForCourse);
//# sourceMappingURL=progress.routes.js.map