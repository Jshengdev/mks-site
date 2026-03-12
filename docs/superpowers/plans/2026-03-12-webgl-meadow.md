# WebGL Meadow Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the MKS site as a scroll-driven 3D BotW-style meadow using vanilla Three.js + React DOM overlay, with all shader code adapted from GitHub reference repos.

**Architecture:** Single Three.js scene with spatial chunking (Approach A). Lenis smooth scroll drives a CatmullRomCurve3 camera path through instanced grass. React DOM content sections overlaid on the WebGL canvas, fading in/out based on camera proximity. 8-effect post-processing pipeline for cinematic look.

**Tech Stack:** React 19, Vite 7, Three.js, Lenis, pmndrs/postprocessing, three-good-godrays, raw GLSL (adapted from reference repos)

**Spec:** `docs/superpowers/specs/2026-03-12-webgl-meadow-design.md`

---

## Reference Code

All reference source code lives in `docs/webgl-reference/`. Workers MUST read the relevant reference file before writing each adapted file. Key sources:

| Reference File | What To Steal |
|----------------|---------------|
| `nitash-biswas--grass-vertex.glsl` | 4-layer wind `deform()` function, billboard rotation, fake normals |
| `nitash-biswas--grass-fragment.glsl` | Base-to-tip color gradient, directional light |
| `nitash-biswas--grass-setup.jsx` | InstancedMesh LOD pattern, blade geometry generator |
| `al-ro--grass.js` | ACES tonemapping, iquilez fog, translucent lighting, quaternion blade bend, infinite tiling |
| `james-smyth--grass.vert.glsl` | BotW vertex color wind weights |
| `james-smyth--grass.frag.glsl` | Cloud shadow UV scrolling |
| `james-smyth--grass-setup.js` | Merged geometry generation with `generateBlade()` |
| `spacejack-terra--world.ts` | FOG_COLOR, GRASS_COLOR, GLARE_COLOR constants, scene orchestration |
| `alex-dg--fireflies-material.js` | FirefliesMaterial class (additive blending, depthWrite: false) |
| `alex-dg--fireflies-vertex.glsl` | Point particle vertical bob with perspective size |
| `alex-dg--fireflies-fragment.glsl` | Inverse-distance radial glow |
| `toon-shader-threejs.glsl` | Step-function toon lighting for flowers |

---

## File Structure

```
src/
  main.jsx                              # UNCHANGED
  App.jsx                               # MODIFIED — canvas + DOM overlay shell
  App.css                               # MODIFIED — add canvas layout styles
  index.css                             # UNCHANGED

  meadow/
    MeadowEngine.js                     # Top-level: renderer, render loop, resize, orchestration
    ScrollEngine.js                     # Lenis wrapper, exposes progress + velocity
    CameraRig.js                        # CatmullRomCurve3 spline + damped lerp
    TierDetection.js                    # Performance tier detection (1/2/3)
    MeadowScene.js                      # Scene setup: sky, terrain, fog, lights
    TerrainPlane.js                     # Rolling hills PlaneGeometry
    CloudShadows.js                     # Scrolling noise texture plane
    GrassGeometry.js                    # Blade mesh generator (high + low LOD)
    GrassChunkManager.js                # Chunk pool, activation, disposal, fade-in
    FlowerInstances.js                  # GLTF loading, instancing, toon shader
    FireflySystem.js                    # Points + shader particle system
    PostProcessingStack.js              # EffectComposer + all 8 effects

    shaders/
      grass.vert.glsl                   # 4-layer wind (from Nitash-Biswas + al-ro)
      grass.frag.glsl                   # Lighting + fog (from al-ro + James-Smyth + spacejack)
      firefly.vert.glsl                 # Vertical bob (from Alex-DG)
      firefly.frag.glsl                 # Radial glow (from Alex-DG)
      flower.vert.glsl                  # Simplified wind (adapted from grass)
      flower.frag.glsl                  # Toon shading (from daniel-ilett/maya-ndljk)

  content/
    ContentOverlay.jsx                  # All content sections, DOM-driven opacity
    LandingContent.jsx                  # Title, subtitle
    MusicContent.jsx                    # Album art, tracklist
    AboutContent.jsx                    # Bio, narrative
    StoreContent.jsx                    # Products
    FooterContent.jsx                   # Links, credits
    content-overlay.css                 # Content section styles

  MiniPlayer.jsx                        # UNCHANGED (survives)
  MiniPlayer.css                        # UNCHANGED (survives)
  MoonlightCursor.jsx                   # UNCHANGED (survives)
  useScrollAudio.js                     # MODIFIED — consume Lenis progress

  assets/
    textures/
      cloud.jpg                         # Cloud shadow texture (download from al-ro)
      noise.jpg                         # Perlin noise (download from al-ro)
    models/
      flowers/                          # .glb flower models (6 types, source or create)
    luts/
      botw-golden-hour.cube             # LUT file (create in DaVinci Resolve or use placeholder)
```

---

## Chunk 1: Foundation & Scaffold

**Result:** Scrolling moves a camera along an S-curve spline in an empty dark scene. Full-viewport Three.js canvas renders behind React DOM.

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`

- [ ] **Step 1: Install npm packages**

```bash
cd mks-site
npm install three lenis postprocessing three-good-godrays
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add three.js, lenis, postprocessing dependencies"
```

---

### Task 2: ScrollEngine

**Files:**
- Create: `src/meadow/ScrollEngine.js`

**Reference:** Lenis docs at `darkroomengineering/lenis`. The scroll engine owns a tall scroll container (500vh) that creates the scroll range. It exposes `progress` (0→1) and `velocity` as plain properties — no callbacks, no events. Other systems read these values synchronously each frame.

- [ ] **Step 1: Create ScrollEngine.js**

```js
// src/meadow/ScrollEngine.js
import Lenis from 'lenis'

