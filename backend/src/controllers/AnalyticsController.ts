import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { analyticsService } from '../services/AnalyticsService';

export class AnalyticsController {
  async getAnalyticsHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const history = await analyticsService.getAnalyticsHistory(req.user.uid);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics history' });
    }
  }

  async computeAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const todayRecord = await analyticsService.computeDailyAnalytics(req.user.uid);
      res.json(todayRecord);
    } catch (error) {
      console.error('Daily analytics calculation failed:', error);
      res.status(500).json({ error: 'Failed to compute daily analytics' });
    }
  }
}

export const analyticsController = new AnalyticsController();
