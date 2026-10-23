-- Close public access to uploaded documents and tighten a few write paths.
--
-- 1. The documents bucket was public and still carried an anon SELECT policy
--    from the CV era, so anyone with the publishable key could list every
--    user's folder and download every PDF — hidden ones and those on
--    unpublished cards included. The bucket becomes private; files are served
--    only through short-lived signed URLs minted by the app after it checks
--    the card is published and the document visible.
-- 2. get_public_card no longer returns storage paths (they embed the owner's
--    auth user id and would outlive hiding/unpublishing).
-- 3. Bank and billing details gain an is_visible flag so owners can keep them
--    on file without showing them on the card.
-- 4. documents.storage_path must live in the owner's own folder.
-- 5. Profile UPDATE is limited to the columns the app edits; public_id,
--    theme and locale can no longer be rewritten through the REST API.

-- 1. Private bucket + owner-only reads ---------------------------------------

update storage.buckets set public = false where id = 'documents';

drop policy if exists "Document files are publicly readable" on storage.objects;

drop policy if exists "Users can select their own documents" on storage.objects;
create policy "Users can select their own documents"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- 3. Visibility for bank and billing ----------------------------------------

alter table public.bank_accounts
  add column if not exists is_visible boolean not null default true;

alter table public.billing_infos
  add column if not exists is_visible boolean not null default true;

comment on column public.bank_accounts.is_visible is
  'When false the IBAN stays on file but is omitted from the public card.';
comment on column public.billing_infos.is_visible is
  'When false billing details stay on file but are omitted from the public card.';

-- 2 + 3. Public card without storage paths, honouring visibility -------------

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
      select jsonb_build_object(
               'accountHolder', b.account_holder,
               'iban', b.iban,
               'bankName', b.bank_name
             )
      from public.bank_accounts b
      where b.user_id = p.id
        and b.is_visible
      limit 1
    ),
    'billingInfo', (
      select jsonb_build_object(
               'companyTitle', i.company_title,
               'companyAddress', i.company_address,
               'taxNumber', i.tax_number,
               'taxOffice', i.tax_office
             )
      from public.billing_infos i
      where i.user_id = p.id
        and i.is_visible
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
                   'fileName', d.file_name
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
  'Returns one published card by its public id, or null. The only data path available to anonymous visitors. Never returns storage paths.';

-- 4. Documents must point into the owner's folder ---------------------------

alter table public.documents
  drop constraint if exists documents_storage_path_owner_check;

alter table public.documents
  add constraint documents_storage_path_owner_check
  check (storage_path like user_id::text || '/%');

-- 5. Column-scoped profile updates -------------------------------------------

revoke update on public.profiles from authenticated;

grant update (
  full_name,
  title,
  company,
  about,
  address,
  skills_section_title,
  is_published,
  avatar_path
) on public.profiles to authenticated;
