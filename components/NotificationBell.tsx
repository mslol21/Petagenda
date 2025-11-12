import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id: number) => {
    markAsRead(id);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleToggle} className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        )}
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">Notificações</div>
            <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div key={n.id} onClick={() => handleMarkAsRead(n.id)} className={`block px-4 py-3 text-sm text-gray-700 cursor-pointer ${!n.read ? 'bg-primary-50' : 'hover:bg-gray-100'}`}>
                            <p className={`${!n.read ? 'font-semibold' : ''}`}>{n.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{n.timestamp.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                        </div>
                    ))
                ) : (
                    <p className="px-4 py-3 text-sm text-gray-500">Nenhuma notificação.</p>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
