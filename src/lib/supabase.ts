import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xkzktrrtjjenjnbnheba.supabase.co';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_X1AxB_PezB8fnCCudJMm7w_kmls4VF1';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
  supabaseAnonKey.length > 20
);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;
