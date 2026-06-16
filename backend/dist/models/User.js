"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    uid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String },
    photoURL: { type: String },
    interests: { type: [String], default: [] },
    goals: { type: [String], default: [] },
    learningTopics: { type: [String], default: [] },
    productivityScore: { type: Number, default: 0 },
    preferences: {
        notificationsEnabled: { type: Boolean, default: true },
        aiAssistantEnabled: { type: Boolean, default: true },
        theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', UserSchema);
//# sourceMappingURL=User.js.map