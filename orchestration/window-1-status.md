# Window 1 — Environment Worlds

**Branch:** `feature/environment-worlds`
**Based on:** `v0.1.0-meadow-stable`
**Started:** 2026-03-14

---

## Step 1: Routing Architecture — COMPLETE

### What was built

1. **React Router integration**
   - Installed `react-router-dom`
   - Wrapped app in `BrowserRouter` (in `main.jsx`)
   - 5 routes: `/`, `/listen`, `/story`, `/collect`, `/witness`

2. **Environment config system** (`src/environments/`)
   - `golden-meadow.js` — Full config with all PRD magic values (terrain, sky, grass, particles, post-FX, camera, audio)
   - `ocean-cliff.js` — Peaceful Heartache: teal midnight, stylized ocean, dusk stars, seated figure, DOF, arc camera
   - `night-meadow.js` — Bittersweet Letting Go: blue-black sky, 800 fireflies, slow wind, heavy grain/vignette
   - `ghibli-painterly.js` — The Fall and Acceptance: cel-dome sky, Kuwahara filter, petal particles, spiral camera
   - `storm-field.js` — The Search: overcast, 2000 rain streaks, lightning, camera shake, violent wind
   - `index.js` — Registry with `ENVIRONMENTS`, `ENV_ORDER`, `ROUTE_MAP` exports

3. **EnvironmentScene component** (`src/EnvironmentScene.jsx`)
   - Manages engine lifecycle per route (create on mount, destroy on unmount)
   - Golden Meadow uses existing MeadowEngine directly
   - Other environments show EnvironmentPlaceholder (emotional identity text)

4. **WorldNav component** (`src/WorldNav.jsx` + `WorldNav.css`)
   - Fixed top nav with 5 links: Enter, Listen, Story, Collect, Witness
   - Serif typography (Cormorant Garamond), opacity transitions
   - Active indicator uses environment's dominant color
   - `prefers-reduced-motion` support

5. **App.jsx refactored**
   - Routes generated from ENVIRONMENTS registry
   - MiniPlayer, MoonlightCursor, WorldNav persist across all routes

---

## Step 2: Abstract Shared Engine — COMPLETE

### What was built

1. **WorldEngine** (`src/meadow/WorldEngine.js`)
   - Config-driven generic engine: `new WorldEngine(canvas, envConfig)`
   - Conditionally creates subsystems from config flags (grass, flowers, fireflies, dust, god rays, score sheets, artist figure, portals)
   - Null-safe tick loop — only updates subsystems that exist
   - Auto-generates static atmosphere keyframes for envs without hand-tuned scroll arc
   - `destroy()` cancels RAF + cleans up all subsystems

2. **CameraRig** now config-driven
   - Control points, FOV, damping factor, height offset from `envConfig.camera`
   - Camera shake support for storm field (`envConfig.camera.shake`)

3. **AtmosphereController** now configurable
   - Accepts optional keyframes in constructor
   - Null-safe subsystem pushes (grass, fireflies, cloud shadows can be null)
   - Exports `MEADOW_KEYFRAMES` for reuse by WorldEngine

4. **MeadowScene.setupScene()** accepts config
   - Sky, lighting, fog params from env config with golden-meadow defaults

5. **MeadowEngine** → thin wrapper
   - `class MeadowEngine extends WorldEngine` passing golden-meadow config
   - Backward-compatible for DevTuner and existing references

6. **EnvironmentScene** updated
   - All environments use `WorldEngine` — no more placeholder-only stubs
   - Every world gets live 3D rendering (Preetham sky + terrain + configured subsystems)

### Build status
- `npx vite build` passes (116 modules, 1.31s)
- Chunk size warning expected (Three.js)

### Files changed (Step 2)
```
new: src/meadow/WorldEngine.js
mod: src/meadow/MeadowEngine.js (now thin wrapper)
mod: src/meadow/CameraRig.js (config-driven)
mod: src/meadow/AtmosphereController.js (optional keyframes, null-safe)
mod: src/meadow/MeadowScene.js (config-aware setupScene)
mod: src/EnvironmentScene.jsx (uses WorldEngine for all envs)
new: orchestration/window-1-update-001.md
```

