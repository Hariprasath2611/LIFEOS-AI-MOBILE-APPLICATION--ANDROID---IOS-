import { learningRoadmapRepo } from '../repositories';
import { ILearningRoadmap, IRoadmapStep } from '../models/LearningRoadmap';
import { geminiService } from './GeminiService';
import { userService } from './UserService';

export class LearningService {
  async getRoadmaps(userId: string): Promise<ILearningRoadmap[]> {
    return learningRoadmapRepo.findByUserId(userId);
  }

  async generateRoadmap(userId: string, topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<ILearningRoadmap> {
    const aiData = await geminiService.generateRoadmap(topic, difficulty);
    
    const steps: IRoadmapStep[] = aiData.steps 
      ? aiData.steps.map((s: any) => ({
          title: s.title,
          duration: s.duration,
          content: s.content,
          completed: false
        }))
      : [
          { title: 'Foundations of ' + topic, duration: '1 week', content: 'Study core definitions and basic setups.', completed: false }
        ];

    const roadmap = await learningRoadmapRepo.create({
      userId,
      title: aiData.title || `Mastering ${topic}`,
      description: aiData.description || `Learning pathway for ${topic}`,
      difficulty,
      steps,
      progress: 0
    });

    await userService.incrementProductivityScore(userId, 5); // Reward for seeking knowledge
    return roadmap;
  }

  async updateStepProgress(userId: string, roadmapId: string, stepTitle: string, completed: boolean): Promise<ILearningRoadmap | null> {
    const roadmap = await learningRoadmapRepo.findOne({ _id: roadmapId, userId });
    if (!roadmap) return null;

    const step = roadmap.steps.find(s => s.title === stepTitle);
    if (step) {
      step.completed = completed;
      
      // Re-calculate progress
      const completedSteps = roadmap.steps.filter(s => s.completed).length;
      roadmap.progress = Math.round((completedSteps / roadmap.steps.length) * 100);
      
      await roadmap.save();

      if (completed) {
        await userService.incrementProductivityScore(userId, 5); // Reward for completing lessons
      }
    }

    return roadmap;
  }

  async deleteRoadmap(userId: string, roadmapId: string): Promise<boolean> {
    const result = await learningRoadmapRepo.delete({ _id: roadmapId, userId });
    return result.deletedCount > 0;
  }
}

export const learningService = new LearningService();
