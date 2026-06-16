import { Schema, model, Document } from 'mongoose';

export interface ITask extends Document {
  userId: string; // Firebase UID
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  category: string;
  dueDate?: Date;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  aiPrioritized: boolean;
  suggestedByAI: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    category: { type: String, default: 'General' },
    dueDate: { type: Date },
    recurrence: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
    aiPrioritized: { type: Boolean, default: false },
    suggestedByAI: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Task = model<ITask>('Task', TaskSchema);