### New references (from update-001)
- **Bezier flowers** (glflower repo) — procedural Bezier petal geometry
- **Volumetric clouds** — Beer Shadow Maps, 4-layer system
- **Wave-like grass wind** — sine wave propagation for directional coherence

---

---

## Step 3: Night Meadow — COMPLETE

### What was built

1. **Config-driven terrain color**
   - `TerrainPlane.createTerrain()` accepts `envConfig` for ground color
   - Each world gets its own terrain color (dark blue-teal for night, dark grey for storm, etc.)

2. **StarField subsystem** (`src/meadow/StarField.js`)
   - Procedural stars on sky sphere using grid+jitter placement (Nugget8 pattern)
   - `pow(random, 6)` brightness distribution (many dim, few bright)
   - Subtle twinkle animation with per-star phase
   - Optional moon glow (concentric disk + soft halo)
   - Star/moon shaders: `star.vert.glsl`, `star.frag.glsl`

3. **Night Meadow atmosphere keyframes** (`NightMeadowKeyframes.js`)
   - 5-keyframe scroll arc: SILENCE → REMEMBRANCE → GRIEF → PEACE → ACCEPTANCE
   - Stars fade in (0.5→1.0→0.6), fireflies peak at GRIEF (1.2 brightness)
   - Heavy vignette (0.90→0.65→0.85), grain (0.08), near-black blue fog

### Files created (Step 3)
```
new: src/meadow/StarField.js
new: src/meadow/NightMeadowKeyframes.js
new: src/meadow/shaders/star.vert.glsl
new: src/meadow/shaders/star.frag.glsl
mod: src/meadow/TerrainPlane.js (config-driven color)
mod: src/meadow/WorldEngine.js (StarField wiring)
mod: src/meadow/AtmosphereController.js (starBrightness push)
```

---

## Step 4: Ocean Cliff — COMPLETE

### What was built

1. **StylizedOcean subsystem** (`src/meadow/StylizedOcean.js`)
   - Ashima simplex noise (webgl-noise, public domain) for wave patterns
   - Binary threshold foam, breathing contour wave lines
   - UV vignette for fake depth darkening
   - Near/far color gradient (dark teal → deep midnight)
   - Gentle sine-wave bob displacement
   - Ocean shaders: `ocean.vert.glsl`, `ocean.frag.glsl`

2. **Ocean Cliff atmosphere keyframes** (`OceanCliffKeyframes.js`)
   - 5-keyframe scroll arc: ARRIVAL → RECOGNITION → CONTEMPLATION → UNDERSTANDING → RELEASE
   - Dusk stars (0.3→0.7→0.6), cool blue-steel light
   - Fog clears at CONTEMPLATION revealing the ocean

### Files created (Step 4)
```
new: src/meadow/StylizedOcean.js
new: src/meadow/OceanCliffKeyframes.js
new: src/meadow/shaders/ocean.vert.glsl
new: src/meadow/shaders/ocean.frag.glsl
mod: src/meadow/WorldEngine.js (ocean wiring)
```

---

## Step 5: Storm Field — COMPLETE

### What was built

1. **RainSystem subsystem** (`src/meadow/RainSystem.js`)
   - 2000 velocity-stretched particle streaks (adapted from three.quarks concept)
   - Per-particle phase offsets + speed variation for desynchronization
   - Vertical fall with sine horizontal drift
   - Distance fade + spawn/impact fade
   - Rain shaders: `rain.vert.glsl`, `rain.frag.glsl`

2. **LightningSystem** (`src/meadow/LightningSystem.js`)
   - Random-interval screen flash (8-20s between strikes)
   - Boosts ambient + sun light + bloom during flash
   - Configurable decay duration (200ms)
   - Atmosphere sets base ambient intensity

3. **Storm Field atmosphere keyframes** (`StormFieldKeyframes.js`)
   - 5-keyframe scroll arc: UNEASE → PURSUIT → TEMPEST → BREAK → REVELATION
   - Wind builds to 3.5x at TEMPEST, rain peaks at 0.9
   - Maximum vignette (0.92), grain (0.12) at storm peak
   - Colors return at REVELATION — warmth earned through struggle

