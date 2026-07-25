-- Every account gets a profile row the moment it is created, regardless of
-- whether signup came through email/password or Google. Doing this in the
-- database rather than in application code means there is no code path — and no
-- partially failed signup — that can leave an account without a card.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Only the profile row. No contact link is created from the sign-up address:
  -- that would put the account's login email on a public card by default, which
  -- is the user's decision to make, not ours.
  insert into public.profiles (id, full_name)
  values (
    new.id,
    -- Google returns the display name under `full_name` or `name` depending on
    -- the scope granted; email/password signups have neither.
    nullif(
      trim(
        coalesce(
          new.raw_user_meta_data ->> 'full_name',
          new.raw_user_meta_data ->> 'name',
          ''
        )
      ),
      ''
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