export default class ScrollEngine {
  constructor() {
    this.progress = 0
    this.velocity = 0
    this._raf = null

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    })

    this.lenis.on('scroll', (e) => {
      this.progress = e.progress
      this.velocity = e.velocity
    })

    this._tick = this._tick.bind(this)
    this._tick(performance.now())
  }

  _tick(time) {
    this.lenis.raf(time)
    this._raf = requestAnimationFrame(this._tick)
  }

  destroy() {
    cancelAnimationFrame(this._raf)
    this.lenis.destroy()
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/ScrollEngine.js
git commit -m "feat: add ScrollEngine (Lenis wrapper)"
```

---

### Task 3: TierDetection

**Files:**
- Create: `src/meadow/TierDetection.js`

**Reference:** Spec Section 10 for exact thresholds.

- [ ] **Step 1: Create TierDetection.js**

```js
// src/meadow/TierDetection.js
export function detectTier(renderer) {
  const width = window.screen.width
  const cores = navigator.hardwareConcurrency || 2

  // Tier 3: Mobile or no WebGL2
  if (width <= 768 || !renderer.capabilities.isWebGL2) return 3

  // Tier 2: Integrated GPU / low-end laptop
  const maxTexSize = renderer.capabilities.maxTextureSize
  if (cores <= 4 || maxTexSize <= 4096 || width <= 1366) return 2

  // Tier 1: Desktop with dedicated GPU
  return 1
}

export const TIER_CONFIG = {
  1: { grassCount: 100000, grassChunks: 6, postFX: 'full' },
  2: { grassCount: 30000, grassChunks: 4, postFX: 'reduced' },
  3: { grassCount: 0, grassChunks: 0, postFX: 'css' },
}
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/TierDetection.js
git commit -m "feat: add performance tier detection"
```

---

### Task 4: CameraRig

**Files:**
- Create: `src/meadow/CameraRig.js`

**Reference:** Spec Section 3 (Camera Path). The S-curve control points define a winding path through the meadow. Camera height is ~1.5 units (eye-level in grass). The `lookAt` target is slightly ahead on the spline (`t + 0.01`) so turns feel natural. Lerp factor 0.05 gives buttery damping.

- [ ] **Step 1: Create CameraRig.js**

```js
// src/meadow/CameraRig.js
import * as THREE from 'three'

export default class CameraRig {
  constructor(camera) {
    this.camera = camera
    this.currentT = 0
    this.targetT = 0
    this.lerpFactor = 0.05

    // S-curve control points (world space, Z is forward)
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.5, 0),
      new THREE.Vector3(6, 1.5, -25),
      new THREE.Vector3(-4, 1.5, -50),
      new THREE.Vector3(8, 1.5, -75),
      new THREE.Vector3(-6, 1.5, -100),
      new THREE.Vector3(4, 1.5, -130),
      new THREE.Vector3(0, 1.5, -160),
    ])
  }

  update(scrollProgress) {
    this.targetT = scrollProgress
    this.currentT += (this.targetT - this.currentT) * this.lerpFactor

    const pos = this.curve.getPoint(this.currentT)
    const lookTarget = this.curve.getPoint(Math.min(this.currentT + 0.01, 1.0))

    this.camera.position.copy(pos)
    this.camera.lookAt(lookTarget)
  }

  getPosition() {
    return this.curve.getPoint(this.currentT)
  }

  getCurrentT() {
    return this.currentT
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/CameraRig.js
git commit -m "feat: add CameraRig with CatmullRomCurve3 S-curve"
```

---

### Task 5: MeadowEngine Scaffold

**Files:**
- Create: `src/meadow/MeadowEngine.js`

**Reference:** Spec Section 2 (Architecture). This is the top-level orchestrator. It creates the Three.js renderer, scene, and camera, then wires scroll → camera. Later chunks will add subsystems (grass, flowers, fireflies, post-processing) by adding lines to `init()` and `_tick()`.

- [ ] **Step 1: Create MeadowEngine.js**

```js
// src/meadow/MeadowEngine.js
import * as THREE from 'three'
import ScrollEngine from './ScrollEngine.js'
import CameraRig from './CameraRig.js'
import { detectTier, TIER_CONFIG } from './TierDetection.js'

export default class MeadowEngine {
  constructor(canvas) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    )

    // Detect performance tier
    this.tier = detectTier(this.renderer)
    this.config = TIER_CONFIG[this.tier]

    // Tier 3: no WebGL, bail early
    if (this.tier === 3) {
      this.renderer.dispose()
      canvas.style.display = 'none'
      return
    }

    // Scroll engine (Lenis)
    this.scrollEngine = new ScrollEngine()

    // Camera rig (spline path)
    this.cameraRig = new CameraRig(this.camera)

    // Content section DOM elements (set by setContentSections)
    this._contentSections = []

    // Clock for delta time
    this.clock = new THREE.Clock()

    // Resize handler
    this._onResize = this._onResize.bind(this)
    window.addEventListener('resize', this._onResize)

    // Start render loop
    this._tick = this._tick.bind(this)
    this._tick()
  }

  // Called by React to register content section DOM elements
  setContentSections(elements) {
    this._contentSections = elements
  }

  _tick() {
    if (this.tier === 3) return

    const delta = this.clock.getDelta()
    const elapsed = this.clock.getElapsedTime()

    // Update camera from scroll
    this.cameraRig.update(this.scrollEngine.progress)

    // Update content section visibility
    this._updateContentVisibility()

    // Render
    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(this._tick)
  }

  _updateContentVisibility() {
    const t = this.cameraRig.getCurrentT()
    for (const el of this._contentSections) {
      const sectionT = parseFloat(el.dataset.sectionT)
      const dist = Math.abs(t - sectionT)
      // smoothstep: visible within 3%, faded by 8%
      const opacity = 1.0 - this._smoothstep(0.03, 0.08, dist)
      el.style.opacity = opacity
      el.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none'
    }
  }

  _smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)
  }

  _onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  destroy() {
    window.removeEventListener('resize', this._onResize)
    this.scrollEngine?.destroy()
    this.renderer.dispose()
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/MeadowEngine.js
git commit -m "feat: add MeadowEngine scaffold with scroll-driven camera"
```

---

### Task 6: Wire App.jsx

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/App.css`

**Reference:** Spec Section 8 (Content Overlay). Canvas is `position: fixed; inset: 0; z-index: 0`. The scroll container creates scroll space (500vh). Content overlay sits above the canvas.

- [ ] **Step 1: Add canvas mount to App.jsx**

Add to `App.jsx` — import MeadowEngine and mount it on a canvas ref. Keep MiniPlayer and MoonlightCursor untouched:

```jsx
import { useEffect, useRef } from 'react'
import MeadowEngine from './meadow/MeadowEngine.js'
import MiniPlayer from './MiniPlayer.jsx'
import MoonlightCursor from './MoonlightCursor.jsx'

function App() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    engineRef.current = new MeadowEngine(canvasRef.current)
    return () => engineRef.current?.destroy()
  }, [])

  return (
    <>
      {/* Scroll space — Lenis scrolls this */}
      <div style={{ height: '500vh' }} />

      {/* Three.js canvas — fixed behind everything */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Content overlay — added in Chunk 7 */}

      <MiniPlayer />
      <MoonlightCursor />
    </>
  )
}

export default App
```

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```

Expected: Full-viewport black canvas renders. Scrolling moves camera along spline (visible in console if you add a `console.log` to CameraRig). MiniPlayer and cursor still work.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire MeadowEngine canvas to App.jsx"
```

---

## Chunk 2: Environment

**Result:** Camera moves through a golden hour landscape with sky dome, terrain, fog, and cloud shadows. No grass yet — just the atmospheric foundation.

### Task 7: MeadowScene (Sky + Lights + Fog)

**Files:**
- Create: `src/meadow/MeadowScene.js`
- Modify: `src/meadow/MeadowEngine.js`

**Reference:** Spec Section 5 (Environment). Sky uses Three.js built-in `Sky` shader (Preetham model). Sun elevation 10-15°, turbidity 8-10. Fog color from spacejack/terra: `(0.74, 0.77, 0.91)`. Read `docs/webgl-reference/spacejack-terra--world.ts` for color constants.

- [ ] **Step 1: Create MeadowScene.js**

```js
// src/meadow/MeadowScene.js
import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

// Color constants from spacejack/terra world.ts
const FOG_COLOR = new THREE.Color(0.74, 0.77, 0.91)
const LIGHT_COLOR = new THREE.Color(1.0, 1.0, 0.99)

export function setupScene(scene) {
  // Fog (3-zone handled by shaders, this is base fog)
  scene.fog = new THREE.FogExp2(FOG_COLOR, 0.008)
  scene.background = FOG_COLOR

  // Sky dome (Preetham atmospheric model)
  const sky = new Sky()
  sky.scale.setScalar(10000)
  scene.add(sky)

  const sunPosition = new THREE.Vector3()
  const phi = THREE.MathUtils.degToRad(90 - 12) // 12° elevation = golden hour
  const theta = THREE.MathUtils.degToRad(180)
  sunPosition.setFromSphericalCoords(1, phi, theta)

  const skyUniforms = sky.material.uniforms
  skyUniforms['turbidity'].value = 8
  skyUniforms['rayleigh'].value = 2.5
  skyUniforms['mieCoefficient'].value = 0.005
  skyUniforms['mieDirectionalG'].value = 0.8
  skyUniforms['sunPosition'].value.copy(sunPosition)

  // Directional light (golden hour angle)
  const sunLight = new THREE.DirectionalLight(LIGHT_COLOR, 1.5)
  sunLight.position.copy(sunPosition).multiplyScalar(100)
  scene.add(sunLight)

  // Ambient light (subtle fill)
  const ambient = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambient)

  return { sky, sunLight, sunPosition }
}
```

- [ ] **Step 2: Wire into MeadowEngine.js**

Add to `MeadowEngine.js` constructor, after CameraRig setup:

```js
import { setupScene } from './MeadowScene.js'

// In constructor, after this.cameraRig = ...
this.sceneSetup = setupScene(this.scene)
```

- [ ] **Step 3: Verify**

```bash
npm run dev
```

Expected: Sky dome visible with golden hour gradient. Scrolling moves camera through fog-tinted atmosphere.

- [ ] **Step 4: Commit**

```bash
git add src/meadow/MeadowScene.js src/meadow/MeadowEngine.js
git commit -m "feat: add sky dome, directional light, fog"
```

---

### Task 8: TerrainPlane

**Files:**
- Create: `src/meadow/TerrainPlane.js`
- Modify: `src/meadow/MeadowEngine.js`

**Reference:** Spec Section 5 (Terrain). Read `docs/webgl-reference/spacejack-terra--terrain.ts` for heightfield pattern. We use a simpler approach: a large PlaneGeometry with vertex displacement via simplex noise. Terrain color matches grass base color `(0.45, 0.46, 0.19)`.

- [ ] **Step 1: Create TerrainPlane.js**

```js
// src/meadow/TerrainPlane.js
import * as THREE from 'three'

// Grass base color from spacejack/terra
const TERRAIN_COLOR = new THREE.Color(0.45, 0.46, 0.19)

export function createTerrain(scene) {
  const geometry = new THREE.PlaneGeometry(400, 400, 128, 128)
  geometry.rotateX(-Math.PI / 2)

  // Gentle rolling hills via vertex displacement
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    // Low-frequency rolling hills
    const y = Math.sin(x * 0.02) * Math.cos(z * 0.015) * 2.0
      + Math.sin(x * 0.05 + z * 0.03) * 0.5
    pos.setY(i, y)
  }
  geometry.computeVertexNormals()

  const material = new THREE.MeshLambertMaterial({
    color: TERRAIN_COLOR,
    side: THREE.FrontSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  scene.add(mesh)

  return mesh
}

// Returns terrain height at world position (for placing objects)
export function getTerrainHeight(x, z) {
  return Math.sin(x * 0.02) * Math.cos(z * 0.015) * 2.0
    + Math.sin(x * 0.05 + z * 0.03) * 0.5
}
```

- [ ] **Step 2: Wire into MeadowEngine.js**

Add after `setupScene`:

```js
import { createTerrain } from './TerrainPlane.js'

// In constructor
this.terrain = createTerrain(this.scene)
```

- [ ] **Step 3: Verify**

Expected: Green terrain visible below camera with gentle hills. Sky dome behind.

- [ ] **Step 4: Commit**

```bash
git add src/meadow/TerrainPlane.js src/meadow/MeadowEngine.js
git commit -m "feat: add terrain plane with rolling hills"
```

---

### Task 9: CloudShadows

**Files:**
- Create: `src/meadow/CloudShadows.js`
- Create: `src/assets/textures/cloud.jpg` (download)
- Modify: `src/meadow/MeadowEngine.js`

**Reference:** Spec Section 5 (Cloud Shadows). Read `docs/webgl-reference/james-smyth--grass.frag.glsl` for the cloudUV scrolling technique. The cloud shadow is a large plane above the scene with a scrolling noise texture that modulates the grass fragment shader. For now, we use a projected shadow plane below the grass.

- [ ] **Step 1: Download cloud texture**

```bash
curl -L "https://al-ro.github.io/images/grass/perlinFbm.jpg" -o mks-site/src/assets/textures/cloud.jpg
```

- [ ] **Step 2: Create CloudShadows.js**

```js
// src/meadow/CloudShadows.js
import * as THREE from 'three'

export default class CloudShadows {
  constructor(scene) {
    const loader = new THREE.TextureLoader()
    this.texture = loader.load('/src/assets/textures/cloud.jpg')
    this.texture.wrapS = THREE.RepeatWrapping
    this.texture.wrapT = THREE.RepeatWrapping

    // Large plane just above terrain, alpha-blended
    const geometry = new THREE.PlaneGeometry(400, 400)
    geometry.rotateX(-Math.PI / 2)

    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      opacity: 0.15,
      blending: THREE.MultiplyBlending,
      depthWrite: false,
    })

    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.position.y = 3.0 // just above grass tips
    this.mesh.renderOrder = -1
    scene.add(this.mesh)
  }

  update(elapsed) {
    // Glacial cloud drift (from James-Smyth: iTime / 20000)
    this.texture.offset.x = elapsed * 0.00005
    this.texture.offset.y = elapsed * 0.0001
  }
}
```

- [ ] **Step 3: Wire into MeadowEngine.js**

Add after terrain:

```js
import CloudShadows from './CloudShadows.js'

// In constructor
this.cloudShadows = new CloudShadows(this.scene)

// In _tick(), before render
this.cloudShadows.update(elapsed)
```

- [ ] **Step 4: Verify**

Expected: Subtle dark patches drift slowly across the terrain. Very slow movement (floaty contemplativeness).

- [ ] **Step 5: Commit**

```bash
git add src/meadow/CloudShadows.js src/assets/textures/cloud.jpg src/meadow/MeadowEngine.js
git commit -m "feat: add cloud shadow plane with glacial drift"
```

---

## Chunk 3: Grass Shaders

**Result:** GLSL shaders for the grass system, adapted from reference repos. These are the creative core — combining the best techniques from Nitash-Biswas (4-layer wind), al-ro (translucent lighting, ACES, iquilez fog), James-Smyth (cloud shadows), and spacejack/terra (color palette).

### Task 10: Grass Vertex Shader

**Files:**
- Create: `src/meadow/shaders/grass.vert.glsl`

**Reference:** Read `docs/webgl-reference/nitash-biswas--grass-vertex.glsl` FIRST — this is the primary source. The `deform()` function and all utility functions come directly from it. Additions: `uChunkFade` uniform (chunk pop-in prevention), `vCloudUV` varying (for cloud shadow sampling in fragment).

- [ ] **Step 1: Create grass.vert.glsl**

```glsl
// src/meadow/shaders/grass.vert.glsl
// Adapted from Nitash-Biswas/grass-shader-glsl
// Additions: uChunkFade (pop-in), vCloudUV (cloud shadows)

uniform float uTime;
uniform float uSpeed;
uniform float uHalfWidth;
uniform float uChunkFade;  // 0→1 for chunk fade-in

varying float vElevation;
varying float vSideGradient;
varying vec3 vNormal;
varying vec3 vFakeNormal;
varying vec3 vPosition;
varying vec2 vCloudUV;

// --- Utilities from Nitash-Biswas (unchanged) ---

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

mat3 rotationY(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

float bezier(float t, float p1) {
  float invT = 1.0 - t;
  return invT * invT * 0.0 + 2.0 * invT * t * p1 + t * t * 1.0;
}

vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0);
  vec4 ix = Pi.xzxz; vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz; vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x); vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z); vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

// --- 4-layer wind deformation (from Nitash-Biswas) ---

vec3 deform(vec3 pos) {
  vec3 localPosition = pos;
  vec3 instanceZ = normalize(vec3(0.0, 0.0, instanceMatrix[0].z));
  float hash = rand(vec2(instanceMatrix[3].x, instanceMatrix[3].z));

  // Layer 1: Static bezier bend (per-instance)
  float bendStrength = mix(0.3, 0.6, hash);
  float bendStart = mix(0.0, 0.3, hash);
  float t = clamp((pos.y / 2.0 - bendStart) / (1.0 - bendStart), 0.0, 1.0);
  float topBendFactor = bezier(t, 0.1);

  // Layer 2: Gentle sin sway
  float gentleSway = sin(uTime * uSpeed * 0.8 + hash * 10.0) * 0.1;
  vec3 gentleOffset = normalize(vec3(1.0, 0.0, 1.0)) * gentleSway * t;

  // Layer 3: Strong Perlin noise wind gusts
  vec3 worldPos = (instanceMatrix * vec4(pos, 1.0)).xyz;
  float wave = cnoise(worldPos.xz * 0.3 + vec2(uTime * uSpeed * 0.2, 0.0));
  float strongWind = wave * 0.65;
  vec3 strongOffset = normalize(vec3(0.0, 0.0, 1.0)) * strongWind * pow(pos.y, 2.0);

  localPosition += instanceZ * bendStrength * topBendFactor;
  localPosition += gentleOffset;
  localPosition += strongOffset;
  localPosition.y -= 0.1 * strongOffset.z;

  // Layer 4: Billboard to camera
  vec3 camPos = inverse(viewMatrix)[3].xyz;
  vec3 bladeWorldPos = instanceMatrix[3].xyz;
  vec2 toCamera2D = normalize(camPos.xz - bladeWorldPos.xz);
  float angleToCamera = atan(toCamera2D.y, toCamera2D.x);
  mat3 billboardRot = rotationY(angleToCamera);
  localPosition = billboardRot * localPosition;

  return localPosition;
}

// --- Main ---

void main() {
  vec3 p = deform(position);

  // Chunk fade-in: scale blade height from 0→1
  p.y *= uChunkFade;

  // Post-deformation normals (Nitash-Biswas: deform called 3x)
  vec3 offsetX = deform(position + vec3(0.01, 0.0, 0.0));
  vec3 offsetY = deform(position + vec3(0.0, 0.01, 0.0));
  offsetX.y *= uChunkFade;
  offsetY.y *= uChunkFade;

  vec4 worldPosition = instanceMatrix * vec4(p, 1.0);
  vec4 viewPosition = viewMatrix * worldPosition;
  gl_Position = projectionMatrix * viewPosition;

  vElevation = position.y;
  vPosition = worldPosition.xyz;
  vSideGradient = 1.0 - ((position.x + uHalfWidth) / (2.0 * uHalfWidth));

  // Post-deformation normal
  vec3 normalWS = normalize(cross(offsetX - p, offsetY - p));
  vNormal = normalWS;

  // Fake curved normal (Nitash-Biswas trick)
  vec3 invNormal = vNormal;
  invNormal.x *= -1.0;
  vFakeNormal = mix(vNormal, invNormal, vSideGradient);

  // Cloud shadow UV (from James-Smyth: world-space UV with glacial drift)
  vCloudUV = worldPosition.xz * 0.01;
  vCloudUV.x += uTime * 0.00005;
  vCloudUV.y += uTime * 0.0001;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/shaders/grass.vert.glsl
git commit -m "feat: add grass vertex shader (4-layer wind from Nitash-Biswas)"
```

---

### Task 11: Grass Fragment Shader

**Files:**
- Create: `src/meadow/shaders/grass.frag.glsl`

**Reference:** Read ALL of these before writing:
- `docs/webgl-reference/nitash-biswas--grass-fragment.glsl` — base color gradient, directional light
- `docs/webgl-reference/al-ro--grass.js` (lines 444-548) — translucent lighting, ACES, iquilez fog, sky light, root shadow
- `docs/webgl-reference/james-smyth--grass.frag.glsl` — cloud shadow texture mixing
- `docs/webgl-reference/spacejack-terra--world.ts` — FOG_COLOR, GRASS_COLOR constants

This fragment shader combines the best lighting from al-ro (Eddie Lee translucent lighting, ACES tonemapping, iquilez fog) with the base structure from Nitash-Biswas and cloud shadows from James-Smyth.

- [ ] **Step 1: Create grass.frag.glsl**

```glsl
// src/meadow/shaders/grass.frag.glsl
// Combines: Nitash-Biswas (gradient), al-ro (lighting, fog, ACES),
// James-Smyth (cloud shadows), spacejack/terra (color palette)

uniform vec3 uBaseColor;    // (0.45, 0.46, 0.19) — spacejack GRASS_COLOR
uniform vec3 uTipColor;     // (0.77, 0.76, 0.59) — warm BotW tip
uniform vec3 uSunDirection; // normalized
uniform vec3 uSunColor;     // (1.0, 1.0, 0.99)
uniform float uAmbientStrength;       // 0.7
uniform float uTranslucencyStrength;  // 1.5
uniform float uFogFade;               // 0.005
uniform sampler2D uCloudTexture;

varying float vElevation;
varying float vSideGradient;
varying vec3 vNormal;
varying vec3 vFakeNormal;
varying vec3 vPosition;
varying vec2 vCloudUV;

// ACES Film tonemapping (from al-ro)
vec3 ACESFilm(vec3 x) {
  float a = 2.51; float b = 0.03;
  float c = 2.43; float d = 0.59; float e = 0.14;
  return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
}

// iquilez height-dependent fog (from al-ro)
vec3 applyFog(vec3 rgb, vec3 rayDir, vec3 sunDir) {
  float dist = length(vPosition - cameraPosition);
  float rd = rayDir.y;
  if (abs(rd) < 0.0001) rd = 0.0001;
  float fogAmount = exp(-cameraPosition.y * uFogFade)
    * (1.0 - exp(-dist * rd * uFogFade)) / rd;
  float sunAmount = max(dot(rayDir, sunDir), 0.0);
  // Near-sun haze warm, far-sun haze cool (from al-ro)
  vec3 fogColor = mix(vec3(0.35, 0.5, 0.9), vec3(1.0, 1.0, 0.75), pow(sunAmount, 16.0));
  return mix(rgb, fogColor, clamp(fogAmount, 0.0, 1.0));
}

void main() {
  // Base-to-tip color gradient (Nitash-Biswas)
  float gradient = smoothstep(0.2, 1.0, vElevation);
  vec3 baseColor = mix(uBaseColor, uTipColor, gradient);

  // Normal handling (Nitash-Biswas fake curved normals)
  vec3 normal = gl_FrontFacing ? vFakeNormal : -vFakeNormal;
  vec3 viewDir = normalize(cameraPosition - vPosition);
  vec3 lightDir = normalize(uSunDirection);

  // Directional light
  float dotNL = dot(normal, lightDir);
  float diff = max(dotNL, 0.0);
  vec3 diffuse = diff * uSunColor * baseColor;

  // Ambient
  vec3 ambient = uAmbientStrength * baseColor;

  // Sky light (from al-ro)
  float sky = max(dot(normal, vec3(0.0, 1.0, 0.0)), 0.0);
  vec3 skyLight = sky * vec3(0.12, 0.29, 0.55);

  // Translucent lighting (from al-ro — Eddie Lee 2010 technique)
  vec3 diffuseTranslucency = vec3(0.0);
  vec3 forwardTranslucency = vec3(0.0);
  float dotVL = dot(-lightDir, viewDir);
  if (dotNL <= 0.0) {
    diffuseTranslucency = uSunColor * baseColor * uTranslucencyStrength * -dotNL;
    if (dotVL > 0.0) {
      forwardTranslucency = uSunColor * baseColor * uTranslucencyStrength * pow(dotVL, 16.0);
    }
  }

  // Cloud shadows (James-Smyth UV scrolling)
  vec3 cloudSample = texture2D(uCloudTexture, vCloudUV).rgb;
  float shadowFactor = mix(0.7, 1.0, cloudSample.r);

  // Combine all lighting
  vec3 col = (0.3 * skyLight * baseColor + ambient + diffuse
    + diffuseTranslucency + forwardTranslucency) * shadowFactor;

  // Root shadow (from al-ro: darken towards base)
  col = mix(0.35 * uBaseColor, col, smoothstep(0.0, 0.3, vElevation));

  // Fog (iquilez height-dependent, from al-ro)
  vec3 rayDir = normalize(vPosition - cameraPosition);
  col = applyFog(col, rayDir, lightDir);

  // ACES tonemapping (from al-ro)
  col = ACESFilm(col);

  // Gamma correction
  col = pow(col, vec3(0.4545));

  gl_FragColor = vec4(col, 1.0);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/shaders/grass.frag.glsl
git commit -m "feat: add grass fragment shader (al-ro lighting + iquilez fog + ACES)"
```

---

## Chunk 4: Grass Manager

**Result:** Dense grass field with 100K+ instanced blades, 4-layer wind animation, LOD, spatial chunking. The hero visual.

### Task 12: GrassGeometry

**Files:**
- Create: `src/meadow/GrassGeometry.js`

**Reference:** Read `docs/webgl-reference/nitash-biswas--grass-setup.jsx` for the `createGrassGeometry()` function. Also read `docs/webgl-reference/al-ro--grass.js` (lines 550-610) for quaternion-based blade bending. We use Nitash-Biswas's tapered triangle strip approach (simpler, works with InstancedMesh).

- [ ] **Step 1: Create GrassGeometry.js**

```js
// src/meadow/GrassGeometry.js
// Blade geometry generator — adapted from Nitash-Biswas/grass-shader-glsl
import * as THREE from 'three'

const HALF_WIDTH = 0.06
const HEIGHT = 1.0
const TAPER = 0.005

/**
 * Creates a tapered triangle strip blade geometry.
 * @param {number} segments - Number of height segments (7 = high detail, 1 = low)
 * @returns {THREE.BufferGeometry}
 */
export function createBladeGeometry(segments) {
  const positions = []

  for (let i = 0; i < segments; i++) {
    const y0 = (i / segments) * HEIGHT
    const y1 = ((i + 1) / segments) * HEIGHT
    const w0 = HALF_WIDTH - TAPER * i
    const w1 = HALF_WIDTH - TAPER * (i + 1)

    if (i < segments - 1) {
      // Quad as two triangles
      positions.push(
        -w0, y0, 0,  w0, y0, 0,  -w1, y1, 0,
        -w1, y1, 0,  w0, y0, 0,   w1, y1, 0
      )
    } else {
      // Tip triangle
      positions.push(-w0, y0, 0, w0, y0, 0, 0, y1, 0)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position',
    new THREE.BufferAttribute(new Float32Array(positions), 3))
  geometry.computeVertexNormals()
  return geometry
}

/**
 * Generates instance matrices for a chunk of grass.
 * @param {number} count - Number of blades
 * @param {number} chunkSize - World units per chunk side
 * @param {number} offsetX - Chunk world X offset
 * @param {number} offsetZ - Chunk world Z offset
 * @param {Function} getHeight - Function(x, z) → terrain height
 * @returns {Float32Array} Instance matrices (count × 16)
 */
export function generateInstanceMatrices(count, chunkSize, offsetX, offsetZ, getHeight) {
  const dummy = new THREE.Object3D()
  const matrices = new Float32Array(count * 16)

  for (let i = 0; i < count; i++) {
    const x = offsetX + (Math.random() - 0.5) * chunkSize
    const z = offsetZ + (Math.random() - 0.5) * chunkSize
    const y = getHeight(x, z)

    dummy.position.set(x, y, z)
    dummy.rotation.y = Math.random() * Math.PI * 2
    dummy.scale.setScalar(0.8 + Math.random() * 0.4) // height variety
    dummy.updateMatrix()
    dummy.matrix.toArray(matrices, i * 16)
  }

  return matrices
}
```

- [ ] **Step 2: Commit**

```bash
git add src/meadow/GrassGeometry.js
git commit -m "feat: add blade geometry generator with LOD support"
```

---

### Task 13: GrassChunkManager

**Files:**
- Create: `src/meadow/GrassChunkManager.js`
- Modify: `src/meadow/MeadowEngine.js`

**Reference:** Spec Section 4 (GrassChunkManager Strategy). Read `docs/webgl-reference/nitash-biswas--grass-setup.jsx` for the InstancedMesh + LOD pattern. The chunk manager pre-allocates 6 chunk slots, activates chunks near the camera, disposes chunks behind, and fades new chunks in via the `uChunkFade` uniform.

- [ ] **Step 1: Create GrassChunkManager.js**

```js
// src/meadow/GrassChunkManager.js
import * as THREE from 'three'
import { createBladeGeometry, generateInstanceMatrices } from './GrassGeometry.js'
import { getTerrainHeight } from './TerrainPlane.js'
import grassVertexShader from './shaders/grass.vert.glsl?raw'
import grassFragmentShader from './shaders/grass.frag.glsl?raw'

const CHUNK_SIZE = 20        // world units per chunk side
const BLADES_PER_CHUNK = 20000
const ACTIVATE_DIST = CHUNK_SIZE * 3
const DISPOSE_DIST = CHUNK_SIZE * 1.5
const FADE_DURATION = 0.5    // seconds

// Colors from spacejack/terra
const BASE_COLOR = new THREE.Color(0.45, 0.46, 0.19)
const TIP_COLOR = new THREE.Color(0.77, 0.76, 0.59)
const SUN_COLOR = new THREE.Color(1.0, 1.0, 0.99)
const SUN_DIR = new THREE.Vector3(0.0, 0.21, -1.0).normalize() // ~12° elevation

export default class GrassChunkManager {
  constructor(scene, config, cloudTexture) {
    this.scene = scene
    this.maxChunks = config.grassChunks
    this.bladesPerChunk = Math.floor(config.grassCount / this.maxChunks)

    // Shared geometries (LOD)
    this.highGeo = createBladeGeometry(7)
    this.lowGeo = createBladeGeometry(1)

    // Shared material
    this.material = new THREE.ShaderMaterial({
      vertexShader: grassVertexShader,
      fragmentShader: grassFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 1.5 },
        uHalfWidth: { value: 0.06 },
        uChunkFade: { value: 1.0 },
        uBaseColor: { value: BASE_COLOR },
        uTipColor: { value: TIP_COLOR },
        uSunDirection: { value: SUN_DIR },
        uSunColor: { value: SUN_COLOR },
        uAmbientStrength: { value: 0.7 },
        uTranslucencyStrength: { value: 1.5 },
        uFogFade: { value: 0.005 },
        uCloudTexture: { value: cloudTexture },
      },
      side: THREE.DoubleSide,
    })

    // Chunk pool
    this.chunks = new Map() // key: chunkIndex → { mesh, fadeStart, material }
    this.LOD_THRESHOLD = 15
  }

  update(cameraPos, elapsed, splineT) {
    // Update time uniform
    this.material.uniforms.uTime.value = elapsed

    // Determine which chunk indices should be active
    const camChunkZ = Math.floor(-cameraPos.z / CHUNK_SIZE)
    const activeRange = new Set()
    for (let i = camChunkZ - 1; i <= camChunkZ + 3; i++) {
      activeRange.add(i)
    }

    // Activate new chunks
    for (const idx of activeRange) {
      if (!this.chunks.has(idx) && this.chunks.size < this.maxChunks + 2) {
        this._createChunk(idx, elapsed)
      }
    }

    // Dispose old chunks
    for (const [idx, chunk] of this.chunks) {
      if (!activeRange.has(idx)) {
        this._disposeChunk(idx)
      }
    }

    // Update fade-in for new chunks
    for (const [idx, chunk] of this.chunks) {
      const age = elapsed - chunk.fadeStart
      const fade = Math.min(1.0, age / FADE_DURATION)
      chunk.material.uniforms.uChunkFade.value = fade
    }
  }

  _createChunk(idx, elapsed) {
    const offsetZ = -idx * CHUNK_SIZE
    const offsetX = 0

    // Generate instance matrices
    const matrices = generateInstanceMatrices(
      this.bladesPerChunk, CHUNK_SIZE, offsetX, offsetZ, getTerrainHeight
    )

    // Clone material for per-chunk uChunkFade
    const mat = this.material.clone()
    mat.uniforms.uChunkFade = { value: 0.0 }

    // Create InstancedMesh (high detail for now, LOD later)
    const mesh = new THREE.InstancedMesh(this.highGeo, mat, this.bladesPerChunk)
    mesh.instanceMatrix = new THREE.InstancedBufferAttribute(matrices, 16)
    mesh.frustumCulled = true

    this.scene.add(mesh)
    this.chunks.set(idx, { mesh, material: mat, fadeStart: elapsed })
  }

  _disposeChunk(idx) {
    const chunk = this.chunks.get(idx)
    if (!chunk) return
    this.scene.remove(chunk.mesh)
    chunk.mesh.dispose()
    chunk.material.dispose()
    this.chunks.delete(idx)
  }

  dispose() {
    for (const [idx] of this.chunks) {
      this._disposeChunk(idx)
    }
    this.highGeo.dispose()
    this.lowGeo.dispose()
    this.material.dispose()
  }
}
```

- [ ] **Step 2: Wire into MeadowEngine.js**

Add to constructor (after cloud shadows):

```js
import GrassChunkManager from './GrassChunkManager.js'

// In constructor
const cloudTexture = this.cloudShadows?.texture || null
this.grassManager = new GrassChunkManager(this.scene, this.config, cloudTexture)
```

Add to `_tick()`:

```js
// In _tick(), before render
const camPos = this.cameraRig.getPosition()
this.grassManager.update(camPos, elapsed, this.cameraRig.getCurrentT())
```

- [ ] **Step 3: Verify**

```bash
npm run dev
```

Expected: Dense grass field fills the scene. Blades sway with 4-layer wind. New chunks fade in as camera scrolls forward. Chunks behind camera are disposed.

- [ ] **Step 4: Commit**

```bash
git add src/meadow/GrassChunkManager.js src/meadow/GrassGeometry.js src/meadow/MeadowEngine.js
git commit -m "feat: add grass chunk manager with instanced wind shaders"
```

---

## Chunk 5: Flora & Particles

**Result:** Stylized flowers scattered through the grass + warm amber firefly particles. Full meadow environment complete.

### Task 14: Firefly Shaders + System

**Files:**
- Create: `src/meadow/shaders/firefly.vert.glsl`
- Create: `src/meadow/shaders/firefly.frag.glsl`
- Create: `src/meadow/FireflySystem.js`
- Modify: `src/meadow/MeadowEngine.js`

**Reference:** Read `docs/webgl-reference/alex-dg--fireflies-material.js`, `alex-dg--fireflies-vertex.glsl`, `alex-dg--fireflies-fragment.glsl`. Steal the FirefliesMaterial class directly. Adapt: white → warm amber color, count 250→500, height constrained to low in grass.

- [ ] **Step 1: Create firefly.vert.glsl**

```glsl
// src/meadow/shaders/firefly.vert.glsl
// Stolen from Alex-DG/vite-three-webxr-flowers (unchanged except comment)
uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

void main() {
  float time = uTime * 0.001;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.y += sin(time + modelPosition.x * 100.0) * aScale * 0.2;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;
  gl_PointSize = uSize * aScale * uPixelRatio;
  gl_PointSize *= (1.0 / -viewPosition.z);
}
```

- [ ] **Step 2: Create firefly.frag.glsl**

```glsl
// src/meadow/shaders/firefly.frag.glsl
// Adapted from Alex-DG — changed white to warm amber
void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float strength = 0.05 / distanceToCenter - 0.1;
  // Warm amber instead of white (BotW golden hour)
  gl_FragColor = vec4(1.0, 0.85, 0.4, strength);
}
```

- [ ] **Step 3: Create FireflySystem.js**

```js
// src/meadow/FireflySystem.js
// Adapted from Alex-DG/vite-three-webxr-flowers FirefliesMaterial
import * as THREE from 'three'
import vertexShader from './shaders/firefly.vert.glsl?raw'
import fragmentShader from './shaders/firefly.frag.glsl?raw'

export default class FireflySystem {
  constructor(scene, count = 500) {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 80 },
      },
      vertexShader,
      fragmentShader,
    })

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Spread across the meadow, constrained low in grass
      positions[i * 3 + 0] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = Math.random() * 1.2 + 0.3  // 0.3→1.5 height
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200
      scales[i] = Math.random()
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

    this.points = new THREE.Points(geometry, this.material)
    scene.add(this.points)
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed * 1000 // ms for Alex-DG shader
  }

  dispose() {
    this.points.geometry.dispose()
    this.material.dispose()
  }
}
```

- [ ] **Step 4: Wire into MeadowEngine.js**

```js
import FireflySystem from './FireflySystem.js'

// In constructor, after grassManager
this.fireflies = new FireflySystem(this.scene, 500)

// In _tick()
this.fireflies.update(elapsed)
```

- [ ] **Step 5: Verify**

Expected: Warm amber glowing points float gently through the grass, bobbing up and down.

- [ ] **Step 6: Commit**

```bash
git add src/meadow/shaders/firefly.vert.glsl src/meadow/shaders/firefly.frag.glsl src/meadow/FireflySystem.js src/meadow/MeadowEngine.js
git commit -m "feat: add firefly particle system (from Alex-DG)"
```

---

### Task 15: Flower Shaders

**Files:**
- Create: `src/meadow/shaders/flower.vert.glsl`
- Create: `src/meadow/shaders/flower.frag.glsl`

**Reference:** Read `docs/webgl-reference/toon-shader-threejs.glsl` for the step-function toon lighting. The vertex shader is a simplified version of the grass wind (gentle sway only, no billboard). The fragment shader uses 2-3 tone bands with rim lighting (BotW cel-shading pattern from daniel-ilett).

- [ ] **Step 1: Create flower.vert.glsl**

```glsl
// src/meadow/shaders/flower.vert.glsl
// Simplified wind from grass system (gentle sway only)
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 pos = position;

  // Gentle sway (only top vertices move, based on height)
  float sway = sin(uTime * 0.8 + position.x * 5.0) * 0.05 * pos.y;
  pos.x += sway;
  pos.z += sway * 0.5;

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vPosition = worldPosition.xyz;
  vNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
```

- [ ] **Step 2: Create flower.frag.glsl**

```glsl
// src/meadow/shaders/flower.frag.glsl
// Toon shading — adapted from daniel-ilett/maya-ndljk toon shader
// Step function lighting with 2-3 tone bands + rim light
uniform vec3 uColor;
uniform vec3 uSunDirection;
uniform vec3 uSunColor;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uSunDirection);
  vec3 viewDir = normalize(cameraPosition - vPosition);

  // Toon diffuse: 3-band step function
  float NdotL = dot(normal, lightDir);
  float toon;
  if (NdotL > 0.6) {
    toon = 1.0;
  } else if (NdotL > 0.2) {
    toon = 0.7;
  } else {
    toon = 0.4;
  }

  vec3 diffuse = uColor * uSunColor * toon;

  // Rim light (BotW edge glow)
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  rim = smoothstep(0.6, 1.0, rim);
  vec3 rimColor = uSunColor * rim * 0.3;

  vec3 col = diffuse + rimColor;

  // Gamma correction
  col = pow(col, vec3(0.4545));

  gl_FragColor = vec4(col, 1.0);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/meadow/shaders/flower.vert.glsl src/meadow/shaders/flower.frag.glsl
git commit -m "feat: add flower toon shaders (from daniel-ilett/maya-ndljk)"
```

---

### Task 16: FlowerInstances

**Files:**
- Create: `src/meadow/FlowerInstances.js`
- Modify: `src/meadow/MeadowEngine.js`

**Reference:** Read `docs/webgl-reference/alex-dg--experience.js` for the GLTF loading pattern. Flowers are placed randomly across the meadow, avoiding content clearings. For the initial implementation, we use procedural cone+sphere geometry instead of GLTF models (faster to get working, models can be added later).

- [ ] **Step 1: Create FlowerInstances.js**

```js
// src/meadow/FlowerInstances.js
import * as THREE from 'three'
import { getTerrainHeight } from './TerrainPlane.js'
import flowerVertexShader from './shaders/flower.vert.glsl?raw'
import flowerFragmentShader from './shaders/flower.frag.glsl?raw'

// Content section t-values where clearings should be
const CLEARING_T_VALUES = [0.075, 0.275, 0.475, 0.725, 0.925]
const CLEARING_RADIUS = 8 // world units around clearing center

// BotW-inspired flower colors (6 types)
const FLOWER_COLORS = [
  new THREE.Color(0.95, 0.9, 0.8),   // daisy (cream)
  new THREE.Color(0.85, 0.2, 0.15),  // poppy (red-orange)
  new THREE.Color(0.95, 0.75, 0.1),  // marigold (golden)
  new THREE.Color(0.3, 0.4, 0.8),    // cornflower (blue)
  new THREE.Color(0.95, 0.85, 0.2),  // buttercup (yellow)
  new THREE.Color(0.55, 0.65, 0.3),  // wildgrass (sage)
]

const SUN_DIR = new THREE.Vector3(0.0, 0.21, -1.0).normalize()
const SUN_COLOR = new THREE.Color(1.0, 1.0, 0.99)

export default class FlowerInstances {
  constructor(scene, cameraRig, count = 800) {
    this.meshes = []

    // Simple procedural flower geometry (cone stem + sphere head)
    const stemGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.4, 4)
    stemGeo.translate(0, 0.2, 0)
    const headGeo = new THREE.SphereGeometry(0.08, 6, 4)
    headGeo.translate(0, 0.42, 0)

    // Merge into single geometry
    const flowerGeo = new THREE.BufferGeometry()
    const merged = THREE.BufferGeometryUtils
      ? THREE.BufferGeometryUtils.mergeGeometries([stemGeo, headGeo])
      : this._mergeGeos(stemGeo, headGeo)

    const flowersPerType = Math.floor(count / FLOWER_COLORS.length)

    for (let t = 0; t < FLOWER_COLORS.length; t++) {
      const material = new THREE.ShaderMaterial({
        vertexShader: flowerVertexShader,
        fragmentShader: flowerFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: FLOWER_COLORS[t] },
          uSunDirection: { value: SUN_DIR },
          uSunColor: { value: SUN_COLOR },
        },
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.InstancedMesh(merged || stemGeo, material, flowersPerType)

      const dummy = new THREE.Object3D()
      let placed = 0

      for (let i = 0; i < flowersPerType * 3 && placed < flowersPerType; i++) {
        const x = (Math.random() - 0.5) * 180
        const z = (Math.random() - 0.5) * 180

        // Skip clearings
        if (this._inClearing(x, z, cameraRig)) continue

        const y = getTerrainHeight(x, z)
        dummy.position.set(x, y, z)
        dummy.rotation.y = Math.random() * Math.PI * 2
        dummy.scale.setScalar(0.6 + Math.random() * 0.8)
        dummy.updateMatrix()
        mesh.setMatrixAt(placed, dummy.matrix)
        placed++
      }

      mesh.count = placed
      mesh.instanceMatrix.needsUpdate = true
      scene.add(mesh)
      this.meshes.push({ mesh, material })
    }
  }

  _inClearing(x, z, cameraRig) {
    for (const t of CLEARING_T_VALUES) {
      const clearingPos = cameraRig.curve.getPoint(t)
      const dx = x - clearingPos.x
      const dz = z - clearingPos.z
      if (dx * dx + dz * dz < CLEARING_RADIUS * CLEARING_RADIUS) return true
    }
    return false
  }

  _mergeGeos(a, b) {
    // Fallback merge if BufferGeometryUtils not available
    // For now, just use the stem
    return a
  }

  update(elapsed) {
    for (const { material } of this.meshes) {
      material.uniforms.uTime.value = elapsed
    }
  }

  dispose() {
    for (const { mesh, material } of this.meshes) {
      mesh.geometry.dispose()
      material.dispose()
    }
  }
}
```

- [ ] **Step 2: Wire into MeadowEngine.js**

```js
import FlowerInstances from './FlowerInstances.js'

// In constructor, after fireflies
this.flowers = new FlowerInstances(this.scene, this.cameraRig, 800)

// In _tick()
this.flowers.update(elapsed)
```

- [ ] **Step 3: Verify**

Expected: Colorful stylized flowers scattered through the grass. Toon-shaded with rim lighting. Gently sway in wind. Absent from content clearing areas.

- [ ] **Step 4: Commit**

```bash
git add src/meadow/FlowerInstances.js src/meadow/MeadowEngine.js
git commit -m "feat: add instanced flowers with toon shading"
```

---

## Chunk 6: Post-Processing

**Result:** Full cinematic post-processing pipeline — bloom, fog, god rays, grain, vignette, color grading, DOF, chromatic aberration. The scene transforms from "3D demo" to "cinematic experience."

### Task 17: PostProcessingStack

**Files:**
- Create: `src/meadow/PostProcessingStack.js`
- Modify: `src/meadow/MeadowEngine.js`

**Reference:** Spec Section 6 (Post-Processing Stack). Uses `pmndrs/postprocessing` for most effects + `three-good-godrays` for volumetric light. All effects merged into a single `EffectPass` for performance. Scroll-reactive: CA increases with scroll velocity, DOF tracks content distance, bloom intensifies near clearings.

- [ ] **Step 1: Create PostProcessingStack.js**

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
import { GodRaysEffect } from 'three-good-godrays'
import * as THREE from 'three'

export default class PostProcessingStack {
  constructor(renderer, scene, camera, sunPosition, tier) {
    this.composer = new EffectComposer(renderer)
    this.composer.addPass(new RenderPass(scene, camera))

    if (tier === 'css') return // No post-fx for tier 3

    const isReduced = tier === 'reduced'

    // Bloom — subtle, warm (flower petals + fireflies glow)
    this.bloom = new BloomEffect({
      intensity: isReduced ? 0.3 : 0.6,
      luminanceThreshold: 0.6,
      luminanceSmoothing: 0.3,
      kernelSize: isReduced ? KernelSize.SMALL : KernelSize.MEDIUM,
    })

    // Chromatic Aberration — very subtle, increases with scroll velocity
    this.ca = new ChromaticAberrationEffect({
      offset: new THREE.Vector2(0.001, 0.001),
    })

    // Vignette
    this.vignette = new VignetteEffect({
      darkness: 0.5,
      offset: 0.3,
    })

    // Film Grain (GPU shader, not canvas — per Cinematic Imperfection principle)
    this.grain = new NoiseEffect({
      blendFunction: BlendFunction.OVERLAY,
      premultiply: true,
    })
    this.grain.blendMode.opacity.value = 0.03

    const effects = [this.bloom, this.ca, this.vignette, this.grain]

    // God Rays — only on Tier 1 (expensive)
    if (!isReduced) {
      // Create a small bright sphere as the god ray light source
      const sunSphere = new THREE.Mesh(
        new THREE.SphereGeometry(2, 8, 8),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(1.0, 0.8, 0.4),
          transparent: true,
          opacity: 0.0, // invisible but needed for godrays
        })
      )
      sunSphere.position.copy(sunPosition).multiplyScalar(50)
      scene.add(sunSphere)

      try {
        this.godRays = new GodRaysEffect(camera, sunSphere, {
          density: 0.96,
          decay: 0.93,
          weight: 0.4,
          samples: 60,
        })
        effects.push(this.godRays)
      } catch (e) {
        console.warn('God rays not available:', e)
      }
    }

    // Combine all effects into single pass
    this.effectPass = new EffectPass(camera, ...effects)
    this.composer.addPass(this.effectPass)
  }

  // Called each frame with scroll velocity for reactive params
  update(scrollVelocity) {
    if (!this.ca) return

    // CA increases during camera movement
    const caIntensity = Math.min(0.005, Math.abs(scrollVelocity) * 0.001)
    this.ca.offset.set(caIntensity, caIntensity)
  }

  render(deltaTime) {
    this.composer.render(deltaTime)
  }

  setSize(width, height) {
    this.composer.setSize(width, height)
  }

  dispose() {
    this.composer.dispose()
  }
}
```

- [ ] **Step 2: Wire into MeadowEngine.js**

Replace direct `renderer.render()` with the post-processing composer:

```js
import PostProcessingStack from './PostProcessingStack.js'

