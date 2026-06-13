# Else Design System

**Version:** 0.1  
**Status:** Draft  
**File:** `docs/design.md`  
**Owner:** Else / Coaur  

Else should feel like a tiny light in the room: warm enough for a child to trust, intelligent enough for a parent to respect, and magical enough to make ordinary life feel worth noticing.

This design system turns the Else constitution into product language: visual design, interaction design, mascot behavior, brand expression, and implementation standards.

---

## 1. North Star: Think Else

### Product feeling
Else is a **family curiosity companion**. It helps parents and children slow down, look closer, ask better questions, and turn real life into growth.

The product should feel like:

- a bedtime question that opens a child’s mind;
- a small quest that pulls the family into the real world;
- a gentle guide that helps parents become better conversation partners;
- a magical object that belongs in the home, not just on the phone.

### Design mantra
**Magical enough for children. Intelligent enough for parents. Calm enough for family life.**

Else must never feel like a noisy kids game, a tutoring dashboard, a generic AI chatbot, or a dopamine loop. It should feel like a premium family ritual: tender, thoughtful, and alive.

### Core product test
Every design decision should answer:

> Does this help create a more thoughtful human?

If a screen, animation, badge, illustration, or message does not support curiosity, conversation, observation, agency, courage, or family connection, it should be simplified or removed.

### What Else optimizes for
Else optimizes for:

- meaningful conversations;
- better questions;
- real-world observation;
- family connection;
- reflection;
- confidence;
- intellectual and moral courage;
- memories worth keeping.

Else does **not** optimize for:

- endless engagement;
- addictive streaks;
- noisy gamification;
- passive content consumption;
- making children dependent on AI for answers.

---

## 2. Brand Personality: Warm Wonder, Serious Soul

Else has a rare balance: it is cute, but not shallow; magical, but not childish; modern, but not cold.

### Personality attributes

| Attribute | Meaning in design | Avoid |
| --- | --- | --- |
| Warm | Soft light, friendly copy, rounded surfaces | Beige blandness, generic wellness UI |
| Curious | Questions, prompts, small surprises | Random facts, trivia overload |
| Nurturing | Gentle guidance, emotional safety | Over-parenting, moralizing |
| Thoughtful | Spacious layouts, clear hierarchy | Clutter, visual sugar, toy-like chaos |
| Brave | Encourages asking, trying, noticing truth | Empty positivity, fake cheerfulness |
| Magical | Stars, glow, night gardens, wonder | Fantasy clichés, unicorn overload |
| Modern | Clean components, elegant typography | Corporate SaaS sterility |

### Emotional target
When a parent opens Else, they should feel:

> “This is beautiful, safe, and wise. I want this in my family culture.”

When a child sees Elsy, they should feel:

> “That little spark is my friend. I want to explore with them.”

### Visual tension to preserve
Else should sit between these worlds:

- **storybook** and **operating system**;
- **night garden** and **modern mobile app**;
- **toy-like softness** and **grown-up trust**;
- **magical companion** and **real-world learning guide**.

That tension is the brand. Do not flatten Else into either a baby app or a serious school product.

---

## 3. Logo, Brand Mark, and Naming

### Wordmark
The Else wordmark should use a high-contrast serif with warmth and literary presence. It should feel like a children’s classic that has been quietly upgraded for the AI age.

Recommended direction:

- Primary wordmark: `Else`
- Typeface direction: Playfair Display, Cormorant Garamond, or a custom high-contrast serif
- Letterform feeling: elegant, soft, slightly enchanted
- Preferred casing: Title case, never all caps for the main logo

### Tagline system
Primary tagline:

> Curiosity changes everything.

Product ritual line:

> One question. One quest. One magical moment at a time.

Strategic line:

> Raising thoughtful kids in the AI age.

Internal rallying line:

> Think Else.

Use the tagline based on context:

- Marketing hero: “Curiosity changes everything.”
- Parent-facing product: “Raising thoughtful kids in the AI age.”
- Quest completion / memory: “One question. One quest. One magical moment at a time.”
- Internal docs / philosophy: “Think Else.”

