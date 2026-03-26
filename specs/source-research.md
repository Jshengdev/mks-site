# Source Research — Finding Real Implementations

## What This Is
Process spec for finding, evaluating, and integrating real GitHub source code for new visual techniques. Enforces the "shader code must be stolen from real repos" rule.

## Why This Matters
All current shader code is adapted from real GitHub repos (al-ro, Nitash-Biswas, Alex-DG, daniel-ilett). No from-scratch GLSL. This rule prevents generic AI-generated shaders and ensures mathematical legitimacy. New techniques must follow the same pattern.

## Acceptance Criteria
- [ ] AC1: A source research template exists defining: technique needed, search queries, evaluation criteria (visual quality, license, integration complexity)
- [ ] AC2: Every new shader file includes a header comment citing source repo, author, license, and adaptation notes
- [ ] AC3: A reference registry (docs/shader-sources.md) tracks all borrowed techniques with: repo URL, technique name, files adapted, MKS file that uses it
- [ ] AC4: Evaluation criteria include anti-clustering check — does this technique produce output distinguishable from default AI generation?
- [ ] AC5: At least 3 new source repos are identified for techniques needed in the unified experience (strange attractors, curl noise flow fields, reaction-diffusion)

## Specification
Process:
1. Define technique needed (from algorithmic-art spec or research-integration spec)
2. Search GitHub for real implementations (keywords: technique name + "three.js" or "webgl" or "glsl")
3. Evaluate: Does the code work? Is it licensed permissively? Is the visual output distinctive?
4. Fork/adapt: Copy relevant GLSL, cite source in header comment, adapt uniforms/attributes for MKS
5. Register in docs/shader-sources.md

Current sources:
- al-ro/grass: translucent lighting, iquilez fog, ACES tonemapping
- Nitash-Biswas/grass-shader-glsl: 4-layer wind, billboard rotation
- Alex-DG/vite-three-webxr-flowers: firefly material
- daniel-ilett/toon-shader: 3-band toon lighting
- nimitz/aurora: triNoise2d curtain technique
- GPU Gems 3 Ch.13: radial blur god rays
- Ashima/webgl-noise: simplex noise implementations

## Ralphable vs Human-Taste
- AC1-3: **Ralphable** (template creation, header enforcement, registry maintenance)
- AC4-5: **Human-Taste** (evaluating visual quality, deciding what's distinctive)

## Dependencies
- algorithmic-art spec (defines needed techniques)
- All new shader code depends on this process

## Verification
- AC1: Template file exists at docs/source-research-template.md
- AC2: grep -r "Source:" src/meadow/shaders/ returns entries for all .glsl files
- AC3: docs/shader-sources.md exists with ≥7 entries (current sources)
- AC4: Template includes "anti-clustering" evaluation field
- AC5: ≥3 new repos listed in research template with evaluation notes
