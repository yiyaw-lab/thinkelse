---
name: premium-3d-character-design
description: Produces premium 3D mascot and character design direction using a Pixar/Apple-quality pipeline. Use when designing Elsy, moon jelly mascots, brand characters, 3D character prototypes, Blender/Nomad/Spline/Figma workflows, GLB assets, R3F character scenes, or when the user asks for 8/10, 10/10, Pixar, Apple, irresistible, adorable, premium, mascot, motion, or character polish.
---

# Premium 3D Character Design

## Principle

Do not try to reach premium character quality by stacking ad hoc Three.js primitives. Treat the work as character design first, asset production second, web rendering third.

The default goal is a character that passes these gates:

- **Silhouette**: readable at thumbnail size, emotionally distinct, not a generic primitive.
- **Appeal**: oversized expressive features, soft asymmetry, clear proportions, no uncanny details.
- **Material**: restrained, tactile, luminous, with controlled highlights and no noisy effects.
- **Expression**: eyes and mouth are always readable; emotion is never buried by transparent surfaces.
- **Motion**: idle includes anticipation, squash, rebound, follow-through, blink timing, and one signature behavior.
- **Performance**: web preview loads reliably and has a reduced-motion path.

## Default Toolchain

Use this stack unless the user asks otherwise:

1. **References**: gather Apple/Pixar/stylized toy/moon jelly references and define 5-7 art direction constraints.
2. **Concept**: use Figma or Spline for composition, face placement, color studies, and motion beats.
3. **Sculpt**: use Nomad Sculpt or Blender for the actual character form.
4. **Production asset**: export optimized `.glb` from Blender.
5. **Web integration**: use `@react-three/fiber`, `@react-three/drei/useGLTF`, and `gltfjsx`.
6. **Expression safety**: if WebGL transparency hides the face, use a deliberate overlay expression rig or separate mesh layer with stable render order.
7. **Motion tuning**: use shape keys, animation clips, or Theatre.js for authored beats; use code only for secondary idle variation.

## Workflow

### 1. Define The Character Brief

Before designing, write a one-paragraph brief:

- Who is the character?
- What should a child feel in the first 2 seconds?
- What is the signature behavior?
- What must be avoided?

For Elsy moon jelly:

> Elsy is a gentle curiosity companion: a moon jelly meets soft vinyl toy. She should feel warm, safe, alive, and quietly brilliant. The signature behavior is a shy hello: notice, inhale, bell squish, cheek glow, smile, tendrils curl.

### 2. Art Direction Gates

Score every pass 1-10 against:

- Silhouette
- Face readability
- Cuteness/appeal
- Material restraint
- Motion liveliness
- Brand fit
- Web reliability

Do not call a pass 10/10 unless all scores are 9+ and the preview works after a clean dev-server restart.

### 3. Design Rules For Elsy

- Keep eyes large, glossy, and always above any translucent shell.
- Use fewer tendrils with clear negative space; avoid rope clusters.
- Bell should feel buoyant and warm, not gray, heavy, or mushroom-like.
- Glow should come from character state, not generic sparkles.
- Prefer a soft front-facing default pose; orbit can reveal depth but should not be required for appeal.
- One expressive beat is better than constant motion.

### 4. Implementation Rules

For prototype-only work:

- Use R3F for body, lighting, depth, and simple motion.
- Use SVG or HTML overlay for face if transparency sorting threatens readability.
- Keep fallback/loading state visible and friendly.
- Test in a fresh browser tab after restarting the dev server.

For production work:

- Create a `.glb` asset and load it with `useGLTF`.
- Convert via `gltfjsx` for typed, editable React components.
- Use Blender shape keys for bell breathing and face/cheek glow.
- Use animation clips for the signature behavior.
- Use compressed assets and measure load/performance.

## Output Template

When reporting a design pass:

```markdown
## Design Verdict
[1-2 sentence honest assessment]

## What Changed
- [High-signal design change]
- [High-signal design change]

## Score
- Silhouette: x/10
- Face readability: x/10
- Motion: x/10
- Material: x/10
- Web reliability: x/10

## Next Jump
[The one next move that most improves quality]
```

