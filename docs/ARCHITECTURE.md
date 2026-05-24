# Else Architecture

Else is a text-based family cognition coach.

## Product Loop

1. Parent texts Elsy.
2. Elsy onboards the parent and child.
3. Elsy sends curiosity quests.
4. Parent replies with the child’s response.
5. Elsy interprets the response, gives a follow-up question, and updates memory.

## Stack

- Next.js App Router
- TypeScript
- Supabase
- Twilio SMS
- OpenAI API
- Vercel

## Core Folders

- `app/api/sms/inbound` — Twilio inbound webhook
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