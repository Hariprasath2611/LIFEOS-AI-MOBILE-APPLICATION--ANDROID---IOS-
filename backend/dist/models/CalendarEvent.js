"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarEvent = void 0;
const mongoose_1 = require("mongoose");
const CalendarEventSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['task', 'habit', 'goal', 'meeting'], default: 'meeting' },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    referenceId: { type: String },
}, { timestamps: true });
exports.CalendarEvent = (0, mongoose_1.model)('CalendarEvent', CalendarEventSchema);
//# sourceMappingURL=CalendarEvent.js.map