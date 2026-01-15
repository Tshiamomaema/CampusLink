import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create a mock client if not configured (for demo purposes)
let supabaseInstance: SupabaseClient;

if (isSupabaseConfigured) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
    // Create a placeholder that will show setup instructions
    console.warn('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local');
    // @ts-ignore - Creating a minimal mock for demo
    supabaseInstance = {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signUp: () => Promise.resolve({ error: new Error('Supabase not configured') }),
            signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured') }),
            signOut: () => Promise.resolve({ error: null }),
        },
        from: () => ({
            select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
            insert: () => Promise.resolve({ error: new Error('Supabase not configured') }),
            update: () => ({ eq: () => Promise.resolve({ error: new Error('Supabase not configured') }) }),
            delete: () => ({ eq: () => Promise.resolve({ error: new Error('Supabase not configured') }) }),
        }),
        storage: {
            from: () => ({
                upload: () => Promise.resolve({ error: new Error('Supabase not configured') }),
                getPublicUrl: () => ({ data: { publicUrl: '' } }),
            }),
        },
    } as unknown as SupabaseClient;
}

export const supabase = supabaseInstance;
