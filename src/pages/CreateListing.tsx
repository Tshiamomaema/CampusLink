import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const CATEGORIES = [
    { value: 'books', label: 'Books' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'services', label: 'Services' },
    { value: 'housing', label: 'Housing' },
    { value: 'other', label: 'Other' },
];

export default function CreateListing() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('other');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile || !profile) return null;

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${profile.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('listings')
            .upload(fileName, imageFile);

        if (uploadError) {
            throw new Error('Failed to upload image');
        }

        const { data } = supabase.storage.from('listings').getPublicUrl(fileName);
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
                .from('marketplace_listings')
                .insert({
                    seller_id: profile.id,
                    title: title.trim(),
                    description: description.trim() || null,
                    price: parseFloat(price),
                    image_url: uploadedImageUrl,
                    category,
                    university: profile.university,
                });

            if (insertError) {
                setError(insertError.message);
                return;
            }

            navigate('/marketplace');
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
                <h1 className="text-xl font-bold">Create Listing</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card p-4 space-y-5">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {/* Image */}
                <div>
                    <label className="block text-sm font-medium mb-2">Photo</label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-campus-border rounded-xl p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
                    >
                        {imageUrl ? (
                            <img src={imageUrl} alt="" className="max-h-48 mx-auto rounded-lg" />
                        ) : (
                            <div className="text-gray-500">
                                <Image size={32} className="mx-auto mb-2" />
                                <p>Click to add photo</p>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                        className="input"
                        placeholder="What are you selling?"
                        required
                        maxLength={100}
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium mb-2">Price (R)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="input"
                        placeholder="0.00"
                        required
                        min="0"
                        step="0.01"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                        className="input resize-none h-32"
                        placeholder="Describe your item..."
                        maxLength={1000}
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                        {description.length}/1000
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading || !title.trim() || !price}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Creating...
                        </>
                    ) : (
                        'Create Listing'
                    )}
                </button>
            </form>
        </div>
    );
}
