/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import { useToast } from '../hooks/use-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { toast } = useToast();

    const addNotification = (notification) => {
        const newNotification = {
            id: Date.now(),
            timestamp: new Date(),
            read: false,
            ...notification
        };
        setNotifications(prev => [newNotification, ...prev]);

        // Also show a toast for immediate feedback
        toast({
            title: notification.title,
            description: notification.message,
        });
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
