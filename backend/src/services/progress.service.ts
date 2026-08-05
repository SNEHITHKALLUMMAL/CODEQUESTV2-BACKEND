import { Types } from "mongoose";
import { Progress } from "../models/Progress.model";
import { Topic } from "../models/Topic.model";
import { Module } from "../models/Module.model";
import { Course } from "../models/Course.model";
import { Certificate } from "../models/Certificate.model";
import { ApiError } from "../utils/ApiError";
import { ProgressStatus } from "../../shared/types/enums";
import { certificateService } from "./certificate.service";
import { computeCourseProgress } from "../utils/computeCourseProgress";

export interface ModuleProgressSummary {
  moduleId: string;
  title: string;
  slug: string;
  order: number;
  importance: string;
  topicCount: number;
  completedCount: number;
  percent: number;
}

export interface CourseProgressSummary {
  courseId: string;
  courseSlug: string;
  totalTopics: number;
  completedTopics: number;
  percent: number;
  modules: ModuleProgressSummary[];
  certificateIssued: boolean;
}

export const progressService = {
  async setTopicStatus(userId: string, topicId: string, status: ProgressStatus) {
    const topic = await Topic.findById(topicId);
    if (!topic) throw ApiError.notFound("Topic not found");

    const update: Record<string, unknown> = {
      status,
      lastAccessedAt: new Date(),
      courseId: topic.courseId,
      moduleId: topic.moduleId,
      topicId: topic._id,
      userId: new Types.ObjectId(userId),
    };
    if (status === ProgressStatus.COMPLETED) {
      update.completedAt = new Date();
    }

    const progress = await Progress.findOneAndUpdate(
      { userId, topicId },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (status === ProgressStatus.COMPLETED) {
      const summary = await progressService.getCourseProgressByCourseId(userId, topic.courseId.toString());
      if (summary.percent === 100 && !summary.certificateIssued) {
        await certificateService.issueCertificateIfEligible(userId, topic.courseId.toString());
      }
    }

    return progress;
  },

  async getCourseProgressByCourseId(userId: string, courseId: string): Promise<CourseProgressSummary> {
    const course = await Course.findById(courseId);
    if (!course) throw ApiError.notFound("Course not found");
    return progressService.buildSummary(userId, course);
  },

  async getCourseProgress(userId: string, courseSlug: string): Promise<CourseProgressSummary> {
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) throw ApiError.notFound("Course not found");
    return progressService.buildSummary(userId, course);
  },

  async buildSummary(userId: string, course: { _id: Types.ObjectId; slug: string }): Promise<CourseProgressSummary> {
    const modules = await Module.find({ courseId: course._id }).sort({ order: 1 }).lean();

    const completedRows = await Progress.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          courseId: course._id,
          status: ProgressStatus.COMPLETED,
        },
      },
      { $group: { _id: "$moduleId", count: { $sum: 1 } } },
    ]);
    const completedByModule = new Map<string, number>(completedRows.map((r) => [r._id.toString(), r.count]));

    const moduleInputs = modules.map((m) => ({
      moduleId: m._id.toString(),
      title: m.title,
      slug: m.slug,
      order: m.order,
      importance: m.importance,
      topicCount: m.topicCount || 0,
      completedCount: completedByModule.get(m._id.toString()) ?? 0,
    }));

    const computed = computeCourseProgress(moduleInputs);

    const existingCertificate = await Certificate.findOne({ userId, courseId: course._id });

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

  async getDashboardSummary(userId: string) {
    const courses = await Course.find({ isPublished: true }).sort({ order: 1 }).lean();
    const summaries = await Promise.all(courses.map((c) => progressService.buildSummary(userId, c)));

    const recentActivity = await Progress.find({ userId })
      .sort({ lastAccessedAt: -1 })
      .limit(5)
      .populate("topicId", "title slug")
      .populate("moduleId", "title slug")
      .lean();

    return { courses: summaries, recentActivity };
  },
};
