---
name: Visual Reference — Flowing Field with Volumetric Clouds
description: User's reference image for Golden Meadow background feel — dense flowing grass like ocean waves, massive cumulus clouds, alive and wind-driven
type: project
---

User shared a reference image (2026-03-14) of what the meadow background should feel like "lowkey":

**What the image shows:**
- Dense green grass field with long blades flowing in wind like ocean waves
- Massive volumetric cumulus/cumulonimbus clouds building up behind the field
- Clean blue sky, clouds dominate but sky breathes
- Everything in motion — wind-driven, alive

**How to apply (adapted to MKS design philosophy):**
- Same flowing grass energy but in midnight-to-golden-hour palette (not midday green)
- Clouds need a REAL volumetric approach — not flat planes, not hemisphere domes (GhibliClouds failed at this)
- Grass should feel denser and more wave-like than current implementation
- The "alive" wind quality is important — grass moves in coordinated swells, not just individual blade sway
- Reference repos for clouds: `takram/three-clouds` (Beer Shadow Maps), volumetric ray-marching

**Also provided:** `github.com/aherbez/glflower` — procedural Bezier flower geometry to replace current cylinder+sphere flowers. ~300 lines of portable geometry math.

**Why:** The current GhibliClouds were stripped because they "very much suck" (flat blobs). This image shows what good clouds look like — volumetric, towering, with real depth and light interaction.
