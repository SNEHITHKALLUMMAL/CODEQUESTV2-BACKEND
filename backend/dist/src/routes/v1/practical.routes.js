"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.practicalRouter = void 0;
const express_1 = require("express");
const course_controller_1 = require("../../controllers/course.controller");
const playground_controller_1 = require("../../controllers/playground.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_1 = require("../../middleware/validate");
const course_validators_1 = require("../../validators/course.validators");
exports.practicalRouter = (0, express_1.Router)();
/**
 * @openapi
 * /practicals/{id}:
 *   get:
 *     summary: Get a practical exercise with its starter code
 *     tags: [Practicals]
 *     security: []
 *     responses:
 *       200: { description: Practical detail }
 *       404: { description: Practical not found }
 */
exports.practicalRouter.get("/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), course_controller_1.practicalController.getById);
/**
 * @openapi
 * /practicals/{id}/playground:
 *   get:
 *     summary: Get the current user's autosaved code for this practical
 *     tags: [Playground]
 *     responses:
 *       200: { description: Saved code, or null if never saved }
 *   put:
 *     summary: Autosave the current user's code for this practical
 *     tags: [Playground]
 *     responses:
 *       200: { description: Saved }
 *   delete:
 *     summary: Reset (delete) the saved code, reverting to starter code
 *     tags: [Playground]
 *     responses:
 *       204: { description: Reset }
 */
exports.practicalRouter.get("/:practicalId/playground", auth_middleware_1.protect, playground_controller_1.playgroundController.get);
exports.practicalRouter.put("/:practicalId/playground", auth_middleware_1.protect, (0, validate_1.validate)(course_validators_1.savePlaygroundSchema), playground_controller_1.playgroundController.save);
exports.practicalRouter.delete("/:practicalId/playground", auth_middleware_1.protect, playground_controller_1.playgroundController.reset);
//# sourceMappingURL=practical.routes.js.map