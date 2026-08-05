import { Router } from "express";
import { courseController } from "../../controllers/course.controller";
import { attachUserIfPresent } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";
import { courseSlugParamSchema } from "../../validators/course.validators";

export const courseRouter = Router();

courseRouter.get("/", courseController.list);
courseRouter.get("/:slug", validate(courseSlugParamSchema, "params"), attachUserIfPresent, courseController.getBySlug);