### Files created (Step 5)
```
new: src/meadow/RainSystem.js
new: src/meadow/LightningSystem.js
new: src/meadow/StormFieldKeyframes.js
new: src/meadow/shaders/rain.vert.glsl
new: src/meadow/shaders/rain.frag.glsl
mod: src/meadow/WorldEngine.js (rain + lightning wiring)
mod: src/meadow/AtmosphereController.js (rainBrightness push)
```

---

## Step 6: Ghibli Painterly — COMPLETE

### What was built

1. **PetalSystem subsystem** (`src/meadow/PetalSystem.js`)
   - 300 cherry blossom petals with sine-wave flutter
   - Spiral descent with per-petal phase/size/drift
   - Rotated oval shapes for petal silhouette
   - Soft pink-white palette with rotation-based color shifts
   - Petal shaders: `petal.vert.glsl`, `petal.frag.glsl`

2. **Ghibli atmosphere keyframes** (`GhibliKeyframes.js`)
   - 5-keyframe scroll arc: WONDER → IMMERSION → RADIANCE → TRANSFIGURATION → TRANSCENDENCE
   - Kuwahara strength driven by scroll (0.3→0.6 at RADIANCE→0.4)
   - Peak vibrance at 0.90, god rays at 0.7
   - Brightest world — ambient 0.22, sun intensity 2.0

### Files created (Step 6)
```
new: src/meadow/PetalSystem.js
new: src/meadow/GhibliKeyframes.js
new: src/meadow/shaders/petal.vert.glsl
new: src/meadow/shaders/petal.frag.glsl
mod: src/meadow/WorldEngine.js (petals wiring)
mod: src/meadow/AtmosphereController.js (petalBrightness push)
```

---

## Step 7: Portal Transition System — COMPLETE

### What was built

1. **TransitionRenderer** (`src/meadow/TransitionRenderer.js`)
   - FBO-based transition between two WorldEngine instances
   - Route pair → transition type mapping
   - 1.5 second duration with progress callback

2. **Transition GLSL shader** (`shaders/transition.frag.glsl`)
   - 5 transition types (adapted from gl-transitions, MIT):
     - Type 0: Fade through fog color (Meadow → Ocean)
     - Type 1: Fade through darkness (Meadow → Night)
     - Type 2: Brush stroke dissolve via noise (Meadow → Ghibli)
     - Type 3: Lightning flash (Meadow → Storm)
     - Type 4: Simple crossfade (fallback)

3. **useWorldTransition React hook** (`src/useWorldTransition.js`)
   - Manages transition lifecycle with lazy initialization
   - Ready for integration with EnvironmentScene

### Files created (Step 7)
```
new: src/meadow/TransitionRenderer.js
new: src/meadow/shaders/transition.vert.glsl
new: src/meadow/shaders/transition.frag.glsl
new: src/useWorldTransition.js
```

### Note on integration
Full dual-engine GLSL transitions require both engines alive simultaneously
during the 1.5s blend. The infrastructure is ready — EnvironmentScene lifecycle
integration is the next step (requires both old and new engine rendering to FBOs
before the transition starts).

---

## Build Status
- `npx vite build` passes (133 modules, ~1.9s)
- Chunk size warning expected (Three.js)

## Complete Architecture After Steps 3-7

```
Environment Config (e.g., night-meadow.js)
    ↓
WorldEngine(canvas, config)
    ├── CameraRig(camera, config.camera) [shake support]
    ├── setupScene(scene, config)        [sky + lights]
    ├── createTerrain(scene, config)     [config-driven color]
    ├── CloudShadows(scene)
    ├── StylizedOcean?                   [if config.ocean.enabled]
    ├── GrassChunkManager?               [if config.grass.enabled]
    ├── FireflySystem?                   [if config.particles.fireflies.enabled]
    ├── FlowerInstances?                 [if config.flowers.enabled]
    ├── StarField?                       [if config.sky.stars.enabled]
    ├── RainSystem?                      [if config.particles.rain.enabled]
    ├── PetalSystem?                     [if config.particles.petals.enabled]
    ├── DustMotes?                       [if config.particles.dust.enabled]
    ├── GodRayPass?                      [if config.postFX.godRays.enabled]
    ├── LightningSystem?                 [if config.sky.lightning.enabled]
    ├── ScoreSheetCloth?                 [if config.scoreSheets.enabled]
    ├── ArtistFigure?                    [if config.figure.enabled]
    ├── PortalHint?                      [golden-meadow only]
    ├── PostProcessingStack              [always]
    ├── AtmosphereController             [hand-tuned keyframes per world]
    ├── CursorInteraction                [always]
    └── AudioReactive                    [always]
```

