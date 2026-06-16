import { create } from 'zustand';
import { api } from '../services/api';
import { Goal } from '../types';

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  fetchGoals: () => Promise<void>;
  addGoal: (goalData: Partial<Goal>) => Promise<void>;
  updateGoal: (id: string, updateData: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  generateAIActionPlan: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,

  fetchGoals: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<Goal[]>('/goals');
      set({ goals: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch goals:', error);
    }
  },

  addGoal: async (goalData) => {
    set({ isLoading: true });
    try {
      const response = await api.post<Goal>('/goals', goalData);
      set({ 
        goals: [response.data, ...get().goals], 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to add goal:', error);
    }
  },

  updateGoal: async (id, updateData) => {
    try {
      const response = await api.put<Goal>(`/goals/${id}`, updateData);
      set({
        goals: get().goals.map(g => g._id === id ? response.data : g)
      });
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  },

  deleteGoal: async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      set({
        goals: get().goals.filter(g => g._id !== id)
      });
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  },

  generateAIActionPlan: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.post<Goal>(`/goals/${id}/action-plan`);
      set({
        goals: get().goals.map(g => g._id === id ? response.data : g),
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to generate AI action plan:', error);
    }
  },
}));
