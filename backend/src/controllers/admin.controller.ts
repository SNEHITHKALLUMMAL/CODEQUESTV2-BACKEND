import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { adminUserService } from "../services/adminUser.service";
import { adminContentService } from "../services/adminContent.service";
import { analyticsService } from "../services/analytics.service";
import { settingsService } from "../services/settings.service";
import { mediaService } from "../services/media.service";
import { parsePagination } from "../utils/pagination";

function requireAdmin(req: Request): string {
  if (!req.user) throw ApiError.unauthorized();
  return req.user.id;
}

export const adminUserController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    requireAdmin(req);
    const pagination = parsePagination(req);
    const { users, meta } = await adminUserService.list(pagination, {
      search: req.query.search as string | undefined,
      role: req.query.role as string | undefined,
    });
    ApiResponse.paginated(res, users, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    requireAdmin(req);
    const user = await adminUserService.getById(req.params.id);
    ApiResponse.ok(res, user);
  }),

  updateRole: asyncHandler(async (req: Request, res: Response) => {
    const adminId = requireAdmin(req);
    const user = await adminUserService.updateRole(adminId, req.params.id, req.body.role);
    ApiResponse.ok(res, user, "Role updated");
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const adminId = requireAdmin(req);
    const user = await adminUserService.updateStatus(adminId, req.params.id, req.body.isActive);
    ApiResponse.ok(res, user, req.body.isActive ? "User reactivated" : "User deactivated");
  }),
};

function makeCrudController<T extends keyof typeof adminContentService>(resource: T) {
  const service = adminContentService[resource];
  return {
    list: asyncHandler(async (req: Request, res: Response) => {
      requireAdmin(req);
      const filterKey = "moduleId" in req.query ? "moduleId" : "courseId";
      const filterValue = req.query[filterKey] as string | undefined;
      const items = await (service.list as (filter?: string) => Promise<unknown>)(filterValue);
      ApiResponse.ok(res, items);
    }),
    create: asyncHandler(async (req: Request, res: Response) => {
      requireAdmin(req);
      const item = await service.create(req.body);
      ApiResponse.created(res, item);
    }),
    update: asyncHandler(async (req: Request, res: Response) => {
      requireAdmin(req);
      const item = await service.update(req.params.id, req.body);
      ApiResponse.ok(res, item, "Updated");
    }),
    remove: asyncHandler(async (req: Request, res: Response) => {
      requireAdmin(req);
      await service.remove(req.params.id);
      ApiResponse.noContent(res);
    }),
  };
}

export const adminCourseController = makeCrudController("courses");
export const adminModuleController = makeCrudController("modules");
export const adminTopicController = {
  ...makeCrudController("topics"),
  getById: asyncHandler(async (req: Request, res: Response) => {
    requireAdmin(req);
    const topic = await adminContentService.topics.getById(req.params.id);
    ApiResponse.ok(res, topic);
  }),
};
export const adminPracticalController = makeCrudController("practicals");
export const adminQuizController = makeCrudController("quizzes");

export const adminAnalyticsController = {
  overview: asyncHandler(async (req: Request, res: Response) => {
    requireAdmin(req);
    const overview = await analyticsService.getOverview();
    ApiResponse.ok(res, overview);
  }),
  courseCompletion: asyncHandler(async (req: Request, res: Response) => {
    requireAdmin(req);
    const rates = await analyticsService.getCourseCompletionRates();
    ApiResponse.ok(res, rates);
  }),
};

export const adminSettingsController = {
  get: asyncHandler(async (req: Request, res: Response) => {
    requireAdmin(req);
    const settings = await settingsService.getAll();
    ApiResponse.ok(res, settings);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    requireAdmin(req);
    const settings = await settingsService.updateMany(req.body);
    ApiResponse.ok(res, settings, "Settings updated");
  }),
};

export const adminMediaController = {
  upload: asyncHandler(async (req: Request, res: Response) => {
    requireAdmin(req);
    if (!req.file) throw ApiError.badRequest("No file uploaded");
    const result = await mediaService.uploadImage(req.file);
    ApiResponse.ok(res, result, "Uploaded");
  }),
};