### New Subsystems Added
| Subsystem | Used By | Adapted From |
|-----------|---------|--------------|
| StarField | Night Meadow, Ocean Cliff | Nugget8/Three.js-Ocean-Scene |
| StylizedOcean | Ocean Cliff | thaslle/stylized-water + Ashima webgl-noise |
| RainSystem | Storm Field | three.quarks velocity-stretched concept |
| LightningSystem | Storm Field | Standard storm simulation |
| PetalSystem | Ghibli Painterly | Standard petal flutter patterns |
| TransitionRenderer | Route transitions | gl-transitions (MIT) |

### Atmosphere Keyframes Per World
| World | Arc | Key Emotional Moment |
|-------|-----|---------------------|
| Golden Meadow | STILLNESS → AWAKENING → ALIVE → DEEPENING → QUIETING | DEEPENING: sun behind artist |
| Night Meadow | SILENCE → REMEMBRANCE → GRIEF → PEACE → ACCEPTANCE | GRIEF: fireflies at 1.2x |
| Ocean Cliff | ARRIVAL → RECOGNITION → CONTEMPLATION → UNDERSTANDING → RELEASE | CONTEMPLATION: ocean revealed |
| Storm Field | UNEASE → PURSUIT → TEMPEST → BREAK → REVELATION | TEMPEST: max darkness + wind |
| Ghibli Painterly | WONDER → IMMERSION → RADIANCE → TRANSFIGURATION → TRANSCENDENCE | RADIANCE: Kuwahara 0.6 |

---

## Step 8: Music-Driven Routing + Entry Page — COMPLETE

### Architecture Change: Music is the Router

**Removed:** react-router-dom URL routing (BrowserRouter, Routes, NavLink)
**Added:** WorldContext state machine driven by MiniPlayer track selection

1. **WorldContext** (`src/WorldContext.jsx`)
   - `currentWorld` — active environment ID
   - `navigateToWorld(id)` — triggers world transition
   - `entryComplete` — gates WebGL rendering behind entry page
   - `completeEntry()` — confirms AudioContext + enters meadow
   - `ensureAudioContext()` — shared AudioContext creation
   - Sequential navigation: `nextWorld()`, `prevWorld()`

2. **MiniPlayer refactored as router**
   - Track list built from `TRACK_LIST` (derived from env configs)
   - Selecting a track navigates to its world
   - Auto-advance to next world when track ends
   - Track list UI: numbered list with title + emotion
   - Hidden until entry page completes (`entryComplete` gate)

3. **Environment configs — track association**
   - Each env config now has `audio.track: { title, artist, album, src }`
   - Golden Meadow: "In a Field of Silence" (wired via ES import)
   - Others: placeholder titles (src=null until MP3s available)
   - `TRACK_LIST` export: ordered list for MiniPlayer

4. **WorldNav** — buttons instead of NavLink, uses `navigateToWorld()`

5. **App.jsx** — no Routes, renders `EntryPage` or `EnvironmentScene` based on context

6. **main.jsx** — no BrowserRouter wrapper

### Entry Page

**EntryPage** (`src/entry/EntryPage.jsx` + `EntryPage.css`)

Techniques stolen from flower-reference.html specification:
- **Bezier curve petals** — `drawPetal()` with cubic bezier left/right edges
- **Bayer 4x4 dithering** — full-frame dither post-process, 4-tone palette
- **4-tone palette**: `#ededea`, `#a8a8a4`, `#545250`, `#111110`
- **Half-resolution render** — `scale=0.5`, `image-rendering: pixelated`
- **6-layer cursor parallax** — stem, back petals, front petals, center, stamen, text
- **Breathing animation** — petal scale oscillation, flutter skew
- **Procedural generation** — `createFlowerSeed()` randomizes petal count, width, curve, stems
- **Dissolve transition** — dither-threshold dissolve (pixels fade to black via Bayer matrix)
- **AudioContext confirmation** — click triggers `completeEntry()` which creates AudioContext

