import { Router } from 'express';
import { noteController } from '../controllers/NoteController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.post('/', noteController.createNote);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

// Attachment upload endpoint
router.post('/:id/attachment', upload.single('file'), noteController.uploadAttachment);

export default router;
