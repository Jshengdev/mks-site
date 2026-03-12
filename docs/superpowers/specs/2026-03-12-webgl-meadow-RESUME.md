# Resume Prompt — WebGL Meadow Brainstorm

**Copy-paste this to restart the conversation:**

---

I'm building a WebGL meadow site for MKS (Michael Kim Sheng, composer). We completed a full brainstorming session and wrote a design spec. Pick up where we left off.

## Read these files to restore context:

1. **The spec:** `mks-site/docs/superpowers/specs/2026-03-12-webgl-meadow-design.md` — complete design document with architecture, component-to-repo mapping, taste principles, performance tiers
2. **Reference code (14 files):** `mks-site/docs/webgl-reference/` — stolen GLSL shaders and source code from spacejack/terra, al-ro grass, daniel-ilett BotW shader, toon shader
3. **Visual brainstorm mockups:** `.superpowers/brainstorm/227-1773351236/` — HTML mockups from the visual companion session
4. **Taste library:** `/Users/johnnysheng/portpoo/resources/taste-profile.md` and the 10 taste notes referenced in the spec
5. **MKS design docs:** `mks-site/mks-design-philosophy/` (19 docs, especially DESIGN-SYSTEM.md and STYLE-DECISIONS.md)
6. **Existing codebase:** `mks-site/src/` — current React site with FlowerField, MiniPlayer, MoonlightCursor, Overlays

## Where we left off:

The brainstorming skill checklist was at step 6 (write design doc) — the spec is written but needs:
- **Spec review loop** (dispatch spec-document-reviewer subagent)
- **User review gate** (you review the spec file)
- **Then transition to implementation** (invoke writing-plans skill)

## Key decisions already made:

| Decision | Choice |
|----------|--------|
| Scope | Entire site becomes the 3D meadow |
| Camera | Winding S-curve via CatmullRomCurve3 |
| Rendering | 100K+ instanced grass + ~1K stylized flowers + firefly particles |
| Framework | Vanilla Three.js (not R3F) + React DOM overlay |
| Content | HTML overlay synced to scroll/camera |
| Post-processing | All 8: grain, vignette, bloom, fog, god rays, color grading, DOF, CA |
| Aesthetic | BotW golden hour (NOT midnight — departure from original design docs) |
| Architecture | Start single-scene chunked (A), architect for layered render targets (B) |
| Code philosophy | Steal everything from GitHub repos, adapt colors/params only |
| Scroll | Lenis smooth scroll, scrub-based (Scroll as Rhythm principle) |

## GitHub repos to steal from:

- Nitash-Biswas/grass-shader-glsl (instanced grass, 4-layer GLSL wind)
- James-Smyth/three-grass-demo (BotW vertex color wind, cloud shadows)
- spacejack/terra (terrain + grass + fog + world orchestration)
- al-ro grass (ACES tonemapping, iquilez fog, translucent lighting)
- Alex-DG/vite-three-webxr-flowers (firefly shaders, GLTF flower loading)
- Ameobea/three-good-godrays (screen-space godrays)
- pmndrs/postprocessing (all post-fx)
- darkroomengineering/lenis (smooth scroll)
- fireship-io/threejs-scroll-animation-demo (scroll-to-spline)
- daniel-ilett/shaders-botw-cel-shading (toon shading patterns)
- Three.js built-in Sky shader (golden hour atmosphere)

## 10 taste principles governing the build:

Tunnel Not Scroll, Fog Proximity Reveal, Atmospheric Separation, Choreographed Camera Dance, Cinematic Imperfection, Scroll as Rhythm, Generative Calm, Spatial Storytelling, Signal Through Noise, Floaty Contemplativeness

---

**Next step:** Run the spec review, then invoke writing-plans skill to create the implementation plan.
