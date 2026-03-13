# Phase 2B: Minecraft-Shader Visual Polish — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace broken LUT pipeline with SEUS-style shader color grade, add SSAO + lens flare + grass root shadows, then simplify codebase.

**Architecture:** 3 parallel tmux workers create isolated modules (no shared file edits). Post-merge integration wires everything into PostProcessingStack.js + DevTuner.jsx, deletes LUT code, and runs code simplification.

**Tech Stack:** Three.js, pmndrs/postprocessing (Effect class), n8ao, GLSL, React 19

**Spec:** `docs/superpowers/specs/2026-03-13-phase2b-minecraft-shaders-design.md`

---

## Worker Split

| Worker | Scope | Output Files | Touches Existing? |
|--------|-------|-------------|-------------------|
| W1 | SEUS Color Grade | `ColorGradeEffect.js`, `shaders/color-grade.frag.glsl` | NO |
| W2 | SSAO + Grass Root Shadow | `SSAOSetup.js`, `shaders/grass.frag.glsl` | grass.frag.glsl only |
| W3 | Lens Flare | `LensFlareEffect.js`, `shaders/lens-flare.frag.glsl` | NO |
| Post-merge | Integration + Cleanup + Simplification | `PostProcessingStack.js`, `DevTuner.jsx`, delete LUT files | YES |

---

## Chunk 1: Worker Modules (Parallel)

### Task 1: W1 — SEUS-Style Color Grade Effect

**Files:**
- Create: `src/meadow/shaders/color-grade.frag.glsl`
- Create: `src/meadow/ColorGradeEffect.js`

- [ ] **Step 1: Write the GLSL shader**

Create `src/meadow/shaders/color-grade.frag.glsl`:

```glsl
// SEUS-style color grading — 6-technique pipeline
// Sources: SEUS Renewed v1.0.1, BSL v7.1.05, Complementary Reimagined
// Operates on post-tonemapped display values (0-1 sRGB)

// Cone overlap (SEUS Renewed final.fsh)
uniform float uContrast;         // 0.2 — S-curve blend strength
uniform vec3 uLift;              // vec3(0.02, 0.01, 0.0) — shadow push
uniform vec3 uGamma;             // vec3(1.0, 0.98, 0.95) — midtone shift
uniform vec3 uGain;              // vec3(1.05, 1.0, 0.92) — highlight scale
uniform vec3 uWarmColor;         // vec3(0.925, 0.706, 0.518) — BSL evening sun
uniform vec3 uCoolColor;         // vec3(0.831, 0.769, 0.894) — BSL evening ambient
uniform float uSplitIntensity;   // 0.15
uniform float uVibrance;         // 1.15
uniform float uDarkDesat;        // 0.2

// SEUS cone overlap matrix (simulates eye cone response crosstalk)
const mat3 coneOverlap = mat3(
    1.0,   0.01,  0.001,
    0.01,  1.0,   0.004,
    0.001, 0.01,  1.0
);
// Precomputed inverse (Cramer's rule on the above)
const mat3 coneOverlapInv = mat3(
    1.000089, -0.009996, -0.000910,
    -0.009996, 1.000085, -0.003906,
    -0.000910, -0.009996, 1.000089
);

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 color = max(inputColor.rgb, 0.0);

    // 1. Cone overlap — warm channel bleed (SEUS signature)
    color = coneOverlap * color;

    // 2. Filmic S-curve contrast (SEUS PTGI E3)
    // Hermite smoothstep S-curve blended at uContrast strength
    color = mix(color, color * color * (3.0 - 2.0 * color), uContrast);

    // 3. Lift/Gamma/Gain (SEUS variant — lift blends shadows toward 1.0)
    color = uGain * (color + uLift * (1.0 - color));
    color = pow(max(color, 0.001), 1.0 / uGamma);

    // 4. Split toning — warm highlights + cool shadows (BSL evening palette)
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    vec3 warm = mix(color, color * uWarmColor, smoothstep(0.5, 1.0, luma) * uSplitIntensity);
    vec3 cool = mix(color, color * uCoolColor, smoothstep(0.5, 0.0, luma) * uSplitIntensity);
    color = warm + cool - color;

    // 5. Vibrance — luminance-aware saturation (BSL ColorSaturation)
    float mn = min(color.r, min(color.g, color.b));
    float mx = max(color.r, max(color.g, color.b));
    const float grayVibrance = 1.0;
    float grayV = (color.r + color.g + color.b) / 3.0;
    float sat = (1.0 - (mx - mn)) * (1.0 - mx) * grayV * 5.0;
    vec3 lightness = vec3((mn + mx) * 0.5);
    color = mix(color, mix(color, lightness, 1.0 - uVibrance), sat);

    // 6. Dark desaturation (Complementary Reimagined)
    float lumaPost = dot(color, vec3(0.2126, 0.7152, 0.0722));
    float desatPath = smoothstep(0.1, 0.0, lumaPost);
    color = mix(color, vec3(lumaPost), desatPath * uDarkDesat);

    // Restore channel independence
    color = coneOverlapInv * color;

    outputColor = vec4(clamp(color, 0.0, 1.0), inputColor.a);
}
```

