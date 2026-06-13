export type DemoMessage = {
  id: string;
  from: "user" | "elsy";
  text: string;
};

export type DemoTimestamp = {
  id: string;
  type: "timestamp";
  text: string;
};

export type DemoItem = DemoMessage | DemoTimestamp;

export function isTimestamp(item: DemoItem): item is DemoTimestamp {
  return "type" in item && item.type === "timestamp";
}

export const QUEST_NARRATIVE = [
  {
    headline: "Text HELLO to begin.",
    body: "No app to download. No kid account. Elsy lives in the messages app you already use.",
    messages: [
      { id: "t1", type: "timestamp" as const, text: "Today 8:14 AM" },
      { id: "1", from: "user" as const, text: "HELLO" },
      {
        id: "2",
        from: "elsy" as const,
        text: "Welcome to Else! I'm Elsy — tell me about your curious explorer and we'll send the first quest tomorrow.",
      },
    ],
  },
  {
    headline: "Else sends a beautiful question each morning.",
    body: "A tiny quest arrives by text — a question worth sitting with, plus a real-world mission for your child.",
    messages: [
      { id: "t1", type: "timestamp" as const, text: "Today 8:14 AM" },
      { id: "1", from: "user" as const, text: "HELLO" },
      {
        id: "2",
        from: "elsy" as const,
        text: "Welcome to Else! I'm Elsy — tell me about your curious explorer and we'll send the first quest tomorrow.",
      },
      { id: "t2", type: "timestamp" as const, text: "Today 8:00 AM" },
      {
        id: "3",
        from: "elsy" as const,
        text: "Good morning! Today's quest: The Shadow Detective.\n\nWhy do shadows change shape throughout the day?",
      },
    ],
  },
  {
    headline: "Your child explores the real world.",
    body: "Notice, sketch, listen, try. Quests are short rituals between school and dinner — not more screen time.",
    messages: [
      { id: "t1", type: "timestamp" as const, text: "Today 8:14 AM" },
      { id: "1", from: "user" as const, text: "HELLO" },
      {
        id: "2",
        from: "elsy" as const,
        text: "Welcome to Else! I'm Elsy — tell me about your curious explorer and we'll send the first quest tomorrow.",
      },
      { id: "t2", type: "timestamp" as const, text: "Today 8:00 AM" },
      {
        id: "3",
        from: "elsy" as const,
        text: "Good morning! Today's quest: The Shadow Detective.\n\nWhy do shadows change shape throughout the day?",
      },
      {
        id: "4",
        from: "elsy" as const,
        text: "Try this: trace your shadow with chalk at three different times today.",
      },
    ],
  },
  {
    headline: "You text back what they noticed.",
    body: "You're in the loop. Relay their thinking and Elsy meets them with warmth, not quizzes or streaks.",
    messages: [
      { id: "t1", type: "timestamp" as const, text: "Today 8:14 AM" },
      { id: "1", from: "user" as const, text: "HELLO" },
      {
        id: "2",
        from: "elsy" as const,
        text: "Welcome to Else! I'm Elsy — tell me about your curious explorer and we'll send the first quest tomorrow.",
      },
      { id: "t2", type: "timestamp" as const, text: "Today 8:00 AM" },
      {
        id: "3",
        from: "elsy" as const,
        text: "Good morning! Today's quest: The Shadow Detective.\n\nWhy do shadows change shape throughout the day?",
      },
      {
        id: "4",
        from: "elsy" as const,
        text: "Try this: trace your shadow with chalk at three different times today.",
      },
      { id: "t3", type: "timestamp" as const, text: "Today 6:42 PM" },
      {
        id: "5",
        from: "user" as const,
        text: "Mira noticed her shadow was longest before dinner.",
      },
    ],
  },
  {
    headline: "Elsy stretches the thinking one level deeper.",
    body: "A gentle follow-up turns a moment of noticing into a conversation that lasts through dinner.",
    messages: [
      { id: "t1", type: "timestamp" as const, text: "Today 8:14 AM" },
      { id: "1", from: "user" as const, text: "HELLO" },
      {
        id: "2",
        from: "elsy" as const,
        text: "Welcome to Else! I'm Elsy — tell me about your curious explorer and we'll send the first quest tomorrow.",
      },
      { id: "t2", type: "timestamp" as const, text: "Today 8:00 AM" },
      {
        id: "3",
        from: "elsy" as const,
        text: "Good morning! Today's quest: The Shadow Detective.\n\nWhy do shadows change shape throughout the day?",
      },
      {
        id: "4",
        from: "elsy" as const,
        text: "Try this: trace your shadow with chalk at three different times today.",
      },
      { id: "t3", type: "timestamp" as const, text: "Today 6:42 PM" },
      {
        id: "5",
        from: "user" as const,
        text: "Mira noticed her shadow was longest before dinner.",
      },
      {
        id: "6",
        from: "elsy" as const,
        text: "Sharp noticing. Ask her: where do shadows go when clouds cover the sky?",
      },
    ],
  },
] as const;
