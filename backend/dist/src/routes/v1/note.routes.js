"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteRouter = void 0;
const express_1 = require("express");
const note_controller_1 = require("../../controllers/note.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
exports.noteRouter = (0, express_1.Router)();
/**
 * @openapi
 * /notes/bookmarks:
 *   get:
 *     summary: List all topics the current user has bookmarked
 *     tags: [Notes]
 *     responses:
 *       200: { description: Bookmarked topics }
 */
exports.noteRouter.get("/bookmarks", auth_middleware_1.protect, note_controller_1.noteController.listBookmarks);
/**
 * @openapi
 * /notes:
 *   get:
 *     summary: List all of the current user's non-empty notes
 *     tags: [Notes]
 *     responses:
 *       200: { description: Notes }
 */
exports.noteRouter.get("/", auth_middleware_1.protect, note_controller_1.noteController.listNotes);
//# sourceMappingURL=note.routes.js.map