- [ ] **Step 2: Write the Effect wrapper**

Create `src/meadow/ColorGradeEffect.js`:

```js
// ColorGradeEffect — SEUS-style shader color grading
// Replaces the LUT pipeline with direct GLSL math
// Sources: SEUS Renewed, BSL, Complementary Reimagined
import { Effect, BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import fragmentShader from './shaders/color-grade.frag.glsl?raw'

const DEFAULTS = {
  contrast: 0.2,
  lift: new THREE.Vector3(0.02, 0.01, 0.0),
  gamma: new THREE.Vector3(1.0, 0.98, 0.95),
  gain: new THREE.Vector3(1.05, 1.0, 0.92),
  warmColor: new THREE.Vector3(0.925, 0.706, 0.518),
  coolColor: new THREE.Vector3(0.831, 0.769, 0.894),
  splitIntensity: 0.15,
  vibrance: 1.15,
  darkDesat: 0.2,
}

export function createColorGradeEffect() {
  const effect = new Effect('ColorGrade', fragmentShader, {
    blendFunction: BlendFunction.NORMAL,
    uniforms: new Map([
      ['uContrast', new THREE.Uniform(DEFAULTS.contrast)],
      ['uLift', new THREE.Uniform(DEFAULTS.lift.clone())],
      ['uGamma', new THREE.Uniform(DEFAULTS.gamma.clone())],
      ['uGain', new THREE.Uniform(DEFAULTS.gain.clone())],
      ['uWarmColor', new THREE.Uniform(DEFAULTS.warmColor.clone())],
      ['uCoolColor', new THREE.Uniform(DEFAULTS.coolColor.clone())],
      ['uSplitIntensity', new THREE.Uniform(DEFAULTS.splitIntensity)],
      ['uVibrance', new THREE.Uniform(DEFAULTS.vibrance)],
      ['uDarkDesat', new THREE.Uniform(DEFAULTS.darkDesat)],
    ]),
  })

  return {
    effect,
    // Convenience setters for DevTuner
    uniforms: effect.uniforms,
    dispose() { effect.dispose() },
  }
}
```

- [ ] **Step 3: Verify module compiles**

From worktree root:
```bash
npx vite build 2>&1 | tail -5
```
Expected: Build succeeds (module is created but not yet imported by PostProcessingStack)

- [ ] **Step 4: Write DONE.md**

Write `DONE.md` listing output files and integration notes.

---

### Task 2: W2 — SSAO Setup + Grass Root Shadow

**Files:**
- Create: `src/meadow/SSAOSetup.js`
- Modify: `src/meadow/shaders/grass.frag.glsl:83`

**Dependencies:** n8ao must be installed in main branch BEFORE creating worktrees (so all worktrees inherit it). See Launch Sequence.

**N8AO Compatibility Note:** N8AOPostPass extends Three.js's `Pass`, not pmndrs/postprocessing's `Pass`. Verify at integration time that pmndrs EffectComposer accepts it. If it fails, use pmndrs/postprocessing's built-in `SSAOEffect` as fallback (add to EffectPass instead of as separate pass).

- [ ] **Step 1: Write SSAOSetup.js**

Create `src/meadow/SSAOSetup.js`:

