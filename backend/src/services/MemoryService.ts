import { memoryRepo } from '../repositories';
import { IMemory } from '../models/Memory';

export class MemoryService {
  /**
   * Save a chat message or general context snippet to Memory.
   */
  async saveMemory(
    userId: string,
    conversationId: string,
    sender: 'user' | 'ai',
    content: string,
    metadata: Record<string, any> = {}
  ): Promise<IMemory> {
    return memoryRepo.create({
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
  async retrieveContext(userId: string, currentMessage: string, limit = 5): Promise<string> {
    // 1. Fetch recent messages in the conversation (latest 3)
    const recentMemories = await memoryRepo.find(
      { userId },
      { sort: { createdAt: -1 }, limit: 10 }
    );

    // 2. Perform a keyword lookup on history to find semantically relevant old conversations
    const keywords = this.extractKeywords(currentMessage);
    let relevantMemories: IMemory[] = [];

    if (keywords.length > 0) {
      const regexPatterns = keywords.map(kw => new RegExp(kw, 'i'));
      relevantMemories = await memoryRepo.find({
        userId,
        content: { $in: regexPatterns },
        // Don't duplicate the recent memories
        _id: { $nin: recentMemories.map(m => m._id) }
      }, { limit });
    }

    // 3. Rank and format context
    const allContexts = [...relevantMemories, ...recentMemories.reverse()];
    
    // De-duplicate items by id
    const uniqueContextsMap = new Map<string, IMemory>();
    allContexts.forEach(c => uniqueContextsMap.set(c._id.toString(), c));
    const finalContexts = Array.from(uniqueContextsMap.values());

    return finalContexts
      .map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');
  }

  /**
   * Simple helper to extract search terms.
   */
  private extractKeywords(text: string): string[] {
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

export const memoryService = new MemoryService();
