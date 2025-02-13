import { create } from 'zustand';
import type { StateCreator } from 'zustand';

interface Notification {
  id: string;
  message: string;
  read: boolean;
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

type NotificationStore = StateCreator<
  NotificationState,
  [],
  [],
  NotificationState
>;

const createNotificationStore: NotificationStore = (set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (message: string) => {
    const notification: Notification = {
      id: Math.random().toString(36).substring(7),
      message,
      read: false,
      created_at: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
  markAsRead: (id: string) => {
    set((state) => {
      const notifications = state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    });
  },
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
});

export const useNotificationStore = create<NotificationState>(createNotificationStore);