import { useState, useRef } from 'react';
import { X, Image, Type, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated?: () => void;
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
    const { profile } = useAuth();
    const [postType, setPostType] = useState<'text' | 'image'>('text');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
            setPostType('image');
        }
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile || !profile) return null;

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${profile.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(fileName, imageFile);

        if (uploadError) {
            throw new Error('Failed to upload image');
        }

        const { data } = supabase.storage.from('posts').getPublicUrl(fileName);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setError('');
        setLoading(true);

        try {
            let uploadedImageUrl = null;

            if (imageFile) {
                uploadedImageUrl = await uploadImage();
            }

            const { error: insertError } = await supabase
                .from('posts')
                .insert({
                    user_id: profile.id,
                    content: content.trim() || null,
                    image_url: uploadedImageUrl,
                    post_type: uploadedImageUrl ? 'image' : 'text',
                    university: profile.university,
                });

            if (insertError) {
                setError(insertError.message);
                return;
            }

            setContent('');
            setImageUrl('');
            setImageFile(null);
            setPostType('text');
            onPostCreated?.();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const clearImage = () => {
        setImageUrl('');
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20">
            <div className="card w-full max-w-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-campus-border">
                    <h2 className="text-lg font-bold">Create Post</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">
                            {error}
                        </div>
                    )}

                    {/* Post Type Tabs */}
                    <div className="flex gap-2 mb-4">
                        <button
                            type="button"
                            onClick={() => setPostType('text')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${postType === 'text'
                                    ? 'bg-primary-500/20 text-primary-400'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Type size={18} />
                            Text
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${postType === 'image'
                                    ? 'bg-primary-500/20 text-primary-400'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Image size={18} />
                            Image
                        </button>
                    </div>

                    {/* Content Input */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value.slice(0, 280))}
                        className="input resize-none h-32 mb-2"
                        placeholder={postType === 'image' ? 'Add a caption...' : "What's happening on campus?"}
                        maxLength={280}
                    />
                    <div className="text-right text-xs text-gray-500 mb-4">
                        {content.length}/280
                    </div>

                    {/* Image Preview */}
                    {imageUrl && (
                        <div className="relative mb-4">
                            <img
                                src={imageUrl}
                                alt=""
                                className="w-full rounded-xl object-cover max-h-64"
                            />
                            <button
                                type="button"
                                onClick={clearImage}
                                className="absolute top-2 right-2 bg-black/50 p-1 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || (!content.trim() && !imageFile)}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Posting...
                            </>
                        ) : (
                            'Post'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
