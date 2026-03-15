# Test Results — 2026-03-15 (Run 22)

## 1. Build Status: PASS

```
vite v7.3.1 — 147 modules transformed — built in 1.59s
```

| Asset | Size | Gzip |
|-------|------|------|
| index.js | 1,098.67 KB | 288.96 KB |
| index.css | 13.02 KB | 3.42 KB |
| index.html | 0.90 KB | 0.52 KB |
| In a Field of Silence.mp3 | 11,106.87 KB | — |
| Textures (3) | 278.91 KB | — |

**Delta from Run 21:** Module count 142→147 (+5). Bundle size 1,081→1,098 KB (+17 KB). Build time 1.69→1.59s (faster).

**Warning:** JS bundle exceeds 500 KB. Code splitting via dynamic imports needed before production (known issue).

## 2. Recent Commits

```
854795d feat: volumetric cumulus clouds — ray-marched 3D Perlin-Worley for Storm Field (exp-011, 49/70)
ee65bcb feat: Golden Meadow GOLDEN RUINS atmosphere arc — multiplicative convergence (exp-058, 67/70)
02e9961 feat: atmosphere-driven chromatic aberration — per-world lens distortion (exp-059, 71/70)
7c9b6a0 feat: Ocean Cliff exp-082 V5 dissolution — ocean vividity arc + star/wind narrative (67/70)
afb7e2e feat: Ocean Cliff V5 RELEASE dissolve + fix ocean interpolation (64.8/70)
```

**HEAD:** `854795d` — 1 new commit since Run 21 (volumetric cumulus clouds for Storm Field).

## 3. Integration Log

`orchestration/implement-log.md` **does not exist.** No integration log to verify against.

## 4. Environment Config Validation

### Registry Status (index.js)

**17 config files on disk. 13 registered in ENVIRONMENTS + ENV_ORDER. 4 unregistered.**

| Config | In ENVIRONMENTS | In ENV_ORDER | Route | Status |
|--------|:-:|:-:|-------|--------|
| golden-meadow.js | YES | YES | `/` | PASS |
| ocean-cliff.js | YES | YES | `/listen` | PASS |
| night-meadow.js | YES | YES | `/story` | PASS |
| ghibli-painterly.js | YES | YES | `/collect` | PASS |
| storm-field.js | YES | YES | `/witness` | PASS |
| volcanic-observatory.js | YES | YES | `/observe` | PASS |
| floating-library.js | YES | YES | `/archive` | PASS |
| crystal-cavern.js | YES | YES | `/resonate` | PASS |
| memory-garden.js | YES | YES | `/remember` | PASS |
| tide-pool.js | YES | YES | `/wonder` | PASS |
| clockwork-forest.js | YES | YES | `/forge` | PASS |
| aurora-tundra.js | YES | YES | `/aurora` | PASS |
| infinite-staircase.js | YES | YES | `/ascend` | PASS |
| bioluminescent-deep.js | NO | NO | `/immerse` | UNREGISTERED |
| paper-world.js | NO | NO | `/fold` | UNREGISTERED |
| sonic-void.js | NO | NO | `/dissolve` | UNREGISTERED |
| underwater-cathedral.js | NO | NO | `/devotion` | UNREGISTERED |

**Delta from Run 21:** No registry changes. 4 unregistered configs remain.

### All 17 Configs — Static Value Validation

**All 17 configs: No NaN, no undefined, no missing required fields.**

Every config validated for: `id`, `name`, `route`, `emotion`, `terrain.type`, `sky`, `grass`, `particles`, `lighting` (sunColor, sunIntensity, ambientIntensity), `fog` (near, far, color, density), `postFX` (bloom, grain, vignette, ca, toneMapping), `camera` (pathType, heightOffset/fov, controlPoints), `audio.track` (title, artist, album, src), `dominantColor`.

All numeric values within sensible ranges. No negative counts. No empty arrays where data expected. All hex colors valid. All `audio.track.src: null` (except golden-meadow, resolved via ES import).

### Minor inconsistencies (no runtime impact)

- `postFX.colorGrade` appears in floating-library, sonic-void, aurora-tundra configs with different shapes — non-standard extensions ignored by WorldEngine
- Speculative custom effects (`prismaticDispersion`, `causticOverlay`, `heatDistortion`, `underwaterTint`, `pressureDistortion`) have no PostProcessingStack consumer — harmless dead config
- `postFX.colorGrade.splitToneWarm/splitToneCool` (aurora-tundra) vs `splitTone.shadowHue/highlightHue` (sonic-void) — inconsistent naming across unregistered configs

## 5. Keyframe Parameter Coverage — BUG CONFIRMED (persists from Run 20)

### The Bug: `caDistortion` missing from 5 registered keyframe files

**SEVERITY: HIGH (runtime NaN → visual corruption)**

**Verified via code trace (Run 22 — unchanged):**

1. `PARAM_KEYS = Object.keys(KEYFRAMES[0])` (AtmosphereController.js:295) — includes `caDistortion`
2. Interpolation loop (line 354-358): `lerpScalar(prev[key], next[key], eased)` — NO fallback for undefined
3. Consumer (line 502-504): `if (pp.ca) { pp.ca.uniforms.get('uDistortion').value = c.caDistortion }` — guard checks CA exists, NOT for NaN
4. `lerpScalar(undefined, undefined, t)` → NaN → `uDistortion = NaN` → broken CA shader output

**Affected keyframe files (5 registered worlds):**