```js
// SSAOSetup — Screen-space ambient occlusion via N8AO
// Adds grass contact shadows. Pass (not Effect) — added to composer directly.
import { N8AOPostPass } from 'n8ao'

export function createSSAO(scene, camera, width, height, tier) {
  const isReduced = tier === 'reduced'

  const pass = new N8AOPostPass(scene, camera, width, height)
  pass.configuration.aoRadius = isReduced ? 1.5 : 2.0
  pass.configuration.distanceFalloff = 0.4
  pass.configuration.intensity = isReduced ? 1.0 : 1.5
  pass.configuration.aoSamples = isReduced ? 4 : 8

  return {
    pass,
    setSize(w, h) { pass.setSize(w, h) },
    dispose() { pass.dispose() },
  }
}
```

- [ ] **Step 3: Enhance grass root shadow**

In `src/meadow/shaders/grass.frag.glsl` line 83, change:

```glsl
// Before:
col = mix(0.35 * uBaseColor, col, smoothstep(0.0, 0.3, vElevation));

// After:
col = mix(0.2 * uBaseColor, col, smoothstep(0.0, 0.45, vElevation));
```

- [ ] **Step 4: Write DONE.md**

---

### Task 3: W3 — Lens Flare Effect

**Files:**
- Create: `src/meadow/shaders/lens-flare.frag.glsl`
- Create: `src/meadow/LensFlareEffect.js`

- [ ] **Step 1: Write the GLSL shader**

Create `src/meadow/shaders/lens-flare.frag.glsl`:

```glsl
// Screen-space lens flare — sun burst + ghost reflections
// Adapted from ektogamat's vanilla Three.js lens flare
// Technique: radial star burst + ghost discs along sun-center ray

uniform vec2 uSunScreenPos;   // UV coords of sun on screen (0-1)
uniform float uSunVisible;    // 0-1 occlusion fade
uniform float uIntensity;     // 0.3 default
uniform float uGhostSpacing;  // 0.3 default

#define STAR_POINTS 6
#define GHOST_COUNT 3

// Star burst pattern — N-point radial arms
float starBurst(vec2 uv, vec2 sunPos) {
    vec2 delta = uv - sunPos;
    float dist = length(delta);
    float angle = atan(delta.y, delta.x);

    // N-point star
    float star = pow(abs(cos(angle * float(STAR_POINTS) / 2.0)), 64.0);
    // Radial falloff
    float falloff = 1.0 / (1.0 + dist * 8.0);

    return star * falloff;
}

// Single ghost disc
float ghostDisc(vec2 uv, vec2 center, float radius) {
    float d = length(uv - center);
    return smoothstep(radius, radius * 0.5, d) * 0.15;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    if (uSunVisible < 0.01 || uIntensity < 0.01) {
        outputColor = inputColor;
        return;
    }

    vec2 sunPos = uSunScreenPos;
    vec3 flareColor = vec3(1.0, 0.9, 0.7); // warm amber

    // Star burst
    float star = starBurst(uv, sunPos) * 0.6;

    // Ghost reflections along sun→center ray
    vec2 ghostDir = vec2(0.5) - sunPos;
    float ghosts = 0.0;
    for (int i = 0; i < GHOST_COUNT; i++) {
        float t = uGhostSpacing * (float(i) + 1.0);
        vec2 ghostPos = sunPos + ghostDir * t;
        float radius = 0.04 + float(i) * 0.02;
        ghosts += ghostDisc(uv, ghostPos, radius);
    }

    // Halo ring around sun
    float sunDist = length(uv - sunPos);
    float halo = smoothstep(0.3, 0.2, sunDist) * smoothstep(0.15, 0.2, sunDist) * 0.2;

    // Combine
    float flare = (star + ghosts + halo) * uIntensity * uSunVisible;
    vec3 result = inputColor.rgb + flareColor * flare;

    outputColor = vec4(result, inputColor.a);
}
```

- [ ] **Step 2: Write the Effect wrapper**

Create `src/meadow/LensFlareEffect.js`:

