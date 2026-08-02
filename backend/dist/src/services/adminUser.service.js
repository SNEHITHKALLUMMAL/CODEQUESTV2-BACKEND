"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserService = void 0;
const User_model_1 = require("../models/User.model");
const ApiError_1 = require("../utils/ApiError");
const pagination_1 = require("../utils/pagination");
const enums_1 = require("../../shared/types/enums");
exports.adminUserService = {
    async list(pagination, filter) {
        const query = {};
        if (filter.role)
            query.role = filter.role;
        if (filter.search) {
            const re = new RegExp(filter.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            query.$or = [{ name: re }, { email: re }];
        }
        const [users, total] = await Promise.all([
            User_model_1.User.find(query).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit),
            User_model_1.User.countDocuments(query),
        ]);
        return { users, meta: (0, pagination_1.buildMeta)(pagination.page, pagination.limit, total) };
    },
    async updateRole(adminId, targetUserId, role) {
        if (adminId === targetUserId && role !== enums_1.UserRole.ADMIN) {
            throw ApiError_1.ApiError.badRequest("You cannot remove your own admin role");
        }
        const user = await User_model_1.User.findByIdAndUpdate(targetUserId, { role }, { new: true });
        if (!user)
            throw ApiError_1.ApiError.notFound("User not found");
        return user;
    },
    async updateStatus(adminId, targetUserId, isActive) {
        if (adminId === targetUserId && !isActive) {
            throw ApiError_1.ApiError.badRequest("You cannot deactivate your own account");
        }
        const user = await User_model_1.User.findByIdAndUpdate(targetUserId, { isActive }, { new: true });
        if (!user)
            throw ApiError_1.ApiError.notFound("User not found");
        return user;
    },
    async getById(userId) {
        const user = await User_model_1.User.findById(userId);
        if (!user)
            throw ApiError_1.ApiError.notFound("User not found");
        return user;
    },
};
//# sourceMappingURL=adminUser.service.js.map