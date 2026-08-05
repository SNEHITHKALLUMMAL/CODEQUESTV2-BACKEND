import { Router } from "express";
import { topicController } from "../../controllers/course.controller";
import { noteController } from "../../controllers/note.controller";
import { protect, attachUserIfPresent } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";
import { idParamSchema, searchQuerySchema, upsertNoteSchema } from "../../validators/course.validators";

export const topicRouter = Router();

topicRouter.get("/search", validate(searchQuerySchema, "query"), topicController.search);
topicRouter.get("/:id", validate(idParamSchema, "params"), attachUserIfPresent, topicController.getById);
topicRouter.post("/:id/complete", protect, validate(idParamSchema, "params"), topicController.complete);

topicRouter.put(
  "/:id/note",
  protect,
  validate(idParamSchema, "params"),
  validate(upsertNoteSchema),
  (req, _res, next) => {
    req.params.topicId = req.params.id;
    next();
  },
  noteController.upsert
);
topicRouter.delete(
  "/:id/note",
  protect,
  validate(idParamSchema, "params"),
  (req, _res, next) => {
    req.params.topicId = req.params.id;
    next();
  },
  noteController.remove
);
