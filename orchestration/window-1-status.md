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

## Next Steps

### Step 3: Night Meadow (lowest effort — same terrain, different time)
- Reuse SimplexLayers terrain, change colors/sky
- Night atmosphere shader (glsl-atmosphere)
- 800 fireflies, no flowers, slow wind
- Heavy bloom + grain + vignette
- Hand-tune atmosphere keyframes for night scroll arc

### Step 4: Ocean Cliff
- Two-part terrain (cliff + ocean plane)
- Stylized water shader (thaslle/stylized-water)
- Stars + dusk sky
- DOF focused on seated figure

### Step 5: Storm Field
- DiamondSquare terrain
- Rain particle system (velocity-stretched)
- Lightning system (screen flash + camera shake)
- Overcast sky, volumetric clouds
- Wave-like grass wind (new reference)

### Step 6: Ghibli Painterly (most complex)
- Cel-shaded everything (terrain, grass, sky)
- Kuwahara post-processing as primary visual
- Billboard clouds, Bezier flowers (new reference)
- Petal particles

### Step 7: Transition system
- gl-transitions GLSL dissolves between routes
- Render current + target to FBOs, blend
