"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarService = exports.CalendarService = void 0;
const repositories_1 = require("../repositories");
class CalendarService {
    async getEvents(userId, startStr, endStr) {
        const start = new Date(startStr);
        const end = new Date(endStr);
        return repositories_1.calendarEventRepo.findByRange(userId, start, end);
    }
    async createEvent(userId, eventData) {
        return repositories_1.calendarEventRepo.create({ ...eventData, userId });
    }
    async updateEvent(userId, eventId, updateData) {
        return repositories_1.calendarEventRepo.update({ _id: eventId, userId }, updateData);
    }
    async deleteEvent(userId, eventId) {
        const result = await repositories_1.calendarEventRepo.delete({ _id: eventId, userId });
        return result.deletedCount > 0;
    }
}
exports.CalendarService = CalendarService;
exports.calendarService = new CalendarService();
//# sourceMappingURL=CalendarService.js.map