-- Tokens for scheduled jobs (e.g. the Instagram long-lived token) that rotate
-- on their own. Only the service role can read or write them.
create table public.integration_tokens (
  name text primary key check (char_length(name) between 1 and 64),
  token text not null,
  refreshed_at timestamptz not null default now()
);
alter table public.integration_tokens enable row level security;
revoke all on public.integration_tokens from anon, authenticated;
