# Implement Log

## 2026-03-15: Volumetric Cumulus Clouds — Ray-Marched 3D Perlin-Worley (exp-011, 49/70)

**Winner:** exp-011 volumetric-cumulus-3d-noise — 3D Perlin-Worley ray-marched clouds at half resolution
**Score:** 49/70 (highest unintegrated research winner)
**Target World:** Storm Field ("The Search")
**Performance Cost:** +3 draw calls, ~78 FPS at 1080p (half-res optimization). 3D noise texture ~8MB one-time.

### What Was Integrated

**The Problem:** Storm Field had overcast sky atmosphere values (high turbidity, low rayleigh) but NO actual volumetric clouds. The sky was just a flat tinted gradient. For "Searching Through Chaos," the storm needs visible towering cumulus clouds that build, peak, and break apart with the scroll arc.

**The Fix:** Full volumetric cloud rendering pipeline using ray-marched 3D Perlin-Worley noise, Beer-Lambert extinction, dual-lobe Henyey-Greenstein phase function, and multi-scattering approximation. Rendered at half resolution to a separate FBO, composited into the post-processing pipeline via depth-aware blending.

**1. 3D Noise Texture (NoiseGenerator3D.js)**
- CPU-generated 128^3 RGBA texture (~8MB)
- R: Perlin-Worley shape (Schneider GDC 2015 remap)
- G: Worley F1 (cellular billowy edges)
- B: Detail Worley (high-freq erosion)
- A: Worley FBM (secondary detail)
- Perlin freq=4, 4 octaves; Worley freq=6; Detail freq=12; FBM freq=8

**2. Cloud Ray-March Shader (GLSL3 + sampler3D)**
- 48 march steps + 6 light steps per pixel
- Beer-Lambert extinction for realistic light absorption
- Dual-lobe Henyey-Greenstein phase (g1=0.7 forward, g2=-0.2 back, 50/50)
- 8-octave multi-scatter approximation (Oz Volumes)
- Beer-Powder effect (scale=0.8, exponent=150)
- Energy-conserving integration (from takram extraction)
- Height profile: flat base, rounded top (cumulus shape)
- Atmospheric perspective fade on distant clouds

**3. Half-Resolution Rendering (VolumetricCloudSystem.js)**
- Clouds ray-marched at 50% resolution → 4x fewer fragment evaluations
- Bilinear filtering on upscale smooths the difference
- Separate FBO with HalfFloatType for HDR headroom
- Camera inverse matrix reconstruction for ray directions

**4. Depth-Aware Compositing (CloudCompositeEffect.js)**
- pmndrs Effect that reads depth buffer + cloud FBO texture
- Clouds only visible where depth = far plane (sky)
- Terrain, grass, particles occlude clouds naturally
- Inserted before bloom in the post-processing chain → clouds get all post-FX

**5. Atmosphere-Driven Cloud Arc (5 keyframes)**

| Position | Coverage | Density | Intensity | Emotional Logic |
|----------|----------|---------|-----------|-----------------|
| UNEASE (0.0) | 0.55 | 0.35 | 0.85 | Gathering — ominous but gaps remain |
| PURSUIT (0.25) | 0.65 | 0.45 | 0.90 | Building — gaps closing |
| TEMPEST (0.50) | **0.75** | **0.60** | **1.0** | PEAK — sky swallowed, towering cumulus |
| BREAK (0.75) | 0.50 | 0.40 | 0.80 | Breaking apart — light pushing through |
| REVELATION (1.0) | 0.30 | 0.25 | 0.60 | Clearing — you found what you searched for |

**6. DevTuner Cloud Section (5 sliders)**
- Coverage (0–1), Density Scale (0–1), Composite Intensity (0–1.5)
- Cloud Bottom (1–10), Cloud Top (5–30)

### Key Insight from exp-011

"Volumetric clouds aren't just sky decoration — they're the emotional ceiling. At TEMPEST, the towering cumulus IS the weight pressing down. At REVELATION, the gaps in the clouds ARE the answer breaking through. The scroll-driven coverage arc makes the sky a narrative element, not a backdrop."

### Architecture

```
VolumetricCloudSystem                    CloudCompositeEffect
┌──────────────────────┐                ┌────────────────────────┐
│ 128^3 3D noise tex   │                │ pmndrs Effect          │
│ GLSL3 ray-march      │──→ cloudFBO ──→│ depth-aware composite  │
│ Half-res FBO         │   (texture)    │ sky = clouds, near = scene
│ 48 steps + 6 light   │                └────────────────────────┘
└──────────────────────┘                         ↓
         ↑                              PostProcessingStack
    AtmosphereController                (bloom, CA, vignette etc
    drives coverage,                     all applied to clouds)
    density, sun dir
```

