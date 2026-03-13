# Atmospheric Scroll Arc — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the static meadow into a scroll-driven emotional journey with atmospheric keyframes, a music trigger, score sheet cloth, an artist figure billboard, portal hints, and elevated typography.

**Architecture:** A new `AtmosphereController` defines 5 keyframe states (atmospheric moods at scroll positions) and smoothstep-interpolates between them each frame, pushing values to every existing subsystem (sky, fog, grass, fireflies, post-processing). Three visual elements are added to the scene: flying score sheet cloth, an artist figure billboard, and portal shimmer hints. A music trigger fires at the awakening→alive transition. Typography is upgraded in CSS.

**Tech Stack:** Three.js (vanilla), Lenis scroll, postprocessing (pmndrs), Web Audio API, GLSL shaders, CSS custom properties

---

## Chunk 1: AtmosphereController — The Core System

### Task 1: Create AtmosphereController with keyframe data and interpolation

**Files:**
- Create: `src/meadow/AtmosphereController.js`

- [ ] **Step 1: Create the keyframe data and interpolation engine**

```js
// src/meadow/AtmosphereController.js
import * as THREE from 'three'

// Smoothstep for eased transitions between zones
function smoothstep(t) {
  t = Math.max(0, Math.min(1, t))
  return t * t * (3 - 2 * t)
}

function lerpScalar(a, b, t) {
  return a + (b - a) * t
}

function lerpArray(a, b, t) {
  return a.map((v, i) => v + (b[i] - v) * t)
}

// ─── 5 Keyframe States ───
// Each keyframe defines EVERY atmospheric parameter at a scroll position.
// Values are interpolated between adjacent keyframes via smoothstep.
const KEYFRAMES = [
  {
    t: 0.0, // STILLNESS — sacred anticipation
    sunElevation: 2,
    sunAzimuth: 240,
    turbidity: 14,
    rayleigh: 2.0,
    mieCoefficient: 0.01,
    mieDirectionalG: 0.95,
    fogColor: [0.25, 0.25, 0.35],
    fogDensity: 0.012,
    sunLightColor: [0.7, 0.7, 0.8],
    sunLightIntensity: 0.5,
    ambientIntensity: 0.08,
    grassBaseColor: [0.02, 0.08, 0.02],
    grassTipColor: [0.08, 0.18, 0.06],
    grassWindSpeed: 0.3,
    grassAmbientStrength: 0.25,
    grassTranslucency: 1.0,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.05,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.0,
    fireflySize: 40,
    bloomIntensity: 0.2,
    bloomThreshold: 0.8,
    fogDepthStrength: 0.03,
    fogMidColor: [0.6, 0.6, 0.7],
    fogFarColor: [0.4, 0.4, 0.5],
    colorGradeContrast: 0.18,
    colorGradeVibrance: 0.8,
    colorGradeWarmth: 0.08,
    vignetteDarkness: 0.7,
    grainOpacity: 0.04,
  },
  {
    t: 0.25, // AWAKENING — light arriving
    sunElevation: 8,
    sunAzimuth: 240,
    turbidity: 12,
    rayleigh: 1.8,
    mieCoefficient: 0.009,
    mieDirectionalG: 0.92,
    fogColor: [0.55, 0.50, 0.45],
    fogDensity: 0.005,
    sunLightColor: [0.85, 0.82, 0.75],
    sunLightIntensity: 1.0,
    ambientIntensity: 0.12,
    grassBaseColor: [0.04, 0.15, 0.02],
    grassTipColor: [0.18, 0.40, 0.08],
    grassWindSpeed: 1.0,
    grassAmbientStrength: 0.30,
    grassTranslucency: 1.5,
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.10,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.0,
    fireflySize: 50,
    bloomIntensity: 0.4,
    bloomThreshold: 0.7,
    fogDepthStrength: 0.05,
    fogMidColor: [0.8, 0.72, 0.55],
    fogFarColor: [0.5, 0.5, 0.55],
    colorGradeContrast: 0.20,
    colorGradeVibrance: 1.2,
    colorGradeWarmth: 0.10,
    vignetteDarkness: 0.55,
    grainOpacity: 0.035,
  },
  {
    t: 0.50, // ALIVE — peak beauty, golden hour
    sunElevation: 12,
    sunAzimuth: 240,
    turbidity: 10,
    rayleigh: 1.5,
    mieCoefficient: 0.008,
    mieDirectionalG: 0.9,
    fogColor: [0.85, 0.78, 0.55],
    fogDensity: 0.003,
    sunLightColor: [1.0, 0.92, 0.75],
    sunLightIntensity: 1.5,
    ambientIntensity: 0.15,
    grassBaseColor: [0.05, 0.18, 0.02],
    grassTipColor: [0.22, 0.50, 0.10],
    grassWindSpeed: 1.5,
    grassAmbientStrength: 0.35,
    grassTranslucency: 2.0,
    grassFogFade: 0.0015,
    cloudShadowOpacity: 0.15,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.5,
    fireflySize: 70,
    bloomIntensity: 0.6,
    bloomThreshold: 0.6,
    fogDepthStrength: 0.06,
    fogMidColor: [1.0, 0.88, 0.55],
    fogFarColor: [0.55, 0.55, 0.65],
    colorGradeContrast: 0.22,
    colorGradeVibrance: 1.6,
    colorGradeWarmth: 0.14,
    vignetteDarkness: 0.4,
    grainOpacity: 0.03,
  },
  {
    t: 0.75, // DEEPENING — peak emotional intensity
    sunElevation: 6,
    sunAzimuth: 240,
    turbidity: 12,
    rayleigh: 1.8,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.95,
    fogColor: [0.92, 0.72, 0.40],
    fogDensity: 0.004,
    sunLightColor: [1.0, 0.85, 0.60],
    sunLightIntensity: 1.8,
    ambientIntensity: 0.12,
    grassBaseColor: [0.08, 0.15, 0.02],
    grassTipColor: [0.35, 0.50, 0.12],
    grassWindSpeed: 2.0,
    grassAmbientStrength: 0.30,
    grassTranslucency: 2.5,
    grassFogFade: 0.0012,
    cloudShadowOpacity: 0.12,
    cloudDriftSpeed: 0.00007,
    fireflyBrightness: 1.0,
    fireflySize: 90,
    bloomIntensity: 0.85,
    bloomThreshold: 0.5,
    fogDepthStrength: 0.08,
    fogMidColor: [1.0, 0.80, 0.45],
    fogFarColor: [0.65, 0.55, 0.50],
    colorGradeContrast: 0.25,
    colorGradeVibrance: 1.8,
    colorGradeWarmth: 0.18,
    vignetteDarkness: 0.35,
    grainOpacity: 0.025,
  },
  {
    t: 1.0, // QUIETING — resolution
    sunElevation: 10,
    sunAzimuth: 240,
    turbidity: 10,
    rayleigh: 1.5,
    mieCoefficient: 0.008,
    mieDirectionalG: 0.9,
    fogColor: [0.65, 0.62, 0.58],
    fogDensity: 0.004,
    sunLightColor: [0.95, 0.90, 0.80],
    sunLightIntensity: 1.2,
    ambientIntensity: 0.15,
    grassBaseColor: [0.04, 0.16, 0.03],
    grassTipColor: [0.20, 0.45, 0.12],
    grassWindSpeed: 0.8,
    grassAmbientStrength: 0.35,
    grassTranslucency: 1.5,
    grassFogFade: 0.0018,
    cloudShadowOpacity: 0.10,
    cloudDriftSpeed: 0.00004,
    fireflyBrightness: 0.3,
    fireflySize: 60,
    bloomIntensity: 0.4,
    bloomThreshold: 0.65,
    fogDepthStrength: 0.05,
    fogMidColor: [0.80, 0.75, 0.60],
    fogFarColor: [0.55, 0.55, 0.60],
    colorGradeContrast: 0.20,
    colorGradeVibrance: 1.3,
    colorGradeWarmth: 0.12,
    vignetteDarkness: 0.5,
    grainOpacity: 0.035,
  },
]

// All scalar/array param keys (exclude 't')
const PARAM_KEYS = Object.keys(KEYFRAMES[0]).filter(k => k !== 't')
const ARRAY_KEYS = new Set(
  PARAM_KEYS.filter(k => Array.isArray(KEYFRAMES[0][k]))
)

export default class AtmosphereController {
  constructor(sceneSetup, grassManager, fireflies, cloudShadows, postProcessing) {
    this.sceneSetup = sceneSetup
    this.grassManager = grassManager
    this.fireflies = fireflies
    this.cloudShadows = cloudShadows
    this.postProcessing = postProcessing
    this.keyframes = KEYFRAMES
    this.current = {}

    // Initialize current to first keyframe
    for (const key of PARAM_KEYS) {
      const val = KEYFRAMES[0][key]
      this.current[key] = Array.isArray(val) ? [...val] : val
    }

    // Reusable THREE objects for sun position calc
    this._sunPos = new THREE.Vector3()
  }

  update(scrollProgress) {
    // Find bracketing keyframes
    const kf = this.keyframes
    let prevIdx = 0
    for (let i = 0; i < kf.length - 1; i++) {
      if (scrollProgress >= kf[i].t) prevIdx = i
    }
    const nextIdx = Math.min(prevIdx + 1, kf.length - 1)
    const prev = kf[prevIdx]
    const next = kf[nextIdx]

    // Local t within this segment (0-1), eased
    const range = next.t - prev.t
    const localT = range > 0 ? (scrollProgress - prev.t) / range : 0
    const eased = smoothstep(Math.max(0, Math.min(1, localT)))

    // Interpolate all params
    for (const key of PARAM_KEYS) {
      if (ARRAY_KEYS.has(key)) {
        this.current[key] = lerpArray(prev[key], next[key], eased)
      } else {
        this.current[key] = lerpScalar(prev[key], next[key], eased)
      }
    }

    this._pushToSubsystems()
  }

  _pushToSubsystems() {
    const c = this.current

    // ─── Sky (Preetham) ───
    const sky = this.sceneSetup.sky
    const skyU = sky.material.uniforms
    skyU['turbidity'].value = c.turbidity
    skyU['rayleigh'].value = c.rayleigh
    skyU['mieCoefficient'].value = c.mieCoefficient
    skyU['mieDirectionalG'].value = c.mieDirectionalG

    // Sun position from elevation + azimuth
    const phi = THREE.MathUtils.degToRad(90 - c.sunElevation)
    const theta = THREE.MathUtils.degToRad(c.sunAzimuth)
    this._sunPos.setFromSphericalCoords(1, phi, theta)
    skyU['sunPosition'].value.copy(this._sunPos)

    // ─── Sun light ───
    const sunLight = this.sceneSetup.sunLight
    sunLight.color.setRGB(...c.sunLightColor)
    sunLight.intensity = c.sunLightIntensity
    sunLight.position.copy(this._sunPos).multiplyScalar(100)

    // ─── Ambient light (find it on scene) ───
    // setupScene adds it to scene.children — find by type
    const scene = sky.parent
    if (scene) {
      for (const child of scene.children) {
        if (child.isAmbientLight) {
          child.intensity = c.ambientIntensity
          break
        }
      }
    }

    // ─── Scene fog ───
    if (scene && scene.fog) {
      scene.fog.color.setRGB(...c.fogColor)
      scene.fog.density = c.fogDensity
    }

    // ─── Grass (iterate all chunk materials) ───
    for (const [, chunk] of this.grassManager.chunks) {
      const u = chunk.material.uniforms
      u.uBaseColor.value.setRGB(...c.grassBaseColor)
      u.uTipColor.value.setRGB(...c.grassTipColor)
      u.uSpeed.value = c.grassWindSpeed
      u.uAmbientStrength.value = c.grassAmbientStrength
      u.uTranslucencyStrength.value = c.grassTranslucency
      u.uFogFade.value = c.grassFogFade
    }
    // Also update the base material template (for newly created chunks)
    const baseMat = this.grassManager.material
    baseMat.uniforms.uBaseColor.value.setRGB(...c.grassBaseColor)
    baseMat.uniforms.uTipColor.value.setRGB(...c.grassTipColor)
    baseMat.uniforms.uSpeed.value = c.grassWindSpeed
    baseMat.uniforms.uAmbientStrength.value = c.grassAmbientStrength
    baseMat.uniforms.uTranslucencyStrength.value = c.grassTranslucency
    baseMat.uniforms.uFogFade.value = c.grassFogFade

    // ─── Cloud shadows ───
    this.cloudShadows.material.opacity = c.cloudShadowOpacity
    // drift speed applied in CloudShadows.update — store for next frame
    this.cloudShadows._driftSpeed = c.cloudDriftSpeed

    // ─── Fireflies ───
    this.fireflies.material.uniforms.uSize.value = c.fireflySize
    // Brightness: scale opacity of the entire Points object
    this.fireflies.points.material.opacity = c.fireflyBrightness
    // If brightness is 0, hide entirely to save draw call
    this.fireflies.points.visible = c.fireflyBrightness > 0.01

    // ─── Post-processing ───
    const pp = this.postProcessing
    pp.bloom.intensity = c.bloomIntensity
    pp.bloom.luminancePass.fullscreenMaterial.threshold = c.bloomThreshold
    pp.vignette.darkness = c.vignetteDarkness
    pp.grain.blendMode.opacity.value = c.grainOpacity

    // Fog depth effect
    const fogU = pp.fogDepth.effect.uniforms
    fogU.get('uFogStrength').value = c.fogDepthStrength
    fogU.get('uMidColor').value.set(...c.fogMidColor)
    fogU.get('uFarColor').value.set(...c.fogFarColor)

    // Color grade effect
    const cgU = pp.colorGrade.effect.uniforms
    cgU.get('uContrast').value = c.colorGradeContrast
    cgU.get('uVibrance').value = c.colorGradeVibrance
    cgU.get('uSplitIntensity').value = c.colorGradeWarmth
  }

  // Expose for DevTuner
  getKeyframes() { return this.keyframes }
  getCurrent() { return { ...this.current } }
}
```

