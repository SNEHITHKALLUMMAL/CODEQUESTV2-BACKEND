"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRouter = void 0;
const express_1 = require("express");
const course_controller_1 = require("../../controllers/course.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_1 = require("../../middleware/validate");
const course_validators_1 = require("../../validators/course.validators");
exports.courseRouter = (0, express_1.Router)();
/**
 * @openapi
 * /courses:
 *   get:
 *     summary: List all published courses (HTML, CSS)
 *     tags: [Courses]
 *     security: []
 *     responses:
 *       200: { description: List of courses }
 */
exports.courseRouter.get("/", course_controller_1.courseController.list);
/**
 * @openapi
 * /courses/{slug}:
 *   get:
 *     summary: Get a course with its ordered modules (progress included if authenticated)
 *     tags: [Courses]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string, enum: [html, css] }
 *     responses:
 *       200: { description: Course detail }
 *       404: { description: Course not found }
 */
exports.courseRouter.get("/:slug", (0, validate_1.validate)(course_validators_1.courseSlugParamSchema, "params"), auth_middleware_1.attachUserIfPresent, course_controller_1.courseController.getBySlug);
//# sourceMappingURL=course.routes.js.map