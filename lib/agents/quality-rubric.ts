export type ElsyQualitySurface = "quest" | "dinner" | "interpretation" | "resource";

export type ElsyQualityDimension = {
  id: string;
  label: string;
  guidance: string;
  appliesTo: readonly ElsyQualitySurface[];
};

export const ELSY_QUALITY_DIMENSIONS: readonly ElsyQualityDimension[] = [
  {
    id: "worth-anticipating",
    label: "Worth anticipating",
    guidance:
      "Give the parent a reason to want to try this: a small mystery, tension, surprise, tradeoff, fair rule, or vivid payoff.",
    appliesTo: ["quest", "dinner"],
  },
  {
    id: "concrete",
    label: "Concrete",
    guidance:
      "Anchor the message in a specific nearby object, moment, rule, choice, family situation, or lived example.",
    appliesTo: ["quest", "dinner", "interpretation", "resource"],
  },
  {
    id: "answerable",
    label: "Answerable",
    guidance:
      "The youngest intended child should be able to begin answering quickly without screens, prep, research, or special knowledge.",
    appliesTo: ["quest", "dinner"],
  },
  {
    id: "parent-mediated",
    label: "Parent-mediated",
    guidance:
      "Write for the parent to read, ask, wait, echo, compare, test, or extend the child's thinking.",
    appliesTo: ["quest", "dinner", "interpretation", "resource"],
  },
  {
    id: "personalized",
    label: "Personalized",
    guidance:
      "Use age, interests, prior replies, family learning, successful patterns, avoidances, and preferences when they help.",
    appliesTo: ["quest", "dinner", "interpretation", "resource"],
  },
  {
    id: "epistemically-honest",
    label: "Epistemically honest",
    guidance:
      "Invite evidence, uncertainty, source sense, alternatives, reasons, changed minds, or fair disagreement without pretending certainty.",
    appliesTo: ["quest", "dinner", "interpretation", "resource"],
  },
  {
    id: "age-fit",
    label: "Age-fit",
    guidance:
      "Let younger children answer concretely while giving older children room for reasoning, perspective, and tradeoffs.",
    appliesTo: ["quest", "dinner", "interpretation"],
  },
  {
    id: "family-binding",
    label: "Family-binding",
    guidance:
      "Create a shared moment where the family notices, decides, tests, remembers, repairs, or wonders together.",
    appliesTo: ["quest", "dinner", "interpretation", "resource"],
  },
  {
    id: "non-generic",
    label: "Non-generic",
    guidance:
      "Reject worksheet, activity-book, generic scavenger hunt, chatbot-demo, bland parenting-tip, or formulaic facilitation energy.",
    appliesTo: ["quest", "dinner", "interpretation", "resource"],
  },
  {
    id: "safe-and-humble",
    label: "Safe and humble",
    guidance:
      "Avoid medical, therapeutic, diagnostic, productivity, IQ, guaranteed-development, partisan, violent, fear-based, or adult-coded claims.",
    appliesTo: ["quest", "dinner", "interpretation", "resource"],
  },
];

export function formatRubricGuidance(surface: ElsyQualitySurface): string {
  const dimensions = ELSY_QUALITY_DIMENSIONS.filter((dimension) =>
    dimension.appliesTo.includes(surface),
  );

  return `Canonical Elsy quality rubric - use this as a send bar, not as visible copy:
${dimensions
  .map((dimension) => `- ${dimension.label}: ${dimension.guidance}`)
  .join("\n")}`;
}
