import { Router } from "express";
import { noteController } from "../../controllers/note.controller";
import { protect } from "../../middleware/auth.middleware";

export const noteRouter = Router();

noteRouter.get("/bookmarks", protect, noteController.listBookmarks);
noteRouter.get("/", protect, noteController.listNotes);
