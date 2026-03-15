# Environment Worlds Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the single-scene meadow into a multi-environment system where each route (`/`, `/listen`, `/story`, `/collect`, `/witness`) renders a distinct 3D world sharing the same engine architecture.

**Architecture:** Extract all hardcoded values from subsystems into per-environment config objects. Add React Router so each route creates a fresh `MeadowEngine` with its environment's config. The engine constructor accepts an optional config that threads through to CameraRig, AtmosphereController, MeadowScene, TerrainPlane, GrassChunkManager, FireflySystem, and PostProcessingStack. Subsystems that don't exist in an environment (e.g. no fireflies in Ocean Cliff) are conditionally skipped.

**Tech Stack:** React 19, React Router 7, Three.js 0.182, Lenis, pmndrs/postprocessing, vanilla GLSL shaders

**Spec:** `docs/superpowers/specs/2026-03-13-environment-worlds-prd.md`

**Known V1 Limitations (from code review):**
- Night Meadow uses Preetham sky at -30° elevation → black void sky (no stars/moon). Follow-up: add procedural starfield shader.
- `getTerrainHeight` uses module-level mutable singleton. Works for serial environment loading but will need refactoring for portal transitions that pre-render next environment.
- Rain uses `PointsMaterial` (dots, not velocity-stretched streaks). Follow-up: custom vertex shader for elongated particles.
- Per-environment content components (NightMeadowContent, etc.) are deferred — placeholders reuse existing components.

---

## File Structure

### New Files
```
src/meadow/environments/              — Per-environment config objects
  index.js                             — Registry: exports ENVIRONMENTS map
  golden-meadow.js                     — Current hardcoded values extracted
  night-meadow.js                      — Night variant (same terrain, dark atmosphere)
  ocean-cliff.js                       — Cliff + ocean + seated figure
  storm-field.js                       — Wind, rain, lightning
  ghibli-painterly.js                  — Cel-shaded, Kuwahara post-FX

src/EnvironmentScene.jsx               — Route wrapper: creates MeadowEngine with env config
src/Nav.jsx                            — Minimal fixed nav for route switching
src/nav.css                            — Nav styles

src/content/NightMeadowContent.jsx     — About/story content for night scene
src/content/OceanCliffContent.jsx      — Music/listen content for ocean scene
src/content/StormFieldContent.jsx      — Tour/witness content for storm scene
src/content/GhibliPainterlyContent.jsx — Store/collect content for ghibli scene

src/meadow/OceanPlane.js               — Stylized ocean shader (from thaslle/stylized-water extraction)
src/meadow/shaders/ocean.vert.glsl     — Ocean vertex shader
src/meadow/shaders/ocean.frag.glsl     — Ocean fragment shader
src/meadow/RainSystem.js               — Rain particle system for Storm Field
src/meadow/LightningFlash.js           — Screen flash + thunder trigger for Storm Field
```

### Modified Files
```
src/App.jsx                            — Add BrowserRouter + Routes, render EnvironmentScene per route
src/meadow/MeadowEngine.js             — Accept envConfig, thread to subsystems, conditionally create subsystems
src/meadow/CameraRig.js                — Accept config object (spline points, damping, height offset)
src/meadow/AtmosphereController.js     — Accept keyframes via config instead of module-level const
src/meadow/MeadowScene.js              — Accept config for fog, sky, light colors
src/meadow/TerrainPlane.js             — Accept height function + terrain config
src/meadow/GrassChunkManager.js        — Accept full grass config (colors already come from atmosphere)
src/meadow/FireflySystem.js            — Accept count + spread config
src/meadow/constants.js                — Export per-environment section T values
src/content/ContentOverlay.jsx         — Accept sections config instead of hardcoded SECTION_COMPONENTS
src/index.css                          — Nav spacing
```

---

## Chunk 1: Environment Config Extraction

**Goal:** Extract every hardcoded value from the engine into config objects, without changing any behavior. The Golden Meadow should render identically before and after.

### Task 1: Create the Golden Meadow config

**Files:**
- Create: `src/meadow/environments/golden-meadow.js`
- Create: `src/meadow/environments/index.js`

- [ ] **Step 1: Create golden-meadow.js with all current hardcoded values**

