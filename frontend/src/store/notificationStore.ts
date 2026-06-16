import { create } from 'zustand';
import { api } from '../services/api';
import { AppNotification } from '../types';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<AppNotification[]>('/notifications');
      const unread = response.data.filter(n => !n.read).length;
      set({ 
        notifications: response.data, 
        unreadCount: unread,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch notifications:', error);
    }
  },

  markAsRead: async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      const updated = get().notifications.map(n => n._id === id ? { ...n, read: true } : n);
      set({
        notifications: updated,
        unreadCount: Math.max(0, get().unreadCount - 1)
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.post('/notifications/read-all');
      set({
        notifications: get().notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },
}));
