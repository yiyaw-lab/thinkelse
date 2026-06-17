-- Store quest titles for history-aware personalization
alter table public.quests
  add column if not exists title text;
