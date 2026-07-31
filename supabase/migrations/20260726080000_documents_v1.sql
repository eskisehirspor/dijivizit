-- Documents v1: multi-document support with visibility and description.
-- Replaces the single-CV constraint and public allowlist shape.

drop index if exists public.documents_one_cv_per_user_idx;

alter table public.documents
  add column if not exists description text,
  add column if not exists is_visible boolean not null default true,
  add column if not exists display_order integer not null default 0;

alter table public.documents
  drop constraint if exists documents_description_length;

alter table public.documents
  add constraint documents_description_length
  check (description is null or char_length(description) <= 500);

alter table public.documents
  drop constraint if exists documents_type_allowed;

alter table public.documents
  add constraint documents_type_allowed
  check (
    type in (
      'cv',
      'product_catalog',
      'price_list',
      'brochure',
      'presentation',
      'technical',
      'other'
    )
  );

-- Existing CV rows become visible documents of type cv.
update public.documents
set
  is_visible = coalesce(is_visible, true),
  display_order = coalesce(display_order, 0)
where true;

create index if not exists documents_user_id_order_idx
  on public.documents (user_id, display_order, created_at);

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
    'skillsSectionTitle', p.skills_section_title,
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
    'documents', coalesce(
      (
        select jsonb_agg(
                 jsonb_build_object(
                   'id', d.id,
                   'type', d.type,
                   'title', d.title,
                   'description', d.description,
                   'fileName', d.file_name,
                   'storagePath', d.storage_path
                 )
                 order by d.display_order, d.created_at
               )
        from public.documents d
        where d.user_id = p.id
          and d.is_visible = true
      ),
      '[]'::jsonb
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

-- Track document opens (replaces CV-only opens going forward).
alter table public.analytics_events
  drop constraint if exists analytics_events_event_type_check;

alter table public.analytics_events
  add constraint analytics_events_event_type_check
  check (
    event_type in (
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

  insert into public.analytics_events (profile_id, event_type, visitor_id)
  values (v_profile_id, p_event_type, v_visitor_id);

  return true;
end;
$$;
