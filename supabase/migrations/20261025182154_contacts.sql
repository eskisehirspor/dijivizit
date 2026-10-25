-- Contacts: the people a card owner meets.
--
-- A visitor of a published card can leave their own details ("Bilgilerimi
-- bırak") through submit_card_contact(); the owner can also add people by hand.
-- Owners keep short notes and follow-up reminders per contact. Everything is
-- private to the owner (RLS on profile_id = auth.uid()).

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  full_name text not null check (char_length(btrim(full_name)) between 2 and 120),
  phone text check (phone is null or char_length(phone) <= 40),
  email text check (email is null or char_length(email) <= 254),
  company text check (company is null or char_length(company) <= 120),
  title text check (title is null or char_length(title) <= 120),
  message text check (message is null or char_length(message) <= 1000),
  met_where text check (met_where is null or char_length(met_where) <= 120),
  tags text[] not null default '{}' check (cardinality(tags) <= 10),
  source text not null default 'manual' check (source in ('card_form', 'manual')),
  consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contacts_reachable check (phone is not null or email is not null),
  constraint contacts_form_consent check (source <> 'card_form' or consent_at is not null)
);

comment on table public.contacts is
  'People a card owner met. card_form rows were left by the visitor with explicit consent (consent_at).';

create index if not exists contacts_profile_created_idx
  on public.contacts (profile_id, created_at desc);

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
  before update on public.contacts
  for each row execute function public.set_updated_at();

drop trigger if exists contacts_limit on public.contacts;
create trigger contacts_limit
  before insert on public.contacts
  for each row execute function public.enforce_child_row_limit(5000);

create table if not exists public.contact_notes (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists contact_notes_contact_idx
  on public.contact_notes (contact_id, created_at desc);

create table if not exists public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  due_on date not null,
  note text check (note is null or char_length(note) <= 200),
  done_at timestamptz,
  reminded_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists follow_ups_due_idx
  on public.follow_ups (due_on) where done_at is null and reminded_at is null;
create index if not exists follow_ups_contact_idx
  on public.follow_ups (contact_id, due_on);

-- RLS --------------------------------------------------------------------
alter table public.contacts enable row level security;
alter table public.contact_notes enable row level security;
alter table public.follow_ups enable row level security;

revoke all on public.contacts, public.contact_notes, public.follow_ups from public, anon;
grant select, insert, update, delete on public.contacts, public.contact_notes, public.follow_ups to authenticated;

create policy "contacts: owner all"
  on public.contacts for all to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy "contact_notes: owner all"
  on public.contact_notes for all to authenticated
  using (profile_id = (select auth.uid()))
  with check (
    profile_id = (select auth.uid())
    and exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.profile_id = (select auth.uid())
    )
  );

create policy "follow_ups: owner all"
  on public.follow_ups for all to authenticated
  using (profile_id = (select auth.uid()))
  with check (
    profile_id = (select auth.uid())
    and exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.profile_id = (select auth.uid())
    )
  );

-- Visitor form -----------------------------------------------------------
-- Writes one card_form contact for a published card and returns whether it was
-- stored. Caps each card at
-- 30 submissions per hour so a script cannot flood an owner's list.
create or replace function public.submit_card_contact(
  p_public_id text,
  p_full_name text,
  p_phone text,
  p_email text,
  p_company text,
  p_message text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile_id uuid;
  v_recent integer;
  v_name text := nullif(btrim(coalesce(p_full_name, '')), '');
  v_phone text := nullif(btrim(coalesce(p_phone, '')), '');
  v_email text := nullif(lower(btrim(coalesce(p_email, ''))), '');
begin
  if v_name is null or char_length(v_name) < 2 or char_length(v_name) > 120 then
    return false;
  end if;
  if v_phone is null and v_email is null then
    return false;
  end if;

  select p.id into v_profile_id
  from public.profiles p
  where p.public_id = p_public_id and p.is_published = true;

  if v_profile_id is null then
    return false;
  end if;

  select count(*) into v_recent
  from public.contacts c
  where c.profile_id = v_profile_id
    and c.source = 'card_form'
    and c.created_at > now() - interval '1 hour';

  if v_recent >= 30 then
    return false;
  end if;

  insert into public.contacts (
    profile_id, full_name, phone, email, company, message, source, consent_at
  ) values (
    v_profile_id,
    v_name,
    left(v_phone, 40),
    left(v_email, 254),
    left(nullif(btrim(coalesce(p_company, '')), ''), 120),
    left(nullif(btrim(coalesce(p_message, '')), ''), 1000),
    'card_form',
    now()
  );

  return true;
end;
$$;

revoke all on function public.submit_card_contact(text, text, text, text, text, text) from public;
grant execute on function public.submit_card_contact(text, text, text, text, text, text) to anon, authenticated;
