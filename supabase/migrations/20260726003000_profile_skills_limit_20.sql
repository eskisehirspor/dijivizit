-- Lower the profile_skills row cap from 30 to 20 for MVP.
-- Trigger arguments are fixed at CREATE time, so the trigger must be replaced.

drop trigger if exists profile_skills_enforce_limit on public.profile_skills;

create trigger profile_skills_enforce_limit
  before insert on public.profile_skills
  for each row
  execute function public.enforce_child_row_limit(20);
