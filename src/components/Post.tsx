import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Post as PostType } from '../lib/types';
import { formatDistanceToNow } from 'date-fns';

interface PostProps {
    post: PostType;
    onLikeUpdate?: (postId: string, liked: boolean) => void;
}

export default function Post({ post, onLikeUpdate }: PostProps) {
    const { profile } = useAuth();
    const [liked, setLiked] = useState(post.user_has_liked || false);
    const [likesCount, setLikesCount] = useState(post.likes_count || 0);
    const [showComments, setShowComments] = useState(false);

    const handleLike = async () => {
        if (!profile?.id) return;

        if (liked) {
            await supabase
                .from('likes')
                .delete()
                .eq('post_id', post.id)
                .eq('user_id', profile.id);
            setLiked(false);
            setLikesCount(prev => prev - 1);
        } else {
            await supabase
                .from('likes')
                .insert({ post_id: post.id, user_id: profile.id });
            setLiked(true);
            setLikesCount(prev => prev + 1);
        }

        onLikeUpdate?.(post.id, !liked);
    };

    const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

    return (
        <div className="card p-4">
            {/* Author Header */}
            <div className="flex items-start gap-3">
                <Link to={`/user/${post.user_id}`}>
                    {post.profiles?.avatar_url ? (
                        <img
                            src={post.profiles.avatar_url}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                            <span className="text-primary-400 font-semibold text-sm">
                                {post.profiles?.full_name?.charAt(0) || 'U'}
                            </span>
                        </div>
                    )}
                </Link>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <Link to={`/user/${post.user_id}`} className="font-semibold hover:underline truncate">
                            {post.profiles?.full_name || 'User'}
                        </Link>
                        <span className="text-gray-500 text-sm">@{post.profiles?.username}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{post.university}</span>
                        <span>•</span>
                        <span>{timeAgo}</span>
                    </div>
                </div>

                <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Content */}
            {post.content && (
                <p className="mt-3 text-gray-200 whitespace-pre-wrap">{post.content}</p>
            )}

            {/* Image */}
            {post.image_url && (
                <div className="mt-3 rounded-xl overflow-hidden">
                    <img
                        src={post.image_url}
                        alt=""
                        className="w-full object-cover max-h-96"
                    />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-campus-border">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors ${liked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                        }`}
                >
                    <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                    <span className="text-sm">{likesCount}</span>
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors"
                >
                    <MessageCircle size={18} />
                    <span className="text-sm">{post.comments_count || 0}</span>
                </button>

                <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                    <Share2 size={18} />
                </button>
            </div>
        </div>
    );
}
