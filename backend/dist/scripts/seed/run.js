"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Database seed script.
 *
 * Usage:
 *   npm run seed            -> wipes course-related collections and reseeds from curriculum data
 *   npm run seed:destroy    -> only wipes course-related collections (no reseed)
 *
 * This script is idempotent for course content: it always clears Course/Module/Topic/
 * Practical/Quiz collections first, then rebuilds them from
 * scripts/seed/data/{html,css}.curriculum.ts, so it can be run repeatedly during
 * development without producing duplicates. User accounts and user-generated
 * data (progress, notes, playground saves, quiz attempts) are NOT touched unless
 * --destroy --all is passed.
 */
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../../src/config/env");
const logger_1 = require("../../src/utils/logger");
const models_1 = require("../../src/models");
const enums_1 = require("../../shared/types/enums");
const html_curriculum_1 = require("./data/html.curriculum");
const css_curriculum_1 = require("./data/css.curriculum");
const helpers_1 = require("./helpers");
const DESTROY_ONLY = process.argv.includes("--destroy");
const WIPE_USERS = process.argv.includes("--all");
async function wipeCourseData() {
    await Promise.all([
        models_1.Quiz.deleteMany({}),
        models_1.Practical.deleteMany({}),
        models_1.Topic.deleteMany({}),
        models_1.Module.deleteMany({}),
        models_1.Course.deleteMany({}),
    ]);
    logger_1.logger.info("Cleared Course/Module/Topic/Practical/Quiz collections");
    if (WIPE_USERS) {
        await models_1.User.deleteMany({});
        logger_1.logger.warn("Cleared User collection (--all flag was set)");
    }
}
async function seedCourse(courseSeed) {
    const course = await models_1.Course.create({
        title: courseSeed.title,
        slug: courseSeed.slug,
        description: courseSeed.description,
        order: courseSeed.order,
        isPublished: true,
        moduleCount: courseSeed.modules.length,
    });
    let moduleOrder = 0;
    for (const moduleSeed of courseSeed.modules) {
        moduleOrder += 1;
        const moduleDoc = await models_1.Module.create({
            courseId: course._id,
            title: moduleSeed.title,
            slug: moduleSeed.slug,
            order: moduleOrder,
            importance: moduleSeed.importance,
            topicCount: moduleSeed.topics.length,
            isPublished: true,
        });
        // Topics
        let topicOrder = 0;
        for (const topicTitle of moduleSeed.topics) {
            topicOrder += 1;
            await models_1.Topic.create({
                moduleId: moduleDoc._id,
                courseId: course._id,
                title: topicTitle,
                slug: (0, helpers_1.slugify)(topicTitle),
                summary: `${topicTitle} — part of ${moduleSeed.title}`,
                content: (0, helpers_1.buildTopicContent)(courseSeed.slug, moduleSeed.title, topicTitle),
                codeExamples: [(0, helpers_1.buildCodeExampleFor)(courseSeed.slug, topicTitle)],
                order: topicOrder,
                estimatedMinutes: 6,
                isPublished: true,
            });
        }
        // Practicals
        let practicalOrder = 0;
        for (const practicalSeed of moduleSeed.practicals) {
            practicalOrder += 1;
            await models_1.Practical.create({
                moduleId: moduleDoc._id,
                courseId: course._id,
                title: practicalSeed.title,
                slug: (0, helpers_1.slugify)(practicalSeed.title),
                instructions: (0, helpers_1.buildPracticalInstructions)(courseSeed.slug, moduleSeed.title, practicalSeed),
                starterCode: (0, helpers_1.buildStarterCode)(courseSeed.slug, practicalSeed),
                order: practicalOrder,
                isPublished: true,
            });
        }
        // Quiz (one per module)
        await models_1.Quiz.create({
            moduleId: moduleDoc._id,
            courseId: course._id,
            title: moduleSeed.quiz.title,
            passingScorePercent: 70,
            questions: moduleSeed.quiz.questions,
            isPublished: true,
        });
    }
    logger_1.logger.info(`Seeded course "${course.title}" — ${courseSeed.modules.length} modules`);
}
async function seedAdminUser() {
    const adminEmail = "admin@codequest.dev";
    const existing = await models_1.User.findOne({ email: adminEmail });
    if (existing) {
        logger_1.logger.info("Admin user already exists, skipping");
        return;
    }
    const passwordHash = await bcrypt_1.default.hash("Admin@12345", 12);
    await models_1.User.create({
        name: "CodeQuest Admin",
        email: adminEmail,
        passwordHash, // pre-hashed here; model's pre-save hook only re-hashes if isModified, so it's safe
        role: enums_1.UserRole.ADMIN,
        isEmailVerified: true,
        isActive: true,
    });
    logger_1.logger.info(`Seeded default admin user: ${adminEmail} / Admin@12345 (CHANGE THIS PASSWORD IMMEDIATELY)`);
}
async function main() {
    await mongoose_1.default.connect(env_1.env.mongoUri);
    logger_1.logger.info("Connected to MongoDB for seeding");
    await wipeCourseData();
    if (!DESTROY_ONLY) {
        await seedCourse(html_curriculum_1.htmlCourse);
        await seedCourse(css_curriculum_1.cssCourse);
        await seedAdminUser();
    }
    await mongoose_1.default.disconnect();
    logger_1.logger.info("Seeding complete. Disconnected.");
    process.exit(0);
}
main().catch((err) => {
    logger_1.logger.error(`Seed script failed: ${err.stack || err.message}`);
    process.exit(1);
});
//# sourceMappingURL=run.js.map