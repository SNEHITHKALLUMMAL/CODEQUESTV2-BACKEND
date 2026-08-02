import { computeCourseProgress } from "../../src/utils/computeCourseProgress";

function mod(overrides: Partial<Parameters<typeof computeCourseProgress>[0][number]> = {}) {
  return {
    moduleId: "m1",
    title: "Module",
    slug: "module",
    order: 1,
    importance: "standard",
    topicCount: 10,
    completedCount: 0,
    ...overrides,
  };
}

describe("computeCourseProgress", () => {
  it("computes 0% for a course with no completions", () => {
    const result = computeCourseProgress([mod({ topicCount: 10, completedCount: 0 })]);
    expect(result.percent).toBe(0);
    expect(result.modules[0].percent).toBe(0);
  });

  it("computes 100% when every topic in every module is completed", () => {
    const result = computeCourseProgress([
      mod({ moduleId: "m1", topicCount: 5, completedCount: 5 }),
      mod({ moduleId: "m2", topicCount: 3, completedCount: 3 }),
    ]);
    expect(result.percent).toBe(100);
    expect(result.modules.every((m) => m.percent === 100)).toBe(true);
  });

  it("computes a correctly weighted overall percent across modules of different sizes", () => {
    // Module 1: 8/10 topics done. Module 2: 1/2 topics done. Total: 9/12 = 75%.
    const result = computeCourseProgress([
      mod({ moduleId: "m1", topicCount: 10, completedCount: 8 }),
      mod({ moduleId: "m2", topicCount: 2, completedCount: 1 }),
    ]);
    expect(result.totalTopics).toBe(12);
    expect(result.completedTopics).toBe(9);
    expect(result.percent).toBe(75);
    // Per-module percentages are independent of overall weighting.
    expect(result.modules.find((m) => m.moduleId === "m1")?.percent).toBe(80);
    expect(result.modules.find((m) => m.moduleId === "m2")?.percent).toBe(50);
  });

  it("does not divide by zero for a module with no topics yet", () => {
    const result = computeCourseProgress([mod({ topicCount: 0, completedCount: 0 })]);
    expect(result.modules[0].percent).toBe(0);
    expect(Number.isNaN(result.modules[0].percent)).toBe(false);
  });

  it("returns 0% for a course with zero modules", () => {
    const result = computeCourseProgress([]);
    expect(result.percent).toBe(0);
    expect(result.totalTopics).toBe(0);
  });

  it("rounds to the nearest whole percent", () => {
    // 1/3 = 33.33...% -> should round to 33
    const result = computeCourseProgress([mod({ topicCount: 3, completedCount: 1 })]);
    expect(result.percent).toBe(33);
  });
});
