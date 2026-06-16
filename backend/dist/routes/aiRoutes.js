"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AIController_1 = require("../controllers/AIController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
// Conversations management
router.get('/conversations', AIController_1.aiController.getConversations);
router.post('/conversations', AIController_1.aiController.createConversation);
router.post('/conversations/:id/pin', AIController_1.aiController.togglePin);
router.delete('/conversations/:id', AIController_1.aiController.deleteConversation);
// Message records
router.get('/conversations/:id/messages', AIController_1.aiController.getMessages);
// Fallback REST chat (Sockets preferred)
router.post('/chat', AIController_1.aiController.sendMessage);
// Voice upload transcription
router.post('/transcribe', uploadMiddleware_1.upload.single('file'), AIController_1.aiController.transcribeAudio);
exports.default = router;
//# sourceMappingURL=aiRoutes.js.map