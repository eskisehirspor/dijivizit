-- Every way to reach a person: phone, email, website and social profiles all
-- live here, ordered by display_order.
--
-- Fixed columns per channel would mean a migration each time a network matters
-- and a wide, mostly-null table. One ordered child table makes adding a channel
-- an insert, and gives the owner control over order and labelling.

create table public.profile_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  platform text not null,
  label text,
  -- The raw datum rather than a URI: '+905320000000', 'ali@ornek.com',
  -- 'https://ornek.com'. Keeping it unwrapped is what lets a vCard emit
  -- TEL;TYPE=cell:+905320000000 without unpicking a 'tel:' prefix, and lets the
  -- card compose the right href per platform.
  value text not null,
  display_order integer not null default 0,
  -- Lets an owner take a channel off their card without losing it. Enforced in
  -- get_public_card rather than by a policy, so the owner's editor still sees
  -- hidden rows.
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profile_links_platform_valid check (
    platform in (
      'phone', 'email', 'website',
      'linkedin', 'instagram', 'x', 'facebook', 'youtube', 'tiktok',
      'github', 'behance', 'dribbble', 'whatsapp', 'telegram', 'custom'
    )
  ),
  -- Validation is per channel. For everything web-bound it stays an allowlist of
  -- schemes rather than a blocklist, so a stored 'javascript:' or 'data:' value
  -- can never reach an anchor tag on a public card.
  --
  -- Phone and email are checked only for rough shape. Exact rules belong in the
  -- application: international dialling formats are messy enough that a regex
  -- here would mean a migration every time it turned out to be wrong.
  constraint profile_links_value_valid check (
    case platform
      when 'phone' then value ~ '^\+?[0-9][0-9 ()./-]{3,31}$'
      when 'email' then
        value ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
        and char_length(value) <= 254
      else value ~* '^https?://' and char_length(value) <= 2048
    end
  ),
  constraint profile_links_label_length check (label is null or char_length(label) <= 60),
  constraint profile_links_display_order_range check (display_order between 0 and 999)
);

-- Serves the ownership filter and the ordering in one scan, which is exactly
-- what both the owner's editor and get_public_card ask for.
--
-- No partial index for is_visible: a profile holds at most 20 links, so the
-- planner reads the lot and filters in memory either way. An extra index would
-- cost writes and save nothing.
create index profile_links_profile_id_display_order_idx
  on public.profile_links (profile_id, display_order);

-- No unique constraint on (profile_id, display_order): reordering a list under
-- one would need a temporary shuffle to dodge collisions mid-update. Ties are
-- broken by created_at at read time instead.

create trigger profile_links_enforce_limit
  before insert on public.profile_links
  for each row
  execute function public.enforce_child_row_limit(20);

create trigger profile_links_set_updated_at
  before update on public.profile_links
  for each row
  execute function public.set_updated_at();