```javascript
// src/meadow/environments/golden-meadow.js
import * as THREE from 'three'

// Golden Meadow — Landing / Introduction
// Emotional temperature: Innocent Awakening — warmth surfacing from cold
// "She opened her eyes that day, but she also opened their soul"
export default {
  name: 'golden-meadow',
  route: '/',

  camera: {
    fov: 45,
    near: 0.1,
    far: 2000,
    splinePoints: [
      [0, 0, 0],
      [6, 0, -25],
      [-4, 0, -50],
      [8, 0, -75],
      [-6, 0, -100],
      [4, 0, -130],
      [0, 0, -160],
    ],
    heightOffset: 1.5,
    lerpFactor: 0.05,
    fovMaxBoost: 20,
    fovLerpBack: 0.04,
    panFactor: Math.PI / 20,
  },

  terrain: {
    size: 400,
    subdivisions: 128,
    color: [0.16, 0.18, 0.07],
    heightFunction: (x, z) =>
      Math.sin(x * 0.02) * Math.cos(z * 0.015) * 2.0
      + Math.sin(x * 0.05 + z * 0.03) * 0.5,
  },

  scene: {
    fogColor: [0.85, 0.78, 0.55],
    fogDensity: 0.003,
    skyScale: 10000,
    sunElevation: 12,
    sunAzimuth: 240,
    skyTurbidity: 10,
    skyRayleigh: 1.5,
    skyMieCoefficient: 0.008,
    skyMieDirectionalG: 0.9,
    sunLightColor: [1.0, 0.92, 0.75],
    sunLightIntensity: 1.5,
    ambientIntensity: 0.15,
  },

  grass: {
    enabled: true,
    count: 60000,     // overridden by tier
    chunks: 6,        // overridden by tier
    // Colors managed by atmosphere keyframes
  },

  fireflies: {
    enabled: true,
    count: 500,
    spread: 200,
    heightMin: 0.3,
    heightMax: 1.5,
  },

  flowers: {
    enabled: true,
    count: 800,
  },

  cloudShadows: { enabled: true },
  dustMotes: { enabled: true, count: 300 },
  godRays: { enabled: true },
  scoreSheets: { enabled: true, count: 3 },
  artistFigure: { enabled: true },
  portals: { enabled: true },
  cursorInteraction: { enabled: true },
  musicTrigger: { enabled: true, threshold: 0.35 },

  postProcessing: {
    // Tier-dependent — 'full', 'reduced', or 'css'
    // Specific effect values controlled by atmosphere keyframes
  },

  // Content sections (t-value on camera spline, component name)
  sections: [
    { t: 0.075, component: 'LandingContent' },
    { t: 0.275, component: 'MusicContent' },
    { t: 0.475, component: 'AboutContent' },
    { t: 0.725, component: 'StoreContent' },
    { t: 0.925, component: 'FooterContent' },
  ],

  // Atmosphere keyframes (the emotional arc)
  // Copied verbatim from current AtmosphereController.js KEYFRAMES
  keyframes: [
    {
      t: 0.0,
      sunElevation: 2, sunAzimuth: 250,
      turbidity: 12, rayleigh: 3.0, mieCoefficient: 0.015, mieDirectionalG: 0.95,
      fogColor: [0.12, 0.18, 0.28], fogDensity: 0.018,
      sunLightColor: [0.45, 0.50, 0.65], sunLightIntensity: 0.25,
      ambientIntensity: 0.04,
      grassBaseColor: [0.01, 0.03, 0.03], grassTipColor: [0.03, 0.08, 0.07],
      grassWindSpeed: 0.1, grassAmbientStrength: 0.15, grassTranslucency: 0.3, grassFogFade: 0.005,
      cloudShadowOpacity: 0.02, cloudDriftSpeed: 0.00001,
      fireflyBrightness: 0.0, fireflySize: 25,
      bloomIntensity: 0.1, bloomThreshold: 0.9,
      fogDepthStrength: 0.05, fogMidColor: [0.25, 0.30, 0.45], fogFarColor: [0.12, 0.15, 0.25],
      colorGradeContrast: 0.03, colorGradeVibrance: 0.1, colorGradeWarmth: 0.0,
      vignetteDarkness: 0.85, grainOpacity: 0.06,
      dustMoteBrightness: 0.0, godRayIntensity: 0.0, kuwaharaStrength: 0.0,
    },
    {
      t: 0.25,
      sunElevation: 6, sunAzimuth: 245,
      turbidity: 13, rayleigh: 2.0, mieCoefficient: 0.010, mieDirectionalG: 0.93,
      fogColor: [0.40, 0.38, 0.38], fogDensity: 0.008,
      sunLightColor: [0.75, 0.72, 0.65], sunLightIntensity: 0.8,
      ambientIntensity: 0.10,
      grassBaseColor: [0.03, 0.10, 0.03], grassTipColor: [0.12, 0.30, 0.08],
      grassWindSpeed: 0.7, grassAmbientStrength: 0.28, grassTranslucency: 1.2, grassFogFade: 0.003,
      cloudShadowOpacity: 0.08, cloudDriftSpeed: 0.00004,
      fireflyBrightness: 0.0, fireflySize: 40,
      bloomIntensity: 0.3, bloomThreshold: 0.75,
      fogDepthStrength: 0.04, fogMidColor: [0.65, 0.58, 0.48], fogFarColor: [0.40, 0.38, 0.42],
      colorGradeContrast: 0.06, colorGradeVibrance: 0.35, colorGradeWarmth: 0.02,
      vignetteDarkness: 0.60, grainOpacity: 0.04,
      dustMoteBrightness: 0.2, godRayIntensity: 0.15, kuwaharaStrength: 0.0,
    },
    {
      t: 0.50,
      sunElevation: 12, sunAzimuth: 235,
      turbidity: 8, rayleigh: 1.2, mieCoefficient: 0.012, mieDirectionalG: 0.92,
      fogColor: [0.85, 0.75, 0.50], fogDensity: 0.003,
      sunLightColor: [1.0, 0.90, 0.70], sunLightIntensity: 1.6,
      ambientIntensity: 0.16,
      grassBaseColor: [0.06, 0.20, 0.03], grassTipColor: [0.25, 0.55, 0.12],
      grassWindSpeed: 1.5, grassAmbientStrength: 0.38, grassTranslucency: 2.2, grassFogFade: 0.0012,
      cloudShadowOpacity: 0.18, cloudDriftSpeed: 0.00006,
      fireflyBrightness: 0.6, fireflySize: 75,
      bloomIntensity: 0.65, bloomThreshold: 0.55,
      fogDepthStrength: 0.06, fogMidColor: [1.0, 0.85, 0.50], fogFarColor: [0.60, 0.55, 0.55],
      colorGradeContrast: 0.10, colorGradeVibrance: 0.7, colorGradeWarmth: 0.06,
      vignetteDarkness: 0.35, grainOpacity: 0.03,
      dustMoteBrightness: 0.9, godRayIntensity: 0.5, kuwaharaStrength: 0.0,
    },
    {
      t: 0.75,
      sunElevation: 3, sunAzimuth: 200,
      turbidity: 12, rayleigh: 2.5, mieCoefficient: 0.020, mieDirectionalG: 0.96,
      fogColor: [0.95, 0.68, 0.30], fogDensity: 0.005,
      sunLightColor: [1.0, 0.78, 0.45], sunLightIntensity: 2.2,
      ambientIntensity: 0.10,
      grassBaseColor: [0.10, 0.12, 0.02], grassTipColor: [0.40, 0.45, 0.10],
      grassWindSpeed: 2.2, grassAmbientStrength: 0.25, grassTranslucency: 3.0, grassFogFade: 0.001,
      cloudShadowOpacity: 0.10, cloudDriftSpeed: 0.00008,
      fireflyBrightness: 1.0, fireflySize: 100,
      bloomIntensity: 1.0, bloomThreshold: 0.4,
      fogDepthStrength: 0.10, fogMidColor: [1.0, 0.75, 0.35], fogFarColor: [0.70, 0.50, 0.30],
      colorGradeContrast: 0.14, colorGradeVibrance: 0.9, colorGradeWarmth: 0.10,
      vignetteDarkness: 0.30, grainOpacity: 0.02,
      dustMoteBrightness: 1.0, godRayIntensity: 1.0, kuwaharaStrength: 0.35,
    },
    {
      t: 1.0,
      sunElevation: 8, sunAzimuth: 220,
      turbidity: 11, rayleigh: 1.6, mieCoefficient: 0.009, mieDirectionalG: 0.92,
      fogColor: [0.55, 0.52, 0.50], fogDensity: 0.006,
      sunLightColor: [0.88, 0.82, 0.72], sunLightIntensity: 1.0,
      ambientIntensity: 0.14,
      grassBaseColor: [0.04, 0.14, 0.04], grassTipColor: [0.18, 0.40, 0.12],
      grassWindSpeed: 0.5, grassAmbientStrength: 0.35, grassTranslucency: 1.5, grassFogFade: 0.002,
      cloudShadowOpacity: 0.08, cloudDriftSpeed: 0.00003,
      fireflyBrightness: 0.4, fireflySize: 60,
      bloomIntensity: 0.35, bloomThreshold: 0.70,
      fogDepthStrength: 0.06, fogMidColor: [0.70, 0.65, 0.55], fogFarColor: [0.45, 0.42, 0.45],
      colorGradeContrast: 0.07, colorGradeVibrance: 0.4, colorGradeWarmth: 0.03,
      vignetteDarkness: 0.55, grainOpacity: 0.04,
      dustMoteBrightness: 0.3, godRayIntensity: 0.2, kuwaharaStrength: 0.0,
    },
  ],
}
```

- [ ] **Step 2: Create environments/index.js registry**

```javascript
// src/meadow/environments/index.js
import goldenMeadow from './golden-meadow.js'

export const ENVIRONMENTS = {
  'golden-meadow': goldenMeadow,
}

export function getEnvironment(name) {
  const env = ENVIRONMENTS[name]
  if (!env) throw new Error(`Unknown environment: ${name}. Available: ${Object.keys(ENVIRONMENTS).join(', ')}`)
  return env
}
```

- [ ] **Step 3: Verify build**

Run: `npx vite build`
Expected: Build succeeds (new files are just dead code for now)

- [ ] **Step 4: Commit**

```bash
git add src/meadow/environments/
git commit -m "feat: add environment config system with golden-meadow defaults"
```

---

### Task 2: Make CameraRig accept config

**Files:**
- Modify: `src/meadow/CameraRig.js`

- [ ] **Step 1: Add config parameter to constructor**

Replace the constructor to accept an optional config object. Defaults match current hardcoded values so existing usage (no config) still works.

```javascript
// CameraRig constructor — change from:
constructor(camera) {
// to:
constructor(camera, config = {}) {
    this.camera = camera
    this.currentT = 0
    this.targetT = 0
    this.lerpFactor = config.lerpFactor ?? 0.05
    this.baseFov = camera.fov
    this.currentFov = camera.fov
    this.fovMaxBoost = config.fovMaxBoost ?? 20
    this.fovLerpBack = config.fovLerpBack ?? 0.04
    this._heightOffset = config.heightOffset ?? 1.5

    this._cachedPos = new THREE.Vector3()
    this._lookTarget = new THREE.Vector3()

    this._mouseTarget = { x: 0, y: 0 }
    this._mouseCurrent = { x: 0, y: 0 }
    this._panFactor = config.panFactor ?? Math.PI / 20
    this._onMouseMove = (e) => {
      this._mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1
      this._mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', this._onMouseMove)

    // Spline from config or default S-curve
    const points = config.splinePoints || [
      [0, 0, 0], [6, 0, -25], [-4, 0, -50], [8, 0, -75],
      [-6, 0, -100], [4, 0, -130], [0, 0, -160],
    ]
    this.curve = new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(p[0], p[1], p[2]))
    )
}
```

- [ ] **Step 2: Use `_heightOffset` instead of `CAM_HEIGHT_ABOVE_TERRAIN` constant**

In `update()`, replace `CAM_HEIGHT_ABOVE_TERRAIN` with `this._heightOffset`. Also accept a `getTerrainHeight` function reference stored in constructor:

Add to constructor:
```javascript
this._getTerrainHeight = config.getTerrainHeight || null
```

In `update()`, change height calculation:
```javascript
// Change from:
this._cachedPos.y = getTerrainHeight(this._cachedPos.x, this._cachedPos.z) + CAM_HEIGHT_ABOVE_TERRAIN
this._lookTarget.y = getTerrainHeight(this._lookTarget.x, this._lookTarget.z) + CAM_HEIGHT_ABOVE_TERRAIN
// To:
const ght = this._getTerrainHeight
if (ght) {
  this._cachedPos.y = ght(this._cachedPos.x, this._cachedPos.z) + this._heightOffset
  this._lookTarget.y = ght(this._lookTarget.x, this._lookTarget.z) + this._heightOffset
} else {
  this._cachedPos.y = this._heightOffset
  this._lookTarget.y = this._heightOffset
}
```

Remove the import of `getTerrainHeight` from `TerrainPlane.js` at the top of the file and remove the `CAM_HEIGHT_ABOVE_TERRAIN` constant.

- [ ] **Step 3: Verify build**

Run: `npx vite build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/meadow/CameraRig.js
git commit -m "feat: CameraRig accepts config for spline, damping, height offset"
```

---

### Task 3: Make MeadowScene accept config

**Files:**
- Modify: `src/meadow/MeadowScene.js`

