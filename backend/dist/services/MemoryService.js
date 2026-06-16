"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryService = exports.MemoryService = void 0;
const repositories_1 = require("../repositories");
class MemoryService {
    /**
     * Save a chat message or general context snippet to Memory.
     */
    async saveMemory(userId, conversationId, sender, content, metadata = {}) {
        return repositories_1.memoryRepo.create({
            userId,
            conversationId,
            sender,
            content,
            metadata,
        });
    }
    /**
     * Fetch context for the AI prompt based on current query.
     * Matches recent messages and performs keyword ranking to fetch relevant historical contexts.
     */
    async retrieveContext(userId, currentMessage, limit = 5) {
        // 1. Fetch recent messages in the conversation (latest 3)
        const recentMemories = await repositories_1.memoryRepo.find({ userId }, { sort: { createdAt: -1 }, limit: 10 });
        // 2. Perform a keyword lookup on history to find semantically relevant old conversations
        const keywords = this.extractKeywords(currentMessage);
        let relevantMemories = [];
        if (keywords.length > 0) {
            const regexPatterns = keywords.map(kw => new RegExp(kw, 'i'));
            relevantMemories = await repositories_1.memoryRepo.find({
                userId,
                content: { $in: regexPatterns },
                // Don't duplicate the recent memories
                _id: { $nin: recentMemories.map(m => m._id) }
            }, { limit });
        }
        // 3. Rank and format context
        const allContexts = [...relevantMemories, ...recentMemories.reverse()];
        // De-duplicate items by id
        const uniqueContextsMap = new Map();
        allContexts.forEach(c => uniqueContextsMap.set(c._id.toString(), c));
        const finalContexts = Array.from(uniqueContextsMap.values());
        return finalContexts
            .map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
            .join('\n');
    }
    /**
     * Simple helper to extract search terms.
     */
    extractKeywords(text) {
        const cleanText = text.replace(/[^a-zA-Z0-9\s]/g, ' ');
        const words = cleanText.split(/\s+/);
        // Filter out common stop words
        const stopWords = new Set([
            'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'to', 'for', 'in', 'of',
            'i', 'you', 'he', 'she', 'they', 'we', 'my', 'your', 'me', 'how', 'what', 'why'
        ]);
        return words
            .map(w => w.toLowerCase().trim())
            .filter(w => w.length > 3 && !stopWords.has(w));
    }
}
exports.MemoryService = MemoryService;
exports.memoryService = new MemoryService();
//# sourceMappingURL=MemoryService.js.map