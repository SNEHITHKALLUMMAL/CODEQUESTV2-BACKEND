import { Course } from "../models/Course.model";
import { Module } from "../models/Module.model";
import { Topic } from "../models/Topic.model";
import { Practical } from "../models/Practical.model";
import { Quiz } from "../models/Quiz.model";
import { ApiError } from "../utils/ApiError";

export const adminContentService = {
  courses: {
    list: () => Course.find().sort({ order: 1 }),
    create: (input: Record<string, unknown>) => Course.create(input),
    update: async (id: string, input: Record<string, unknown>) => {
      const course = await Course.findByIdAndUpdate(id, input, { new: true, runValidators: true });
      if (!course) throw ApiError.notFound("Course not found");
      return course;
    },
    remove: async (id: string) => {
      const moduleCount = await Module.countDocuments({ courseId: id });
      if (moduleCount > 0) {
        throw ApiError.badRequest("Cannot delete a course that still has modules. Delete its modules first.");
      }
      const course = await Course.findByIdAndDelete(id);
      if (!course) throw ApiError.notFound("Course not found");
    },
  },

  modules: {
    list: (courseId?: string) => Module.find(courseId ? { courseId } : {}).sort({ courseId: 1, order: 1 }),
    create: async (input: Record<string, unknown>) => {
      const module = await Module.create(input);
      await Course.findByIdAndUpdate(module.courseId, { $inc: { moduleCount: 1 } });
      return module;
    },
    update: async (id: string, input: Record<string, unknown>) => {
      const module = await Module.findByIdAndUpdate(id, input, { new: true, runValidators: true });
      if (!module) throw ApiError.notFound("Module not found");
      return module;
    },
    remove: async (id: string) => {
      const topicCount = await Topic.countDocuments({ moduleId: id });
      if (topicCount > 0) {
        throw ApiError.badRequest("Cannot delete a module that still has topics. Delete its topics first.");
      }
      const module = await Module.findByIdAndDelete(id);
      if (!module) throw ApiError.notFound("Module not found");
      await Course.findByIdAndUpdate(module.courseId, { $inc: { moduleCount: -1 } });
    },
  },

  topics: {
    list: (moduleId?: string) => Topic.find(moduleId ? { moduleId } : {}).sort({ moduleId: 1, order: 1 }),

    getById: async (id: string) => {
      const topic = await Topic.findById(id);
      if (!topic) throw ApiError.notFound("Topic not found");
      return topic;
    },

    create: async (input: Record<string, unknown>) => {
      await assertNoDuplicateTitle(input.moduleId as string, input.title as string);

      if (input.order === undefined) {
        const topicCount = await Topic.countDocuments({ moduleId: input.moduleId });
        input.order = topicCount + 1;
      }

      const topic = await Topic.create(input);
      await Module.findByIdAndUpdate(topic.moduleId, { $inc: { topicCount: 1 } });
      return topic;
    },

    update: async (id: string, input: Record<string, unknown>) => {
      const existing = await Topic.findById(id);
      if (!existing) throw ApiError.notFound("Topic not found");

      if (typeof input.title === "string") {
        const moduleId = (input.moduleId as string) ?? existing.moduleId.toString();
        await assertNoDuplicateTitle(moduleId, input.title, id);
      }

      const topic = await Topic.findByIdAndUpdate(id, input, { new: true, runValidators: true });
      if (!topic) throw ApiError.notFound("Topic not found");
      return topic;
    },

    remove: async (id: string) => {
      const topic = await Topic.findByIdAndDelete(id);
      if (!topic) throw ApiError.notFound("Topic not found");
      await Module.findByIdAndUpdate(topic.moduleId, { $inc: { topicCount: -1 } });
    },
  },

  practicals: {
    list: (moduleId?: string) => Practical.find(moduleId ? { moduleId } : {}).sort({ moduleId: 1, order: 1 }),
    create: (input: Record<string, unknown>) => Practical.create(input),
    update: async (id: string, input: Record<string, unknown>) => {
      const practical = await Practical.findByIdAndUpdate(id, input, { new: true, runValidators: true });
      if (!practical) throw ApiError.notFound("Practical not found");
      return practical;
    },
    remove: async (id: string) => {
      const practical = await Practical.findByIdAndDelete(id);
      if (!practical) throw ApiError.notFound("Practical not found");
    },
  },

  quizzes: {
    list: (moduleId?: string) => Quiz.find(moduleId ? { moduleId } : {}),
    create: (input: Record<string, unknown>) => Quiz.create(input),
    update: async (id: string, input: Record<string, unknown>) => {
      const quiz = await Quiz.findByIdAndUpdate(id, input, { new: true, runValidators: true });
      if (!quiz) throw ApiError.notFound("Quiz not found");
      return quiz;
    },
    remove: async (id: string) => {
      const quiz = await Quiz.findByIdAndDelete(id);
      if (!quiz) throw ApiError.notFound("Quiz not found");
    },
  },
};

async function assertNoDuplicateTitle(moduleId: string, title: string, excludeId?: string): Promise<void> {
  const escaped = title.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const query: Record<string, unknown> = {
    moduleId,
    title: { $regex: new RegExp(`^${escaped}$`, "i") },
  };
  if (excludeId) query._id = { $ne: excludeId };

  const duplicate = await Topic.findOne(query);
  if (duplicate) {
    throw ApiError.conflict(`A topic titled "${title.trim()}" already exists in this module`);
  }
}
