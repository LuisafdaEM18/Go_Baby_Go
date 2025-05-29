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
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 text-green-800 shadow-green-100/50';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-400 text-red-800 shadow-red-100/50';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400 text-yellow-800 shadow-yellow-100/50';
      case 'info':
        return 'bg-gradient-to-r from-blue-50 to-sky-50 border-blue-400 text-blue-800 shadow-blue-100/50';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-400 text-gray-800 shadow-gray-100/50';
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
      className={`px-5 py-4 rounded-2xl border-l-4 shadow-xl transition-all duration-300 ${getStyles()} ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 -translate-y-4 scale-95'
      }`}
      role="alert"
      style={{ 
        minWidth: '320px',
        maxWidth: '480px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.06)',
        zIndex: 9999,
        backdropFilter: 'blur(8px)',
        background: type === 'success' 
          ? 'linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(209, 250, 229, 0.95) 100%)'
          : type === 'error'
          ? 'linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(252, 231, 243, 0.95) 100%)'
          : type === 'warning'
          ? 'linear-gradient(135deg, rgba(255, 251, 235, 0.95) 0%, rgba(254, 243, 199, 0.95) 100%)'
          : type === 'info'
          ? 'linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(219, 234, 254, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(249, 250, 251, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)'
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