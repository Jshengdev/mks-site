# Scene Synthesis Layers — Design Spec

> **Date:** 2026-03-13
> **Purpose:** Define 19 composable effect layer briefs that translate 73 repo extractions into an actionable toolkit for building MKS cinematic scenes.

---

## Problem

73 repo extractions (1.7MB) contain deep implementation knowledge but are organized by source repo, not by what they achieve visually. An LLM building a scene has to know which extractions to read, what to pull from each, and how effects compose together. There's no intermediate layer between "raw extraction" and "build this scene."

## Solution

19 **layer briefs** — each documenting a single composable visual effect. Each brief describes what the effect looks like, what parameters control it, how it works, and what it pairs with. To build a scene, the LLM combines multiple briefs.

## Design Principles

1. **One brief = one visual capability.** No brief assumes a specific scene or section.
2. **Briefs are maps, extractions are territory.** Briefs consolidate magic values and point to extractions for full source. No full shader code in briefs.
3. **Composability is explicit.** Every brief states what it pairs with, conflicts with, and where it sits in the rendering pipeline.
4. **Grouped by co-deployment (Option C).** Effects that are always used together (grain + vignette + chromatic aberration) share one brief. Effects that serve distinct purposes (DOF vs motion blur) get separate briefs.
5. **Vanilla Three.js target.** The MKS project uses vanilla Three.js, NOT React Three Fiber. Briefs that draw from R3F extractions (react-postprocessing, r3f-scroll-rig, lumina-gl, ghibli-style-shader, jongleur) must note where R3F patterns need translation to imperative Three.js API calls.
6. **When extractions disagree, prefer:** (a) most compatible with vanilla Three.js + Vite, (b) most performant at Tier 2 (laptop), (c) most aligned with the MKS "dreamy & eerie softness" aesthetic.

## Layer Inventory (19 Layers)

### Rendering Layers (scene geometry)

| # | Layer | What It Achieves Alone | Source Extractions |
|---|-------|----------------------|-------------------|
| L01 | **Ocean Surface** | Reflective/refractive water plane with waves, foam, sun specular | ocean, fft-ocean, 3D-Ocean, Three.js-Ocean-Scene, stylized-water, codrops-water |
| L02 | **Sky & Atmosphere** | Gradient sky dome with Rayleigh/Mie scattering, sun disk, day/night transitions | sky-shader, glsl-atmosphere, three-geospatial-atmosphere, interactive-low-poly-environment (time-of-day presets) |
| L03 | **Volumetric Clouds** | Raymarched cloud layers with silver linings, Beer absorption, weather-driven density | three-clouds, procedural-clouds-threejs, three-volumetric-clouds |
| L04 | **Grass & Wind Field** | Instanced blade geometry with multi-octave wind deformation | terra, fluffiest-grass, codrops-grass, al-ro-grass, grass-al-ro, grass-shader-glsl, grass-shader-glsl-nitash, three-grass-demo, three-grass-demo-james |
| L05 | **Cloth & Paper Simulation** | Verlet/force-based soft body for floating sheets, flags, paper planes | three-simplecloth, cloth-simulation, paperplanes |
| L06 | **Terrain & Ground** | Heightmap mesh with biome coloring, beach transitions, camera-following LOD | terra, three-terrain, THREE.Terrain, botw-map-3d |

### Post-Processing Layers (screen-space effects)

| # | Layer | What It Achieves Alone | Source Extractions |
|---|-------|----------------------|-------------------|
| L07 | **Analog Film Stack** | Grain + vignette + chromatic aberration + tone mapping (the "shot on film" look). Note: bundled layer — brief word budget expanded to ~400 words for implementation core. | glsl-film-grain, filmic-gl, pmndrs-postprocessing, react-postprocessing, 3d-game-shaders-for-beginners (grain, CA, vignette sections) |
| L08 | **LUT Color Grading** | Per-scene mood via .cube LUT swap (warm amber ↔ desaturated grey ↔ teal monochrome) | filmic-gl, react-postprocessing, pmndrs-postprocessing, 3d-game-shaders-for-beginners (LUT section) |
| L09 | **Depth of Field** | Bokeh blur with focus rack, aperture shape control, tilt-shift variant | webgl-dof, pmndrs-postprocessing, react-postprocessing, 3d-game-shaders-for-beginners (DOF section) |
| L10 | **Motion Blur** | Per-object velocity-buffer blur for slow-shutter / silk-water effects | realism-effects, threejs-sandbox-motion-blur, wagner |
| L11 | **Bloom & Light Effects** | Glow bleed, god rays, light leaks, projected light patterns (gobo/cookie shadows) | glsl-godrays, three-good-godrays, pmndrs-postprocessing, lumina-gl, three-projected-material |
| L12 | **Volumetric Fog & Haze** | Height fog, horizon dissolution, patchy atmospheric depth | three-volumetric-pass, three-clouds (see analytical haze section), 3d-game-shaders-for-beginners (fog section) |
| L13 | **Edge Detection & Outlines** | Depth+normal silhouettes, invertible for toon or figure rendering | webgl-outlines, three-js-toon-shader, 3d-game-shaders-for-beginners (outlining section) |

