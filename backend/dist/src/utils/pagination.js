"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePagination = parsePagination;
exports.buildMeta = buildMeta;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
function parsePagination(req) {
    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10) || 1);
    const rawLimit = parseInt(String(req.query.limit ?? DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
    const limit = Math.min(Math.max(1, rawLimit), MAX_LIMIT);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}
function buildMeta(page, limit, total) {
    return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
//# sourceMappingURL=pagination.js.map