"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static ok(res, data, message = "OK", statusCode = 200) {
        return res.status(statusCode).json({ success: true, message, data });
    }
    static created(res, data, message = "Created") {
        return res.status(201).json({ success: true, message, data });
    }
    static noContent(res) {
        return res.status(204).send();
    }
    static paginated(res, data, meta, message = "OK") {
        return res.status(200).json({ success: true, message, data, meta });
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map