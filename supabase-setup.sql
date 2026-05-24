-- ============================================================
-- BNB CATALOG — SUPABASE DATABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- CATEGORIES
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- PRODUCTS
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  lot_code text unique not null,
  name text not null,
  slug text unique not null,
  description text,
  category_id uuid references categories(id) on delete set null,
  features text[] default '{}',
  pack_size int,
  colour_mix text,
  total_lot_size int,
  models jsonb default '{}',
  image_urls text[] default '{}',
  video_url text,
  featured boolean default false,
  new_arrival boolean default true,
  sold_out boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- SETTINGS
create table if not exists settings (
  key text primary key,
  value text not null
);

-- Default settings
insert into settings (key, value) values
  ('whatsapp_number', '917666288880'),
  ('store_name', 'BNB'),
  ('announcement', 'New arrivals daily — browse and inquire on WhatsApp!')
on conflict (key) do nothing;

-- INDEXES
create index if not exists products_category_idx on products(category_id);
create index if not exists products_new_arrival_idx on products(new_arrival) where new_arrival = true;
create index if not exists products_featured_idx on products(featured) where featured = true;
create index if not exists products_sold_out_idx on products(sold_out);
create index if not exists products_created_at_idx on products(created_at desc);
create index if not exists products_models_gin on products using gin(models);
create index if not exists products_name_search on products using gin(to_tsvector('english', name));

-- AUTO-UPDATE updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger products_updated_at before update on products
  for each row execute function update_updated_at();

-- ROW LEVEL SECURITY
alter table products enable row level security;
alter table categories enable row level security;
alter table settings enable row level security;

-- Public can read products, categories, settings
create policy "public_read_products" on products for select using (true);
create policy "public_read_categories" on categories for select using (true);
create policy "public_read_settings" on settings for select using (true);

-- Only authenticated admins can write
create policy "admin_all_products" on products for all using (auth.role() = 'authenticated');
create policy "admin_all_categories" on categories for all using (auth.role() = 'authenticated');
create policy "admin_all_settings" on settings for all using (auth.role() = 'authenticated');

-- STORAGE BUCKET (run this too)
-- In Supabase Dashboard > Storage > New Bucket:
-- Name: product-images
-- Public: YES
-- File size limit: 52428800 (50MB)
-- Allowed MIME types: image/jpeg, image/png, image/webp, video/mp4, video/quicktime

-- Storage policies
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public_read_storage" on storage.objects for select using (bucket_id = 'product-images');
create policy "admin_upload_storage" on storage.objects for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "admin_update_storage" on storage.objects for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "admin_delete_storage" on storage.objects for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- SAMPLE CATEGORIES
insert into categories (name, slug, sort_order) values
  ('iPhone Covers', 'iphone-covers', 1),
  ('Samsung Covers', 'samsung-covers', 2),
  ('Transparent Cases', 'transparent-cases', 3),
  ('Silicone Covers', 'silicone-covers', 4),
  ('MagSafe Covers', 'magsafe-covers', 5),
  ('Rugged Covers', 'rugged-covers', 6)
on conflict (slug) do nothing;

-- SAMPLE MOBILE COVER PRODUCTS
insert into products (
  lot_code, name, slug, description, category_id, features, pack_size, colour_mix,
  total_lot_size, models, image_urls, featured, new_arrival, sold_out
) values
  (
    'DEMO-101',
    'SPIGEN 3D CASE',
    'demo-spigen-3d-case',
    'Premium shockproof wholesale collection with 3D side texture and raised camera protection.',
    (select id from categories where slug = 'magsafe-covers'),
    array['MagSafe ring', 'Camera guard', 'Premium matte finish'],
    10,
    '3 Black, 3 Clear, 2 Titanium, 2 Blue',
    60,
    '{"Apple":["iPhone 15","iPhone 15 Pro","iPhone 15 Pro Max","iPhone 16 Pro"],"Samsung":["S24 Ultra","S25 Ultra"]}'::jsonb,
    '{}',
    true,
    true,
    false
  ),
  (
    'DEMO-102',
    'DULERO MAGSAFE PC CASE',
    'demo-dulero-magsafe-pc-case',
    'Clear hard PC MagSafe case for premium counters and fast-moving wholesale lots.',
    (select id from categories where slug = 'transparent-cases'),
    array['MagSafe ring', 'Hard PC', 'Anti-scratch'],
    10,
    '10 Clear per model',
    70,
    '{"Apple":["iPhone 14","iPhone 15","iPhone 15 Pro Max"],"Samsung":["S24 Ultra","S24","S23 Ultra"],"OnePlus":["12R","13R"]}'::jsonb,
    '{}',
    true,
    true,
    false
  )
on conflict (lot_code) do nothing;
