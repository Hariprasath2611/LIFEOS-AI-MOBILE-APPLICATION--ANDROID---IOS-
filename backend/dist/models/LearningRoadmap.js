"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningRoadmap = void 0;
const mongoose_1 = require("mongoose");
const RoadmapStepSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    duration: { type: String, required: true },
    content: { type: String, required: true },
    completed: { type: Boolean, default: false },
});
const LearningRoadmapSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    steps: { type: [RoadmapStepSchema], default: [] },
    progress: { type: Number, default: 0 },
}, { timestamps: true });
exports.LearningRoadmap = (0, mongoose_1.model)('LearningRoadmap', LearningRoadmapSchema);
//# sourceMappingURL=LearningRoadmap.js.map