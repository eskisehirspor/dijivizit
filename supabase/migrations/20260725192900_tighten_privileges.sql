-- Follow-up to the initial schema, closing three findings from verifying the
-- deployed database. Forward-only: nothing already applied is edited.

-- 1. Table privileges ---------------------------------------------------------
--
-- Supabase ships default privileges granting ALL on new tables in `public` to
-- anon, authenticated and service_role. The initial migration granted a
-- narrower set, which was a no-op because the role already held more, and
-- revoked only from anon. That left `authenticated` holding INSERT, DELETE,
-- TRUNCATE, TRIGGER and REFERENCES on every table.
--
-- Row-level security covered the gap for INSERT and DELETE, but TRUNCATE is not
-- subject to row-level security at all, so that one bypassed the policy layer
-- outright. Not reachable through PostgREST, which has no TRUNCATE verb, but it
-- meant the access model rested on a single layer.

revoke all on public.profiles from authenticated;
revoke all on public.profile_links from authenticated;
revoke all on public.profile_skills from authenticated;

-- Profiles are created by the on_auth_user_created trigger and removed by the
-- cascade from auth.users, so an owner never inserts or deletes their own row.
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.profile_links to authenticated;
grant select, insert, update, delete on public.profile_skills to authenticated;

-- 2. Trigger functions are not API ---------------------------------------------
--
-- These were reachable at /rest/v1/rpc/<name>. Postgres refuses to execute a
-- `returns trigger` function outside a trigger context, so nothing could be done
-- with them, but relying on that refusal is not a defence worth keeping.
--
-- Revoking EXECUTE does not stop the triggers firing: Postgres checks EXECUTE on
-- a trigger function when the trigger is created, not each time it fires. Two of
-- these never run as `authenticated` in any case — handle_new_user fires as
-- supabase_auth_admin on auth.users, and assign_public_id runs inside it.

revoke all on function public.assign_public_id() from public, anon, authenticated;
revoke all on function public.enforce_child_row_limit() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
-- Trigger-only as well, and equally not something to expose, even though it is
-- SECURITY INVOKER and so was not flagged by the linter.
revoke all on function public.set_updated_at() from public, anon, authenticated;

-- get_public_card keeps its anon grant. Anonymous execution is the design: it is
-- the single public entry point, and the linter warning about it is expected.

-- 3. Storage bucket listing ----------------------------------------------------
--
-- A public bucket serves objects at /storage/v1/object/public/... without
-- consulting storage.objects policies, so this SELECT policy bought nothing for
-- reads — but it did permit clients to *list* the bucket. Paths are
-- '<user_id>/<file>', so listing would have exposed every user id and every
-- avatar on the platform.
--
-- Dropping it leaves public URLs working, which is all the card and next/image
-- need. The owner-scoped insert, update and delete policies stay.

drop policy if exists "Avatar images are publicly readable" on storage.objects;
