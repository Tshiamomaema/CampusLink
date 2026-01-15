import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Listing } from '../lib/types';
import { Plus, Search, Loader2, Heart, MapPin } from 'lucide-react';

const CATEGORIES = [
    { value: 'all', label: 'All' },
    { value: 'books', label: 'Books' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'services', label: 'Services' },
    { value: 'housing', label: 'Housing' },
    { value: 'other', label: 'Other' },
];

export default function Marketplace() {
    const { profile } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchListings();
        fetchFavorites();
    }, [profile, category]);

    const fetchListings = async () => {
        if (!profile) return;

        let query = supabase
            .from('marketplace_listings')
            .select(`
        *,
        profiles:seller_id (
          id, full_name, username, avatar_url, university
        )
      `)
            .eq('university', profile.university)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (!error && data) {
            setListings(data as Listing[]);
        }
        setLoading(false);
    };

    const fetchFavorites = async () => {
        if (!profile) return;

        const { data } = await supabase
            .from('listing_favorites')
            .select('listing_id')
            .eq('user_id', profile.id);

        if (data) {
            setFavorites(new Set(data.map(f => f.listing_id)));
        }
    };

    const toggleFavorite = async (listingId: string) => {
        if (!profile) return;

        if (favorites.has(listingId)) {
            await supabase
                .from('listing_favorites')
                .delete()
                .eq('listing_id', listingId)
                .eq('user_id', profile.id);
            setFavorites(prev => {
                const next = new Set(prev);
                next.delete(listingId);
                return next;
            });
        } else {
            await supabase
                .from('listing_favorites')
                .insert({ listing_id: listingId, user_id: profile.id });
            setFavorites(prev => new Set(prev).add(listingId));
        }
    };

    const filteredListings = listings.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={32} className="text-primary-500 animate-spin" />
            </div>
        );
    }

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
                        placeholder="Search marketplace..."
                        className="input pl-11"
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.value}
                            onClick={() => setCategory(cat.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${category === cat.value
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-campus-card text-gray-400 hover:text-white'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Listings Grid */}
            <div className="px-4">
                {filteredListings.length === 0 ? (
                    <div className="card p-8 text-center">
                        <p className="text-gray-400 mb-4">
                            No listings found. Be the first to sell something!
                        </p>
                        <Link to="/marketplace/create" className="btn-primary inline-block">
                            Create Listing
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {filteredListings.map((listing) => (
                            <Link
                                key={listing.id}
                                to={`/marketplace/${listing.id}`}
                                className="card overflow-hidden group"
                            >
                                {listing.image_url ? (
                                    <img
                                        src={listing.image_url}
                                        alt={listing.title}
                                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-full h-32 bg-campus-card flex items-center justify-center">
                                        <span className="text-4xl">📦</span>
                                    </div>
                                )}
                                <div className="p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-sm truncate flex-1">
                                            {listing.title}
                                        </h3>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleFavorite(listing.id);
                                            }}
                                            className={`transition-colors ${favorites.has(listing.id) ? 'text-red-400' : 'text-gray-400'
                                                }`}
                                        >
                                            <Heart size={16} fill={favorites.has(listing.id) ? 'currentColor' : 'none'} />
                                        </button>
                                    </div>
                                    <p className="text-primary-400 font-bold mt-1">
                                        R{listing.price.toFixed(2)}
                                    </p>
                                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                        <MapPin size={12} />
                                        <span className="truncate">{listing.university}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <Link
                to="/marketplace/create"
                className="fixed bottom-24 right-4 bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-lg transition-colors z-40"
            >
                <Plus size={24} />
            </Link>
        </div>
    );
}
