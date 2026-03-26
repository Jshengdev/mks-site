# Subsystem Extraction & Deduplication

## What This Is
Extract ~3,800 lines of duplicated code across particle systems, atmosphere keyframes, geometry builders, and GLSL utilities into shared base modules.

## Why This Matters
The codebase has grown to ~10,000 LOC across 100 source files, and four categories of structural duplication have emerged independently across worlds and subsystems. Every new world config or particle system copy-pastes the same boilerplate, increasing the surface area for divergence bugs (e.g., one particle class disposes correctly while another leaks). Extracting shared foundations reduces maintenance burden, makes new world creation faster, and eliminates classes of bugs where a fix in one copy never reaches the others.

## Acceptance Criteria
- [ ] AC1: `KeyframeTemplate.js` exists and exports a 54-property default keyframe object. All 17 keyframe files import it and express only overrides. Net reduction >= 1,500 lines.
- [ ] AC2: `BaseParticleSystem.js` exists and encapsulates the shared constructor pattern (ShaderMaterial setup, BufferGeometry creation, Points attachment, dispose). All 10 particle classes extend it. Net reduction >= 300 lines.
- [ ] AC3: `ParticleGeometryBuilder.js` exists and provides builder methods for Float32Array + BufferAttribute + setAttribute patterns. All 19 consuming files use it. Net reduction >= 350 lines.
- [ ] AC4: Shared GLSL includes exist: `_fog-utils.glsl`, `_rim-light.glsl`, `_particle-utils.glsl`. 16 fog duplications, 8 Fresnel rim duplications, and 11 point-size scaling duplications reference the shared files. Net reduction >= 900 lines.
- [ ] AC5: `npx vite build` passes with zero errors and zero new warnings.
- [ ] AC6: All five worlds render identically before and after (manual visual verification at scroll positions 0.0, 0.25, 0.5, 0.75, 1.0 for each world).
- [ ] AC7: No performance regression: FPS stays within 2 frames of baseline on tier-1 hardware.
- [ ] AC8: Hash/noise GLSL functions remain local to their consuming shaders (NOT extracted).
- [ ] AC9: Terrain algorithms, keyframe VALUES, and lighting models are NOT extracted.

## Specification

### 1. Atmosphere Keyframe Schema (~1,700 lines saved)

**Problem:** 17 keyframe files each define 5 keyframes with 54 properties. Every property is spelled out even when the value matches a sensible default, creating ~5,565 lines of pure data with massive redundancy.

**Solution:** Create `src/meadow/KeyframeTemplate.js`:
```js
// 54-property default keyframe with sensible baseline values
export const KEYFRAME_DEFAULTS = {
  skyTurbidity: 2.0,
  skyRayleigh: 1.0,
  sunElevation: 45,
  sunAzimuth: 180,
  fogColor: '#8899aa',
  fogNear: 20,
  fogFar: 200,
  // ... all 54 properties with documented defaults
};

// Factory: merge overrides onto defaults for a single keyframe
export function createKeyframe(overrides = {}) {
  return { ...KEYFRAME_DEFAULTS, ...overrides };
}

// Factory: create a full 5-keyframe atmosphere config
export function createAtmosphereKeyframes(keyframeOverrides) {
  return keyframeOverrides.map(overrides => createKeyframe(overrides));
}
```

Each world config changes from:
```js
// BEFORE: 54 properties x 5 keyframes = 270 lines
{ skyTurbidity: 2.0, skyRayleigh: 1.0, sunElevation: 45, ... }
```
To:
```js
// AFTER: only overrides, typically 5-15 properties per keyframe
createKeyframe({ sunElevation: 12, fogColor: '#2a1a0a', bloomIntensity: 0.8 })
```

**Constraints:**
- Default values must be chosen to match the golden-meadow baseline (most common case).
- The actual keyframe VALUES are artistic choices and must not change. Only the expression mechanism changes.
- `createKeyframe` must do a shallow merge only (no deep merge of nested objects).

### 2. Particle System Base Class (~350 lines saved)

**Problem:** 10 particle classes (FireflySystem, DustMotes, RainSystem, PetalSystem, AshSystem, EmberSystem, BubbleSystem, MarineSnow, SnowParticle, VoidParticle) share an identical structural pattern:
1. Constructor creates ShaderMaterial with vertex/fragment shaders and uniforms
2. Constructor creates BufferGeometry with position/velocity/phase attributes
3. Constructor creates Points mesh and adds to scene
4. `update(dt)` advances `uTime` uniform
5. `dispose()` tears down geometry, material, and removes from scene

