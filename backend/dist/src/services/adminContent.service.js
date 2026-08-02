"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminContentService = void 0;
const Course_model_1 = require("../models/Course.model");
const Module_model_1 = require("../models/Module.model");
const Topic_model_1 = require("../models/Topic.model");
const Practical_model_1 = require("../models/Practical.model");
const Quiz_model_1 = require("../models/Quiz.model");
const ApiError_1 = require("../utils/ApiError");
exports.adminContentService = {
    // ---------- Courses ----------
    courses: {
        list: () => Course_model_1.Course.find().sort({ order: 1 }),
        create: (input) => Course_model_1.Course.create(input),
        update: async (id, input) => {
            const course = await Course_model_1.Course.findByIdAndUpdate(id, input, { new: true, runValidators: true });
            if (!course)
                throw ApiError_1.ApiError.notFound("Course not found");
            return course;
        },
        remove: async (id) => {
            const moduleCount = await Module_model_1.Module.countDocuments({ courseId: id });
            if (moduleCount > 0) {
                throw ApiError_1.ApiError.badRequest("Cannot delete a course that still has modules. Delete its modules first.");
            }
            const course = await Course_model_1.Course.findByIdAndDelete(id);
            if (!course)
                throw ApiError_1.ApiError.notFound("Course not found");
        },
    },
    // ---------- Modules ----------
    modules: {
        list: (courseId) => Module_model_1.Module.find(courseId ? { courseId } : {}).sort({ courseId: 1, order: 1 }),
        create: async (input) => {
            const module = await Module_model_1.Module.create(input);
            await Course_model_1.Course.findByIdAndUpdate(module.courseId, { $inc: { moduleCount: 1 } });
            return module;
        },
        update: async (id, input) => {
            const module = await Module_model_1.Module.findByIdAndUpdate(id, input, { new: true, runValidators: true });
            if (!module)
                throw ApiError_1.ApiError.notFound("Module not found");
            return module;
        },
        remove: async (id) => {
            const topicCount = await Topic_model_1.Topic.countDocuments({ moduleId: id });
            if (topicCount > 0) {
                throw ApiError_1.ApiError.badRequest("Cannot delete a module that still has topics. Delete its topics first.");
            }
            const module = await Module_model_1.Module.findByIdAndDelete(id);
            if (!module)
                throw ApiError_1.ApiError.notFound("Module not found");
            await Course_model_1.Course.findByIdAndUpdate(module.courseId, { $inc: { moduleCount: -1 } });
        },
    },
    // ---------- Topics ----------
    topics: {
        list: (moduleId) => Topic_model_1.Topic.find(moduleId ? { moduleId } : {}).sort({ moduleId: 1, order: 1 }),
        getById: async (id) => {
            const topic = await Topic_model_1.Topic.findById(id);
            if (!topic)
                throw ApiError_1.ApiError.notFound("Topic not found");
            return topic;
        },
        create: async (input) => {
            await assertNoDuplicateTitle(input.moduleId, input.title);
            // Auto-number new topics to the end of the module if no explicit order was given,
            // so the admin doesn't have to know the current topic count.
            if (input.order === undefined) {
                const topicCount = await Topic_model_1.Topic.countDocuments({ moduleId: input.moduleId });
                input.order = topicCount + 1;
            }
            const topic = await Topic_model_1.Topic.create(input);
            await Module_model_1.Module.findByIdAndUpdate(topic.moduleId, { $inc: { topicCount: 1 } });
            return topic;
        },
        update: async (id, input) => {
            const existing = await Topic_model_1.Topic.findById(id);
            if (!existing)
                throw ApiError_1.ApiError.notFound("Topic not found");
            if (typeof input.title === "string") {
                const moduleId = input.moduleId ?? existing.moduleId.toString();
                await assertNoDuplicateTitle(moduleId, input.title, id);
            }
            const topic = await Topic_model_1.Topic.findByIdAndUpdate(id, input, { new: true, runValidators: true });
            if (!topic)
                throw ApiError_1.ApiError.notFound("Topic not found");
            return topic;
        },
        remove: async (id) => {
            const topic = await Topic_model_1.Topic.findByIdAndDelete(id);
            if (!topic)
                throw ApiError_1.ApiError.notFound("Topic not found");
            await Module_model_1.Module.findByIdAndUpdate(topic.moduleId, { $inc: { topicCount: -1 } });
        },
    },
    // ---------- Practicals ----------
    practicals: {
        list: (moduleId) => Practical_model_1.Practical.find(moduleId ? { moduleId } : {}).sort({ moduleId: 1, order: 1 }),
        create: (input) => Practical_model_1.Practical.create(input),
        update: async (id, input) => {
            const practical = await Practical_model_1.Practical.findByIdAndUpdate(id, input, { new: true, runValidators: true });
            if (!practical)
                throw ApiError_1.ApiError.notFound("Practical not found");
            return practical;
        },
        remove: async (id) => {
            const practical = await Practical_model_1.Practical.findByIdAndDelete(id);
            if (!practical)
                throw ApiError_1.ApiError.notFound("Practical not found");
        },
    },
    // ---------- Quizzes ----------
    quizzes: {
        list: (moduleId) => Quiz_model_1.Quiz.find(moduleId ? { moduleId } : {}),
        create: (input) => Quiz_model_1.Quiz.create(input),
        update: async (id, input) => {
            const quiz = await Quiz_model_1.Quiz.findByIdAndUpdate(id, input, { new: true, runValidators: true });
            if (!quiz)
                throw ApiError_1.ApiError.notFound("Quiz not found");
            return quiz;
        },
        remove: async (id) => {
            const quiz = await Quiz_model_1.Quiz.findByIdAndDelete(id);
            if (!quiz)
                throw ApiError_1.ApiError.notFound("Quiz not found");
        },
    },
};
/**
 * Enforces "no two topics in the same module share a title" (case-insensitive).
 * Runs as an explicit pre-check rather than relying on the {moduleId, slug}
 * unique index, because that index collision surfaces as a confusing
 * "A record with this moduleId already exists" — this gives the admin a
 * message that actually explains what went wrong.
 */
async function assertNoDuplicateTitle(moduleId, title, excludeId) {
    const escaped = title.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const query = {
        moduleId,
        title: { $regex: new RegExp(`^${escaped}$`, "i") },
    };
    if (excludeId)
        query._id = { $ne: excludeId };
    const duplicate = await Topic_model_1.Topic.findOne(query);
    if (duplicate) {
        throw ApiError_1.ApiError.conflict(`A topic titled "${title.trim()}" already exists in this module`);
    }
}
//# sourceMappingURL=adminContent.service.js.map