-- generate_public_id is not executable by clients, so the slug is always
-- generated inside the SECURITY DEFINER guard (clients can't pick slugs).
alter table public.cards alter column slug drop default;

create or replace function public.cards_guard()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    new.slug := public.generate_public_id(11);
    while exists (select 1 from public.profiles p where p.public_id = new.slug)
       or exists (select 1 from public.cards c where c.slug = new.slug) loop
      new.slug := public.generate_public_id(11);
    end loop;
    if new.owner_id is not null
       and (select count(*) from public.cards c where c.owner_id = new.owner_id) >= 10 then
      raise exception 'card limit reached' using errcode = 'P0001';
    end if;
    if new.org_id is not null
       and (select count(*) from public.cards c where c.org_id = new.org_id) >= 500 then
      raise exception 'card limit reached' using errcode = 'P0001';
    end if;
  elsif new.slug <> old.slug or new.owner_id is distinct from old.owner_id
        or new.org_id is distinct from old.org_id then
    raise exception 'card identity is immutable' using errcode = 'P0001';
  end if;
  if new.org_id is not null and new.assigned_to is not null and not exists (
    select 1 from public.organization_members m
    where m.org_id = new.org_id and m.user_id = new.assigned_to
  ) then
    raise exception 'assignee is not a member' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