### Audio Wiring
- `src/assets/audio/In a Field of Silence.mp3` — Golden Meadow track
- Imported via ES module in `environments/index.js` (Vite hashes for production)
- MiniPlayer auto-plays track when world changes

### Files created (Step 8)
```
new: src/WorldContext.jsx
new: src/entry/EntryPage.jsx
new: src/entry/EntryPage.css
mod: src/App.jsx (no Routes, context-driven)
mod: src/main.jsx (no BrowserRouter)
mod: src/EnvironmentScene.jsx (no route dependency)
mod: src/MiniPlayer.jsx (track list, world navigation)
mod: src/MiniPlayer.css (track list styles)
mod: src/WorldNav.jsx (buttons, context-driven)
mod: src/WorldNav.css (button reset styles)
mod: src/environments/*.js (audio.track configs)
mod: src/environments/index.js (TRACK_LIST, audio import)
```

### Build status
- `npx vite build` passes (125 modules, 1.82s)
- MP3 asset bundled (11.1MB)
- Chunk size warning expected (Three.js)

---

## Step 9: Research Winner Integration — COMPLETE

### What was done

Integrated 5 research winners from Window 2's AutoResearch Pipeline into the environment worlds. Each winner brought specific magic values and shader techniques that upgrade the existing subsystems.

#### 1. Night Stars+Fireflies → Night Meadow StarField (exp-008, score 56/70)
- **StarField.js**: Upgraded from ~2300 stars (48x48 grid, brightnessExp=6) to ~8100 stars (90x90 grid, brightnessExp=3)
- **6 spectral colors**: O/B blue-white, A white, F yellow-white, G yellow, K orange, M red — per-vertex `aStarColor` attribute mapped from brightness (hot bright stars are blue, cool dim stars are red)
- **star.vert.glsl + star.frag.glsl**: Now passes per-vertex spectral color instead of hardcoded 2-color mix
- **firefly.frag.glsl**: Updated to amber #d4c968 (research winner value — "Stars are cool (hope), fireflies are warm (comfort)")

#### 2. Stylized Water → Ocean Cliff StylizedOcean (exp-007, score 47/70)
- **ocean.frag.glsl**: Added binary cartoon hardness — `smoothstep(0.08, 0.001, noise)` → `step(0.5, result)` snaps foam to hard edges
- **Foam dots**: Added second noise layer at freq×2.8 for scattered foam dots (winner technique)
- Zero textures, fully procedural, +0 draw calls

#### 3. Rain Particles → Storm Field RainSystem (exp-009, score 39/70)
- **RainSystem.js**: Updated default values — velocity `[3.0, -15.0, 0.5]` (windX=3), lengthFactor=30 (was 3)
- **rain.vert.glsl**: Added cross-product stretch technique from three.quarks — `cross(mvPosition.xyz, viewVelocity)` for perpendicular billboard width, streak length from velocity magnitude × dropWidth (0.04)
- Faster cycle time (2s) for windier feel

#### 4. Cel-Shading → Ghibli Grass Shader (exp-004, score 42/70)
- **grass.frag.glsl**: Added 4-band step-function lighting path (craftzdog technique)
  - Thresholds: `[0.6, 0.35, 0.001]`, Multipliers: `[1.2, 0.9, 0.5, 0.25]`
  - Cel path has: flat color bands, no specular/translucency, rim light (daniel-ilett), simplified ambient
  - Standard lighting path unchanged for other worlds
- **GrassChunkManager.js**: Added `uCelEnabled`, `uCelThresholds`, `uCelMultipliers` uniforms
- **WorldEngine.js**: Wires cel-shading enable from `envConfig.grass.celShading` (ghibli-painterly config already has it)

#### 5. Kuwahara Pipeline → Ghibli PostProcessingStack (exp-006, score 48/70)
- **KuwaharaEffect.js**: Upgraded from 4-quadrant to **8-sector circular** Kuwahara (Papari variant, adapted from MaximeHeckel)
  - Circular kernel (skips corners), angle-based sector assignment
  - Exponential variance weighting with `alpha=25.0` (near winner-takes-all)
  - **16-level color quantization** for painterly banding
  - **1.5x saturation boost** (function named `boostSaturation` to avoid Three.js `saturate()` macro conflict)
  - Clamp to 0.08–0.92 (breathing blacks aesthetic preserved)
