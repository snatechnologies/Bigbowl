-- ============================================================
-- BIGBOWL — Supabase bootstrap
-- Run this file once in the Supabase Dashboard → SQL Editor.
-- It creates the catalogue tables, row-level security policies
-- and the public product-images storage bucket, then seeds the
-- three product categories.
-- Afterwards run:  npm run bootstrap:supabase   (seeds products)
-- ============================================================

-- ── Tables ──────────────────────────────────────────────────

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  tagline     text not null default '',
  description text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  description  text not null default '',
  price        numeric(10, 2) not null default 0,
  category_id  uuid references public.categories (id) on delete set null,
  image_url    text,
  is_published boolean not null default false,
  is_featured  boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists products_category_idx  on public.products (category_id);
create index if not exists products_published_idx on public.products (is_published);
create index if not exists products_featured_idx  on public.products (is_featured) where is_featured;

create table if not exists public.enquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  company    text,
  email      text,
  phone      text,
  product_id uuid references public.products (id) on delete set null,
  message    text not null,
  created_at timestamptz not null default now()
);

-- ── Row level security ──────────────────────────────────────

alter table public.categories enable row level security;
alter table public.products   enable row level security;
alter table public.enquiries  enable row level security;

-- Categories: readable by everyone, writable only by signed-in admins
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories for select
  using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

-- Products: anonymous visitors may only read published products;
-- signed-in admins can read and modify everything.
drop policy if exists "products_public_read_published" on public.products;
create policy "products_public_read_published"
  on public.products for select
  using (is_published = true);

drop policy if exists "products_admin_read_all" on public.products;
create policy "products_admin_read_all"
  on public.products for select
  to authenticated
  using (true);

drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "products_admin_delete" on public.products;
create policy "products_admin_delete"
  on public.products for delete
  to authenticated
  using (true);

-- Enquiries: anyone can submit; only signed-in admins can read.
drop policy if exists "enquiries_public_insert" on public.enquiries;
create policy "enquiries_public_insert"
  on public.enquiries for insert
  with check (true);

drop policy if exists "enquiries_admin_read" on public.enquiries;
create policy "enquiries_admin_read"
  on public.enquiries for select
  to authenticated
  using (true);

-- ── Storage: public product image bucket ────────────────────

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_insert" on storage.objects;
create policy "product_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "product_images_admin_update" on storage.objects;
create policy "product_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_delete" on storage.objects;
create policy "product_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- ── Seed categories ─────────────────────────────────────────

insert into public.categories (slug, name, tagline, description, sort_order) values
  ( 'onboarding-gifts'
  , 'Onboarding Gifts'
  , 'Welcome kits new joinees love'
  , 'Curated welcome kits and joining hampers that make day one memorable — drinkware, stationery, apparel and treats, branded for your company.'
  , 1
  ),
  ( 'festival-gifts'
  , 'Festival Gifts'
  , 'Hampers for every celebration'
  , 'Diwali, New Year, Pongal and every occasion in between — festive hampers with sweets, snacks and premium merchandise at bulk prices.'
  , 2
  ),
  ( 'office-utilities'
  , 'Office Utilities'
  , 'Everyday essentials for your workplace'
  , 'Pantry supplies, beverages, stationery and housekeeping essentials from trusted brands — delivered to your office on schedule.'
  , 3
  )
on conflict (slug) do nothing;
