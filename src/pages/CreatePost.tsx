import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Type, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function CreatePost() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [postType, setPostType] = useState<'text' | 'image'>('text');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Create Post</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card p-4">
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
                    <label
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${postType === 'image'
                                ? 'bg-primary-500/20 text-primary-400'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Image size={18} />
                        Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Content Input */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, 280))}
                    className="input resize-none h-40 mb-2"
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
                            className="w-full rounded-xl object-cover max-h-80"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setImageUrl('');
                                setImageFile(null);
                            }}
                            className="absolute top-2 right-2 bg-black/50 px-3 py-1 rounded-full text-sm hover:bg-black/70 transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                )}

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
    );
}
