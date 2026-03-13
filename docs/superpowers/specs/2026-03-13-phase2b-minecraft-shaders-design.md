# Phase 2B: Minecraft-Shader-Inspired Visual Polish

**Date:** 2026-03-13
**Status:** Approved
**Scope:** SEUS-style color grade, SSAO, lens flare, grass root shadows, LUT cleanup, code simplification

---

## Context

Phase 2A added god rays, 3-zone depth fog, LUT color grading, DOF, and grass LOD. The LUT pipeline (S-Log2 baking, .cube parsing, Data3DTexture) repeatedly caused washout because camera LUTs are designed for real footage, not CG scenes. This phase replaces the LUT with a shader-based color grade (the technique every Minecraft shader pack actually uses) and adds three high-impact visual features inspired by SEUS, BSL, and Complementary shader packs.

## What's Being Built

### 1. SEUS-Style Color Grade Effect

**Replaces:** LUTColorGrade.js, SLog2EncodeEffect.js, slog2-encode.frag.glsl, all .cube files

**New files:**
- `src/meadow/shaders/color-grade.frag.glsl` — GLSL color grading shader
- `src/meadow/ColorGradeEffect.js` — pmndrs Effect wrapper

**Shader pipeline (6 techniques, applied in order):**

#### 1a. SEUS Cone Overlap (channel crosstalk)
Simulates human eye cone response. SEUS signature warm color bleed.
Source: SEUS Renewed v1.0.1 `final.fsh`

```glsl
const mat3 coneOverlap = mat3(
    1.0,   0.01,  0.001,
    0.01,  1.0,   0.004,
    0.001, 0.01,  1.0
);
// Apply: color = coneOverlap * color;  (mat3 * vec3, column vector)
// Inverse applied after grading to restore channel independence
```

#### 1b. Filmic S-Curve Contrast
Post-tonemap contrast boost from SEUS PTGI E3.

```glsl
// Hermite S-curve blended at 20% strength
color = mix(color, color * color * (3.0 - 2.0 * color), uContrast);
// Default uContrast: 0.2
```

#### 1c. Lift / Gamma / Gain
Per-channel shadow/midtone/highlight control. Tuned for golden hour.
Note: This uses the SEUS variant (lift as shadow push toward 1.0), NOT the ASC CDL formula.

| Parameter | Default | Purpose |
|-----------|---------|---------|
| Lift (shadows) | `vec3(0.02, 0.01, 0.0)` | Warm push in blacks |
| Gamma (midtones) | `vec3(1.0, 0.98, 0.95)` | Subtle warm shift |
| Gain (highlights) | `vec3(1.05, 1.0, 0.92)` | Amber push in brights |

Formula (SEUS variant — lift blends shadows toward 1.0, gain scales, gamma corrects):
```glsl
color = uGain * (color + uLift * (1.0 - color));
color = pow(color, 1.0 / uGamma);
```

#### 1d. Split Toning
Warm highlights + cool shadows. Colors derived from BSL evening palette.
Source: BSL v7.1.05 light colors.

| Parameter | Default | Source |
|-----------|---------|--------|
| Warm highlight | `vec3(0.925, 0.706, 0.518)` | BSL evening sun RGB(236, 180, 132) |
| Cool shadow | `vec3(0.831, 0.769, 0.894)` | BSL evening ambient RGB(212, 196, 228) |
| Balance | `0.5` | Neutral split at mid luminance |

```glsl
float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
vec3 warm = mix(color, color * uWarmColor, smoothstep(0.5, 1.0, luma) * uSplitIntensity);
vec3 cool = mix(color, color * uCoolColor, smoothstep(0.5, 0.0, luma) * uSplitIntensity);
color = warm + cool - color;
```

Default `uSplitIntensity`: 0.15

#### 1e. Vibrance (BSL formula)
Luminance-aware saturation boost. Pushes desaturated colors harder, protects saturated.
Source: BSL v7.1.05 `ColorSaturation()`.

```glsl
float mn = min(color.r, min(color.g, color.b));
float mx = max(color.r, max(color.g, color.b));
const float grayVibrance = 1.0;  // BSL default
float sat = (1.0 - (mx - mn)) * (1.0 - mx) * grayVibrance * 5.0;
vec3 lightness = vec3((mn + mx) * 0.5);
color = mix(color, mix(color, lightness, 1.0 - uVibrance), sat);
```

