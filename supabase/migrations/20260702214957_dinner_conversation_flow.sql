-- Dinner conversation setup, delivery, and one-time migration nudges.

alter table public.families
  add column if not exists dinner_conversation_time text,
  add column if not exists dinner_conversation_opt_in_asked_at timestamptz,
  add column if not exists dinner_conversation_opt_in_at timestamptz,
  add column if not exists dinner_conversation_nudged_at timestamptz,
  add column if not exists dinner_conversation_last_sent_on date;

create index if not exists families_dinner_conversation_due_idx
  on public.families (
    onboarding_step,
    sms_opted_in,
    dinner_conversation_opt_in,
    dinner_conversation_time,
    dinner_conversation_last_sent_on
  )
  where onboarding_step = 'complete'
    and sms_opted_in = true
    and dinner_conversation_opt_in = true;

create index if not exists families_dinner_conversation_nudge_idx
  on public.families (onboarding_step, sms_opted_in, dinner_conversation_nudged_at)
  where onboarding_step = 'complete'
    and sms_opted_in = true
    and dinner_conversation_opt_in = false;

create table if not exists public.dinner_conversations (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  question text not null,
  parent_move text not null,
  follow_up text not null,
  skill text,
  local_date_key date not null,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create unique index if not exists dinner_conversations_family_date_idx
  on public.dinner_conversations (family_id, local_date_key);

create index if not exists dinner_conversations_family_sent_at_idx
  on public.dinner_conversations (family_id, sent_at desc);

alter table public.dinner_conversations enable row level security;
