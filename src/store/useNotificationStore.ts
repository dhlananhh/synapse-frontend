import { create } from "zustand";
import { NotificationState } from "@/types";

export const useNotificationStore =
  create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification) => {
      set((state) => ({
        notifications: [
          notification,
          ...state.notifications,
        ],
        unreadCount: state.unreadCount + 1,
      }));
    },

    markAsRead: (notificationId) => {
      const notification = get().notifications.find(
        (n) => n.id === notificationId
      );
      if (notification && !notification.isRead) {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId
              ? { ...n, isRead: true }
              : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      }
    },

    markAllAsRead: () => {
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
        })),
        unreadCount: 0,
      }));
    },
  }));
