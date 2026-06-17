-- Quest memory + human review queue for early cohort
alter table public.quests
  add column if not exists elsy_reply text,
  add column if not exists review_status text,
  add column if not exists review_notes text;

create index if not exists quests_review_pending_idx
  on public.quests (created_at desc)
  where review_status = 'pending';
