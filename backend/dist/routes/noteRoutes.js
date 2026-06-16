"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NoteController_1 = require("../controllers/NoteController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.get('/', NoteController_1.noteController.getNotes);
router.get('/:id', NoteController_1.noteController.getNoteById);
router.post('/', NoteController_1.noteController.createNote);
router.put('/:id', NoteController_1.noteController.updateNote);
router.delete('/:id', NoteController_1.noteController.deleteNote);
// Attachment upload endpoint
router.post('/:id/attachment', uploadMiddleware_1.upload.single('file'), NoteController_1.noteController.uploadAttachment);
exports.default = router;
//# sourceMappingURL=noteRoutes.js.map