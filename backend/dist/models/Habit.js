"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Habit = void 0;
const mongoose_1 = require("mongoose");
const HabitSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    category: { type: String, default: 'Health' },
    frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
    history: { type: [Date], default: [] },
    streak: { type: Number, default: 0 },
    aiSuggestions: { type: [String], default: [] },
}, { timestamps: true });
exports.Habit = (0, mongoose_1.model)('Habit', HabitSchema);
//# sourceMappingURL=Habit.js.map