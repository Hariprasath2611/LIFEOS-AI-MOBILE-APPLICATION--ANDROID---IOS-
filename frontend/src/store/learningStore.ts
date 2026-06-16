import { create } from 'zustand';
import { api } from '../services/api';
import { LearningRoadmap } from '../types';

interface LearningState {
  roadmaps: LearningRoadmap[];
  isLoading: boolean;
  fetchRoadmaps: () => Promise<void>;
  generateRoadmap: (topic: string, difficulty: 'beginner' | 'intermediate' | 'advanced') => Promise<void>;
  toggleStep: (roadmapId: string, stepTitle: string, completed: boolean) => Promise<void>;
  deleteRoadmap: (id: string) => Promise<void>;
}

export const useLearningStore = create<LearningState>((set, get) => ({
  roadmaps: [],
  isLoading: false,

  fetchRoadmaps: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<LearningRoadmap[]>('/learning');
      set({ roadmaps: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch roadmaps:', error);
    }
  },

  generateRoadmap: async (topic, difficulty) => {
    set({ isLoading: true });
    try {
      const response = await api.post<LearningRoadmap>('/learning/generate', { topic, difficulty });
      set({ 
        roadmaps: [response.data, ...get().roadmaps], 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to generate roadmap:', error);
      throw error;
    }
  },

  toggleStep: async (roadmapId, stepTitle, completed) => {
    try {
      const response = await api.put<LearningRoadmap>(`/learning/${roadmapId}/step`, {
        stepTitle,
        completed
      });
      set({
        roadmaps: get().roadmaps.map(r => r._id === roadmapId ? response.data : r)
      });
    } catch (error) {
      console.error('Failed to update step completions:', error);
    }
  },

  deleteRoadmap: async (id) => {
    try {
      await api.delete(`/learning/${id}`);
      set({
        roadmaps: get().roadmaps.filter(r => r._id !== id)
      });
    } catch (error) {
      console.error('Failed to delete roadmap:', error);
    }
  },
}));
