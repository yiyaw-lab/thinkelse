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

const PARENT_CONTEXT_KEYWORDS = new Set([
  "why",
  "why this",
  "why this dinner",
  "why this dinner question",
  "why this mission",
  "why this prompt",
  "why this quest",
  "why this question",
  "parent context",
  "context",
  "resource",
  "resources",
  "article",
  "articles",
]);

const START_KEYWORDS = new Set(["start", "unstop", "yes"]);

const SETTINGS_KEYWORDS = new Set([
  "settings",
  "setup",
  "reset settings",
  "change settings",
  "update settings",
  "change setup",
  "update setup",
  "reset setup",
  "restart setup",
  "onboarding",
  "reset onboarding",
  "change time",
  "change my time",
  "update time",
  "change quest time",
  "update quest time",
  "change mission time",
  "update mission time",
  "change timezone",
  "update timezone",
  "timezone",
]);

const ADD_CHILD_KEYWORDS = new Set([
  "add child",
  "add a child",
  "add another child",
  "new child",
  "another child",
  "add kid",
  "add a kid",
  "add another kid",
  "new kid",
  "another kid",
  "add sibling",
]);

const DINNER_SETUP_KEYWORDS = new Set([
  "dinner",
  "dinner on",
  "dinner yes",
  "dinner questions",
  "dinner question",
  "dinner conversation",
  "dinner conversations",
  "dinner convo",
  "setup dinner",
  "set up dinner",
  "dinner setup",
  "start dinner",
  "enable dinner",
  "turn dinner on",
]);

const DINNER_OFF_KEYWORDS = new Set([
  "dinner off",
  "pause dinner",
  "stop dinner",
  "no dinner",
  "turn off dinner",
  "disable dinner",
]);

const QUEST_REQUEST_KEYWORDS = new Set([
  "quest",
  "quest please",
  "quest now",
  "new quest",
  "new quest please",
  "another quest",
  "another quest please",
  "next quest",
  "next quest please",
  "send quest",
  "start quest",
  "today's quest",
  "todays quest",
  "mission",
  "mission please",
  "mission now",
  "new mission",
  "new mission please",
  "another mission",
  "another mission please",
  "next mission",
  "next mission please",
  "send mission",
  "start mission",
  "today's mission",
  "todays mission",
]);