**Solution:** Create `src/meadow/BaseParticleSystem.js`:
```js
export class BaseParticleSystem {
  constructor(scene, { vertexShader, fragmentShader, uniforms, attributes, count, blending }) {
    this.scene = scene;
    this.material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, ... });
    this.geometry = new THREE.BufferGeometry();
    // Set attributes from config
    for (const [name, { array, itemSize }] of Object.entries(attributes)) {
      this.geometry.setAttribute(name, new THREE.BufferAttribute(array, itemSize));
    }
    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  update(dt) {
    if (this.material.uniforms.uTime) {
      this.material.uniforms.uTime.value += dt;
    }
  }

  dispose() {
    this.scene.remove(this.points);
    this.geometry.dispose();
    this.material.dispose();
    this.points = null;
  }
}
```

Each particle subclass extends `BaseParticleSystem`, calling `super()` with its specific config and overriding `update()` for custom behavior (e.g., FireflySystem's vertical bob, RainSystem's reset-on-ground).

**Constraints:**
- Subclasses must be able to override any lifecycle method.
- The base class must NOT import any specific shader -- shaders are passed in by the subclass.
- Blending mode (Additive, Normal, etc.) is per-subclass config, not hardcoded.

### 3. Particle Geometry Builder (~400 lines saved)

**Problem:** 19 files repeat the same Float32Array allocation + BufferAttribute creation + setAttribute pattern with minor variations in attribute names and item sizes.

**Solution:** Create `src/meadow/ParticleGeometryBuilder.js`:
```js
export class ParticleGeometryBuilder {
  constructor(count) {
    this.count = count;
    this.geometry = new THREE.BufferGeometry();
  }

  addAttribute(name, itemSize, fillFn) {
    const array = new Float32Array(this.count * itemSize);
    if (fillFn) fillFn(array, this.count, itemSize);
    this.geometry.setAttribute(name, new THREE.BufferAttribute(array, itemSize));
    return this;
  }

  // Convenience: position attribute with custom initializer
  addPositions(fillFn) { return this.addAttribute('position', 3, fillFn); }

  // Convenience: common particle attributes
  addPhases(fillFn) { return this.addAttribute('aPhase', 1, fillFn || randomFill); }
  addScales(fillFn) { return this.addAttribute('aScale', 1, fillFn || onesFill); }
  addVelocities(fillFn) { return this.addAttribute('aVelocity', 3, fillFn); }

  build() { return this.geometry; }
}
```

**Constraints:**
- This is a builder, not a constraint. Files with truly unique geometry needs can still use raw BufferGeometry directly.
- The builder must support arbitrary attribute names and item sizes (not just the convenience methods).

### 4. GLSL Shader Utilities (~1,100 lines saved)

**Problem:** Identical GLSL functions are copy-pasted across many shader files:
- **Fog calculation** (16 files): `applyFog()`, `fogFactor()` with near/far/color uniforms
- **Fresnel rim light** (8 files): `fresnelRim()` with view-direction dot product
- **Point size scaling** (11 files): `scalePointSize()` with distance attenuation + viewport height

**Solution:** Create three shared GLSL include files:

`src/meadow/shaders/_fog-utils.glsl`:
```glsl
// iquilez-style 3-zone depth fog (from al-ro/grass reference)
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

float fogFactor(float depth) {
  return smoothstep(uFogNear, uFogFar, depth);
}

vec3 applyFog(vec3 color, float depth) {
  return mix(color, uFogColor, fogFactor(depth));
}
```

`src/meadow/shaders/_rim-light.glsl`:
```glsl
// Fresnel rim light (from daniel-ilett toon shader reference)
float fresnelRim(vec3 normal, vec3 viewDir, float power) {
  return pow(1.0 - max(dot(normal, viewDir), 0.0), power);
}
```

`src/meadow/shaders/_particle-utils.glsl`:
```glsl
// Point size with distance attenuation (from Alex-DG reference)
float scalePointSize(float baseSize, float distanceToCamera, float viewportHeight) {
  return baseSize * (viewportHeight / distanceToCamera);
}
```

**Integration:** Use Vite's `?raw` import for GLSL and string concatenation at the JS level:
```js
import fogUtils from './_fog-utils.glsl?raw';
import mainFrag from './firefly.frag.glsl?raw';
const fragmentShader = fogUtils + '\n' + mainFrag;
```

**Constraints:**
- Hash functions, noise functions, and cel-shading logic stay LOCAL to their shaders. These have subtle per-shader variations that are intentional artistic choices.
- The `#include` preprocessor pattern is not used (Vite does not support GLSL includes natively). String concatenation at import time is the mechanism.
- Each include file must be self-contained (declare its own uniforms).
- Consuming shaders must remove their local copies of the extracted functions to avoid redefinition errors.

