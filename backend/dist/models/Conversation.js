"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conversation = void 0;
const mongoose_1 = require("mongoose");
const ConversationSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, default: 'New Conversation' },
    pinned: { type: Boolean, default: false },
    summary: { type: String },
}, { timestamps: true });
exports.Conversation = (0, mongoose_1.model)('Conversation', ConversationSchema);
//# sourceMappingURL=Conversation.js.map