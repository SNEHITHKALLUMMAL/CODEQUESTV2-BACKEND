import { Router } from "express";
import {
  adminUserController,
  adminCourseController,
  adminModuleController,
  adminTopicController,
  adminPracticalController,
  adminQuizController,
  adminAnalyticsController,
  adminSettingsController,
  adminMediaController,
} from "../../../controllers/admin.controller";
import { protect, authorize } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validate";
import { uploadImage } from "../../../middleware/upload.middleware";
import { UserRole } from "../../../../shared/types/enums";
import {
  adminListUsersQuerySchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  adminCourseSchema,
  adminCourseUpdateSchema,
  adminModuleSchema,
  adminModuleUpdateSchema,
  adminTopicSchema,
  adminTopicUpdateSchema,
  adminPracticalSchema,
  adminPracticalUpdateSchema,
  adminQuizSchema,
  adminQuizUpdateSchema,
  updateSettingsSchema,
} from "../../../validators/admin.validators";
import { idParamSchema } from "../../../validators/course.validators";

export const adminRouter = Router();

adminRouter.use(protect, authorize(UserRole.ADMIN));

adminRouter.get("/analytics/overview", adminAnalyticsController.overview);
adminRouter.get("/analytics/course-completion", adminAnalyticsController.courseCompletion);

adminRouter.get("/users", validate(adminListUsersQuerySchema, "query"), adminUserController.list);
adminRouter.get("/users/:id", validate(idParamSchema, "params"), adminUserController.getById);
adminRouter.patch(
  "/users/:id/role",
  validate(idParamSchema, "params"),
  validate(updateUserRoleSchema),
  adminUserController.updateRole
);
adminRouter.patch(
  "/users/:id/status",
  validate(idParamSchema, "params"),
  validate(updateUserStatusSchema),
  adminUserController.updateStatus
);

adminRouter.get("/courses", adminCourseController.list);
adminRouter.post("/courses", validate(adminCourseSchema), adminCourseController.create);
adminRouter.patch(
  "/courses/:id",
  validate(idParamSchema, "params"),
  validate(adminCourseUpdateSchema),
  adminCourseController.update
);
adminRouter.delete("/courses/:id", validate(idParamSchema, "params"), adminCourseController.remove);

adminRouter.get("/modules", adminModuleController.list);
adminRouter.post("/modules", validate(adminModuleSchema), adminModuleController.create);
adminRouter.patch(
  "/modules/:id",
  validate(idParamSchema, "params"),
  validate(adminModuleUpdateSchema),
  adminModuleController.update
);
adminRouter.delete("/modules/:id", validate(idParamSchema, "params"), adminModuleController.remove);

adminRouter.get("/topics", adminTopicController.list);
adminRouter.get("/topics/:id", validate(idParamSchema, "params"), adminTopicController.getById);
adminRouter.post("/topics", validate(adminTopicSchema), adminTopicController.create);
adminRouter.patch(
  "/topics/:id",
  validate(idParamSchema, "params"),
  validate(adminTopicUpdateSchema),
  adminTopicController.update
);
adminRouter.delete("/topics/:id", validate(idParamSchema, "params"), adminTopicController.remove);

adminRouter.get("/practicals", adminPracticalController.list);
adminRouter.post("/practicals", validate(adminPracticalSchema), adminPracticalController.create);
adminRouter.patch(
  "/practicals/:id",
  validate(idParamSchema, "params"),
  validate(adminPracticalUpdateSchema),
  adminPracticalController.update
);
adminRouter.delete("/practicals/:id", validate(idParamSchema, "params"), adminPracticalController.remove);

adminRouter.get("/quizzes", adminQuizController.list);
adminRouter.post("/quizzes", validate(adminQuizSchema), adminQuizController.create);
adminRouter.patch(
  "/quizzes/:id",
  validate(idParamSchema, "params"),
  validate(adminQuizUpdateSchema),
  adminQuizController.update
);
adminRouter.delete("/quizzes/:id", validate(idParamSchema, "params"), adminQuizController.remove);

adminRouter.get("/settings", adminSettingsController.get);
adminRouter.put("/settings", validate(updateSettingsSchema), adminSettingsController.update);

adminRouter.post("/media/upload", uploadImage, adminMediaController.upload);
