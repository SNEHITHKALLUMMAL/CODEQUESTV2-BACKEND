"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMediaController = exports.adminSettingsController = exports.adminAnalyticsController = exports.adminQuizController = exports.adminPracticalController = exports.adminTopicController = exports.adminModuleController = exports.adminCourseController = exports.adminUserController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const adminUser_service_1 = require("../services/adminUser.service");
const adminContent_service_1 = require("../services/adminContent.service");
const analytics_service_1 = require("../services/analytics.service");
const settings_service_1 = require("../services/settings.service");
const media_service_1 = require("../services/media.service");
const pagination_1 = require("../utils/pagination");
function requireAdmin(req) {
    if (!req.user)
        throw ApiError_1.ApiError.unauthorized();
    return req.user.id;
}
exports.adminUserController = {
    list: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        requireAdmin(req);
        const pagination = (0, pagination_1.parsePagination)(req);
        const { users, meta } = await adminUser_service_1.adminUserService.list(pagination, {
            search: req.query.search,
            role: req.query.role,
        });
        ApiResponse_1.ApiResponse.paginated(res, users, meta);
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        requireAdmin(req);
        const user = await adminUser_service_1.adminUserService.getById(req.params.id);
        ApiResponse_1.ApiResponse.ok(res, user);
    }),
    updateRole: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const adminId = requireAdmin(req);
        const user = await adminUser_service_1.adminUserService.updateRole(adminId, req.params.id, req.body.role);
        ApiResponse_1.ApiResponse.ok(res, user, "Role updated");
    }),
    updateStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const adminId = requireAdmin(req);
        const user = await adminUser_service_1.adminUserService.updateStatus(adminId, req.params.id, req.body.isActive);
        ApiResponse_1.ApiResponse.ok(res, user, req.body.isActive ? "User reactivated" : "User deactivated");
    }),
};
function makeCrudController(resource) {
    const service = adminContent_service_1.adminContentService[resource];
    return {
        list: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            requireAdmin(req);
            const filterKey = "moduleId" in req.query ? "moduleId" : "courseId";
            const filterValue = req.query[filterKey];
            const items = await service.list(filterValue);
            ApiResponse_1.ApiResponse.ok(res, items);
        }),
        create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            requireAdmin(req);
            const item = await service.create(req.body);
            ApiResponse_1.ApiResponse.created(res, item);
        }),
        update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            requireAdmin(req);
            const item = await service.update(req.params.id, req.body);
            ApiResponse_1.ApiResponse.ok(res, item, "Updated");
        }),
        remove: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            requireAdmin(req);
            await service.remove(req.params.id);
            ApiResponse_1.ApiResponse.noContent(res);
        }),
    };
}
exports.adminCourseController = makeCrudController("courses");
exports.adminModuleController = makeCrudController("modules");
exports.adminTopicController = {
    ...makeCrudController("topics"),
    getById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        requireAdmin(req);
        const topic = await adminContent_service_1.adminContentService.topics.getById(req.params.id);
        ApiResponse_1.ApiResponse.ok(res, topic);
    }),
};
exports.adminPracticalController = makeCrudController("practicals");
exports.adminQuizController = makeCrudController("quizzes");
exports.adminAnalyticsController = {
    overview: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        requireAdmin(req);
        const overview = await analytics_service_1.analyticsService.getOverview();
        ApiResponse_1.ApiResponse.ok(res, overview);
    }),
    courseCompletion: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        requireAdmin(req);
        const rates = await analytics_service_1.analyticsService.getCourseCompletionRates();
        ApiResponse_1.ApiResponse.ok(res, rates);
    }),
};
exports.adminSettingsController = {
    get: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        requireAdmin(req);
        const settings = await settings_service_1.settingsService.getAll();
        ApiResponse_1.ApiResponse.ok(res, settings);
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        requireAdmin(req);
        const settings = await settings_service_1.settingsService.updateMany(req.body);
        ApiResponse_1.ApiResponse.ok(res, settings, "Settings updated");
    }),
};
exports.adminMediaController = {
    upload: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        requireAdmin(req);
        if (!req.file)
            throw ApiError_1.ApiError.badRequest("No file uploaded");
        const result = await media_service_1.mediaService.uploadImage(req.file);
        ApiResponse_1.ApiResponse.ok(res, result, "Uploaded");
    }),
};
//# sourceMappingURL=admin.controller.js.map