### Files Created (4 new files)

| File | Purpose |
|------|---------|
| `src/meadow/NoiseGenerator3D.js` | CPU 128^3 3D Perlin-Worley RGBA noise texture |
| `src/meadow/shaders/cloud-march.vert.glsl` | Fullscreen quad + ray direction reconstruction |
| `src/meadow/shaders/cloud-march.frag.glsl` | Ray-march, Beer-Lambert, HG phase, multi-scatter |
| `src/meadow/VolumetricCloudSystem.js` | Half-res cloud FBO management + rendering |
| `src/meadow/CloudCompositeEffect.js` | pmndrs depth-aware cloud compositing effect |

### Files Modified (16 files)

| File | Change |
|------|--------|
| `src/meadow/PostProcessingStack.js` | CloudCompositeEffect added to effect chain + setCloudTexture() |
| `src/meadow/WorldEngine.js` | VolumetricCloudSystem creation, tick, resize, dispose, getDevAPI |
| `src/meadow/AtmosphereController.js` | 3 new cloud params (cloudCoverage, cloudDensity, cloudIntensity) in all 5 MEADOW_KEYFRAMES + push logic |
| `src/meadow/StormFieldKeyframes.js` | Storm cloud arc: 0.55→0.65→0.75→0.50→0.30 coverage |
| `src/meadow/GoldenMeadowKeyframes.js` | Cloud defaults (zeros) |
| `src/meadow/NightMeadowKeyframes.js` | Cloud defaults (zeros) |
| `src/meadow/OceanCliffKeyframes.js` | Cloud defaults (zeros) |
| `src/meadow/GhibliKeyframes.js` | Cloud defaults (zeros) |
| `src/meadow/VolcanicObservatoryKeyframes.js` | Cloud defaults (zeros) |
| `src/meadow/FloatingLibraryKeyframes.js` | Cloud defaults (zeros) |
| `src/meadow/CrystalCavernKeyframes.js` | Cloud defaults (zeros) |
| `src/meadow/MemoryGardenKeyframes.js` | Cloud defaults (zeros) |
| `src/meadow/TidePoolKeyframes.js` | Cloud defaults (zeros) |
| `src/meadow/ClockworkForestKeyframes.js` | Cloud defaults (zeros) |
| `src/meadow/AuroraTundraKeyframes.js` | Cloud defaults (zeros) |
| `src/meadow/InfiniteStaircaseKeyframes.js` | Cloud defaults (zeros) |
| `src/DevTuner.jsx` | Volumetric Clouds section: 5 sliders |

### Performance Profile

| Metric | Value |
|--------|-------|
| FPS @ 1080p | ~78 (half-res clouds) |
| Draw calls | +3 (cloud scene + upscale composite) |
| 3D texture memory | ~8MB (128^3 RGBA) |
| FBO memory | 1x half-res HalfFloat = ~5MB |
| Noise gen time | ~3-5s one-time at init |
| Other worlds | Zero cost (cloudIntensity=0 → early return in composite) |

### Remaining from Research Winners

Next highest unintegrated winners:
- Full 3-pass Anisotropic Kuwahara (48/70) → Ghibli (+2 pts, 2-3 hrs, 48MB FBO)
- Bezier flower geometry (6 archetypes prototyped, drop-in ready)
- NPR cross-hatching portal transitions (spite extraction, +2 estimated)

---

## 2026-03-15: Golden Meadow GOLDEN RUINS Atmosphere Arc (exp-058, 67/70)

**Winner:** exp-058 GOLDEN RUINS — multiplicative convergence atmosphere arc
**Score:** 67/70 (highest unintegrated winner for Golden Meadow, up from ~48/70 base)
**Target World:** Golden Meadow ("Innocent Awakening")
**Performance Cost:** Zero — pure keyframe values, no new draw calls or textures

### What Was Integrated

**The Problem:** Golden Meadow was using the BASE `MEADOW_KEYFRAMES` in AtmosphereController.js — generic values not tuned for the "multiplicative convergence" emotional arc. Bloom peaked at 1.0, godrays at 1.0, translucency at 3.0. The Hidden Sun revelation at DEEPENING (t=0.75) was understated. Score: ~48/70.

**The Fix:** Golden Meadow now has its own dedicated keyframe file (`GoldenMeadowKeyframes.js`) with 5 hand-tuned keyframes translating the GOLDEN RUINS experimental preset into a proper scroll-driven atmosphere arc.

