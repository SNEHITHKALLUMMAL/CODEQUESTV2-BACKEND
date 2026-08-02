"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.topicRouter = void 0;
const express_1 = require("express");
const course_controller_1 = require("../../controllers/course.controller");
const note_controller_1 = require("../../controllers/note.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_1 = require("../../middleware/validate");
const course_validators_1 = require("../../validators/course.validators");
exports.topicRouter = (0, express_1.Router)();
/**
 * @openapi
 * /topics/search:
 *   get:
 *     summary: Full-text search across topic titles, summaries, and content
 *     tags: [Topics]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Search results }
 */
exports.topicRouter.get("/search", (0, validate_1.validate)(course_validators_1.searchQuerySchema, "query"), course_controller_1.topicController.search);
/**
 * @openapi
 * /topics/{id}:
 *   get:
 *     summary: Get a topic's lesson content, navigation, and (if authenticated) progress/notes
 *     tags: [Topics]
 *     security: []
 *     responses:
 *       200: { description: Topic detail }
 *       404: { description: Topic not found }
 */
exports.topicRouter.get("/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), auth_middleware_1.attachUserIfPresent, course_controller_1.topicController.getById);
/**
 * @openapi
 * /topics/{id}/complete:
 *   post:
 *     summary: Mark a topic as completed for the current user
 *     tags: [Topics]
 *     responses:
 *       200: { description: Progress updated }
 */
exports.topicRouter.post("/:id/complete", auth_middleware_1.protect, (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), course_controller_1.topicController.complete);
/**
 * @openapi
 * /topics/{id}/note:
 *   put:
 *     summary: Create/update a note and/or bookmark for a topic
 *     tags: [Topics]
 *     responses:
 *       200: { description: Note saved }
 *   delete:
 *     summary: Remove the note/bookmark for a topic
 *     tags: [Topics]
 *     responses:
 *       204: { description: Note removed }
 */
exports.topicRouter.put("/:id/note", auth_middleware_1.protect, (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), (0, validate_1.validate)(course_validators_1.upsertNoteSchema), (req, _res, next) => {
    req.params.topicId = req.params.id;
    next();
}, note_controller_1.noteController.upsert);
exports.topicRouter.delete("/:id/note", auth_middleware_1.protect, (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), (req, _res, next) => {
    req.params.topicId = req.params.id;
    next();
}, note_controller_1.noteController.remove);
//# sourceMappingURL=topic.routes.js.map