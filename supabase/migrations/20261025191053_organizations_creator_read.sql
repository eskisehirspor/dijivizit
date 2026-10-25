-- INSERT ... RETURNING checks the SELECT policy before the owner row exists.
create policy "organizations: creator reads" on public.organizations
  for select to authenticated using (created_by = (select auth.uid()));
