export const questFixtures = [
  {
    id: "quest-good-backpack-clue",
    expected: "pass",
    note: "Concrete, answerable, evidence-oriented, parent-mediated.",
    output: {
      title: "Backpack Clue",
      whyThis:
        "This gives Yivin a tiny evidence habit you can practice together before deciding what to trust.",
      prompt:
        "Yivin, if your backpack zipper got stuck, what clue would tell you whether to pull, wiggle, or stop?",
      mission:
        "Try the zipper once, pause, then check one clue before choosing your next move.",
      followUp: "What would make you change your first idea?",
      skill: "evidence-seeking",
    },
  },
  {
    id: "quest-good-fair-rule",
    expected: "pass",
    note: "Turns fairness into a small real-world test.",
    output: {
      title: "Fair Referee",
      whyThis:
        "This turns fairness into something your family can test together instead of only talking about.",
      prompt:
        "Yivin, if two people want the same turn, what rule would feel fair even if you waited?",
      mission:
        "Pick one shared turn today and try two possible rules. Ask who each rule helps most.",
      followUp: "What would make you change the rule after trying it?",
      skill: "values-reasoning",
    },
  },
  {
    id: "quest-bad-shadow-patterns",
    expected: "fail",
    note: "Regression fixture from weak morning quests: passive, repetitive shadow noticing.",
    output: {
      title: "Shadow Play Patterns",
      whyThis: "This helps your child notice patterns outside.",
      prompt:
        "Yivin, what shapes do shadows make on our front step right now, and how do they change as the sun moves?",
      mission:
        "At the front step this morning, watch and name the shapes shadows make on the ground.",
      followUp: "What part of watching shadows did you plan to look at first?",
      skill: "observation",
    },
  },
  {
    id: "quest-bad-generic-look-around",
    expected: "fail",
    note: "Looks valid but feels like an ignorable activity-book prompt.",
    output: {
      title: "Nature Explorer",
      whyThis: "This helps your child explore nature.",
      prompt: "What do you notice around your home today?",
      mission:
        "Look around the house and talk about anything interesting that you find.",
      followUp: "What did you learn?",
      skill: "observation",
    },
  },
  {
    id: "quest-bad-shadow-laundered-metadata",
    expected: "fail",
    note: "Bad core quest should not pass because whyThis/skill contain evidence language.",
    output: {
      title: "Shadow Evidence",
      whyThis:
        "This helps your family test evidence together before trusting the first idea.",
      prompt:
        "Yivin, what shapes do shadows make on our front step right now, and how do they change as the sun moves?",
      mission:
        "At the front step this morning, watch and name the shapes shadows make on the ground.",
      followUp: "What part of watching shadows did you plan to look at first?",
      skill: "evidence-seeking",
    },
  },
];

export const dinnerFixtures = [
  {
    id: "dinner-good-last-bite",
    expected: "pass",
    note: "Concrete table-ready fairness question.",
    output: {
      question:
        "If two people wanted the same last bite tonight, what fair rule would you try first?",
      whyThis:
        "This turns a tiny table moment into practice hearing reasons and thinking else together.",
      parentMove:
        "Ask each person for one reason, then invite the opposite view.",
      followUp:
        "What would make the rule feel fair even if someone did not get their first choice?",
      skill: "values-reasoning",
    },
  },
  {
    id: "dinner-good-memory-disagreement",
    expected: "pass",
    note: "Answerable epistemic-honesty dinner prompt.",
    output: {
      question:
        "If two people remember the same moment differently, how could we check kindly what probably happened?",
      whyThis:
        "This helps your family practice truth-seeking without making anyone feel small.",
      parentMove:
        "Start with a tiny example from today and ask what evidence would help.",
      followUp: "What would make you change your mind?",
      skill: "epistemic-honesty",
    },
  },
  {
    id: "dinner-bad-evening-air",
    expected: "fail",
    note: "Regression fixture from weak dinner prompts: atmosphere without human stakes.",
    output: {
      question:
        "What patterns do you notice in how the evening air changes as the sun sets on a summer night?",
      whyThis: "This helps everyone notice the world together.",
      parentMove:
        "Name one detail you hear, see, or feel, then ask what makes you say that.",
      followUp:
        "If you could change one thing about tonight's breeze or light, what would you try and why?",
      skill: "observation",
    },
  },
  {
    id: "dinner-bad-abstract-game-resource",
    expected: "fail",
    note: "Regression fixture from abstract, hard-to-answer dinner prompts.",
    output: {
      question:
        "If you designed a game where players had to choose between sharing a resource or keeping it all to themselves, what rules would make sharing feel fair to everyone?",
      whyThis: "This helps your family think about fairness together.",
      parentMove:
        "Ask what makes you say that and invite another family member to add their ideas.",
      followUp:
        "What could happen in the game if someone changed the sharing rules halfway through-how would players react?",
      skill: "values-reasoning",
    },
  },
  {
    id: "dinner-bad-abstract-tonight-laundered",
    expected: "fail",
    note: "Abstract game/resource framing should not pass because it adds tonight/today anchors.",
    output: {
      question:
        "Tonight, if you designed a game where players had to share one resource, what rules would make everyone feel it was fair?",
      whyThis:
        "This helps your family think about fairness together at the table.",
      parentMove:
        "Start with one example from tonight, then ask each person for a reason.",
      followUp:
        "What would make you change your mind about the sharing rule today?",
      skill: "values-reasoning",
    },
  },
];
