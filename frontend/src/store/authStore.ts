import { create } from 'zustand';
import { clientLogin, clientSignup, clientLogout, getStoredToken } from '../services/firebase';
import { api } from '../services/api';
import { User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { token, uid } = await clientLogin(email, password);
      // Wait a moment for Firebase sync, then query profile from database API
      const response = await api.get<User>('/users/profile');
      
      await AsyncStorage.setItem('firebase_token_cache', token);
      set({ 
        token, 
        user: response.data, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.error || err.message || 'Login failed', 
        isLoading: false 
      });
      throw err;
    }
  },

  signup: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { token } = await clientSignup(email, password);
      
      // Let backend middleware create profile on verify, then load it
      const response = await api.get<User>('/users/profile');

      await AsyncStorage.setItem('firebase_token_cache', token);
      set({ 
        token, 
        user: response.data, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.error || err.message || 'Registration failed', 
        isLoading: false 
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await clientLogout();
      await AsyncStorage.removeItem('firebase_token_cache');
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put<User>('/users/profile', profileData);
      set({ user: response.data, isLoading: false });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.error || err.message || 'Failed to update profile', 
        isLoading: false 
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await getStoredToken();
      if (token) {
        // Query current profile details from backend db
        const response = await api.get<User>('/users/profile');
        set({ 
          token, 
          user: response.data, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err) {
      // Clean stale auth logs
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