const QUEST_REQUEST_PATTERNS = [
  /^(?:please )?(?:send|start|give me|make|create) (?:a )?(?:new |today's |todays )?(?:quest|mission)(?: please)?$/,
  /^(?:please )?(?:send|start|give me|make|create) (?:a )?(?:new |today's |todays )?(?:quest|mission) for .+$/,
  /^(?:new |today's |todays )?(?:quest|mission) for .+$/,
  /^(?:can|could) (?:i|we) (?:get|have|start) (?:a )?(?:new |today's |todays )?(?:quest|mission)(?: please)?\??$/,
  /^(?:can|could) (?:i|we) (?:get|have|start) (?:a )?(?:new |today's |todays )?(?:quest|mission) for .+\??$/,
  /^(?:i|we) (?:need|want) (?:a )?(?:new |another |next )?(?:quest|mission)(?: please)?$/,
  /^(?:i|we) (?:need|want) (?:a )?(?:new |another |next )?(?:quest|mission) for .+$/,
  /^i(?:'d| would) like (?:a )?(?:new |today's |todays )?(?:quest|mission)(?: please)?$/,
  /^i(?:'d| would) like (?:a )?(?:new |today's |todays )?(?:quest|mission) for .+$/,
];

const SETTINGS_PATTERNS = [
  /^(?:please )?(?:change|update|reset) (?:my |our )?(?:settings|setup|onboarding|timezone|time|quest time|mission time)(?: please)?$/,
  /^(?:can|could) (?:i|we) (?:change|update|reset) (?:my |our )?(?:settings|setup|timezone|time|quest time|mission time)(?: please)?\??$/,
  /^i(?:'d| would) like to (?:change|update|reset) (?:my |our )?(?:settings|setup|timezone|time|quest time|mission time)(?: please)?$/,
];

const ADD_CHILD_PATTERNS = [
  /^(?:please )?add (?:a |another )?(?:child|kid|sibling)(?: please)?$/,
  /^(?:can|could) (?:i|we) add (?:a |another )?(?:child|kid|sibling)(?: please)?\??$/,
  /^i(?:'d| would) like to add (?:a |another )?(?:child|kid|sibling)(?: please)?$/,
];

const DINNER_SETUP_PATTERNS = [
  /^dinner(?: questions?| conversations?| convo)? (?:at |on |around |for )?(?:[1-9]|1[0-2])(?::[0-5]\d)?\s*(?:am|pm)(?: please)?$/,
  /^(?:please )?(?:set up|setup|start|enable|turn on) (?:dinner|dinner questions?)(?: please)?$/,
  /^(?:please )?(?:set up|setup|start|enable|turn on) (?:dinner|dinner questions?) (?:at |on |around |for )?(?:[1-9]|1[0-2])(?::[0-5]\d)?\s*(?:am|pm)(?: please)?$/,
  /^(?:please )?turn dinner on (?:at |on |around |for )?(?:[1-9]|1[0-2])(?::[0-5]\d)?\s*(?:am|pm)(?: please)?$/,
  /^(?:can|could) (?:i|we) (?:set up|start|turn on) (?:dinner|dinner questions?)(?: please)?\??$/,
];

const DINNER_OFF_PATTERNS = [
  /^(?:please )?(?:pause|stop|disable|turn off) (?:dinner|dinner questions?)(?: please)?$/,
  /^(?:can|could) (?:i|we) (?:pause|stop|disable|turn off) (?:dinner|dinner questions?)(?: please)?\??$/,
];

const QUESTION_STARTERS = new Set([
  "am",
  "are",
  "can",
  "could",
  "did",
  "do",
  "does",
  "how",
  "is",
  "should",
  "what",
  "when",
  "where",
  "who",
  "why",
  "will",
  "would",
]);

export function normalizeSmsBody(body: string): string {
  return body.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeSmsCommand(body: string): string {
  return normalizeSmsBody(body).replace(/[.!?]+$/g, "");
}

export function isStopKeyword(body: string): boolean {
  return STOP_KEYWORDS.has(normalizeSmsCommand(body));
}

export function isHelpKeyword(body: string): boolean {
  return HELP_KEYWORDS.has(normalizeSmsCommand(body));
}

export function isParentContextKeyword(body: string): boolean {
  return PARENT_CONTEXT_KEYWORDS.has(normalizeSmsCommand(body));
}

export function isStartKeyword(body: string): boolean {
  return START_KEYWORDS.has(normalizeSmsCommand(body));
}

export function isSettingsKeyword(body: string): boolean {
  const normalizedBody = normalizeSmsCommand(body);
  return (
    SETTINGS_KEYWORDS.has(normalizedBody) ||
    SETTINGS_PATTERNS.some((pattern) => pattern.test(normalizedBody))
  );
}

export function isAddChildKeyword(body: string): boolean {
  const normalizedBody = normalizeSmsCommand(body);
  return (
    ADD_CHILD_KEYWORDS.has(normalizedBody) ||
    ADD_CHILD_PATTERNS.some((pattern) => pattern.test(normalizedBody))
  );
}

export function isDinnerSetupKeyword(body: string): boolean {
  const normalizedBody = normalizeSmsCommand(body);
  return (
    DINNER_SETUP_KEYWORDS.has(normalizedBody) ||
    DINNER_SETUP_PATTERNS.some((pattern) => pattern.test(normalizedBody))
  );
}

export function isDinnerOffKeyword(body: string): boolean {
  const normalizedBody = normalizeSmsCommand(body);
  return (
    DINNER_OFF_KEYWORDS.has(normalizedBody) ||
    DINNER_OFF_PATTERNS.some((pattern) => pattern.test(normalizedBody))
  );
}

export function isHelloKeyword(body: string): boolean {
  return normalizeSmsCommand(body) === "hello";
}

export function isQuestRequestKeyword(body: string): boolean {
  const normalizedBody = normalizeSmsCommand(body);
  return (
    QUEST_REQUEST_KEYWORDS.has(normalizedBody) ||
    QUEST_REQUEST_PATTERNS.some((pattern) => pattern.test(normalizedBody))
  );
}

export function isLikelySmsQuestion(body: string): boolean {
  const normalizedBody = normalizeSmsBody(body);
  if (!normalizedBody) {
    return false;
  }

  if (normalizedBody.endsWith("?")) {
    return true;
  }

  const [firstWord] = normalizedBody.split(" ");
  return QUESTION_STARTERS.has(firstWord ?? "");
}

export function getStopConfirmation(): string {
  return "You've been unsubscribed from Else SMS. You won't receive more messages. Reply START to rejoin. Msg & data rates may apply.";
}

export function getHelpMessage(): string {
  return `Else SMS Program: daily ask/try/later curiosity quests and optional dinner questions for family conversation. Reply QUEST or NEW MISSION after onboarding. Reply QUEST FOR [child name] for a specific child. Reply WHY after a prompt for parent context and one optional resource. Reply ADD CHILD to add another child profile. Reply DINNER to set dinner questions, DINNER OFF to pause them, SETTINGS to update your daily quest time. Msg frequency varies. Msg & data rates may apply. Reply STOP to opt out. Support: ${SITE.email} · ${SITE.url}/start`;
}

export function getStartConfirmation(): string {
  return `Welcome back to Else! You're re-subscribed to the ${SITE.name} SMS program. Elsy will resume your daily curiosity quests at your preferred time. Reply STOP anytime to opt out.`;
}

export function getAlreadySubscribedMessage(): string {
  return "You're already subscribed to Else. Elsy will send the next quest at your preferred time, or reply QUEST FOR a child name for one now. Reply DINNER to set dinner questions, ADD CHILD for another profile, SETTINGS to update your daily time, STOP to opt out, HELP for help.";
}

export function getSettingsRestartMessage(): string {
  return "Let's update your Else settings. What time should Elsy send your daily curiosity quest? Reply with an hour or half-hour like 8am, 8:30am, 6pm, or 6:30pm.";
}