Default `uVibrance`: 1.15 (between BSL's 1.20 and Complementary's 1.07)

#### 1f. Dark Desaturation (Complementary)
Desaturates deep shadows for cinematic feel.
Source: Complementary Reimagined `DoCompTonemap()`.

```glsl
// Recompute luminance after vibrance has modified color
float lumaPost = dot(color, vec3(0.2126, 0.7152, 0.0722));
float desatPath = smoothstep(0.1, 0.0, lumaPost);
color = mix(color, vec3(lumaPost), desatPath * uDarkDesat);
```

Default `uDarkDesat`: 0.2

#### DevTuner Parameters (13 total)

| Group | Parameter | Type | Default | Range |
|-------|-----------|------|---------|-------|
| Color Grade | contrast | float | 0.2 | 0.0–0.5 |
| Color Grade | liftR / liftG / liftB | float | 0.02 / 0.01 / 0.0 | -0.1–0.1 |
| Color Grade | gammaR / gammaG / gammaB | float | 1.0 / 0.98 / 0.95 | 0.8–1.2 |
| Color Grade | gainR / gainG / gainB | float | 1.05 / 1.0 / 0.92 | 0.8–1.2 |
| Split Tone | splitIntensity | float | 0.15 | 0.0–0.5 |
| Vibrance | vibrance | float | 1.15 | 0.5–2.0 |
| Shadows | darkDesat | float | 0.2 | 0.0–1.0 |

---

### 2. SSAO (Screen-Space Ambient Occlusion)

**Purpose:** Grass base contact shadows. Blades read as grounded rather than floating.

**Implementation:** N8AO (pmndrs ecosystem). Added as a separate Pass before the EffectPass.

**New dependency:** `n8ao` (npm package)

**Config:**

| Parameter | Tier 1 | Tier 2 | Purpose |
|-----------|--------|--------|---------|
| aoRadius | 2.0 | 1.5 | World units — grass blade height |
| distanceFalloff | 0.4 | 0.4 | Prevent harsh AO edges |
| intensity | 1.5 | 1.0 | Visible but not overpowering |
| aoSamples | 8 | 4 | Quality vs performance |

**Integration:**
```js
import { N8AOPostPass } from 'n8ao'
const aoPass = new N8AOPostPass(scene, camera, width, height)
aoPass.configuration.aoRadius = 2.0
aoPass.configuration.aoSamples = 8
aoPass.configuration.distanceFalloff = 0.4
aoPass.configuration.intensity = 1.5
// Added AFTER GodraysPass, BEFORE EffectPass
```

**Resize handling:** `PostProcessingStack.setSize()` must call `aoPass.setSize(width, height)`. N8AOPostPass is a third-party pass — verify during implementation that EffectComposer does not auto-propagate resize to it.

**Dispose:** `PostProcessingStack.dispose()` must call `this.aoPass?.dispose()`.

**DevTuner params:** aoRadius, intensity, distanceFalloff

---

### 3. Lens Flare (Sun Burst Effect)

**Purpose:** Cinematic sun presence. Golden hour sun becomes "real."

**New files:**
- `src/meadow/shaders/lens-flare.frag.glsl` — screen-space lens flare
- `src/meadow/LensFlareEffect.js` — pmndrs Effect wrapper

