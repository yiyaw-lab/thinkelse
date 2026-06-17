-- SMS opt-out compliance + local timezone for daily quest delivery

alter table public.families
  add column if not exists sms_opted_in boolean not null default true,
  add column if not exists timezone text;

create index if not exists families_daily_quest_idx
  on public.families (onboarding_step, sms_opted_in)
  where onboarding_step = 'complete' and sms_opted_in = true;
