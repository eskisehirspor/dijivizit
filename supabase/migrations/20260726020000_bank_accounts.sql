-- Bank accounts as a dedicated module (not columns on profiles).
-- One row per user for now via unique(user_id); drop that unique later to
-- allow multiple accounts without redesigning the table.

create table public.bank_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_holder text not null,
  iban text not null,
  bank_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint bank_accounts_user_id_key unique (user_id),
  constraint bank_accounts_account_holder_length check (
    char_length(account_holder) between 2 and 120
  ),
  constraint bank_accounts_iban_format check (
    iban ~ '^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$'
  ),
  constraint bank_accounts_bank_name_length check (
    char_length(bank_name) between 2 and 120
  )
);

create index bank_accounts_user_id_idx on public.bank_accounts (user_id);

create trigger bank_accounts_set_updated_at
  before update on public.bank_accounts
  for each row
  execute function public.set_updated_at();

alter table public.bank_accounts enable row level security;

revoke all on public.bank_accounts from anon;
revoke all on public.bank_accounts from authenticated;
grant select, insert, update, delete on public.bank_accounts to authenticated;

create policy "Owners can read their own bank accounts"
  on public.bank_accounts
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Owners can create their own bank accounts"
  on public.bank_accounts
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Owners can update their own bank accounts"
  on public.bank_accounts
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Owners can delete their own bank accounts"
  on public.bank_accounts
  for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- Additive public allowlist: expose bank fields only when the card is published.
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
