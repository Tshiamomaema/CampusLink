import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Post as PostType } from '../lib/types';
import Post from '../components/Post';
import CreatePostModal from '../components/CreatePostModal';
import { Plus, Loader2, RefreshCw } from 'lucide-react';

export default function Home() {
    const { profile } = useAuth();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [feedFilter, setFeedFilter] = useState<'campus' | 'following'>('campus');

    const fetchPosts = useCallback(async () => {
        if (!profile) return;

        let query = supabase
            .from('posts')
            .select(`
        *,
        profiles:user_id (
          id, full_name, username, avatar_url, university
        )
      `)
            .order('created_at', { ascending: false })
            .limit(50);

        if (feedFilter === 'campus') {
            query = query.eq('university', profile.university);
        } else {
            // Get posts from followed users
            const { data: following } = await supabase
                .from('followers')
                .select('following_id')
                .eq('follower_id', profile.id);

            const followingIds = following?.map(f => f.following_id) || [];
            followingIds.push(profile.id); // Include own posts

            query = query.in('user_id', followingIds);
        }

        const { data, error } = await query;

        if (!error && data) {
            // Fetch likes count and user's likes for each post
            const postsWithLikes = await Promise.all(
                data.map(async (post) => {
                    const [likesResult, userLikeResult] = await Promise.all([
                        supabase.from('likes').select('*', { count: 'exact', head: true }).eq('post_id', post.id),
                        supabase.from('likes').select('*').eq('post_id', post.id).eq('user_id', profile.id).single(),
                    ]);

                    const commentsResult = await supabase
                        .from('comments')
                        .select('*', { count: 'exact', head: true })
                        .eq('post_id', post.id);

                    return {
                        ...post,
                        likes_count: likesResult.count || 0,
                        comments_count: commentsResult.count || 0,
                        user_has_liked: !!userLikeResult.data,
                    };
                })
            );

            setPosts(postsWithLikes);
        }
        setLoading(false);
        setRefreshing(false);
    }, [profile, feedFilter]);

    useEffect(() => {
        if (profile) {
            fetchPosts();
        }
    }, [profile, fetchPosts]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchPosts();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={32} className="text-primary-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="pb-4">
            {/* Feed Filter */}
            <div className="sticky top-14 bg-campus-dark/80 backdrop-blur-lg border-b border-campus-border z-30">
                <div className="flex">
                    <button
                        onClick={() => setFeedFilter('campus')}
                        className={`flex-1 py-3 text-center font-medium transition-colors relative ${feedFilter === 'campus' ? 'text-white' : 'text-gray-500'
                            }`}
                    >
                        My Campus
                        {feedFilter === 'campus' && (
                            <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary-500 rounded-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setFeedFilter('following')}
                        className={`flex-1 py-3 text-center font-medium transition-colors relative ${feedFilter === 'following' ? 'text-white' : 'text-gray-500'
                            }`}
                    >
                        Following
                        {feedFilter === 'following' && (
                            <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary-500 rounded-full" />
                        )}
                    </button>
                </div>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-center py-2">
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-400 transition-colors"
                >
                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Refreshing...' : 'Refresh feed'}
                </button>
            </div>

            {/* Posts */}
            <div className="space-y-4 px-4">
                {posts.length === 0 ? (
                    <div className="card p-8 text-center">
                        <p className="text-gray-400 mb-4">
                            {feedFilter === 'following'
                                ? "No posts from people you follow yet. Start following some students!"
                                : "No posts on your campus yet. Be the first to post!"}
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary"
                        >
                            Create Post
                        </button>
                    </div>
                ) : (
                    posts.map((post) => (
                        <Post key={post.id} post={post} />
                    ))
                )}
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setShowCreateModal(true)}
                className="fixed bottom-24 right-4 bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-lg transition-colors z-40"
            >
                <Plus size={24} />
            </button>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onPostCreated={handleRefresh}
            />
        </div>
    );
}
