import { createClient } from '@supabase/supabase-js';

// Force the new production keys, ignoring any old cached keys in Vercel.
const supabaseUrl = 'https://zafngjvhbtrytoeahzcc.supabase.co';
const supabaseAnonKey = 'sb_publishable__EhVlw40Om9Xg2rosA3nIg_LFvbvaAL';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TicketStatus = 'VALID' | 'USED';

export interface Ticket {
    reference: string;
    secret_token: string;
    name: string;
    phone: string;
    status: TicketStatus;
    created_at: string;
}
