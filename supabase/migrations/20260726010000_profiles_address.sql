-- Physical / mailing address as a first-class profile identity field.
-- Contact channels (phone, email, social) stay in profile_links; address is
-- structured with the person the same way title and company are.

alter table public.profiles
  add column address text;

alter table public.profiles
  add constraint profiles_address_length
  check (address is null or char_length(address) <= 500);

comment on column public.profiles.address is
  'Business or mailing address shown on the public card and emitted as vCard ADR.';

-- Recreate the public read surface so anonymous visitors receive the address.
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
