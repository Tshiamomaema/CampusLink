import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Heart, MessageCircle, UserPlus, ShoppingBag, Check, Loader2 } from 'lucide-react';
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

export default function Notifications() {
    const { profile } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'likes' | 'comments' | 'follows'>('all');

    useEffect(() => {
        if (profile?.id) {
            fetchNotifications();
        }
    }, [profile?.id, filter]);

    const fetchNotifications = async () => {
        if (!profile?.id) return;
        setLoading(true);

        let query = supabase
            .from('notifications')
            .select(`
        *,
        actor:actor_id (id, full_name, username, avatar_url)
      `)
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false });

        if (filter === 'likes') {
            query = query.eq('type', 'like');
        } else if (filter === 'comments') {
            query = query.eq('type', 'comment');
        } else if (filter === 'follows') {
            query = query.eq('type', 'follow');
        }

        const { data } = await query.limit(50);

        if (data) {
            setNotifications(data);
        }
        setLoading(false);
    };

    const markAsRead = async (notificationId: string) => {
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);

        setNotifications(prev =>
            prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = async () => {
        if (!profile?.id) return;

        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', profile.id)
            .eq('read', false);

        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'like':
                return <Heart size={20} className="text-pink-500" fill="currentColor" />;
            case 'comment':
                return <MessageCircle size={20} className="text-primary-500" fill="currentColor" />;
            case 'follow':
                return <UserPlus size={20} className="text-green-500" />;
            case 'marketplace':
                return <ShoppingBag size={20} className="text-yellow-500" />;
            default:
                return <Bell size={20} className="text-twitter-textGray" />;
        }
    };

    const getNotificationText = (notification: Notification) => {
        const actorName = notification.actor?.full_name || 'Someone';
        switch (notification.type) {
            case 'like':
                return <><span className="font-bold">{actorName}</span> liked your post</>;
            case 'comment':
                return <><span className="font-bold">{actorName}</span> commented on your post</>;
            case 'follow':
                return <><span className="font-bold">{actorName}</span> started following you</>;
            case 'marketplace':
                return <><span className="font-bold">{actorName}</span> is interested in your listing</>;
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

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="sticky top-14 bg-black/80 backdrop-blur-md border-b border-twitter-border z-30">
                <div className="flex items-center justify-between px-4 py-3">
                    <h1 className="text-xl font-bold text-twitter-textLight">Notifications</h1>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-1 text-sm text-primary-500 hover:underline"
                        >
                            <Check size={16} />
                            Mark all read
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex border-b border-twitter-border">
                    {(['all', 'likes', 'comments', 'follows'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`tab-item capitalize ${filter === f ? 'active' : ''}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications List */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 size={32} className="text-primary-500 animate-spin" />
                </div>
            ) : notifications.length === 0 ? (
                <div className="p-12 text-center">
                    <Bell size={48} className="mx-auto mb-4 text-twitter-textGray opacity-50" />
                    <p className="text-twitter-textGray">No notifications yet</p>
                    <p className="text-sm text-twitter-textGray mt-1">
                        When someone interacts with you, you'll see it here
                    </p>
                </div>
            ) : (
                <div>
                    {notifications.map((notification) => (
                        <Link
                            key={notification.id}
                            to={getNotificationLink(notification)}
                            onClick={() => {
                                if (!notification.read) markAsRead(notification.id);
                            }}
                            className={`flex items-start gap-4 px-4 py-4 border-b border-twitter-border hover:bg-white/[0.03] transition-colors ${!notification.read ? 'bg-primary-500/5' : ''
                                }`}
                        >
                            <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(notification.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    {notification.actor?.avatar_url ? (
                                        <img
                                            src={notification.actor.avatar_url}
                                            alt=""
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-twitter-darkCard flex items-center justify-center">
                                            <span className="text-twitter-textLight font-semibold text-xs">
                                                {notification.actor?.full_name?.charAt(0) || '?'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-twitter-textLight">
                                    {getNotificationText(notification)}
                                </p>
                                <p className="text-sm text-twitter-textGray mt-1">
                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                </p>
                            </div>

                            {!notification.read && (
                                <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