### Brand marks
Else needs four marks:

1. **Primary wordmark** — for website, app header, pitch decks.
2. **Elsy badge** — circular mascot mark for app icon, social avatar, loading states.
3. **Spark mark** — tiny star/spark for buttons, dividers, achievements, and favicon.
4. **Companion lockup** — Elsy + Else wordmark for onboarding and brand moments.

### Clearspace
Give the wordmark generous space. Minimum clearspace equals the height of the uppercase `E` around all sides. The mascot should never crowd the logo.

### Logo misuse
Do not:

- add heavy outlines to the wordmark;
- place the logo on busy illustration without a soft scrim;
- use rainbow gradients on the wordmark;
- make the logo bounce, spin, or behave like a game asset;
- let Elsy replace the wordmark in serious parent-trust contexts.

---

## 4. Color and Light System

Else’s signature is **starlight against a calm night sky**. The color system should carry both wonder and trust.

### Core palette

| Token | Hex | Use |
| --- | --- | --- |
| `midnight-950` | `#08071E` | Signature dark background |
| `midnight-900` | `#0E0A2B` | App shell, hero background |
| `ink-800` | `#1A1333` | Deep text, dark cards |
| `plum-700` | `#2B1747` | Elevated dark surfaces |
| `orchid-500` | `#7B5CFF` | Primary CTA, magic accents |
| `violet-300` | `#C9A7FF` | Soft outlines, secondary glow |
| `blush-400` | `#FF7EB6` | Love, warmth, cheeks, caring moments |
| `peach-300` | `#FFC089` | Human warmth, quest highlights |
| `star-300` | `#FFE08A` | Stars, completion, Elsy’s held star |
| `cream-50` | `#FFF7E8` | Light mode background, cards |
| `mint-200` | `#BFF3E7` | Calm, growth, success states |
| `rose-100` | `#FFE5EF` | Gentle family moments |

### Color roles

- **Primary action:** `orchid-500`
- **Primary background:** `midnight-950` or `cream-50`
- **Magic highlight:** `star-300`
- **Emotional warmth:** `blush-400` and `peach-300`
- **Growth / success:** `mint-200`
- **Premium text:** `ink-800`

### Gradients

Use gradients sparingly. They should feel like light, not decoration.

```css
--gradient-night-wonder: radial-gradient(circle at 50% 20%, #2B1747 0%, #0E0A2B 42%, #08071E 100%);
--gradient-starlight: linear-gradient(135deg, #FFE08A 0%, #FFC089 48%, #FF7EB6 100%);
--gradient-quest-aura: linear-gradient(135deg, #7B5CFF 0%, #C9A7FF 48%, #FF7EB6 100%);
--gradient-soft-morning: linear-gradient(180deg, #FFF7E8 0%, #FFE5EF 52%, #F3E8FF 100%);
```

### Usage ratio

For a mature Else screen:

- 60% calm background;
- 25% warm cards and readable content;
- 10% magical accent;
- 5% sparkle, glow, or delight.

The temptation will be to make everything magical. Resist it. Magic only works when it has silence around it.

### Accessibility

All body text must pass WCAG AA contrast. Avoid placing small white text directly over bright gradients or illustrations. When using illustrated backgrounds, add a translucent surface or blur layer behind text.

---

## 5. Typography, Icons, and Visual Texture

### Typography stack

Else needs a literary headline face and a highly readable body face.

```css
--font-display: "Playfair Display", "Cormorant Garamond", Georgia, serif;
--font-body: "Inter", "SF Pro Text", system-ui, sans-serif;
--font-hand: "Caveat", "Reenie Beanie", cursive;
```

### Type roles

| Role | Font | Weight | Feeling |
| --- | --- | --- | --- |
| Hero headline | Display serif | 600–700 | Literary, inspiring |
| Section title | Display serif | 600 | Warm authority |
| Quest title | Display serif or body semibold | 600 | Important but approachable |
| Body | Inter | 400–500 | Clear, modern, human |
| Labels | Inter | 600–700 with letter spacing | Small, confident |
| Handwritten accent | Hand font | 400 | Rare emotional moments only |

