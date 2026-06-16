"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const TaskSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    category: { type: String, default: 'General' },
    dueDate: { type: Date },
    recurrence: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
    aiPrioritized: { type: Boolean, default: false },
    suggestedByAI: { type: Boolean, default: false },
}, { timestamps: true });
exports.Task = (0, mongoose_1.model)('Task', TaskSchema);
//# sourceMappingURL=Task.js.map