-- Preference for the public profile skills section heading.
-- Stored as a stable key; UI copy lives in i18n.

alter table public.profiles
  add column skills_section_title text not null default 'expertise_areas';

alter table public.profiles
  add constraint profiles_skills_section_title_check
  check (skills_section_title in ('expertise_areas', 'skills'));

comment on column public.profiles.skills_section_title is
  'Public skills section heading key: expertise_areas | skills.';

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
    'cv', (
      select case
        when d.id is null then null
        else jsonb_build_object(
          'title', d.title,
          'fileName', d.file_name,
          'storagePath', d.storage_path
        )
      end
      from public.documents d
      where d.user_id = p.id
        and d.type = 'cv'
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
