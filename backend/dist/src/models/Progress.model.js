"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../../shared/types/enums");
const progressSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    moduleId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Module", required: true, index: true },
    topicId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Topic", required: true },
    status: {
        type: String,
        enum: Object.values(enums_1.ProgressStatus),
        default: enums_1.ProgressStatus.NOT_STARTED,
    },
    completedAt: { type: Date, default: null },
    lastAccessedAt: { type: Date, default: Date.now },
}, { timestamps: true });
progressSchema.index({ userId: 1, topicId: 1 }, { unique: true });
progressSchema.index({ userId: 1, courseId: 1, status: 1 });
progressSchema.index({ userId: 1, moduleId: 1, status: 1 });
exports.Progress = (0, mongoose_1.model)("Progress", progressSchema);
//# sourceMappingURL=Progress.model.js.map