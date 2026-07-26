-- Billing / tax invoice details as a dedicated module (not columns on profiles).
-- One row per user for now via unique(user_id).

create table public.billing_infos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_title text not null,
  company_address text not null,
  tax_number text not null,
  tax_office text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint billing_infos_user_id_key unique (user_id),
  constraint billing_infos_company_title_length check (
    char_length(company_title) between 2 and 200
  ),
  constraint billing_infos_company_address_length check (
    char_length(company_address) between 2 and 500
  ),
  constraint billing_infos_tax_number_format check (
    tax_number ~ '^[0-9]{10,11}$'
  ),
  constraint billing_infos_tax_office_length check (
    char_length(tax_office) between 2 and 120
  )
);

create index billing_infos_user_id_idx on public.billing_infos (user_id);

create trigger billing_infos_set_updated_at
  before update on public.billing_infos
  for each row
  execute function public.set_updated_at();

alter table public.billing_infos enable row level security;

revoke all on public.billing_infos from anon;
revoke all on public.billing_infos from authenticated;
grant select, insert, update, delete on public.billing_infos to authenticated;

create policy "Owners can read their own billing infos"
  on public.billing_infos
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Owners can create their own billing infos"
  on public.billing_infos
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Owners can update their own billing infos"
  on public.billing_infos
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Owners can delete their own billing infos"
  on public.billing_infos
  for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- Additive public allowlist: expose billing fields only when the card is published.
create or replace function public.get_public_card(p_public_id text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'publicId', p.public_id,
    'fullName', p.full_name,
    'title', p.title,
    'company', p.company,
    'about', p.about,
    'address', p.address,
    'avatarPath', p.avatar_path,
    'theme', p.theme,
    'locale', p.locale,
    'bankAccount', (
      select case
        when b.id is null then null
        else jsonb_build_object(
          'accountHolder', b.account_holder,
          'iban', b.iban,
          'bankName', b.bank_name
        )
      end
      from public.bank_accounts b
      where b.user_id = p.id
      limit 1
    ),
    'billingInfo', (
      select case
        when i.id is null then null
        else jsonb_build_object(
          'companyTitle', i.company_title,
          'companyAddress', i.company_address,
          'taxNumber', i.tax_number,
          'taxOffice', i.tax_office
        )
      end
      from public.billing_infos i
      where i.user_id = p.id
      limit 1
    ),
    'links', coalesce(
      (
        select jsonb_agg(
                 jsonb_build_object(
                   'platform', l.platform,
                   'label', l.label,
                   'value', l.value
                 )
                 order by l.display_order, l.created_at
               )
        from public.profile_links l
        where l.profile_id = p.id
          and l.is_visible
      ),
      '[]'::jsonb
    ),
    'skills', coalesce(
      (
        select jsonb_agg(
                 jsonb_build_object(
                   'name', s.name,
                   'type', s.type
                 )
                 order by s.type, s.display_order, s.created_at
               )
        from public.profile_skills s
        where s.profile_id = p.id
      ),
      '[]'::jsonb
    )
  )
  from public.profiles p
  where p.public_id = p_public_id
    and p.is_published = true;
$$;

comment on function public.get_public_card(text) is
  'Returns one published card by its public id, or null. The only data path available to anonymous visitors.';
