# Phase 2A: Visual Polish — Design Spec

## Overview

Add 5 cinematic post-processing features to the MKS Meadow engine via parallel tmux workers. Each worker produces an isolated module. Post-merge integration wires everything into `PostProcessingStack.js`, `MeadowEngine.js`, and `DevTuner.jsx`.

## Architecture

### Worker Isolation Pattern

No worker touches shared files (`PostProcessingStack.js`, `MeadowEngine.js`, `App.jsx`, `DevTuner.jsx`). Each creates a self-contained module in `src/meadow/` with a standardized API:

```js
// Every module exports:
export function create(deps) → { pass|effect, update?(args), dispose() }
```

Post-merge integration (done by orchestrator session) wires all modules into the pipeline.

### Post-Processing Pipeline Order (After Integration)

```
1. RenderPass (scene → buffer, depth target attached)
2. GodraysPass (volumetric light, reads shadow map)
3. EffectPass: [BloomEffect, FogDepthEffect, LUT3DEffect, ChromaticAberration, Vignette, Noise]
4. BokehPass (DOF, reads depth, dynamic focus)
5. → Canvas
```

## Workers

### W1: Shadow Maps + God Rays

**Branch:** `meadow/w1-shadow-godrays`
**Output:** `src/meadow/ShadowGodrays.js`

**Shadow Map Setup:**
- `renderer.shadowMap.enabled = true`
- `renderer.shadowMap.type = THREE.PCFSoftShadowMap`
- `sunLight.castShadow = true`
- `sunLight.shadow.mapSize.set(2048, 2048)`
- `sunLight.shadow.camera`: near=0.5, far=500, left/right/top/bottom=±200
- `sunLight.shadow.bias = -0.001`

**God Rays:**
- Library: `three-good-godrays` (already installed v0.11.1)
- Import: `import { GodraysPass } from 'three-good-godrays'`
- GodraysPass is a Pass (added to EffectComposer), not an Effect
- Parameters:
  - `raymarchSteps`: 32 (Tier 1), 16 (Tier 2)
  - `intensity`: 1.2
  - `decay`: 0.95
  - `density`: 0.8
  - `exposure`: 0.6
- Color: warm amber (inherits from sunLight color)

**API:**
```js
export function createShadowGodrays(renderer, scene, sunLight, sunPosition, tier) {
  // 1. Configure shadow maps on renderer + sunLight
  // 2. Create GodraysPass
  // 3. Return { pass, dispose() }
}
```

**No update() needed** — god rays are driven by the light position which is static.

**DevTuner params to expose:** raymarchSteps, intensity, decay, density, exposure, shadow bias, shadow map resolution.

---

### W2: 3-Zone Fog Pass

**Branch:** `meadow/w2-fog-pass`
**Output:** `src/meadow/FogDepthPass.js` + `src/meadow/shaders/fog-depth.frag.glsl`

**Concept:** Custom post-processing effect that reads scene depth and applies 3-zone fog:
- **Near** (0 → nearEnd): Sharp, no fog
- **Mid** (nearEnd → midEnd): Golden haze, lerp to warm fog color
- **Far** (midEnd → 1.0): Desaturated, cool blue fog

**Implementation:** Use pmndrs `Effect` class (not Pass) so it composes with other effects in a single EffectPass.

```glsl
// fog-depth.frag.glsl
uniform float uNearEnd;      // 0.15
uniform float uMidEnd;       // 0.6
uniform float uFogDensity;   // 0.008
uniform vec3 uMidColor;      // vec3(1.0, 1.0, 0.5) golden
uniform vec3 uFarColor;      // vec3(0.35, 0.5, 0.9) cool blue
uniform float uDesaturation; // 0.6

void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
  float linearDepth = smoothstep(0.0, 1.0, depth);

  // 3-zone blending
  float midFactor = smoothstep(uNearEnd, uMidEnd, linearDepth);
  float farFactor = smoothstep(uMidEnd, 1.0, linearDepth);

  vec3 color = inputColor.rgb;
  color = mix(color, uMidColor, midFactor * uFogDensity * 50.0);
  color = mix(color, uFarColor, farFactor);

  // Desaturate far zone
  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(color, vec3(luma), farFactor * uDesaturation);

  outputColor = vec4(color, inputColor.a);
}
```

**API:**
```js
export function createFogDepthEffect(camera) {
  // Returns pmndrs Effect instance with tunable uniforms
  // { effect, update(cameraT), dispose() }
}
```

**DevTuner params:** nearEnd, midEnd, fogDensity, midColor, farColor, desaturation.

---

### W3: S-Log3 LUT + Color Grading

**Branch:** `meadow/w3-lut-grade`
**Output:** `scripts/generate-slog3-lut.js` + `src/assets/luts/slog3-base.cube` + `src/meadow/LUTColorGrade.js`

**LUT Generation (Node script):**
Generate a 33×33×33 .cube file that replicates the S-Log3 tone curve:
- Lifted shadows (black point at ~0.09)
- Compressed highlights (white point at ~0.85)
- Reduced saturation (~70% of linear)
- Slight warmth push in midtones
- Wide dynamic range preservation (log-to-linear mapping)

S-Log3 transfer function:
```
if (x >= 0.01125)
  y = (420 + log10((x + 0.01) / (0.18 + 0.01)) * 261.5) / 1023
else
  y = (x * (171.2102946929 - 95) / 0.01125 + 95) / 1023
```

