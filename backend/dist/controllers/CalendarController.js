"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarController = exports.CalendarController = void 0;
const CalendarService_1 = require("../services/CalendarService");
class CalendarController {
    async getEvents(req, res) {
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
            const events = await CalendarService_1.calendarService.getEvents(req.user.uid, start, end);
            res.json(events);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch calendar events' });
        }
    }
    async createEvent(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const event = await CalendarService_1.calendarService.createEvent(req.user.uid, req.body);
            res.status(201).json(event);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create calendar event' });
        }
    }
    async updateEvent(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const updated = await CalendarService_1.calendarService.updateEvent(req.user.uid, id, req.body);
            if (!updated) {
                res.status(404).json({ error: 'Event not found' });
                return;
            }
            res.json(updated);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update calendar event' });
        }
    }
    async deleteEvent(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const { id } = req.params;
            const deleted = await CalendarService_1.calendarService.deleteEvent(req.user.uid, id);
            if (!deleted) {
                res.status(404).json({ error: 'Event not found' });
                return;
            }
            res.json({ success: true });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete calendar event' });
        }
    }
}
exports.CalendarController = CalendarController;
exports.calendarController = new CalendarController();
//# sourceMappingURL=CalendarController.js.map