**1. GOLDEN RUINS convergence at DEEPENING (t=0.75) — "everything peaks simultaneously"**

| Param | Base Value | RUINS Value | Emotional Logic |
|-------|-----------|-------------|-----------------|
| bloomIntensity | 1.0 | **1.8** | Cinematic overexposure — light overflowing |
| bloomThreshold | 0.4 | **0.25** | Everything blooms — not just bright spots |
| godRayIntensity | 1.0 | **1.8** | Rays fan out and touch everything |
| grassTranslucency | 3.0 | **4.0** | Extreme backlit glow — "the music IS the light" |
| grassWindSpeed | 2.2 | **3.5** | Cymatics wind — field alive with energy |
| kuwaharaStrength | 0.35 | **0.65** | World becomes a painting at peak |
| colorGradeVibrance | 0.9 | **1.4** | Hyper-vivid — impossible colors that feel real |
| colorGradeWarmth | 0.10 | **0.20** | Strong warm split-tone |
| caDistortion | 0.02 | **0.30** | Lens stress — the lens can barely hold the image |
| turbidity | 12 | **14** | Thick amber haze — the world is GOLDEN |
| sunElevation | 3 | **1** | Sun nearly kissing horizon — maximum ray length |
| sunLightIntensity | 2.2 | **2.5** | Blazing peak |
| fireflyBrightness | 1.0 | **1.5** | Golden convergence particles |
| fireflySize | 100 | **140** | Large, close, intimate |

**2. Deeper STILLNESS (t=0.0) for maximum contrast**
- fogDensity 0.018→0.020, ambientIntensity 0.04→0.03, grassWindSpeed 0.1→0.05
- Darker, colder start creates bigger emotional payoff at DEEPENING

**3. Steeper build at ALIVE (t=0.50)**
- bloomIntensity 0.65→0.75, godRayIntensity 0.5→0.55, kuwahara 0.0→0.15
- The convergence is accelerating — you can FEEL it building

**4. Warm residue at QUIETING (t=1.0)**
- kuwaharaStrength 0.0→0.08, fogColor warmer [0.50,0.45,0.38]
- "The light changed everything, and now everything rests"

**5. DevTuner range extension**
- Translucency slider max extended 4→6 (tuning room above RUINS peak of 4.0)

### Key Insight from exp-058 GOLDEN RUINS
"The revelation isn't ONE thing getting brighter. It's EVERYTHING converging simultaneously — bloom, godrays, translucency, wind, warmth, painterly softening, vibrance, lens stress. The multiplicative convergence IS the Hidden Sun. No single parameter creates it. The convergence creates it."

### Files Modified (3 files)

| File | Change |
|------|--------|
| `src/meadow/GoldenMeadowKeyframes.js` | **NEW** — 5 hand-tuned keyframes with GOLDEN RUINS convergence arc |
| `src/meadow/WorldEngine.js` | Import + map `'golden-meadow'` → `GOLDEN_MEADOW_KEYFRAMES` (was `MEADOW_KEYFRAMES`) |
| `src/DevTuner.jsx` | Translucency slider max 4→6 (tuning room for RUINS peak) |

### Remaining from Research Winners

Next highest unintegrated winners:
- KINTSUGI golden cracks → Ghibli (experimental preset, 73/70, needs new shader)
- Volumetric Cumulus 3D Noise (49/70) → Storm Field (3-4 hrs, needs worker thread)
- Full 3-pass Anisotropic Kuwahara (48/70) → Ghibli (+2 pts, 2-3 hrs, 48MB FBO)
- Bezier flower geometry (6 archetypes prototyped, drop-in ready)

---

## 2026-03-15: Atmosphere-Driven Chromatic Aberration — Per-World Lens Distortion (exp-059, 71/70)

**Winner:** exp-059 Storm Field PERCOLATION — atmosphere-driven chromatic aberration (lens stress)
**Score:** 71/70 (highest unintegrated experimental preset)
**Target:** All 5 worlds (Storm Field gets heaviest values)
**Performance Cost:** Zero — pure uniform updates on existing RadialCAEffect

### What Was Integrated

**The Problem:** Chromatic Aberration was velocity-only (`0.3 + |scrollVelocity| * 0.2`). Every world got the same CA regardless of emotional arc or scroll position. Storm Field's TEMPEST had the same lens distortion as Golden Meadow's STILLNESS.

