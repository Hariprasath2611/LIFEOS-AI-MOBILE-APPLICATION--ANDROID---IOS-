import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { habitService } from '../services/HabitService';

export class HabitController {
  async getHabits(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const habits = await habitService.getHabits(req.user.uid);
      res.json(habits);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch habits' });
    }
  }

  async createHabit(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const habit = await habitService.createHabit(req.user.uid, req.body);
      res.status(201).json(habit);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create habit' });
    }
  }

  async toggleHabit(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { id } = req.params;
      const { date } = req.body; // Expect ISO string or date representation

      if (!date) {
        res.status(400).json({ error: 'Date is required for toggle check-in' });
        return;
      }

      const updated = await habitService.toggleHabitCompletion(req.user.uid, id, date);
      if (!updated) {
        res.status(404).json({ error: 'Habit not found' });
        return;
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to toggle habit completion' });
    }
  }

  async deleteHabit(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { id } = req.params;
      const deleted = await habitService.deleteHabit(req.user.uid, id);
      if (!deleted) {
        res.status(404).json({ error: 'Habit not found' });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete habit' });
    }
  }
}

export const habitController = new HabitController();
