-- Richer analytics for the card owner.
--
-- 1. record_card_event also stores approximate location (country and city
--    from Cloudflare's IP geolocation; the IP itself is never stored), the
--    device family from the user agent and where the visitor came from
--    (the referring site, or "direct" for NFC, QR and typed links).
-- 2. get_own_analytics_detail(p_days) returns everything the analytics page
--    draws: daily views and visitors, a weekday x hour grid (Istanbul time),
--    cities, countries, devices, sources, actions, the funnel and per-card views.

drop function if exists public.record_card_event(text, text, text);

create or replace function public.record_card_event(
  p_public_id text,
  p_event_type text,
  p_visitor_id text default null,
  p_country text default null,
  p_city text default null,
  p_device text default null,
  p_source text default null
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_profile_id uuid;
  v_card_id uuid;
  v_visitor_id text;
  v_country text := upper(nullif(btrim(coalesce(p_country, '')), ''));
  v_city text := nullif(btrim(coalesce(p_city, '')), '');
  v_device text := nullif(btrim(coalesce(p_device, '')), '');
  v_source text := lower(nullif(btrim(coalesce(p_source, '')), ''));
begin
  if p_event_type not in (
    'profile_view','phone_click','whatsapp_click','email_click','website_click','linkedin_click',
    'cv_open','document_open','vcard_download','address_open','share','copy_link','qr_open',
    'wallet_add','contact_left'
  ) then
    return false;
  end if;

  v_visitor_id := nullif(btrim(coalesce(p_visitor_id, '')), '');
  if v_visitor_id is not null and char_length(v_visitor_id) > 64 then
    return false;
  end if;

  -- Enrichment is best effort: anything unexpected is dropped, never rejected.
  if v_country is not null and v_country !~ '^[A-Z]{2}$' or v_country in ('XX', 'T1') then
    v_country := null;
  end if;
  if v_city is not null and char_length(v_city) > 80 then
    v_city := null;
  end if;
  if v_device is not null and v_device not in ('ios', 'android', 'desktop', 'other') then
    v_device := null;
  end if;
  if v_source is not null and v_source !~ '^[a-z0-9.-]{1,40}$' then
    v_source := null;
  end if;

  select r.profile_id, r.card_id into v_profile_id, v_card_id
  from public.resolve_card(p_public_id) r;

  if v_profile_id is null then
    return false;
  end if;

  if v_visitor_id is not null and exists (
    select 1 from public.analytics_events e
    where e.profile_id = v_profile_id
      and e.visitor_id = v_visitor_id
      and e.event_type = p_event_type
      and e.created_at > now() - interval '30 minutes'
  ) then
    return false;
  end if;

  insert into public.analytics_events
    (profile_id, event_type, visitor_id, card_id, country, city, device, referrer)
  values
    (v_profile_id, p_event_type, v_visitor_id, v_card_id, v_country, v_city, v_device, v_source);

  if random() < 0.01 then
    delete from public.analytics_events where created_at < now() - interval '13 months';
  end if;

  return true;
end;
$$;

revoke all on function public.record_card_event(text, text, text, text, text, text, text) from public;
grant execute on function public.record_card_event(text, text, text, text, text, text, text)
  to anon, authenticated;

create index if not exists analytics_events_profile_time_idx
  on public.analytics_events (profile_id, created_at desc);

create or replace function public.get_own_analytics_detail(p_days integer default 30)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_days integer := greatest(7, least(coalesce(p_days, 30), 365));
  v_tz text := 'Europe/Istanbul';
  v_today date := (now() at time zone 'Europe/Istanbul')::date;
  v_from timestamptz;
  v_prev timestamptz;
  v_result jsonb;
begin
  if v_uid is null then
    return null;
  end if;

  v_from := ((v_today - (v_days - 1))::timestamp) at time zone v_tz;
  v_prev := ((v_today - (2 * v_days - 1))::timestamp) at time zone v_tz;

  with ev as (
    select e.event_type, e.visitor_id, e.created_at, e.country, e.city, e.device,
           e.referrer, e.card_id,
           (e.created_at at time zone v_tz) as local_at
    from public.analytics_events e
    where e.profile_id = v_uid and e.created_at >= v_from
  ),
  views as (select * from ev where event_type = 'profile_view'),
  days as (
    select d::date as day from generate_series(v_today - (v_days - 1), v_today, interval '1 day') d
  )
  select jsonb_build_object(
    'days', v_days,
    'totals', jsonb_build_object(
      'views', (select count(*) from views),
      'visitors', (select count(distinct coalesce(visitor_id, created_at::text)) from views),
      'prevViews', (
        select count(*) from public.analytics_events e
        where e.profile_id = v_uid and e.event_type = 'profile_view'
          and e.created_at >= v_prev and e.created_at < v_from
      ),
      'taps', (select count(*) from ev where event_type in
        ('phone_click','whatsapp_click','email_click','website_click','linkedin_click','address_open')),
      'saves', (select count(*) from ev where event_type = 'vcard_download'),
      'contacts', (
        select count(*) from public.contacts c
        where c.profile_id = v_uid and c.source = 'card_form' and c.created_at >= v_from
      )
    ),
    'daily', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'd', to_char(days.day, 'YYYY-MM-DD'),
        'v', coalesce(x.v, 0),
        'u', coalesce(x.u, 0)
      ) order by days.day), '[]'::jsonb)
      from days
      left join (
        select local_at::date as day, count(*) as v,
               count(distinct coalesce(visitor_id, created_at::text)) as u
        from views group by 1
      ) x on x.day = days.day
    ),
    'heat', (
      select coalesce(jsonb_agg(jsonb_build_object('w', w, 'h', h, 'n', n)), '[]'::jsonb)
      from (
        select (extract(isodow from local_at)::int - 1) as w, extract(hour from local_at)::int as h,
               count(*) as n
        from views group by 1, 2
      ) t
    ),
    'cities', (
      select coalesce(jsonb_agg(jsonb_build_object('city', city, 'country', country, 'n', n)
        order by n desc), '[]'::jsonb)
      from (
        select city, max(country) as country, count(*) as n
        from views where city is not null group by city order by n desc limit 8
      ) t
    ),
    'countries', (
      select coalesce(jsonb_agg(jsonb_build_object('country', country, 'n', n) order by n desc), '[]'::jsonb)
      from (
        select country, count(*) as n from views where country is not null
        group by country order by n desc limit 6
      ) t
    ),
    'devices', (
      select coalesce(jsonb_agg(jsonb_build_object('k', device, 'n', n) order by n desc), '[]'::jsonb)
      from (select device, count(*) as n from views where device is not null group by device) t
    ),
    'sources', (
      select coalesce(jsonb_agg(jsonb_build_object('k', referrer, 'n', n) order by n desc), '[]'::jsonb)
      from (
        select referrer, count(*) as n from views where referrer is not null
        group by referrer order by n desc limit 8
      ) t
    ),
    'tracked', (select count(*) from views where device is not null),
    'actions', (
      select coalesce(jsonb_object_agg(event_type, n), '{}'::jsonb)
      from (select event_type, count(*) as n from ev group by event_type) t
    ),
    'cards', (
      select coalesce(jsonb_agg(jsonb_build_object('label', label, 'slug', slug, 'n', n)
        order by n desc), '[]'::jsonb)
      from (
        select c.label, c.slug, count(*) as n
        from views v join public.cards c on c.id = v.card_id
        group by c.id, c.label, c.slug
      ) t
    )
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.get_own_analytics_detail(integer) from public, anon;
grant execute on function public.get_own_analytics_detail(integer) to authenticated;
