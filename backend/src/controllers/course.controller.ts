import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { courseService, moduleService, topicService, practicalService } from "../services/course.service";
import { progressService } from "../services/progress.service";
import { parsePagination, buildMeta } from "../utils/pagination";
import { ProgressStatus } from "../../shared/types/enums";

export const courseController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const courses = await courseService.listCourses();
    ApiResponse.ok(res, courses);
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const { course, modules } = await courseService.getCourseBySlug(req.params.slug);

    let progressByModule: Record<string, { percent: number; completedCount: number }> = {};
    if (req.user) {
      const summary = await progressService.getCourseProgress(req.user.id, req.params.slug);
      progressByModule = Object.fromEntries(
        summary.modules.map((m) => [m.moduleId, { percent: m.percent, completedCount: m.completedCount }])
      );
    }

    const modulesWithProgress = modules.map((m) => ({
      ...m.toObject(),
      progress: progressByModule[m._id.toString()] ?? null,
    }));

    ApiResponse.ok(res, { course, modules: modulesWithProgress });
  }),
};

export const moduleController = {
  getById: asyncHandler(async (req: Request, res: Response) => {
    const data = await moduleService.getModuleById(req.params.id);
    ApiResponse.ok(res, data);
  }),
};

export const topicController = {
  getById: asyncHandler(async (req: Request, res: Response) => {
    const data = await topicService.getTopicById(req.params.id, req.user?.id);

    if (req.user && (!data.progress || data.progress.status === ProgressStatus.NOT_STARTED)) {
      await progressService.setTopicStatus(req.user.id, req.params.id, ProgressStatus.IN_PROGRESS);
      data.progress = { status: ProgressStatus.IN_PROGRESS };
    }

    ApiResponse.ok(res, data);
  }),

  complete: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const progress = await progressService.setTopicStatus(req.user.id, req.params.id, ProgressStatus.COMPLETED);
    ApiResponse.ok(res, progress, "Topic marked as complete");
  }),

  search: asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req);
    const { results, total } = await topicService.search(String(req.query.q), pagination);
    ApiResponse.paginated(res, results, buildMeta(pagination.page, pagination.limit, total));
  }),
};

export const practicalController = {
  getById: asyncHandler(async (req: Request, res: Response) => {
    const practical = await practicalService.getPracticalById(req.params.id);
    ApiResponse.ok(res, practical);
  }),
};
