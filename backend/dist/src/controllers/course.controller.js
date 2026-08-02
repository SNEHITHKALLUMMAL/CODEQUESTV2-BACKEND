"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.practicalController = exports.topicController = exports.moduleController = exports.courseController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const course_service_1 = require("../services/course.service");
const progress_service_1 = require("../services/progress.service");
const pagination_1 = require("../utils/pagination");
const enums_1 = require("../../shared/types/enums");
exports.courseController = {
    list: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const courses = await course_service_1.courseService.listCourses();
        ApiResponse_1.ApiResponse.ok(res, courses);
    }),
    getBySlug: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { course, modules } = await course_service_1.courseService.getCourseBySlug(req.params.slug);
        let progressByModule = {};
        if (req.user) {
            const summary = await progress_service_1.progressService.getCourseProgress(req.user.id, req.params.slug);
            progressByModule = Object.fromEntries(summary.modules.map((m) => [m.moduleId, { percent: m.percent, completedCount: m.completedCount }]));
        }
        const modulesWithProgress = modules.map((m) => ({
            ...m.toObject(),
            progress: progressByModule[m._id.toString()] ?? null,
        }));
        ApiResponse_1.ApiResponse.ok(res, { course, modules: modulesWithProgress });
    }),
};
exports.moduleController = {
    getById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const data = await course_service_1.moduleService.getModuleById(req.params.id);
        ApiResponse_1.ApiResponse.ok(res, data);
    }),
};
exports.topicController = {
    getById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const data = await course_service_1.topicService.getTopicById(req.params.id, req.user?.id);
        // First view (no progress row yet, or still not-started) is recorded as in-progress,
        // so "continue learning" / dashboards have real recency data even before completion.
        if (req.user && (!data.progress || data.progress.status === enums_1.ProgressStatus.NOT_STARTED)) {
            await progress_service_1.progressService.setTopicStatus(req.user.id, req.params.id, enums_1.ProgressStatus.IN_PROGRESS);
            data.progress = { status: enums_1.ProgressStatus.IN_PROGRESS };
        }
        ApiResponse_1.ApiResponse.ok(res, data);
    }),
    complete: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const progress = await progress_service_1.progressService.setTopicStatus(req.user.id, req.params.id, enums_1.ProgressStatus.COMPLETED);
        ApiResponse_1.ApiResponse.ok(res, progress, "Topic marked as complete");
    }),
    search: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const pagination = (0, pagination_1.parsePagination)(req);
        const { results, total } = await course_service_1.topicService.search(String(req.query.q), pagination);
        ApiResponse_1.ApiResponse.paginated(res, results, (0, pagination_1.buildMeta)(pagination.page, pagination.limit, total));
    }),
};
exports.practicalController = {
    getById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const practical = await course_service_1.practicalService.getPracticalById(req.params.id);
        ApiResponse_1.ApiResponse.ok(res, practical);
    }),
};
//# sourceMappingURL=course.controller.js.map