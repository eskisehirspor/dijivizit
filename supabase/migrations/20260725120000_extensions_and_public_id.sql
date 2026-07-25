-- Cryptographically random public identifiers for shareable card URLs.
--
-- These ids are the only thing standing between a stranger and a card, so they
-- are generated from a CSPRNG rather than from any sequence, timestamp, or hash
-- of user data. 11 base62 characters is ~65.5 bits of entropy.

create extension if not exists pgcrypto with schema extensions;

create or replace function public.generate_public_id(id_length integer default 11)
returns text
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  alphabet constant text := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  alphabet_size constant integer := 62;
  -- 248 is the largest multiple of 62 that fits in a byte. Bytes at or above it
  -- are discarded, because a plain `byte % 62` would make the first 8 characters
  -- of the alphabet measurably more likely than the rest.
  max_unbiased constant integer := 248;
  result text := '';
  buffer bytea;
  candidate integer;
  i integer;
begin
  if id_length < 1 then
    raise exception 'id_length must be positive, got %', id_length;
  end if;

  while length(result) < id_length loop
    -- Over-draw so that a full id almost always needs a single round of randomness
    -- even after rejected bytes.
    buffer := extensions.gen_random_bytes(id_length * 2);

    for i in 0..(length(buffer) - 1) loop
      exit when length(result) >= id_length;

      candidate := get_byte(buffer, i);

      if candidate < max_unbiased then
        result := result || substr(alphabet, (candidate % alphabet_size) + 1, 1);
      end if;
    end loop;
  end loop;

  return result;
end;
$$;

comment on function public.generate_public_id(integer) is
  'Returns a uniformly random base62 string for use as an unguessable public card id.';

-- Shared updated_at maintenance for every table that tracks modification time.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Caps how many rows one profile may own in a child table. Generic on purpose:
-- every module we have planned (portfolio items, languages, documents) hangs off
-- profile_id and will want the same guard.
--
-- A sanity limit, not a security control — two concurrent inserts can each see a
-- count below the limit and both succeed. Enforcing it exactly would need
-- serialisable isolation or a counter row, neither of which is worth the cost of
-- stopping someone reaching 51 links.
create or replace function public.enforce_child_row_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  max_rows integer := tg_argv[0]::integer;
  current_count integer;
begin
  execute format(
    'select count(*) from %I.%I where profile_id = $1',
    tg_table_schema,
    tg_table_name
  )
  into current_count
  using new.profile_id;

  if current_count >= max_rows then
    raise exception 'profile % already holds the maximum of % rows in %.%',
      new.profile_id, max_rows, tg_table_schema, tg_table_name
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;
