-- Open invites addressed to the signed-in user, with the team's name (the
-- invitee is not a member yet, so they can't read organizations directly).
create or replace function public.get_my_org_invites()
returns table (id uuid, org_id uuid, org_name text, role text, created_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select i.id, i.org_id, o.name, i.role, i.created_at
  from public.organization_invites i
  join public.organizations o on o.id = i.org_id
  where i.email = lower((select auth.jwt() ->> 'email'))
    and i.accepted_at is null and i.revoked_at is null and i.expires_at > now()
    and not exists (
      select 1 from public.organization_members m
      where m.org_id = i.org_id and m.user_id = (select auth.uid())
    )
  order by i.created_at desc;
$$;
revoke execute on function public.get_my_org_invites() from public, anon;
grant execute on function public.get_my_org_invites() to authenticated;
