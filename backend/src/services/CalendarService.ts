import { calendarEventRepo } from '../repositories';
import { ICalendarEvent } from '../models/CalendarEvent';

export class CalendarService {
  async getEvents(userId: string, startStr: string, endStr: string): Promise<ICalendarEvent[]> {
    const start = new Date(startStr);
    const end = new Date(endStr);
    return calendarEventRepo.findByRange(userId, start, end);
  }

  async createEvent(userId: string, eventData: Partial<ICalendarEvent>): Promise<ICalendarEvent> {
    return calendarEventRepo.create({ ...eventData, userId });
  }

  async updateEvent(userId: string, eventId: string, updateData: Partial<ICalendarEvent>): Promise<ICalendarEvent | null> {
    return calendarEventRepo.update({ _id: eventId, userId }, updateData);
  }

  async deleteEvent(userId: string, eventId: string): Promise<boolean> {
    const result = await calendarEventRepo.delete({ _id: eventId, userId });
    return result.deletedCount > 0;
  }
}

export const calendarService = new CalendarService();
