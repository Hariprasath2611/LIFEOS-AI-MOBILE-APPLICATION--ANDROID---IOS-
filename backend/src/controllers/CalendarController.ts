import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { calendarService } from '../services/CalendarService';

export class CalendarController {
  async getEvents(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { start, end } = req.query;
      if (!start || !end) {
        res.status(400).json({ error: 'Start and End query dates are required' });
        return;
      }
      const events = await calendarService.getEvents(req.user.uid, start as string, end as string);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch calendar events' });
    }
  }

  async createEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const event = await calendarService.createEvent(req.user.uid, req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create calendar event' });
    }
  }

  async updateEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { id } = req.params;
      const updated = await calendarService.updateEvent(req.user.uid, id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update calendar event' });
    }
  }

  async deleteEvent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const { id } = req.params;
      const deleted = await calendarService.deleteEvent(req.user.uid, id);
      if (!deleted) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete calendar event' });
    }
  }
}

export const calendarController = new CalendarController();
