# Elsy 3D Asset Pipeline

Elsy should read as a premium moon-jelly mascot: soft, curious, warm, and safe. The live SVG mascot is the reliable product sketch. The GLB pipeline is the bridge toward an authored 3D character that can reach Pixar/Apple-level material and motion polish.

## Current Source Asset

- Generated asset: `public/models/elsy-moon-jelly.glb`
- Source script: `scripts/blender/generate_elsy_moon_jelly.py`
- Regenerate with: `npm run generate:elsy-model`

The generated GLB is authored through Blender in headless mode. It includes named meshes, named materials, custom art-direction metadata, and animation data for the shy hello beat. Runtime lighting should stay in the app so the asset remains portable.

## Production Upgrade Path

1. Block the character in Nomad Sculpt or Blender.
   - Preserve the simple silhouette: bell, rim, five readable tendrils, large eyes, tiny smile.
   - Sculpt the bell as one soft volume with a scalloped rim, not stacked primitive shells.
   - Keep face geometry on the front plane so the eyes never hide behind transparency.

2. Author materials in Blender.
   - Use a pearlescent shell material with subsurface scattering, clearcoat, and soft roughness variation.
   - Add painted caustic highlights and subtle bioluminescent spots as texture layers.
   - Keep tendril materials warmer at the root and cooler near the tip.

3. Animate core beats before exporting.
   - `idleFloat`: slow vertical drift with tiny yaw and roll.
   - `notice`: eyes lift, bell pauses for anticipation.
   - `shyHello`: bell inhale, cheek glow, smile bloom, right tendril waves hi.
   - `rebound`: bell squash releases, tendrils lag behind by 4-8 frames.
   - `settle`: tendrils overshoot once and return to idle.

4. Export GLB.
   - Use GLB with mesh names preserved.
   - Compress only after the uncompressed asset has passed visual review.
   - Keep animation clips named semantically, not `Action.001`.

5. Integrate in React Three Fiber.
   - Load via `useGLTF("/models/elsy-moon-jelly.glb")`.
   - Drive clip transitions with explicit state names.
   - Keep the SVG mascot available as a fallback for reduced-power or asset-loading failure states.

## Current Web Integration

- Live 3D pass: `components/brand/elsy-jellyfish-3d.tsx`
- SVG fallback: `components/brand/elsy-jellyfish.tsx`
- Sketch route: `app/elsy/page.tsx`

The face is deliberately protected with high render order in the web pass. This is intentional: transparent shell materials should never be allowed to bury the eyes or smile.

Runtime secondary motion uses `maath/easing` damping in `components/brand/elsy-jellyfish-3d.tsx` so body drift and the hello tendril move with inertia and lag instead of raw keyframe snaps.

Rive expression work slots into `components/brand/elsy-rive-expression.tsx`. Export `public/rive/elsy-expression.riv` from Rive with the `ElsyExpression` state machine to let Rive own the eyes, cheeks, smile, blink timing, and expression polish while Blender/R3F keep the 3D body.

## Scoring Gates

Material must be above 8/10 before integration:
- The bell has readable depth, not flat pastel fill.
- Highlights feel pearlescent, not metallic or plastic.
- The rim has soft shadowing and a tactile edge.
- Face readability is preserved under all lighting.

Motion must be above 8/10 before integration:
- The hello beat has anticipation, action, rebound, and settle.
- Tendrils show delayed follow-through rather than synchronized waving.
- Blink timing feels alive but not nervous.
- Reduced-motion mode remains calm and respectful.

## Final Asset Bar

A 10/10 Elsy requires hand-sculpted form, authored materials, and animation polish in a dedicated design tool. The repo generator is a practical source asset and contract, not the final art ceiling.
