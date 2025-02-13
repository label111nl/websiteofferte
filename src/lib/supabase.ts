import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error("Missing Supabase URL. Please check your VITE_SUPABASE_URL environment variable.");
}

if (!supabaseAnonKey) {
  throw new Error("Missing Supabase ANON KEY. Please check your VITE_SUPABASE_ANON_KEY environment variable.");
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Optional: Helper function for creating additional clients (e.g., with Service Role Key)
export const createCustomSupabaseClient = (url: string, key: string): SupabaseClient => {
  if (!url || !key) {
    throw new Error("Supabase URL and Key are required to create a custom client.");
  }
  return createClient(url, key);
};
