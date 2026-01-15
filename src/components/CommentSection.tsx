import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Comment } from '../lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Send, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CommentSectionProps {
    postId: string;
    isOpen: boolean;
}

export default function CommentSection({ postId, isOpen }: CommentSectionProps) {
    const { profile } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen, postId]);

    const fetchComments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('comments')
            .select(`
        *,
        profiles:user_id (
          id, full_name, username, avatar_url
        )
      `)
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (!error && data) {
            setComments(data as Comment[]);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile || !newComment.trim()) return;

        setSubmitting(true);

        const { data, error } = await supabase
            .from('comments')
            .insert({
                post_id: postId,
                user_id: profile.id,
                content: newComment.trim(),
            })
            .select(`
        *,
        profiles:user_id (
          id, full_name, username, avatar_url
        )
      `)
            .single();

        if (!error && data) {
            setComments(prev => [...prev, data as Comment]);
            setNewComment('');
        }

        setSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="mt-3 pt-3 border-t border-campus-border">
            {loading ? (
                <div className="flex justify-center py-4">
                    <Loader2 size={20} className="text-primary-500 animate-spin" />
                </div>
            ) : (
                <>
                    {/* Comments List */}
                    <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-2">No comments yet</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-2">
                                    <Link to={`/user/${comment.user_id}`}>
                                        {comment.profiles?.avatar_url ? (
                                            <img
                                                src={comment.profiles.avatar_url}
                                                alt=""
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                                                <span className="text-primary-400 font-semibold text-xs">
                                                    {comment.profiles?.full_name?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                        )}
                                    </Link>
                                    <div className="flex-1 bg-campus-card rounded-xl px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <Link to={`/user/${comment.user_id}`} className="font-semibold text-sm hover:underline">
                                                {comment.profiles?.full_name}
                                            </Link>
                                            <span className="text-xs text-gray-500">
                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-300">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* New Comment Input */}
                    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value.slice(0, 500))}
                            placeholder="Write a comment..."
                            className="input flex-1 py-2"
                            maxLength={500}
                        />
                        <button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="btn-primary px-4 disabled:opacity-50"
                        >
                            {submitting ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Send size={18} />
                            )}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