- **PostProcessingStack.js**: Now constructs KuwaharaEffect with full winner params (kernelSize=6, alpha=25, quantizeLevels=16, saturationBoost=1.5)

### Files changed (Step 9)
```
mod: src/meadow/StarField.js (8K stars, 6 spectral colors, brightnessExp=3)
mod: src/meadow/shaders/star.vert.glsl (per-vertex color attribute)
mod: src/meadow/shaders/star.frag.glsl (spectral colors from vertex)
mod: src/meadow/shaders/firefly.frag.glsl (amber #d4c968)
mod: src/meadow/shaders/ocean.frag.glsl (binary step foam + foam dots)
mod: src/meadow/RainSystem.js (windX=3, lengthFactor=30)
mod: src/meadow/shaders/rain.vert.glsl (cross-product stretch)
mod: src/meadow/shaders/grass.frag.glsl (4-band cel-shading path)
mod: src/meadow/GrassChunkManager.js (cel-shading uniforms)
mod: src/meadow/WorldEngine.js (cel-shading wiring from config)
mod: src/meadow/KuwaharaEffect.js (8-sector anisotropic, winner values)
mod: src/meadow/PostProcessingStack.js (Kuwahara winner params)
```

### Build status
- `npx vite build` passes (125 modules, 1.16s)
- Chunk size warning expected (Three.js)

---

## Step 10: Polish Audit — COMPLETE

### Fixes Applied

1. **Night Meadow firefly count: 800 → 400**
   - Window 2 research (exp-008, score 56/70) found 400 is the sweet spot
   - Updated `src/environments/night-meadow.js`

2. **Storm Field keyframe NaN bug**
   - `petalBrightness` was missing from keyframes at t=0.25, 0.50, 0.75, 1.0
   - AtmosphereController's `PARAM_KEYS` (from meadow keyframes) includes `petalBrightness`
   - Interpolation produced `lerpScalar(0.0, undefined, t) = NaN`
   - Harmless in practice (Storm Field has no petals) but fixed for correctness
   - Added `petalBrightness: 0.0` to all 4 missing keyframes in `StormFieldKeyframes.js`

3. **AtmosphereController initial value mismatch**
   - `current` was always initialized from `KEYFRAMES[0]` (meadow values)
   - Even when the engine was created with Night Meadow or Storm Field keyframes
   - First frame of render showed meadow atmosphere before scrolling corrected it
   - Fixed: now initializes from `this.keyframes[0]` with meadow fallback for missing keys

### Audit Results

#### What's Working (Unique Per World)

| World | Unique Subsystems | Camera | Atmosphere Arc |
|-------|------------------|--------|----------------|
| Golden Meadow | 60K grass, 800 flowers, fireflies, dust, god rays, score sheets, artist figure, portal hints | S-curve, terrain-follow | STILLNESS→AWAKENING→ALIVE→DEEPENING→QUIETING |
| Night Meadow | 60K grass (dark), 400 fireflies (amber), 8K spectral stars + moon, score sheets | Slow push, low height | SILENCE→REMEMBRANCE→GRIEF→PEACE→ACCEPTANCE |
| Ocean Cliff | 20K grass, StylizedOcean (simplex foam), dusk stars, artist figure, score sheets | Arc orbit, cinematic lag | ARRIVAL→RECOGNITION→CONTEMPLATION→UNDERSTANDING→RELEASE |
| Storm Field | 50K grass (violent wind), 2000 rain streaks, lightning flashes, score sheets | Urgent push, camera shake | UNEASE→PURSUIT→TEMPEST→BREAK→REVELATION |
| Ghibli | 40K cel-shaded grass, 600 flowers, 300 petals, 150 dust, god rays, Kuwahara, artist figure, score sheets | Spiral, medium damping | WONDER→IMMERSION→RADIANCE→TRANSFIGURATION→TRANSCENDENCE |

