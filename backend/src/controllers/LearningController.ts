import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { learningService } from '../services/LearningService';

export class LearningController {
  async getRoadmaps(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const roadmaps = await learningService.getRoadmaps(req.user.uid);
      res.json(roadmaps);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch roadmaps' });
    }
  }

  async generateRoadmap(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { topic, difficulty } = req.body;
      if (!topic || !difficulty) {
        res.status(400).json({ error: 'Topic and difficulty are required parameters' });
        return;
      }

      const roadmap = await learningService.generateRoadmap(req.user.uid, topic, difficulty);
      res.status(201).json(roadmap);
    } catch (error) {
      console.error('Roadmap generation failed:', error);
      res.status(500).json({ error: 'Failed to generate learning roadmap' });
    }
  }

  async updateStep(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { id } = req.params;
      const { stepTitle, completed } = req.body;

      if (!stepTitle || completed === undefined) {
        res.status(400).json({ error: 'StepTitle and completed boolean are required' });
        return;
      }

      const updated = await learningService.updateStepProgress(req.user.uid, id, stepTitle, completed);
      if (!updated) {
        res.status(404).json({ error: 'Roadmap or step not found' });
        return;
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update step progress' });
    }
  }

  async deleteRoadmap(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { id } = req.params;
      const deleted = await learningService.deleteRoadmap(req.user.uid, id);
      if (!deleted) {
        res.status(404).json({ error: 'Roadmap not found' });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete roadmap' });
    }
  }
}

export const learningController = new LearningController();
