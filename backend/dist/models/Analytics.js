"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analytics = void 0;
const mongoose_1 = require("mongoose");
const AnalyticsSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    date: { type: Date, required: true, default: Date.now },
    tasksCompleted: { type: Number, default: 0 },
    goalsAchieved: { type: Number, default: 0 },
    habitConsistency: { type: Number, default: 0 },
    focusScore: { type: Number, default: 0 },
    productivityScore: { type: Number, default: 0 },
    aiInsights: { type: String },
}, { timestamps: true });
// Index composite key for quick daily lookup
AnalyticsSchema.index({ userId: 1, date: 1 }, { unique: true });
exports.Analytics = (0, mongoose_1.model)('Analytics', AnalyticsSchema);
//# sourceMappingURL=Analytics.js.map