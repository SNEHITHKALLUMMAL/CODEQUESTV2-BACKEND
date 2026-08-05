export interface ModuleProgressInput {
  moduleId: string;
  title: string;
  slug: string;
  order: number;
  importance: string;
  topicCount: number;
  completedCount: number;
}

export interface ModuleProgressResult extends ModuleProgressInput {
  percent: number;
}

export interface CourseProgressResult {
  totalTopics: number;
  completedTopics: number;
  percent: number;
  modules: ModuleProgressResult[];
}

function percentOf(completed: number, total: number): number {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

export function computeCourseProgress(modules: ModuleProgressInput[]): CourseProgressResult {
  const withPercent: ModuleProgressResult[] = modules.map((m) => ({
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
