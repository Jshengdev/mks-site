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
