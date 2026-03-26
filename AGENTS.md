# Operational Guide — MKS Immersive Site

## Build & Setup
```bash
npm install                    # Install deps (three, lenis, postprocessing, react-router-dom)
npx vite build                 # Production build — MUST pass clean before any commit
npx vite --host                # Dev server with network access (for mobile testing)
```

## Test
```bash
npx vite build                 # Primary gate — build must pass (no test framework yet)
npx eslint .                   # Lint check
bash scripts/verify-all.sh     # Ralph back-pressure harness
```

**No unit test framework exists.** Testing is: build passes + lint passes + visual verification. Ralph specs should define testable criteria that can be checked via build + grep + static analysis.

## Codebase Structure
- **99 JS files** in `src/meadow/` — the Three.js engine (vanilla, class-based)
- **97 GLSL shaders** in `src/meadow/shaders/` — all adapted from real GitHub repos
- **17 environment configs** in `src/environments/` — pure data objects, no Three.js imports
- **988-line WorldEngine.js** — config-driven orchestrator, reads environment configs, wires subsystems
- **AtmosphereController.js** — 5-keyframe scroll-driven interpolation (38 params each keyframe)
- **PostProcessingStack.js** — EffectComposer with 12 effects (bloom, CA, vignette, grain, SSAO, DOF, fog, color grade, motion blur, kuwahara, god ray, lens flare)
- **1.36MB JS bundle** — needs code splitting before production

## Key Patterns
- **Config-driven worlds:** Each environment is a pure data object in `src/environments/`. WorldEngine reads it.
- **Atmosphere interpolation:** AtmosphereController overwrites ALL subsystem values every frame from keyframe lerp. DevTuner freeze mode pauses this.
- **No per-frame allocations:** Module-level reusable `_tempVec3` etc. Never `new THREE.Vector3()` in tick/update.
- **Shader code is stolen:** All GLSL adapted from real repos (al-ro, Nitash-Biswas, Alex-DG, daniel-ilett). No from-scratch shaders.
- **Music-as-router:** MiniPlayer track selection = world navigation. URLs are secondary.
- **Opacity only:** Nothing pops in. Surfaces via opacity transitions. No scale/bounce/slide.

## Design Rules (Non-Negotiable)
- 85% dark / 15% light ratio
- `--void: #0a0a0a` (never `#000`), `--teal` = audience, `--amber` = artist, `--red-felt` used ONCE
- `prefers-reduced-motion` fallback on ALL animations
- Film grain + vignette always present
- No AI-generated images of the artist. Real photography only.

## What's Ralphable vs. Human-Taste
| Ralphable (Claude autonomous) | Human-taste (needs review) |
|------|------|
| Dead code removal | Atmosphere keyframe values |
| Allocation optimization | Post-FX intensity curves |
| Dispose/cleanup audit | Visual feature design |
| Build verification | Content layout |
| Constant extraction | Audio integration |
| Method extraction | Color grading decisions |
| Bundle size optimization | Camera path tuning |

## Operational Notes
- Branch: `main` (was `feature/environment-worlds`, now merged)
- Build: `npx vite build` — 1.43s, passes clean
- Entry points: WorldEngine.js (architecture), AtmosphereController.js (emotional arc), CLAUDE.md (full state)
- CLAUDE.md has 30+ learnings from prior sessions — read before touching anything
