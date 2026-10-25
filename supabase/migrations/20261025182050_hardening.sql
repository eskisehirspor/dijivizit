-- Hardening after the October 2026 audit.
--
-- 1. Bank and billing details are hidden on the public card until the owner
--    switches them on (they used to go public the moment they were saved).
-- 2. The 10-document cap is enforced in the database, not only in the app.
-- 3. avatar_path can only point inside the owner's own avatars folder.
-- 4. get_own_analytics_summary is not callable without signing in.
-- 5. record_card_event drops repeats (same visitor, card and event within
--    30 minutes) and prunes events older than 13 months now and then.
-- 6. Order requests from dijivizit.com/siparis are stored (service role only),
--    so they can be followed up, rate limited per address and deleted on request.

-- 1 -------------------------------------------------------------------------
alter table public.bank_accounts alter column is_visible set default false;
alter table public.billing_infos alter column is_visible set default false;

-- 2 -------------------------------------------------------------------------
create or replace function public.enforce_document_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_count integer;
begin
  select count(*) into current_count from public.documents where user_id = new.user_id;
  if current_count >= 10 then
    raise exception 'user % already holds the maximum of 10 documents', new.user_id
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

revoke all on function public.enforce_document_limit() from public, anon, authenticated;

drop trigger if exists documents_limit on public.documents;
create trigger documents_limit
  before insert on public.documents
  for each row execute function public.enforce_document_limit();

-- 3 -------------------------------------------------------------------------
alter table public.profiles
  drop constraint if exists profiles_avatar_path_owner_check;
alter table public.profiles
  add constraint profiles_avatar_path_owner_check
  check (avatar_path is null or avatar_path like id::text || '/%');

-- 4 -------------------------------------------------------------------------
revoke execute on function public.get_own_analytics_summary() from public, anon;
grant execute on function public.get_own_analytics_summary() to authenticated;

-- 5 -------------------------------------------------------------------------
create index if not exists analytics_events_dedupe_idx
  on public.analytics_events (profile_id, visitor_id, event_type, created_at desc);

create or replace function public.record_card_event(
  p_public_id text,
  p_event_type text,
  p_visitor_id text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile_id uuid;
  v_visitor_id text;
begin
  if p_event_type not in (
    'profile_view',
    'phone_click',
    'whatsapp_click',
    'email_click',
    'website_click',
    'linkedin_click',
    'cv_open',
    'document_open',
    'vcard_download',
    'address_open',
    'share',
    'copy_link',
    'qr_open'
  ) then
    return false;
  end if;

  v_visitor_id := nullif(btrim(coalesce(p_visitor_id, '')), '');
  if v_visitor_id is not null and char_length(v_visitor_id) > 64 then
    return false;
  end if;

  select p.id
  into v_profile_id
  from public.profiles p
  where p.public_id = p_public_id
    and p.is_published = true;

  if v_profile_id is null then
    return false;
  end if;

  -- One count per visitor, card and event type per 30 minutes. Events without
  -- a visitor id (storage blocked) are kept: there is nothing to dedupe on.
  if v_visitor_id is not null and exists (
    select 1
    from public.analytics_events e
    where e.profile_id = v_profile_id
      and e.visitor_id = v_visitor_id
      and e.event_type = p_event_type
      and e.created_at > now() - interval '30 minutes'
  ) then
    return false;
  end if;

  insert into public.analytics_events (profile_id, event_type, visitor_id)
  values (v_profile_id, p_event_type, v_visitor_id);

  -- Retention: roughly one call in a hundred removes events older than 13 months.
  if random() < 0.01 then
    delete from public.analytics_events where created_at < now() - interval '13 months';
  end if;

  return true;
end;
$$;

revoke all on function public.record_card_event(text, text, text) from public;
grant execute on function public.record_card_event(text, text, text) to anon, authenticated;

-- 6 -------------------------------------------------------------------------
create table if not exists public.order_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  finish text not null check (char_length(finish) <= 40),
  quantity integer not null check (quantity between 1 and 10000),
  full_name text not null check (char_length(full_name) <= 120),
  phone text not null check (char_length(phone) <= 40),
  email text not null check (char_length(email) <= 254),
  note text check (note is null or char_length(note) <= 2000),
  consent_at timestamptz not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost'))
);

comment on table public.order_requests is
  'Order requests from dijivizit.com/siparis. Written and read with the service role only. Kept for 2 years, then deleted.';

create index if not exists order_requests_email_created_idx
  on public.order_requests (lower(email), created_at desc);

alter table public.order_requests enable row level security;
revoke all on public.order_requests from public, anon, authenticated;
