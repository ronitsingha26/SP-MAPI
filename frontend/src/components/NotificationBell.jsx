import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { formatDate } from '../utils/helpers';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {}
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (err) {}
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-brand-green-pale rounded-xl transition-colors"
      >
        <Bell className="w-5 h-5 text-brand-text-muted" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-green border-2 border-white rounded-full" />
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-brand-green-pale rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in origin-top-right">
          <div className="flex items-center justify-between px-4 py-3 border-b border-brand-green-pale bg-brand-green-pale/20">
            <h3 className="font-semibold text-brand-text text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-brand-green hover:underline">
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-brand-text-muted text-sm">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-brand-green-pale">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`p-4 transition-colors hover:bg-brand-green-pale/40 ${!n.is_read ? 'bg-brand-green-pale/20' : ''}`}
                    onClick={() => {
                      if (!n.is_read) markAsRead(n.id);
                    }}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${!n.is_read ? 'bg-brand-green' : 'bg-transparent'}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brand-text leading-tight mb-1">{n.title}</p>
                        <p className="text-xs text-brand-text-muted leading-snug">{n.message}</p>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-brand-text-muted flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formatDate(n.created_at)}
                          </span>
                          
                          {n.action_link && (
                            <Link to={n.action_link} className="text-xs text-brand-green font-medium hover:underline">
                              View Details →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