### Type scale

```css
--text-hero: 56px;
--text-h1: 40px;
--text-h2: 28px;
--text-h3: 22px;
--text-body: 16px;
--text-small: 14px;
--text-caption: 12px;
--line-tight: 1.08;
--line-normal: 1.45;
--line-relaxed: 1.6;
```

On mobile, prioritize readability over drama. A parent may be using Else while making breakfast, brushing a child’s hair, or standing outside during a quest.

### Icon style

Icons should be:

- rounded line icons;
- emotionally legible;
- simple enough for children;
- polished enough for parents;
- paired with labels in navigation.

Core icon set:

- chat bubble — conversations;
- star — quests and completion;
- open book — real-world learning;
- heart — family connection;
- brain/spark — memory and growth;
- leaf — observation and nature;
- compass — exploration;
- moon — imagination;
- shield/hand — bravery and values.

### Visual texture

Use subtle textures:

- star dust;
- soft grain;
- botanical silhouettes;
- bokeh light;
- faint dotted quest trails;
- warm edge glows.

Avoid busy texture behind text. Texture should create atmosphere, not reduce clarity.

---

## 6. Mascot System: Elsy

Elsy is Else’s emotional center. Elsy is not a decorative character. Elsy is a tiny spark of wonder: warm, wise, playful, and brave.

### Mascot role
Elsy should make the product feel alive without making it feel unserious.

Elsy is:

- a guide, not a teacher;
- a spark, not a pet;
- a companion, not a cartoon clown;
- a confidence-builder, not a reward dispenser;
- a bridge between child wonder and parent trust.

### Core silhouette
Elsy’s silhouette must be instantly recognizable:

- flame/spark body;
- large rounded head/body form;
- crescent curl at the top;
- tiny arms and legs;
- glossy oval eyes;
- small smile;
- warm blush;
- glowing star held close to the chest.

The held star is important. It says: “I carry wonder carefully.”

### Irresistibly cute formula
Use this formula in all generated or illustrated versions:

- head/body mass takes about 70% of the character;
- eyes sit slightly below the vertical midpoint of the face;
- eyes are glossy, dark, oval, and widely spaced;
- mouth is tiny, simple, and low-pressure;
- cheeks are soft blush circles, never sharp makeup;
- limbs are short, rounded, and plush-like;
- body has translucent glow, like a living night-light;
- pose is slightly inward or reaching outward, never aggressive;
- star creates warm underlighting on the face and hands.

### Elsy personality states

| State | Use | Expression |
| --- | --- | --- |
| Curious | New question, discovery | Wide eyes, slight lean, one hand raised |
| Proud | Quest completion | Closed smile, star brighter, tiny bounce |
| Thinking | Reflection prompt | Hand near mouth, eyes up, small sparkle |
| Brave | Hard question, values moment | Upright pose, steady eyes, warm glow |
| Comforting | Child uncertainty | Soft smile, star held close, slower motion |
| Surprised | New discovery | Open mouth, lifted curl, widened eyes |
| Sleepy | Evening reflection | Half-closed eyes, dimmer glow |
| Celebrating | Milestone | Tiny hop, star twinkle, no confetti explosion |

### Elsy voice
Elsy speaks like a thoughtful friend, not a teacher and not a baby.

Good Elsy copy:

- “Let’s look closer.”
- “What do you notice first?”
- “That’s a brave question.”
- “Want to try a tiny quest?”
- “I wonder what your family will discover.”
- “You don’t have to know yet. We can explore.”

Bad Elsy copy:

- “Correct! You earned 50 points!”
- “Oops, that’s wrong.”
- “Complete today’s learning objective.”
- “Great job, superstar genius!”
- “Ask me anything and I’ll give you the answer.”

### Mascot usage rules

Use Elsy:

- in onboarding;
- on the home screen;
- during quest start and completion;
- as a gentle chat companion;
- in family memory moments;
- in empty states;
- as a small emotional signal in navigation.

Do not overuse Elsy:

- on dense parent settings screens;
- inside every card;
- as a substitute for clear UI;
- in serious safety, privacy, or billing flows;
- as a mascot that constantly interrupts.

