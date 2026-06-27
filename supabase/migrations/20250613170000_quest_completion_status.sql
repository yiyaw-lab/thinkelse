-- Persist family mission completion separately from admin review state.
alter table public.quests
  add column if not exists mission_status text not null default 'assigned',
  add column if not exists completed_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'quests_mission_status_check'
      and conrelid = 'public.quests'::regclass
  ) then
    alter table public.quests
      add constraint quests_mission_status_check
        check (mission_status in ('assigned', 'completed'));
  end if;
end $$;

update public.quests
set
  mission_status = 'completed',
  completed_at = coalesce(completed_at, updated_at, created_at)
where response is not null
  and btrim(response) <> ''
  and (mission_status <> 'completed' or completed_at is null);

create index if not exists quests_completed_child_idx
  on public.quests (child_id, completed_at desc)
  where mission_status = 'completed';
