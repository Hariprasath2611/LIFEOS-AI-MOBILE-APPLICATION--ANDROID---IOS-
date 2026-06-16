import { Schema, model, Document } from 'mongoose';

export interface ICalendarEvent extends Document {
  userId: string;
  title: string;
  type: 'task' | 'habit' | 'goal' | 'meeting';
  start: Date;
  end: Date;
  referenceId?: string; // Links back to Task, Habit, or Goal
  createdAt: Date;
  updatedAt: Date;
}

const CalendarEventSchema = new Schema<ICalendarEvent>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['task', 'habit', 'goal', 'meeting'], default: 'meeting' },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    referenceId: { type: String },
  },
  { timestamps: true }
);

export const CalendarEvent = model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);