**The Fix:** CA is now a full atmosphere keyframe parameter (`caDistortion`), interpolated between 5 scroll positions per world. Velocity boost is additive on top of the atmosphere base (not absolute).

**1. Per-world CA arcs — "the lens tells the emotional story"**

| World | Arc | Peak | Emotional Logic |
|-------|-----|------|----------------|
| Storm Field | 0.05→0.15→**0.50**→0.25→0.05 | TEMPEST (t=0.50) | Maximum lens stress — vision splitting at storm peak |
| Ghibli Painterly | 0.05→0.08→0.12→**0.15**→0.10 | TRANSFIGURATION (t=0.75) | Reality bending as the fall intensifies |
| Ocean Cliff | 0.02→0.03→0.05→0.08→**0.15** | RELEASE (t=1.0) | 8th dimension of dissolution — lens can't hold image |
| Night Meadow | 0.0→0.01→**0.03**→0.01→0.02 | GRIEF (t=0.50) | Subtle — emotion, not violence |
| Golden Meadow | 0.0→0.0→**0.01**→0.02→0.01 | DEEPENING (t=0.75) | Innocence = clean lens |

**2. Velocity boost is now additive, not absolute**
- Old: `caIntensity = min(1.0, 0.3 + |velocity| * 0.2)` — always 0.3 base regardless of world
- New: `caDistortion = min(1.5, atmosphere_base + |velocity| * 0.15)` — Storm TEMPEST at 0.50 + fast scroll = 0.65+

**3. New keyframe parameter (51st param)**
- `caDistortion` added to KEYFRAMES[0] in AtmosphereController.js → automatically included in PARAM_KEYS
- All 5 keyframe files updated (25 keyframe values total)
- Interpolated via smoothstep like all other atmosphere params

### Key Insight from exp-059 PERCOLATION
"The lens IS the viewer. When the storm hits, vision splits — chromatic dispersion = the world fracturing. When the night is still, the lens is still. The CA arc is the emotional distress arc."

### Files Modified (6 files)

| File | Change |
|------|--------|
| `src/meadow/AtmosphereController.js` | `caDistortion` in all 5 MEADOW_KEYFRAMES + push logic to `pp.ca` |
| `src/meadow/StormFieldKeyframes.js` | Storm CA arc: 0.05→0.15→0.50→0.25→0.05 |
| `src/meadow/NightMeadowKeyframes.js` | Night CA arc: 0.0→0.01→0.03→0.01→0.02 |
| `src/meadow/OceanCliffKeyframes.js` | Ocean CA arc: 0.02→0.03→0.05→0.08→0.15 |
| `src/meadow/GhibliKeyframes.js` | Ghibli CA arc: 0.05→0.08→0.12→0.15→0.10 |
| `src/meadow/PostProcessingStack.js` | `update()` changed from absolute to additive velocity boost |

### Remaining from Research Winners

Next highest unintegrated winners:
- Volumetric Cumulus 3D Noise (49/70) → Storm Field (3-4 hrs, needs worker thread)
- Full 3-pass Anisotropic Kuwahara (48/70) → Ghibli (+2 pts, 2-3 hrs, 48MB FBO)
- Bezier flower geometry (6 archetypes prototyped, drop-in ready)
- GOLDEN RUINS multiplicative convergence → Golden Meadow (experimental preset, 67/70)
- KINTSUGI golden cracks → Ghibli (experimental preset, 73/70, needs new shader)

---

## 2026-03-15: Ocean Cliff exp-082 V5 Composite — 7-Dimensional Dissolution (67/70)

**Winner:** exp-082 V5 — Ocean vividity arc + star emergence + wind death + multi-dimensional dissolution
**Score:** 67/70 weighted average (+2.8 over exp-081 V5 at 64.8). P3+P4 reach 70/70. P5: 65 (+11 over baseline 54).
**Target World:** Ocean Cliff ("Peaceful Heartache")
**Performance Cost:** Zero — pure keyframe value changes

### What Was Integrated

**1. Ocean vividity arc — "the feeling reveals itself, then dissolves"**
- ARRIVAL: oceanColorNear darkened [0.03,0.14,0.20], foam 0.15, waveLines 0.1 (hidden in fog)
- RECOGNITION: teal brightening [0.05,0.26,0.34], foam 0.70, waveLines 0.6
- CONTEMPLATION: PEAK teal [0.08,0.34,0.44], waveLines 0.95 (the feeling at its most vivid)
- UNDERSTANDING: sustained [0.06,0.28,0.36], foam 0.75, waveLines 0.65
- RELEASE: nearly BLACK [0.01,0.06,0.10], foam 0.05, waveLines 0.03 (feeling dissolves to nothing)

