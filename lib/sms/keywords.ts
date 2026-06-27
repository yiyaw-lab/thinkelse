import { SITE } from "@/lib/site";

const STOP_KEYWORDS = new Set([
  "stop",
  "stopall",
  "unsubscribe",
  "cancel",
  "end",
  "quit",
]);

const HELP_KEYWORDS = new Set(["help", "info"]);

const START_KEYWORDS = new Set(["start", "unstop", "yes"]);

const QUEST_REQUEST_KEYWORDS = new Set([
  "quest",
  "quest now",
  "new quest",
  "send quest",
  "start quest",
  "today's quest",
  "todays quest",
]);

export function normalizeSmsBody(body: string): string {
  return body.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isStopKeyword(body: string): boolean {
  return STOP_KEYWORDS.has(normalizeSmsBody(body));
}

export function isHelpKeyword(body: string): boolean {
  return HELP_KEYWORDS.has(normalizeSmsBody(body));
}

export function isStartKeyword(body: string): boolean {
  return START_KEYWORDS.has(normalizeSmsBody(body));
}

export function isHelloKeyword(body: string): boolean {
  return normalizeSmsBody(body) === "hello";
}

export function isQuestRequestKeyword(body: string): boolean {
  return QUEST_REQUEST_KEYWORDS.has(normalizeSmsBody(body));
}

export function getStopConfirmation(): string {
  return "You've been unsubscribed from Else SMS. You won't receive more messages. Reply START to rejoin. Msg & data rates may apply.";
}

export function getHelpMessage(): string {
  return `Else SMS Program: daily ask/try/later curiosity quests and optional dinner questions for family conversation. Reply QUEST after onboarding. Msg frequency varies (typically 1–3/day). Msg & data rates may apply. Reply STOP to opt out. Support: ${SITE.email} · ${SITE.url}/start`;
}

export function getStartConfirmation(): string {
  return `Welcome back to Else! You're re-subscribed to the ${SITE.name} SMS program. Elsy will resume your daily curiosity quests at your preferred time. Reply STOP anytime to opt out.`;
}

export function getAlreadySubscribedMessage(): string {
  return "You're already subscribed to Else. Elsy will send your next quest at your preferred time, or reply QUEST for one now. Reply STOP to opt out, HELP for help.";
}
