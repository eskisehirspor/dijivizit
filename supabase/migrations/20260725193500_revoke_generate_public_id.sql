-- generate_public_id is an internal helper. The only caller is assign_public_id,
-- which is SECURITY DEFINER and so runs it as its owner regardless of what the
-- client role holds. Nothing outside the database has a reason to call it, so it
-- should not sit on the REST surface at /rest/v1/rpc/generate_public_id.

revoke all on function public.generate_public_id(integer) from public, anon, authenticated;
