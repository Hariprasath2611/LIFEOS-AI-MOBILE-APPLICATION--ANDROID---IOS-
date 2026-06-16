"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiService = exports.GeminiService = void 0;
const gemini_1 = require("../config/gemini");
const prompts_1 = require("../prompts");
class GeminiService {
    async executePrompt(systemPrompt, userPrompt, isJson = false) {
        const model = (0, gemini_1.getGeminiModel)('gemini-1.5-flash');
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
        }
        catch (error) {
            console.error('Gemini API call failed, using mock data:', error);
            return this.getMockResponse(systemPrompt, userPrompt);
        }
    }
    async generateChatResponse(userMessage, chatContext) {
        const system = `${prompts_1.SYSTEM_PROMPTS.CHAT_ASSISTANT}\nHere is some context from conversation history:\n${chatContext}`;
        return this.executePrompt(system, userMessage, false);
    }
    async prioritizeTasks(tasks) {
        const userPrompt = JSON.stringify(tasks);
        const rawResult = await this.executePrompt(prompts_1.SYSTEM_PROMPTS.TASK_PRIORITIZATION, userPrompt, true);
        try {
            return JSON.parse(this.cleanJsonString(rawResult));
        }
        catch (e) {
            console.error('Failed to parse Task AI result, fallback to mock:', e);
            return JSON.parse(this.getMockResponse(prompts_1.SYSTEM_PROMPTS.TASK_PRIORITIZATION, userPrompt));
        }
    }
    async breakdownGoal(title, description) {
        const userPrompt = `Goal Title: ${title}\nDescription: ${description}`;
        const rawResult = await this.executePrompt(prompts_1.SYSTEM_PROMPTS.GOAL_BREAKDOWN, userPrompt, true);
        try {
            return JSON.parse(this.cleanJsonString(rawResult));
        }
        catch (e) {
            return JSON.parse(this.getMockResponse(prompts_1.SYSTEM_PROMPTS.GOAL_BREAKDOWN, userPrompt));
        }
    }
    async suggestHabits(interests, goals) {
        const userPrompt = `User Interests: ${interests.join(', ')}\nGoals: ${goals.join(', ')}`;
        const rawResult = await this.executePrompt(prompts_1.SYSTEM_PROMPTS.HABIT_RECOMMENDATIONS, userPrompt, true);
        try {
            return JSON.parse(this.cleanJsonString(rawResult));
        }
        catch (e) {
            return JSON.parse(this.getMockResponse(prompts_1.SYSTEM_PROMPTS.HABIT_RECOMMENDATIONS, userPrompt));
        }
    }
    async generateRoadmap(topic, difficulty) {
        const userPrompt = `Topic: ${topic}\nDifficulty level: ${difficulty}`;
        const rawResult = await this.executePrompt(prompts_1.SYSTEM_PROMPTS.LEARNING_ROADMAP, userPrompt, true);
        try {
            return JSON.parse(this.cleanJsonString(rawResult));
        }
        catch (e) {
            return JSON.parse(this.getMockResponse(prompts_1.SYSTEM_PROMPTS.LEARNING_ROADMAP, userPrompt));
        }
    }
    async summarizeNote(content) {
        const rawResult = await this.executePrompt(prompts_1.SYSTEM_PROMPTS.NOTE_SUMMARY, content, true);
        try {
            return JSON.parse(this.cleanJsonString(rawResult));
        }
        catch (e) {
            return JSON.parse(this.getMockResponse(prompts_1.SYSTEM_PROMPTS.NOTE_SUMMARY, content));
        }
    }
    async runLifeCoaching(metrics) {
        const userPrompt = JSON.stringify(metrics);
        return this.executePrompt(prompts_1.SYSTEM_PROMPTS.LIFE_COACH, userPrompt, false);
    }
    cleanJsonString(str) {
        // Remove markdown codeblock backticks if Gemini responds with them
        return str.replace(/```json\n?|```/g, '').trim();
    }
    getMockResponse(systemPrompt, userPrompt) {
        if (systemPrompt.includes(prompts_1.SYSTEM_PROMPTS.CHAT_ASSISTANT)) {
            return `I am here as your LifeOS AI Assistant. (Running in demo offline mode)

You mentioned: "${userPrompt}". I can help you structure this request into tasks, habits, or schedule it onto your calendar. What would you like to achieve today?`;
        }
        if (systemPrompt === prompts_1.SYSTEM_PROMPTS.TASK_PRIORITIZATION) {
            try {
                const tasks = JSON.parse(userPrompt);
                const ids = tasks.map((t) => t._id || t.id || 'task_id');
                return JSON.stringify({
                    prioritizedTaskIds: ids,
                    scheduleSuggestions: ids.map((id, index) => ({
                        taskId: id,
                        suggestedTime: index % 2 === 0 ? 'morning' : 'afternoon',
                        reason: 'Auto-prioritized based on deadline safety margins.'
                    })),
                    insights: ['Complete your urgent tasks in the morning for optimal cognitive focus.']
                });
            }
            catch {
                return JSON.stringify({ prioritizedTaskIds: [], scheduleSuggestions: [], insights: [] });
            }
        }
        if (systemPrompt === prompts_1.SYSTEM_PROMPTS.GOAL_BREAKDOWN) {
            return JSON.stringify({
                milestones: ['Setup initial foundation', 'Build prototype and execute core functionalities', 'Perform validations and launch'],
                actionPlan: ['Draft conceptual models', 'Configure environments and credentials', 'Implement test suites', 'Publish first deployable version']
            });
        }
        if (systemPrompt === prompts_1.SYSTEM_PROMPTS.HABIT_RECOMMENDATIONS) {
            return JSON.stringify({
                recommendations: [
                    { title: 'Read 15 Pages', category: 'Growth', frequency: 'daily', rationale: 'Directly helps expand your knowledge base' },
                    { title: 'Weekly Review Session', category: 'Productivity', frequency: 'weekly', rationale: 'Helps track goals alignment' },
                    { title: 'Daily Focus Walk', category: 'Health', frequency: 'daily', rationale: 'Increases cardiovascular output and mental clarity' }
                ]
            });
        }
        if (systemPrompt === prompts_1.SYSTEM_PROMPTS.LEARNING_ROADMAP) {
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
        if (systemPrompt === prompts_1.SYSTEM_PROMPTS.NOTE_SUMMARY) {
            return JSON.stringify({
                summary: 'A detailed log outlining recent project objectives, notes, and requirements.',
                tags: ['productivity', 'work', 'notes-digest'],
                insights: 'Insight 1: Focus on immediate setup before scaling.\nInsight 2: Standardize data structures early to avoid breaking revisions.'
            });
        }
        if (systemPrompt === prompts_1.SYSTEM_PROMPTS.LIFE_COACH) {
            return `Welcome to your daily Life Coach check-in! 

Looking at your metrics, you are showing high consistency. Focus on your most challenging items today and take micro-breaks to preserve cognitive efficiency. Let's make this day highly impactful!`;
        }
        return 'Default fallback response';
    }
}
exports.GeminiService = GeminiService;
exports.geminiService = new GeminiService();
//# sourceMappingURL=GeminiService.js.map