### Interaction Layers (user-driven)

| # | Layer | What It Achieves Alone | Source Extractions |
|---|-------|----------------------|-------------------|
| L14 | **Scroll-Driven Camera & Transitions** | Camera path scrubbing, section crossfades, DOM↔WebGL sync | three-story-controls, r3f-scroll-rig, jongleur, threejs-scroll-animation-demo, scroll-transitions-webgl, theatre |
| L15 | **Displacement & Hover Distortion** | Image-to-image warping on hover, liquid/ripple reveal effects | hover-effect, webgl-distortion-hover, lumina-gl |
| L16 | **Particle Systems** | Dust motes, petals, fireflies, spray — instanced or GPU-driven | three-quarks, three-nebula, ShaderParticleEngine, particula, vite-three-webxr-flowers-alex (FirefliesMaterial), webxr-flowers, interactive-low-poly-environment (firefly/flame GLSL) |
| L17 | **Audio-Reactive Mapping** | FFT frequency → shader uniform coupling, beat detection → visual sync, MIDI-to-3D key animation | particula, interactive-particles-music-visualizer, 3d-midi-audio-particles, 3d-piano-player |

### Reference Layers (not active in current aesthetic, available for future use)

| # | Layer | What It Achieves Alone | Source Extractions |
|---|-------|----------------------|-------------------|
| L18 | **Cel/Toon Shading** | NdotL quantization, gradient maps, rim lighting, discrete brightness thresholds | ghibli-style-shader, toon-shader, toon-shader-mayacoda, three-js-toon-shader, botw-cel-shading, shaders-botw-cel-shading-daniel, urp-toon, wind-waker-shader, 3d-game-shaders-for-beginners (cel shading section) |
| L19 | **Painterly Post-Processing** | Kuwahara filter, anisotropic brush alignment, structure tensor, Moebius line art | three-blocks-kuwahara, three-blocks-core-kuwahara, heckel-painterly-shaders, maximeheckel-painterly-shaders, maximeheckel-moebius-shader, 3d-game-shaders-for-beginners (Kuwahara section) |

## Brief Format (per layer)

```markdown
# Layer L{NN}: {Name}
> {One sentence: what this layer achieves on its own}

## What You See
{2-3 sentences describing the visual result. No code — pure description
of what it looks like when active.}

## Parameters You Control
| Parameter | Range | Default | Visual Effect |
|-----------|-------|---------|---------------|
{Key uniforms/props/settings consolidated from all source extractions.}

## How It Works (Implementation Core)
{Essential algorithm/technique in ~100-200 words (up to ~400 for bundled
layers like L07). The key shader math or JS pattern you can't skip.
Written for vanilla Three.js (NOT R3F). Reference extraction files for
full source.}

## Performance
- **Draw calls:** {N additional}
- **GPU time target:** {N}ms at 1080p
- **Tier 1 (desktop):** {full quality}
- **Tier 2 (laptop):** {what to reduce}
- **Tier 3 (mobile):** {disable or static fallback}

## Composability
- **Pairs well with:** {layers that commonly co-deploy}
- **Conflicts with:** {layers that fight or duplicate}
- **Stack order:** {where in the EffectComposer chain, if post-process}
- **Prerequisites:** {lighting/shadow/pass requirements this layer needs}

## Source Extractions
{Extraction filenames with what each contributes to this layer.
Note where R3F extractions need translation to imperative Three.js.}

## Adaptation Notes
{Vanilla Three.js + Vite integration specifics, gotchas, browser quirks}
```

## Composition Examples

### Image 7 — Teal Surfer, Silk Ocean, Invisible Horizon
> L01 (Ocean Surface) + L08 (LUT → teal monochrome) + L10 (Motion Blur) + L12 (Fog → horizon dissolution) + L07 (Analog Film Stack)

### Image 13 — Backlit Cloud Mass, Crepuscular Rays
> L03 (Volumetric Clouds) + L02 (Sky & Atmosphere) + L11 (God Rays) + L07 (Analog Film Stack)

### Image 4 — Piano, Golden Light, Flowers
> L09 (DOF → shallow focus on mechanism) + L11 (Bloom → golden bleed) + L16 (Particles → falling petals) + L08 (LUT → warm amber) + L07 (Analog Film Stack)

### Image 6 — Lone Figure in Vast Grass Field
> L04 (Grass & Wind Field) + L06 (Terrain) + L02 (Sky) + L12 (Fog → atmospheric depth) + L07 (Analog Film Stack)

