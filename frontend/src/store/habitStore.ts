import { create } from 'zustand';
import { api } from '../services/api';
import { Habit } from '../types';

interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  fetchHabits: () => Promise<void>;
  addHabit: (habitData: Partial<Habit>) => Promise<void>;
  toggleHabit: (id: string, dateStr: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  isLoading: false,

  fetchHabits: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<Habit[]>('/habits');
      set({ habits: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch habits:', error);
    }
  },

  addHabit: async (habitData) => {
    set({ isLoading: true });
    try {
      const response = await api.post<Habit>('/habits', habitData);
      set({ 
        habits: [response.data, ...get().habits], 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to add habit:', error);
    }
  },

  toggleHabit: async (id, dateStr) => {
    try {
      const response = await api.post<Habit>(`/habits/${id}/toggle`, { date: dateStr });
      set({
        habits: get().habits.map(h => h._id === id ? response.data : h)
      });
    } catch (error) {
      console.error('Failed to toggle habit check-in:', error);
    }
  },

  deleteHabit: async (id) => {
    try {
      await api.delete(`/habits/${id}`);
      set({
        habits: get().habits.filter(h => h._id !== id)
      });
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  },
}));
