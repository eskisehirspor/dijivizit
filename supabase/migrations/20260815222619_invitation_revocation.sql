-- Allow invitation owners to revoke an invitation without deleting
-- its audit/history record.

alter table public.invitation_codes
  add column revoked_at timestamptz;

comment on column public.invitation_codes.revoked_at is
  'When set, the invitation is revoked and can no longer be redeemed.';


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
       and c.revoked_at is null
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
      extensions.digest(
        convert_to(normalized_code, 'UTF8'),
        'sha256'
      ),
      'hex'
    );

    select c.id
      into selected_id
      from public.invitation_codes c
     where c.code_hash = computed_hash
       and c.use_count < c.max_uses
       and c.revoked_at is null
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
     and use_count < max_uses
     and revoked_at is null;

  if not found then
    raise exception 'invitation_required'
      using errcode = 'P0001';
  end if;

  insert into public.invitation_redemptions (code_id, user_id)
  values (selected_id, p_user_id);
end;
$$;