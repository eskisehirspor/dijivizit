-- The entire public read surface of Dijivizit.
--
-- Takes an exact public_id and returns at most one published card. There is no
-- list endpoint and no filter, so there is nothing to enumerate: a caller must
-- already know the ~65 bits of entropy in the id.
--
-- This is an allowlist, not a table grant. Every future module — portfolio
-- items, documents, knowledge sources — stays private until a key for it is
-- added here deliberately, which is the opposite default to granting anon
-- select on a table and remembering to restrict it.
--
-- Deliberately omits profiles.id, is_published, created_at and updated_at.

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
    'avatarPath', p.avatar_path,
    'theme', p.theme,
    'locale', p.locale,
    -- Values are raw, not URIs, so the client can render an anchor and a vCard
    -- line from the same row.
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

revoke all on function public.get_public_card(text) from public;
grant execute on function public.get_public_card(text) to anon, authenticated;
