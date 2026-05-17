-- =============================================
-- BNB CATALOG — Complete Supabase Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Categories
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  image_url   text,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- Products
create table if not exists products (
  id              uuid primary key default gen_random_uuid(),
  lot_code        text unique not null,
  name            text not null,
  slug            text unique not null,
  description     text,
  category_id     uuid references categories(id) on delete set null,
  features        text[] default '{}',
  pack_size       int,
  colour_mix      text,
  total_lot_size  int,
  models          jsonb default '{}',
  image_urls      text[] default '{}',
  video_url       text,
  featured        boolean default false,
  new_arrival     boolean default true,
  sold_out        boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Settings
create table if not exists settings (
  key    text primary key,
  value  text not null default ''
);

-- Default settings
insert into settings (key, value) values
  ('whatsapp_number', '919999999999'),
  ('announcement_banner', '')
on conflict (key) do nothing;

-- Default categories
insert into categories (name, slug, sort_order) values
  ('iPhone Covers',   'iphone-covers',   1),
  ('Samsung Covers',  'samsung-covers',  2),
  ('Transparent Cases', 'transparent-cases', 3),
  ('Silicone Covers', 'silicone-covers', 4),
  ('MagSafe Covers', 'magsafe-covers', 5),
  ('Rugged Covers', 'rugged-covers', 6)
on conflict (slug) do nothing;

-- Demo mobile-cover lots. These are safe to keep; real admin uploads can replace them over time.
insert into products (
  lot_code, name, slug, description, category_id, features, pack_size, colour_mix,
  total_lot_size, models, image_urls, featured, new_arrival, sold_out
) values
  (
    'DEMO-101',
    'iPhone 15 Pro Max MagSafe Covers',
    'demo-iphone-15-pro-max-magsafe-covers',
    'Premium MagSafe-compatible back covers with soft-touch finish and camera protection.',
    (select id from categories where slug = 'magsafe-covers'),
    array['MagSafe ring', 'Camera guard', 'Premium matte finish'],
    10,
    '3 Black, 3 Clear, 2 Titanium, 2 Blue',
    60,
    '{"iPhone":["15 Pro Max","15 Pro","16 Pro Max","16 Pro"]}'::jsonb,
    '{}',
    true,
    true,
    false
  ),
  (
    'DEMO-102',
    'Samsung S24 Ultra Transparent Cases',
    'demo-samsung-s24-ultra-transparent-cases',
    'Crystal clear TPU cases made for daily wholesale movement.',
    (select id from categories where slug = 'transparent-cases'),
    array['Anti-yellow TPU', 'Slim profile', 'Raised edges'],
    10,
    '10 Clear per model',
    70,
    '{"Samsung":["S24 Ultra","S24","S23 Ultra","A55","A35","A15","A06"]}'::jsonb,
    '{}',
    true,
    true,
    false
  )
on conflict (lot_code) do nothing;

-- Performance indexes
create index if not exists products_category_idx on products(category_id);
create index if not exists products_featured_idx on products(featured) where featured = true;
create index if not exists products_new_arrival_idx on products(new_arrival) where new_arrival = true;
create index if not exists products_lot_code_idx on products(lot_code);
create index if not exists products_models_gin on products using gin(models);
create index if not exists products_name_search on products using gin(to_tsvector('english', name));

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute procedure update_updated_at();

-- Row Level Security
alter table products   enable row level security;
alter table categories enable row level security;
alter table settings   enable row level security;

-- Public can read everything
create policy "Public read products"    on products   for select using (true);
create policy "Public read categories"  on categories for select using (true);
create policy "Public read settings"    on settings   for select using (true);

-- Only authenticated admin can write
create policy "Admin all products"   on products   for all using (auth.role() = 'authenticated');
create policy "Admin all categories" on categories for all using (auth.role() = 'authenticated');
create policy "Admin all settings"   on settings   for all using (auth.role() = 'authenticated');