```js
// LensFlareEffect — Screen-space sun burst + ghost reflections
// Adapted from ektogamat's vanilla Three.js lens flare
// Sun screen position computed in JS, passed as uniform
import { Effect, BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import fragmentShader from './shaders/lens-flare.frag.glsl?raw'

export function createLensFlareEffect(sunPosition, camera) {
  const effect = new Effect('LensFlare', fragmentShader, {
    blendFunction: BlendFunction.NORMAL,
    uniforms: new Map([
      ['uSunScreenPos', new THREE.Uniform(new THREE.Vector2(0.5, 0.5))],
      ['uSunVisible', new THREE.Uniform(0.0)],
      ['uIntensity', new THREE.Uniform(0.3)],
      ['uGhostSpacing', new THREE.Uniform(0.3)],
    ]),
  })

  const _sunWorld = sunPosition.clone().multiplyScalar(1000)
  const _projected = new THREE.Vector3()

  function update(camera) {
    _projected.copy(_sunWorld).project(camera)

    // Check if sun is in front of camera
    const visible = _projected.z < 1.0 ? 1.0 : 0.0
    // Fade near screen edges
    const edgeFade = 1.0 - Math.max(
      Math.abs(_projected.x),
      Math.abs(_projected.y)
    )
    const fade = Math.max(0, Math.min(1, edgeFade * 2.0)) * visible

    // Convert NDC (-1,1) to UV (0,1)
    const uv = effect.uniforms.get('uSunScreenPos').value
    uv.set(
      _projected.x * 0.5 + 0.5,
      _projected.y * 0.5 + 0.5
    )
    effect.uniforms.get('uSunVisible').value = fade
  }

  return {
    effect,
    update,
    uniforms: effect.uniforms,
    dispose() { effect.dispose() },
  }
}
```

- [ ] **Step 3: Write DONE.md**

---

## Chunk 2: Post-Merge Integration

### Task 4: Install n8ao + Merge Worker Output

- [ ] **Step 1: Install n8ao in main branch**

```bash
npm install n8ao
```

- [ ] **Step 2: Merge worker output files**

Copy from worktrees:
- W1: `ColorGradeEffect.js`, `shaders/color-grade.frag.glsl`
- W2: `SSAOSetup.js`, updated `shaders/grass.frag.glsl`
- W3: `LensFlareEffect.js`, `shaders/lens-flare.frag.glsl`

- [ ] **Step 3: Build to verify all modules compile**

```bash
npx vite build 2>&1 | tail -5
```

---

### Task 5: Wire into PostProcessingStack.js

**Files:**
- Modify: `src/meadow/PostProcessingStack.js`

- [ ] **Step 1: Replace LUT with new effects**

Rewrite `PostProcessingStack.js`:

```js
// src/meadow/PostProcessingStack.js
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  BloomEffect,
  ChromaticAberrationEffect,
  VignetteEffect,
  NoiseEffect,
  BlendFunction,
  KernelSize,
} from 'postprocessing'
import * as THREE from 'three'
import { createShadowGodrays } from './ShadowGodrays.js'
import { createFogDepthEffect } from './FogDepthPass.js'
import { createColorGradeEffect } from './ColorGradeEffect.js'
import { createSSAO } from './SSAOSetup.js'
import { createLensFlareEffect } from './LensFlareEffect.js'
import { createDOF } from './DOFSetup.js'

export default class PostProcessingStack {
  constructor(renderer, scene, camera, sunLight, sunPosition, tier) {
    this.composer = new EffectComposer(renderer, {
      frameBufferType: THREE.HalfFloatType,
    })
    this.composer.addPass(new RenderPass(scene, camera))

    if (tier === 'css') return

    const isReduced = tier === 'reduced'
    const isFull = tier === 'full' || tier === undefined

    // God Rays (Pass, before EffectPass)
    this.godrays = createShadowGodrays(renderer, scene, camera, sunLight, sunPosition, tier)
    if (this.godrays) {
      this.composer.addPass(this.godrays.pass)
    }

    // SSAO (Pass, after godrays, before EffectPass)
    const { width, height } = renderer.getSize(new THREE.Vector2())
    this.ssao = createSSAO(scene, camera, width, height, tier)
    this.composer.addPass(this.ssao.pass)

    // Effects
    this.bloom = new BloomEffect({
      intensity: isReduced ? 0.3 : 0.6,
      luminanceThreshold: 0.6,
      luminanceSmoothing: 0.3,
      kernelSize: isReduced ? KernelSize.SMALL : KernelSize.MEDIUM,
    })

    this.fogDepth = createFogDepthEffect()
    this.colorGrade = createColorGradeEffect()

    // Lens Flare (Tier 1 only)
    this.lensFlare = isFull ? createLensFlareEffect(sunPosition, camera) : null

    this.ca = new ChromaticAberrationEffect({
      offset: new THREE.Vector2(0.001, 0.001),
    })

    this.vignette = new VignetteEffect({ darkness: 0.5, offset: 0.3 })

    this.dof = isFull ? createDOF(camera) : null

    this.grain = new NoiseEffect({
      blendFunction: BlendFunction.OVERLAY,
      premultiply: true,
    })
    this.grain.blendMode.opacity.value = 0.03

    // Build effects array — grain MUST be last (DOF must not blur grain)
    const effects = [
      this.bloom,
      this.fogDepth.effect,
      this.colorGrade.effect,
      ...(this.lensFlare ? [this.lensFlare.effect] : []),
      this.ca,
      this.vignette,
      ...(this.dof ? [this.dof.effect] : []),
      this.grain,
    ]

    this.effectPass = new EffectPass(camera, ...effects)
    this.composer.addPass(this.effectPass)
    this._camera = camera  // stored for lens flare update
  }

  update(scrollVelocity, cameraPos, sectionPositions) {
    if (!this.ca) return

    const caIntensity = Math.min(0.005, Math.abs(scrollVelocity) * 0.001)
    this.ca.offset.set(caIntensity, caIntensity)

    if (this.lensFlare) {
      this.lensFlare.update(this._camera)
    }

    if (this.dof && cameraPos && sectionPositions) {
      this.dof.updateFocus(cameraPos, sectionPositions)
    }
  }

  render(deltaTime) {
    this.composer.render(deltaTime)
  }

  setSize(width, height) {
    this.composer.setSize(width, height)
    this.ssao?.setSize(width, height)
  }

  dispose() {
    this.godrays?.dispose()
    this.ssao?.dispose()
    this.fogDepth?.dispose()
    this.colorGrade?.dispose()
    this.lensFlare?.dispose()
    this.dof?.dispose()
    this.composer.dispose()
  }
}
```

