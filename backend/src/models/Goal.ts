import { Schema, model, Document } from 'mongoose';

export interface IMilestone {
  title: string;
  completed: boolean;
}

export interface IGoal extends Document {
  userId: string;
  title: string;
  description?: string;
  type: 'short-term' | 'long-term';
  milestones: IMilestone[];
  progress: number; // 0 to 100
  targetDate?: Date;
  aiActionPlan: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const GoalSchema = new Schema<IGoal>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['short-term', 'long-term'], default: 'short-term' },
    milestones: { type: [MilestoneSchema], default: [] },
    progress: { type: Number, default: 0 },
    targetDate: { type: Date },
    aiActionPlan: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Goal = model<IGoal>('Goal', GoalSchema);
