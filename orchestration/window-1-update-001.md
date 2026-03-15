# Window 1 — Update 001: New References + Engine Abstraction

**Date:** 2026-03-14
**Step completed:** Step 2 (Abstract shared engine)

---

## New References to Integrate

### Bezier Flowers (glflower repo)
- **Source:** glflower — procedural Bezier curve flower geometry
- **What to steal:** Flower petals as Bezier surfaces instead of current cylinder+sphere procedural geometry
- **Target:** FlowerInstances.js replacement geometry, per-environment flower palettes
- **Integration point:** `envConfig.flowers.type: 'bezier'` in env configs
- **Priority:** Step 3+ (after Night Meadow has basic rendering)

### Volumetric Clouds
- **Source:** Beer Shadow Maps, 4-layer cloud system
- **What to steal:** Raymarched cloud density, Beer-Lambert absorption, light scattering
- **Target:** Storm Field (`sky.clouds.type: 'volumetric'`), Ghibli Painterly (`sky.clouds.type: 'billboard'`)
- **Integration point:** New `CloudSystem` subsystem, toggled by `envConfig.sky.clouds`
- **Priority:** Step 5 (Storm Field) and Step 6 (Ghibli Painterly)
- **Notes:** Storm field needs 70% coverage heavy overcast. Ghibli needs flat billboard clouds. Different implementations.

### Wave-like Grass Wind
- **Source:** Ocean wave displacement patterns applied to grass wind
- **What to steal:** Sine-based wave propagation across grass field (direction + phase offset)
- **Target:** grass.vert.glsl wind layer, configurable via `envConfig.grass.windSpeed` and new `envConfig.grass.bendStrength`
- **Integration point:** Existing 4-layer wind system in grass shader — add 5th "wave" layer
- **Priority:** Step 5 (Storm Field — violent wave wind with `bendStrength: 0.8`)
- **Notes:** Current wind is procedural noise-based. Wave wind adds directional coherence — grass bends in visible traveling waves, not random flutter. Critical for storm field drama.

---

## Step 2 Implementation Summary

### What was built

**WorldEngine** (`src/meadow/WorldEngine.js`) — config-driven generic engine:
- Accepts `(canvas, envConfig)` — any environment config drives what gets rendered
- Conditionally creates subsystems based on config flags:
  - Grass: `envConfig.grass.enabled`, blade count scaled by performance tier
  - Flowers: `envConfig.flowers.enabled`
  - Fireflies: `envConfig.particles.fireflies.enabled`
  - Dust motes: `envConfig.particles.dust.enabled`
  - God rays: `envConfig.postFX.godRays.enabled`
  - Score sheets: `envConfig.scoreSheets.enabled`
  - Artist figure: `envConfig.figure.enabled`
  - Portals: golden-meadow only (for now)
- Null-safe tick loop — only updates subsystems that exist

**CameraRig** now config-driven:
- Control points from `envConfig.camera.controlPoints`
- FOV, damping factor, height offset from config
- Camera shake support (storm field: `envConfig.camera.shake`)

**AtmosphereController** now configurable:
- Accepts optional keyframes in constructor
- Golden meadow uses existing 5-keyframe scroll arc (MEADOW_KEYFRAMES)
- Other environments get static keyframes auto-generated from their config values
- Null-safe subsystem pushes (grass, fireflies, cloud shadows can be null)
- Exports `MEADOW_KEYFRAMES` for reuse

**MeadowScene.setupScene()** now config-aware:
- Sky params (turbidity, rayleigh, mie, sun elevation) from `envConfig.sky`
- Lighting colors/intensities from `envConfig.lighting`
- Fog color/density from `envConfig.fog`
- Falls back to golden meadow defaults when no config provided

**MeadowEngine** → thin wrapper:
- `class MeadowEngine extends WorldEngine` — passes golden-meadow config
- Backward-compatible API for DevTuner, existing references

**EnvironmentScene** updated:
- All environments now use `WorldEngine` — no more placeholder stubs
- Every world gets real 3D rendering (Preetham sky + terrain + configured subsystems)
- Non-meadow worlds show emotional identity text over live canvas

### Build
- `npx vite build` passes (116 modules, 1.31s)
- No new dependencies

### Architecture after Step 2

```
Environment Config (e.g., ocean-cliff.js)
    ↓
WorldEngine(canvas, config)
    ├── CameraRig(camera, config.camera)
    ├── setupScene(scene, config)  [sky + lights]
    ├── createTerrain(scene)       [shared for now — future: config.terrain.type]
    ├── CloudShadows(scene)
    ├── GrassChunkManager?         [if config.grass.enabled]
    ├── FireflySystem?             [if config.particles.fireflies.enabled]
    ├── FlowerInstances?           [if config.flowers.enabled]
    ├── DustMotes?                 [if config.particles.dust.enabled]
    ├── GodRayPass?                [if config.postFX.godRays.enabled]
    ├── ScoreSheetCloth?           [if config.scoreSheets.enabled]
    ├── ArtistFigure?              [if config.figure.enabled]
    ├── PortalHint?                [golden-meadow only]
    ├── PostProcessingStack        [always]
    ├── AtmosphereController       [keyframes from config or auto-generated]
    ├── CursorInteraction          [always]
    └── AudioReactive              [always]
```

### What's NOT done yet (Step 3+)
- Different terrain types (diamond-square, cliff+ocean)
- Different sky types (night-atmosphere, cel-dome, overcast)
- Ocean plane / water shader
- Rain / spray particle systems
- Lightning system
- Star field rendering
- Cel-shaded grass / Kuwahara as primary visual
- Per-environment atmosphere keyframe tuning (only golden meadow has scroll arc)
- Bezier flower geometry
- Volumetric clouds
- Wave-like grass wind
