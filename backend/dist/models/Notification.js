"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, enum: ['reminder', 'recommendation', 'chat'], default: 'reminder' },
    read: { type: Boolean, default: false },
    scheduledAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.Notification = (0, mongoose_1.model)('Notification', NotificationSchema);
//# sourceMappingURL=Notification.js.map