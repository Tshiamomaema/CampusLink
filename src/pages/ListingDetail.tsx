import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Listing } from '../lib/types';
import { ArrowLeft, Heart, MapPin, Calendar, User, MessageCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ListingDetail() {
    const { listingId } = useParams<{ listingId: string }>();
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetchListing();
        checkFavorite();
    }, [listingId]);

    const fetchListing = async () => {
        if (!listingId) return;

        const { data, error } = await supabase
            .from('marketplace_listings')
            .select(`
        *,
        profiles:seller_id (
          id, full_name, username, avatar_url, university
        )
      `)
            .eq('id', listingId)
            .single();

        if (!error && data) {
            setListing(data as Listing);
        }
        setLoading(false);
    };

    const checkFavorite = async () => {
        if (!profile || !listingId) return;

        const { data } = await supabase
            .from('listing_favorites')
            .select('*')
            .eq('listing_id', listingId)
            .eq('user_id', profile.id)
            .single();

        setIsFavorite(!!data);
    };

    const toggleFavorite = async () => {
        if (!profile || !listingId) return;

        if (isFavorite) {
            await supabase
                .from('listing_favorites')
                .delete()
                .eq('listing_id', listingId)
                .eq('user_id', profile.id);
        } else {
            await supabase
                .from('listing_favorites')
                .insert({ listing_id: listingId, user_id: profile.id });
        }

        setIsFavorite(!isFavorite);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={32} className="text-primary-500 animate-spin" />
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="p-4">
                <div className="card p-6 text-center">
                    <h2 className="text-xl font-bold mb-2">Listing not found</h2>
                    <button onClick={() => navigate(-1)} className="text-primary-400 hover:text-primary-300">
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-24">
            {/* Header */}
            <div className="flex items-center gap-4 p-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold flex-1 truncate">{listing.title}</h1>
                <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-red-400 bg-red-500/20' : 'text-gray-400 bg-campus-card'
                        }`}
                >
                    <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* Image */}
            {listing.image_url ? (
                <img
                    src={listing.image_url}
                    alt={listing.title}
                    className="w-full max-h-80 object-cover"
                />
            ) : (
                <div className="w-full h-48 bg-campus-card flex items-center justify-center">
                    <span className="text-6xl">📦</span>
                </div>
            )}

            {/* Details */}
            <div className="p-4">
                <div className="card p-4">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl font-bold text-primary-400">
                            R{listing.price.toFixed(2)}
                        </span>
                        <span className="px-3 py-1 bg-campus-card rounded-full text-sm text-gray-400">
                            {listing.category}
                        </span>
                    </div>

                    <h2 className="text-xl font-bold mb-2">{listing.title}</h2>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {listing.university}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
                        </span>
                    </div>

                    {listing.description && (
                        <p className="text-gray-300 whitespace-pre-wrap">{listing.description}</p>
                    )}
                </div>

                {/* Seller Info */}
                <div className="card p-4 mt-4">
                    <h3 className="font-semibold mb-3">Seller</h3>
                    <Link
                        to={`/user/${listing.profiles?.id}`}
                        className="flex items-center gap-3"
                    >
                        {listing.profiles?.avatar_url ? (
                            <img
                                src={listing.profiles.avatar_url}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                                <User size={20} className="text-primary-400" />
                            </div>
                        )}
                        <div>
                            <p className="font-semibold">{listing.profiles?.full_name}</p>
                            <p className="text-sm text-gray-400">@{listing.profiles?.username}</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Contact Button */}
            {listing.seller_id !== profile?.id && (
                <div className="fixed bottom-20 left-0 right-0 p-4 bg-campus-dark/80 backdrop-blur-lg border-t border-campus-border">
                    <button className="btn-primary w-full flex items-center justify-center gap-2">
                        <MessageCircle size={18} />
                        Contact Seller
                    </button>
                </div>
            )}
        </div>
    );
}
