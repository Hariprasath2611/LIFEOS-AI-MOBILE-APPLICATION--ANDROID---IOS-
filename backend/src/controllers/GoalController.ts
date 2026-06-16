import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { goalService } from '../services/GoalService';

export class GoalController {
  async getGoals(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const goals = await goalService.getGoals(req.user.uid);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch goals' });
    }
  }

  async createGoal(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const goal = await goalService.createGoal(req.user.uid, req.body);
      res.status(201).json(goal);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create goal' });
    }
  }

  async updateGoal(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { id } = req.params;
      const updated = await goalService.updateGoal(req.user.uid, id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Goal not found' });
        return;
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update goal' });
    }
  }

  async deleteGoal(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { id } = req.params;
      const deleted = await goalService.deleteGoal(req.user.uid, id);
      if (!deleted) {
        res.status(404).json({ error: 'Goal not found' });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete goal' });
    }
  }

  async triggerAIActionPlan(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { id } = req.params;
      const updatedGoal = await goalService.triggerAIActionPlan(req.user.uid, id);
      if (!updatedGoal) {
        res.status(404).json({ error: 'Goal not found' });
        return;
      }
      res.json(updatedGoal);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate AI action plan' });
    }
  }
}

export const goalController = new GoalController();
