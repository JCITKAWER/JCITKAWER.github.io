-- FINAL PRODUCTION SCHEMA
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.tickets (
    reference text PRIMARY KEY,
    secret_token uuid NOT NULL UNIQUE,
    name text,
    phone text,
    status text NOT NULL DEFAULT 'VALID',
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Clean transition for policies
DROP POLICY IF EXISTS "Allow public insert for ticket activation" ON public.tickets;
DROP POLICY IF EXISTS "Allow reading for scanner verification" ON public.tickets;
DROP POLICY IF EXISTS "Allow update for scanner (mark as used)" ON public.tickets;
DROP POLICY IF EXISTS "Allow public all access" ON public.tickets;

-- Single robust policy for the tournament
CREATE POLICY "Allow public all access" 
ON public.tickets FOR ALL 
TO public 
USING (true) 
WITH CHECK (true);
