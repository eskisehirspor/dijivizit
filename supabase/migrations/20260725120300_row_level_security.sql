-- Row-level security. Deny by default; owners reach only their own rows.
--
-- The critical decision here: anonymous visitors get NO table access at all.
-- Granting `anon` a "select where is_published" policy would expose
-- GET /rest/v1/profiles?is_published=eq.true through PostgREST, letting anyone
-- holding the (public by design) publishable key dump every card on the
-- platform. That would make the unguessable public_id worthless. Public reads
-- therefore go exclusively through public.get_public_card(), which requires an
-- exact id and returns at most one row.

alter table public.profiles enable row level security;
alter table public.profile_links enable row level security;
alter table public.profile_skills enable row level security;

revoke all on public.profiles from anon;
revoke all on public.profile_links from anon;
revoke all on public.profile_skills from anon;

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.profile_links to authenticated;
grant select, insert, update, delete on public.profile_skills to authenticated;

-- profiles ------------------------------------------------------------------
-- No insert policy: rows come from the auth.users trigger.
-- No delete policy: removal cascades from auth.users.

create policy "Owners can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Owners can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- profile_links --------------------------------------------------------------
-- profiles.id is the auth user id, so ownership is a direct comparison and
-- needs no join back to profiles.

create policy "Owners can read their own links"
  on public.profile_links
  for select
  to authenticated
  using (profile_id = (select auth.uid()));

create policy "Owners can create their own links"
  on public.profile_links
  for insert
  to authenticated
  with check (profile_id = (select auth.uid()));

create policy "Owners can update their own links"
  on public.profile_links
  for update
  to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy "Owners can delete their own links"
  on public.profile_links
  for delete
  to authenticated
  using (profile_id = (select auth.uid()));

-- profile_skills -------------------------------------------------------------
-- Same shape as profile_links, and the same shape every future module will use.

create policy "Owners can read their own skills"
  on public.profile_skills
  for select
  to authenticated
  using (profile_id = (select auth.uid()));

create policy "Owners can create their own skills"
  on public.profile_skills
  for insert
  to authenticated
  with check (profile_id = (select auth.uid()));

create policy "Owners can update their own skills"
  on public.profile_skills
  for update
  to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

create policy "Owners can delete their own skills"
  on public.profile_skills
  for delete
  to authenticated
  using (profile_id = (select auth.uid()));
