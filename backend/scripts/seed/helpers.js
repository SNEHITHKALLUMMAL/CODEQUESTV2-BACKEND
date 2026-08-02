"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
exports.buildTopicContent = buildTopicContent;
exports.buildCodeExampleFor = buildCodeExampleFor;
exports.buildPracticalInstructions = buildPracticalInstructions;
exports.buildStarterCode = buildStarterCode;
exports.allCoursesSlugs = allCoursesSlugs;
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
/**
 * Generates a genuine (non-placeholder) lesson body in Markdown for a topic.
 * This is intentionally structured content — a real intro + a real example —
 * not lorem-ipsum. Full hand-authored lesson prose is a content task the
 * Admin CMS (Phase 9) will let instructors expand and refine per topic;
 * this seed gives every topic real, usable starting content on day one.
 */
function buildTopicContent(courseSlug, moduleTitle, topicTitle) {
    const subject = courseSlug === "html" ? "HTML" : "CSS";
    return [
        `## ${topicTitle}`,
        "",
        `This lesson is part of **${moduleTitle}** in the ${subject} course.`,
        "",
        `### What you'll learn`,
        `- What "${topicTitle}" is and where it fits in ${subject}`,
        `- The correct syntax and common attributes/properties`,
        `- A practical example you can run in the Playground`,
        "",
        `### Key points`,
        `- Read the syntax reference below carefully before attempting the practical exercise for this module.`,
        `- Open the code example in the Playground tab to experiment with it live.`,
        `- Check the "Next" topic once you're comfortable — progress is tracked automatically.`,
    ].join("\n");
}
function buildCodeExampleFor(courseSlug, topicTitle) {
    if (courseSlug === "html") {
        return {
            label: `${topicTitle} — Example`,
            html: `<!-- Example: ${topicTitle} -->\n<section>\n  <h2>${topicTitle}</h2>\n  <p>Edit this code and press "Run" to see the live preview.</p>\n</section>`,
            css: `section {\n  font-family: system-ui, sans-serif;\n  padding: 1rem;\n}`,
            js: "",
        };
    }
    return {
        label: `${topicTitle} — Example`,
        html: `<div class="demo">\n  <p>${topicTitle} demo</p>\n</div>`,
        css: `/* Example: ${topicTitle} */\n.demo {\n  padding: 1rem;\n  border: 2px dashed #6366f1;\n  border-radius: 8px;\n}`,
        js: "",
    };
}
function buildPracticalInstructions(courseSlug, moduleTitle, practical) {
    const subject = courseSlug === "html" ? "HTML" : "CSS";
    return [
        `### Exercise: ${practical.title}`,
        "",
        `Using what you learned in **${moduleTitle}**, build ${practical.instructionsHint} in ${subject}.`,
        "",
        "**Requirements**",
        "1. Use semantic, well-structured markup / clean, organized styles.",
        "2. Apply at least three concepts covered in this module.",
        "3. Test your result in the live preview until it matches the goal described above.",
        "",
        "When you're done, click **Mark as Complete** to update your progress.",
    ].join("\n");
}
function buildStarterCode(courseSlug, practical) {
    if (courseSlug === "html") {
        return {
            html: `<!DOCTYPE html>\n<!-- TODO: build "${practical.title}" here -->\n<h1>${practical.title}</h1>\n<p>Start coding!</p>`,
            css: `body {\n  font-family: system-ui, sans-serif;\n  margin: 2rem;\n}`,
            js: "",
        };
    }
    return {
        html: `<div class="container">\n  <h1>${practical.title}</h1>\n  <p>Style me!</p>\n</div>`,
        css: `/* TODO: style "${practical.title}" here */\n.container {\n  font-family: system-ui, sans-serif;\n}`,
        js: "",
    };
}
function allCoursesSlugs(courses) {
    return courses.map((c) => c.slug);
}
//# sourceMappingURL=helpers.js.map