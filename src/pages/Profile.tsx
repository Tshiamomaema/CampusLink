import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut, Settings, MapPin, BookOpen } from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';

export default function Profile() {
    const { profile, signOut } = useAuth();
    const [showEditModal, setShowEditModal] = useState(false);
    const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });

    useEffect(() => {
        if (profile?.id) {
            fetchStats();
        }
    }, [profile?.id]);

    const fetchStats = async () => {
        if (!profile?.id) return;

        const [postsResult, followersResult, followingResult] = await Promise.all([
            supabase.from('posts').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
            supabase.from('followers').select('follower_id', { count: 'exact', head: true }).eq('following_id', profile.id),
            supabase.from('followers').select('following_id', { count: 'exact', head: true }).eq('follower_id', profile.id),
        ]);

        setStats({
            posts: postsResult.count || 0,
            followers: followersResult.count || 0,
            following: followingResult.count || 0,
        });
    };

    return (
        <div className="p-4">
            {/* Profile Header */}
            <div className="card p-6">
                <div className="flex items-start gap-4">
                    {profile?.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt=""
                            className="w-20 h-20 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center">
                            <span className="text-primary-400 font-bold text-2xl">
                                {profile?.full_name?.charAt(0) || 'U'}
                            </span>
                        </div>
                    )}

                    <div className="flex-1">
                        <h1 className="text-xl font-bold">{profile?.full_name || 'User'}</h1>
                        <p className="text-gray-400">@{profile?.username || 'username'}</p>

                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {profile?.university || 'University'}
                            </span>
                            {profile?.faculty && (
                                <span className="flex items-center gap-1">
                                    <BookOpen size={14} />
                                    {profile.faculty}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {profile?.bio && (
                    <p className="mt-4 text-gray-300">{profile.bio}</p>
                )}

                {/* Stats */}
                <div className="flex gap-6 mt-6 pt-6 border-t border-campus-border">
                    <div className="text-center">
                        <span className="block font-bold text-lg">{stats.posts}</span>
                        <span className="text-sm text-gray-400">Posts</span>
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-lg">{stats.followers}</span>
                        <span className="text-sm text-gray-400">Followers</span>
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-lg">{stats.following}</span>
                        <span className="text-sm text-gray-400">Following</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-4 space-y-2">
                <button
                    onClick={() => setShowEditModal(true)}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                    <Settings size={18} />
                    Edit Profile
                </button>
                <button
                    onClick={signOut}
                    className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 py-3 transition-colors"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
            />
        </div>
    );
}
