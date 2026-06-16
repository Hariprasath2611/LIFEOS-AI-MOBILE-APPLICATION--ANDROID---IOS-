import { Schema, model, Document } from 'mongoose';

export interface IHabit extends Document {
  userId: string;
  title: string;
  category: string;
  frequency: 'daily' | 'weekly';
  history: Date[]; // Dates when this habit was marked completed
  streak: number;
  aiSuggestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const HabitSchema = new Schema<IHabit>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    category: { type: String, default: 'Health' },
    frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
    history: { type: [Date], default: [] },
    streak: { type: Number, default: 0 },
    aiSuggestions: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Habit = model<IHabit>('Habit', HabitSchema);
