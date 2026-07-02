-- Support multi-child lookup and active mission routing.

create index if not exists children_family_lower_name_idx
  on public.children (family_id, lower(name));

create index if not exists quests_active_child_created_idx
  on public.quests (child_id, created_at desc)
  where mission_status <> 'completed'
    and completed_at is null
    and response is null;
