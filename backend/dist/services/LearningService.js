"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.learningService = exports.LearningService = void 0;
const repositories_1 = require("../repositories");
const GeminiService_1 = require("./GeminiService");
const UserService_1 = require("./UserService");
class LearningService {
    async getRoadmaps(userId) {
        return repositories_1.learningRoadmapRepo.findByUserId(userId);
    }
    async generateRoadmap(userId, topic, difficulty) {
        const aiData = await GeminiService_1.geminiService.generateRoadmap(topic, difficulty);
        const steps = aiData.steps
            ? aiData.steps.map((s) => ({
                title: s.title,
                duration: s.duration,
                content: s.content,
                completed: false
            }))
            : [
                { title: 'Foundations of ' + topic, duration: '1 week', content: 'Study core definitions and basic setups.', completed: false }
            ];
        const roadmap = await repositories_1.learningRoadmapRepo.create({
            userId,
            title: aiData.title || `Mastering ${topic}`,
            description: aiData.description || `Learning pathway for ${topic}`,
            difficulty,
            steps,
            progress: 0
        });
        await UserService_1.userService.incrementProductivityScore(userId, 5); // Reward for seeking knowledge
        return roadmap;
    }
    async updateStepProgress(userId, roadmapId, stepTitle, completed) {
        const roadmap = await repositories_1.learningRoadmapRepo.findOne({ _id: roadmapId, userId });
        if (!roadmap)
            return null;
        const step = roadmap.steps.find(s => s.title === stepTitle);
        if (step) {
            step.completed = completed;
            // Re-calculate progress
            const completedSteps = roadmap.steps.filter(s => s.completed).length;
            roadmap.progress = Math.round((completedSteps / roadmap.steps.length) * 100);
            await roadmap.save();
            if (completed) {
                await UserService_1.userService.incrementProductivityScore(userId, 5); // Reward for completing lessons
            }
        }
        return roadmap;
    }
    async deleteRoadmap(userId, roadmapId) {
        const result = await repositories_1.learningRoadmapRepo.delete({ _id: roadmapId, userId });
        return result.deletedCount > 0;
    }
}
exports.LearningService = LearningService;
exports.learningService = new LearningService();
//# sourceMappingURL=LearningService.js.map