#### Entry Page — Working
- Dithered 4-tone procedural flower (Bezier petals, Bayer 4x4 matrix)
- 6-layer cursor parallax (stem, back petals, front petals, center, stamen, text)
- Breathing animation (scale oscillation + flutter skew)
- Half-resolution render (`scale=0.5`, `image-rendering: pixelated`)
- Click → dissolve via dither threshold → `completeEntry()` → WebGL loads
- AudioContext confirmed on click (browser autoplay policy)

#### Atmosphere Keyframes — All Well-Crafted
Each world has 5 keyframes with meaningful emotional progression:
- Values interpolated via smoothstep between adjacent keyframes
- Peak emotional moment consistently at t=0.50
- Unique parameters driven per world (fireflies for Night, rain for Storm, Kuwahara for Ghibli)

#### Portal Transitions — Infrastructure Only
- `TransitionRenderer` + 5 GLSL transition types built
- `useWorldTransition` React hook ready
- **NOT wired into EnvironmentScene** — current world swap is instant (engine destroy + create)
- Full integration requires both engines alive simultaneously during 1.5s blend

### What's Broken / Missing (Needs Human Taste)

#### CRITICAL: Terrain is Identical for All Worlds
`TerrainPlane.js` uses a single `getTerrainHeight()` formula:
```
Math.sin(x * 0.02) * Math.cos(z * 0.015) * 2.0 + Math.sin(x * 0.05 + z * 0.03) * 0.5
```
Every world gets the same rolling hills shape. Only the vertex color changes.

The configs describe aspirational terrain types:
- Night Meadow: same meadow terrain ✓ (intentional — "same place, different time")
- Ocean Cliff: `simplex-layers-cliff` — should be cliff + flat ocean plane ✗
- Storm Field: `diamond-square` — should be sharp peaks/valleys ✗
- Ghibli: `simplex-layers-stylized` — should be stylized rolling hills ✗

**This is the biggest gap.** The terrain differentiation needs either:
1. Config-driven terrain formulas (pass height function to `createTerrain`)
2. Per-world terrain generators (separate functions for cliff, diamond-square, etc.)
3. Pre-generated heightmap textures

This requires **human taste** to decide which approach and what the terrain shapes should feel like.

#### Missing Assets
- 4 of 5 tracks have `src: null` (no MP3s for Ocean Cliff, Night Meadow, Ghibli, Storm Field)
- No .glb models (seated figure, walking figure, cliff geometry)
- Per-world content overlays are placeholder text only

#### Visual Gaps
- All worlds use Preetham sky model — Ghibli should have cel-dome, Storm should have overcast
- No volumetric/billboard clouds in any world
- Ocean Cliff ocean sits at y=-0.5 with meadow terrain on top — looks like water under a field, not a cliff
- Portal transitions are instant, not cinematic

### Build Status
- `npx vite build` passes (125 modules, 1.54s)
- Chunk size warning expected (Three.js)

### Files Changed (Step 10)
```
mod: src/environments/night-meadow.js (firefly count 800→400)
mod: src/meadow/StormFieldKeyframes.js (petalBrightness added to 4 keyframes)
mod: src/meadow/AtmosphereController.js (init from active keyframes, not meadow)
```

---

## Step 11: Genuinely Different Scenes — COMPLETE

### The Problem
Every world used the same `getTerrainHeight()` formula (rolling sine/cosine hills).
All worlds used Preetham sky. Flower colors were hardcoded. Worlds were the same
meadow with different colors — not genuinely different scenes.

### What Was Built

#### 1. Per-World Terrain Algorithms (`TerrainPlane.js`)
- **`createTerrain()` now returns `{ mesh, getHeight }`** — height function per world
- **Golden Meadow / Night Meadow**: `meadowHeight` — rolling sine/cosine hills (unchanged)
- **Ocean Cliff**: `oceanCliffHeight` — 8-10m plateau with sigmoid cliff drop at z=-30, rocky detail near edge, ocean floor at -1.5m. Camera is ON a cliff looking at infinity.
- **Storm Field**: `stormFieldHeight` — sharp angular V-peaks via `abs(sin)`. Higher frequency, less smoothing. Multiple ridge layers.
- **Ghibli Painterly**: `ghibliHeight` — softer, rounder hills (fewer octaves, more stylized)

