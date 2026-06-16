import { create } from 'zustand';
import { api } from '../services/api';
import { Task } from '../types';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  prioritizationSuggestions: any;
  fetchTasks: () => Promise<void>;
  addTask: (taskData: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updateData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  runAIPrioritizer: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  prioritizationSuggestions: null,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<Task[]>('/tasks');
      set({ tasks: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch tasks:', error);
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true });
    try {
      const response = await api.post<Task>('/tasks', taskData);
      set({ 
        tasks: [response.data, ...get().tasks], 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to add task:', error);
    }
  },

  updateTask: async (id, updateData) => {
    try {
      const response = await api.put<Task>(`/tasks/${id}`, updateData);
      set({
        tasks: get().tasks.map(t => t._id === id ? response.data : t)
      });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      set({
        tasks: get().tasks.filter(t => t._id !== id)
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  },

  runAIPrioritizer: async () => {
    set({ isLoading: true });
    try {
      const response = await api.post('/tasks/prioritize');
      set({ prioritizationSuggestions: response.data, isLoading: false });
      // Refresh task lists to update UI with AI prioritize indicator flags
      await get().fetchTasks();
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to prioritize tasks:', error);
    }
  },
}));
