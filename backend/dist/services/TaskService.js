"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = exports.TaskService = void 0;
const repositories_1 = require("../repositories");
const GeminiService_1 = require("./GeminiService");
const UserService_1 = require("./UserService");
class TaskService {
    async createTask(userId, taskData) {
        const task = await repositories_1.taskRepo.create({ ...taskData, userId });
        await UserService_1.userService.incrementProductivityScore(userId, 2); // Small reward for planning
        return task;
    }
    async getTasks(userId) {
        return repositories_1.taskRepo.findByUserId(userId);
    }
    async updateTask(userId, taskId, updateData) {
        const task = await repositories_1.taskRepo.update({ _id: taskId, userId }, updateData);
        if (task && updateData.status === 'done') {
            await UserService_1.userService.incrementProductivityScore(userId, 5); // Bigger reward for completion
        }
        return task;
    }
    async deleteTask(userId, taskId) {
        const result = await repositories_1.taskRepo.delete({ _id: taskId, userId });
        return result.deletedCount > 0;
    }
    /**
     * AI-powered task smart sorting and scheduling analysis.
     */
    async runSmartPrioritization(userId) {
        const tasks = await repositories_1.taskRepo.findByUserId(userId);
        const incompleteTasks = tasks.filter(t => t.status !== 'done');
        if (incompleteTasks.length === 0) {
            return { message: 'No active tasks to prioritize.' };
        }
        const aiAnalysis = await GeminiService_1.geminiService.prioritizeTasks(incompleteTasks);
        // Apply the prioritized ranking order to tasks
        if (aiAnalysis && aiAnalysis.prioritizedTaskIds) {
            for (const taskId of aiAnalysis.prioritizedTaskIds) {
                await repositories_1.taskRepo.update({ _id: taskId, userId }, { aiPrioritized: true });
            }
        }
        return aiAnalysis;
    }
}
exports.TaskService = TaskService;
exports.taskService = new TaskService();
//# sourceMappingURL=TaskService.js.map