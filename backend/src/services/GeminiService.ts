import { getGeminiModel, isGeminiConfigured } from '../config/gemini';
import { SYSTEM_PROMPTS } from '../prompts';

export class GeminiService {
  private async executePrompt(systemPrompt: string, userPrompt: string, isJson = false): Promise<string> {
    const model = getGeminiModel('gemini-1.5-flash');
    
    if (!model) {
      // Return mock data if Gemini API key is missing
      return this.getMockResponse(systemPrompt, userPrompt);
    }

    try {
      // Set options, requesting JSON schema output if specified
      const generationConfig = isJson 
        ? { responseMimeType: "application/json" } 
        : undefined;

      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Input: ${userPrompt}` }] }
        ],
        generationConfig
      });

      const responseText = result.response.text();
      return responseText;
    } catch (error) {
      console.error('Gemini API call failed, using mock data:', error);
      return this.getMockResponse(systemPrompt, userPrompt);
    }
  }

  async generateChatResponse(userMessage: string, chatContext: string): Promise<string> {
    const system = `${SYSTEM_PROMPTS.CHAT_ASSISTANT}\nHere is some context from conversation history:\n${chatContext}`;
    return this.executePrompt(system, userMessage, false);
  }

  async prioritizeTasks(tasks: any[]): Promise<any> {
    const userPrompt = JSON.stringify(tasks);
    const rawResult = await this.executePrompt(SYSTEM_PROMPTS.TASK_PRIORITIZATION, userPrompt, true);
    try {
      return JSON.parse(this.cleanJsonString(rawResult));
    } catch (e) {
      console.error('Failed to parse Task AI result, fallback to mock:', e);
      return JSON.parse(this.getMockResponse(SYSTEM_PROMPTS.TASK_PRIORITIZATION, userPrompt));
    }
  }

  async breakdownGoal(title: string, description: string): Promise<any> {
    const userPrompt = `Goal Title: ${title}\nDescription: ${description}`;
    const rawResult = await this.executePrompt(SYSTEM_PROMPTS.GOAL_BREAKDOWN, userPrompt, true);
    try {
      return JSON.parse(this.cleanJsonString(rawResult));
    } catch (e) {
      return JSON.parse(this.getMockResponse(SYSTEM_PROMPTS.GOAL_BREAKDOWN, userPrompt));
    }
  }

  async suggestHabits(interests: string[], goals: string[]): Promise<any> {
    const userPrompt = `User Interests: ${interests.join(', ')}\nGoals: ${goals.join(', ')}`;
    const rawResult = await this.executePrompt(SYSTEM_PROMPTS.HABIT_RECOMMENDATIONS, userPrompt, true);
    try {
      return JSON.parse(this.cleanJsonString(rawResult));
    } catch (e) {
      return JSON.parse(this.getMockResponse(SYSTEM_PROMPTS.HABIT_RECOMMENDATIONS, userPrompt));
    }
  }

  async generateRoadmap(topic: string, difficulty: string): Promise<any> {
    const userPrompt = `Topic: ${topic}\nDifficulty level: ${difficulty}`;
    const rawResult = await this.executePrompt(SYSTEM_PROMPTS.LEARNING_ROADMAP, userPrompt, true);
    try {
      return JSON.parse(this.cleanJsonString(rawResult));
    } catch (e) {
      return JSON.parse(this.getMockResponse(SYSTEM_PROMPTS.LEARNING_ROADMAP, userPrompt));
    }
  }

  async summarizeNote(content: string): Promise<any> {
    const rawResult = await this.executePrompt(SYSTEM_PROMPTS.NOTE_SUMMARY, content, true);
    try {
      return JSON.parse(this.cleanJsonString(rawResult));
    } catch (e) {
      return JSON.parse(this.getMockResponse(SYSTEM_PROMPTS.NOTE_SUMMARY, content));
    }
  }

  async runLifeCoaching(metrics: any): Promise<string> {
    const userPrompt = JSON.stringify(metrics);
    return this.executePrompt(SYSTEM_PROMPTS.LIFE_COACH, userPrompt, false);
  }

  private cleanJsonString(str: string): string {
    // Remove markdown codeblock backticks if Gemini responds with them
    return str.replace(/```json\n?|```/g, '').trim();
  }

  private getMockResponse(systemPrompt: string, userPrompt: string): string {
    if (systemPrompt.includes(SYSTEM_PROMPTS.CHAT_ASSISTANT)) {
      return `I am here as your LifeOS AI Assistant. (Running in demo offline mode)

You mentioned: "${userPrompt}". I can help you structure this request into tasks, habits, or schedule it onto your calendar. What would you like to achieve today?`;
    }

    if (systemPrompt === SYSTEM_PROMPTS.TASK_PRIORITIZATION) {
      try {
        const tasks = JSON.parse(userPrompt);
        const ids = tasks.map((t: any) => t._id || t.id || 'task_id');
        return JSON.stringify({
          prioritizedTaskIds: ids,
          scheduleSuggestions: ids.map((id: string, index: number) => ({
            taskId: id,
            suggestedTime: index % 2 === 0 ? 'morning' : 'afternoon',
            reason: 'Auto-prioritized based on deadline safety margins.'
          })),
          insights: ['Complete your urgent tasks in the morning for optimal cognitive focus.']
        });
      } catch {
        return JSON.stringify({ prioritizedTaskIds: [], scheduleSuggestions: [], insights: [] });
      }
    }

    if (systemPrompt === SYSTEM_PROMPTS.GOAL_BREAKDOWN) {
      return JSON.stringify({
        milestones: ['Setup initial foundation', 'Build prototype and execute core functionalities', 'Perform validations and launch'],
        actionPlan: ['Draft conceptual models', 'Configure environments and credentials', 'Implement test suites', 'Publish first deployable version']
      });
    }

    if (systemPrompt === SYSTEM_PROMPTS.HABIT_RECOMMENDATIONS) {
      return JSON.stringify({
        recommendations: [
          { title: 'Read 15 Pages', category: 'Growth', frequency: 'daily', rationale: 'Directly helps expand your knowledge base' },
          { title: 'Weekly Review Session', category: 'Productivity', frequency: 'weekly', rationale: 'Helps track goals alignment' },
          { title: 'Daily Focus Walk', category: 'Health', frequency: 'daily', rationale: 'Increases cardiovascular output and mental clarity' }
        ]
      });
    }

    if (systemPrompt === SYSTEM_PROMPTS.LEARNING_ROADMAP) {
      return JSON.stringify({
        title: `Mastering ${userPrompt.split('\n')[0].replace('Topic: ', '')}`,
        description: 'A curated pathway optimized for deep retention and practical execution.',
        steps: [
          { title: 'Fundamentals & Core Mechanics', duration: '1 week', content: 'Explore core definitions, setups, syntax, and foundational architectures.' },
          { title: 'Intermediate Patterns & APIs', duration: '1.5 weeks', content: 'Design simple modules, study integration paths, and structure standard workflows.' },
          { title: 'Advanced Architectures & Scaling', duration: '2 weeks', content: 'Understand optimizations, caching layers, secure routing, and database queries.' },
          { title: 'Testing & Integrity Validation', duration: '1 week', content: 'Write robust integration specs, coverage analysis, and automated workflows.' },
          { title: 'Production Release & Operations', duration: '1 week', content: 'Build builds, configure environment variables, setup CDN assets, and launch app.' }
        ]
      });
    }

    if (systemPrompt === SYSTEM_PROMPTS.NOTE_SUMMARY) {
      return JSON.stringify({
        summary: 'A detailed log outlining recent project objectives, notes, and requirements.',
        tags: ['productivity', 'work', 'notes-digest'],
        insights: 'Insight 1: Focus on immediate setup before scaling.\nInsight 2: Standardize data structures early to avoid breaking revisions.'
      });
    }

    if (systemPrompt === SYSTEM_PROMPTS.LIFE_COACH) {
      return `Welcome to your daily Life Coach check-in! 

Looking at your metrics, you are showing high consistency. Focus on your most challenging items today and take micro-breaks to preserve cognitive efficiency. Let's make this day highly impactful!`;
    }

    return 'Default fallback response';
  }
}

export const geminiService = new GeminiService();
