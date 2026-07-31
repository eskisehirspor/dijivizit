-- Lightweight analytics for published public cards.
--
-- Writes never go through table grants: anonymous (and authenticated) callers
-- only get execute on record_card_event(), which resolves public_id → profile_id
-- internally and requires the card to be published. Owners read their own rows
-- via RLS select (and get_own_analytics_summary for aggregated dashboard stats).

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  event_type text not null,
  visitor_id text,
  created_at timestamptz not null default now(),
  -- Future-ready enrichment columns (unused in v1).
  country text,
  city text,
  device text,
  referrer text,
  ip_hash text,

  constraint analytics_events_event_type_check check (
    event_type in (
      'profile_view',
      'phone_click',
      'whatsapp_click',
      'email_click',
      'website_click',
      'linkedin_click',
      'cv_open',
      'vcard_download',
      'address_open'
    )
  ),
  constraint analytics_events_visitor_id_length check (
    visitor_id is null or char_length(visitor_id) between 1 and 64
  )
);

create index analytics_events_profile_id_created_at_idx
  on public.analytics_events (profile_id, created_at desc);

create index analytics_events_profile_id_event_type_idx
  on public.analytics_events (profile_id, event_type);

alter table public.analytics_events enable row level security;

revoke all on public.analytics_events from anon;
revoke all on public.analytics_events from authenticated;
grant select on public.analytics_events to authenticated;

create policy "Owners can read their own analytics events"
  on public.analytics_events
  for select
  to authenticated
  using (profile_id = (select auth.uid()));

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
    'vcard_download',
    'address_open'
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

  insert into public.analytics_events (profile_id, event_type, visitor_id)
  values (v_profile_id, p_event_type, v_visitor_id);

  return true;
end;
$$;

revoke all on function public.record_card_event(text, text, text) from public;
grant execute on function public.record_card_event(text, text, text) to anon, authenticated;

-- Aggregated owner dashboard stats (Europe/Istanbul day / week / month bounds).
create or replace function public.get_own_analytics_summary()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with bounds as (
    select
      (timezone('Europe/Istanbul', now()))::date as today_local,
      (date_trunc('week', timezone('Europe/Istanbul', now())))::date as week_start,
      (date_trunc('month', timezone('Europe/Istanbul', now())))::date as month_start
  ),
  owned as (
    select
      e.event_type,
      (timezone('Europe/Istanbul', e.created_at))::date as local_date
    from public.analytics_events e
    where e.profile_id = (select auth.uid())
  )
  select jsonb_build_object(
    'profileViewsTotal',
    (
      select count(*)::int
      from owned
      where event_type = 'profile_view'
    ),
    'profileViewsToday',
    (
      select count(*)::int
      from owned o
      cross join bounds b
      where o.event_type = 'profile_view'
        and o.local_date = b.today_local
    ),
    'profileViewsWeek',
    (
      select count(*)::int
      from owned o
      cross join bounds b
      where o.event_type = 'profile_view'
        and o.local_date >= b.week_start
    ),
    'profileViewsMonth',
    (
      select count(*)::int
      from owned o
      cross join bounds b
      where o.event_type = 'profile_view'
        and o.local_date >= b.month_start
    ),
    'byType',
    coalesce(
      (
        select jsonb_object_agg(event_type, cnt)
        from (
          select event_type, count(*)::int as cnt
          from owned
          group by event_type
        ) counts
      ),
      '{}'::jsonb
    )
  );
$$;

revoke all on function public.get_own_analytics_summary() from public;
grant execute on function public.get_own_analytics_summary() to authenticated;