// In constructor, after all scene objects
this.postProcessing = new PostProcessingStack(
  this.renderer, this.scene, this.camera,
  this.sceneSetup.sunPosition, this.config.postFX
)

// In _tick(), replace this.renderer.render(this.scene, this.camera) with:
this.postProcessing.update(this.scrollEngine.velocity)
this.postProcessing.render(delta)

// In _onResize(), add:
this.postProcessing?.setSize(w, h)
```

- [ ] **Step 3: Verify**

Expected: Scene now has bloom on bright elements (fireflies, flowers), vignette darkening edges, subtle film grain, chromatic aberration on scroll. God rays visible when looking toward the sun. Massive visual upgrade.

- [ ] **Step 4: Commit**

```bash
git add src/meadow/PostProcessingStack.js src/meadow/MeadowEngine.js
git commit -m "feat: add post-processing pipeline (bloom, CA, grain, vignette, god rays)"
```

---

## Chunk 7: Content & Integration

**Result:** Complete working site — React DOM content sections overlay the meadow, fading in/out with camera proximity. Audio integration. Performance fallbacks. Cleanup of deprecated files.

### Task 18: Content Overlay

**Files:**
- Create: `src/content/ContentOverlay.jsx`
- Create: `src/content/LandingContent.jsx`
- Create: `src/content/MusicContent.jsx`
- Create: `src/content/AboutContent.jsx`
- Create: `src/content/StoreContent.jsx`
- Create: `src/content/FooterContent.jsx`
- Create: `src/content/content-overlay.css`

**Reference:** Spec Section 8 (Content Overlay). Content sections are positioned fixed, overlaid on the canvas. Opacity is driven by MeadowEngine directly (DOM manipulation, no React re-renders). Each section has a `data-section-t` attribute matching the spline t-value from Spec Section 3.

- [ ] **Step 1: Create content section components**

```jsx
// src/content/LandingContent.jsx
export default function LandingContent() {
  return (
    <div className="section-inner">
      <h1 className="section-title">Michael Kim Sheng</h1>
      <p className="section-subtitle">Composer</p>
    </div>
  )
}
```

```jsx
// src/content/MusicContent.jsx
export default function MusicContent() {
  return (
    <div className="section-inner glass-card">
      <h2 className="section-title">Music</h2>
      <p className="section-body">Works and compositions</p>
    </div>
  )
}
```

```jsx
// src/content/AboutContent.jsx
export default function AboutContent() {
  return (
    <div className="section-inner glass-card">
      <h2 className="section-title">About</h2>
      <p className="section-body">The story behind the music</p>
    </div>
  )
}
```

```jsx
// src/content/StoreContent.jsx
export default function StoreContent() {
  return (
    <div className="section-inner glass-card">
      <h2 className="section-title">Store</h2>
      <p className="section-body">Albums and merchandise</p>
    </div>
  )
}
```

```jsx
// src/content/FooterContent.jsx
export default function FooterContent() {
  return (
    <div className="section-inner">
      <p className="section-body">© Michael Kim Sheng</p>
    </div>
  )
}
```

- [ ] **Step 2: Create ContentOverlay.jsx**

```jsx
// src/content/ContentOverlay.jsx
import { useEffect, useRef } from 'react'
import LandingContent from './LandingContent.jsx'
import MusicContent from './MusicContent.jsx'
import AboutContent from './AboutContent.jsx'
import StoreContent from './StoreContent.jsx'
import FooterContent from './FooterContent.jsx'
import './content-overlay.css'

