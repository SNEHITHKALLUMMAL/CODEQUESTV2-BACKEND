"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.practicalService = exports.topicService = exports.moduleService = exports.courseService = void 0;
const Course_model_1 = require("../models/Course.model");
const Module_model_1 = require("../models/Module.model");
const Topic_model_1 = require("../models/Topic.model");
const Practical_model_1 = require("../models/Practical.model");
const Quiz_model_1 = require("../models/Quiz.model");
const Progress_model_1 = require("../models/Progress.model");
const Note_model_1 = require("../models/Note.model");
const ApiError_1 = require("../utils/ApiError");
const enums_1 = require("../../shared/types/enums");
exports.courseService = {
    async listCourses() {
        return Course_model_1.Course.find({ isPublished: true }).sort({ order: 1 });
    },
    async getCourseBySlug(slug) {
        const course = await Course_model_1.Course.findOne({ slug, isPublished: true });
        if (!course)
            throw ApiError_1.ApiError.notFound("Course not found");
        const modules = await Module_model_1.Module.find({ courseId: course._id, isPublished: true }).sort({ order: 1 });
        return { course, modules };
    },
};
exports.moduleService = {
    async getModuleById(moduleId) {
        const module = await Module_model_1.Module.findById(moduleId);
        if (!module)
            throw ApiError_1.ApiError.notFound("Module not found");
        const [topics, practicals, quiz] = await Promise.all([
            Topic_model_1.Topic.find({ moduleId, isPublished: true }).sort({ order: 1 }).select("-content"),
            Practical_model_1.Practical.find({ moduleId, isPublished: true }).sort({ order: 1 }).select("-solutionCode"),
            Quiz_model_1.Quiz.findOne({ moduleId, isPublished: true }).select("title passingScorePercent questions"),
        ]);
        // Question answers/explanations are stripped before the quiz is attempted —
        // sent only via the grading endpoint response (Phase 8) to prevent cheating.
        const quizMeta = quiz
            ? {
                id: quiz._id,
                title: quiz.title,
                passingScorePercent: quiz.passingScorePercent,
                questionCount: quiz.questions.length,
            }
            : null;
        return { module, topics, practicals, quiz: quizMeta };
    },
};
exports.topicService = {
    async getTopicById(topicId, userId) {
        const topic = await Topic_model_1.Topic.findById(topicId);
        if (!topic)
            throw ApiError_1.ApiError.notFound("Topic not found");
        const [prevTopic, nextTopic, practicals] = await Promise.all([
            Topic_model_1.Topic.findOne({ moduleId: topic.moduleId, order: { $lt: topic.order } })
                .sort({ order: -1 })
                .select("title order"),
            Topic_model_1.Topic.findOne({ moduleId: topic.moduleId, order: { $gt: topic.order } })
                .sort({ order: 1 })
                .select("title order"),
            Practical_model_1.Practical.find({ topicId: topic._id }).select("-solutionCode"),
        ]);
        let progress = null;
        let note = null;
        if (userId) {
            const [progressDoc, noteDoc] = await Promise.all([
                Progress_model_1.Progress.findOne({ userId, topicId }).select("status"),
                Note_model_1.Note.findOne({ userId, topicId }).select("text isBookmarked"),
            ]);
            progress = progressDoc ? { status: progressDoc.status } : { status: enums_1.ProgressStatus.NOT_STARTED };
            note = noteDoc ? { text: noteDoc.text, isBookmarked: noteDoc.isBookmarked } : null;
        }
        return { topic, prevTopic, nextTopic, practicals, progress, note };
    },
    async search(query, pagination) {
        const filter = { $text: { $search: query }, isPublished: true };
        const [results, total] = await Promise.all([
            Topic_model_1.Topic.find(filter, { score: { $meta: "textScore" } })
                .sort({ score: { $meta: "textScore" } })
                .skip(pagination.skip)
                .limit(pagination.limit)
                .select("title summary slug moduleId courseId")
                .populate("moduleId", "title slug")
                .populate("courseId", "title slug"),
            Topic_model_1.Topic.countDocuments(filter),
        ]);
        return { results, total };
    },
};
exports.practicalService = {
    async getPracticalById(practicalId) {
        const practical = await Practical_model_1.Practical.findById(practicalId);
        if (!practical)
            throw ApiError_1.ApiError.notFound("Practical exercise not found");
        return practical;
    },
};
//# sourceMappingURL=course.service.js.map