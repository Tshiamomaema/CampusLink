import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from 'lucide-react';
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

            // Create notification for post owner (if not liking own post)
            if (post.user_id !== profile.id) {
                await supabase.from('notifications').insert({
                    user_id: post.user_id,
                    type: 'like',
                    actor_id: profile.id,
                    post_id: post.id,
                });
            }
        }

        onLikeUpdate?.(post.id, !liked);
    };

    const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: false });

    return (
        <article className="post-card flex gap-3">
            {/* Avatar */}
            <Link to={`/user/${post.user_id}`} className="flex-shrink-0">
                {post.profiles?.avatar_url ? (
                    <img
                        src={post.profiles.avatar_url}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-twitter-darkCard flex items-center justify-center">
                        <span className="text-twitter-textLight font-semibold text-sm">
                            {post.profiles?.full_name?.charAt(0) || 'U'}
                        </span>
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-1 text-sm">
                    <Link to={`/user/${post.user_id}`} className="font-bold text-twitter-textLight hover:underline truncate">
                        {post.profiles?.full_name || 'User'}
                    </Link>
                    <span className="text-twitter-textGray truncate">@{post.profiles?.username}</span>
                    <span className="text-twitter-textGray">·</span>
                    <span className="text-twitter-textGray">{timeAgo}</span>
                    <button className="ml-auto text-twitter-textGray hover:text-primary-500 p-1 hover:bg-primary-500/10 rounded-full">
                        <MoreHorizontal size={16} />
                    </button>
                </div>

                {/* Text */}
                {post.content && (
                    <p className="text-twitter-textLight mt-1 whitespace-pre-wrap">{post.content}</p>
                )}

                {/* Image */}
                {post.image_url && (
                    <div className="mt-3 rounded-2xl overflow-hidden border border-twitter-border">
                        <img
                            src={post.image_url}
                            alt=""
                            className="w-full object-cover max-h-96"
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-3 max-w-md">
                    <button className="flex items-center gap-1 text-twitter-textGray hover:text-primary-500 group">
                        <div className="p-2 rounded-full group-hover:bg-primary-500/10 transition-colors">
                            <MessageCircle size={18} />
                        </div>
                        <span className="text-sm">{post.comments_count || ''}</span>
                    </button>

                    <button className="flex items-center gap-1 text-twitter-textGray hover:text-green-500 group">
                        <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                            <Repeat2 size={18} />
                        </div>
                    </button>

                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1 group ${liked ? 'text-pink-500' : 'text-twitter-textGray hover:text-pink-500'}`}
                    >
                        <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                        </div>
                        <span className="text-sm">{likesCount || ''}</span>
                    </button>

                    <button className="flex items-center gap-1 text-twitter-textGray hover:text-primary-500 group">
                        <div className="p-2 rounded-full group-hover:bg-primary-500/10 transition-colors">
                            <Share size={18} />
                        </div>
                    </button>
                </div>
            </div>
        </article>
    );
}