Elsy should feel precious. Scarcity makes the mascot more loved.

---

## 7. Illustration and Worldbuilding

Else’s world should make ordinary life feel enchanted. The magic is not escape. The magic is attention.

### Core world
Elsy lives in the threshold between home and wonder:

- night garden;
- child’s bedroom window;
- backyard under stars;
- kitchen table conversation;
- library corner;
- forest path;
- tide pool;
- museum hall;
- city sidewalk after rain;
- car ride with questions;
- moonlit balcony;
- family walk.

Every environment should suggest that curiosity can happen anywhere.

### Illustration principles

1. **Real-world first.** The quest should point back to life outside the screen.
2. **Soft cinematic light.** Use glow, dusk, morning, lamplight, and starlight.
3. **Child-scale wonder.** Show ants, leaves, shadows, clouds, puddles, books, rocks, stars.
4. **Emotional intimacy.** Prefer close scenes over epic fantasy landscapes.
5. **Atmospheric depth.** Use foreground silhouettes, soft blur, and layered light.
6. **No plastic toy world.** Avoid overly glossy 3D toy aesthetics.

### Art direction prompt
Use this as the canonical image prompt style:

> A warm magical-realism illustration for a premium family curiosity app. A small glowing spark mascot named Elsy, soft plush flame silhouette, large glossy oval eyes, tiny rounded limbs, gentle blush, holding a glowing star. Cinematic starlight, deep midnight violet background, peach and golden glow, subtle botanical silhouettes, cozy real-world setting, emotionally warm, modern storybook quality, cute but not childish, polished and trustworthy, soft grain, high detail, no clutter.

### Quest illustration categories

| Category | Visual motif | Example |
| --- | --- | --- |
| Observation | magnifying glass, leaf, ant trail | “Ant Architects” |
| Imagination | moon, shadow, cloud, story door | “What makes the moon glow?” |
| Communication | whale, bird, drum, facial expression | “How do whales talk?” |
| Courage | bridge, lantern, small step, tall tree | “What makes someone brave?” |
| Care | heart, hands, family table, garden | “How do we show someone we noticed?” |
| Memory | photo, star jar, bedtime reflection | “What did we learn today?” |

### Illustration misuse
Do not use:

- random fantasy castles;
- generic AI robot imagery;
- harsh neon cyberpunk;
- school worksheet clip art;
- chaotic game worlds;
- overstimulating cartoon scenes;
- children staring passively at screens.

Else should make screens feel like portals back into reality.

---

## 8. Product UI, Components, and Interaction Patterns

Else’s interface should be simple enough for a busy parent, inviting enough for a child, and structured enough for long-term family growth.

### App architecture
Primary navigation:

1. **Home** — today’s invitation, Elsy, family status.
2. **Quests** — real-world curiosity missions.
3. **Chat** — ask Elsy, continue a family conversation.
4. **Family** — children, parent preferences, routines.
5. **Memories** — completed quests, reflections, growth moments.

### Core flow
Every quest should follow this pattern:

1. **Spark** — a beautiful question or image.
2. **Wonder** — why this is interesting.
3. **Quest** — a small real-world action.
4. **Talk** — parent-child conversation prompts.
5. **Capture** — optional photo, note, or voice memory.
6. **Reflect** — “What changed in how you see this?”
7. **Memory** — save the moment as part of the family’s curiosity history.

### Components

#### `QuestCard`
A quest card should include:

- category chip;
- image or illustration;
- title;
- one-sentence wonder hook;
- mission;
- think-about prompt;
- estimated time;
- parent effort level;
- primary CTA.

#### `ElsyBubble`
Use for small messages from Elsy.

Rules:

- maximum 1–2 sentences;
- one idea per bubble;
- no walls of text;
- no fake urgency;
- warm, specific, and question-led.

#### `FamilyProfileCard`
Shows child profile with care and dignity.

Include:

- name;
- age;
- curiosity archetype;
- recent quests;
- skills gently tracked;
- favorite topics;
- parent notes.

Avoid ranking children or creating sibling comparison.

#### `MemoryMoment`
A saved reflection card.

