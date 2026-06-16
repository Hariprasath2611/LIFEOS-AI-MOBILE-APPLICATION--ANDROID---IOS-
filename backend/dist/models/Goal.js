"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goal = void 0;
const mongoose_1 = require("mongoose");
const MilestoneSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
});
const GoalSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['short-term', 'long-term'], default: 'short-term' },
    milestones: { type: [MilestoneSchema], default: [] },
    progress: { type: Number, default: 0 },
    targetDate: { type: Date },
    aiActionPlan: { type: [String], default: [] },
}, { timestamps: true });
exports.Goal = (0, mongoose_1.model)('Goal', GoalSchema);
//# sourceMappingURL=Goal.js.map