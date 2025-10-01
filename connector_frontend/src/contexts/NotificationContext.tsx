'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { NotificationItem } from '@/types';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// PUBLIC_INTERFACE
export function useNotifications() {
  /**
   * Hook to access notification context
   */
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// PUBLIC_INTERFACE
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  /**
   * Provider component for notification context
   */
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Jira Connected',
      message: 'Successfully connected to Jira workspace',
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: '2',
      title: 'Workflow Completed',
      message: 'Issue sync workflow completed successfully',
      type: 'info',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: false,
    },
    {
      id: '3',
      title: 'Connection Warning',
      message: 'Confluence token will expire in 7 days',
      type: 'warning',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