### Image 1 — Score Sheet, Dark Ground, Leaf Shadows
> L05 (Cloth/Paper → score sheet geometry) + L09 (DOF → shallow focus) + L11 (projected leaf shadows via gobo texture — see three-projected-material in L11 sources) + L07 (Analog Film Stack)

### Landing Section (composite)
> L02 (Sky) + L01 (Ocean) + L12 (Fog) + L14 (Scroll Camera) + L07 (Film Stack) + L08 (LUT) + L16 (Particles → dust motes)

### Music Section (composite)
> L15 (Displacement → album art hover reveals) + L17 (Audio-Reactive) + L09 (DOF) + L07 (Film Stack) + L08 (LUT)

## Post-Processing Stack Order

When multiple post-processing layers are active, they compose in this order:

```
Scene Render
  ↓
  L12  Volumetric Fog (if material-injected via onBeforeCompile, runs during scene render)
  ↓
VelocityDepthNormalPass (prerequisite for L10, L13)
  ↓
EffectComposer
  ├── L12  Volumetric Fog (if post-process pass via three-volumetric-pass — before DOF so fog is subject to blur)
  ├── L09  Depth of Field
  ├── L10  Motion Blur
  ├── L11  Bloom & God Rays
  ├── L13  Edge Detection (if active)
  ├── L19  Kuwahara (if active, reference)
  ├── L07  Analog Film Stack (grain + chromatic aberration + vignette)
  ├── L08  LUT Color Grading
  └──      Tone Mapping (ACES Filmic, always last)
```

Note: L12 can be implemented two ways — injected into materials (runs during scene render, subject to all post-processing) or as a screen-space pass (runs in EffectComposer). The material-injection approach (Sneha Belkhale's fog hacks) is more physically correct; the post-process pass (three-volumetric-pass) is easier to add/remove.

## File Structure

```
research/
├── extractions/           # 73 raw repo extractions (existing)
├── index.md               # Master extraction index (existing)
├── repos-cinematic-map.md # Visual challenge → repo mapping (existing)
└── layers/                # NEW — 19 layer briefs
    ├── L01-ocean-surface.md
    ├── L02-sky-atmosphere.md
    ├── L03-volumetric-clouds.md
    ├── L04-grass-wind-field.md
    ├── L05-cloth-paper-sim.md
    ├── L06-terrain-ground.md
    ├── L07-analog-film-stack.md
    ├── L08-lut-color-grading.md
    ├── L09-depth-of-field.md
    ├── L10-motion-blur.md
    ├── L11-bloom-light-effects.md
    ├── L12-volumetric-fog-haze.md
    ├── L13-edge-detection-outlines.md
    ├── L14-scroll-camera-transitions.md
    ├── L15-displacement-hover.md
    ├── L16-particle-systems.md
    ├── L17-audio-reactive.md
    ├── L18-cel-toon-shading.md
    ├── L19-painterly-postprocess.md
    └── LAYERS-INDEX.md     # Quick-reference: layer → what it does → pairs with
```

## Generation Strategy

Each layer brief is generated by reading the relevant extractions and synthesizing:
- Magic values from all sources into one parameters table
- The "best" implementation approach when extractions disagree (see Design Principle 6 for decision criteria)
- Composability notes from practical knowledge of the rendering pipeline
- Performance budget per tier from the MKS 3-tier system

### Conflict Resolution

When multiple extractions implement the same technique differently:
1. **Prefer vanilla Three.js** over R3F-specific patterns (translate if needed)
2. **Prefer pmndrs/postprocessing-compatible** implementations over standalone
3. **Prefer the extraction with more magic values documented** (more tunable = more useful)
4. **Note both approaches** in the brief when they serve genuinely different quality/performance tradeoffs

### Worker Assignment

Prioritize the 17 active layers first. Reference layers (L18, L19) are generated last if capacity remains.

| Worker | Layers | Extraction reads required |
|--------|--------|--------------------------|
| W1 | L01, L02, L03, L12 | Ocean + sky + clouds + fog (atmospheric systems) |
| W2 | L04, L05, L06 | Grass + cloth + terrain (scene geometry) |
| W3 | L07, L08, L09, L10 | Film stack + LUT + DOF + motion blur (post-process core) |
| W4 | L11, L13, L15, L16 | Bloom + outlines + displacement + particles (effects) |
| W5 | L14, L17, L18, L19 | Scroll + audio-reactive + reference layers |

### Duplicate Extraction Note

Two extraction pairs cover the same repo at different depths:
- `al-ro-grass` (969 lines) and `grass-al-ro` (349 lines) — prefer `al-ro-grass` for L04
- `vite-three-webxr-flowers-alex` (611 lines) and `webxr-flowers` (414 lines) — prefer longer version for L16

Brief authors should read the longer extraction and only consult the shorter one for cross-reference.