The .cube file is the inverse: maps linear scene values through the S-Log3 curve.

**LUT Loading:**
- Use `LUT3DEffect` from pmndrs/postprocessing
- Load .cube file at build time via Vite `?raw` import
- Parse into `DataTexture` (THREE.Data3DTexture)

**API:**
```js
export async function createLUTColorGrade(lutPath) {
  // 1. Load and parse .cube file
  // 2. Create LUT3DEffect with parsed texture
  // 3. Return { effect, setIntensity(v), dispose() }
}
```

**DevTuner params:** intensity (blend between original and graded).

---

### W4: Depth of Field

**Branch:** `meadow/w4-dof`
**Output:** `src/meadow/DOFSetup.js`

**Implementation:**
- Use BokehPass from `three/examples/jsm/postprocessing/BokehPass.js`
- NOTE: BokehPass is a three.js Pass, not pmndrs — it gets its own addPass() call on the composer

**Parameters:**
- `focus`: 8.0 (base distance, dynamically adjusted)
- `aperture`: 0.00025
- `maxblur`: 1.0

**Dynamic Focus Tracking:**
Each frame, calculate distance from camera to nearest visible content section:
```js
updateFocus(cameraPos, sectionPositions) {
  let nearest = Infinity
  for (const pos of sectionPositions) {
    const d = cameraPos.distanceTo(pos)
    if (d < nearest) nearest = d
  }
  // Lerp to prevent snappy focus jumps
  this.currentFocus += (nearest - this.currentFocus) * 0.05
  this.pass.uniforms.focus.value = this.currentFocus
}
```

**Tier gating:** Tier 1 only. Tier 2/3 skip entirely.

**API:**
```js
export function createDOF(scene, camera) {
  // 1. Create BokehPass
  // 2. Return { pass, updateFocus(cameraPos, sectionPositions), dispose() }
}
```

**DevTuner params:** focus, aperture, maxblur, lerpSpeed.

---

### W5: LOD Switching

**Branch:** `meadow/w5-lod`
**Output:** Modified `GrassChunkManager.js` (this file has no conflicts — only W5 touches it)

**Changes:**
1. Track camera position relative to each chunk center
2. Chunks within `LOD_THRESHOLD` (15 world units) use `highGeo` (7 segments)
3. Chunks beyond threshold use `lowGeo` (1 segment)
4. Add crossfade band (3 world units) where both LODs blend via alpha

**Implementation:**
- In `_createChunk()`, check distance to determine which geometry to use
- Add `uLODFade` uniform for crossfade blending
- In `update()`, swap geometry when chunks cross the threshold
- Geometry swap: dispose old mesh, create new InstancedMesh with alternate geometry

**DevTuner params:** lodThreshold, lodFadeBand.

---

## Integration Pass (Post-Merge)

After all 5 workers complete and branches merge:

### PostProcessingStack.js Changes
```js
import { createShadowGodrays } from './ShadowGodrays.js'
import { createFogDepthEffect } from './FogDepthPass.js'
import { createLUTColorGrade } from './LUTColorGrade.js'
import { createDOF } from './DOFSetup.js'

// In constructor:
// 1. Shadow + godrays (before EffectPass)
this.godrays = createShadowGodrays(renderer, scene, sunLight, sunPosition, tier)
if (this.godrays) this.composer.addPass(this.godrays.pass)

// 2. Add fog + LUT to the EffectPass effects array
this.fogEffect = createFogDepthEffect(camera)
this.lutEffect = await createLUTColorGrade(slog3LutUrl)
this.effectPass = new EffectPass(camera, this.bloom, this.fogEffect.effect, this.lutEffect.effect, this.ca, this.vignette, this.grain)

// 3. DOF (after EffectPass, Tier 1 only)
if (tier !== 'reduced') {
  this.dof = createDOF(scene, camera)
  this.composer.addPass(this.dof.pass)
}
```

### MeadowEngine.js Changes
- Pass `sunLight` reference to PostProcessingStack
- Call `postProcessing.updateFog(cameraT)` in tick
- Call `postProcessing.updateDOF(camPos, sectionPositions)` in tick

### DevTuner.jsx Changes
- Add parameter groups for: godrays, fog zones, LUT intensity, DOF focus/aperture/blur, LOD threshold
- Wire to the new modules via `getDevAPI()`

## Reference Shader Sources

Per project rule: all shader code stolen from real repos.

| Feature | Source | What to adapt |
|---------|--------|--------------|
| God rays | three-good-godrays (npm) | Entire pass — use as-is |
| Fog depth | spacejack/terra fog zones | 3-zone depth concept, fog colors |
| Fog depth | iq (Shadertoy) fog functions | smoothstep blending, desaturation |
| LUT | pmndrs/postprocessing LUT3DEffect | Use as-is |
| DOF | three.js BokehPass example | Use as-is |
| LOD | Nitash-Biswas blade counts | Low segment geometry pattern |

## Success Criteria

- All 5 features render without errors at Tier 1
- Tier 2 skips god rays + DOF, reduces everything else
- DevTuner exposes all new parameters with lock/export
- Build passes cleanly
- No regressions to existing subsystems (grass, flowers, fireflies, content overlay)
- S-Log3 .cube file loads and applies correctly
- God rays show visible light shafts at 12° sun elevation
- Fog creates 3 distinct depth zones (near sharp, mid golden, far blue)
