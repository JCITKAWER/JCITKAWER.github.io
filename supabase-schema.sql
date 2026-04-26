-- Put this into your Supabase SQL Editor and hit "Run"

CREATE TABLE public.tickets (
    reference text primary key,
    name text not null,
    phone text not null,
    status text not null default 'VALID',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS) but allow public server operations since this is an internal app
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for ticket activation" 
ON public.tickets FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow reading for scanner verification" 
ON public.tickets FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow update for scanner (mark as used)" 
ON public.tickets FOR UPDATE 
TO public
USING (true);
