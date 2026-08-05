import { Course } from "../models/Course.model";
import { Module } from "../models/Module.model";
import { Topic } from "../models/Topic.model";
import { Practical } from "../models/Practical.model";
import { Quiz } from "../models/Quiz.model";
import { Progress } from "../models/Progress.model";
import { Note } from "../models/Note.model";
import { ApiError } from "../utils/ApiError";
import { ProgressStatus } from "../../shared/types/enums";
import { ParsedPagination } from "../utils/pagination";

export const courseService = {
  async listCourses() {
    return Course.find({ isPublished: true }).sort({ order: 1 });
  },

  async getCourseBySlug(slug: string) {
    const course = await Course.findOne({ slug, isPublished: true });
    if (!course) throw ApiError.notFound("Course not found");

    const modules = await Module.find({ courseId: course._id, isPublished: true }).sort({ order: 1 });

    return { course, modules };
  },
};

export const moduleService = {
  async getModuleById(moduleId: string) {
    const module = await Module.findById(moduleId);
    if (!module) throw ApiError.notFound("Module not found");

    const [topics, practicals, quiz] = await Promise.all([
      Topic.find({ moduleId, isPublished: true }).sort({ order: 1 }).select("-content"),
      Practical.find({ moduleId, isPublished: true }).sort({ order: 1 }).select("-solutionCode"),
      Quiz.findOne({ moduleId, isPublished: true }).select("title passingScorePercent questions"),
    ]);

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

export const topicService = {
  async getTopicById(topicId: string, userId?: string) {
    const topic = await Topic.findById(topicId);
    if (!topic) throw ApiError.notFound("Topic not found");

    const [prevTopic, nextTopic, practicals] = await Promise.all([
      Topic.findOne({ moduleId: topic.moduleId, order: { $lt: topic.order } })
        .sort({ order: -1 })
        .select("title order"),
      Topic.findOne({ moduleId: topic.moduleId, order: { $gt: topic.order } })
        .sort({ order: 1 })
        .select("title order"),
      Practical.find({ topicId: topic._id }).select("-solutionCode"),
    ]);

    let progress: { status: string } | null = null;
    let note: { text: string; isBookmarked: boolean } | null = null;

    if (userId) {
      const [progressDoc, noteDoc] = await Promise.all([
        Progress.findOne({ userId, topicId }).select("status"),
        Note.findOne({ userId, topicId }).select("text isBookmarked"),
      ]);
      progress = progressDoc ? { status: progressDoc.status } : { status: ProgressStatus.NOT_STARTED };
      note = noteDoc ? { text: noteDoc.text, isBookmarked: noteDoc.isBookmarked } : null;
    }

    return { topic, prevTopic, nextTopic, practicals, progress, note };
  },

  async search(query: string, pagination: ParsedPagination) {
    const filter = { $text: { $search: query }, isPublished: true };
    const [results, total] = await Promise.all([
      Topic.find(filter, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .select("title summary slug moduleId courseId")
        .populate("moduleId", "title slug")
        .populate("courseId", "title slug"),
      Topic.countDocuments(filter),
    ]);
    return { results, total };
  },
};

export const practicalService = {
  async getPracticalById(practicalId: string) {
    const practical = await Practical.findById(practicalId);
    if (!practical) throw ApiError.notFound("Practical exercise not found");
    return practical;
  },
};
