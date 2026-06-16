"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memory = void 0;
const mongoose_1 = require("mongoose");
const MemorySchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    conversationId: { type: String, required: true, index: true },
    sender: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
    embedding: { type: [Number], default: [] },
    metadata: { type: Map, of: mongoose_1.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now },
});
exports.Memory = (0, mongoose_1.model)('Memory', MemorySchema);
//# sourceMappingURL=Memory.js.map