- [ ] **Step 2: Verify the file has no syntax errors**

Run: `cd /Users/johnnysheng/mks/mks-site && npx vite build --mode development 2>&1 | head -30`
Expected: No import errors for `AtmosphereController.js` (it's not wired yet, just checking syntax)

- [ ] **Step 3: Commit**

```bash
git add src/meadow/AtmosphereController.js
git commit -m "feat: add AtmosphereController with 5-keyframe atmospheric interpolation engine"
```

---

### Task 2: Wire AtmosphereController into MeadowEngine

**Files:**
- Modify: `src/meadow/MeadowEngine.js`
- Modify: `src/meadow/CloudShadows.js` (add _driftSpeed support)
- Modify: `src/meadow/FireflySystem.js` (ensure opacity/visible works)

- [ ] **Step 1: Update CloudShadows to use _driftSpeed**

In `src/meadow/CloudShadows.js`, change the `update` method to use a dynamic drift speed:

```js
// Replace the fixed drift speed constants in update():
update(elapsed) {
  const speed = this._driftSpeed || 0.00005
  this.texture.offset.x = elapsed * speed
  this.texture.offset.y = elapsed * (speed * 2)
}
```

- [ ] **Step 2: Ensure FireflySystem material supports opacity**

In `src/meadow/FireflySystem.js`, the material already has `transparent: true`. Verify `this.points` is accessible (it is — `this.points` is set in constructor). No changes needed if the property exists. If the `opacity` property doesn't exist on the ShaderMaterial, add it:

The firefly ShaderMaterial uses custom shaders, so `material.opacity` won't work directly. Instead, add a `uBrightness` uniform to the firefly fragment shader.

In `src/meadow/FireflySystem.js`, add the uniform:
```js
uniforms: {
  uTime: { value: 0 },
  uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  uSize: { value: 80 },
  uBrightness: { value: 1.0 },  // ADD THIS
},
```

In `src/meadow/shaders/firefly.frag.glsl`, multiply final color by the brightness uniform:
```glsl
uniform float uBrightness;
// ... existing code ...
// At the end, before gl_FragColor:
// Multiply alpha by brightness for atmosphere-driven fade
gl_FragColor = vec4(col, alpha * uBrightness);
```

Then in `AtmosphereController._pushToSubsystems()`, change the firefly section to:
```js
this.fireflies.material.uniforms.uSize.value = c.fireflySize
this.fireflies.material.uniforms.uBrightness.value = c.fireflyBrightness
this.fireflies.points.visible = c.fireflyBrightness > 0.01
```

- [ ] **Step 3: Wire AtmosphereController into MeadowEngine**

In `src/meadow/MeadowEngine.js`:

Add import at top:
```js
import AtmosphereController from './AtmosphereController.js'
```

After `this.postProcessing = new PostProcessingStack(...)`, add:
```js
// Atmosphere controller — scroll-driven keyframe interpolation
this.atmosphere = new AtmosphereController(
  this.sceneSetup,
  this.grassManager,
  this.fireflies,
  this.cloudShadows,
  this.postProcessing
)
```

In `_tick()`, after `this.flowers.update(animElapsed)` and before `this._updateContentVisibility()`, add:
```js
// Drive atmospheric mood from scroll position
this.atmosphere.update(this.scrollEngine.progress)
```

In `getDevAPI()`, add `atmosphere: this.atmosphere` to the returned object.

- [ ] **Step 4: Run the dev server and verify the atmospheric arc works**

Run: `cd /Users/johnnysheng/mks/mks-site && npm run dev`
Expected: Scroll from 0% to 100% and see the meadow transform from cold/misty/dark to warm/golden/alive to resolved/calm.

- [ ] **Step 5: Commit**

```bash
git add src/meadow/AtmosphereController.js src/meadow/MeadowEngine.js src/meadow/CloudShadows.js src/meadow/FireflySystem.js src/meadow/shaders/firefly.frag.glsl
git commit -m "feat: wire AtmosphereController into MeadowEngine — scroll drives atmospheric mood"
```

---

## Chunk 2: Music Trigger + Score Sheet Cloth + Artist Figure

### Task 3: Create MusicTrigger with BotW discovery moment

**Files:**
- Create: `src/meadow/MusicTrigger.js`

- [ ] **Step 1: Create MusicTrigger**

```js
// src/meadow/MusicTrigger.js
// Triggers a music snippet at a scroll threshold with a visual pulse (BotW discovery feel)

export default class MusicTrigger {
  constructor(postProcessing, options = {}) {
    this.postProcessing = postProcessing
    this.threshold = options.threshold || 0.35
    this.audioSrc = options.audioSrc || null // URL to audio file
    this.triggered = false
    this.audioCtx = null
    this.gainNode = null
    this.sourceNode = null
    this._pulseTime = 0
    this._pulsing = false
    this._baseBloom = 0
    this._baseVignette = 0
  }

  update(scrollProgress, deltaTime) {
    // Check trigger
    if (!this.triggered && scrollProgress >= this.threshold && this.audioSrc) {
      this._trigger()
    }

    // Animate visual pulse
    if (this._pulsing) {
      this._pulseTime += deltaTime
      const t = this._pulseTime
      // Quick bloom spike that decays over 1.5s
      const pulseAmount = Math.max(0, 1.0 - t / 1.5)
      const eased = pulseAmount * pulseAmount // quadratic decay
      this.postProcessing.bloom.intensity = this._baseBloom + eased * 0.5
      this.postProcessing.vignette.darkness = this._baseVignette - eased * 0.2

      if (t > 1.5) {
        this._pulsing = false
        // Restore — AtmosphereController will take over on next frame
      }
    }
  }

  _trigger() {
    this.triggered = true

    // Visual pulse
    this._baseBloom = this.postProcessing.bloom.intensity
    this._baseVignette = this.postProcessing.vignette.darkness
    this._pulseTime = 0
    this._pulsing = true

    // Audio fade-in
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      this.gainNode = this.audioCtx.createGain()
      this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime)
      this.gainNode.gain.linearRampToValueAtTime(0.6, this.audioCtx.currentTime + 2.0)
      this.gainNode.connect(this.audioCtx.destination)

      fetch(this.audioSrc)
        .then(r => r.arrayBuffer())
        .then(buf => this.audioCtx.decodeAudioData(buf))
        .then(decoded => {
          this.sourceNode = this.audioCtx.createBufferSource()
          this.sourceNode.buffer = decoded
          this.sourceNode.connect(this.gainNode)
          this.sourceNode.start()
        })
        .catch(err => console.warn('MusicTrigger: audio load failed', err))
    } catch (err) {
      console.warn('MusicTrigger: Web Audio not available', err)
    }
  }

  dispose() {
    if (this.sourceNode) {
      try { this.sourceNode.stop() } catch (e) { /* ignore */ }
    }
    if (this.audioCtx) {
      this.audioCtx.close()
    }
  }
}
```

- [ ] **Step 2: Wire into MeadowEngine**

In `src/meadow/MeadowEngine.js`:

Import:
```js
import MusicTrigger from './MusicTrigger.js'
```

After `this.atmosphere = new AtmosphereController(...)`:
```js
// Music trigger — BotW discovery moment at scroll threshold
// TODO: Replace with actual MKS audio file path
this.musicTrigger = new MusicTrigger(this.postProcessing, {
  threshold: 0.35,
  audioSrc: null, // Set to audio file URL when available
})
```

In `_tick()`, after `this.atmosphere.update(...)`:
```js
this.musicTrigger.update(this.scrollEngine.progress, delta)
```

In `destroy()`:
```js
this.musicTrigger?.dispose()
```

- [ ] **Step 3: Commit**

```bash
git add src/meadow/MusicTrigger.js src/meadow/MeadowEngine.js
git commit -m "feat: add MusicTrigger with audio fade-in and BotW visual pulse"
```

---

### Task 4: Create ScoreSheetCloth — flying score sheets

**Files:**
- Create: `src/meadow/ScoreSheetCloth.js`

- [ ] **Step 1: Create the score sheet cloth system**

```js
// src/meadow/ScoreSheetCloth.js
// Wind-driven score sheet planes that tumble through the meadow
// Simplified cloth: billboard planes with vertex-shader wind distortion
import * as THREE from 'three'

const SHEET_VERT = `
  uniform float uTime;
  uniform float uWindStrength;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Wind flutter — vertices offset by sine waves
    float flutter = sin(uTime * 2.0 + pos.x * 5.0) * 0.08 * uWindStrength;
    float tumble = sin(uTime * 0.7 + pos.y * 3.0) * 0.05 * uWindStrength;
    pos.z += flutter;
    pos.x += tumble;

    // Gentle curl at edges (fake cloth drape)
    float edgeDist = abs(uv.x - 0.5) * 2.0;
    pos.z -= edgeDist * edgeDist * 0.15;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const SHEET_FRAG = `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uTexture, vUv);
    // Score sheets are mostly white paper with dark notation
    // Apply slight warmth from scene light
    gl_FragColor = vec4(tex.rgb, tex.a * uOpacity);
  }
`

export default class ScoreSheetCloth {
  constructor(scene, count = 3) {
    this.meshes = []
    this.scene = scene
    this._windStrength = 1.0

    // Placeholder white texture until real score sheet image is loaded
    const placeholder = new THREE.DataTexture(
      new Uint8Array([255, 255, 240, 255]), 1, 1
    )
    placeholder.needsUpdate = true

    const geometry = new THREE.PlaneGeometry(1.2, 0.85, 8, 6) // A4-ish proportions

    for (let i = 0; i < count; i++) {
      const material = new THREE.ShaderMaterial({
        vertexShader: SHEET_VERT,
        fragmentShader: SHEET_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uWindStrength: { value: 1.0 },
          uTexture: { value: placeholder },
          uOpacity: { value: 0.85 },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      })

      const mesh = new THREE.Mesh(geometry, material)

      // Spread sheets along the camera path at different heights
      // They float above the grass, drifting with wind
      mesh.position.set(
        (Math.random() - 0.5) * 12,
        1.5 + Math.random() * 2.5,
        -30 - i * 25  // Spread along the Z path
      )
      // Slight initial rotation for variety
      mesh.rotation.set(
        Math.random() * 0.3 - 0.15,
        Math.random() * Math.PI * 2,
        Math.random() * 0.2 - 0.1
      )

      // Store per-sheet animation offsets
      mesh.userData.phaseOffset = Math.random() * Math.PI * 2
      mesh.userData.driftSpeed = 0.3 + Math.random() * 0.5
      mesh.userData.tumbleSpeed = 0.15 + Math.random() * 0.3
      mesh.userData.baseY = mesh.position.y

      scene.add(mesh)
      this.meshes.push(mesh)
    }
  }

  // Call with a loaded texture when the score sheet image is available
  setTexture(texture) {
    for (const mesh of this.meshes) {
      mesh.material.uniforms.uTexture.value = texture
    }
  }

  update(elapsed) {
    for (const mesh of this.meshes) {
      const ud = mesh.userData
      const t = elapsed + ud.phaseOffset

      mesh.material.uniforms.uTime.value = elapsed
      mesh.material.uniforms.uWindStrength.value = this._windStrength

      // Gentle drift (horizontal)
      mesh.position.x += Math.sin(t * 0.3) * 0.002 * this._windStrength
      // Vertical bob
      mesh.position.y = ud.baseY + Math.sin(t * ud.driftSpeed) * 0.3
      // Slow tumble rotation
      mesh.rotation.y += ud.tumbleSpeed * 0.005
      mesh.rotation.z = Math.sin(t * 0.5) * 0.15
    }
  }

  // Called by AtmosphereController to sync wind
  setWindStrength(strength) {
    this._windStrength = strength
  }

  dispose() {
    for (const mesh of this.meshes) {
      this.scene.remove(mesh)
      mesh.geometry.dispose()
      mesh.material.dispose()
    }
  }
}
```

- [ ] **Step 2: Wire into MeadowEngine**

In `src/meadow/MeadowEngine.js`:

Import:
```js
import ScoreSheetCloth from './ScoreSheetCloth.js'
```

After `this.flowers = new FlowerInstances(...)`:
```js
this.scoreSheets = new ScoreSheetCloth(this.scene, 3)
```

In `_tick()`, after `this.flowers.update(animElapsed)`:
```js
this.scoreSheets.update(animElapsed)
// Sync wind strength from atmosphere
this.scoreSheets.setWindStrength(
  this.atmosphere.current.grassWindSpeed / 1.5  // normalize to ~0-1.3
)
```

In `getDevAPI()`, add `scoreSheets: this.scoreSheets`.

In `destroy()`:
```js
this.scoreSheets?.dispose()
```

- [ ] **Step 3: Run dev server and verify score sheets appear**

Run: `npm run dev`
Expected: 3 white rectangular sheets floating and tumbling through the meadow, drifting with wind.

- [ ] **Step 4: Commit**

```bash
git add src/meadow/ScoreSheetCloth.js src/meadow/MeadowEngine.js
git commit -m "feat: add ScoreSheetCloth — wind-driven score sheets tumbling through meadow"
```

---

### Task 5: Create ArtistFigure — 2D cutout of MKS in 3D space

**Files:**
- Create: `src/meadow/ArtistFigure.js`

- [ ] **Step 1: Create the artist figure billboard**

```js
// src/meadow/ArtistFigure.js
// 2D photographic cutout of Michael Kim Sheng projected as a billboard in 3D space
// Positioned at the far end of the meadow, looking up, feeling the music
import * as THREE from 'three'
import { getTerrainHeight } from './TerrainPlane.js'

export default class ArtistFigure {
  constructor(scene) {
    this.scene = scene
    this.mesh = null

    // Position at the far end of the camera spline path
    // The spline ends at approximately z = -160, so place the figure at z = -145
    // (visible from the Deepening zone onward, you scroll toward him)
    this.worldPos = new THREE.Vector3(2, 0, -145)
    this.worldPos.y = getTerrainHeight(this.worldPos.x, this.worldPos.z)

    // Create a placeholder until the real photo is loaded
    this._createPlaceholder()
  }

  _createPlaceholder() {
    // Tall, narrow plane — roughly human proportions
    const geometry = new THREE.PlaneGeometry(1.2, 2.4)
    // Shift geometry origin to bottom center (feet on ground)
    geometry.translate(0, 1.2, 0)

    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.0, // invisible until texture loaded
      side: THREE.DoubleSide,
      alphaTest: 0.1,
    })

    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.copy(this.worldPos)
    this.scene.add(this.mesh)
  }

  // Load the artist photo texture (alpha-masked cutout PNG)
  loadTexture(url) {
    const loader = new THREE.TextureLoader()
    loader.load(url, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      this.mesh.material.map = texture
      this.mesh.material.opacity = 1.0
      this.mesh.material.needsUpdate = true
    })
  }

  update(cameraPosition) {
    if (!this.mesh) return
    // Billboard: always face the camera (Y-axis only — don't tilt)
    const lookTarget = new THREE.Vector3(
      cameraPosition.x,
      this.mesh.position.y + 1.2, // look at mid-height
      cameraPosition.z
    )
    this.mesh.lookAt(lookTarget)
  }

  dispose() {
    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh.geometry.dispose()
      this.mesh.material.dispose()
    }
  }
}
```

- [ ] **Step 2: Wire into MeadowEngine**

In `src/meadow/MeadowEngine.js`:

Import:
```js
import ArtistFigure from './ArtistFigure.js'
```

After `this.scoreSheets = new ScoreSheetCloth(...)`:
```js
this.artistFigure = new ArtistFigure(this.scene)
// TODO: Load actual MKS photo when available:
// this.artistFigure.loadTexture('/assets/mks-cutout.png')
```

In `_tick()`, after `this.scoreSheets.update(...)`:
```js
this.artistFigure.update(camPos)
```

In `destroy()`:
```js
this.artistFigure?.dispose()
```

- [ ] **Step 3: Commit**

```bash
git add src/meadow/ArtistFigure.js src/meadow/MeadowEngine.js
git commit -m "feat: add ArtistFigure — 2D cutout billboard at far end of meadow"
```

---

## Chunk 3: Portal Hints + Typography + DevTuner

### Task 6: Create PortalHint — shimmering spots

**Files:**
- Create: `src/meadow/PortalHint.js`
- Create: `src/meadow/shaders/portal.frag.glsl`
- Create: `src/meadow/shaders/portal.vert.glsl`

- [ ] **Step 1: Create the portal shimmer shader**

```glsl
// src/meadow/shaders/portal.vert.glsl
varying vec2 vUv;
varying float vWorldY;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldY = worldPos.y;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
```

```glsl
// src/meadow/shaders/portal.frag.glsl
uniform float uTime;
uniform vec3 uColor;
uniform float uOpacity;

