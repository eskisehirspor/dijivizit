-- Cards and teams.
--
-- A card is an address (/p/<slug>) that opens someone's profile. Personal
-- cards belong to one user; organization cards belong to a team and can be
-- reassigned, so a printed NFC/QR card survives an employee leaving.
-- profiles.public_id keeps working as the personal, non-transferable link.

-- Teams ----------------------------------------------------------------------

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger organizations_set_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

create table public.organization_members (
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index organization_members_user_idx on public.organization_members (user_id);

create table public.organization_invites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  email text not null check (email = lower(btrim(email)) and char_length(email) between 3 and 254),
  role text not null default 'member' check (role in ('admin', 'member')),
  invited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '14 days',
  accepted_at timestamptz,
  revoked_at timestamptz
);
create index organization_invites_email_idx on public.organization_invites (email)
  where accepted_at is null and revoked_at is null;
create unique index organization_invites_open_unique on public.organization_invites (org_id, email)
  where accepted_at is null and revoked_at is null;

-- Membership checks used by policies. SECURITY DEFINER so policies on
-- organization_members don't recurse into themselves.
create or replace function public.is_org_member(p_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.organization_members m
    where m.org_id = p_org and m.user_id = (select auth.uid())
  );
$$;

create or replace function public.is_org_admin(p_org uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.organization_members m
    where m.org_id = p_org and m.user_id = (select auth.uid()) and m.role in ('owner', 'admin')
  );
$$;

revoke execute on function public.is_org_member(uuid) from public, anon;
revoke execute on function public.is_org_admin(uuid) from public, anon;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.is_org_admin(uuid) to authenticated;

-- The creator becomes the owner.
create or replace function public.add_org_owner()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.created_by is not null then
    insert into public.organization_members (org_id, user_id, role)
    values (new.id, new.created_by, 'owner')
    on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger organizations_add_owner
  after insert on public.organizations
  for each row execute function public.add_org_owner();

-- At most 3 teams created per user.
create or replace function public.enforce_org_limit()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.organizations o where o.created_by = new.created_by) >= 3 then
    raise exception 'organization limit reached' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger organizations_limit
  before insert on public.organizations
  for each row execute function public.enforce_org_limit();

-- A team always keeps at least one owner.
create or replace function public.protect_last_owner()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.role = 'owner'
     and (tg_op = 'DELETE' or new.role <> 'owner')
     and not exists (
       select 1 from public.organization_members m
       where m.org_id = old.org_id and m.role = 'owner' and m.user_id <> old.user_id
     )
     and exists (select 1 from public.organizations o where o.id = old.org_id)
  then
    raise exception 'last owner' using errcode = 'P0001';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger organization_members_protect_owner
  before update or delete on public.organization_members
  for each row execute function public.protect_last_owner();

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_invites enable row level security;

create policy "organizations: members read" on public.organizations
  for select to authenticated using (public.is_org_member(id));
create policy "organizations: create own" on public.organizations
  for insert to authenticated with check (created_by = (select auth.uid()));
create policy "organizations: admins update" on public.organizations
  for update to authenticated using (public.is_org_admin(id)) with check (public.is_org_admin(id));
create policy "organizations: owners delete" on public.organizations
  for delete to authenticated using (
    exists (select 1 from public.organization_members m
            where m.org_id = organizations.id and m.user_id = (select auth.uid()) and m.role = 'owner')
  );

create policy "organization_members: members read" on public.organization_members
  for select to authenticated using (public.is_org_member(org_id));
create policy "organization_members: admins update" on public.organization_members
  for update to authenticated using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));
create policy "organization_members: admins remove or self leave" on public.organization_members
  for delete to authenticated using (public.is_org_admin(org_id) or user_id = (select auth.uid()));

create policy "organization_invites: admins all" on public.organization_invites
  for all to authenticated using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));
