"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleRouter = void 0;
const express_1 = require("express");
const course_controller_1 = require("../../controllers/course.controller");
const validate_1 = require("../../middleware/validate");
const course_validators_1 = require("../../validators/course.validators");
exports.moduleRouter = (0, express_1.Router)();
/**
 * @openapi
 * /modules/{id}:
 *   get:
 *     summary: Get a module with its topics, practicals, and quiz metadata
 *     tags: [Modules]
 *     security: []
 *     responses:
 *       200: { description: Module detail }
 *       404: { description: Module not found }
 */
exports.moduleRouter.get("/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), course_controller_1.moduleController.getById);
//# sourceMappingURL=module.routes.js.map