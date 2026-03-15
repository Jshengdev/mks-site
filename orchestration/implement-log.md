# Implement Log

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
