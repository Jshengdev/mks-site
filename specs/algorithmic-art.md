# Algorithmic Art — Mathematical Legitimacy

## What This Is
Spec for where mathematical/algorithmic systems add genuine beauty to the experience, following the "simulation over animation" and "mathematical legitimacy" taste principles.

## Why This Matters
The portpoo taste profile prioritizes "real systems over arbitrary effects" — Verlet physics, Preetham sky, instanced grass are already in the codebase. This spec identifies where NEW mathematical systems (strange attractors, curl noise, Voronoi, reaction-diffusion) would serve the emotional arc better than hand-tuned animation.

## Acceptance Criteria
- [ ] AC1: At least 5 candidate algorithmic systems are documented with: algorithm name, visual output description, which scroll segment it serves, emotional purpose, source reference (real GitHub repo)
- [ ] AC2: Each candidate has a complexity estimate (LOC, GPU cost) and comparison to current approach
- [ ] AC3: At least 2 candidates have prototype shader code adapted from real repos (not from scratch)
- [ ] AC4: Anti-clustering assessment — each candidate is evaluated for "does this resist AI-average output?"

## Specification
Candidate systems:
1. **Strange Attractors** (Lorenz, Rössler, Chen) — particle trails forming organic shapes. Apply to Sonic Void audio geometry or as a meditation visual.
2. **Curl Noise Flow Fields** — smooth, divergence-free particle advection. Apply to dust motes, fog wisps, petal drift (replace random walk with flow field).
3. **Voronoi Tessellation** — natural cell patterns for terrain texturing, crystal growth, or light caustic patterns.
4. **Reaction-Diffusion** (Gray-Scott) — organic pattern generation for coral growth, surface texturing, or transition effects.
5. **L-Systems** — procedural branching for coral formations, gear trees, or kelp forest structure.
6. **Verlet Cloth Extensions** — already have ClothSolver. Extend to rope bridges, hanging lanterns, prayer flags.
7. **Perlin Worm Paths** — camera path generation using noise-driven exploration rather than hand-authored splines.

All implementations must come from real GitHub repos. No from-scratch GLSL.

## Ralphable vs Human-Taste
- AC1-2: **Human-Taste** (deciding which algorithms serve the emotional arc is creative)
- AC3: **Ralphable** (finding and adapting real repo code is mechanical)
- AC4: **Human-Taste** (evaluating anti-clustering is subjective)

## Dependencies
- Source-research spec (for finding real repos)
- Unified scroll arc (for segment placement)

## Verification
- AC1: Document contains ≥5 algorithm entries with all required fields
- AC2: Each entry has LOC estimate and GPU cost comparison
- AC3: ≥2 .glsl prototype files exist in src/meadow/shaders/prototypes/
- AC4: Each entry has anti-clustering paragraph
