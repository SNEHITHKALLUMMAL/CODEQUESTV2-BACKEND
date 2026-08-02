"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeCourseProgress = computeCourseProgress;
/** Rounds to the nearest whole percent; a module/course with 0 topics is 0%, not NaN. */
function percentOf(completed, total) {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
}
/**
 * Pure aggregation: takes per-module topic/completion counts and computes
 * both module-level and course-level percentages. Extracted from
 * progress.service.ts so this math — the thing every dashboard, progress
 * bar, and certificate-eligibility check depends on — can be unit tested
 * without a database.
 */
function computeCourseProgress(modules) {
    const withPercent = modules.map((m) => ({
        ...m,
        percent: percentOf(m.completedCount, m.topicCount),
    }));
    const totalTopics = modules.reduce((sum, m) => sum + m.topicCount, 0);
    const completedTopics = modules.reduce((sum, m) => sum + m.completedCount, 0);
    return {
        totalTopics,
        completedTopics,
        percent: percentOf(completedTopics, totalTopics),
        modules: withPercent,
    };
}
//# sourceMappingURL=computeCourseProgress.js.map