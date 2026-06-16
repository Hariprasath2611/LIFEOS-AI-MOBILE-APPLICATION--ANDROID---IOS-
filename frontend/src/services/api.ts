import axios from 'axios';
import { getStoredToken } from './firebase';
import { Platform } from 'react-native';

// For Android emulator to talk to localhost:
// iOS simulator can use localhost, but Android emulator requires 10.0.2.2.
const getBaseURL = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  return Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT Firebase token on requests headers
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to retrieve token for request headers authorization:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
