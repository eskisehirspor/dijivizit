-- Extend analytics event types for public Share v1.

alter table public.analytics_events
  drop constraint analytics_events_event_type_check;

alter table public.analytics_events
  add constraint analytics_events_event_type_check check (
    event_type in (
      'profile_view',
      'phone_click',
      'whatsapp_click',
      'email_click',
      'website_click',
      'linkedin_click',
      'cv_open',
      'vcard_download',
      'address_open',
      'share',
      'copy_link',
      'qr_open'
    )
  );

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

  insert into public.analytics_events (profile_id, event_type, visitor_id)
  values (v_profile_id, p_event_type, v_visitor_id);

  return true;
end;
$$;