- [ ] **Step 2: Build and verify**

```bash
npx vite build 2>&1 | tail -5
```

---

### Task 6: Update DevTuner.jsx

**Files:**
- Modify: `src/DevTuner.jsx`

- [ ] **Step 1: Replace LUT panel with Color Grade + SSAO + Lens Flare panels**

In `buildParamGroups()`, replace the LUT section (lines 366-399) with:

```js
// ─── Phase 2B: Color Grade ───
...(postProcessing.colorGrade ? [{
  id: 'colorGrade',
  title: 'Color Grade (SEUS)',
  badge: 'live',
  params: [
    {
      key: 'cgContrast', label: 'Contrast',
      min: 0, max: 0.5, step: 0.01,
      get: () => postProcessing.colorGrade.uniforms.get('uContrast')?.value,
      set: v => { postProcessing.colorGrade.uniforms.get('uContrast').value = v },
    },
    {
      key: 'cgLiftR', label: 'Lift R',
      min: -0.1, max: 0.1, step: 0.005,
      get: () => postProcessing.colorGrade.uniforms.get('uLift')?.value.x,
      set: v => { postProcessing.colorGrade.uniforms.get('uLift').value.x = v },
    },
    {
      key: 'cgLiftG', label: 'Lift G',
      min: -0.1, max: 0.1, step: 0.005,
      get: () => postProcessing.colorGrade.uniforms.get('uLift')?.value.y,
      set: v => { postProcessing.colorGrade.uniforms.get('uLift').value.y = v },
    },
    {
      key: 'cgLiftB', label: 'Lift B',
      min: -0.1, max: 0.1, step: 0.005,
      get: () => postProcessing.colorGrade.uniforms.get('uLift')?.value.z,
      set: v => { postProcessing.colorGrade.uniforms.get('uLift').value.z = v },
    },
    {
      key: 'cgGammaR', label: 'Gamma R',
      min: 0.8, max: 1.2, step: 0.01,
      get: () => postProcessing.colorGrade.uniforms.get('uGamma')?.value.x,
      set: v => { postProcessing.colorGrade.uniforms.get('uGamma').value.x = v },
    },
    {
      key: 'cgGammaG', label: 'Gamma G',
      min: 0.8, max: 1.2, step: 0.01,
      get: () => postProcessing.colorGrade.uniforms.get('uGamma')?.value.y,
      set: v => { postProcessing.colorGrade.uniforms.get('uGamma').value.y = v },
    },
    {
      key: 'cgGammaB', label: 'Gamma B',
      min: 0.8, max: 1.2, step: 0.01,
      get: () => postProcessing.colorGrade.uniforms.get('uGamma')?.value.z,
      set: v => { postProcessing.colorGrade.uniforms.get('uGamma').value.z = v },
    },
    {
      key: 'cgGainR', label: 'Gain R',
      min: 0.8, max: 1.2, step: 0.01,
      get: () => postProcessing.colorGrade.uniforms.get('uGain')?.value.x,
      set: v => { postProcessing.colorGrade.uniforms.get('uGain').value.x = v },
    },
    {
      key: 'cgGainG', label: 'Gain G',
      min: 0.8, max: 1.2, step: 0.01,
      get: () => postProcessing.colorGrade.uniforms.get('uGain')?.value.y,
      set: v => { postProcessing.colorGrade.uniforms.get('uGain').value.y = v },
    },
    {
      key: 'cgGainB', label: 'Gain B',
      min: 0.8, max: 1.2, step: 0.01,
      get: () => postProcessing.colorGrade.uniforms.get('uGain')?.value.z,
      set: v => { postProcessing.colorGrade.uniforms.get('uGain').value.z = v },
    },
    {
      key: 'cgSplitIntensity', label: 'Split Tone',
      min: 0, max: 0.5, step: 0.01,
      get: () => postProcessing.colorGrade.uniforms.get('uSplitIntensity')?.value,
      set: v => { postProcessing.colorGrade.uniforms.get('uSplitIntensity').value = v },
    },
    {
      key: 'cgVibrance', label: 'Vibrance',
      min: 0.5, max: 2.0, step: 0.05,
      get: () => postProcessing.colorGrade.uniforms.get('uVibrance')?.value,
      set: v => { postProcessing.colorGrade.uniforms.get('uVibrance').value = v },
    },
    {
      key: 'cgDarkDesat', label: 'Dark Desat',
      min: 0, max: 1, step: 0.05,
      get: () => postProcessing.colorGrade.uniforms.get('uDarkDesat')?.value,
      set: v => { postProcessing.colorGrade.uniforms.get('uDarkDesat').value = v },
    },
  ],
}] : []),
// ─── Phase 2B: SSAO ───
...(postProcessing.ssao ? [{
  id: 'ssao',
  title: 'SSAO',
  badge: 'live',
  params: [
    {
      key: 'ssaoRadius', label: 'AO Radius',
      min: 0.5, max: 5, step: 0.1,
      get: () => postProcessing.ssao.pass.configuration.aoRadius,
      set: v => { postProcessing.ssao.pass.configuration.aoRadius = v },
    },
    {
      key: 'ssaoIntensity', label: 'Intensity',
      min: 0, max: 5, step: 0.1,
      get: () => postProcessing.ssao.pass.configuration.intensity,
      set: v => { postProcessing.ssao.pass.configuration.intensity = v },
    },
    {
      key: 'ssaoFalloff', label: 'Distance Falloff',
      min: 0, max: 2, step: 0.05,
      get: () => postProcessing.ssao.pass.configuration.distanceFalloff,
      set: v => { postProcessing.ssao.pass.configuration.distanceFalloff = v },
    },
  ],
}] : []),
// ─── Phase 2B: Lens Flare ───
...(postProcessing.lensFlare ? [{
  id: 'lensFlare',
  title: 'Lens Flare',
  badge: 'live',
  params: [
    {
      key: 'flareIntensity', label: 'Intensity',
      min: 0, max: 1, step: 0.01,
      get: () => postProcessing.lensFlare.uniforms.get('uIntensity')?.value,
      set: v => { postProcessing.lensFlare.uniforms.get('uIntensity').value = v },
    },
    {
      key: 'flareGhostSpacing', label: 'Ghost Spacing',
      min: 0.1, max: 1.0, step: 0.05,
      get: () => postProcessing.lensFlare.uniforms.get('uGhostSpacing')?.value,
      set: v => { postProcessing.lensFlare.uniforms.get('uGhostSpacing').value = v },
    },
  ],
}] : []),
```

