import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create client even with placeholder values for development
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Check if we have real Supabase credentials
export const hasSupabaseCredentials = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key' &&
         supabaseUrl && 
         supabaseAnonKey;
}


// Database types
export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface UserMatch {
  id: string;
  user_id: string;
  vehicle_id: number;
  vehicle_name: string;
  vehicle_type: string;
  vehicle_image?: string;
  matched_at: string;
  last_message?: string;
  last_message_at: string;
}

export interface ChatMessage {
  id: string;
  match_id: string;
  user_id: string;
  message: string;
  is_from_user: boolean;
  created_at: string;
}