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

## What's NOT Done Yet (Future Polish)
- Different terrain generators per world (diamond-square for storm, cliff for ocean)
- Volumetric clouds (Beer Shadow Maps — storm field)
- Billboard clouds (ghibli painterly)
- Cel-shaded sky dome (ghibli — currently uses Preetham)
- Wave-like grass wind (directional coherence for storm)
- Bezier flower geometry (glflower reference)
- Full dual-engine transition integration with EnvironmentScene
- .glb model assets (seated figure, walking figure, cliff geometry)
- Per-world content overlays (album cards, bio text, tour dates)
- Audio integration (ocean ambient, storm wind, night crickets)
