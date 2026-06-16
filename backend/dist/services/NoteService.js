"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteService = exports.NoteService = void 0;
const repositories_1 = require("../repositories");
const GeminiService_1 = require("./GeminiService");
class NoteService {
    async createNote(userId, noteData) {
        const note = await repositories_1.noteRepo.create({ ...noteData, userId });
        // Auto-generate AI summary and tags if content exists
        if (note.content && note.content.length > 50) {
            await this.enrichNoteWithAI(note);
        }
        return note;
    }
    async getNotes(userId) {
        return repositories_1.noteRepo.findByUserId(userId);
    }
    async getNoteById(userId, noteId) {
        return repositories_1.noteRepo.findOne({ _id: noteId, userId });
    }
    async updateNote(userId, noteId, updateData) {
        const note = await repositories_1.noteRepo.update({ _id: noteId, userId }, updateData);
        // Trigger AI summarization if content has changed substantially
        if (note && updateData.content && updateData.content.length > 50) {
            await this.enrichNoteWithAI(note);
        }
        return note;
    }
    async deleteNote(userId, noteId) {
        const result = await repositories_1.noteRepo.delete({ _id: noteId, userId });
        return result.deletedCount > 0;
    }
    async enrichNoteWithAI(note) {
        try {
            const aiResults = await GeminiService_1.geminiService.summarizeNote(note.content);
            if (aiResults) {
                note.aiSummary = aiResults.summary;
                note.aiTags = aiResults.tags || [];
                note.aiInsights = aiResults.insights;
                await note.save();
            }
        }
        catch (error) {
            console.error('Failed to enrich note with AI:', error);
        }
    }
}
exports.NoteService = NoteService;
exports.noteService = new NoteService();
//# sourceMappingURL=NoteService.js.map