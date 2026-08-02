"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSecureToken = generateSecureToken;
exports.hashToken = hashToken;
const crypto_1 = __importDefault(require("crypto"));
function generateSecureToken(bytes = 32) {
    const raw = crypto_1.default.randomBytes(bytes).toString("hex");
    const hash = crypto_1.default.createHash("sha256").update(raw).digest("hex");
    return { raw, hash };
}
function hashToken(raw) {
    return crypto_1.default.createHash("sha256").update(raw).digest("hex");
}
//# sourceMappingURL=tokenGenerator.js.map