varying vec2 vUv;
varying float vWorldY;

// Simple hash noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  // Vertical shimmer — aurora-like
  float n1 = noise(vec2(vUv.x * 3.0 + uTime * 0.3, vUv.y * 5.0 - uTime * 0.5));
  float n2 = noise(vec2(vUv.x * 5.0 - uTime * 0.2, vUv.y * 8.0 + uTime * 0.4));
  float shimmer = n1 * 0.6 + n2 * 0.4;

  // Fade at edges (soften into scene)
  float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
  float topFade = smoothstep(1.0, 0.7, vUv.y);
  float bottomFade = smoothstep(0.0, 0.2, vUv.y);

  float alpha = shimmer * edgeFade * topFade * bottomFade * uOpacity;

  // Slight color shift based on height
  vec3 col = uColor + vec3(0.1, 0.05, -0.05) * vUv.y;

  gl_FragColor = vec4(col, alpha * 0.4);
}
```

- [ ] **Step 2: Create PortalHint.js**

```js
// src/meadow/PortalHint.js
// Shimmering portal spots in the meadow that hint at future worlds
import * as THREE from 'three'
import { getTerrainHeight } from './TerrainPlane.js'
import vertexShader from './shaders/portal.vert.glsl?raw'
import fragmentShader from './shaders/portal.frag.glsl?raw'

