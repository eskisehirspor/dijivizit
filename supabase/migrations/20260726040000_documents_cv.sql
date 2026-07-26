-- Documents module (CV and future file types).
-- One active CV per user via partial unique index on (user_id) where type = 'cv'.

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null,
  title text not null,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  file_size integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint documents_type_length check (char_length(type) between 2 and 32),
  constraint documents_title_length check (char_length(title) between 1 and 200),
  constraint documents_storage_path_length check (char_length(storage_path) between 1 and 512),
  constraint documents_file_name_length check (char_length(file_name) between 1 and 255),
  constraint documents_mime_type_length check (char_length(mime_type) between 1 and 120),
  constraint documents_file_size_positive check (file_size > 0),
  constraint documents_storage_path_key unique (storage_path)
);

create unique index documents_one_cv_per_user_idx
  on public.documents (user_id)
  where type = 'cv';

create index documents_user_id_idx on public.documents (user_id);

create trigger documents_set_updated_at
  before update on public.documents
  for each row
  execute function public.set_updated_at();

alter table public.documents enable row level security;

revoke all on public.documents from anon;
revoke all on public.documents from authenticated;
grant select, insert, update, delete on public.documents to authenticated;

create policy "Owners can read their own documents"
  on public.documents
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Owners can create their own documents"
  on public.documents
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Owners can update their own documents"
  on public.documents
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Owners can delete their own documents"
  on public.documents
  for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- Public bucket: same privacy model as avatars (unguessable paths behind public_id).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  true,
  10485760, -- 10 MiB
  array['application/pdf']
)
on conflict (id) do nothing;

create policy "Document files are publicly readable"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'documents');

create policy "Users can upload their own documents"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can replace their own documents"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can delete their own documents"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Additive public allowlist: expose CV metadata only when the card is published.
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
