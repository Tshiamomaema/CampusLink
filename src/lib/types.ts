// Database types for Supabase

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, 'created_at'>;
                Update: Partial<Profile>;
            };
            posts: {
                Row: Post;
                Insert: Omit<Post, 'id' | 'created_at'>;
                Update: Partial<Post>;
            };
            comments: {
                Row: Comment;
                Insert: Omit<Comment, 'id' | 'created_at'>;
                Update: Partial<Comment>;
            };
            likes: {
                Row: Like;
                Insert: Like;
                Update: Partial<Like>;
            };
            followers: {
                Row: Follower;
                Insert: Follower;
                Update: Partial<Follower>;
            };
            marketplace_listings: {
                Row: Listing;
                Insert: Omit<Listing, 'id' | 'created_at'>;
                Update: Partial<Listing>;
            };
            listing_favorites: {
                Row: ListingFavorite;
                Insert: ListingFavorite;
                Update: Partial<ListingFavorite>;
            };
            notifications: {
                Row: Notification;
                Insert: Omit<Notification, 'id' | 'created_at'>;
                Update: Partial<Notification>;
            };
        };
    };
};

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    username: string;
    avatar_url: string | null;
    bio: string | null;
    university: string;
    faculty: string | null;
    created_at: string;
}

export interface Post {
    id: string;
    user_id: string;
    content: string | null;
    image_url: string | null;
    post_type: 'text' | 'image';
    university: string;
    created_at: string;
    // Joined fields
    profiles?: Profile;
    likes_count?: number;
    comments_count?: number;
    user_has_liked?: boolean;
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    // Joined fields
    profiles?: Profile;
}

export interface Like {
    post_id: string;
    user_id: string;
}

export interface Follower {
    follower_id: string;
    following_id: string;
    created_at: string;
}

export interface Listing {
    id: string;
    seller_id: string;
    title: string;
    description: string | null;
    price: number;
    image_url: string | null;
    category: 'books' | 'electronics' | 'services' | 'housing' | 'other';
    university: string;
    status: 'active' | 'sold' | 'deleted';
    created_at: string;
    // Joined fields
    profiles?: Profile;
}

export interface ListingFavorite {
    listing_id: string;
    user_id: string;
}

export interface Notification {
    id: string;
    user_id: string;
    type: 'follow' | 'like' | 'comment' | 'marketplace';
    actor_id: string;
    post_id: string | null;
    listing_id: string | null;
    read: boolean;
    created_at: string;
    // Joined fields
    actor?: Profile;
}
