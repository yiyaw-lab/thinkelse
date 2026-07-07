# Scheduler Reliability

Else uses Vercel Cron every 30 minutes for both daily quests and optional dinner
questions. Families can choose whole-hour or half-hour local times, so the send
window is:

- due when local hour matches the preferred hour
- due when local minute is from preferred minute through preferred minute + 29
- not due before the preferred minute
- not due once the next half-hour window begins

Both cron routes use `isPreferredDeliveryWindow` from `lib/timezone.ts`.

## Dry-Run Observability

Both routes support `?dryRun=1` in production with the normal
`Authorization: Bearer CRON_SECRET` header:

- `/api/cron/daily-quest?dryRun=1`
- `/api/cron/dinner-conversation?dryRun=1`

Dry runs must not call OpenAI, send Telnyx SMS, create quest or dinner rows, or
record outbound guardrail events. They should report `would_send` when a family
or child is due and explicit skipped statuses otherwise.

## Verification

Run `npm run check:scheduler-windows` to prove:

- whole-hour and half-hour times parse
- unsupported quarter-hour times are rejected
- the 30-minute window boundaries behave correctly
- timezone-local date keys are used
- daily and dinner cron routes share the same delivery-window helper
- dry-run `would_send` statuses remain present in both routes
