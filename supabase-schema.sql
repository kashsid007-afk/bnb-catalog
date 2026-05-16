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
  ('Oppo/Vivo',       'oppo-vivo',       3),
  ('OnePlus',         'oneplus',         4),
  ('Premium Cases',   'premium-cases',   5),
  ('Tempered Glass',  'tempered-glass',  6),
  ('Chargers',        'chargers',        7),
  ('Accessories',     'accessories',     8)
on conflict (slug) do nothing;

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
