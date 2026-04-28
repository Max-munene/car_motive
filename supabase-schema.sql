-- Supabase schema for BRIM Automotive MVP
-- Run this in Supabase SQL editor or use `supabase db push`.

-- Enable UUID generation
create extension if not exists pgcrypto;

-- Enum types
create type user_role as enum ('guest', 'user', 'admin');
create type listing_status as enum ('pending', 'active', 'sold', 'rejected');
create type market_score as enum ('good_deal', 'fair_price', 'overpriced');
create type transmission_type as enum ('automatic', 'manual');
create type fuel_type as enum ('petrol', 'diesel', 'hybrid', 'electric');
create type drive_type as enum ('2WD', '4WD', 'AWD');
create type inquiry_status as enum ('new', 'read', 'responded');

-- Timestamp trigger
create or replace function public.set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_timestamp
before update on profiles
for each row
execute function public.set_timestamp();

-- Car listings table
create table if not exists car_listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  make text not null,
  model text not null,
  year int not null,
  price int not null,
  mileage int not null,
  engine_size numeric,
  transmission transmission_type not null,
  fuel_type fuel_type not null,
  drive_type drive_type not null default '2WD',
  color text,
  body_type text,
  condition text not null default 'foreign used',
  description text,
  location text not null default 'Nairobi',
  market_score market_score not null default 'fair_price',
  status listing_status not null default 'pending',
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger car_listings_set_timestamp
before update on car_listings
for each row
execute function public.set_timestamp();

-- Car images table
create table if not exists car_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references car_listings(id) on delete cascade,
  url text not null,
  is_primary boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Inquiries table
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references car_listings(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  message text not null,
  status inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

-- Articles table
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_url text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger articles_set_timestamp
before update on articles
for each row
execute function public.set_timestamp();

-- Saved cars table
create table if not exists saved_cars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  listing_id uuid not null references car_listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint saved_cars_user_listing_unique unique(user_id, listing_id)
);

-- Market price reference table for compute_market_score
create table if not exists market_price_references (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  year_min int not null,
  year_max int not null,
  fair_price_min int not null,
  fair_price_max int not null,
  constraint market_price_reference_unique unique(make, model, year_min, year_max)
);

-- Utility functions
create or replace function public.is_admin()
returns boolean stable language sql as $$
  select exists(
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.compute_market_score(
  p_make text,
  p_model text,
  p_year int,
  p_price int
) returns market_score language plpgsql as $$
declare
  ref record;
begin
  select fair_price_min, fair_price_max
  into ref
  from market_price_references
  where make = p_make
    and model = p_model
    and p_year between year_min and year_max
  order by year_min desc
  limit 1;

  if not found then
    return 'fair_price';
  end if;

  if p_price < ref.fair_price_min then
    return 'good_deal';
  elsif p_price > ref.fair_price_max then
    return 'overpriced';
  else
    return 'fair_price';
  end if;
end;
$$;

-- Row-level security policies
alter table profiles enable row level security;
create policy "Allow profile owner select" on profiles
  for select using (auth.uid() = id);
create policy "Allow profile owner update" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Allow profile owner insert" on profiles
  for insert with check (auth.uid() = id);

alter table articles enable row level security;
create policy "Published articles are public" on articles
  for select using (published = true);
create policy "Admins can insert articles" on articles
  for insert with check (is_admin());
create policy "Admins can update articles" on articles
  for update using (is_admin()) with check (is_admin());
create policy "Admins can delete articles" on articles
  for delete using (is_admin());

alter table inquiries enable row level security;
create policy "Admins can update inquiries" on inquiries
  for update using (is_admin()) with check (is_admin());

-- Storage bucket creation (run in Supabase SQL editor if supported)
-- select storage.create_bucket('car-images', true);

-- Sample market reference data (optional)
insert into market_price_references (make, model, year_min, year_max, fair_price_min, fair_price_max)
values
  ('Toyota', 'Fielder', 2010, 2020, 1050000, 1350000),
  ('Toyota', 'Axio', 2010, 2020, 850000, 1150000),
  ('Toyota', 'Premio', 2010, 2020, 900000, 1200000),
  ('Toyota', 'Harrier', 2010, 2020, 2800000, 3800000),
  ('Toyota', 'Land Cruiser Prado', 2010, 2020, 4500000, 6500000),
  ('Mazda', 'Demio', 2010, 2020, 650000, 950000),
  ('Subaru', 'Forester', 2010, 2020, 1500000, 2000000),
  ('Honda', 'Fit', 2010, 2020, 700000, 950000),
  ('Nissan', 'Note', 2010, 2020, 700000, 950000),
  ('Mercedes-Benz', 'C200', 2010, 2020, 3500000, 5000000);