const PORTAL_CONFIGS = [
  {
    worldPos: [8, 0, -55],    // Visible during Alive zone
    color: [0.3, 0.5, 0.8],   // Cool blue — "The Search"
    label: 'The Search',
  },
  {
    worldPos: [-6, 0, -95],   // Visible during Deepening zone
    color: [0.8, 0.6, 0.3],   // Warm amber — "Bittersweet Letting Go"
    label: 'Bittersweet Letting Go',
  },
  {
    worldPos: [5, 0, -125],   // Visible near the end
    color: [0.7, 0.7, 0.85],  // Cool lavender — "The Final Breath"
    label: 'The Final Breath',
  },
]

export default class PortalHint {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.portals = []
    this.raycaster = new THREE.Raycaster()
    this._mouse = new THREE.Vector2()

    for (const config of PORTAL_CONFIGS) {
      const geometry = new THREE.PlaneGeometry(2, 4)
      // Shift origin to bottom center
      geometry.translate(0, 2, 0)

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(...config.color) },
          uOpacity: { value: 0.6 },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })

      const mesh = new THREE.Mesh(geometry, material)
      const [x, , z] = config.worldPos
      const y = getTerrainHeight(x, z)
      mesh.position.set(x, y, z)
      mesh.userData.label = config.label

      scene.add(mesh)
      this.portals.push({ mesh, config })
    }

    // Click handler
    this._onClick = this._onClick.bind(this)
    window.addEventListener('click', this._onClick)
  }

  update(elapsed) {
    for (const { mesh } of this.portals) {
      mesh.material.uniforms.uTime.value = elapsed
      // Billboard toward camera (Y-axis only)
      mesh.lookAt(
        this.camera.position.x,
        mesh.position.y + 2,
        this.camera.position.z
      )
    }
  }

  _onClick(event) {
    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    this.raycaster.setFromCamera(this._mouse, this.camera)

    const meshes = this.portals.map(p => p.mesh)
    const hits = this.raycaster.intersectObjects(meshes)

    if (hits.length > 0) {
      const label = hits[0].object.userData.label
      this._showComingSoon(label)
    }
  }

  _showComingSoon(label) {
    // Simple overlay — can be upgraded to a proper React modal later
    let overlay = document.getElementById('portal-overlay')
    if (!overlay) {
      overlay = document.createElement('div')
      overlay.id = 'portal-overlay'
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 8000;
        background: rgba(10,10,10,0.85); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        font-family: 'DM Sans', sans-serif; cursor: pointer;
      `
      overlay.addEventListener('click', () => overlay.remove())
      document.body.appendChild(overlay)
    }
    overlay.innerHTML = `
      <div style="text-align:center; color:#c8d4e8;">
        <div style="font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:#5a6a6a; margin-bottom:12px;">THIS WORLD IS BEING COMPOSED</div>
        <div style="font-size:24px; font-weight:300; letter-spacing:0.05em; margin-bottom:8px;">${label}</div>
        <div style="font-size:12px; color:#5a6a6a;">Click anywhere to return</div>
      </div>
    `
  }

  dispose() {
    window.removeEventListener('click', this._onClick)
    for (const { mesh } of this.portals) {
      this.scene.remove(mesh)
      mesh.geometry.dispose()
      mesh.material.dispose()
    }
    const overlay = document.getElementById('portal-overlay')
    if (overlay) overlay.remove()
  }
}
```

- [ ] **Step 3: Wire into MeadowEngine**

In `src/meadow/MeadowEngine.js`:

Import:
```js
import PortalHint from './PortalHint.js'
```

After `this.artistFigure = new ArtistFigure(...)`:
```js
this.portals = new PortalHint(this.scene, this.camera)
```

In `_tick()`, after `this.artistFigure.update(...)`:
```js
this.portals.update(animElapsed)
```

In `destroy()`:
```js
this.portals?.dispose()
```

- [ ] **Step 4: Run dev server and verify portals shimmer**

Run: `npm run dev`
Expected: 3 faint aurora-like vertical shimmers visible along the path. Clicking one shows a "this world is being composed" overlay.

- [ ] **Step 5: Commit**

```bash
git add src/meadow/PortalHint.js src/meadow/shaders/portal.vert.glsl src/meadow/shaders/portal.frag.glsl src/meadow/MeadowEngine.js
git commit -m "feat: add PortalHint — shimmering spots that tease future worlds"
```

---

### Task 7: Typography upgrade

**Files:**
- Modify: `src/index.css` (font imports)
- Modify: `src/content/content-overlay.css` (type styles)
- Modify: `src/content/LandingContent.jsx` (artist name markup)

- [ ] **Step 1: Add font imports to index.css**

At the top of `src/index.css`, add Google Fonts import:

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');
```

Add CSS custom properties for typography:

```css
:root {
  --font-display: 'Cormorant Garamond', 'Georgia', serif;
  --font-body: 'DM Sans', -apple-system, sans-serif;
}
```

- [ ] **Step 2: Update content-overlay.css with gallery typography**

Add these rules to `src/content/content-overlay.css`:

```css
/* ─── Gallery Typography ─── */
.content-overlay .artist-name {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(2.5rem, 6vw, 5rem);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c8d4e8;
  line-height: 1.1;
}

.content-overlay .section-title {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  letter-spacing: 0.08em;
  color: #c8d4e8;
  margin-bottom: 1rem;
}

.content-overlay .body-text {
  font-family: var(--font-body);
  font-weight: 300;
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  line-height: 1.7;
  color: #90a0a0;
  max-width: 42ch;
}

.content-overlay .subtitle {
  font-family: var(--font-display);
  font-weight: 300;
  font-style: italic;
  font-size: clamp(1rem, 1.5vw, 1.3rem);
  color: #5a6a6a;
  letter-spacing: 0.04em;
}
```

- [ ] **Step 3: Update LandingContent with proper markup**

In `src/content/LandingContent.jsx`, update the artist name to use the new class:

```jsx
<h1 className="artist-name">Michael Kim Sheng</h1>
<p className="subtitle">Composer</p>
```

- [ ] **Step 4: Verify typography renders**

Run: `npm run dev`
Expected: Artist name in thin, wide-spaced Cormorant Garamond serif. Body text in DM Sans. The "expensive gallery" feel.

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/content/content-overlay.css src/content/LandingContent.jsx
git commit -m "feat: upgrade typography — Cormorant Garamond display + DM Sans body"
```

---

### Task 8 (Optional): DevTuner keyframe zone selector

**Files:**
- Modify: `src/DevTuner.jsx`

This task is OPTIONAL — nice to have for tuning but not required for the experience.

- [ ] **Step 1: Add a zone dropdown to DevTuner header**

In `src/DevTuner.jsx`, add a select element in the header that shows the 5 zones (Stillness, Awakening, Alive, Deepening, Quieting). When selected, the parameter sliders reflect that keyframe's values. Editing a slider updates the corresponding keyframe in `atmosphere.keyframes[zoneIndex]`.

The implementation is straightforward DOM work — read `atmosphere.getKeyframes()`, render a `<select>` with 5 options, bind slider changes to the selected keyframe object. This follows the existing DevTuner pattern.

- [ ] **Step 2: Commit**

```bash
git add src/DevTuner.jsx
git commit -m "feat: add keyframe zone selector to DevTuner for atmospheric tuning"
```
