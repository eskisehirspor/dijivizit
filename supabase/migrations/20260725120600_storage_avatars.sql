-- Profile photos.
--
-- The bucket is public: cards are meant to be opened by strangers on mobile
-- data, and public objects are CDN-cacheable and work directly with next/image.
-- Privacy still holds because object paths are '<user_id>/<random>.<ext>' and
-- the card they belong to sits behind an unguessable public_id.
--
-- Size and MIME limits are set on the bucket so they hold even if a client
-- bypasses the upload form.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152, -- 2 MiB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "Avatar images are publicly readable"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'avatars');

-- The first path segment must be the caller's own user id, so a user cannot
-- write into, overwrite, or delete another user's folder.

create policy "Users can upload their own avatar"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can replace their own avatar"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can delete their own avatar"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
