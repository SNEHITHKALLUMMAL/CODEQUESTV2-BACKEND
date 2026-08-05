import { Router } from "express";
import { progressController } from "../../controllers/progress.controller";
import { protect } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate";
import { courseSlugParamSchema } from "../../validators/course.validators";

export const progressRouter = Router();

progressRouter.get("/dashboard", protect, progressController.getDashboard);
progressRouter.get("/:slug", protect, validate(courseSlugParamSchema, "params"), progressController.getForCourse);