Include:

- date;
- quest title;
- child quote;
- parent note;
- optional image;
- growth tag;
- Elsy micro-reaction.

This should feel like a family keepsake, not an analytics event.

#### Buttons

Primary button:

- rounded pill;
- orchid-to-blush or orchid solid;
- soft glow only on important actions;
- label starts with a verb.

Examples:

- “Start today’s quest”
- “Ask Elsy”
- “Save this moment”
- “Try a tiny quest”

Secondary button:

- cream or transparent surface;
- subtle border;
- clear text.

Destructive or sensitive actions should be plain, serious, and mascot-free.

### Layout and spacing

Use an 8px base grid.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--radius-sm: 10px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-xl: 32px;
--radius-pill: 999px;
```

### Surfaces and elevation

```css
--surface-night: rgba(14, 10, 43, 0.84);
--surface-card-dark: rgba(43, 23, 71, 0.72);
--surface-card-light: rgba(255, 247, 232, 0.88);
--border-magic: rgba(201, 167, 255, 0.32);
--shadow-soft: 0 12px 40px rgba(8, 7, 30, 0.18);
--shadow-glow: 0 0 32px rgba(255, 224, 138, 0.32);
```

Use blur and glass carefully. Parent-trust screens should be more solid. Child-facing wonder screens can be more atmospheric.

---

## 9. Motion, Voice, Accessibility, and Quality Bar

### Motion principles
Else motion should feel like breathing, twinkling, noticing, and gently becoming alive.

Use motion for:

- Elsy blinking;
- star pulsing softly;
- quest card entering like a discovered object;
- completion glow;
- tiny bounce when a child finishes a quest;
- page transitions that feel calm and continuous.

Avoid:

- aggressive confetti;
- constant bouncing;
- casino-like reward animations;
- streak pressure;
- fast flashy transitions;
- motion that competes with reading.

### Timing

```css
--motion-fast: 120ms;
--motion-base: 220ms;
--motion-slow: 420ms;
--ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
--ease-bounce-tiny: cubic-bezier(0.34, 1.56, 0.64, 1);
```

Elsy should animate at a slower emotional rhythm than normal UI. The mascot is alive, not hyperactive.

### Voice and tone
Else copy should be clear, concise, and human.

Use:

- short sentences;
- concrete invitations;
- emotionally safe questions;
- gentle humor;
- respect for parents’ time;
- respect for children’s intelligence.

Avoid:

- “educator voice”;
- manipulative urgency;
- generic praise;
- overexplaining;
- AI hype;
- baby talk;
- guilt toward parents.

### Copy examples

Good:

- “A tiny quest for your next walk.”
- “Ask your child: what changed when you looked closer?”
- “You noticed something most people miss.”
- “This is a good question to carry into dinner.”
- “No need to finish perfectly. Just begin.”

Bad:

- “Maximize your child’s learning outcomes today.”
- “You’re falling behind on your streak.”
- “Correct answer unlocked!”
- “Your child has achieved Level 7 cognition.”
- “AI-powered personalized education revolution.”

### Accessibility standards

Else is for families, which means it must be usable in messy real life.

Requirements:

- WCAG AA contrast for all text;
- Dynamic Type / font scaling support;
- Reduce Motion mode;
- large tap targets, minimum 44px;
- clear labels under icons;
- no color-only status indicators;
- captions or transcripts for audio;
- parent controls that are easy to find;
- child-safe privacy defaults.

### Final design QA checklist
Before shipping any Else screen, ask:

- Does this invite a real-world action or meaningful conversation?
- Does it feel magical without becoming childish?
- Would a thoughtful parent trust this?
- Would a child want to return to Elsy?
- Is the screen calm enough to use at bedtime?
- Is the hierarchy obvious in three seconds?
- Is Elsy used with restraint and emotional purpose?
- Are rewards soft rather than addictive?
- Does the design protect curiosity instead of replacing it with answers?
- Does this help create a more thoughtful human?

A screen passes the Else quality bar when it feels like this:

> A child wants to explore. A parent feels supported. The family closes the app and looks more closely at the world.