const SECTIONS = [
  { t: 0.075, Component: LandingContent },
  { t: 0.275, Component: MusicContent },
  { t: 0.475, Component: AboutContent },
  { t: 0.725, Component: StoreContent },
  { t: 0.925, Component: FooterContent },
]

export default function ContentOverlay({ onSectionsReady }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const sections = containerRef.current.querySelectorAll('.content-section')
    onSectionsReady?.(Array.from(sections))
  }, [onSectionsReady])

  return (
    <div ref={containerRef} className="content-overlay">
      {SECTIONS.map(({ t, Component }) => (
        <div
          key={t}
          className="content-section"
          data-section-t={t}
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <Component />
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create content-overlay.css**

```css
/* src/content/content-overlay.css */
.content-overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-section {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: none; /* opacity driven by JS, not CSS */
}

.section-inner {
  max-width: 600px;
  padding: 2rem;
  text-align: center;
}

.section-title {
  font-family: 'Birch Std', serif;
  color: #c8d4e8;
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-family: 'PT Serif', serif;
  color: #90a0a0;
  font-size: 1.2rem;
}

.section-body {
  font-family: 'PT Serif', serif;
  color: #90a0a0;
  font-size: 1rem;
  line-height: 1.6;
}

/* Glass card style (preserved from existing App.css) */
.glass-card {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(200, 212, 232, 0.08);
  border-radius: 12px;
  padding: 2.5rem;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/content/
git commit -m "feat: add content overlay with 5 sections"
```

---

### Task 19: Adapt useScrollAudio

**Files:**
- Modify: `src/useScrollAudio.js`

**Reference:** Spec Section 8. The hook now consumes a scroll progress float (0→1) from the ScrollEngine's shared `progress` property, read via `requestAnimationFrame`. Volume ramps from 0 at progress < 0.05 to full at progress > 0.15.

- [ ] **Step 1: Rewrite useScrollAudio.js**

```js
// src/useScrollAudio.js
// Adapted to consume Lenis scroll progress (0→1)
import { useEffect, useRef } from 'react'

export default function useScrollAudio(engineRef) {
  const rafRef = useRef(null)

  useEffect(() => {
    const tick = () => {
      const engine = engineRef.current
      const audio = document.querySelector('audio')
      if (!engine || !audio || audio.paused) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const progress = engine.scrollEngine?.progress ?? 0

      // Volume: silent below 0.05, ramp to full by 0.15
      if (progress <= 0.05) {
        audio.volume = 0
      } else if (progress >= 0.15) {
        audio.volume = 1
      } else {
        const t = (progress - 0.05) / 0.1
        audio.volume = t * t // quadratic ease-in
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(rafRef.current)
  }, [engineRef])
}
```

- [ ] **Step 2: Commit**

```bash
git add src/useScrollAudio.js
git commit -m "feat: adapt useScrollAudio for Lenis scroll progress"
```

---

### Task 20: Final App.jsx Integration

**Files:**
- Modify: `src/App.jsx`

**Reference:** Wire ContentOverlay into the app. Pass engine ref to useScrollAudio. Register content section DOM elements with the engine.

- [ ] **Step 1: Update App.jsx**

```jsx
// src/App.jsx
import { useEffect, useRef, useCallback } from 'react'
import MeadowEngine from './meadow/MeadowEngine.js'
import ContentOverlay from './content/ContentOverlay.jsx'
import MiniPlayer from './MiniPlayer.jsx'
import MoonlightCursor from './MoonlightCursor.jsx'
import useScrollAudio from './useScrollAudio.js'

function App() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    engineRef.current = new MeadowEngine(canvasRef.current)
    return () => {
      engineRef.current?.destroy()
      engineRef.current = null
    }
  }, [])

  // Audio integration
  useScrollAudio(engineRef)

  // Register content sections with engine for opacity updates
  const handleSectionsReady = useCallback((sections) => {
    engineRef.current?.setContentSections(sections)
  }, [])

  return (
    <>
      {/* Scroll space */}
      <div style={{ height: '500vh' }} />

      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      />

      {/* Content sections */}
      <ContentOverlay onSectionsReady={handleSectionsReady} />

      {/* Surviving components */}
      <MiniPlayer />
      <MoonlightCursor />
    </>
  )
}

export default App
```

- [ ] **Step 2: Verify**

```bash
npm run dev
```

Expected: Full site working. Canvas shows the meadow. Content sections fade in/out as you scroll through the field. MiniPlayer and cursor still work. Audio volume ramps with scroll.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: integrate content overlay and audio with meadow engine"
```

---

### Task 21: Performance Fallbacks

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/meadow/MeadowEngine.js`

**Reference:** Spec Section 10. Tier 3 (mobile) gets a static background + CSS content. `prefers-reduced-motion` stops all animation.

- [ ] **Step 1: Add Tier 3 fallback to App.jsx**

In App.jsx, check if engine initialized (tier 3 bails early):

```jsx
// After engine initialization useEffect, add:
const [isTier3, setIsTier3] = useState(false)

// In the engine init useEffect:
if (engineRef.current?.tier === 3) {
  setIsTier3(true)
}

// In JSX, conditionally render:
{isTier3 ? (
  <div className="static-meadow-fallback" />
) : (
  <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0 }} />
)}
```

- [ ] **Step 2: Add prefers-reduced-motion to MeadowEngine.js**

Add to constructor:

```js
// Check reduced motion preference
this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// In grass/firefly/flower update calls, skip if reducedMotion:
// Pass this.reducedMotion ? 0 : elapsed to shader time uniforms
```

In `_tick()`, modify elapsed time:

```js
const animElapsed = this.reducedMotion ? 0 : elapsed
this.grassManager?.update(camPos, animElapsed, this.cameraRig.getCurrentT())
this.fireflies?.update(animElapsed)
this.flowers?.update(animElapsed)
```

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx src/meadow/MeadowEngine.js
git commit -m "feat: add tier 3 fallback and prefers-reduced-motion support"
```

---

### Task 22: Cleanup Deprecated Files

**Files:**
- Remove: `src/FlowerField.jsx`
- Remove: `src/FlowerVisual.jsx`
- Remove: `src/LandingSection.jsx`
- Remove: `src/LandingSection.css`
- Remove: `src/LandingAccessibility.css`
- Remove: `src/Overlays.jsx`
- Remove: `src/Overlays.css`

**Reference:** Spec Section 8 — these files are replaced by the meadow system.

- [ ] **Step 1: Remove deprecated files**

```bash
git rm src/FlowerField.jsx src/FlowerVisual.jsx src/LandingSection.jsx src/LandingSection.css src/LandingAccessibility.css src/Overlays.jsx src/Overlays.css
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds. No import errors (these files should no longer be imported by the new App.jsx).

- [ ] **Step 3: Commit**

```bash
git rm src/FlowerField.jsx src/FlowerVisual.jsx src/LandingSection.jsx src/LandingSection.css src/LandingAccessibility.css src/Overlays.jsx src/Overlays.css
git commit -m "chore: remove deprecated files replaced by meadow system"
```

---

## Post-Implementation Notes

### Assets Still Needed

These assets are referenced in the plan but need to be created/sourced:

1. **Cloud texture** (`src/assets/textures/cloud.jpg`) — Downloaded from al-ro in Task 9
2. **Flower .glb models** — Placeholder procedural geometry used for now. Source or create 6 flower GLTF models later
3. **BotW golden hour LUT** (`src/assets/luts/botw-golden-hour.cube`) — Create in DaVinci Resolve. Not blocking — color grading effect skipped until LUT exists
4. **Static meadow fallback image** — For Tier 3 mobile. Render a screenshot of the working site and use as static background

### Approach B Evolution

The plan builds Approach A (single scene + chunking). To evolve to Approach B (layered render targets):

1. `MeadowEngine.renderToTarget(target)` — change `renderer.render()` to render into a `WebGLRenderTarget`
2. `PostProcessingStack` already accepts the composer pattern — add a second render target for per-section effects
3. Add a compositor pass that blends multiple targets with transition shaders

### Testing Strategy

This is a WebGL project. Primary verification is visual (run `npm run dev`, inspect in browser). For pure logic modules (ScrollEngine, TierDetection, CameraRig, content visibility), unit tests can be added with `vitest` if desired — but the project has no test framework currently and adding one is YAGNI for the initial build.
