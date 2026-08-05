import { User } from "../models/User.model";
import { Course } from "../models/Course.model";
import { Module } from "../models/Module.model";
import { Topic } from "../models/Topic.model";
import { Progress } from "../models/Progress.model";
import { QuizAttempt } from "../models/QuizAttempt.model";
import { Certificate } from "../models/Certificate.model";
import { ProgressStatus, UserRole } from "../../shared/types/enums";

export const analyticsService = {
  async getOverview() {
    const [
      totalUsers,
      studentCount,
      instructorCount,
      adminCount,
      totalCourses,
      totalModules,
      totalTopics,
      completedTopicsCount,
      totalCertificates,
      quizStats,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: UserRole.STUDENT }),
      User.countDocuments({ role: UserRole.INSTRUCTOR }),
      User.countDocuments({ role: UserRole.ADMIN }),
      Course.countDocuments(),
      Module.countDocuments(),
      Topic.countDocuments(),
      Progress.countDocuments({ status: ProgressStatus.COMPLETED }),
      Certificate.countDocuments(),
      QuizAttempt.aggregate([
        {
          $group: {
            _id: null,
            averageScore: { $avg: "$scorePercent" },
            totalAttempts: { $sum: 1 },
            passRate: { $avg: { $cond: ["$passed", 1, 0] } },
          },
        },
      ]),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt"),
    ]);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsersLast30Days = await User.countDocuments({ lastLoginAt: { $gte: thirtyDaysAgo } });

    const stats = quizStats[0] ?? { averageScore: 0, totalAttempts: 0, passRate: 0 };

    return {
      users: {
        total: totalUsers,
        students: studentCount,
        instructors: instructorCount,
        admins: adminCount,
        activeLast30Days: activeUsersLast30Days,
      },
      content: { courses: totalCourses, modules: totalModules, topics: totalTopics },
      engagement: {
        completedTopics: completedTopicsCount,
        certificatesIssued: totalCertificates,
        quizAttempts: stats.totalAttempts,
        averageQuizScore: Math.round(stats.averageScore ?? 0),
        quizPassRate: Math.round((stats.passRate ?? 0) * 100),
      },
      recentUsers,
    };
  },

  async getCourseCompletionRates() {
    const courses = await Course.find().lean();
    const results = [];
    for (const course of courses) {
      const totalTopics = await Topic.countDocuments({ courseId: course._id, isPublished: true });
      const totalLearners = await Progress.distinct("userId", { courseId: course._id });
      const completions = await Certificate.countDocuments({ courseId: course._id });
      results.push({
        courseId: course._id.toString(),
        title: course.title,
        slug: course.slug,
        totalTopics,
        learnerCount: totalLearners.length,
        certificatesIssued: completions,
      });
    }
    return results;
  },
};
