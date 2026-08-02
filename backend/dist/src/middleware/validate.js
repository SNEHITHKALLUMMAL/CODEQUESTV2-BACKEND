"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
/**
 * validate(schema, "body") -> parses+replaces req.body with the Zod-validated
 * (and type-coerced) result, or forwards a 400 ApiError with field-level
 * messages. Used on every mutating route from Phase 5 onward.
 */
function validate(schema, target = "body") {
    return (req, _res, next) => {
        try {
            const parsed = schema.parse(req[target]);
            req[target] = parsed;
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const fieldErrors = err.issues.map((issue) => ({
                    field: issue.path.join(".") || target,
                    message: issue.message,
                }));
                next(ApiError_1.ApiError.badRequest("Validation failed", fieldErrors));
                return;
            }
            next(err);
        }
    };
}
//# sourceMappingURL=validate.js.map