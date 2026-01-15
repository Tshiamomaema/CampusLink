import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Post as PostType, Profile as ProfileType } from '../lib/types';
import Post from '../components/Post';
import { Search, TrendingUp, Users, Loader2 } from 'lucide-react';

export default function Explore() {
    const { profile } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'trending' | 'users'>('trending');
    const [trendingPosts, setTrendingPosts] = useState<PostType[]>([]);
    const [users, setUsers] = useState<ProfileType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'trending') {
            fetchTrendingPosts();
        } else {
            fetchUsers();
        }
    }, [activeTab, profile]);

    const fetchTrendingPosts = async () => {
        if (!profile) return;
        setLoading(true);

        const { data, error } = await supabase
            .from('posts')
            .select(`
        *,
        profiles:user_id (
          id, full_name, username, avatar_url, university
        )
      `)
            .eq('university', profile.university)
            .order('created_at', { ascending: false })
            .limit(20);

        if (!error && data) {
            // Fetch likes for each post to sort by popularity
            const postsWithLikes = await Promise.all(
                data.map(async (post) => {
                    const [likesResult, commentsResult, userLikeResult] = await Promise.all([
                        supabase.from('likes').select('*', { count: 'exact', head: true }).eq('post_id', post.id),
                        supabase.from('comments').select('*', { count: 'exact', head: true }).eq('post_id', post.id),
                        supabase.from('likes').select('*').eq('post_id', post.id).eq('user_id', profile.id).single(),
                    ]);

                    return {
                        ...post,
                        likes_count: likesResult.count || 0,
                        comments_count: commentsResult.count || 0,
                        user_has_liked: !!userLikeResult.data,
                    };
                })
            );

            // Sort by engagement (likes + comments)
            postsWithLikes.sort((a, b) =>
                (b.likes_count + b.comments_count) - (a.likes_count + a.comments_count)
            );

            setTrendingPosts(postsWithLikes);
        }
        setLoading(false);
    };

    const fetchUsers = async () => {
        if (!profile) return;
        setLoading(true);

        let query = supabase
            .from('profiles')
            .select('*')
            .eq('university', profile.university)
            .neq('id', profile.id)
            .limit(50);

        if (searchQuery) {
            query = query.or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (!error && data) {
            setUsers(data as ProfileType[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (activeTab === 'users' && searchQuery) {
            const timer = setTimeout(fetchUsers, 300);
            return () => clearTimeout(timer);
        }
    }, [searchQuery]);

    return (
        <div className="pb-4">
            {/* Search */}
            <div className="p-4 sticky top-14 bg-campus-dark/80 backdrop-blur-lg z-30">
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search posts and users..."
                        className="input pl-11"
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={() => setActiveTab('trending')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'trending'
                                ? 'bg-primary-500/20 text-primary-400'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <TrendingUp size={18} />
                        Trending
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'users'
                                ? 'bg-primary-500/20 text-primary-400'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Users size={18} />
                        People
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-4">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 size={32} className="text-primary-500 animate-spin" />
                    </div>
                ) : activeTab === 'trending' ? (
                    <div className="space-y-4">
                        {trendingPosts.length === 0 ? (
                            <div className="card p-6 text-center">
                                <p className="text-gray-400">No trending posts yet.</p>
                            </div>
                        ) : (
                            trendingPosts
                                .filter(post =>
                                    !searchQuery ||
                                    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((post) => (
                                    <Post key={post.id} post={post} />
                                ))
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {users.length === 0 ? (
                            <div className="card p-6 text-center">
                                <p className="text-gray-400">
                                    {searchQuery ? 'No users found.' : 'No users on your campus yet.'}
                                </p>
                            </div>
                        ) : (
                            users.map((user) => (
                                <Link
                                    key={user.id}
                                    to={`/user/${user.id}`}
                                    className="card p-4 flex items-center gap-3 hover:bg-campus-card/80 transition-colors"
                                >
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt=""
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                                            <span className="text-primary-400 font-semibold">
                                                {user.full_name?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold">{user.full_name}</p>
                                        <p className="text-sm text-gray-400">@{user.username}</p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
