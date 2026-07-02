# Else Architecture

Else is a text-based family cognition coach.

## Product Loop

1. Parent texts Elsy.
2. Elsy onboards the parent and each child profile.
3. Elsy sends child-specific curiosity quests tuned to age and interests.
4. Parent replies with a child’s response, feedback, suggestions, or support questions.
5. Elsy classifies the reply before taking action.
6. Child responses complete that child’s mission, get interpreted, and may also create durable memory.
7. Feedback-only replies are acknowledged and stored as family learning without completing the active mission.

## Stack

- Next.js App Router
- TypeScript
- Supabase
- Telnyx SMS
- OpenAI API
- Vercel

## Core Folders

- `app/api/sms/inbound` — Telnyx inbound webhook
- `app/api/health` — health check route
- `lib/supabaseAdmin.ts` — server-side Supabase client
- `lib/onboarding.ts` — onboarding state machine
- `lib/agents` — AI reasoning layer, coming next
- `lib/db` — database helpers, coming next
- `docs` — architecture and product docs

## Architecture Principle

Routes should stay thin.

Product intelligence lives in `lib/agents`.

Database operations live in `lib/db`.

External service logic lives in service-specific helpers.
