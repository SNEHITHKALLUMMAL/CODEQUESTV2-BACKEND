"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const admin_controller_1 = require("../../../controllers/admin.controller");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const validate_1 = require("../../../middleware/validate");
const upload_middleware_1 = require("../../../middleware/upload.middleware");
const enums_1 = require("../../../../shared/types/enums");
const admin_validators_1 = require("../../../validators/admin.validators");
const course_validators_1 = require("../../../validators/course.validators");
exports.adminRouter = (0, express_1.Router)();
// Every route below requires a valid access token AND the admin role.
exports.adminRouter.use(auth_middleware_1.protect, (0, auth_middleware_1.authorize)(enums_1.UserRole.ADMIN));
// ---------- Analytics ----------
exports.adminRouter.get("/analytics/overview", admin_controller_1.adminAnalyticsController.overview);
exports.adminRouter.get("/analytics/course-completion", admin_controller_1.adminAnalyticsController.courseCompletion);
// ---------- Users ----------
exports.adminRouter.get("/users", (0, validate_1.validate)(admin_validators_1.adminListUsersQuerySchema, "query"), admin_controller_1.adminUserController.list);
exports.adminRouter.get("/users/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), admin_controller_1.adminUserController.getById);
exports.adminRouter.patch("/users/:id/role", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), (0, validate_1.validate)(admin_validators_1.updateUserRoleSchema), admin_controller_1.adminUserController.updateRole);
exports.adminRouter.patch("/users/:id/status", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), (0, validate_1.validate)(admin_validators_1.updateUserStatusSchema), admin_controller_1.adminUserController.updateStatus);
// ---------- Courses ----------
exports.adminRouter.get("/courses", admin_controller_1.adminCourseController.list);
exports.adminRouter.post("/courses", (0, validate_1.validate)(admin_validators_1.adminCourseSchema), admin_controller_1.adminCourseController.create);
exports.adminRouter.patch("/courses/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), (0, validate_1.validate)(admin_validators_1.adminCourseUpdateSchema), admin_controller_1.adminCourseController.update);
exports.adminRouter.delete("/courses/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), admin_controller_1.adminCourseController.remove);
// ---------- Modules ----------
exports.adminRouter.get("/modules", admin_controller_1.adminModuleController.list);
exports.adminRouter.post("/modules", (0, validate_1.validate)(admin_validators_1.adminModuleSchema), admin_controller_1.adminModuleController.create);
exports.adminRouter.patch("/modules/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), (0, validate_1.validate)(admin_validators_1.adminModuleUpdateSchema), admin_controller_1.adminModuleController.update);
exports.adminRouter.delete("/modules/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), admin_controller_1.adminModuleController.remove);
// ---------- Topics ----------
exports.adminRouter.get("/topics", admin_controller_1.adminTopicController.list);
exports.adminRouter.get("/topics/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), admin_controller_1.adminTopicController.getById);
exports.adminRouter.post("/topics", (0, validate_1.validate)(admin_validators_1.adminTopicSchema), admin_controller_1.adminTopicController.create);
exports.adminRouter.patch("/topics/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), (0, validate_1.validate)(admin_validators_1.adminTopicUpdateSchema), admin_controller_1.adminTopicController.update);
exports.adminRouter.delete("/topics/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), admin_controller_1.adminTopicController.remove);
// ---------- Practicals ----------
exports.adminRouter.get("/practicals", admin_controller_1.adminPracticalController.list);
exports.adminRouter.post("/practicals", (0, validate_1.validate)(admin_validators_1.adminPracticalSchema), admin_controller_1.adminPracticalController.create);
exports.adminRouter.patch("/practicals/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), (0, validate_1.validate)(admin_validators_1.adminPracticalUpdateSchema), admin_controller_1.adminPracticalController.update);
exports.adminRouter.delete("/practicals/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), admin_controller_1.adminPracticalController.remove);
// ---------- Quizzes ----------
exports.adminRouter.get("/quizzes", admin_controller_1.adminQuizController.list);
exports.adminRouter.post("/quizzes", (0, validate_1.validate)(admin_validators_1.adminQuizSchema), admin_controller_1.adminQuizController.create);
exports.adminRouter.patch("/quizzes/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), (0, validate_1.validate)(admin_validators_1.adminQuizUpdateSchema), admin_controller_1.adminQuizController.update);
exports.adminRouter.delete("/quizzes/:id", (0, validate_1.validate)(course_validators_1.idParamSchema, "params"), admin_controller_1.adminQuizController.remove);
// ---------- Settings ----------
exports.adminRouter.get("/settings", admin_controller_1.adminSettingsController.get);
exports.adminRouter.put("/settings", (0, validate_1.validate)(admin_validators_1.updateSettingsSchema), admin_controller_1.adminSettingsController.update);
// ---------- Media ----------
exports.adminRouter.post("/media/upload", upload_middleware_1.uploadImage, admin_controller_1.adminMediaController.upload);
//# sourceMappingURL=index.js.map