"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalService = exports.GoalService = void 0;
const repositories_1 = require("../repositories");
const GeminiService_1 = require("./GeminiService");
const UserService_1 = require("./UserService");
class GoalService {
    async createGoal(userId, goalData) {
        const goal = await repositories_1.goalRepo.create({ ...goalData, userId });
        // Automatically generate AI action steps if none are provided
        if (!goal.aiActionPlan || goal.aiActionPlan.length === 0) {
            const plan = await GeminiService_1.geminiService.breakdownGoal(goal.title, goal.description || '');
            if (plan && plan.actionPlan) {
                goal.aiActionPlan = plan.actionPlan;
                // Optionally create milestones from the AI response
                if (plan.milestones && plan.milestones.length > 0) {
                    goal.milestones = plan.milestones.map((m) => ({ title: m, completed: false }));
                }
                await goal.save();
            }
        }
        return goal;
    }
    async getGoals(userId) {
        return repositories_1.goalRepo.findByUserId(userId);
    }
    async updateGoal(userId, goalId, updateData) {
        // If milestones are changing, re-calculate the goal progress percent
        if (updateData.milestones) {
            const completed = updateData.milestones.filter((m) => m.completed).length;
            const total = updateData.milestones.length;
            updateData.progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        }
        const goal = await repositories_1.goalRepo.update({ _id: goalId, userId }, updateData);
        if (goal && goal.progress === 100) {
            await UserService_1.userService.incrementProductivityScore(userId, 20); // Massive boost for completing a goal
        }
        return goal;
    }
    async deleteGoal(userId, goalId) {
        const result = await repositories_1.goalRepo.delete({ _id: goalId, userId });
        return result.deletedCount > 0;
    }
    async triggerAIActionPlan(userId, goalId) {
        const goal = await repositories_1.goalRepo.findOne({ _id: goalId, userId });
        if (!goal)
            return null;
        const plan = await GeminiService_1.geminiService.breakdownGoal(goal.title, goal.description || '');
        if (plan) {
            goal.aiActionPlan = plan.actionPlan || [];
            if (plan.milestones && plan.milestones.length > 0 && goal.milestones.length === 0) {
                goal.milestones = plan.milestones.map((m) => ({ title: m, completed: false }));
            }
            await goal.save();
        }
        return goal;
    }
}
exports.GoalService = GoalService;
exports.goalService = new GoalService();
//# sourceMappingURL=GoalService.js.map