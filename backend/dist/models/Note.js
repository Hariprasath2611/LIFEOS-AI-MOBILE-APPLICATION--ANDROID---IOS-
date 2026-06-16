"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const mongoose_1 = require("mongoose");
const NoteAttachmentSchema = new mongoose_1.Schema({
    type: { type: String, enum: ['image', 'audio', 'document'], required: true },
    url: { type: String, required: true },
});
const NoteSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, default: 'Untitled Note' },
    content: { type: String, default: '' },
    tags: { type: [String], default: [] },
    folder: { type: String, default: 'Uncategorized' },
    attachments: { type: [NoteAttachmentSchema], default: [] },
    isFavorite: { type: Boolean, default: false },
    aiSummary: { type: String },
    aiTags: { type: [String], default: [] },
    aiInsights: { type: String },
}, { timestamps: true });
exports.Note = (0, mongoose_1.model)('Note', NoteSchema);
//# sourceMappingURL=Note.js.map