#### 2. Per-World Terrain Vertex Colors
- **Ocean Cliff**: steep cliff faces get dark rock color, cliff-top gets earth color (from normal.y steepness)
- **Ghibli Painterly**: 4-band quantized vertex colors (deep shadow green → mid green → bright green → golden-green hilltop). Cel-shaded ground.

#### 3. Gradient Dome Sky (`MeadowScene.js`)
- **`sky.type === 'cel-dome'`** creates a vertex-colored sphere with zenith → mid → horizon gradient
- Replaces Preetham for Ghibli Painterly — looks like you walked into a Miyazaki painting
- Other worlds still use Preetham (appropriate for realistic/stylized split)

#### 4. Per-World Height Function Wiring
All 5 subsystems that used `getTerrainHeight` now accept per-world function:
- `CameraRig` — terrain following uses world's height function
- `GrassChunkManager` — grass blade placement on world's terrain
- `FlowerInstances` — flower placement on world's terrain
- `PortalHint` — portal placement on world's terrain
- `ArtistFigure` — figure placement on world's terrain

#### 5. Per-World Flower Palette
- `FlowerInstances` now reads `config.flowers.palette` for per-world colors
- **Ghibli**: vivid Miyazaki palette (#e85d75 pink, #f0a830 amber, #5bc0eb sky blue, #fde74c yellow, #ff6b6b coral, #7dcfb6 mint)
- **Golden Meadow**: default BotW palette (cream, poppy, marigold, cornflower, buttercup, sage)

#### 6. Ocean Cliff Scene Completion
- Ocean plane enlarged to 500x500 for infinity feel from cliff top
- Cliff terrain drops into water naturally (cliff floor -1.5m, water surface -0.5m)
- Camera arc at heightOffset 2.5m on 8-10m cliff = dramatic height

### Spatial Composition Summary

| World | Terrain | Camera | Feeling |
|-------|---------|--------|---------|
| Golden Meadow | Rolling hills (2m) | S-curve at 2.0m — walking through | Gentle, wandering |
| Ocean Cliff | 10m plateau + cliff drop | Arc at 2.5m on cliff — sitting at edge | Vast, contemplative |
| Night Meadow | Same as meadow | Slow push at 1.2m — IN the grass | Intimate, hidden |
| Storm Field | Sharp V-peaks (12m) | Urgent push at 1.0m with shake | Exposed, urgent |
| Ghibli Painterly | Soft hills + cel bands | Spiral at 2.5m | Dreamlike, vivid |

### Files Changed (Step 11)
```
mod: src/meadow/TerrainPlane.js (4 height algorithms, vertex colors, returns {mesh, getHeight})
mod: src/meadow/CameraRig.js (accepts per-world height function)
mod: src/meadow/WorldEngine.js (wires height function to all subsystems)
mod: src/meadow/MeadowScene.js (gradient dome sky for cel-dome type)
mod: src/meadow/GrassChunkManager.js (accepts per-world height function)
mod: src/meadow/FlowerInstances.js (accepts per-world height function + palette)
mod: src/meadow/PortalHint.js (accepts per-world height function)
mod: src/meadow/ArtistFigure.js (accepts per-world height function)
mod: src/environments/ocean-cliff.js (ocean size 500, waterLevel)
mod: src/environments/ghibli-painterly.js (vivid flower palette, 4 bands)
```

### Build Status
- `npx vite build` passes (125 modules, ~1.3s)
- Chunk size warning expected (Three.js)

---

## What's NOT Done Yet (Future Polish)
- Volumetric clouds (exp-010 proven but 44 FPS — needs half-res + TAAU for production)
- Billboard clouds (ghibli painterly)
- Full 3-pass anisotropic Kuwahara (tensor pass → kuwahara pass → composite — current is single-pass 8-sector)
- Wave-like grass wind (directional coherence for storm)
- Bezier flower geometry (glflower reference)
- Full dual-engine transition integration with EnvironmentScene
- .glb model assets (seated figure, walking figure, cliff geometry)
- Per-world content overlays (album cards, bio text, tour dates)
- Audio integration (ocean ambient, storm wind, night crickets)
- Remaining MP3s for non-meadow tracks (4 of 5 tracks have null src)
