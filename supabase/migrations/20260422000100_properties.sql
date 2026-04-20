-- Property listings for real-estate tenants (Nexa Propiedades today).
-- Rows are scoped per tenant via site_slug. Prices stored as numeric to
-- support both USD and local currency filtering without float drift.

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  site_slug text not null,
  title text not null,
  transaction text not null check (transaction in ('venta', 'alquiler', 'temporal')),
  property_type text not null,
  status text not null default 'active' check (status in ('active', 'reserved', 'sold', 'withdrawn', 'draft')),
  price numeric(14, 2) not null,
  price_currency text not null default 'USD' check (price_currency in ('USD', 'PYG', 'UYU', 'EUR', 'BRL')),
  neighborhood text,
  city text,
  country text,
  bedrooms smallint,
  bathrooms smallint,
  area_m2 numeric(10, 2),
  description text,
  features jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  source_url text,
  source_ref text,
  whatsapp_message text,
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_site_status_idx
  on public.properties (site_slug, status, published_at desc);
create index if not exists properties_transaction_type_idx
  on public.properties (transaction, property_type);
create index if not exists properties_price_idx
  on public.properties (site_slug, transaction, price);
create index if not exists properties_bedrooms_idx
  on public.properties (bedrooms);
create index if not exists properties_neighborhood_idx
  on public.properties (site_slug, neighborhood);

alter table public.properties enable row level security;

create policy if not exists "public reads active properties"
  on public.properties for select
  to anon, authenticated
  using (status = 'active');

create policy if not exists "service role full access properties"
  on public.properties for all
  to service_role
  using (true)
  with check (true);

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

comment on table public.properties is
  'Real-estate listings per tenant. site_slug scopes reads. Public reads only expose status=active; drafts/reserved/sold/withdrawn stay private to service_role for admin flows.';
