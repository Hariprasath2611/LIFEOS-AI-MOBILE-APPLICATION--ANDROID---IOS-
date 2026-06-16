import { Schema, model, Document } from 'mongoose';

export interface IRoadmapStep {
  title: string;
  duration: string;
  content: string;
  completed: boolean;
}

export interface ILearningRoadmap extends Document {
  userId: string;
  title: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: IRoadmapStep[];
  progress: number; // 0 to 100
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapStepSchema = new Schema<IRoadmapStep>({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  content: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const LearningRoadmapSchema = new Schema<ILearningRoadmap>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    steps: { type: [RoadmapStepSchema], default: [] },
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const LearningRoadmap = model<ILearningRoadmap>('LearningRoadmap', LearningRoadmapSchema);
