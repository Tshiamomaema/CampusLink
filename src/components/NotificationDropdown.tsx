import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Heart, MessageCircle, UserPlus, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string;
    type: 'like' | 'comment' | 'follow' | 'marketplace';
    actor_id: string;
    post_id?: string;
    listing_id?: string;
    read: boolean;
    created_at: string;
    actor?: {
        id: string;
        full_name: string;
        username: string;
        avatar_url?: string;
    };
}

export default function NotificationDropdown() {
    const { profile } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (profile?.id) {
            fetchNotifications();
            fetchUnreadCount();
        }
    }, [profile?.id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        if (!profile?.id) return;
        setLoading(true);

        const { data } = await supabase
            .from('notifications')
            .select(`
        *,
        actor:actor_id (id, full_name, username, avatar_url)
      `)
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(20);

        if (data) {
            setNotifications(data);
        }
        setLoading(false);
    };

    const fetchUnreadCount = async () => {
        if (!profile?.id) return;

        const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id)
            .eq('read', false);

        setUnreadCount(count || 0);
    };

    const markAsRead = async (notificationId: string) => {
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);

        setNotifications(prev =>
            prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = async () => {
        if (!profile?.id) return;

        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', profile.id)
            .eq('read', false);

        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'like':
                return <Heart size={16} className="text-pink-500" fill="currentColor" />;
            case 'comment':
                return <MessageCircle size={16} className="text-primary-500" fill="currentColor" />;
            case 'follow':
                return <UserPlus size={16} className="text-green-500" />;
            case 'marketplace':
                return <ShoppingBag size={16} className="text-yellow-500" />;
            default:
                return <Bell size={16} className="text-twitter-textGray" />;
        }
    };

    const getNotificationText = (notification: Notification) => {
        const actorName = notification.actor?.full_name || 'Someone';
        switch (notification.type) {
            case 'like':
                return `${actorName} liked your post`;
            case 'comment':
                return `${actorName} commented on your post`;
            case 'follow':
                return `${actorName} started following you`;
            case 'marketplace':
                return `${actorName} is interested in your listing`;
            default:
                return 'New notification';
        }
    };

    const getNotificationLink = (notification: Notification) => {
        if (notification.type === 'follow') {
            return `/user/${notification.actor_id}`;
        }
        if (notification.listing_id) {
            return `/marketplace/${notification.listing_id}`;
        }
        return '/';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) fetchNotifications();
                }}
                className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
            >
                <Bell size={22} className="text-twitter-textLight" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-black border border-twitter-border rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-twitter-border">
                        <h3 className="font-bold text-twitter-textLight">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-primary-500 hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-twitter-textGray">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-twitter-textGray">
                                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <Link
                                    key={notification.id}
                                    to={getNotificationLink(notification)}
                                    onClick={() => {
                                        if (!notification.read) markAsRead(notification.id);
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${!notification.read ? 'bg-primary-500/5' : ''
                                        }`}
                                >
                                    {notification.actor?.avatar_url ? (
                                        <img
                                            src={notification.actor.avatar_url}
                                            alt=""
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-twitter-darkCard flex items-center justify-center">
                                            <span className="text-twitter-textLight font-semibold text-sm">
                                                {notification.actor?.full_name?.charAt(0) || '?'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            {getNotificationIcon(notification.type)}
                                            <p className="text-sm text-twitter-textLight truncate">
                                                {getNotificationText(notification)}
                                            </p>
                                        </div>
                                        <p className="text-xs text-twitter-textGray mt-1">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2" />
                                    )}
                                </Link>
                            ))
                        )}
                    </div>

                    <Link
                        to="/notifications"
                        onClick={() => setIsOpen(false)}
                        className="block text-center py-3 text-primary-500 hover:bg-white/5 border-t border-twitter-border"
                    >
                        See all notifications
                    </Link>
                </div>
            )}
        </div>
    );
}
