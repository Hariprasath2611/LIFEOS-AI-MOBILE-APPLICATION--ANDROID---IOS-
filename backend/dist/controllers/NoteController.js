"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteController = exports.NoteController = void 0;
const NoteService_1 = require("../services/NoteService");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
class NoteController {
    async getNotes(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const notes = await NoteService_1.noteService.getNotes(req.user.uid);
            res.json(notes);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch notes' });
        }
    }
    async getNoteById(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const note = await NoteService_1.noteService.getNoteById(req.user.uid, id);
            if (!note) {
                res.status(404).json({ error: 'Note not found' });
                return;
            }
            res.json(note);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch note' });
        }
    }
    async createNote(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const note = await NoteService_1.noteService.createNote(req.user.uid, req.body);
            res.status(201).json(note);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create note' });
        }
    }
    async updateNote(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const updated = await NoteService_1.noteService.updateNote(req.user.uid, id, req.body);
            if (!updated) {
                res.status(404).json({ error: 'Note not found' });
                return;
            }
            res.json(updated);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update note' });
        }
    }
    async deleteNote(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const deleted = await NoteService_1.noteService.deleteNote(req.user.uid, id);
            if (!deleted) {
                res.status(404).json({ error: 'Note not found' });
                return;
            }
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete note' });
        }
    }
    /**
     * Upload an attachment to Cloudinary and attach the URL to the specified note.
     */
    async uploadAttachment(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const { type } = req.body; // 'image', 'audio', 'document'
            const file = req.file;
            if (!file) {
                res.status(400).json({ error: 'No file uploaded' });
                return;
            }
            if (!type || !['image', 'audio', 'document'].includes(type)) {
                res.status(400).json({ error: 'Invalid attachment type specified' });
                return;
            }
            const note = await NoteService_1.noteService.getNoteById(req.user.uid, id);
            if (!note) {
                res.status(404).json({ error: 'Note not found' });
                return;
            }
            const fileName = `${Date.now()}_${file.originalname}`;
            const url = await (0, uploadMiddleware_1.uploadToCloudinary)(file.buffer, 'attachments', fileName);
            // Save attachment details to the note document
            note.attachments.push({ type, url });
            await note.save();
            res.json(note);
        }
        catch (error) {
            console.error('Attachment upload failed:', error);
            res.status(500).json({ error: 'Failed to upload attachment' });
        }
    }
}
exports.NoteController = NoteController;
exports.noteController = new NoteController();
//# sourceMappingURL=NoteController.js.map