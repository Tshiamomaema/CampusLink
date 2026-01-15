import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Profile } from '../lib/types';
import { ArrowLeft, MapPin, BookOpen, Loader2 } from 'lucide-react';

export default function UserProfile() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { profile: currentProfile } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });

    const isOwnProfile = currentProfile?.id === userId;

    useEffect(() => {
        if (userId) {
            fetchProfile();
            fetchStats();
            checkFollowStatus();
        }
    }, [userId]);

    const fetchProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (!error && data) {
            setProfile(data as Profile);
        }
        setLoading(false);
    };

    const fetchStats = async () => {
        if (!userId) return;

        const [postsResult, followersResult, followingResult] = await Promise.all([
            supabase.from('posts').select('id', { count: 'exact', head: true }).eq('user_id', userId),
            supabase.from('followers').select('follower_id', { count: 'exact', head: true }).eq('following_id', userId),
            supabase.from('followers').select('following_id', { count: 'exact', head: true }).eq('follower_id', userId),
        ]);

        setStats({
            posts: postsResult.count || 0,
            followers: followersResult.count || 0,
            following: followingResult.count || 0,
        });
    };

    const checkFollowStatus = async () => {
        if (!currentProfile?.id || !userId) return;

        const { data } = await supabase
            .from('followers')
            .select('*')
            .eq('follower_id', currentProfile.id)
            .eq('following_id', userId)
            .single();

        setIsFollowing(!!data);
    };

    const handleFollow = async () => {
        if (!currentProfile?.id || !userId) return;
        setFollowLoading(true);

        if (isFollowing) {
            await supabase
                .from('followers')
                .delete()
                .eq('follower_id', currentProfile.id)
                .eq('following_id', userId);
            setIsFollowing(false);
            setStats(prev => ({ ...prev, followers: prev.followers - 1 }));
        } else {
            await supabase
                .from('followers')
                .insert({ follower_id: currentProfile.id, following_id: userId });
            setIsFollowing(true);
            setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
        }

        setFollowLoading(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={32} className="text-primary-500 animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-4">
                <div className="card p-6 text-center">
                    <h2 className="text-xl font-bold mb-2">User not found</h2>
                    <button onClick={() => navigate(-1)} className="text-primary-400 hover:text-primary-300">
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
                <ArrowLeft size={20} />
                Back
            </button>

            {/* Profile Header */}
            <div className="card p-6">
                <div className="flex items-start gap-4">
                    {profile.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt=""
                            className="w-20 h-20 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center">
                            <span className="text-primary-400 font-bold text-2xl">
                                {profile.full_name?.charAt(0) || 'U'}
                            </span>
                        </div>
                    )}

                    <div className="flex-1">
                        <h1 className="text-xl font-bold">{profile.full_name}</h1>
                        <p className="text-gray-400">@{profile.username}</p>

                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {profile.university}
                            </span>
                            {profile.faculty && (
                                <span className="flex items-center gap-1">
                                    <BookOpen size={14} />
                                    {profile.faculty}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {profile.bio && (
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

                {/* Follow Button */}
                {!isOwnProfile && (
                    <button
                        onClick={handleFollow}
                        disabled={followLoading}
                        className={`w-full mt-6 py-3 rounded-xl font-semibold transition-colors ${isFollowing
                                ? 'bg-campus-card border border-campus-border text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400'
                                : 'bg-primary-500 text-white hover:bg-primary-600'
                            }`}
                    >
                        {followLoading ? (
                            <Loader2 size={18} className="animate-spin mx-auto" />
                        ) : isFollowing ? (
                            'Following'
                        ) : (
                            'Follow'
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
