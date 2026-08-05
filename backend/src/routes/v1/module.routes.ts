import { Router } from "express";
import { moduleController } from "../../controllers/course.controller";
import { validate } from "../../middleware/validate";
import { idParamSchema } from "../../validators/course.validators";

export const moduleRouter = Router();

moduleRouter.get("/:id", validate(idParamSchema, "params"), moduleController.getById);
