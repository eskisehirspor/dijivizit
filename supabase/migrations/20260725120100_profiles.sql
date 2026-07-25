-- One profile per account. The row is created by a trigger on auth.users
-- (see 20260725120400_handle_new_user.sql), never by the client.

-- Identity attributes only. Every way of contacting a person — phone, email,
-- website, social — lives in profile_links, so adding a channel never touches
-- this table.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  public_id text not null,
  full_name text,
  title text,
  company text,
  -- Long-form professional introduction, shown as "Hakkımda". This is the
  -- highest-signal text the platform will hold about a person and is intended to
  -- become primary context for their assistant.
  about text,
  -- Storage object path inside the `avatars` bucket, not a fully qualified URL,
  -- so the bucket or CDN can change without a data migration.
  avatar_path text,
  theme text not null default 'default',
  locale text not null default 'tr',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_public_id_key unique (public_id),
  constraint profiles_public_id_format check (public_id ~ '^[0-9A-Za-z]{11}$'),
  constraint profiles_full_name_length check (full_name is null or char_length(full_name) <= 120),
  constraint profiles_title_length check (title is null or char_length(title) <= 120),
  constraint profiles_company_length check (company is null or char_length(company) <= 120),
  constraint profiles_about_length check (about is null or char_length(about) <= 5000),
  -- Theme names are validated in the application. An unrecognised theme falls
  -- back to the default renderer rather than corrupting anything, so a migration
  -- per theme would buy no safety.
  constraint profiles_theme_length check (char_length(theme) between 1 and 40),
  -- A shape check rather than a list of supported locales: this rejects garbage
  -- without forcing a migration every time a message catalogue ships.
  constraint profiles_locale_format check (locale ~ '^[a-z]{2}(-[A-Z]{2})?$')
);

comment on column public.profiles.public_id is
  'Unguessable base62 id used in /p/<public_id>, NFC tags, and QR codes.';

-- Assign the public id server-side so a row can never exist without one, and so
-- a client can never choose its own (guessable) value.
create or replace function public.assign_public_id()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate text;
  attempts integer := 0;
begin
  if new.public_id is not null then
    return new;
  end if;

  loop
    candidate := public.generate_public_id();
    exit when not exists (select 1 from public.profiles where public_id = candidate);

    attempts := attempts + 1;
    if attempts >= 10 then
      raise exception 'could not allocate a unique public_id after % attempts', attempts;
    end if;
  end loop;

  new.public_id := candidate;
  return new;
end;
$$;

create trigger profiles_assign_public_id
  before insert on public.profiles
  for each row
  execute function public.assign_public_id();

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();
