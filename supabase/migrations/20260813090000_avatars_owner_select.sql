-- Owner-only SELECT on avatars.
--
-- 20260725192900 dropped the public SELECT policy so the bucket could not be
-- listed (every user id and every avatar path). Public object URLs still work
-- because the bucket is public; they do not consult storage.objects policies.
--
-- Upload is INSERT … RETURNING * on storage.objects. After the last object in
-- a user folder is deleted, Storage leaves .emptyFolderPlaceholder and the next
-- INSERT into that prefix must SELECT the leftover row. With no SELECT policy,
-- re-upload after delete fails.
--
-- This restores SELECT only for the caller's own folder — the same predicate as
-- the existing INSERT / UPDATE / DELETE policies. It does not restore public
-- listing.

create policy "Users can select their own avatar"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