create policy "organization_invites: invitee reads own" on public.organization_invites
  for select to authenticated using (email = lower((select auth.jwt() ->> 'email')));

grant select, insert, update, delete on public.organizations to authenticated;
grant select, update, delete on public.organization_members to authenticated;
grant select, insert, update, delete on public.organization_invites to authenticated;

-- Accept an invite addressed to the signed-in user's email.
create or replace function public.accept_org_invite(p_invite_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_email text := lower((select auth.jwt() ->> 'email'));
  v_invite public.organization_invites%rowtype;
begin
  if (select auth.uid()) is null or v_email is null then
    return null;
  end if;
  select * into v_invite from public.organization_invites i
  where i.id = p_invite_id and i.email = v_email
    and i.accepted_at is null and i.revoked_at is null and i.expires_at > now();
  if not found then
    return null;
  end if;
  insert into public.organization_members (org_id, user_id, role)
  values (v_invite.org_id, (select auth.uid()), v_invite.role)
  on conflict (org_id, user_id) do nothing;
  update public.organization_invites set accepted_at = now() where id = v_invite.id;
  return v_invite.org_id;
end;
$$;
revoke execute on function public.accept_org_invite(uuid) from public, anon;
grant execute on function public.accept_org_invite(uuid) to authenticated;

-- Members with their profile summary and login email, for the team page.
create or replace function public.get_org_members(p_org uuid)
returns table (
  user_id uuid, role text, joined_at timestamptz, full_name text, title text,
  email text, public_id text, is_published boolean
)
language sql stable security definer set search_path = '' as $$
  select m.user_id, m.role, m.joined_at, p.full_name, p.title, u.email::text, p.public_id, p.is_published
  from public.organization_members m
  join public.profiles p on p.id = m.user_id
  join auth.users u on u.id = m.user_id
  where m.org_id = p_org and public.is_org_member(p_org)
  order by case m.role when 'owner' then 0 when 'admin' then 1 else 2 end, p.full_name;
$$;
revoke execute on function public.get_org_members(uuid) from public, anon;
grant execute on function public.get_org_members(uuid) to authenticated;

-- Server-side helper: does an account exist for this email? Service role only.
create or replace function public.email_has_account(p_email text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from auth.users u where lower(u.email) = lower(btrim(p_email)));
$$;
revoke execute on function public.email_has_account(text) from public, anon, authenticated;
grant execute on function public.email_has_account(text) to service_role;

-- Cards ----------------------------------------------------------------------

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique default public.generate_public_id(11)
    check (slug ~ '^[0-9A-Za-z]{11}$'),
  label text check (label is null or char_length(label) <= 60),
  owner_id uuid references public.profiles (id) on delete cascade,
  org_id uuid references public.organizations (id) on delete cascade,
  assigned_to uuid references public.profiles (id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cards_one_owner check ((owner_id is null) <> (org_id is null)),
  constraint cards_personal_self check (owner_id is null or assigned_to = owner_id)
);
create index cards_owner_idx on public.cards (owner_id);
create index cards_org_idx on public.cards (org_id);
create index cards_assigned_idx on public.cards (assigned_to);

create trigger cards_set_updated_at
  before update on public.cards
  for each row execute function public.set_updated_at();

-- Slugs never collide with a personal public_id; org cards are only assigned
-- to members; personal cards are capped at 10 per user, org cards at 500.
create or replace function public.cards_guard()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    while exists (select 1 from public.profiles p where p.public_id = new.slug) loop
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

create trigger cards_guard
  before insert or update on public.cards
  for each row execute function public.cards_guard();

-- When someone leaves a team, the team's cards they held become unassigned.
create or replace function public.unassign_cards_on_leave()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.cards set assigned_to = null
  where org_id = old.org_id and assigned_to = old.user_id;
  return old;
end;
$$;

create trigger organization_members_unassign_cards
  after delete on public.organization_members
  for each row execute function public.unassign_cards_on_leave();

alter table public.cards enable row level security;

create policy "cards: read own, assigned or team" on public.cards
  for select to authenticated using (
    owner_id = (select auth.uid())
    or assigned_to = (select auth.uid())
    or (org_id is not null and public.is_org_admin(org_id))
  );
create policy "cards: create personal or team" on public.cards
  for insert to authenticated with check (
    (owner_id = (select auth.uid()) and org_id is null)
    or (owner_id is null and org_id is not null and public.is_org_admin(org_id))
  );
create policy "cards: update personal or team" on public.cards
  for update to authenticated
  using (owner_id = (select auth.uid()) or (org_id is not null and public.is_org_admin(org_id)))
  with check (owner_id = (select auth.uid()) or (org_id is not null and public.is_org_admin(org_id)));
create policy "cards: delete personal or team" on public.cards
  for delete to authenticated
  using (owner_id = (select auth.uid()) or (org_id is not null and public.is_org_admin(org_id)));

grant select, insert, update, delete on public.cards to authenticated;

-- Resolution -----------------------------------------------------------------

-- Which published profile a public slug opens: a personal public_id, or an
-- active card that is assigned to someone.
create or replace function public.resolve_card(p_slug text)
returns table (profile_id uuid, card_id uuid, org_id uuid)
language sql stable security definer set search_path = '' as $$
  select r.profile_id, r.card_id, r.org_id from (
    select p.id as profile_id, null::uuid as card_id, null::uuid as org_id, 0 as rank
    from public.profiles p
    where p.public_id = p_slug and p.is_published
    union all
    select p.id, c.id, c.org_id, 1
    from public.cards c
    join public.profiles p on p.id = c.assigned_to
    where c.slug = p_slug and c.is_active and p.is_published
  ) r
  order by r.rank
  limit 1;
$$;
revoke execute on function public.resolve_card(text) from public, anon, authenticated;
grant execute on function public.resolve_card(text) to service_role;

alter table public.analytics_events
  drop constraint analytics_events_event_type_check,
  add constraint analytics_events_event_type_check check (event_type in (
    'profile_view','phone_click','whatsapp_click','email_click','website_click','linkedin_click',
    'cv_open','document_open','vcard_download','address_open','share','copy_link','qr_open',
    'wallet_add','contact_left'
  ));
alter table public.analytics_events
  add column card_id uuid references public.cards (id) on delete set null;
create index analytics_events_card_idx on public.analytics_events (card_id, created_at)
  where card_id is not null;

alter table public.contacts
  add column card_id uuid references public.cards (id) on delete set null,
  add column org_id uuid references public.organizations (id) on delete set null;
create index contacts_org_idx on public.contacts (org_id) where org_id is not null;

-- Team admins can read contacts collected through the team's cards, and the
-- analytics of those cards.
create policy "contacts: team admins read" on public.contacts
  for select to authenticated using (org_id is not null and public.is_org_admin(org_id));

create policy "analytics_events: team admins read card events" on public.analytics_events
  for select to authenticated using (
    card_id is not null and exists (
      select 1 from public.cards c
      where c.id = card_id and c.org_id is not null and public.is_org_admin(c.org_id)
    )
  );

create or replace function public.get_public_card(p_public_id text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'publicId', p_public_id,
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
      select jsonb_build_object('accountHolder', b.account_holder, 'iban', b.iban, 'bankName', b.bank_name)
      from public.bank_accounts b where b.user_id = p.id and b.is_visible limit 1
    ),
    'billingInfo', (
      select jsonb_build_object('companyTitle', i.company_title, 'companyAddress', i.company_address,
                                'taxNumber', i.tax_number, 'taxOffice', i.tax_office)
      from public.billing_infos i where i.user_id = p.id and i.is_visible limit 1
    ),
    'documents', coalesce((
      select jsonb_agg(jsonb_build_object('id', d.id, 'type', d.type, 'title', d.title,
                                          'description', d.description, 'fileName', d.file_name)
                       order by d.display_order, d.created_at)
      from public.documents d where d.user_id = p.id and d.is_visible = true
    ), '[]'::jsonb),
    'links', coalesce((
      select jsonb_agg(jsonb_build_object('platform', l.platform, 'label', l.label, 'value', l.value)
                       order by l.display_order, l.created_at)
      from public.profile_links l where l.profile_id = p.id and l.is_visible
    ), '[]'::jsonb),
    'skills', coalesce((
      select jsonb_agg(jsonb_build_object('name', s.name, 'type', s.type)
                       order by s.type, s.display_order, s.created_at)
      from public.profile_skills s where s.profile_id = p.id
    ), '[]'::jsonb)
  )
  from public.resolve_card(p_public_id) r
  join public.profiles p on p.id = r.profile_id;