Also update line 17 — replace `const lut = postProcessing.lut` with:
```js
// lut removed — replaced by colorGrade in Phase 2B
```

- [ ] **Step 2: Update DOF panel to use property setters**

Replace the DOF focusRange setter (line 416):
```js
// Before:
set: v => { if (dof.effect.cocMaterial) dof.effect.cocMaterial.uniforms.focusRange.value = v },

// After:
set: v => { if (dof.effect.cocMaterial) dof.effect.cocMaterial.focusRange = v },
```

And the getter:
```js
// Before:
get: () => dof.effect.cocMaterial?.uniforms?.focusRange?.value,

// After:
get: () => dof.effect.cocMaterial?.focusRange,
```

---

### Task 7: Delete LUT Pipeline Files

- [ ] **Step 1: Delete dead files**

```bash
rm src/meadow/LUTColorGrade.js
rm src/meadow/SLog2EncodeEffect.js
rm src/meadow/shaders/slog2-encode.frag.glsl
rm src/assets/luts/slog3-base.cube
rm src/assets/luts/neutral-a7s3-sl2-65x.cube
```

- [ ] **Step 2: Build and verify no broken imports**

```bash
npx vite build 2>&1 | tail -10
```

- [ ] **Step 3: Test in browser**

```bash
npm run dev
```

