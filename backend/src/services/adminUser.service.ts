import { User } from "../models/User.model";
import { ApiError } from "../utils/ApiError";
import { ParsedPagination, buildMeta } from "../utils/pagination";
import { UserRole } from "../../shared/types/enums";

interface ListUsersFilter {
  search?: string;
  role?: string;
}

export const adminUserService = {
  async list(pagination: ParsedPagination, filter: ListUsersFilter) {
    const query: Record<string, unknown> = {};
    if (filter.role) query.role = filter.role;
    if (filter.search) {
      const re = new RegExp(filter.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ name: re }, { email: re }];
    }

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit),
      User.countDocuments(query),
    ]);

    return { users, meta: buildMeta(pagination.page, pagination.limit, total) };
  },

  async updateRole(adminId: string, targetUserId: string, role: UserRole) {
    if (adminId === targetUserId && role !== UserRole.ADMIN) {
      throw ApiError.badRequest("You cannot remove your own admin role");
    }
    const user = await User.findByIdAndUpdate(targetUserId, { role }, { new: true });
    if (!user) throw ApiError.notFound("User not found");
    return user;
  },

  async updateStatus(adminId: string, targetUserId: string, isActive: boolean) {
    if (adminId === targetUserId && !isActive) {
      throw ApiError.badRequest("You cannot deactivate your own account");
    }
    const user = await User.findByIdAndUpdate(targetUserId, { isActive }, { new: true });
    if (!user) throw ApiError.notFound("User not found");
    return user;
  },

  async getById(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("User not found");
    return user;
  },
};
