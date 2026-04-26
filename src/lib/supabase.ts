import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TicketStatus = 'VALID' | 'USED';

export interface Ticket {
  reference: string;
  name: string;
  phone: string;
  status: TicketStatus;
  created_at: string;
}
