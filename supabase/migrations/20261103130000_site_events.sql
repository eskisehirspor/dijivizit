-- Applied via the Supabase MCP on 2026-11-03; see the live definition of
-- public.site_events and public.admin_site_summary(integer).
-- First-party, cookie-free counts of marketing-site activity (page views and
-- the sales funnel). No IP, no persistent visitor id.
create table if not exists public.site_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  type text not null check (type in ('pageview','view_item','begin_checkout','generate_lead','tool_start','qr_download','tool_offer_click')),
  path text not null check (char_length(path) <= 200),
  item text check (char_length(item) <= 40),
  ref_host text check (char_length(ref_host) <= 120),
  country text check (char_length(country) <= 2),
  device text check (device in ('mobile','tablet','desktop')),
  session text check (char_length(session) <= 40)
);
create index if not exists site_events_created_idx on public.site_events (created_at desc);
create index if not exists site_events_type_created_idx on public.site_events (type, created_at desc);
alter table public.site_events enable row level security;
revoke all on public.site_events from anon, authenticated;

-- Owner dashboard summary. Service role only (called from the admin DAL).
create or replace function public.admin_site_summary(p_days integer)
returns jsonb
language sql
stable
security definer
set search_path to 'public'
as $function$
  with ev as (
    select * from public.site_events
    where created_at >= now() - make_interval(days => greatest(1, least(p_days, 365)))
  ),
  days as (
    select generate_series(
      (now() at time zone 'Europe/Istanbul')::date - (greatest(1, least(p_days, 365)) - 1),
      (now() at time zone 'Europe/Istanbul')::date,
      interval '1 day'
    )::date as d
  ),
  orders as (
    select * from public.order_requests
    where created_at >= now() - make_interval(days => greatest(1, least(p_days, 365)))
  )
  select jsonb_build_object(
    'pageviews', (select count(*) from ev where type = 'pageview'),
    'sessions', (select count(distinct session) from ev where type = 'pageview' and session is not null),
    'funnel', (select coalesce(jsonb_object_agg(type, n), '{}'::jsonb) from (select type, count(*) n from ev group by type) t),
    'daily', (select coalesce(jsonb_agg(jsonb_build_object(
        'd', days.d,
        'views', (select count(*) from ev where type = 'pageview' and (ev.created_at at time zone 'Europe/Istanbul')::date = days.d),
        'sessions', (select count(distinct session) from ev where type = 'pageview' and (ev.created_at at time zone 'Europe/Istanbul')::date = days.d),
        'orders', (select count(*) from orders o where o.source = 'shopier' and (o.created_at at time zone 'Europe/Istanbul')::date = days.d)
      ) order by days.d), '[]'::jsonb) from days),
    'top_paths', (select coalesce(jsonb_agg(jsonb_build_object('path', path, 'n', n) order by n desc), '[]'::jsonb)
                  from (select path, count(*) n from ev where type = 'pageview' group by path order by n desc limit 10) t),
    'top_refs', (select coalesce(jsonb_agg(jsonb_build_object('host', host, 'n', n) order by n desc), '[]'::jsonb)
                 from (select coalesce(nullif(ref_host, ''), 'direct') host, count(distinct coalesce(session, id::text)) n
                       from ev where type = 'pageview' group by 1 order by n desc limit 8) t),
    'devices', (select coalesce(jsonb_object_agg(coalesce(device, 'unknown'), n), '{}'::jsonb)
                from (select device, count(distinct coalesce(session, id::text)) n from ev where type = 'pageview' group by device) t),
    'countries', (select coalesce(jsonb_agg(jsonb_build_object('c', country, 'n', n) order by n desc), '[]'::jsonb)
                  from (select country, count(distinct coalesce(session, id::text)) n from ev where type = 'pageview' and country is not null group by country order by n desc limit 6) t),
    'products', (select coalesce(jsonb_agg(jsonb_build_object('item', item, 'views', v, 'clicks', c) order by v desc), '[]'::jsonb)
                 from (select item, count(*) filter (where type = 'view_item') v, count(*) filter (where type = 'begin_checkout') c
                       from ev where item is not null group by item) t),
    'paid_orders', (select count(*) from orders where source = 'shopier'),
    'revenue', (select coalesce(sum(paid_total), 0) from orders where source = 'shopier'),
    'requests', (select count(*) from orders where source = 'form')
  );
$function$;

revoke all on function public.admin_site_summary(integer) from public, anon, authenticated;
grant execute on function public.admin_site_summary(integer) to service_role;
