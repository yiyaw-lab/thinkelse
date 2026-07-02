# Elsy Rive Expression Asset

Export the production expression rig here:

- File: `public/rive/elsy-expression.riv`
- Artboard: `ElsyFace`
- State machine: `ElsyExpression`
- Reduced motion state machine: `ReducedMotion`

## State Machine Inputs

- `notice`: trigger
- `hello`: trigger
- `delight`: trigger
- `blink`: trigger
- `isReducedMotion`: boolean
- `curiosity`: number, `0..1`
- `glow`: number, `0..1`

## Animation Beats

- `idle`: tiny asymmetric eye drift and slow cheek warmth.
- `notice`: eyes lift before the bell inhale.
- `hello`: cheeks glow, smile blooms, eyes brighten.
- `blink`: soft eyelid arc, not a scale squash.
- `delight`: brief sparkle and smile overshoot.
- `reducedMotion`: still pose with occasional low-amplitude blink only.

The React preview automatically detects this file. Until it exists, the Blender GLB face remains the source of truth.
