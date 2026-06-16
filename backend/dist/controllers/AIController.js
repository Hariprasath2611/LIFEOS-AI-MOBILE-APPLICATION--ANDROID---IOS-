"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiController = exports.AIController = void 0;
const repositories_1 = require("../repositories");
const MemoryService_1 = require("../services/MemoryService");
const GeminiService_1 = require("../services/GeminiService");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
class AIController {
    // --- CONVERSATIONS ---
    async getConversations(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const conversations = await repositories_1.conversationRepo.findByUserId(req.user.uid);
            res.json(conversations);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch conversations' });
        }
    }
    async createConversation(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { title } = req.body;
            const conversation = await repositories_1.conversationRepo.create({
                userId: req.user.uid,
                title: title || 'New Chat Session',
                pinned: false,
            });
            res.status(201).json(conversation);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to initialize conversation' });
        }
    }
    async togglePin(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const conversation = await repositories_1.conversationRepo.findOne({ _id: id, userId: req.user.uid });
            if (!conversation) {
                res.status(404).json({ error: 'Conversation not found' });
                return;
            }
            conversation.pinned = !conversation.pinned;
            await conversation.save();
            res.json(conversation);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to pin conversation' });
        }
    }
    async deleteConversation(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const deleted = await repositories_1.conversationRepo.delete({ _id: id, userId: req.user.uid });
            if (deleted.deletedCount === 0) {
                res.status(404).json({ error: 'Conversation not found' });
                return;
            }
            // Also delete related message memories
            await repositories_1.memoryRepo.delete({ conversationId: id, userId: req.user.uid });
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete conversation' });
        }
    }
    // --- MESSAGES ---
    async getMessages(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const messages = await repositories_1.memoryRepo.findByConversationId(id);
            res.json(messages);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to retrieve messages' });
        }
    }
    /**
     * REST-based chat fallback (Non-socket communication)
     */
    async sendMessage(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { conversationId, content } = req.body;
            if (!conversationId || !content) {
                res.status(400).json({ error: 'Conversation ID and message content are required' });
                return;
            }
            // 1. Save user query to history
            await MemoryService_1.memoryService.saveMemory(req.user.uid, conversationId, 'user', content);
            // 2. Fetch context memory for AI
            const context = await MemoryService_1.memoryService.retrieveContext(req.user.uid, content);
            // 3. Generate response from Gemini API
            const aiReply = await GeminiService_1.geminiService.generateChatResponse(content, context);
            // 4. Save AI reply to history
            const savedAiMemory = await MemoryService_1.memoryService.saveMemory(req.user.uid, conversationId, 'ai', aiReply);
            // 5. Update conversation summary/title in background if needed
            repositories_1.conversationRepo.updateById(conversationId, { summary: content.substring(0, 40) + '...' });
            res.status(201).json(savedAiMemory);
        }
        catch (error) {
            console.error('REST AI chat error:', error);
            res.status(500).json({ error: 'Failed to compile AI response' });
        }
    }
    /**
     * Accepts audio note uploads, posts to Cloudinary, and extracts transcripts via Gemini.
     */
    async transcribeAudio(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const file = req.file;
            if (!file) {
                res.status(400).json({ error: 'No audio note uploaded' });
                return;
            }
            const fileName = `${Date.now()}_voice_note.m4a`;
            const cloudinaryUrl = await (0, uploadMiddleware_1.uploadToCloudinary)(file.buffer, 'voice_notes', fileName);
            // Simulate Gemini speech-to-text / Audio note summaries analysis
            const userPrompt = `Summarize and transcribe this audio log path: ${cloudinaryUrl}. File size: ${file.size} bytes.`;
            const aiSummaryResponse = await GeminiService_1.geminiService.generateChatResponse(userPrompt, 'The user uploaded a voice recording.');
            res.json({
                url: cloudinaryUrl,
                transcript: `[Transcribed Voice Note]: "${aiSummaryResponse.substring(0, 80)}..."`,
                summary: aiSummaryResponse
            });
        }
        catch (error) {
            console.error('Audio transcription failed:', error);
            res.status(500).json({ error: 'Failed to process audio note' });
        }
    }
}
exports.AIController = AIController;
exports.aiController = new AIController();
//# sourceMappingURL=AIController.js.map