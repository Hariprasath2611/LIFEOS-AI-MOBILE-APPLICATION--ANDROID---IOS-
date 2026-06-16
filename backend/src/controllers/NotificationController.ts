import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { notificationService } from '../services/NotificationService';

export class NotificationController {
  async getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const notifications = await notificationService.getNotifications(req.user.uid);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }

  async markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { id } = req.params;
      const updated = await notificationService.markAsRead(req.user.uid, id);
      if (!updated) {
        res.status(404).json({ error: 'Notification not found' });
        return;
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update notification' });
    }
  }

  async markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      await notificationService.markAllAsRead(req.user.uid);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to dismiss notifications' });
    }
  }
}

export const notificationController = new NotificationController();
