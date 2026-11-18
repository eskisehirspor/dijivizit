-- Profile customisation: colour theme, cover image, a personal link
-- (dijivizit.com/p/<vanity>) and a small product/service catalogue.
--
-- The card's data path for anonymous visitors stays get_public_card(); the new
-- public_id_for_slug() only maps a vanity slug back to the canonical public id,
-- so everything downstream (vCard, events, leave-contact) keeps using public_id.

-- Theme ---------------------------------------------------------------------
-- profiles.theme has existed since v1 but was never writable by owners.
grant update (theme) on public.profiles to authenticated;

-- Cover image ---------------------------------------------------------------
alter table public.profiles add column if not exists cover_path text;
alter table public.profiles
  drop constraint if exists profiles_cover_path_owner_check;
alter table public.profiles
  add constraint profiles_cover_path_owner_check
  check (cover_path is null or cover_path like id::text || '/%');
grant update (cover_path) on public.profiles to authenticated;

-- Personal link -------------------------------------------------------------
-- Lowercase letters, digits and inner hyphens, 3-40 characters. Eleven
-- characters is excluded so a vanity slug can never look like a public id.
alter table public.profiles add column if not exists vanity_slug text;
alter table public.profiles
  drop constraint if exists profiles_vanity_slug_format;
alter table public.profiles
  add constraint profiles_vanity_slug_format check (
    vanity_slug is null or (
      vanity_slug ~ '^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$'
      and char_length(vanity_slug) between 3 and 40
      and char_length(vanity_slug) <> 11
      and vanity_slug !~ '--'
    )
  );
create unique index if not exists profiles_vanity_slug_key
  on public.profiles (vanity_slug) where vanity_slug is not null;
grant update (vanity_slug) on public.profiles to authenticated;

create or replace function public.public_id_for_slug(p_slug text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.public_id from public.profiles p
  where p.vanity_slug = lower(p_slug) and p.is_published
  limit 1;
$$;
revoke all on function public.public_id_for_slug(text) from public;
grant execute on function public.public_id_for_slug(text) to anon, authenticated;

-- Products / services --------------------------------------------------------
create table if not exists public.profile_products (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  price text,
  url text,
  image_path text,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profile_products_title_length check (char_length(title) between 1 and 80),
  constraint profile_products_description_length
    check (description is null or char_length(description) <= 300),
  constraint profile_products_price_length check (price is null or char_length(price) <= 40),
  constraint profile_products_url_format
    check (url is null or (char_length(url) <= 500 and url ~ '^https?://')),
  constraint profile_products_image_owner
    check (image_path is null or image_path like profile_id::text || '/%')
);

create index if not exists profile_products_profile_idx
  on public.profile_products (profile_id, display_order);

alter table public.profile_products enable row level security;

create policy "Owners can read their own products"
  on public.profile_products for select to authenticated
  using (profile_id = (select auth.uid()));
create policy "Owners can create their own products"
  on public.profile_products for insert to authenticated
  with check (profile_id = (select auth.uid()));
create policy "Owners can update their own products"
  on public.profile_products for update to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));
create policy "Owners can delete their own products"
  on public.profile_products for delete to authenticated
  using (profile_id = (select auth.uid()));

grant select, insert, update, delete on public.profile_products to authenticated;

create or replace function public.enforce_product_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.profile_products where profile_id = new.profile_id) >= 20 then
    raise exception 'profile % already holds the maximum of 20 products', new.profile_id
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;
revoke all on function public.enforce_product_limit() from public, anon, authenticated;

drop trigger if exists profile_products_limit on public.profile_products;
create trigger profile_products_limit
  before insert on public.profile_products
  for each row execute function public.enforce_product_limit();

-- Public card ---------------------------------------------------------------
create or replace function public.get_public_card(p_public_id text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'publicId', p_public_id,
    'fullName', p.full_name,
    'title', p.title,
    'company', p.company,
    'about', p.about,
    'address', p.address,
    'avatarPath', p.avatar_path,
    'coverPath', p.cover_path,
    'theme', p.theme,
    'locale', p.locale,
    'skillsSectionTitle', p.skills_section_title,
    'bankAccount', (
      select jsonb_build_object('accountHolder', b.account_holder, 'iban', b.iban, 'bankName', b.bank_name)
      from public.bank_accounts b where b.user_id = p.id and b.is_visible limit 1
    ),
    'billingInfo', (
      select jsonb_build_object('companyTitle', i.company_title, 'companyAddress', i.company_address,
                                'taxNumber', i.tax_number, 'taxOffice', i.tax_office)
      from public.billing_infos i where i.user_id = p.id and i.is_visible limit 1
    ),
    'documents', coalesce((
      select jsonb_agg(jsonb_build_object('id', d.id, 'type', d.type, 'title', d.title,
                                          'description', d.description, 'fileName', d.file_name)
                       order by d.display_order, d.created_at)
      from public.documents d where d.user_id = p.id and d.is_visible = true
    ), '[]'::jsonb),
    'links', coalesce((
      select jsonb_agg(jsonb_build_object('platform', l.platform, 'label', l.label, 'value', l.value)
                       order by l.display_order, l.created_at)
      from public.profile_links l where l.profile_id = p.id and l.is_visible
    ), '[]'::jsonb),
    'skills', coalesce((
      select jsonb_agg(jsonb_build_object('name', s.name, 'type', s.type)
                       order by s.type, s.display_order, s.created_at)
      from public.profile_skills s where s.profile_id = p.id
    ), '[]'::jsonb),
    'products', coalesce((
      select jsonb_agg(jsonb_build_object('id', pr.id, 'title', pr.title, 'description', pr.description,
                                          'price', pr.price, 'url', pr.url, 'imagePath', pr.image_path)
                       order by pr.display_order, pr.created_at)
      from public.profile_products pr where pr.profile_id = p.id and pr.is_visible
    ), '[]'::jsonb)
  )
  from public.resolve_card(p_public_id) r
  join public.profiles p on p.id = r.profile_id;
$$;