- [ ] **Step 1: Add config parameter to setupScene**

```javascript
// Change from:
export function setupScene(scene) {
// To:
export function setupScene(scene, config = {}) {
  const fogColor = new THREE.Color(...(config.fogColor || [0.85, 0.78, 0.55]))
  const fogDensity = config.fogDensity ?? 0.003

  scene.fog = new THREE.FogExp2(fogColor, fogDensity)

  const sky = new Sky()
  sky.scale.setScalar(config.skyScale ?? 10000)
  scene.add(sky)

  const sunPosition = new THREE.Vector3()
  const phi = THREE.MathUtils.degToRad(90 - (config.sunElevation ?? 12))
  const theta = THREE.MathUtils.degToRad(config.sunAzimuth ?? 240)
  sunPosition.setFromSphericalCoords(1, phi, theta)

  const skyUniforms = sky.material.uniforms
  skyUniforms['turbidity'].value = config.skyTurbidity ?? 10
  skyUniforms['rayleigh'].value = config.skyRayleigh ?? 1.5
  skyUniforms['mieCoefficient'].value = config.skyMieCoefficient ?? 0.008
  skyUniforms['mieDirectionalG'].value = config.skyMieDirectionalG ?? 0.9
  skyUniforms['sunPosition'].value.copy(sunPosition)

  const lightColor = new THREE.Color(...(config.sunLightColor || [1.0, 0.92, 0.75]))
  const sunLight = new THREE.DirectionalLight(lightColor, config.sunLightIntensity ?? 1.5)
  sunLight.position.copy(sunPosition).multiplyScalar(100)
  scene.add(sunLight)

  const ambient = new THREE.AmbientLight(0xffffff, config.ambientIntensity ?? 0.15)
  scene.add(ambient)

  return { sky, sunLight, sunPosition, ambientLight: ambient }
}
```

