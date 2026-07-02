-- Durable personalization notes extracted from family SMS conversation.

create table if not exists public.family_learning_events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  child_id uuid references public.children (id) on delete set null,
  quest_id uuid references public.quests (id) on delete set null,
  kind text not null,
  summary text not null,
  evidence text,
  confidence numeric(3,2) not null default 0.70,
  created_at timestamptz not null default now(),
  constraint family_learning_events_kind_check
    check (
      kind in (
        'child_interest',
        'quest_feedback',
        'family_preference',
        'successful_pattern',
        'avoidance',
        'parent_note'
      )
    ),
  constraint family_learning_events_summary_check
    check (char_length(btrim(summary)) between 1 and 280),
  constraint family_learning_events_evidence_check
    check (evidence is null or char_length(evidence) <= 500),
  constraint family_learning_events_confidence_check
    check (confidence >= 0 and confidence <= 1)
);

create index if not exists family_learning_events_family_created_idx
  on public.family_learning_events (family_id, created_at desc);

create index if not exists family_learning_events_child_kind_created_idx
  on public.family_learning_events (child_id, kind, created_at desc)
  where child_id is not null;

alter table public.family_learning_events enable row level security;

grant select, insert on public.family_learning_events to service_role;
