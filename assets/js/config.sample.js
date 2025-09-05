/**
 * Copy this file to: /assets/js/config.js
 * Then fill in your values from Supabase Project Settings → API.
 * It's OK to ship the anon key to the client because RLS protects writes.
 */
export const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";
/**
 * After you create your sister's account, replace HER_UUID below.
 * How to get it: Supabase Dashboard → Authentication → Users → copy the UUID.
 */
export const HER_UUID = "REPLACE-WITH-HER-USER-UUID";

/*
-----------------------------------------------------------------------------
SQL setup (run in Supabase SQL Editor):

-- Table: inspirations (one per day)
create table if not exists public.inspirations (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  text text not null,
  author_id uuid not null,
  created_at timestamp with time zone default now()
);

-- Table: resources (video URLs)
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  type text not null default 'video',
  author_id uuid not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.inspirations enable row level security;
alter table public.resources enable row level security;

-- Policies: Public can read; only HER_UUID can write.
-- Replace 00000000-0000-0000-0000-000000000000 with your sister's UUID.
-- You can add the UUID after her first sign-in, then rerun/update the policy.

-- READ (public)
create policy "inspirations_select_public"
on public.inspirations for select
using ( true );

create policy "resources_select_public"
on public.resources for select
using ( true );

-- WRITE (only her)
create policy "inspirations_write_her_only"
on public.inspirations for insert with check ( auth.uid() = author_id and author_id = '00000000-0000-0000-0000-000000000000'::uuid );

create policy "inspirations_update_her_only"
on public.inspirations for update using ( auth.uid() = author_id and author_id = '00000000-0000-0000-0000-000000000000'::uuid );

create policy "resources_write_her_only"
on public.resources for insert with check ( auth.uid() = author_id and author_id = '00000000-0000-0000-0000-000000000000'::uuid );

create policy "resources_update_her_only"
on public.resources for update using ( auth.uid() = author_id and author_id = '00000000-0000-0000-0000-000000000000'::uuid );

-- Optional: allow her to delete her own posts
create policy "inspirations_delete_her_only"
on public.inspirations for delete using ( auth.uid() = author_id and author_id = '00000000-0000-0000-0000-000000000000'::uuid );

create policy "resources_delete_her_only"
on public.resources for delete using ( auth.uid() = author_id and author_id = '00000000-0000-0000-0000-000000000000'::uuid );

-----------------------------------------------------------------------------
Auth setup:
- In Supabase Dashboard → Authentication → Providers:
  - Enable Email (magic link).
  - (Optional) Enable Passkeys.
- Have your sister sign in once via magic link to create her user.
- Copy her UUID → set HER_UUID above.
- Re-run/update the RLS policies to include her UUID if you didn’t set it earlier.
-----------------------------------------------------------------------------
*/