Remove the module-level `FOG_COLOR` and `LIGHT_COLOR` constants (they're now inline from config).

- [ ] **Step 2: Verify build**

Run: `npx vite build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/meadow/MeadowScene.js
git commit -m "feat: setupScene accepts config for fog, sky, lighting"
```

---

### Task 4: Make TerrainPlane accept config

**Files:**
- Modify: `src/meadow/TerrainPlane.js`

- [ ] **Step 1: Add config parameter**

```javascript
// Keep getTerrainHeight as a module-level default but allow override
const defaultHeightFn = (x, z) =>
  Math.sin(x * 0.02) * Math.cos(z * 0.015) * 2.0
  + Math.sin(x * 0.05 + z * 0.03) * 0.5

// The active height function — set by createTerrain, used by anything
// that needs terrain height (CameraRig passes this via config now)
let _activeHeightFn = defaultHeightFn

export function getTerrainHeight(x, z) {
  return _activeHeightFn(x, z)
}

export function createTerrain(scene, config = {}) {
  const size = config.size ?? 400
  const subdivisions = config.subdivisions ?? 128
  const color = config.color || [0.16, 0.18, 0.07]
  const heightFn = config.heightFunction || defaultHeightFn

  // Set the active height function so other systems can use getTerrainHeight()
  _activeHeightFn = heightFn

  const geometry = new THREE.PlaneGeometry(size, size, subdivisions, subdivisions)
  geometry.rotateX(-Math.PI / 2)

  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, heightFn(pos.getX(i), pos.getZ(i)))
  }
  geometry.computeVertexNormals()

  const material = new THREE.MeshLambertMaterial({
    color: new THREE.Color(...color),
    side: THREE.FrontSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  scene.add(mesh)

  return mesh
}
```

Remove the old `TERRAIN_COLOR` constant.

- [ ] **Step 2: Verify build**

Run: `npx vite build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/meadow/TerrainPlane.js
git commit -m "feat: TerrainPlane accepts config for size, subdivisions, height function"
```

---

### Task 5: Make AtmosphereController accept keyframes from config

**Files:**
- Modify: `src/meadow/AtmosphereController.js`

- [ ] **Step 1: Change constructor to accept keyframes**

```javascript
// Change from:
constructor(sceneSetup, grassManager, fireflies, cloudShadows, postProcessing) {
// To:
constructor(sceneSetup, grassManager, fireflies, cloudShadows, postProcessing, keyframes = null) {
```

Keep the current module-level `KEYFRAMES` as `DEFAULT_KEYFRAMES` (rename it). Then in constructor:

```javascript
this.keyframes = keyframes || DEFAULT_KEYFRAMES
```

Update `PARAM_KEYS` and `ARRAY_KEYS` to be computed in the constructor from `this.keyframes[0]` instead of module-level:

```javascript
this._paramKeys = Object.keys(this.keyframes[0]).filter(k => k !== 't')
this._arrayKeys = new Set(
  this._paramKeys.filter(k => Array.isArray(this.keyframes[0][k]))
)

// Initialize current to first keyframe
for (const key of this._paramKeys) {
  const val = this.keyframes[0][key]
  this.current[key] = Array.isArray(val) ? [...val] : val
}
```

Update `update()` to use `this._paramKeys` and `this._arrayKeys` instead of module-level constants.

- [ ] **Step 2: Make _pushToSubsystems handle optional subsystems**

Wrap subsystem updates with null checks so environments without certain subsystems don't crash:

```javascript
_pushToSubsystems() {
  const c = this.current

  // Sky — always present
  const sky = this.sceneSetup.sky
  // ... (existing sky code, unchanged)

  // Grass — may not exist in all environments
  if (this.grassManager) {
    const gm = this.grassManager
    gm.material.uniforms.uBaseColor.value.setRGB(...c.grassBaseColor)
    // ... (rest of grass updates)
  }

  // Cloud shadows — optional
  if (this.cloudShadows) {
    this.cloudShadows.material.opacity = c.cloudShadowOpacity
    this.cloudShadows._driftSpeed = c.cloudDriftSpeed
  }

  // Fireflies — optional
  if (this.fireflies) {
    this.fireflies.material.uniforms.uSize.value = c.fireflySize
    this.fireflies.material.uniforms.uBrightness.value = c.fireflyBrightness
    this.fireflies.points.visible = c.fireflyBrightness > 0.01
  }

  // ... rest stays the same but with null checks on this.dustMotes, this.godRayPass
}
```

- [ ] **Step 3: Verify build**

Run: `npx vite build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/meadow/AtmosphereController.js
git commit -m "feat: AtmosphereController accepts custom keyframes, null-safe subsystem updates"
```

---

### Task 6: Make FireflySystem accept config

**Files:**
- Modify: `src/meadow/FireflySystem.js`

- [ ] **Step 1: Add config for spread area and height range**

```javascript
// Change constructor from:
constructor(scene, count = 500) {
// To:
constructor(scene, config = {}) {
    const count = config.count ?? 500
    const spread = config.spread ?? 200
    const heightMin = config.heightMin ?? 0.3
    const heightMax = config.heightMax ?? 1.5
```

In the position generation loop:
```javascript
positions[i * 3 + 0] = (Math.random() - 0.5) * spread
positions[i * 3 + 1] = Math.random() * (heightMax - heightMin) + heightMin
positions[i * 3 + 2] = (Math.random() - 0.5) * spread
```

- [ ] **Step 2: Verify build**

Run: `npx vite build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/meadow/FireflySystem.js
git commit -m "feat: FireflySystem accepts config for count, spread, height range"
```

---

### Task 7: Wire config through MeadowEngine

**Files:**
- Modify: `src/meadow/MeadowEngine.js`

This is the keystone task — MeadowEngine accepts an envConfig and threads it to all subsystems.

- [ ] **Step 1: Change constructor to accept envConfig**

```javascript
// Change from:
constructor(canvas) {
// To:
constructor(canvas, envConfig = null) {
```

Add after tier detection:
```javascript
this.envConfig = envConfig || {}
```

- [ ] **Step 2: Thread config to subsystems**

Replace hardcoded subsystem construction with config-driven construction:

```javascript
// Camera
const camCfg = this.envConfig.camera || {}
this.camera = new THREE.PerspectiveCamera(
  camCfg.fov ?? 45,
  window.innerWidth / window.innerHeight,
  camCfg.near ?? 0.1,
  camCfg.far ?? 2000
)

// Scene setup
this.sceneSetup = setupScene(this.scene, this.envConfig.scene)

// Terrain
this.terrain = createTerrain(this.scene, this.envConfig.terrain)

// CameraRig — pass terrain height function from config or from TerrainPlane
this.cameraRig = new CameraRig(this.camera, {
  ...(this.envConfig.camera || {}),
  getTerrainHeight: (this.envConfig.terrain?.heightFunction) || getTerrainHeight,
})

// Content section positions use env config section t-values
const sectionTs = this.envConfig.sections
  ? this.envConfig.sections.map(s => s.t)
  : SECTION_T_VALUES
this._sectionPositions = sectionTs.map(t => this.cameraRig.curve.getPoint(t))
```

- [ ] **Step 3: Conditionally create subsystems**

```javascript
// Cloud shadows
const cloudCfg = this.envConfig.cloudShadows || { enabled: true }
this.cloudShadows = cloudCfg.enabled !== false ? new CloudShadows(this.scene) : null

// Grass — merge env grass config with tier config
const grassCfg = this.envConfig.grass || { enabled: true }
const grassTierConfig = { ...this.config }
if (grassCfg.count) grassTierConfig.grassCount = grassCfg.count
if (grassCfg.chunks) grassTierConfig.grassChunks = grassCfg.chunks
this.grassManager = grassCfg.enabled !== false
  ? new GrassChunkManager(this.scene, grassTierConfig, this.cloudShadows?.texture)
  : null

// Fireflies
const ffCfg = this.envConfig.fireflies || { enabled: true }
this.fireflies = ffCfg.enabled !== false
  ? new FireflySystem(this.scene, ffCfg)
  : null

// Flowers
const flowerCfg = this.envConfig.flowers || { enabled: true }
this.flowers = flowerCfg.enabled !== false
  ? new FlowerInstances(this.scene, this.cameraRig, flowerCfg.count ?? 800)
  : null

// Post-processing (always created — effects controlled by atmosphere)
this.postProcessing = new PostProcessingStack(
  this.renderer, this.scene, this.camera,
  this.config.postFX
)

// Atmosphere — use env keyframes
this.atmosphere = new AtmosphereController(
  this.sceneSetup,
  this.grassManager,
  this.fireflies,
  this.cloudShadows,
  this.postProcessing,
  this.envConfig.keyframes || null
)

// Score sheets
const scoreCfg = this.envConfig.scoreSheets || { enabled: true }
this.scoreSheets = scoreCfg.enabled !== false
  ? new ScoreSheetCloth(this.scene, scoreCfg.count ?? 3)
  : null

// Artist figure
const figureCfg = this.envConfig.artistFigure || { enabled: true }
this.artistFigure = figureCfg.enabled !== false
  ? new ArtistFigure(this.scene)
  : null

// Music trigger
const musicCfg = this.envConfig.musicTrigger || { enabled: true }
this.musicTrigger = musicCfg.enabled !== false
  ? new MusicTrigger(this.postProcessing, { threshold: musicCfg.threshold ?? 0.35 })
  : null

// Portals
const portalCfg = this.envConfig.portals || { enabled: true }
this.portals = portalCfg.enabled !== false
  ? new PortalHint(this.scene, this.camera)
  : null

// Dust motes
const dustCfg = this.envConfig.dustMotes || { enabled: true }
this.dustMotes = dustCfg.enabled !== false
  ? new DustMotes(this.scene, dustCfg.count ?? 300)
  : null

// God rays
const godRayCfg = this.envConfig.godRays || { enabled: true }
this.godRayPass = godRayCfg.enabled !== false
  ? new GodRayPass(this.renderer, this.scene, this.camera, this.sceneSetup.sunPosition)
  : null

// Cursor interaction
const cursorCfg = this.envConfig.cursorInteraction || { enabled: true }
this.cursorInteraction = cursorCfg.enabled !== false
  ? new CursorInteraction()
  : null

this.audioReactive = new AudioReactive()

// Wire optional subsystems to atmosphere
if (this.dustMotes) this.atmosphere.dustMotes = this.dustMotes
if (this.godRayPass) this.atmosphere.godRayPass = this.godRayPass
```

- [ ] **Step 4: Null-safe _tick()**

Update `_tick()` to handle null subsystems:

```javascript
_tick() {
  const delta = this.clock.getDelta()
  const elapsed = this.clock.getElapsedTime()
  const animElapsed = this.reducedMotion ? 0 : elapsed

  this.cameraRig.update(this.scrollEngine.progress, this.scrollEngine.velocity)
  const camPos = this.cameraRig.getPosition()
  this.cloudShadows?.update(animElapsed)
  this.grassManager?.update(camPos, animElapsed)
  this.fireflies?.update(animElapsed)
  this.flowers?.update(animElapsed)

  if (!this.atmosphere.paused) {
    this.atmosphere.update(this.scrollEngine.progress)
  }

  this.musicTrigger?.update(this.scrollEngine.progress, delta)
  this.scoreSheets?.update(animElapsed)
  if (this.scoreSheets) {
    this.scoreSheets.setWindStrength(this.atmosphere.current.grassWindSpeed / 1.5)
  }
  this.artistFigure?.update(camPos)
  this.portals?.update(animElapsed)
  this.dustMotes?.update(animElapsed)

  if (this.cursorInteraction) {
    this.cursorInteraction.update(this.camera, delta)
    if (this.grassManager) {
      const brushStrength = this.cursorInteraction.isOnGround
        ? Math.min(this.cursorInteraction.speed * 0.5, 4.0)
        : 0
      this.grassManager.updateCursor(
        this.cursorInteraction.worldPos,
        brushStrength,
        this.cursorInteraction.velocity
      )
    }
  }
  this.audioReactive.update(delta)

  this._updateContentVisibility()

  if (this.godRayPass) {
    this.postProcessing.setGodRayTexture(this.godRayPass.render(), this.godRayPass.intensity)
  }

  this.postProcessing.update(this.scrollEngine.velocity, camPos, this._sectionPositions)

  if (this.audioReactive.analyser) {
    this.postProcessing.bloom.intensity += this.audioReactive.bass * 0.3
    this.postProcessing.ca.uniforms.get('uDistortion').value += this.audioReactive.mid * 0.15
  }

  this.postProcessing.render(delta)
  requestAnimationFrame(this._tick)
}
```

- [ ] **Step 5: Null-safe destroy()**

```javascript
destroy() {
  window.removeEventListener('resize', this._onResize)
  this.scrollEngine?.destroy()
  this.grassManager?.dispose()
  this.flowers?.dispose()
  this.fireflies?.dispose()
  this.postProcessing?.dispose()
  this.musicTrigger?.dispose()
  this.scoreSheets?.dispose()
  this.artistFigure?.dispose()
  this.portals?.dispose()
  this.dustMotes?.dispose()
  this.godRayPass?.dispose()
  this.audioReactive?.dispose()
  this.cursorInteraction?.dispose()
  this.cameraRig?.dispose()
  this.cloudShadows?.dispose()
  this.renderer.dispose()
}
```

(destroy() already uses `?.` — verify it covers all subsystems)

- [ ] **Step 6: Verify build**

Run: `npx vite build`
Expected: Build succeeds

- [ ] **Step 7: Open dev server, verify Golden Meadow renders identically**

Run: `npx vite dev`
Visual check: meadow should look exactly the same as before (no config passed = all defaults)

- [ ] **Step 8: Commit**

```bash
git add src/meadow/MeadowEngine.js
git commit -m "feat: MeadowEngine accepts envConfig, threads to all subsystems, null-safe tick/destroy"
```

---

## Chunk 2: Routing & EnvironmentScene

**Goal:** Add React Router so each route creates a fresh engine with the right environment config. Navigation between routes tears down and rebuilds the engine.

### Task 8: Install React Router

- [ ] **Step 1: Install react-router-dom**

Run: `npm install react-router-dom`

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add react-router-dom"
```

---

### Task 9: Create EnvironmentScene wrapper

**Files:**
- Create: `src/EnvironmentScene.jsx`

- [ ] **Step 1: Write EnvironmentScene component**

```jsx
// src/EnvironmentScene.jsx
import { useEffect, useRef, useCallback, useState } from 'react'
import MeadowEngine from './meadow/MeadowEngine.js'
import { getEnvironment } from './meadow/environments/index.js'
import ContentOverlay from './content/ContentOverlay.jsx'
import DevTuner from './DevTuner.jsx'
import useScrollAudio from './useScrollAudio.js'

export default function EnvironmentScene({ envName }) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const [isTier3, setIsTier3] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    // Reset scroll to top for fresh environment
    window.scrollTo(0, 0)

    const envConfig = getEnvironment(envName)
    engineRef.current = new MeadowEngine(canvasRef.current, envConfig)
    window.__MEADOW_ENGINE__ = engineRef.current

    if (engineRef.current.tier === 3) {
      setIsTier3(true)
    }

    return () => {
      engineRef.current?.destroy()
      engineRef.current = null
    }
  }, [envName])

  useScrollAudio(engineRef)

  const handleSectionsReady = useCallback((sections) => {
    const register = () => {
      if (engineRef.current) {
        engineRef.current.setContentSections(sections)
      } else {
        requestAnimationFrame(register)
      }
    }
    register()
  }, [])

  // Get section config from environment
  const envConfig = getEnvironment(envName)
  const sectionConfig = envConfig.sections || []

  return (
    <>
      <div style={{ height: '500vh' }} />
      {isTier3 ? (
        <div className="static-meadow-fallback" />
      ) : (
        <canvas
          ref={canvasRef}
          style={{ position: 'fixed', inset: 0, zIndex: 0 }}
        />
      )}
      <ContentOverlay
        sections={sectionConfig}
        onSectionsReady={handleSectionsReady}
      />
      <DevTuner engineRef={engineRef} />
    </>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npx vite build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/EnvironmentScene.jsx
git commit -m "feat: add EnvironmentScene wrapper for route-based environment loading"
```

---

### Task 10: Create Nav component

**Files:**
- Create: `src/Nav.jsx`
- Create: `src/nav.css`

- [ ] **Step 1: Write Nav component**

```jsx
// src/Nav.jsx
import { NavLink } from 'react-router-dom'
import './nav.css'

const ROUTES = [
  { path: '/', label: 'MKS' },
  { path: '/listen', label: 'Listen' },
  { path: '/story', label: 'Story' },
  { path: '/collect', label: 'Collect' },
  { path: '/witness', label: 'Witness' },
]

export default function Nav() {
  return (
    <nav className="site-nav">
      {ROUTES.map(({ path, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
```

- [ ] **Step 2: Write nav.css**

```css
/* src/nav.css */
.site-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1.2rem 2rem;
  pointer-events: none;
}

.nav-link {
  pointer-events: auto;
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.85rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary, #90a0a0);
  text-decoration: none;
  opacity: 0.6;
  transition: opacity 0.4s ease;
}

.nav-link:hover,
.nav-link.active {
  opacity: 1;
  color: var(--text-primary, #c8d4e8);
}

@media (prefers-reduced-motion: reduce) {
  .nav-link { transition: none; }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/Nav.jsx src/nav.css
git commit -m "feat: add minimal Nav component for route switching"
```

---

### Task 11: Update ContentOverlay to accept sections from config

**Files:**
- Modify: `src/content/ContentOverlay.jsx`

- [ ] **Step 1: Accept sections prop, fall back to defaults**

```jsx
import { useEffect, useRef } from 'react'
import { SECTION_T_VALUES } from '../meadow/constants.js'
import LandingContent from './LandingContent.jsx'
import MusicContent from './MusicContent.jsx'
import AboutContent from './AboutContent.jsx'
import StoreContent from './StoreContent.jsx'
import FooterContent from './FooterContent.jsx'
import './content-overlay.css'

// Component registry — maps string names to React components
const COMPONENT_MAP = {
  LandingContent,
  MusicContent,
  AboutContent,
  StoreContent,
  FooterContent,
}

const DEFAULT_SECTIONS = SECTION_T_VALUES.map((t, i) => ({
  t,
  component: ['LandingContent', 'MusicContent', 'AboutContent', 'StoreContent', 'FooterContent'][i],
}))

export default function ContentOverlay({ sections, onSectionsReady }) {
  const containerRef = useRef(null)
  const activeSections = sections && sections.length > 0 ? sections : DEFAULT_SECTIONS

  useEffect(() => {
    if (!containerRef.current) return
    const sectionEls = containerRef.current.querySelectorAll('.content-section')
    onSectionsReady?.(Array.from(sectionEls))
  }, [onSectionsReady, activeSections])

  return (
    <div ref={containerRef} className="content-overlay">
      {activeSections.map(({ t, component }) => {
        const Component = COMPONENT_MAP[component]
        if (!Component) return null
        return (
          <div
            key={t}
            className="content-section"
            data-section-t={t}
            style={{ opacity: 0, pointerEvents: 'none' }}
          >
            <Component />
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npx vite build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/content/ContentOverlay.jsx
git commit -m "feat: ContentOverlay accepts sections config prop"
```

---

### Task 12: Update App.jsx with routing

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace App with Router-based version**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EnvironmentScene from './EnvironmentScene.jsx'
import MiniPlayer from './MiniPlayer.jsx'
import MoonlightCursor from './MoonlightCursor.jsx'
import Nav from './Nav.jsx'

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<EnvironmentScene envName="golden-meadow" />} />
        <Route path="/listen" element={<EnvironmentScene envName="golden-meadow" />} />
        <Route path="/story" element={<EnvironmentScene envName="golden-meadow" />} />
        <Route path="/collect" element={<EnvironmentScene envName="golden-meadow" />} />
        <Route path="/witness" element={<EnvironmentScene envName="golden-meadow" />} />
      </Routes>
      <MiniPlayer />
      <MoonlightCursor />
    </BrowserRouter>
  )
}

export default App
```

Note: All routes use `golden-meadow` for now. As each environment config is created, the route switches to use it.

- [ ] **Step 2: Verify build**

Run: `npx vite build`
Expected: Build succeeds

- [ ] **Step 3: Test in dev server**

Run: `npx vite dev`
- Navigate to `/` — Golden Meadow renders
- Navigate to `/listen` — engine destroys and recreates (same meadow, but fresh instance)
- Navigate back to `/` — no memory leaks, clean recreation
- Check browser console for WebGL errors

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add React Router with EnvironmentScene per route"
```

---

## Chunk 3: Night Meadow Environment

**Goal:** Create the first genuinely different environment — same terrain but at night. This validates the entire config system works.

**Emotional temperature:** Bittersweet Letting Go — "knowing that someday this pain will be joined with peace"

### Task 13: Create Night Meadow config

**Files:**
- Create: `src/meadow/environments/night-meadow.js`
- Modify: `src/meadow/environments/index.js`

- [ ] **Step 1: Write night-meadow.js**

Key differences from Golden Meadow:
- Sun below horizon (nighttime)
- Dark blue-black fog
- 800 fireflies (more, brighter — they ARE the warmth)
- Slower wind
- No flowers, no god rays, no artist figure
- Heavier vignette, noisier grain
- Lower camera (immersed in grass)

```javascript
// src/meadow/environments/night-meadow.js

// Night Meadow — About / Story
// Emotional temperature: Bittersweet Letting Go
// "Knowing that someday this pain will be joined with peace and more beauty than I can imagine"
export default {
  name: 'night-meadow',
  route: '/story',

  camera: {
    fov: 45,
    near: 0.1,
    far: 2000,
    splinePoints: [
      [0, 0, 0],
      [3, 0, -20],
      [-2, 0, -45],
      [4, 0, -70],
      [-3, 0, -95],
      [2, 0, -120],
      [0, 0, -150],
    ],
    heightOffset: 1.2,  // lower — immersed in grass
    lerpFactor: 0.03,   // slower — contemplative
    fovMaxBoost: 12,
    fovLerpBack: 0.03,
    panFactor: Math.PI / 25,
  },

  terrain: {
    size: 400,
    subdivisions: 128,
    color: [0.05, 0.08, 0.05],  // dark earth
    // Same terrain shape as golden meadow — it's the SAME place, different time
    heightFunction: (x, z) =>
      Math.sin(x * 0.02) * Math.cos(z * 0.015) * 2.0
      + Math.sin(x * 0.05 + z * 0.03) * 0.5,
  },

  scene: {
    fogColor: [0.04, 0.04, 0.08],    // blue-black night
    fogDensity: 0.006,
    skyScale: 10000,
    sunElevation: -30,                // deep below horizon
    sunAzimuth: 180,
    skyTurbidity: 2,
    skyRayleigh: 0.5,
    skyMieCoefficient: 0.001,
    skyMieDirectionalG: 0.8,
    sunLightColor: [0.15, 0.18, 0.30],  // moonlight blue
    sunLightIntensity: 0.3,
    ambientIntensity: 0.06,
  },

  grass: {
    enabled: true,
    count: 40000,
    chunks: 5,
  },

  fireflies: {
    enabled: true,
    count: 800,        // MORE than meadow — they are the warmth
    spread: 200,
    heightMin: 0.2,
    heightMax: 2.0,    // higher — floating above grass
  },

  flowers: { enabled: false },           // no flowers at night
  cloudShadows: { enabled: false },        // opacity 0 in all keyframes, skip GPU work
  dustMotes: { enabled: false },          // dust isn't visible at night
  godRays: { enabled: false },            // no sun = no rays
  scoreSheets: { enabled: true, count: 2 },  // fewer, scattered on ground
  artistFigure: { enabled: false },       // you ARE the viewer
  portals: { enabled: false },
  cursorInteraction: { enabled: true },
  musicTrigger: { enabled: true, threshold: 0.35 },

  sections: [
    { t: 0.15, component: 'AboutContent' },
    { t: 0.50, component: 'AboutContent' },
    { t: 0.85, component: 'FooterContent' },
  ],

  keyframes: [
    {
      t: 0.0,  // DEEP NIGHT — stillness, stars, held silence
      sunElevation: -30, sunAzimuth: 180,
      turbidity: 2, rayleigh: 0.5, mieCoefficient: 0.001, mieDirectionalG: 0.8,
      fogColor: [0.02, 0.02, 0.06], fogDensity: 0.010,
      sunLightColor: [0.10, 0.12, 0.25], sunLightIntensity: 0.15,
      ambientIntensity: 0.03,
      grassBaseColor: [0.01, 0.02, 0.01], grassTipColor: [0.02, 0.06, 0.04],
      grassWindSpeed: 0.05, grassAmbientStrength: 0.10, grassTranslucency: 0.1, grassFogFade: 0.004,
      cloudShadowOpacity: 0.0, cloudDriftSpeed: 0.00001,
      fireflyBrightness: 0.3, fireflySize: 50,
      bloomIntensity: 0.4, bloomThreshold: 0.5,
      fogDepthStrength: 0.08, fogMidColor: [0.04, 0.04, 0.10], fogFarColor: [0.02, 0.02, 0.06],
      colorGradeContrast: 0.04, colorGradeVibrance: 0.15, colorGradeWarmth: 0.0,
      vignetteDarkness: 0.85, grainOpacity: 0.08,
      dustMoteBrightness: 0.0, godRayIntensity: 0.0, kuwaharaStrength: 0.0,
    },
    {
      t: 0.25,  // FIREFLIES EMERGE — first warmth in the dark
      sunElevation: -25, sunAzimuth: 180,
      turbidity: 2, rayleigh: 0.5, mieCoefficient: 0.001, mieDirectionalG: 0.8,
      fogColor: [0.03, 0.03, 0.07], fogDensity: 0.007,
      sunLightColor: [0.12, 0.15, 0.28], sunLightIntensity: 0.20,
      ambientIntensity: 0.04,
      grassBaseColor: [0.01, 0.03, 0.02], grassTipColor: [0.04, 0.10, 0.06],
      grassWindSpeed: 0.15, grassAmbientStrength: 0.12, grassTranslucency: 0.2, grassFogFade: 0.003,
      cloudShadowOpacity: 0.0, cloudDriftSpeed: 0.00001,
      fireflyBrightness: 0.8, fireflySize: 70,
      bloomIntensity: 0.5, bloomThreshold: 0.45,
      fogDepthStrength: 0.06, fogMidColor: [0.05, 0.05, 0.12], fogFarColor: [0.03, 0.03, 0.08],
      colorGradeContrast: 0.05, colorGradeVibrance: 0.20, colorGradeWarmth: 0.01,
      vignetteDarkness: 0.80, grainOpacity: 0.07,
      dustMoteBrightness: 0.0, godRayIntensity: 0.0, kuwaharaStrength: 0.0,
    },
    {
      t: 0.50,  // PEAK GLOW — fireflies everywhere, amber warmth in midnight blue
      sunElevation: -20, sunAzimuth: 180,
      turbidity: 2, rayleigh: 0.6, mieCoefficient: 0.002, mieDirectionalG: 0.8,
      fogColor: [0.04, 0.04, 0.08], fogDensity: 0.005,
      sunLightColor: [0.15, 0.18, 0.30], sunLightIntensity: 0.25,
      ambientIntensity: 0.05,
      grassBaseColor: [0.02, 0.05, 0.03], grassTipColor: [0.06, 0.15, 0.08],
      grassWindSpeed: 0.25, grassAmbientStrength: 0.15, grassTranslucency: 0.4, grassFogFade: 0.002,
      cloudShadowOpacity: 0.0, cloudDriftSpeed: 0.00002,
      fireflyBrightness: 1.5, fireflySize: 90,
      bloomIntensity: 0.6, bloomThreshold: 0.40,
      fogDepthStrength: 0.05, fogMidColor: [0.06, 0.06, 0.14], fogFarColor: [0.04, 0.04, 0.10],
      colorGradeContrast: 0.08, colorGradeVibrance: 0.30, colorGradeWarmth: 0.02,
      vignetteDarkness: 0.70, grainOpacity: 0.06,
      dustMoteBrightness: 0.0, godRayIntensity: 0.0, kuwaharaStrength: 0.0,
    },
    {
      t: 0.75,  // SETTLING — the pain joined with peace, breath out
      sunElevation: -25, sunAzimuth: 180,
      turbidity: 2, rayleigh: 0.5, mieCoefficient: 0.001, mieDirectionalG: 0.8,
      fogColor: [0.03, 0.03, 0.07], fogDensity: 0.007,
      sunLightColor: [0.12, 0.15, 0.28], sunLightIntensity: 0.20,
      ambientIntensity: 0.04,
      grassBaseColor: [0.01, 0.04, 0.02], grassTipColor: [0.05, 0.12, 0.07],
      grassWindSpeed: 0.10, grassAmbientStrength: 0.12, grassTranslucency: 0.3, grassFogFade: 0.003,
      cloudShadowOpacity: 0.0, cloudDriftSpeed: 0.00001,
      fireflyBrightness: 0.6, fireflySize: 65,
      bloomIntensity: 0.45, bloomThreshold: 0.50,
      fogDepthStrength: 0.07, fogMidColor: [0.05, 0.05, 0.12], fogFarColor: [0.03, 0.03, 0.08],
      colorGradeContrast: 0.05, colorGradeVibrance: 0.20, colorGradeWarmth: 0.01,
      vignetteDarkness: 0.80, grainOpacity: 0.07,
      dustMoteBrightness: 0.0, godRayIntensity: 0.0, kuwaharaStrength: 0.0,
    },
    {
      t: 1.0,  // FADE — returning to darkness, the memory remains
      sunElevation: -30, sunAzimuth: 180,
      turbidity: 2, rayleigh: 0.5, mieCoefficient: 0.001, mieDirectionalG: 0.8,
      fogColor: [0.02, 0.02, 0.05], fogDensity: 0.012,
      sunLightColor: [0.08, 0.10, 0.20], sunLightIntensity: 0.10,
      ambientIntensity: 0.02,
      grassBaseColor: [0.01, 0.02, 0.01], grassTipColor: [0.02, 0.05, 0.03],
      grassWindSpeed: 0.03, grassAmbientStrength: 0.08, grassTranslucency: 0.1, grassFogFade: 0.005,
      cloudShadowOpacity: 0.0, cloudDriftSpeed: 0.00001,
      fireflyBrightness: 0.15, fireflySize: 40,
      bloomIntensity: 0.3, bloomThreshold: 0.6,
      fogDepthStrength: 0.10, fogMidColor: [0.03, 0.03, 0.08], fogFarColor: [0.02, 0.02, 0.05],
      colorGradeContrast: 0.03, colorGradeVibrance: 0.10, colorGradeWarmth: 0.0,
      vignetteDarkness: 0.90, grainOpacity: 0.09,
      dustMoteBrightness: 0.0, godRayIntensity: 0.0, kuwaharaStrength: 0.0,
    },
  ],
}
```

- [ ] **Step 2: Register in environments/index.js**

```javascript
import goldenMeadow from './golden-meadow.js'
import nightMeadow from './night-meadow.js'

export const ENVIRONMENTS = {
  'golden-meadow': goldenMeadow,
  'night-meadow': nightMeadow,
}

export function getEnvironment(name) {
  const env = ENVIRONMENTS[name]
  if (!env) throw new Error(`Unknown environment: ${name}. Available: ${Object.keys(ENVIRONMENTS).join(', ')}`)
  return env
}
```

- [ ] **Step 3: Update App.jsx route**

Change the `/story` route to use night-meadow:

```jsx
<Route path="/story" element={<EnvironmentScene envName="night-meadow" />} />
```

- [ ] **Step 4: Verify build**

Run: `npx vite build`
Expected: Build succeeds

- [ ] **Step 5: Visual test**

Run: `npx vite dev`
- Navigate to `/story` — should see dark meadow with blue-black sky, bright fireflies, no flowers
- Navigate back to `/` — golden meadow returns cleanly
- Switch back and forth several times — no WebGL errors, no memory leaks

- [ ] **Step 6: Commit**

```bash
git add src/meadow/environments/ src/App.jsx
git commit -m "feat: add Night Meadow environment — dark sky, fireflies, bittersweet atmosphere"
```

---

## Chunk 4: Storm Field Environment

**Goal:** Build the Storm Field (Tour / Witness) — urgent, dark, wind and rain. Requires new subsystems: RainSystem and LightningFlash.

**Emotional temperature:** The Search — "running through whatever obstacles, determined, passionate"

### Task 14: Create RainSystem

**Files:**
- Create: `src/meadow/RainSystem.js`

- [ ] **Step 1: Write RainSystem with velocity-stretched particles**

```javascript
// src/meadow/RainSystem.js — velocity-stretched rain particles
// Steal from: three.quarks stretched_bb concept, simplified for Points
import * as THREE from 'three'

export default class RainSystem {
  constructor(scene, config = {}) {
    const count = config.count ?? 2000
    const spread = config.spread ?? 200
    this._speed = config.speed ?? 15.0
    this._windX = config.windX ?? 0.5

    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread
      positions[i * 3 + 1] = Math.random() * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread
      velocities[i * 3] = this._windX
      velocities[i * 3 + 1] = -this._speed
      velocities[i * 3 + 2] = 0
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this._velocities = velocities
    this._count = count
    this._spread = spread

    this.material = new THREE.PointsMaterial({
      color: 0x8899aa,
      size: 0.15,
      transparent: true,
      opacity: 0.4,
      blending: THREE.NormalBlending,
      depthWrite: false,
    })

    this.points = new THREE.Points(geometry, this.material)
    scene.add(this.points)
  }

  update(delta, cameraPos) {
    const positions = this.points.geometry.attributes.position.array
    for (let i = 0; i < this._count; i++) {
      const i3 = i * 3
      positions[i3] += this._velocities[i3] * delta
      positions[i3 + 1] += this._velocities[i3 + 1] * delta
      positions[i3 + 2] += this._velocities[i3 + 2] * delta

      // Reset raindrop when it falls below ground
      if (positions[i3 + 1] < -1) {
        positions[i3] = cameraPos.x + (Math.random() - 0.5) * this._spread
        positions[i3 + 1] = 30 + Math.random() * 10
        positions[i3 + 2] = cameraPos.z + (Math.random() - 0.5) * this._spread
      }
    }
    this.points.geometry.attributes.position.needsUpdate = true
  }

  dispose() {
    this.points.geometry.dispose()
    this.material.dispose()
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/RainSystem.js
git commit -m "feat: add RainSystem — velocity-stretched rain particles"
```

---

### Task 15: Create LightningFlash

**Files:**
- Create: `src/meadow/LightningFlash.js`

- [ ] **Step 1: Write LightningFlash system**

```javascript
// src/meadow/LightningFlash.js — screen flash + ambient boost for lightning
export default class LightningFlash {
  constructor() {
    this._flashIntensity = 0
    this._decayRate = 5.0  // per second
    this._nextFlashTime = 3 + Math.random() * 8  // 3-11 seconds
    this._elapsed = 0
  }

  update(delta) {
    this._elapsed += delta

    // Trigger flash at random intervals
    if (this._elapsed >= this._nextFlashTime) {
      this._flashIntensity = 1.0
      this._nextFlashTime = this._elapsed + 4 + Math.random() * 12  // 4-16 seconds between
    }

    // Decay flash
    if (this._flashIntensity > 0) {
      this._flashIntensity = Math.max(0, this._flashIntensity - this._decayRate * delta)
    }
  }

  get intensity() {
    return this._flashIntensity
  }

  dispose() {
    // nothing to clean up
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/LightningFlash.js
git commit -m "feat: add LightningFlash — random screen flash with decay"
```

---

### Task 16: Create Storm Field config

**Files:**
- Create: `src/meadow/environments/storm-field.js`
- Modify: `src/meadow/environments/index.js`

- [ ] **Step 1: Write storm-field.js**

```javascript
// src/meadow/environments/storm-field.js

// Storm Field — Tour / Witness
// Emotional temperature: The Search
// "Running through whatever obstacles are presented... breath comes harder... ears strain"
export default {
  name: 'storm-field',
  route: '/witness',

  camera: {
    fov: 50,            // wider — urgency
    near: 0.1,
    far: 2000,
    splinePoints: [
      [0, 0, 0],
      [2, 0, -30],
      [-1, 0, -60],
      [3, 0, -90],
      [-2, 0, -120],
      [1, 0, -150],
      [0, 0, -180],
    ],
    heightOffset: 1.0,  // low to ground — running
    lerpFactor: 0.08,   // faster — urgency
    fovMaxBoost: 25,    // more dramatic velocity zoom
    fovLerpBack: 0.06,
    panFactor: Math.PI / 30,
  },

  terrain: {
    size: 400,
    subdivisions: 128,
    color: [0.06, 0.06, 0.04],  // dark barren earth
    // Sharper terrain — DiamondSquare feel via more octaves
    heightFunction: (x, z) =>
      Math.sin(x * 0.015) * Math.cos(z * 0.012) * 3.0
      + Math.sin(x * 0.04 + z * 0.035) * 1.2
      + Math.sin(x * 0.08 + z * 0.06) * 0.4,
  },

  scene: {
    fogColor: [0.04, 0.04, 0.06],    // near-black
    fogDensity: 0.008,
    skyScale: 10000,
    sunElevation: 5,
    sunAzimuth: 200,
    skyTurbidity: 20,                  // heavy overcast
    skyRayleigh: 0.3,
    skyMieCoefficient: 0.005,
    skyMieDirectionalG: 0.7,
    sunLightColor: [0.3, 0.3, 0.35],  // cold grey light
    sunLightIntensity: 0.4,
    ambientIntensity: 0.05,
  },

  grass: {
    enabled: true,
    count: 35000,
    chunks: 5,
  },

  fireflies: { enabled: false },
  flowers: { enabled: false },
  cloudShadows: { enabled: true },
  dustMotes: { enabled: false },
  godRays: { enabled: false },
  scoreSheets: { enabled: false },
  artistFigure: { enabled: false },
  portals: { enabled: false },
  cursorInteraction: { enabled: true },
  musicTrigger: { enabled: true, threshold: 0.30 },

  // Storm-specific subsystems (handled in MeadowEngine via envConfig.rain / envConfig.lightning)
  rain: { enabled: true, count: 2000, spread: 200, speed: 15.0, windX: 0.5 },
  lightning: { enabled: true },

  sections: [
    { t: 0.20, component: 'StoreContent' },  // tour dates
    { t: 0.50, component: 'StoreContent' },
    { t: 0.80, component: 'FooterContent' },
  ],

  keyframes: [
    {
      t: 0.0,  // GATHERING — dark clouds, wind rising
      sunElevation: 5, sunAzimuth: 200,
      turbidity: 20, rayleigh: 0.3, mieCoefficient: 0.005, mieDirectionalG: 0.7,
      fogColor: [0.03, 0.03, 0.05], fogDensity: 0.012,
      sunLightColor: [0.25, 0.25, 0.30], sunLightIntensity: 0.3,
      ambientIntensity: 0.04,
      grassBaseColor: [0.02, 0.03, 0.01], grassTipColor: [0.06, 0.08, 0.04],
      grassWindSpeed: 1.5, grassAmbientStrength: 0.08, grassTranslucency: 0.1, grassFogFade: 0.006,
      cloudShadowOpacity: 0.0, cloudDriftSpeed: 0.0001,
      fireflyBrightness: 0.0, fireflySize: 0,
      bloomIntensity: 0.05, bloomThreshold: 0.95,
      fogDepthStrength: 0.10, fogMidColor: [0.05, 0.05, 0.08], fogFarColor: [0.03, 0.03, 0.05],
      colorGradeContrast: 0.06, colorGradeVibrance: 0.05, colorGradeWarmth: 0.0,
      vignetteDarkness: 0.90, grainOpacity: 0.10,
      dustMoteBrightness: 0.0, godRayIntensity: 0.0, kuwaharaStrength: 0.0,
    },
    {
      t: 0.30,  // BUILDING — wind intensifies, rain thickens
      sunElevation: 3, sunAzimuth: 200,
      turbidity: 22, rayleigh: 0.2, mieCoefficient: 0.004, mieDirectionalG: 0.7,
      fogColor: [0.04, 0.04, 0.06], fogDensity: 0.010,
      sunLightColor: [0.30, 0.30, 0.35], sunLightIntensity: 0.35,
      ambientIntensity: 0.05,
      grassBaseColor: [0.03, 0.04, 0.02], grassTipColor: [0.08, 0.10, 0.05],
      grassWindSpeed: 2.5, grassAmbientStrength: 0.10, grassTranslucency: 0.15, grassFogFade: 0.005,
      cloudShadowOpacity: 0.0, cloudDriftSpeed: 0.00012,
      fireflyBrightness: 0.0, fireflySize: 0,
      bloomIntensity: 0.08, bloomThreshold: 0.90,
      fogDepthStrength: 0.08, fogMidColor: [0.06, 0.06, 0.10], fogFarColor: [0.04, 0.04, 0.06],
      colorGradeContrast: 0.08, colorGradeVibrance: 0.08, colorGradeWarmth: 0.0,
      vignetteDarkness: 0.88, grainOpacity: 0.10,
      dustMoteBrightness: 0.0, godRayIntensity: 0.0, kuwaharaStrength: 0.0,
    },
    {
      t: 0.55,  // PEAK STORM — maximum intensity, lightning, urgency
      sunElevation: 2, sunAzimuth: 200,
      turbidity: 25, rayleigh: 0.15, mieCoefficient: 0.003, mieDirectionalG: 0.6,
      fogColor: [0.05, 0.05, 0.07], fogDensity: 0.008,
      sunLightColor: [0.35, 0.35, 0.40], sunLightIntensity: 0.4,
      ambientIntensity: 0.06,
      grassBaseColor: [0.04, 0.05, 0.02], grassTipColor: [0.10, 0.12, 0.06],
      grassWindSpeed: 3.5, grassAmbientStrength: 0.12, grassTranslucency: 0.2, grassFogFade: 0.004,
      cloudShadowOpacity: 0.0, cloudDriftSpeed: 0.00015,
      fireflyBrightness: 0.0, fireflySize: 0,
      bloomIntensity: 0.12, bloomThreshold: 0.85,
      fogDepthStrength: 0.06, fogMidColor: [0.08, 0.08, 0.12], fogFarColor: [0.05, 0.05, 0.08],
      colorGradeContrast: 0.10, colorGradeVibrance: 0.10, colorGradeWarmth: 0.0,
      vignetteDarkness: 0.85, grainOpacity: 0.12,
      dustMoteBrightness: 0.0, godRayIntensity: 0.0, kuwaharaStrength: 0.0,
    },
    {
      t: 0.80,  // BREAKING — storm begins to pass, first light cracks through
      sunElevation: 8, sunAzimuth: 210,
      turbidity: 15, rayleigh: 0.5, mieCoefficient: 0.008, mieDirectionalG: 0.8,
      fogColor: [0.08, 0.08, 0.10], fogDensity: 0.006,
      sunLightColor: [0.50, 0.48, 0.45], sunLightIntensity: 0.6,
      ambientIntensity: 0.08,
      grassBaseColor: [0.04, 0.06, 0.03], grassTipColor: [0.12, 0.15, 0.08],
      grassWindSpeed: 2.0, grassAmbientStrength: 0.15, grassTranslucency: 0.4, grassFogFade: 0.003,
      cloudShadowOpacity: 0.05, cloudDriftSpeed: 0.0001,
      fireflyBrightness: 0.0, fireflySize: 0,
      bloomIntensity: 0.20, bloomThreshold: 0.75,
      fogDepthStrength: 0.05, fogMidColor: [0.12, 0.12, 0.15], fogFarColor: [0.08, 0.08, 0.10],
      colorGradeContrast: 0.08, colorGradeVibrance: 0.15, colorGradeWarmth: 0.02,
      vignetteDarkness: 0.75, grainOpacity: 0.08,
      dustMoteBrightness: 0.0, godRayIntensity: 0.1, kuwaharaStrength: 0.0,
    },
    {
      t: 1.0,  // AFTERMATH — wind settling, grey calm
      sunElevation: 5, sunAzimuth: 200,
      turbidity: 18, rayleigh: 0.4, mieCoefficient: 0.005, mieDirectionalG: 0.7,
      fogColor: [0.06, 0.06, 0.08], fogDensity: 0.008,
      sunLightColor: [0.40, 0.38, 0.38], sunLightIntensity: 0.45,
      ambientIntensity: 0.06,
      grassBaseColor: [0.03, 0.05, 0.02], grassTipColor: [0.10, 0.12, 0.06],
      grassWindSpeed: 1.0, grassAmbientStrength: 0.12, grassTranslucency: 0.2, grassFogFade: 0.004,
      cloudShadowOpacity: 0.02, cloudDriftSpeed: 0.00008,
      fireflyBrightness: 0.0, fireflySize: 0,
      bloomIntensity: 0.10, bloomThreshold: 0.85,
      fogDepthStrength: 0.08, fogMidColor: [0.08, 0.08, 0.12], fogFarColor: [0.05, 0.05, 0.08],
      colorGradeContrast: 0.06, colorGradeVibrance: 0.08, colorGradeWarmth: 0.0,
      vignetteDarkness: 0.85, grainOpacity: 0.09,
      dustMoteBrightness: 0.0, godRayIntensity: 0.0, kuwaharaStrength: 0.0,
    },
  ],
}
```

- [ ] **Step 2: Register in environments/index.js**

Add `import stormField from './storm-field.js'` and `'storm-field': stormField` to ENVIRONMENTS.

- [ ] **Step 3: Commit**

```bash
git add src/meadow/environments/storm-field.js src/meadow/environments/index.js
git commit -m "feat: add Storm Field environment config"
```

---

### Task 17: Wire rain and lightning into MeadowEngine

**Files:**
- Modify: `src/meadow/MeadowEngine.js`

- [ ] **Step 1: Import new systems**

```javascript
import RainSystem from './RainSystem.js'
import LightningFlash from './LightningFlash.js'
```

- [ ] **Step 2: Create conditionally in constructor**

After the other optional subsystem creation:

```javascript
// Rain (Storm Field only)
const rainCfg = this.envConfig.rain || { enabled: false }
this.rain = rainCfg.enabled ? new RainSystem(this.scene, rainCfg) : null

// Lightning (Storm Field only)
const lightningCfg = this.envConfig.lightning || { enabled: false }
this.lightning = lightningCfg.enabled ? new LightningFlash() : null
```

- [ ] **Step 3: Update _tick()**

Add after dustMotes update:

```javascript
if (this.rain) {
  this.rain.update(delta, camPos)
}
if (this.lightning) {
  this.lightning.update(delta)
  // Flash boosts ambient light momentarily
  if (this.lightning.intensity > 0 && this.sceneSetup.ambientLight) {
    this.sceneSetup.ambientLight.intensity += this.lightning.intensity * 2.0
  }
}
```

- [ ] **Step 4: Update destroy()**

```javascript
this.rain?.dispose()
this.lightning?.dispose()
```

- [ ] **Step 5: Update the /witness route in App.jsx**

```jsx
<Route path="/witness" element={<EnvironmentScene envName="storm-field" />} />
```

- [ ] **Step 6: Verify build**

Run: `npx vite build`
Expected: Build succeeds

- [ ] **Step 7: Visual test**

Run: `npx vite dev`
- Navigate to `/witness` — dark scene, rain falling, occasional lightning flash
- Wind should be strong (grass bending hard)
- No flowers, no fireflies
- Navigate back to `/` — golden meadow clean

- [ ] **Step 8: Commit**

```bash
git add src/meadow/MeadowEngine.js src/meadow/RainSystem.js src/meadow/LightningFlash.js src/App.jsx
git commit -m "feat: wire rain + lightning into engine, add Storm Field route"
```

---

## Chunk 5: Ocean Cliff Environment (Future — Requires 3D Assets)

> **Note:** Ocean Cliff requires 3D model assets (cliff geometry, seated figure) and the ocean shader from `thaslle/stylized-water`. This chunk is outlined but should be executed after downloading and preparing assets.

### Task 18 (outlined): Create ocean shader from stylized-water extraction

**Files to create:**
- `src/meadow/OceanPlane.js`
- `src/meadow/shaders/ocean.vert.glsl`
- `src/meadow/shaders/ocean.frag.glsl`

Source: `research/extractions/stylized-water.md` — copy vertex + fragment shaders, adapt uniforms for Three.js ShaderMaterial. Key params: `uColorNear: 0x0a2e3d`, `uColorFar: 0x050d1a`, foam threshold, wave bob amplitude.

### Task 19 (outlined): Create ocean-cliff.js environment config

Similar structure to night-meadow.js but with:
- Different terrain height function (cliff geometry — steep on one side)
- Ocean plane subsystem (new)
- Seated figure GLB model
- Teal color palette
- Camera arc around figure
- Fewer grass blades (cliff-top only)
- Sea spray particles

### Task 20 (outlined): Download and integrate 3D assets

- Download cliff scan from Sketchfab (`29ee42a5...`)
- Download/create seated figure model
- Optimize with `gltf-transform` → Draco compress
- Place in `src/assets/models/`
- Load via GLTFLoader in MeadowEngine when envConfig specifies models

---

## Chunk 6: Ghibli Painterly Environment (Future)

> Requires existing Kuwahara pipeline to be enhanced and cel-shading shader from `craftzdog/ghibli-style-shader`. Outlined, not detailed.

### Task 21 (outlined): Create ghibli-painterly.js config
### Task 22 (outlined): Enhance Kuwahara post-processing for full-scene effect
### Task 23 (outlined): Add cel-shading material system for trees/ground

---

## Verification Checklist

After all chunks are complete:

- [ ] `npx vite build` passes with no errors
- [ ] `/` renders Golden Meadow (identical to before this work)
- [ ] `/story` renders Night Meadow (dark, fireflies, no flowers)
- [ ] `/witness` renders Storm Field (rain, lightning, wind)
- [ ] Navigating between all routes produces no WebGL errors
- [ ] No memory leaks (check Chrome DevTools Memory tab after 10 route switches)
- [ ] DevTuner still works on each environment
- [ ] `prefers-reduced-motion` still freezes camera in all environments
- [ ] MiniPlayer persists across route changes
- [ ] MoonlightCursor works across route changes
