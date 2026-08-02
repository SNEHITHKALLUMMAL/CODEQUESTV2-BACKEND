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
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { env } from "../../src/config/env";
import { logger } from "../../src/utils/logger";
import { Course, Module, Topic, Practical, Quiz, User } from "../../src/models";
import { UserRole } from "../../shared/types/enums";
import { htmlCourse } from "./data/html.curriculum";
import { cssCourse } from "./data/css.curriculum";
import { CourseSeed } from "./types";
import {
  slugify,
  buildTopicContent,
  buildCodeExampleFor,
  buildPracticalInstructions,
  buildStarterCode,
} from "./helpers";

const DESTROY_ONLY = process.argv.includes("--destroy");
const WIPE_USERS = process.argv.includes("--all");

async function wipeCourseData(): Promise<void> {
  await Promise.all([
    Quiz.deleteMany({}),
    Practical.deleteMany({}),
    Topic.deleteMany({}),
    Module.deleteMany({}),
    Course.deleteMany({}),
  ]);
  logger.info("Cleared Course/Module/Topic/Practical/Quiz collections");

  if (WIPE_USERS) {
    await User.deleteMany({});
    logger.warn("Cleared User collection (--all flag was set)");
  }
}

async function seedCourse(courseSeed: CourseSeed): Promise<void> {
  const course = await Course.create({
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

    const moduleDoc = await Module.create({
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
      await Topic.create({
        moduleId: moduleDoc._id,
        courseId: course._id,
        title: topicTitle,
        slug: slugify(topicTitle),
        summary: `${topicTitle} — part of ${moduleSeed.title}`,
        content: buildTopicContent(courseSeed.slug, moduleSeed.title, topicTitle),
        codeExamples: [buildCodeExampleFor(courseSeed.slug, topicTitle)],
        order: topicOrder,
        estimatedMinutes: 6,
        isPublished: true,
      });
    }

    // Practicals
    let practicalOrder = 0;
    for (const practicalSeed of moduleSeed.practicals) {
      practicalOrder += 1;
      await Practical.create({
        moduleId: moduleDoc._id,
        courseId: course._id,
        title: practicalSeed.title,
        slug: slugify(practicalSeed.title),
        instructions: buildPracticalInstructions(courseSeed.slug, moduleSeed.title, practicalSeed),
        starterCode: buildStarterCode(courseSeed.slug, practicalSeed),
        order: practicalOrder,
        isPublished: true,
      });
    }

    // Quiz (one per module)
    await Quiz.create({
      moduleId: moduleDoc._id,
      courseId: course._id,
      title: moduleSeed.quiz.title,
      passingScorePercent: 70,
      questions: moduleSeed.quiz.questions,
      isPublished: true,
    });
  }

  logger.info(`Seeded course "${course.title}" — ${courseSeed.modules.length} modules`);
}

async function seedAdminUser(): Promise<void> {
  const adminEmail = "admin@codequest.dev";
  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    logger.info("Admin user already exists, skipping");
    return;
  }
  const passwordHash = await bcrypt.hash("Admin@12345", 12);
  await User.create({
    name: "CodeQuest Admin",
    email: adminEmail,
    passwordHash, // pre-hashed here; model's pre-save hook only re-hashes if isModified, so it's safe
    role: UserRole.ADMIN,
    isEmailVerified: true,
    isActive: true,
  });
  logger.info(`Seeded default admin user: ${adminEmail} / Admin@12345 (CHANGE THIS PASSWORD IMMEDIATELY)`);
}

async function main() {
  await mongoose.connect(env.mongoUri);
  logger.info("Connected to MongoDB for seeding");

  await wipeCourseData();

  if (!DESTROY_ONLY) {
    await seedCourse(htmlCourse);
    await seedCourse(cssCourse);
    await seedAdminUser();
  }

  await mongoose.disconnect();
  logger.info("Seeding complete. Disconnected.");
  process.exit(0);
}

main().catch((err) => {
  logger.error(`Seed script failed: ${err.stack || err.message}`);
  process.exit(1);
});
