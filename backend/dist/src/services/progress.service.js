"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressService = void 0;
const mongoose_1 = require("mongoose");
const Progress_model_1 = require("../models/Progress.model");
const Topic_model_1 = require("../models/Topic.model");
const Module_model_1 = require("../models/Module.model");
const Course_model_1 = require("../models/Course.model");
const Certificate_model_1 = require("../models/Certificate.model");
const ApiError_1 = require("../utils/ApiError");
const enums_1 = require("../../shared/types/enums");
const certificate_service_1 = require("./certificate.service");
const computeCourseProgress_1 = require("../utils/computeCourseProgress");
exports.progressService = {
    /** Marks a topic as in-progress (first view) or completed (explicit action). Idempotent. */
    async setTopicStatus(userId, topicId, status) {
        const topic = await Topic_model_1.Topic.findById(topicId);
        if (!topic)
            throw ApiError_1.ApiError.notFound("Topic not found");
        const update = {
            status,
            lastAccessedAt: new Date(),
            courseId: topic.courseId,
            moduleId: topic.moduleId,
            topicId: topic._id,
            userId: new mongoose_1.Types.ObjectId(userId),
        };
        if (status === enums_1.ProgressStatus.COMPLETED) {
            update.completedAt = new Date();
        }
        const progress = await Progress_model_1.Progress.findOneAndUpdate({ userId, topicId }, { $set: update }, { upsert: true, new: true, setDefaultsOnInsert: true });
        // If this completion brings the course to 100%, issue a certificate (FR-28).
        if (status === enums_1.ProgressStatus.COMPLETED) {
            const summary = await exports.progressService.getCourseProgressByCourseId(userId, topic.courseId.toString());
            if (summary.percent === 100 && !summary.certificateIssued) {
                await certificate_service_1.certificateService.issueCertificateIfEligible(userId, topic.courseId.toString());
            }
        }
        return progress;
    },
    async getCourseProgressByCourseId(userId, courseId) {
        const course = await Course_model_1.Course.findById(courseId);
        if (!course)
            throw ApiError_1.ApiError.notFound("Course not found");
        return exports.progressService.buildSummary(userId, course);
    },
    async getCourseProgress(userId, courseSlug) {
        const course = await Course_model_1.Course.findOne({ slug: courseSlug });
        if (!course)
            throw ApiError_1.ApiError.notFound("Course not found");
        return exports.progressService.buildSummary(userId, course);
    },
    async buildSummary(userId, course) {
        const modules = await Module_model_1.Module.find({ courseId: course._id }).sort({ order: 1 }).lean();
        const completedRows = await Progress_model_1.Progress.aggregate([
            {
                $match: {
                    userId: new mongoose_1.Types.ObjectId(userId),
                    courseId: course._id,
                    status: enums_1.ProgressStatus.COMPLETED,
                },
            },
            { $group: { _id: "$moduleId", count: { $sum: 1 } } },
        ]);
        const completedByModule = new Map(completedRows.map((r) => [r._id.toString(), r.count]));
        const moduleInputs = modules.map((m) => ({
            moduleId: m._id.toString(),
            title: m.title,
            slug: m.slug,
            order: m.order,
            importance: m.importance,
            topicCount: m.topicCount || 0,
            completedCount: completedByModule.get(m._id.toString()) ?? 0,
        }));
        const computed = (0, computeCourseProgress_1.computeCourseProgress)(moduleInputs);
        const existingCertificate = await Certificate_model_1.Certificate.findOne({ userId, courseId: course._id });
        return {
            courseId: course._id.toString(),
            courseSlug: course.slug,
            totalTopics: computed.totalTopics,
            completedTopics: computed.completedTopics,
            percent: computed.percent,
            modules: computed.modules,
            certificateIssued: Boolean(existingCertificate),
        };
    },
    async getDashboardSummary(userId) {
        const courses = await Course_model_1.Course.find({ isPublished: true }).sort({ order: 1 }).lean();
        const summaries = await Promise.all(courses.map((c) => exports.progressService.buildSummary(userId, c)));
        const recentActivity = await Progress_model_1.Progress.find({ userId })
            .sort({ lastAccessedAt: -1 })
            .limit(5)
            .populate("topicId", "title slug")
            .populate("moduleId", "title slug")
            .lean();
        return { courses: summaries, recentActivity };
    },
};
//# sourceMappingURL=progress.service.js.map