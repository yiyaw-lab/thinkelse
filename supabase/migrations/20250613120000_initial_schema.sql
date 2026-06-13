-- Else initial schema: families → children → quests

create extension if not exists "pgcrypto";

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  parent_name text,
  preferred_time text,
  onboarding_step text not null default 'parent_name',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null,
  age integer,
  interests text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists children_family_id_idx on public.children (family_id);

create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  prompt text not null,
  mission text not null,
  follow_up text,
  skill text,
  difficulty text not null default 'medium',
  response text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quests_child_id_created_at_idx
  on public.quests (child_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists families_set_updated_at on public.families;
create trigger families_set_updated_at
before update on public.families
for each row execute function public.set_updated_at();

drop trigger if exists children_set_updated_at on public.children;
create trigger children_set_updated_at
before update on public.children
for each row execute function public.set_updated_at();

drop trigger if exists quests_set_updated_at on public.quests;
create trigger quests_set_updated_at
before update on public.quests
for each row execute function public.set_updated_at();

alter table public.families enable row level security;
alter table public.children enable row level security;
alter table public.quests enable row level security;
