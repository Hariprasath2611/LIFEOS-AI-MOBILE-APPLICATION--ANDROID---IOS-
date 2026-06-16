import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { taskService } from '../services/TaskService';

export class TaskController {
  async getTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const tasks = await taskService.getTasks(req.user.uid);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  }

  async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const task = await taskService.createTask(req.user.uid, req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  }

  async updateTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { id } = req.params;
      const updated = await taskService.updateTask(req.user.uid, id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  }

  async deleteTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { id } = req.params;
      const deleted = await taskService.deleteTask(req.user.uid, id);
      if (!deleted) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }

  async runSmartPrioritization(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const analysis = await taskService.runSmartPrioritization(req.user.uid);
      res.json(analysis);
    } catch (error) {
      console.error('Smart task prioritization failed:', error);
      res.status(500).json({ error: 'AI task prioritization failed' });
    }
  }
}

export const taskController = new TaskController();
