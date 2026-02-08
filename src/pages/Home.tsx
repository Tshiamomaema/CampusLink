import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Post as PostType } from '../lib/types';
import Post from '../components/Post';
import CreatePostModal from '../components/CreatePostModal';
import { Feather, Loader2 } from 'lucide-react';

export default function Home() {
    const { profile } = useAuth();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'foryou' | 'campus' | 'following'>('foryou');

    const fetchPosts = useCallback(async () => {
        if (!profile) return;

        let query = supabase
            .from('posts')
            .select(`
        *,
        profiles:user_id (
          id, full_name, username, avatar_url, university
        ),
        likes(count),
        comments(count)
      `)
            .order('created_at', { ascending: false })
            .limit(50);

        if (activeTab === 'campus') {
            query = query.eq('university', profile.university);
        } else if (activeTab === 'following') {
            const { data: following } = await supabase
                .from('followers')
                .select('following_id')
                .eq('follower_id', profile.id);

            const followingIds = following?.map(f => f.following_id) || [];
            followingIds.push(profile.id);

            query = query.in('user_id', followingIds);
        }

        const { data, error } = await query;

        if (!error && data) {
            // Optimizations:
            // 1. Used embedded resources for counts (likes(count), comments(count)) to avoid N+1 requests
            // 2. Batched "user_has_liked" check into a single query instead of one per post
            let likedPostIds = new Set();

            if (data.length > 0) {
                const postIds = data.map(p => p.id);
                const { data: userLikes } = await supabase
                    .from('likes')
                    .select('post_id')
                    .eq('user_id', profile.id)
                    .in('post_id', postIds);

                if (userLikes) {
                    likedPostIds = new Set(userLikes.map(l => l.post_id));
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const postsWithCounts = data.map((post: any) => ({
                ...post,
                likes_count: post.likes?.[0]?.count ?? 0,
                comments_count: post.comments?.[0]?.count ?? 0,
                user_has_liked: likedPostIds.has(post.id),
            }));

            setPosts(postsWithCounts);
        }
        setLoading(false);
    }, [profile, activeTab]);

    useEffect(() => {
        if (profile) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchPosts();
        }
    }, [profile, fetchPosts]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={32} className="text-primary-500 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {/* Twitter-style Tabs */}
            <div className="flex border-b border-twitter-border sticky top-14 bg-black/80 backdrop-blur-md z-30">
                <button
                    onClick={() => setActiveTab('foryou')}
                    className={`tab-item ${activeTab === 'foryou' ? 'active' : ''}`}
                >
                    For you
                </button>
                <button
                    onClick={() => setActiveTab('campus')}
                    className={`tab-item ${activeTab === 'campus' ? 'active' : ''}`}
                >
                    Campus
                </button>
                <button
                    onClick={() => setActiveTab('following')}
                    className={`tab-item ${activeTab === 'following' ? 'active' : ''}`}
                >
                    Following
                </button>
            </div>

            {/* Posts */}
            <div>
                {posts.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-twitter-textGray mb-4">
                            {activeTab === 'following'
                                ? "No posts from people you follow yet."
                                : activeTab === 'campus'
                                    ? "No posts on your campus yet."
                                    : "No posts yet. Be the first!"}
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary"
                        >
                            Create post
                        </button>
                    </div>
                ) : (
                    posts.map((post) => (
                        <Post key={post.id} post={post} />
                    ))
                )}
            </div>

            {/* FAB */}
            <button
                onClick={() => setShowCreateModal(true)}
                className="fab"
            >
                <Feather size={24} />
            </button>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onPostCreated={fetchPosts}
            />
        </div>
    );
}