Verify: Scene renders without errors. Open DevTuner (backtick). Color Grade, SSAO, and Lens Flare panels appear. Sliders update the scene live.

---

## Chunk 3: Code Simplification

### Task 8: Code Simplification Pass

Run `code-simplifier` agent across the meadow pipeline after all features are integrated.

**Scope:**
- `src/meadow/PostProcessingStack.js`
- `src/meadow/ColorGradeEffect.js`
- `src/meadow/SSAOSetup.js`
- `src/meadow/LensFlareEffect.js`
- `src/meadow/DOFSetup.js`
- `src/meadow/FogDepthPass.js`
- `src/meadow/ShadowGodrays.js`
- `src/meadow/MeadowEngine.js`
- `src/DevTuner.jsx`

**Focus:**
- [ ] Remove dead imports and unused variables
- [ ] Consolidate duplicate patterns across effect modules
- [ ] Simplify DevTuner wiring (look for repetitive get/set patterns)
- [ ] Remove commented-out code from Phase 2A iterations
- [ ] Verify consistent module export patterns (`{ effect, dispose }` etc.)
- [ ] Final build + browser test

---

## Tmux Orchestration

### Worker CLAUDE.md Template

Each worker gets this in their worktree's CLAUDE.md:

```
# Worker W{N} — Phase 2B

You are creating an ISOLATED MODULE. Do NOT modify PostProcessingStack.js, MeadowEngine.js, DevTuner.jsx, or App.jsx.

## Your Task
{task description}

## Output Files
{list of files to create/modify}

## When Done
- Write DONE.md in your worktree root listing all files created/modified
- Include any integration notes for the merge step

## Rules
- Follow existing module patterns (see ShadowGodrays.js, FogDepthPass.js)
- Use ?raw imports for GLSL shaders
- Export a factory function returning { effect, dispose } (or { pass, dispose } for Passes)
- All parameters as THREE.Uniform instances
- No original GLSL from scratch — adapt from referenced sources (SEUS, BSL, ektogamat)
```

### Launch Sequence

```bash
# 1. Install n8ao in main BEFORE creating worktrees (so all inherit it)
cd /Users/johnnysheng/mks/mks-site && npm install n8ao

# 2. Create worktrees (they inherit node_modules from main)
git worktree add /Users/johnnysheng/mks/worktrees/p2b-1 -b p2b-w1-colorgrade
git worktree add /Users/johnnysheng/mks/worktrees/p2b-2 -b p2b-w2-ssao
git worktree add /Users/johnnysheng/mks/worktrees/p2b-3 -b p2b-w3-lensflare

# 3. Launch tmux workers (unset CLAUDECODE to avoid nested session errors)
tmux new-session -d -s p2b
tmux send-keys -t p2b "cd /Users/johnnysheng/mks/worktrees/p2b-1 && unset CLAUDECODE && claude --dangerously-skip-permissions" Enter
tmux split-window -h -t p2b
tmux send-keys -t p2b "cd /Users/johnnysheng/mks/worktrees/p2b-2 && unset CLAUDECODE && claude --dangerously-skip-permissions" Enter
tmux split-window -v -t p2b
tmux send-keys -t p2b "cd /Users/johnnysheng/mks/worktrees/p2b-3 && unset CLAUDECODE && claude --dangerously-skip-permissions" Enter
```

### Post-Merge

After all 3 workers complete:
1. Copy output files from worktrees to main branch
2. Run Tasks 4-7 (integration)
3. Run Task 8 (code simplification)
4. Cleanup worktrees
