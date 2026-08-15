-- Invitation-only signup.
--
-- New auth.users rows must redeem a valid invitation. Returning users never
-- INSERT, so existing accounts (email and Google) are unaffected.
--
-- Email/password: the plaintext code is passed in raw_user_meta_data.invitation_code
-- and hashed here. Generic (unbound) codes are allowed.
--
-- Google: metadata is provider-controlled, so a generic code cannot be supplied
-- securely. A brand-new Google identity may proceed only with an unused
-- invitation whose email is bound to that Google address.

create table public.invitation_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null,
  email text,
  max_uses integer not null default 1,
  use_count integer not null default 0,
  expires_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),

  constraint invitation_codes_code_hash_key unique (code_hash),
  constraint invitation_codes_code_hash_length check (char_length(code_hash) = 64),
  constraint invitation_codes_email_lower check (email is null or email = lower(email)),
  constraint invitation_codes_max_uses_positive check (max_uses >= 1),
  constraint invitation_codes_use_count_nonnegative check (use_count >= 0),
  constraint invitation_codes_use_count_within_max check (use_count <= max_uses)
);

create table public.invitation_redemptions (
  code_id uuid not null references public.invitation_codes (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  redeemed_at timestamptz not null default now(),

  primary key (code_id, user_id)
);

create index invitation_codes_email_idx
  on public.invitation_codes (email)
  where email is not null;

comment on table public.invitation_codes is
  'Hashed invitation codes. Plaintext is shown once at creation and never stored.';

comment on column public.invitation_codes.email is
  'When set, only this lowercase address may redeem the code. Required for Google signup.';

create or replace function public.normalize_invitation_email()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.email is not null then
    new.email := lower(trim(new.email));
    if new.email = '' then
      new.email := null;
    end if;
  end if;
  return new;
end;
$$;

create trigger invitation_codes_normalize_email
  before insert or update on public.invitation_codes
  for each row
  execute function public.normalize_invitation_email();

-- Atomically consume one use and record the redemption. Called only from the
-- auth.users trigger (revoked from client roles below).
create or replace function public.redeem_invitation_for_signup(
  p_user_id uuid,
  p_email text,
  p_invitation_code text,
  p_provider text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_email text;
  normalized_code text;
  computed_hash text;
  selected_id uuid;
  provider text;
begin
  normalized_email := lower(trim(coalesce(p_email, '')));
  provider := lower(coalesce(nullif(trim(p_provider), ''), 'email'));

  if normalized_email = '' then
    raise exception 'invitation_required'
      using errcode = 'P0001';
  end if;

  if provider = 'google' then
    select c.id
      into selected_id
      from public.invitation_codes c
     where c.email is not null
       and c.email = normalized_email
       and c.use_count < c.max_uses
       and (c.expires_at is null or c.expires_at > pg_catalog.now())
     order by c.created_at asc
     for update skip locked
     limit 1;
  else
    normalized_code := upper(trim(coalesce(p_invitation_code, '')));
    if normalized_code = '' then
      raise exception 'invitation_required'
        using errcode = 'P0001';
    end if;

    computed_hash := encode(
      extensions.digest(convert_to(normalized_code, 'UTF8'), 'sha256'),
      'hex'
    );

    select c.id
      into selected_id
      from public.invitation_codes c
     where c.code_hash = computed_hash
       and c.use_count < c.max_uses
       and (c.expires_at is null or c.expires_at > pg_catalog.now())
       and (c.email is null or c.email = normalized_email)
     for update
     limit 1;
  end if;

  if selected_id is null then
    raise exception 'invitation_required'
      using errcode = 'P0001';
  end if;

  update public.invitation_codes
     set use_count = use_count + 1
   where id = selected_id
     and use_count < max_uses;

  if not found then
    raise exception 'invitation_required'
      using errcode = 'P0001';
  end if;

  insert into public.invitation_redemptions (code_id, user_id)
  values (selected_id, p_user_id);
end;
$$;

create or replace function public.enforce_signup_invitation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.redeem_invitation_for_signup(
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'invitation_code',
    coalesce(new.raw_app_meta_data ->> 'provider', 'email')
  );
  return new;
end;
$$;

-- Fires before on_auth_user_created (alphabetical). A raised exception rolls
-- back the auth.users insert and any profile row from the same transaction.
create trigger enforce_signup_invitation
  after insert on auth.users
  for each row
  execute function public.enforce_signup_invitation();

alter table public.invitation_codes enable row level security;
alter table public.invitation_redemptions enable row level security;

revoke all on public.invitation_codes from public, anon, authenticated;
revoke all on public.invitation_redemptions from public, anon, authenticated;

-- Owner allowlist creates codes through the service-role client. Redemptions
-- are written only by the security-definer trigger (table owner).
grant select, insert on public.invitation_codes to service_role;

revoke all on function public.normalize_invitation_email() from public, anon, authenticated;
revoke all on function public.redeem_invitation_for_signup(uuid, text, text, text)
  from public, anon, authenticated;
revoke all on function public.enforce_signup_invitation() from public, anon, authenticated;
