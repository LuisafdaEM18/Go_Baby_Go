import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Notification, { NotificationType } from '../Components/Notification';

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationItem {
  id: number;
  message: string;
  type: NotificationType;
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const showNotification = useCallback((message: string, type: NotificationType) => {
    console.log(`Showing notification: ${message} (${type})`); // Debug log
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);
  
  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Render notifications with proper stacking */}
      {notifications.length > 0 && (
        <div 
          className="fixed top-4 right-4 z-50 space-y-4 flex flex-col items-end" 
          style={{ 
            maxWidth: '90vw',
            pointerEvents: 'auto',
            zIndex: 9999
          }}
          data-testid="notification-container"
        >
          {notifications.map((notification, index) => (
            <Notification
              key={notification.id}
              message={notification.message}
              type={notification.type}
              onClose={() => removeNotification(notification.id)}
              // Longer duration for more notifications to avoid quick disappearance
              duration={4000 + (index * 500)}
            />
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
} 