**Technique (from ektogamat's vanilla Three.js implementation):**
1. Sun screen position computed in JS via `sunWorldPos.clone().project(camera)`, converted to UV: `uv = (clip.xy * 0.5 + 0.5)`. Passed as `uSunScreenPos` uniform. Updated each frame in `PostProcessingStack.update()`.
2. Star burst: 6-point radial pattern with angular falloff
3. Ghost reflections: 3 ghosts along sun→screen-center line, decreasing size (0.3 spacing)
4. Occlusion fade: `uSunVisible` (0-1) computed from dot product of camera forward with sun direction, clamped. Fades when sun is off-screen or behind camera.
5. Color: warm amber `vec3(1.0, 0.9, 0.7)` matching sun color

**Config:**

| Parameter | Default | Type | Purpose |
|-----------|---------|------|---------|
| intensity | 0.3 | float | Subtle, not JJ Abrams |
| starPoints | 6 | int (compile-time constant) | Radial arms |
| ghostCount | 3 | int (compile-time constant) | Secondary reflections |
| ghostSpacing | 0.3 | float | Spread along ray |

**Note:** `starPoints` and `ghostCount` are compile-time `#define` constants in the shader, not runtime uniforms. Changing them requires shader recompilation. DevTuner exposes `intensity` and `ghostSpacing` as live floats only.

**Uniforms:** `uSunScreenPos` (vec2), `uSunVisible` (float, 0-1), `uIntensity` (float), `uGhostSpacing` (float)

**Tier gating:** Tier 1 only. Disabled on Tier 2.

**DevTuner params:** intensity, ghostSpacing

---

### 4. Grass Root Shadow Enhancement

**Purpose:** Deepen grass-terrain contact shadow. Free performance (shader constant change).

**File:** `src/meadow/shaders/grass.frag.glsl`

**Change:**
```glsl
// Before (Phase 1):
col = mix(0.35 * uBaseColor, col, smoothstep(0.0, 0.3, vElevation));

// After (Phase 2B):
col = mix(0.2 * uBaseColor, col, smoothstep(0.0, 0.45, vElevation));
```

- Root darkness: 0.35 → 0.2 (darker)
- Shadow band: 0.3 → 0.45 elevation (wider)
- Combined with SSAO, creates compelling ground attachment

---

### 5. Cleanup — Delete LUT Pipeline

**Delete files:**
- `src/meadow/LUTColorGrade.js`
- `src/meadow/SLog2EncodeEffect.js`
- `src/meadow/shaders/slog2-encode.frag.glsl`
- `src/assets/luts/slog3-base.cube`
- `src/assets/luts/neutral-a7s3-sl2-65x.cube`

**Update files:**
- `PostProcessingStack.js` — remove LUT imports, replace with ColorGradeEffect
- `DevTuner.jsx` — replace LUT panel (intensity + load .cube) with Color Grade panel (13 params) + SSAO panel + Lens Flare panel

---

### 6. Code Simplification Pass

After all features are integrated, run a code simplification pass across the meadow pipeline:
- Remove dead imports and unused variables
- Consolidate duplicate shader patterns
- Simplify DevTuner parameter wiring
- Ensure consistent module patterns across all effect files
- Remove any commented-out or dead code from Phase 2A iterations

---

## Post-Processing Pipeline Order

```
1. RenderPass (scene render)
2. GodraysPass (volumetric light shafts)
3. N8AOPostPass (ambient occlusion)
4. EffectPass:
   a. BloomEffect
   b. FogDepthEffect (3-zone)
   c. ColorGradeEffect (replaces LUT)
   d. LensFlareEffect (Tier 1 only)
   e. ChromaticAberrationEffect
   f. VignetteEffect
   g. DepthOfFieldEffect (Tier 1 only)
   h. NoiseEffect (grain — MUST be last, so DOF doesn't blur the grain)
```

## Tier Strategy

| Feature | Tier 1 (Full) | Tier 2 (Reduced) | Tier 3 (CSS) |
|---------|---------------|-------------------|---------------|
| Color Grade | Full 6-technique | Full 6-technique | None |
| SSAO | 8 samples, radius 2.0 | 4 samples, radius 1.5 | None |
| Lens Flare | Enabled | Disabled | None |
| Root Shadows | Enhanced | Enhanced | None |

## Dependencies

- **New:** `n8ao` (SSAO pass)
- **Removed:** no packages removed (postprocessing stays, LUT3DEffect just unused)

## DevTuner Panel Updates

Replace the "LUT" panel with:
- **Color Grade** panel: contrast, lift (RGB), gamma (RGB), gain (RGB), split intensity, vibrance, dark desat
- **SSAO** panel: aoRadius, intensity, distanceFalloff
- **Lens Flare** panel: intensity, ghostSpacing

## Risk

| Risk | Mitigation |
|------|------------|
| N8AO performance on Tier 2 | Reduced samples (4), smaller radius (1.5) |
| Lens flare looks cheesy | Start at 0.3 intensity, 6-point star, DevTuner adjustable |
| Color grade values don't match scene | All 13 params exposed in DevTuner, values from real shader packs |
| Effect ordering matters in EffectPass | ColorGrade after FogDepth (grade the fogged scene), LensFlare after grade (flare is optical, not scene color), Grain must be last (DOF must not blur grain) |
| N8AO resize not propagated | Explicitly call `aoPass.setSize()` in `PostProcessingStack.setSize()` |
