import React, { useState, useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 4000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animation timing - appear immediately
    setTimeout(() => setIsVisible(true), 10);
    
    // Set timer for auto-dismiss
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Give time for fade-out animation before actual removal
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  // Colors based on notification type
  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'info':
        return 'bg-blue-100 border-blue-500 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  // Icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`px-4 py-3 rounded-md border-l-4 shadow-lg transition-all duration-300 ${getStyles()} ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-4'
      }`}
      role="alert"
      style={{ 
        minWidth: '300px',
        maxWidth: '450px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
        zIndex: 9999
      }}
      data-testid="notification"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-bold text-lg mr-2">{getIcon()}</span>
          <span className="font-medium mr-2">
            {type === 'success' && 'Éxito:'}
            {type === 'error' && 'Error:'}
            {type === 'warning' && 'Advertencia:'}
            {type === 'info' && 'Información:'}
          </span>
          <span className="block sm:inline">{message}</span>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification; 