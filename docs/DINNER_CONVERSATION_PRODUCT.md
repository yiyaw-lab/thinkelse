# Dinner Conversation Product Contract

Dinner questions are not smaller quests. They are reply-free family conversation
starters that should feel worth asking at the table.

## Product Bar

- First answer in 10 seconds: the youngest child should be able to respond from
  lived experience without setup, research, or abstract scenario design.
- Human stakes: fairness, truth, trust, kindness, disagreement, courage,
  responsibility, or changed minds.
- Concrete table anchors: last bite, turn, seat, family rule, friend moment,
  school story, game they already know, apology, promise, or shared place.
- Parent lift: the parent move should run a better conversation, not just say
  "share your ideas."
- No mission energy: no task list, homework, reporting ask, or look-it-up
  prompt.

## Playbook Frames

`lib/agents/dinner-playbook.ts` preselects one frame before model generation:

| Frame | Use when | Avoids |
|---|---|---|
| Table Fairness | Rules, turns, sharing, games, siblings, or fairness | Abstract game/resource design |
| Kind Truth-Seeking | Memory, mistakes, evidence, or changing minds | Blame or interrogation |
| Trust the Claim | Claims, rumors, tools, sources, signs, or packages | Adult misinformation research |
| Listening in Disagreement | Friends, siblings, different views, or argument repair | Debate-to-win energy |
| Kind Courage | Kindness, popularity, apologies, promises, or privacy | Forced confession or virtue performance |
| Future Ripple | Technology, climate, community, or shared-place choices | Global-problem burden |

The frame is an invisible design constraint. The SMS should not name the
playbook, research method, or frame.

## Verification

Run `npm run check:dinner-playbook` to prove:

- frame selection responds to family/context signals
- recent table-fairness dinners do not immediately repeat the same frame
- abstract game/player/resource failures recover to concrete fallbacks
- world-context cards steer toward an appropriate dinner frame
- dinner generation injects the playbook guidance
