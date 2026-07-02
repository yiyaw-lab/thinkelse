-- Persist optional dinner conversation prompt preference

alter table public.families
  add column if not exists dinner_conversation_opt_in boolean not null default false;