| Keyframe File | World | Missing `caDistortion` | Confirmed |
|--------------|-------|:---:|:---:|
| VolcanicObservatoryKeyframes.js | volcanic-observatory | YES | Run 22 ✓ |
| FloatingLibraryKeyframes.js | floating-library | YES | Run 22 ✓ |
| CrystalCavernKeyframes.js | crystal-cavern | YES | Run 22 ✓ |
| MemoryGardenKeyframes.js | memory-garden | YES | Run 22 ✓ |
| TidePoolKeyframes.js | tide-pool | YES | Run 22 ✓ |

**NOT affected (8 registered files have `caDistortion`):**
Core 5 + ClockworkForest, AuroraTundra, InfiniteStaircase

### Secondary Finding: `cloudCoverage/cloudDensity/cloudIntensity` missing from ALL world keyframes

**SEVERITY: LOW (guarded at consumption)**

These 3 params exist in master KEYFRAMES[0] but in ZERO world keyframe files. All worlds produce NaN during interpolation. However:
- Consumer `this.volumetricClouds.setCoverage()` guarded by `if (this.volumetricClouds)` — only instantiated for Storm Field
- `WorldEngine.js` uses `?? 0` guards on cloud params

**No visual impact currently. Will need fixing when volumetric clouds are wired to additional worlds.**

### Recommended Fix (both bugs)

**Option B (defensive, recommended):** Add fallback in AtmosphereController.js interpolation loop:
```js
// Line 358 — change from:
this.current[key] = lerpScalar(prev[key], next[key], eased)
// To:
this.current[key] = lerpScalar(prev[key] ?? 0, next[key] ?? 0, eased)
```
This prevents NaN from ANY future missing param. Do the same for `lerpArrayInto`.

**Root cause:** exp-059 (commit `02e9961`) added `caDistortion` to master KEYFRAMES and core 5 world keyframes but missed 5 newer world keyframes.

## 6. DevTuner Slider Coverage: ALL IMPLEMENTED UNIFORMS COVERED

### Current sliders (~82 params across 20 groups)

| Section | Params | Conditional | Status |
|---------|:---:|:-:|--------|
| Navigation | 1 | No | OK |
| Renderer (exposure) | 1 | No | OK |
| Sky & Lighting | 7 | No | OK |
| Fog | 2 | No | OK |
| Post-Processing | 7 | No | OK |
| Grass (inc. wave wind) | 11 | No | OK |
| Fireflies | 2 | No | OK |
| Cloud Shadows | 1 | No | OK |
| Camera | 3 | No | OK |
| Ocean | 8 | Yes | OK |
| Volumetric Clouds | 5 | Yes | OK |
| God Rays | 5 | Yes | OK |
| 3-Zone Fog | 6 | Yes | OK |
| Color Grade SEUS | 15 | Yes | OK |
| SSAO | 3 | Yes | OK |
| Kuwahara | 2 | Yes | OK |
| Dust Motes | 2 | Yes | OK |
| Cursor | 2 | No | OK |
| Score Sheets | 1 | Yes | OK |
| DOF | 3 | Yes | OK |
| LOD | 1 | No | OK |

### Volumetric Clouds sliders: NEW (Run 22)

DevTuner conditionally renders Volumetric Clouds section (lines 370-406) when `volumetricClouds` exists in engine API. Covers: Coverage, Density Scale, Composite Intensity, Cloud Bottom, Cloud Top. **Matches commit 854795d.**

### New world subsystems without DevTuner sliders

Lava, crystals, aurora, caustics, anemones, bioluminescence, audio-reactive geometry, stained glass — all exist in configs but have no WorldEngine implementation or DevTuner sliders yet. **Not a bug — sliders added when subsystems are built.**

## 7. Known Issues

| # | Severity | Issue | Status |
|---|----------|-------|--------|
| 1 | **HIGH** | `caDistortion` missing from 5 registered keyframe files → NaN at runtime | **OPEN — needs fix** |
| 2 | LOW | `cloudCoverage/cloudDensity/cloudIntensity` NaN in all worlds (guarded) | OPEN — harmless now |
| 3 | WARN | JS bundle 1,098 KB — needs code splitting | Known, pre-production |
| 4 | WARN | Audio asset 11.1 MB — needs streaming/lazy-load | Known, pre-production |
| 5 | INFO | 12/13 tracks have `src: null` — only golden-meadow has audio | Awaiting MP3 assets |
| 6 | INFO | 4 orphan configs not in index.js (bioluminescent-deep, paper-world, sonic-void, underwater-cathedral) | Aspirational / WIP |
| 7 | INFO | New world subsystems not yet in WorldEngine | By design — configs ahead of engine |

## 8. Summary

| Check | Result | Delta from Run 21 |
|-------|--------|-------------------|
| Build | **PASS** — 147 modules, 1.59s | +5 modules, +17 KB, faster |
| Config validity (13 registered) | **PASS** — all values clean | No change |
| Config validity (4 unregistered) | **PASS** — valid JS | No change |
| Registry | **PASS** — 13 in ENVIRONMENTS + ENV_ORDER | No change |
| Keyframe `caDistortion` | **FAIL** — 5 files missing param | Unchanged — still needs fix |
| Keyframe cloud params | **WARN** — all files missing, but guarded | Unchanged |
| DevTuner coverage | **PASS** — ~82 sliders, all wired | +5 volumetric cloud sliders |
| Bundle size | **WARN** — 1,098 KB JS | +17 KB (volumetric clouds) |

**VERDICT: BUILD PASSES (147 modules, 1.59s). One HIGH-severity keyframe bug persists (5 worlds missing `caDistortion` → runtime NaN in CA shader). New volumetric clouds commit (854795d) adds 5 modules (+17 KB) with full DevTuner coverage. All 17 environment configs are structurally valid — no NaN, no undefined, no missing required fields. Recommended fix: defensive `?? 0` fallback in AtmosphereController.js interpolation loop.**
