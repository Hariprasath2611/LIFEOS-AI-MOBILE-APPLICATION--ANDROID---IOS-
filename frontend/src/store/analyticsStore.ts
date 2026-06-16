import { create } from 'zustand';
import { api } from '../services/api';
import { AnalyticsRecord } from '../types';

interface AnalyticsState {
  analyticsHistory: AnalyticsRecord[];
  todayRecord: AnalyticsRecord | null;
  isLoading: boolean;
  fetchAnalytics: () => Promise<void>;
  computeDailyAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  analyticsHistory: [],
  todayRecord: null,
  isLoading: false,

  fetchAnalytics: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<AnalyticsRecord[]>('/analytics');
      set({ 
        analyticsHistory: response.data,
        todayRecord: response.data[0] || null, // Assuming sorting descending
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch analytics history:', error);
    }
  },

  computeDailyAnalytics: async () => {
    set({ isLoading: true });
    try {
      const response = await api.post<AnalyticsRecord>('/analytics/compute');
      set({
        todayRecord: response.data,
        analyticsHistory: [
          response.data,
          ...get().analyticsHistory.filter(r => r._id !== response.data._id)
        ],
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to compute daily analytics:', error);
    }
  },
}));