### Anti-Recommendations (Do NOT Extract)

| Category | Reason |
|----------|--------|
| Terrain algorithms | Each world needs unique visual character (sin/cos hills vs. cliff+ocean vs. diamond-square). Abstracting kills distinctiveness. |
| Keyframe VALUES | These are artistic choices tuned per-world. Only the schema/defaults mechanism is extractable. |
| Lighting models | Tightly coupled to specific visual effects (toon bands, translucent lighting, volumetric). Abstraction would leak. |
| Universal BufferGeometry builder | Geometry needs are too varied across non-particle meshes (grass blades, cloth, terrain). The particle builder is scoped correctly. |

## Ralphable vs Human-Taste

| Extraction | Classification | Rationale |
|------------|---------------|-----------|
| KeyframeTemplate.js | **Ralphable** | Pure mechanical refactor. Default values derived from golden-meadow (most common). No artistic judgment needed. |
| BaseParticleSystem.js | **Ralphable** | Standard OOP extraction. Shared constructor/dispose pattern is identical across all 10 classes. |
| ParticleGeometryBuilder.js | **Ralphable** | Builder pattern extraction. The Float32Array boilerplate is purely structural. |
| `_fog-utils.glsl` | **Ralphable** | Fog function is identical across all 16 files. Uniform names are already consistent. |
| `_rim-light.glsl` | **Ralphable** | Fresnel calculation is textbook identical. No per-shader variation. |
| `_particle-utils.glsl` | **Ralphable** | Point size scaling is identical. Attenuation formula does not vary. |
| Hash/noise GLSL | **Human-Taste** | Subtle per-shader variations are intentional. Do not extract. |
| Cel-shading GLSL | **Human-Taste** | Band counts and thresholds are artistic per-world tuning. Do not extract. |

## Dependencies

- No external dependency changes. All extractions use existing Three.js APIs.
- `KeyframeTemplate.js` must be created before modifying any environment config files.
- `BaseParticleSystem.js` must be created before refactoring any particle class.
- `ParticleGeometryBuilder.js` can be created independently (consumed by BaseParticleSystem or directly).
- GLSL include files must be created before removing local copies from consuming shaders.
- Extraction order recommendation: (1) GLSL utilities, (2) ParticleGeometryBuilder, (3) BaseParticleSystem, (4) KeyframeTemplate. Reason: GLSL and geometry are leaf dependencies; keyframes touch the most files and should be done last to minimize merge conflicts.

## Verification

**Build check:**
```bash
cd /Users/johnnysheng/mks/mks-site && npx vite build
```
Must exit 0 with no errors and no new warnings.

**Line count delta:**
```bash
# Before extraction (run before starting work)
find src/ -name '*.js' -o -name '*.jsx' -o -name '*.glsl' -o -name '*.css' | xargs wc -l | tail -1
# After extraction (run after completing work)
find src/ -name '*.js' -o -name '*.jsx' -o -name '*.glsl' -o -name '*.css' | xargs wc -l | tail -1
# Expected reduction: >= 3,000 lines (conservative, accounting for new shared files)
```

**New file existence:**
```bash
ls -la src/meadow/KeyframeTemplate.js src/meadow/BaseParticleSystem.js src/meadow/ParticleGeometryBuilder.js src/meadow/shaders/_fog-utils.glsl src/meadow/shaders/_rim-light.glsl src/meadow/shaders/_particle-utils.glsl
```
All six files must exist.

**No duplicate function definitions (post-extraction):**
```bash
# Fog: should only appear in _fog-utils.glsl and nowhere else
grep -r "fogFactor" src/meadow/shaders/ --include="*.glsl" -l
# Expected: only _fog-utils.glsl

# Rim: should only appear in _rim-light.glsl and nowhere else
grep -r "fresnelRim" src/meadow/shaders/ --include="*.glsl" -l
# Expected: only _rim-light.glsl

# Point size: should only appear in _particle-utils.glsl and nowhere else
grep -r "scalePointSize" src/meadow/shaders/ --include="*.glsl" -l
# Expected: only _particle-utils.glsl
```

**Visual verification (manual):**
For each of the 5 worlds (/, /listen, /story, /collect, /witness):
1. Load the world in browser
2. Scroll to positions 0.0, 0.25, 0.5, 0.75, 1.0
3. Confirm: fog renders identically, particles appear/move correctly, rim lighting matches, atmosphere keyframes interpolate smoothly
4. Open DevTuner (backtick) and verify all sliders still function

**Performance verification:**
```bash
# Run dev server, open Chrome DevTools Performance tab
# Record 10-second scroll through each world
# Compare FPS to pre-extraction baseline (must be within 2 FPS)
```
