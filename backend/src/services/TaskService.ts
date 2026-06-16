import { taskRepo } from '../repositories';
import { ITask } from '../models/Task';
import { geminiService } from './GeminiService';
import { userService } from './UserService';

export class TaskService {
  async createTask(userId: string, taskData: Partial<ITask>): Promise<ITask> {
    const task = await taskRepo.create({ ...taskData, userId });
    await userService.incrementProductivityScore(userId, 2); // Small reward for planning
    return task;
  }

  async getTasks(userId: string): Promise<ITask[]> {
    return taskRepo.findByUserId(userId);
  }

  async updateTask(userId: string, taskId: string, updateData: Partial<ITask>): Promise<ITask | null> {
    const task = await taskRepo.update({ _id: taskId, userId }, updateData);
    if (task && updateData.status === 'done') {
      await userService.incrementProductivityScore(userId, 5); // Bigger reward for completion
    }
    return task;
  }

  async deleteTask(userId: string, taskId: string): Promise<boolean> {
    const result = await taskRepo.delete({ _id: taskId, userId });
    return result.deletedCount > 0;
  }

  /**
   * AI-powered task smart sorting and scheduling analysis.
   */
  async runSmartPrioritization(userId: string): Promise<any> {
    const tasks = await taskRepo.findByUserId(userId);
    const incompleteTasks = tasks.filter(t => t.status !== 'done');
    
    if (incompleteTasks.length === 0) {
      return { message: 'No active tasks to prioritize.' };
    }

    const aiAnalysis = await geminiService.prioritizeTasks(incompleteTasks);

    // Apply the prioritized ranking order to tasks
    if (aiAnalysis && aiAnalysis.prioritizedTaskIds) {
      for (const taskId of aiAnalysis.prioritizedTaskIds) {
        await taskRepo.update({ _id: taskId, userId }, { aiPrioritized: true });
      }
    }

    return aiAnalysis;
  }
}

export const taskService = new TaskService();
