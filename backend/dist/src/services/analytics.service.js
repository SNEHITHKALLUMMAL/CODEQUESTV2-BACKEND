"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = void 0;
const User_model_1 = require("../models/User.model");
const Course_model_1 = require("../models/Course.model");
const Module_model_1 = require("../models/Module.model");
const Topic_model_1 = require("../models/Topic.model");
const Progress_model_1 = require("../models/Progress.model");
const QuizAttempt_model_1 = require("../models/QuizAttempt.model");
const Certificate_model_1 = require("../models/Certificate.model");
const enums_1 = require("../../shared/types/enums");
exports.analyticsService = {
    async getOverview() {
        const [totalUsers, studentCount, instructorCount, adminCount, totalCourses, totalModules, totalTopics, completedTopicsCount, totalCertificates, quizStats, recentUsers,] = await Promise.all([
            User_model_1.User.countDocuments(),
            User_model_1.User.countDocuments({ role: enums_1.UserRole.STUDENT }),
            User_model_1.User.countDocuments({ role: enums_1.UserRole.INSTRUCTOR }),
            User_model_1.User.countDocuments({ role: enums_1.UserRole.ADMIN }),
            Course_model_1.Course.countDocuments(),
            Module_model_1.Module.countDocuments(),
            Topic_model_1.Topic.countDocuments(),
            Progress_model_1.Progress.countDocuments({ status: enums_1.ProgressStatus.COMPLETED }),
            Certificate_model_1.Certificate.countDocuments(),
            QuizAttempt_model_1.QuizAttempt.aggregate([
                {
                    $group: {
                        _id: null,
                        averageScore: { $avg: "$scorePercent" },
                        totalAttempts: { $sum: 1 },
                        passRate: { $avg: { $cond: ["$passed", 1, 0] } },
                    },
                },
            ]),
            User_model_1.User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt"),
        ]);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const activeUsersLast30Days = await User_model_1.User.countDocuments({ lastLoginAt: { $gte: thirtyDaysAgo } });
        const stats = quizStats[0] ?? { averageScore: 0, totalAttempts: 0, passRate: 0 };
        return {
            users: {
                total: totalUsers,
                students: studentCount,
                instructors: instructorCount,
                admins: adminCount,
                activeLast30Days: activeUsersLast30Days,
            },
            content: {
                courses: totalCourses,
                modules: totalModules,
                topics: totalTopics,
            },
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
        const courses = await Course_model_1.Course.find().lean();
        const results = [];
        for (const course of courses) {
            const totalTopics = await Topic_model_1.Topic.countDocuments({ courseId: course._id, isPublished: true });
            const totalLearners = await Progress_model_1.Progress.distinct("userId", { courseId: course._id });
            const completions = await Certificate_model_1.Certificate.countDocuments({ courseId: course._id });
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
//# sourceMappingURL=analytics.service.js.map