import { goalRepo } from '../repositories';
import { IGoal, IMilestone } from '../models/Goal';
import { geminiService } from './GeminiService';
import { userService } from './UserService';

export class GoalService {
  async createGoal(userId: string, goalData: Partial<IGoal>): Promise<IGoal> {
    const goal = await goalRepo.create({ ...goalData, userId });
    
    // Automatically generate AI action steps if none are provided
    if (!goal.aiActionPlan || goal.aiActionPlan.length === 0) {
      const plan = await geminiService.breakdownGoal(goal.title, goal.description || '');
      if (plan && plan.actionPlan) {
        goal.aiActionPlan = plan.actionPlan;
        
        // Optionally create milestones from the AI response
        if (plan.milestones && plan.milestones.length > 0) {
          goal.milestones = plan.milestones.map((m: string) => ({ title: m, completed: false }));
        }
        await goal.save();
      }
    }

    return goal;
  }

  async getGoals(userId: string): Promise<IGoal[]> {
    return goalRepo.findByUserId(userId);
  }

  async updateGoal(userId: string, goalId: string, updateData: Partial<IGoal>): Promise<IGoal | null> {
    // If milestones are changing, re-calculate the goal progress percent
    if (updateData.milestones) {
      const completed = updateData.milestones.filter((m: IMilestone) => m.completed).length;
      const total = updateData.milestones.length;
      updateData.progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    const goal = await goalRepo.update({ _id: goalId, userId }, updateData);
    
    if (goal && goal.progress === 100) {
      await userService.incrementProductivityScore(userId, 20); // Massive boost for completing a goal
    }

    return goal;
  }

  async deleteGoal(userId: string, goalId: string): Promise<boolean> {
    const result = await goalRepo.delete({ _id: goalId, userId });
    return result.deletedCount > 0;
  }

  async triggerAIActionPlan(userId: string, goalId: string): Promise<IGoal | null> {
    const goal = await goalRepo.findOne({ _id: goalId, userId });
    if (!goal) return null;

    const plan = await geminiService.breakdownGoal(goal.title, goal.description || '');
    if (plan) {
      goal.aiActionPlan = plan.actionPlan || [];
      if (plan.milestones && plan.milestones.length > 0 && goal.milestones.length === 0) {
        goal.milestones = plan.milestones.map((m: string) => ({ title: m, completed: false }));
      }
      await goal.save();
    }
    return goal;
  }
}

export const goalService = new GoalService();
