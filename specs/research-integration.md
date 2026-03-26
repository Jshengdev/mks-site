# Research Integration — Techniques & Taste Notes

## What This Is
Plan for integrating 72+ experiment winners from AutoResearch pipeline and 6 key portpoo taste notes into the unified experience.

## Why This Matters
The research pipeline produced 24 documented experiments (12 winner docs, 20+ undocumented above 60/70) and the web extractor captured 949 shaders from 10 sites. The portpoo taste profile defines 8 aesthetic themes with 21 technical principles. This research is sitting unused.

## Acceptance Criteria
- [ ] AC1: A prioritized integration list maps each research winner to a specific scroll segment and subsystem
- [ ] AC2: Top 5 portpoo taste notes have concrete implementation briefs with target subsystems
- [ ] AC3: AutoResearch winners above 60/70 score are cataloged with integration status (integrated/planned/rejected)
- [ ] AC4: At least 3 techniques from web extractor captures have implementation briefs
- [ ] AC5: Each integration brief includes: source reference, target subsystem, expected emotional impact, implementation complexity estimate

## Specification
### AutoResearch Winners (from /Users/johnnysheng/mks/research/pipeline/)
Best scores by world:
- Ocean Cliff 61/70: DOF v3 (focus=8, range=1.5, bokeh=5.5) + split-tone
- Night Meadow 58/70 (62 potential): 400 fireflies + stars + camera arc at t=0.75
- Ghibli Painterly 56/70: Atmosphere fix (ambient 0.20→0.45) + cel+Kuwahara
- Storm Field 47/70: Rain + volumetric clouds + lightning
- Golden Meadow 45/70: Wave wind + golden hour atmosphere

### Portpoo Taste Notes for MKS
1. **Bioluminescent Effect Stack**: Edge detection → particle mask → simplex displacement → double bloom. Apply to frequency-reactive particles.
2. **Simulation Over Animation**: Verlet physics, not keyframes. Apply to cloth, vegetation, particle drift.
3. **Fog-Proximity Reveal**: Fog obscures, scroll reveals. Apply to content sections and subsystem activation.
4. **Dimensional Crossover**: 2D↔3D boundary effects. Apply to entry page transition, content overlays.
5. **Hand-Drawn Displacement**: Lo-fi, degraded noise textures. Apply to film grain, dithering, shader artifacts.
6. **Destroy-to-Reveal**: Tearing away layers exposes truth. Apply to cursor interaction on hidden score sheets.

### Web Extractor Techniques (from /Users/johnnysheng/mks/research/web-extractor/)
- Active Theory analytical curl noise (3x faster than Perlin)
- Scroll-driven particle lifecycle (particles born/die based on scroll position)
- Immersive Garden wave propagation and dissipation model

## Ralphable vs Human-Taste
- AC1, AC3-4: **Ralphable** (cataloging and mapping existing research to subsystems)
- AC2, AC5: **Human-Taste** (evaluating whether a technique "feels right" for MKS, deciding emotional impact)

## Dependencies
- AutoResearch pipeline at /Users/johnnysheng/mks/research/pipeline/ (external, reference only)
- Web extractor at /Users/johnnysheng/mks/research/web-extractor/ (external, reference only)
- Portpoo taste profile at /Users/johnnysheng/portpoo/resources/taste-profile.md (external, reference only)
- Unified scroll arc design determines which segments receive which techniques

## Verification
- AC1: File exists with ≥10 entries mapping winner → segment → subsystem
- AC2: File contains ≥5 taste note implementation briefs
- AC3: Catalog lists all experiments ≥60/70 with status
- AC4: ≥3 web extractor technique briefs exist
- AC5: Each brief has all 5 required fields