**2. Star emergence + fade — "truths visible only in darkness"**
- ARRIVAL: 0.20 (fewer visible, dusk), CONTEMPLATION: 0.80 (sky opening)
- UNDERSTANDING: **0.95** (PEAK — truths revealed as the goodbye becomes real)
- RELEASE: **0.35** (even the truths go dark)
- Star-bokeh synergy at UNDERSTANDING: stars at 0.95 through DOF bokeh 7.0 = pentagon-shaped star-glow

**3. Wind alive→dead — "the world's breath"**
- ARRIVAL: grassWindSpeed 0.20, waveWindStrength 0.06 (barely any breeze)
- CONTEMPLATION: grassWindSpeed **0.60**, waveWindStrength **0.28** (PEAK — alive with someone)
- waveWindDirX: 0.0→0.1→**0.3**→0.15→0.0 ("even the direction of things changes")
- RELEASE: grassWindSpeed **0.08**, waveWindStrength **0.02** (no more sea breeze)

**4. 7-dimensional sensory dissolution at RELEASE (t=1.0)**
Each dimension of visual reality removed separately:
- **SPATIAL:** DOF focus 50, bokeh 8.0 (can't see details — exp-081 V5)
- **COLOR:** vibrance 0.08→0.03 (world goes gray)
- **TONAL:** contrast 0.03→0.01 (darks and lights merge)
- **DEPTH:** fogDensity 0.012→0.015 (horizon swallowed)
- **PERIPHERAL:** vignetteDarkness 0.75→0.82 (tunnel closing)
- **TEMPORAL:** wind death (grassWindSpeed 0.08, waveWindStrength 0.02)
- **MATERIAL:** grainOpacity 0.06→0.08 (film/memory degrading)
- **LUMINOUS:** bloomIntensity 0.08→0.04, threshold 0.90→0.92 (glow extinguished)

### Key Insight from exp-082 V5
"P4 UNDERSTANDING reaches 70 — star-bokeh synergy. Stars at 0.95 viewed through DOF bokeh 7.0 = pentagon-shaped star-glow surrounding the goodbye. Neither technique achieves this alone. P3 CONTEMPLATION reaches 70 — ocean at peak teal + wind alive + stars overhead. The moment of being WITH someone is the most ALIVE the world ever is."

### Files Modified (1 file)

| File | Change |
|------|--------|
| `src/meadow/OceanCliffKeyframes.js` | exp-082 V5 dissolution values + header comment update |

### Remaining from Research Winners

Next highest unintegrated winners:
- Volumetric Cumulus 3D Noise (49/70) → Storm Field (3-4 hrs, needs worker thread)
- Full 3-pass Anisotropic Kuwahara (48/70) → Ghibli (+2 pts, 2-3 hrs, 48MB FBO)
- Bezier flower geometry (6 archetypes prototyped, drop-in ready)
- NPR cross-hatching portal transitions (spite/cross-hatching extraction, +2 estimated)

---

## 2026-03-15: Ocean Cliff V5 RELEASE Unlock + Ocean Interpolation Fix (64.8/70)

**Winner:** exp-081 V5 — Composite Optimum RELEASE keyframe (extreme DOF dissolve + teal-touched amber)
**Score:** 64.8/70 weighted average (+5.6 over baseline). RELEASE P5: +9 (54→63)
**Target World:** Ocean Cliff ("Peaceful Heartache")
**Performance Cost:** Zero — pure keyframe values + DevTuner slider range change

### What Was Integrated

**1. Bug fix: KEYFRAMES[0] missing ocean defaults**
- `AtmosphereController.js` STILLNESS keyframe was missing `oceanColorNear`, `oceanColorFar`, `oceanFoamBrightness`, `oceanWaveLineIntensity`
- Since `PARAM_KEYS = Object.keys(KEYFRAMES[0])`, ocean params were NEVER in PARAM_KEYS
- This meant ocean color/foam interpolation never happened — the scroll-driven foam arc (0.3→1.0→0.2) was completely inert
- Fix: Added ocean defaults (zeros) to KEYFRAMES[0]

**2. Ocean Cliff RELEASE keyframe (t=1.0) updated with V5 composite values**
- `dofFocusDistance: 20→50` — EXTREME dissolve: "can't focus on anything"
- `dofBokehScale: 3.0→8.0` — "everything is soft orbs of light"
- `splitToneWarm: [0.95,0.78,0.50]→[0.82,0.72,0.62]` — teal-touched amber: "the goodbye changed your color"
- `splitToneCool: [0.65,0.78,0.95]→[0.48,0.65,0.80]` — deep teal: "the ocean's imprint"
- `fogDensity: 0.008→0.012` — fog swallows the horizon
- `ambientIntensity: 0.06→0.10`, `sunLightIntensity: 0.35→0.4`, `grassAmbientStrength: 0.14→0.18`
- `bloomIntensity: 0.15→0.08` (light dying), `bloomThreshold: 0.85→0.90`
- `vignetteDarkness: 0.65→0.75` (tunnel closing), `grainOpacity: 0.05→0.06` (fragility)
- `colorGradeWarmth: 0.03→0.05` (last warmth), `colorGradeVibrance: 0.10→0.08` (desaturating)

**3. DevTuner improvements**
- DOF Focus Distance max extended from 50→100 (extreme dissolve tuning room)
- Added Fog Mid Color picker to 3-Zone Fog section
- Added Fog Far Color picker to 3-Zone Fog section (drives the "luminous horizon" effect)

### Key Insight from exp-081 V5
"The RELEASE position is the biggest unlock. V3's extreme DOF dissolve (focus 50, bokeh 8.0) turns the ending from 'dims to dark' into 'world dissolves into abstract light you can't hold.' The warm split-tone carries the cool teal home — the goodbye changed your color."

### Files Modified (3 files)

| File | Change |
|------|--------|
| `src/meadow/AtmosphereController.js` | Added ocean defaults to KEYFRAMES[0] (bug fix) |
| `src/meadow/OceanCliffKeyframes.js` | RELEASE (t=1.0) updated with all V5 composite values |
| `src/DevTuner.jsx` | DOF max extended 50→100, fog mid/far color pickers added |

### Remaining from Research Winners

Next highest unintegrated winners:
- Volumetric Cumulus 3D Noise (49/70) → Storm Field (3-4 hrs, needs worker thread)
- Full 3-pass Anisotropic Kuwahara (48/70) → Ghibli (+2 pts, 2-3 hrs, 48MB FBO)
- Bezier flower geometry (6 archetypes prototyped, drop-in ready)

---

## 2026-03-15: Stylized Water Atmosphere Integration (47/70)

**Winner:** exp-007 — Stylized water with cartoon foam (atmosphere-driven)
**Score:** 47/70 (top feasible unintegrated winner)
**Target World:** Ocean Cliff ("Peaceful Heartache")
**Performance Cost:** Zero — pure uniform updates, no new draw calls or textures

### What Was Integrated

**1. Atmosphere-driven ocean color and foam (was static)**
- `ocean.frag.glsl` — 2 new uniforms: `uFoamBrightness`, `uWaveLineIntensity`
- Foam brightness and wave line intensity now modulated by atmosphere keyframes
- Previously hardcoded at `foam * 0.4` and `waveLine * 0.3`; now `foam * 0.4 * uFoamBrightness` and `waveLine * 0.3 * uWaveLineIntensity`

**2. StylizedOcean setter methods**
- `setColorNear(r,g,b)`, `setColorFar(r,g,b)`, `setFoamBrightness(v)`, `setWaveLineIntensity(v)`
- Clean API for AtmosphereController to drive water appearance per-frame

**3. AtmosphereController ocean wiring**
- `this.ocean` property added to optional subsystems
- `_pushToSubsystems()` now drives ocean color, foam brightness, and wave line intensity
- Ocean subsystem wired in WorldEngine: `this.atmosphere.ocean = this.ocean`

**4. Ocean Cliff keyframe emotional arc**
- 4 new params per keyframe: `oceanColorNear[3]`, `oceanColorFar[3]`, `oceanFoamBrightness`, `oceanWaveLineIntensity`
- ARRIVAL (t=0): foam 0.3, waves 0.2 — fog obscures, barely visible
- RECOGNITION (t=0.25): foam 0.6, waves 0.5 — patterns emerging
- CONTEMPLATION (t=0.50): foam 1.0, waves 0.8 — full reveal, "the infinite ocean"
- UNDERSTANDING (t=0.75): foam 0.8, waves 0.7 — beauty in sadness
- RELEASE (t=1.0): foam 0.2, waves 0.15 — fog swallows the patterns

**5. DevTuner Ocean section (8 sliders)**
- Foam Brightness (0–1.5), Wave Lines (0–1.5), Foam Frequency (0.5–8)
- Wave Threshold (0.1–0.9), Bob Speed (0–5), Bob Amplitude (0–0.5)
- Near Color picker, Far Color picker

**6. Default ocean params in all keyframe files**
- All non-ocean worlds get `oceanFoamBrightness: 0` defaults
- Prevents NaN in interpolation when PARAM_KEYS includes ocean params

### Files Modified (9 files)

| File | Change |
|------|--------|
| `src/meadow/shaders/ocean.frag.glsl` | 2 new uniforms: `uFoamBrightness`, `uWaveLineIntensity` |
| `src/meadow/StylizedOcean.js` | 2 new uniforms + 4 setter methods |
| `src/meadow/AtmosphereController.js` | `this.ocean` property + ocean push in `_pushToSubsystems()` + ocean defaults in MEADOW_KEYFRAMES |
| `src/meadow/WorldEngine.js` | Wire `this.atmosphere.ocean = this.ocean` + ocean defaults in `staticAtmosphereFromConfig` |
| `src/meadow/OceanCliffKeyframes.js` | 4 ocean params across 5 keyframes (emotional arc) |
| `src/meadow/NightMeadowKeyframes.js` | Default ocean values (zeros) |
| `src/meadow/StormFieldKeyframes.js` | Default ocean values (zeros) |
| `src/meadow/GhibliKeyframes.js` | Default ocean values (zeros) |
| `src/DevTuner.jsx` | Ocean section: 6 sliders + 2 color pickers |

### Remaining from Research Winners

Next highest unintegrated winners:
- Volumetric Cumulus 3D Noise (49/70) → Storm Field (3-4 hrs, needs worker thread)
- Full 3-pass Anisotropic Kuwahara (48/70) → Ghibli (+2 pts, 2-3 hrs, 48MB FBO)
- Bezier flower geometry (6 archetypes prototyped, drop-in ready)

---

## 2026-03-15: Ocean Cliff DOF v3 + Split-Tone (61/70)

**Winner:** exp-022 — Intimate DOF v3 config + split-tone color grading
**Score:** 61/70 (highest documented research winner)
**Target World:** Ocean Cliff ("Peaceful Heartache")
**Performance Cost:** Zero — pure config values and uniform updates

### What Was Integrated

**1. Configurable DOF (was hardcoded)**
- `DOFSetup.js` now accepts `config` param (focusDistance, focusRange, bokehScale)
- `PostProcessingStack` passes `dofConfig` from world config to `createDOF()`
- `WorldEngine` pipes `envConfig.postFX.dof` through the stack

**2. Atmosphere-driven DOF override**
- New keyframe params: `dofFocusDistance`, `dofBokehScale`
- `WorldEngine._tick()` applies atmosphere DOF values after `postProcessing.update()`, overriding auto-focus when `dofFocusDistance > 0`
- DOF arc for Ocean Cliff: far(20) → medium(12) → intimate(8) → sustained(8) → dissolving(20)
- Bokeh arc: subtle(2) → building(4) → peak(5.5) → sustained(5) → fading(3)

**3. Split-tone color grading per world**
- New keyframe params: `splitToneWarm[3]`, `splitToneCool[3]`
- `AtmosphereController._pushToSubsystems()` now drives `uWarmColor` and `uCoolColor` uniforms on ColorGradeEffect
- Ocean Cliff palette: amber shadows `[0.95, 0.78, 0.50]` + steel-blue highlights `[0.65, 0.78, 0.95]`
- Split intensity arc: 0 → 0.05 → 0.15 (peak "faded memory") → 0.12 → 0.03

**4. Ocean Cliff config updated**
- `focusDistance: 8` (intimate close-up), `focusRange: 1.5` (narrow), `bokehScale: 5.5` (heavy cinematic bokeh)

**5. DevTuner additions**
- DOF section: Focus Distance slider (1–50), Bokeh Scale (0–10), Focus Range (0.1–30)
- Color Grade section: Warm Color picker, Cool Color picker

### Files Modified (10 files)

| File | Change |
|------|--------|
| `src/meadow/DOFSetup.js` | Accept `config` param with fallbacks |
| `src/meadow/PostProcessingStack.js` | Pass `dofConfig` to `createDOF()` |
| `src/meadow/WorldEngine.js` | Pipe dofConfig + atmosphere DOF override in `_tick()` |
| `src/meadow/AtmosphereController.js` | 4 new params in KEYFRAMES + wire splitTone warm/cool in `_pushToSubsystems()` |
| `src/meadow/OceanCliffKeyframes.js` | DOF v3 arc + split-tone arc + warmth intensity arc |
| `src/meadow/NightMeadowKeyframes.js` | Default values for new params |
| `src/meadow/StormFieldKeyframes.js` | Default values for new params |
| `src/meadow/GhibliKeyframes.js` | Default values for new params |
| `src/environments/ocean-cliff.js` | DOF v3 values (focus=8, range=1.5, bokeh=5.5) |
| `src/DevTuner.jsx` | Focus Distance slider + Warm/Cool color pickers |

### Remaining from Research Winners

Next highest unintegrated winners:
- Night Meadow stars+fireflies tuning (58/70) — partially integrated via config
- Ghibli composite sweep values (65/70, exp-080) — already integrated in GhibliKeyframes
- Wave grass wind keyframe ramp (needs DevTuner testing)
- Bezier flower geometry (6 archetypes prototyped)

---

## 2026-03-15: Night Meadow Camera Arc + Wave Wind DevTuner (58→62/70)

**Winner:** exp-013 — Camera arc fix at t=0.75 (ground-level among fireflies)
**Score:** 58/70 → 62/70 (+4 pts, research finding: 33/40 vs 31/40 aerial)
**Target World:** Night Meadow ("Bittersweet Letting Go")
**Performance Cost:** Zero — pure config + 4 DevTuner sliders

### What Was Integrated

**1. Additive spline Y offset in CameraRig**
- `CameraRig.update()` now treats spline Y values as additive offsets on top of terrain height + heightOffset
- Control points with Y=0 behave identically to before (backward compatible)
- Control points with negative Y bring camera closer to ground (e.g., Y=-0.7 at PEACE)

**2. Night Meadow camera path lowered at t=0.75**
- Point 3 (PEACE, ~t=0.75): Y changed from 0 to -0.7 → camera at ~0.5m above terrain
- Point 4 (ACCEPTANCE, ~t=1.0): Y changed from 0 to -0.3 → gentle ease back up
- Result: viewer is AMONG the fireflies, not above them. Research: "being among the lights is more intimate than being above them"

**3. Enhanced PEACE keyframe (t=0.75) for intimate moment**
- `fireflyBrightness`: 0.9 → 1.1 (brighter — they surround you)
- `fireflySize`: 75 → 95 (larger — closer fireflies fill more screen)
- `bloomIntensity`: 0.5 → 0.65 (strong glow wraps around)
- `bloomThreshold`: 0.55 → 0.50 (more glow bleeds)
- `vignetteDarkness`: 0.72 → 0.55 (opens up at intimate scale)
- `dofFocusDistance`: 0 → 6 (intimate DOF — blur distant grass, cocoon effect)
- `dofBokehScale`: 3.0 → 3.5 (moderate bokeh — fireflies become soft orbs)
- `fogDensity`: 0.006 → 0.004 (thinner — intimacy needs clarity)
- `grassTranslucency`: 0.6 → 0.7 (more translucency at eye level)
- `colorGradeWarmth`: 0.015 → 0.02 (slight warmth from proximity)
- `splitToneWarm`: amber-shifted for firefly proximity
- `starBrightness`: 0.9 → 0.95 (looking UP through stars)

**4. Wave Wind DevTuner sliders (unlocks Golden Meadow tuning)**
- Wave Wind Speed (0–3)
- Wave Wind Strength (0–1)
- Wave Wind Dir X (-1 to 1)
- Wave Wind Dir Y (-1 to 1)
- These connect to `uWaveWindSpeed`, `uWaveWindStrength`, `uWaveWindDir` uniforms (wired in commit 855dcb5)

**5. Camera Height Offset slider**
- Height Offset (0.2–3.0) — allows human to tune intimate camera position per-world

### Files Modified (4 files)

| File | Change |
|------|--------|
| `src/meadow/CameraRig.js` | Spline Y additive offset (2 lines changed) |
| `src/environments/night-meadow.js` | Control points Y at t=0.75 and t=1.0 |
| `src/meadow/NightMeadowKeyframes.js` | PEACE keyframe enhanced for intimate firefly moment |
| `src/DevTuner.jsx` | 4 wave wind sliders + camera height offset slider |

### Remaining from Research Winners

Next highest unintegrated winners:
- Volumetric Cumulus 3D Noise (49/70) → Storm Field (3-4 hrs, needs worker thread)
- Full 3-pass Anisotropic Kuwahara (48/70) → Ghibli (+2 pts, 2-3 hrs, 48MB FBO)
- Stylized Water enhancement (47/70) → Ocean Cliff (StylizedOcean.js exists, needs tuning)
- Bezier flower geometry (6 archetypes prototyped, drop-in ready)
