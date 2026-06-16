import { Router } from 'express';
import { aiController } from '../controllers/AIController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

router.use(authMiddleware);

// Conversations management
router.get('/conversations', aiController.getConversations);
router.post('/conversations', aiController.createConversation);
router.post('/conversations/:id/pin', aiController.togglePin);
router.delete('/conversations/:id', aiController.deleteConversation);

// Message records
router.get('/conversations/:id/messages', aiController.getMessages);

// Fallback REST chat (Sockets preferred)
router.post('/chat', aiController.sendMessage);

// Voice upload transcription
router.post('/transcribe', upload.single('file'), aiController.transcribeAudio);

export default router;