$$;

create or replace function public.record_card_event(
  p_public_id text, p_event_type text, p_visitor_id text default null
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_profile_id uuid;
  v_card_id uuid;
  v_visitor_id text;
begin
  if p_event_type not in (
    'profile_view','phone_click','whatsapp_click','email_click','website_click','linkedin_click',
    'cv_open','document_open','vcard_download','address_open','share','copy_link','qr_open',
    'wallet_add','contact_left'
  ) then
    return false;
  end if;

  v_visitor_id := nullif(btrim(coalesce(p_visitor_id, '')), '');
  if v_visitor_id is not null and char_length(v_visitor_id) > 64 then
    return false;
  end if;

  select r.profile_id, r.card_id into v_profile_id, v_card_id
  from public.resolve_card(p_public_id) r;

  if v_profile_id is null then
    return false;
  end if;

  if v_visitor_id is not null and exists (
    select 1 from public.analytics_events e
    where e.profile_id = v_profile_id
      and e.visitor_id = v_visitor_id
      and e.event_type = p_event_type
      and e.created_at > now() - interval '30 minutes'
  ) then
    return false;
  end if;

  insert into public.analytics_events (profile_id, event_type, visitor_id, card_id)
  values (v_profile_id, p_event_type, v_visitor_id, v_card_id);

  if random() < 0.01 then
    delete from public.analytics_events where created_at < now() - interval '13 months';
  end if;

  return true;
end;
$$;

create or replace function public.submit_card_contact(
  p_public_id text, p_full_name text, p_phone text, p_email text, p_company text, p_message text
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_profile_id uuid;
  v_card_id uuid;
  v_org_id uuid;
  v_recent integer;
  v_name text := nullif(btrim(coalesce(p_full_name, '')), '');
  v_phone text := nullif(btrim(coalesce(p_phone, '')), '');
  v_email text := nullif(lower(btrim(coalesce(p_email, ''))), '');
begin
  if v_name is null or char_length(v_name) < 2 or char_length(v_name) > 120 then
    return false;
  end if;
  if v_phone is null and v_email is null then
    return false;
  end if;

  select r.profile_id, r.card_id, r.org_id into v_profile_id, v_card_id, v_org_id
  from public.resolve_card(p_public_id) r;

  if v_profile_id is null then
    return false;
  end if;

  select count(*) into v_recent
  from public.contacts c
  where c.profile_id = v_profile_id
    and c.source = 'card_form'
    and c.created_at > now() - interval '1 hour';

  if v_recent >= 30 then
    return false;
  end if;

  insert into public.contacts (
    profile_id, full_name, phone, email, company, message, source, consent_at, card_id, org_id
  ) values (
    v_profile_id,
    v_name,
    left(v_phone, 40),
    left(v_email, 254),
    left(nullif(btrim(coalesce(p_company, '')), ''), 120),
    left(nullif(btrim(coalesce(p_message, '')), ''), 1000),
    'card_form',
    now(),
    v_card_id,
    v_org_id
  );

  return true;
end;
$$;
