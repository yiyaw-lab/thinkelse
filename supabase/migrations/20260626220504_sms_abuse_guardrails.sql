-- Track practical SMS guardrails without exposing message content.

create table if not exists public.sms_guardrail_events (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  family_id uuid references public.families (id) on delete set null,
  event_type text not null,
  status text not null,
  reason text,
  body_length integer,
  created_at timestamptz not null default now(),
  constraint sms_guardrail_events_event_type_check
    check (
      event_type in (
        'inbound_message',
        'outbound_message',
        'quest_request',
        'interpretation_request',
        'rate_limit_notice'
      )
    ),
  constraint sms_guardrail_events_status_check
    check (status in ('accepted', 'blocked', 'sent')),
  constraint sms_guardrail_events_body_length_check
    check (body_length is null or body_length >= 0)
);

create index if not exists sms_guardrail_events_phone_type_status_created_idx
  on public.sms_guardrail_events (phone, event_type, status, created_at desc);

create index if not exists sms_guardrail_events_family_created_idx
  on public.sms_guardrail_events (family_id, created_at desc)
  where family_id is not null;

alter table public.sms_guardrail_events enable row level security;
