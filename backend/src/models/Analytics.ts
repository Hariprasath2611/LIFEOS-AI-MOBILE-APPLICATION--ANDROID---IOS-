import { Schema, model, Document } from 'mongoose';

export interface IAnalytics extends Document {
  userId: string;
  date: Date;
  tasksCompleted: number;
  goalsAchieved: number;
  habitConsistency: number; // Percentage
  focusScore: number; // 0 to 100
  productivityScore: number; // 0 to 100
  aiInsights?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: Date, required: true, default: Date.now },
    tasksCompleted: { type: Number, default: 0 },
    goalsAchieved: { type: Number, default: 0 },
    habitConsistency: { type: Number, default: 0 },
    focusScore: { type: Number, default: 0 },
    productivityScore: { type: Number, default: 0 },
    aiInsights: { type: String },
  },
  { timestamps: true }
);

// Index composite key for quick daily lookup
AnalyticsSchema.index({ userId: 1, date: 1 }, { unique: true });

export const Analytics = model<IAnalytics>('Analytics', AnalyticsSchema);
