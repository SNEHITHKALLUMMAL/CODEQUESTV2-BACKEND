import { Router } from "express";
import { practicalController } from "../../controllers/course.controller";
import { playgroundController } from "../../controllers/playground.controller";
import { protect } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";
import { idParamSchema, savePlaygroundSchema } from "../../validators/course.validators";

export const practicalRouter = Router();

practicalRouter.get("/:id", validate(idParamSchema, "params"), practicalController.getById);
practicalRouter.get("/:practicalId/playground", protect, playgroundController.get);
practicalRouter.put("/:practicalId/playground", protect, validate(savePlaygroundSchema), playgroundController.save);
practicalRouter.delete("/:practicalId/playground", protect, playgroundController.reset);
