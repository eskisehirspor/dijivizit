-- Expertise areas ("Branding", "UI/UX") and tools ("Figma", "SwiftUI").
--
-- One table with a discriminator rather than two: the columns, ownership,
-- ordering and policies would be identical, and keeping them together means
-- everything a person can do is one query away for the future assistant while
-- staying trivially separable by type.
--
-- Names are stored denormalised. Promoting them to a shared catalogue later is
-- purely additive — a nullable skill_id backfilled by matching on name — so
-- there is no reason to pay for that structure before anything reads across
-- users.

create table public.profile_skills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  type text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profile_skills_type_valid check (type in ('expertise', 'skill')),
  constraint profile_skills_name_length check (char_length(name) between 1 and 60),
  constraint profile_skills_display_order_range check (display_order between 0 and 999)
);

-- Case-insensitive, so one profile cannot end up holding both 'Figma' and
-- 'figma' as separate entries.
create unique index profile_skills_profile_id_type_name_key
  on public.profile_skills (profile_id, type, lower(name));

create index profile_skills_profile_id_type_display_order_idx
  on public.profile_skills (profile_id, type, display_order);

create trigger profile_skills_enforce_limit
  before insert on public.profile_skills
  for each row
  execute function public.enforce_child_row_limit(30);

create trigger profile_skills_set_updated_at
  before update on public.profile_skills
  for each row
  execute function public.set_updated_at();
