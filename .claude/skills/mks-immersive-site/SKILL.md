---
name: mks-immersive-site
description: Build scroll-driven immersive 3D websites using Three.js vanilla + Lenis smooth scroll. Covers atmospheric scenes with instanced vegetation, particle systems, post-processing pipelines, scroll-driven camera splines, Canvas 2D entry pages, multi-world architecture, and music-as-router patterns. Based on the MKS composer site architecture.
---

# MKS Immersive Site — Building Scroll-Driven 3D Worlds

This skill teaches you how to build scroll-driven, cinematic 3D websites using the MKS architecture: vanilla Three.js (not R3F), Lenis smooth scroll, instanced vegetation, atmosphere keyframes, post-processing pipelines, and config-driven multi-world systems.

**Read `CLAUDE.md` at the project root first.** It is the living memory of the project — architecture, design principles, learnings, gotchas.

---

## 1. Core Architecture Pattern

The site is a **React SPA** with a **vanilla Three.js engine** running in a `<canvas>` behind React DOM overlays. No SSR, no R3F, no CSS-in-JS.

```
React Layer (DOM)          Three.js Layer (Canvas)
─────────────────          ──────────────────────
App.jsx                    WorldEngine.js
  WorldContext.jsx            ScrollEngine.js (Lenis)
  EntryPage.jsx               CameraRig.js (spline)
  EnvironmentScene.jsx         AtmosphereController.js (keyframes)
  ContentOverlay.jsx           GrassChunkManager.js (instanced)
  MiniPlayer.jsx               FireflySystem.js (particles)
  WorldNav.jsx                 PostProcessingStack.js (pmndrs)
  DevTuner.jsx                 + 15 more subsystems
```

### Key Principle: Two Separate Rendering Systems

- **Canvas 2D** for the entry page (dithered generative art, no WebGL)
- **WebGL** for the 3D worlds (Three.js, pmndrs/postprocessing)
- Entry page gates `AudioContext` creation, then dissolves into WebGL

### File Conventions

- Engine code: `src/meadow/` — class-based, vanilla JS (no JSX)
- Shaders: `src/meadow/shaders/*.glsl` — separate .vert.glsl and .frag.glsl files
- Effects: `src/meadow/` — custom `Effect` subclasses of pmndrs/postprocessing
- Environment configs: `src/environments/*.js` — plain JS objects
- React components: `src/*.jsx` and `src/content/*.jsx`
- Assets: `src/assets/textures/`, `src/assets/audio/` — ES-imported (Vite hashes)

---

## 2. Scroll-Driven Camera (Lenis + CatmullRomCurve3)

### ScrollEngine (Lenis wrapper)

```javascript
// src/meadow/ScrollEngine.js
import Lenis from 'lenis'

export default class ScrollEngine {
  constructor() {
    this.progress = 0  // 0→1 normalized scroll position
    this.velocity = 0  // signed scroll velocity

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,  // native scroll on mobile
    })

    this.lenis.on('scroll', (e) => {
      this.progress = e.progress
      this.velocity = e.velocity
    })

    // Lenis needs its own RAF loop
    this._tick = this._tick.bind(this)
    this._tick(performance.now())
  }

  _tick(time) {
    this.lenis.raf(time)
    this._raf = requestAnimationFrame(this._tick)
  }
}
```

**Critical:** Lenis hijacks scroll events globally. Any DOM element that needs independent scrolling (DevTuner panels, modals) must have the `data-lenis-prevent` attribute.

### CameraRig (Spline + Damped Lerp)

The camera follows a `CatmullRomCurve3` spline defined by control points in the environment config:

```javascript
// Build spline from config
this.curve = new THREE.CatmullRomCurve3(
  config.controlPoints.map(p => new THREE.Vector3(p[0], p[1], p[2]))
)

// Each frame: lerp toward target, then terrain-follow
update(scrollProgress, scrollVelocity) {
  this.targetT = scrollProgress
  this.currentT += (this.targetT - this.currentT) * this.lerpFactor

  // Get position on spline
  this.curve.getPoint(this.currentT, this._cachedPos)

  // CRITICAL: terrain following prevents camera clipping into hills
  this._cachedPos.y = getTerrainHeight(x, z) + this.heightOffset

  // Look ahead on spline for smooth orientation
  this.curve.getPoint(Math.min(this.currentT + 0.01, 1.0), this._lookTarget)
  this._lookTarget.y = getTerrainHeight(lx, lz) + this.heightOffset

  // FOV boost from scroll velocity (cinematic)
  const targetFov = this.baseFov + Math.min(speed * 8, this.fovMaxBoost)
  this.currentFov += (targetFov - this.currentFov) * 0.04

  // Mouse parallax (ThreeDOF "Eyes" layer)
  this.camera.rotation.y += smoothedMouseX * panFactor
  this.camera.rotation.x += smoothedMouseY * panFactor * 0.5
}
```

**Camera path types per world:**
- `s-curve` — Golden Meadow (winding through field)
- `arc` — Ocean Cliff (orbiting seated figure)
- `slow-push` — Night Meadow (intimate forward crawl)
- `spiral` — Ghibli Painterly (orbiting store scene)
- `urgent-push` — Storm Field (fast, low, with shake)

### Scroll Space

The scroll container is simply `<div style={{ height: '500vh' }} />`. Lenis normalizes the scroll position to 0→1 regardless of container height.

---

## 3. The WorldEngine (Config-Driven 3D Engine)

`WorldEngine` is the orchestrator. It reads an environment config object and conditionally creates subsystems.

### Engine Lifecycle

```
constructor(canvas, envConfig)
  → new THREE.WebGLRenderer({ antialias: true, alpha: false })
  → renderer.toneMapping = NoToneMapping  // post-processing handles it
  → detectTier() → TIER_CONFIG[tier]
  → setupScene() → sky, sunLight, ambientLight, fog
  → createTerrain()
  → new CloudShadows()
  → new GrassChunkManager()     // if config.grass.enabled
  → new FireflySystem()         // if config.particles.fireflies.enabled
  → new FlowerInstances()       // if config.flowers.enabled
  → new PostProcessingStack()
  → new AtmosphereController(keyframes)
  → new ScoreSheetCloth()       // if config.scoreSheets.enabled
  → new StarField()             // if config.sky.stars.enabled
  → new RainSystem()            // if config.particles.rain.enabled
  → new PetalSystem()           // if config.particles.petals.enabled
  → new LightningSystem()       // if config.sky.lightning.enabled
  → new CursorInteraction()
  → new AudioReactive()
  → wire optional subsystems into atmosphere controller
  → start _tick() loop
```

### The Render Loop (_tick)

```
1. cameraRig.update(scrollProgress, velocity)
2. cloudShadows.update(elapsed)
3. ocean?.update(elapsed)
4. grassManager?.update(camPos, elapsed)
5. fireflies?.update(elapsed)
6. flowers?.update(elapsed)
7. atmosphere.update(scrollProgress)        // interpolates keyframes, pushes to all subsystems
8. musicTrigger.update(scrollProgress)
9. scoreSheets?.update(elapsed)
10. dustMotes?.update(elapsed)
11. starField?.update(elapsed)
12. rain?.update(elapsed)
13. petals?.update(elapsed)
14. lightning?.update(elapsed, delta)
15. cursorInteraction.update(camera, delta)
16. grassManager?.updateCursor(worldPos, brushStrength, velocity)
17. audioReactive.update(delta)
18. _updateContentVisibility()               // DOM opacity from camera distance
19. godRayPass?.render() → postProcessing.setGodRayTexture()
20. postProcessing.update(velocity, camPos, sectionPositions)
21. postProcessing.render(delta)
```

### Content Visibility Formula

DOM content sections fade in/out based on camera distance:

```javascript
const dist = Math.abs(cameraT - sectionT)
const opacity = 1.0 - smoothstep(0.03, 0.08, dist)
el.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none'
```

### Performance Tiers

| Tier | Criteria | Grass | FX |
|------|----------|-------|-----|
| 1 (Desktop) | >1366px, >4 cores, maxTex>4096 | 60K | Full |
| 2 (Laptop) | 769-1366px or ≤4 cores | 18K | Reduced |
| 3 (Mobile) | ≤768px or no WebGL2 | 0 | Static fallback |

---

## 4. Atmosphere Keyframes (Scroll-Driven Interpolation)

The atmosphere system is the emotional engine. It interpolates 38+ parameters between 5 keyframes as the user scrolls:

### Keyframe Structure

```javascript
const KEYFRAMES = [
  { t: 0.0,   // STILLNESS — cold world, sacred anticipation
    sunElevation: 2, sunAzimuth: 250,
    turbidity: 12, rayleigh: 3.0,
    fogColor: [0.12, 0.18, 0.28],      // steel-teal
    fogDensity: 0.018,                  // thick — everything hidden
    sunLightColor: [0.45, 0.50, 0.65],  // cool blue-steel
    grassBaseColor: [0.01, 0.03, 0.03], // near-black teal
    grassWindSpeed: 0.1,                // frozen — a held breath
    fireflyBrightness: 0.0,
    bloomIntensity: 0.1,
    vignetteDarkness: 0.85,
    godRayIntensity: 0.0,
    // ... 25+ more parameters
  },
  { t: 0.25,  // AWAKENING — first warmth },
  { t: 0.50,  // ALIVE — golden hour arrives },
  { t: 0.75,  // DEEPENING — peak emotional climax },
  { t: 1.0,   // QUIETING — dusk, exhale },
]
```

### Interpolation

```javascript
update(scrollProgress) {
  // Find bracketing keyframes
  // Local t within segment, smoothstepped
  const eased = smoothstep(localT)

  // Interpolate all params
  for (const key of PARAM_KEYS) {
    if (ARRAY_KEYS.has(key)) {
      lerpArrayInto(this.current[key], prev[key], next[key], eased)
    } else {
      this.current[key] = lerpScalar(prev[key], next[key], eased)
    }
  }
  this._pushToSubsystems()
}
```

### Push to Subsystems

AtmosphereController pushes interpolated values to every subsystem every frame:
- **Sky** — turbidity, rayleigh, Mie, sun position (elevation + azimuth → spherical coords)
- **Lights** — sun color/intensity, ambient intensity
- **Fog** — color, density
- **Grass** — base/tip color, wind speed, translucency, ambient strength
- **Cloud shadows** — opacity, drift speed
- **Fireflies** — brightness, size, visibility
- **Post-processing** — bloom intensity/threshold, vignette darkness, grain opacity, fog depth, color grade
- **Dust motes** — brightness, visibility
- **God rays** — intensity, sun position
- **Kuwahara** — strength (activates at emotional peak)
- **Stars** — brightness (night/dusk)
- **Rain** — brightness (storm)
- **Petals** — brightness (ghibli)

**Critical gotcha:** AtmosphereController overwrites ALL subsystem values every frame when not paused. DevTuner changes won't stick unless atmosphere is frozen (paused = true).

### Per-World Keyframes

Each world has its own keyframe file:
- `AtmosphereController.js` — MEADOW_KEYFRAMES (golden meadow)
- `NightMeadowKeyframes.js` — blue-silver night atmosphere
- `OceanCliffKeyframes.js` — teal dusk atmosphere
- `StormFieldKeyframes.js` — dark oppressive atmosphere
- `GhibliKeyframes.js` — hyper-vivid cel atmosphere

If no hand-tuned keyframes exist, `staticAtmosphereFromConfig(env)` generates flat keyframes from the env config (same values at t=0 and t=1, no scroll interpolation).

---

## 5. Instanced Vegetation (Grass + Flowers)

### GrassChunkManager

60K grass blades rendered via `InstancedMesh` with chunked loading:

- **Chunk pool:** 20x20 unit chunks, activate/dispose/fade-in based on camera distance
- **LOD:** High (7-segment blade) near camera, Low (1-segment billboard) far
- **Material:** Custom `ShaderMaterial` with grass.vert.glsl / grass.frag.glsl
- **setUniform(key, value):** Propagates to base material + all chunk clones

### Grass Shader (4-Layer Wind)

The vertex shader applies 4 layers of wind deformation:

```glsl
// grass.vert.glsl — stolen from Nitash-Biswas + al-ro
// Layer 1: Global wind (sin waves, low frequency)
// Layer 2: Gust wind (higher frequency, amplitude modulated)
// Layer 3: Local turbulence (per-blade noise offset)
// Layer 4: Cursor wind brush (push away from mouse worldPos)

// Billboard rotation (blade always faces camera)
// Fake curved normals for lighting
// Cloud shadow UV lookup
```

The fragment shader uses:
- **Translucent lighting** (al-ro) — light passes through thin blades
- **iquilez fog** — artist-controllable fog falloff
- **Cloud shadow sampling** from the shadow plane texture

### FlowerInstances

800 flowers via `InstancedMesh`, 6 color types, clearing avoidance:
- **Shader:** 3-band toon diffuse + rim light (daniel-ilett/shaders-botw-cel-shading)
- **Sway:** Gentle vertex displacement in flower.vert.glsl
- Placed with clearing avoidance — no flowers where content sections appear

### Cel-Shading for Ghibli World

Grass can be cel-shaded per-world via config:

```javascript
grass: {
  celShading: {
    enabled: true,
    bands: 4,
    thresholds: [0.6, 0.35, 0.001],
  },
}
```

The engine sets `uCelEnabled = 1.0` and `uCelThresholds` on the grass material.

---

## 6. Particle Systems

All particle systems use `THREE.Points` with custom `ShaderMaterial`:

### FireflySystem
- `Points` with additive blending (`AdditiveBlending`)
- Vertical bob animation in vertex shader
- Warm amber color `(0.83, 0.79, 0.41)`
- Inverse-distance radial glow in fragment shader
- Stolen from: Alex-DG/vite-three-webxr-flowers

### DustMotes
- Tiny floating particles catching sunlight
- Slow drift, random sizing
- Brightness driven by atmosphere

### RainSystem (Storm Field)
- 2000 velocity-stretched particles
- Fast downward velocity `[0.5, -15.0, 0.5]`
- Length factor 3.0 for elongated streaks
- Stolen from: three.quarks (stretched billboard pattern)

### PetalSystem (Ghibli Painterly)
- 300 falling cherry blossom petals
- Gentle rotation + drift
- Brightness driven by atmosphere

### StarField (Night/Dusk)
- Procedural star grid per cube face
- `pow(random, 6)` brightness distribution (rare bright stars)
- Moon as bright tight disk
- Fade with sky brightness: `visibility * exp(-skyBrightness * 15.0)`
- Stolen from: Nugget8/Three.js-Ocean-Scene

---

## 7. Post-Processing Pipeline (pmndrs/postprocessing)

### Stack Order (Critical)

```
RenderPass
  → NormalPass (for SSAO)
  → EffectPass:
      SSAO
      → God Ray Composite
      → Bloom
      → Motion Blur
      → Tone Mapping (ACES_FILMIC, AGX, or UNCHARTED2)
      → Fog Depth (3-zone depth fog)
      → Color Grade (SEUS-style lift/gamma/gain/split-tone)
      → Kuwahara (anisotropic painterly filter)
      → Radial CA (chromatic aberration)
      → Vignette
      → [DOF] (optional)
      → Film Grain (MUST BE LAST — DOF must not blur grain)
```

### Key Effects

**FilmGrainEffect** — Custom Effect subclass, uses `uGrainIntensity` uniform (not blendMode opacity).

**RadialCAEffect** — Chromatic aberration with radial modulation. Intensity scales with scroll velocity for cinematic feel.

**KuwaharaEffect** — 8-sector anisotropic Kuwahara filter. THE differentiator for the Ghibli Painterly world. Params: `radius: 6, alpha: 25, quantizeLevels: 16, saturation: 1.8`. Stolen from MaximeHeckel/blog.

**ColorGradeEffect** — SEUS-style with uContrast, uVibrance, uSplitIntensity (warmth). Pre-grade `uExposure` multiplier.

**GodRayPass** — Screen-space radial blur (GPU Gems 3). Renders occlusion to half-res FBO, composites via GodRayCompositeEffect.

**FogDepthPass** — 3-zone depth fog with near/mid/far colors.

### Custom Effect Pattern

```javascript
import { Effect } from 'postprocessing'

const fragmentShader = `
  uniform float uMyParam;
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // your effect here
    outputColor = inputColor;
  }
`

export class MyEffect extends Effect {
  constructor(options = {}) {
    super('MyEffect', fragmentShader, {
      uniforms: new Map([
        ['uMyParam', new THREE.Uniform(options.myParam ?? 1.0)],
      ]),
    })
  }
}
```

### Tone Mapping

`renderer.toneMapping = NoToneMapping` — the renderer does NO tone mapping. Instead, `ToneMappingEffect` from pmndrs handles it in the post-processing pipeline. This means `renderer.toneMappingExposure` does NOTHING. Exposure must be a uniform in the color grade shader.

---

## 8. Entry Page (Canvas 2D Generative Art)

The entry page uses Canvas 2D (not WebGL) for a dithered procedural flower:

### Technique Stack
1. **Procedural flower geometry** — Bezier curve petals, seeded random (different each visit)
2. **Bayer 4x4 dithering** — quantizes to 4-tone palette via threshold matrix
3. **Half-resolution render** — intentional pixelated quality (scale = 0.5, DPR = 1)
4. **6-layer cursor parallax** — stem, back petals, front petals, center, stamen, text
5. **Breathing animation** — petal scale oscillation + flutter
6. **Color bloom transition** — monochrome palette lerps to golden palette on click
7. **Dither dissolve** — pixels fade to black using Bayer threshold vs dissolve progress

### Palette System

```javascript
// Mono (cold, before interaction)
const PALETTE_MONO = [
  [0x11, 0x11, 0x10],  // darkest
  [0x54, 0x52, 0x50],  // dark mid
  [0xa8, 0xa8, 0xa4],  // light mid
  [0xed, 0xed, 0xea],  // lightest
]

// Gold (warm, earned through interaction — "earned warmth")
const PALETTE_GOLD = [
  [0x1a, 0x12, 0x08],  // warm black
  [0x8a, 0x6a, 0x2a],  // dark amber
  [0xd4, 0xc9, 0x68],  // amber
  [0xf0, 0xe8, 0xc8],  // warm cream
]
```

### Transition Sequence (on click)

1. **Bloom** (0-800ms): Color lerps mono→gold + petals open 25%
2. **Hold** (800-1200ms): Full gold palette
3. **Dissolve** (1200-2000ms): Bayer dither dissolve to black
4. → `completeEntry()` → WorldContext unmounts entry, mounts 3D world

### Why Canvas 2D, Not WebGL

- Gates `AudioContext` (requires user gesture)
- No WebGL context conflicts (entry page and 3D world never coexist)
- Dithering is a pixel-level operation — Canvas 2D `getImageData` is natural
- Half-res pixelated quality would be harder to achieve cleanly in WebGL

---

## 9. Environment World Configs

Each world is a plain JS object in `src/environments/`. The config drives which subsystems WorldEngine creates.

### Config Schema

```javascript
export default {
  id: 'world-id',           // unique identifier, used in KEYFRAME_MAP lookup
  name: 'Display Name',
  route: '/url-path',
  emotion: 'Emotional Temperature',
  tagline: 'short poetic description',

  terrain: {
    type: 'simplex-layers' | 'simplex-layers-cliff' | 'diamond-square' | 'simplex-layers-stylized',
    octaves: 5,
    frequencies: [1.25, 2.5, 5, 10, 20],
    amplitudes: [1.0, 0.5, 0.25, 0.125, 0.0625],
    smoothPasses: 3,
    smoothSigma: 2,
    heightRatio: 0.06,
    size: 400,
    vertexColor: [r, g, b],   // optional tint
  },

  sky: {
    type: 'preetham' | 'preetham-dusk' | 'night-atmosphere' | 'cel-dome' | 'overcast',
    turbidity: 3.0,
    rayleigh: 1.5,
    sunElevation: 15,          // degrees, negative = below horizon
    stars: { enabled, gridSize, brightnessExp, maxOffset, fadeFactor },
    moon: { enabled, sharpness, size },
    lightning: { enabled, decayMs, interval: [min, max] },
  },

  ocean: {
    enabled: false,
    type: 'stylized',
    colorNear: 0x0a2e3d,
    colorFar: 0x050d1a,
    foamFrequency: 2.8,
    bobAmplitude: 0.1,
  },

  grass: {
    enabled: true,
    bladeCount: 60000,
    baseColor: [r, g, b],      // linear RGB
    tipColor: [r, g, b],
    windSpeed: 1.0,
    bendStrength: 0.5,
    celShading: { enabled, bands, thresholds: [0.6, 0.35, 0.001] },
  },

  flowers: { enabled, count, colorTypes, palette, celShading },

  particles: {
    fireflies: { enabled, count, color, brightness, bobSpeed, driftRadius },
    dust: { enabled, count },
    rain: { enabled, count, velocity: [x, y, z], lengthFactor },
    spray: { enabled, count, color },
    petals: { enabled, count },
  },

  lighting: {
    sunColor: [r, g, b],
    sunIntensity: 1.6,
    ambientIntensity: 0.16,
    celLighting: false,
  },

  fog: { near, far, color: '#hex', density },

  postFX: {
    bloom: { threshold, intensity, levels },
    grain: { intensity },
    vignette: { darkness, offset },
    ca: { offset: [x, y], radialModulation },
    toneMapping: 'ACES_FILMIC' | 'AGX' | 'UNCHARTED2',
    kuwahara: { enabled, radius, alpha, quantizeLevels, saturation },
    godRays: { enabled, numSamples, decay, exposure },
    dof: { enabled, focusRange, bokehScale },
    ssao: { enabled },
  },

  camera: {
    pathType: 's-curve' | 'arc' | 'slow-push' | 'spiral' | 'urgent-push',
    heightOffset: 2.0,
    dampingFactor: 2,
    fov: 45,
    shake: { enabled, frequency, amplitude },
    controlPoints: [[x, y, z], ...],  // CatmullRomCurve3 points
  },

  scoreSheets: { enabled, count, type: 'cloth' | 'pinned' | 'ground' | 'torn' | 'projected' },
  figure: { enabled, type: 'seated' | 'walking', celShading, facing, distance },

  audio: {
    ambient: 'ocean' | 'night' | 'storm' | null,
    musicTrigger: { threshold: 0.35 },
    track: { title, artist, album, src: null },
  },

  dominantColor: '#hex',
}
```

### Environment Registry

```javascript
// src/environments/index.js
import goldenMeadow from './golden-meadow.js'
// ...

export const ENVIRONMENTS = {
  'golden-meadow': goldenMeadow,
  'ocean-cliff': oceanCliff,
  // ...
}

export const ENV_ORDER = ['golden-meadow', 'ocean-cliff', ...]

// Build track list from environments (for MiniPlayer)
export const TRACK_LIST = ENV_ORDER.map(id => ({
  worldId: id,
  ...ENVIRONMENTS[id].audio.track,
  emotion: ENVIRONMENTS[id].emotion,
  dominantColor: ENVIRONMENTS[id].dominantColor,
}))
```

---

## 10. Music-as-Router Pattern

There are no URL routes. The MiniPlayer is the navigation:

```
WorldContext.jsx
  ├── entryComplete: boolean (gates entry page vs 3D world)
  ├── currentWorld: string (env ID, e.g. 'golden-meadow')
  └── setCurrentWorld(id) — changes active environment

App.jsx
  └── if (!entryComplete) → <EntryPage />
      else → <EnvironmentScene envId={currentWorld} />
             <WorldNav />       (world switcher UI)
             <MiniPlayer />     (audio player, persists across worlds)
             <MoonlightCursor />
```

When the user changes tracks in MiniPlayer or clicks a world in WorldNav, `setCurrentWorld(id)` fires. EnvironmentScene detects the `envId` change, destroys the old WorldEngine, and creates a new one with the new config.

The TRACK_LIST maps each track to a world ID, so playing a different song navigates to a different world.

---

## 11. Shader Code Rules

### NEVER Generate GLSL From Scratch

All shader code must be adapted from real GitHub repos. The reference repos are:

| Author | Repo | What Was Stolen |
|--------|------|----------------|
| Nitash-Biswas | grass-shader-glsl | 4-layer wind deform(), billboard rotation, fake normals |
| al-ro | grass (WebGL) | ACES tonemapping, iquilez fog, translucent lighting |
| James-Smyth | BotW grass | Cloud shadow UV scrolling, vertex color wind weights |
| Alex-DG | vite-three-webxr-flowers | FirefliesMaterial, additive blending, vertical bob |
| daniel-ilett | toon shader | Step-function toon lighting (3-band + rim) |
| spacejack | terra | Scene orchestration constants, terrain patterns |
| MaximeHeckel | blog | Kuwahara pipeline (5-stage anisotropic) |
| Erkaman | glsl-godrays | Radial blur (GPU Gems 3) |
| thaslle | stylized-water | Simplex noise ocean, cartoon foam |
| craftzdog | ghibli-style-shader | Cel-shading pipeline |
| Nugget8 | Three.js-Ocean-Scene | Skybox with stars, day/night cycle |
| wwwtyro | glsl-atmosphere | 100-line ray-march atmosphere |
| cybertiwari | Cloth-Simulation | Verlet solver for score sheet cloth |

When building a new shader effect:
1. Find a real GitHub repo with the technique
2. Clone it, read the actual shader files
3. Extract the core algorithm + magic values
4. Adapt to the project's conventions (uniform naming, coordinate space)
5. Credit the source in a comment at the top of the file

### Shader Conventions

- Output linear values — post-processing handles tone mapping + gamma
- Never do per-shader ACES/gamma (causes double correction)
- Use `instanceMatrix` for InstancedMesh (compute normals from `mat3(instanceMatrix) * normal`)
- Texture paths: always ES module imports (`import url from '../assets/textures/foo.jpg'`), never `/src/` paths

---

## 12. Design Principles (Non-Negotiable)

### YES

- **85% dark / 15% light** — black is atmosphere, not absence
- **Surfaces, not pops** — opacity transitions only. No scale/bounce/slide entrances
- **Earned warmth** — cold is default. Warmth appears through interaction
- **Film grain + vignette always present** — never disable grain, always have edge darkening
- **`prefers-reduced-motion` on EVERYTHING** — freeze camera lerp, disable particles, show static frame
- **Two-voice typography** — serif for titles (classical), sans-serif for body (modern)
- **Imperfection budget** — slight rotations (1-2deg), soft blur, grain. Never pixel-perfect

### NO

- No flat black (`#000`) — use breathing blacks (`#0a0a0a`, `#1a1208`)
- No neon colors — cool luminance only (`#c8d4e8`)
- No transform-based entrance animations — opacity only
- No AI-generated images of the artist — real photography only
- No grid layouts for products — each album gets its own cinematic world

### Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `--void` | `#0a0a0a` | Primary background |
| `--warm-black` | `#1a1208` | Warm section backgrounds |
| `--text-primary` | `#c8d4e8` | Body text (cool luminance) |
| `--teal` | `#4a6a68` | Audience color (viewer's space) |
| `--amber` | `#d4c968` | Artist color (warmth, presence) |
| `--red-felt` | `#983028` | Used exactly ONCE in entire site |

---

## 13. Performance Rules

### Memory / Allocation

- **NEVER** allocate per-frame: no `new THREE.Vector3()` inside update loops
- Use module-level reusable objects: `const _lookTarget = new THREE.Vector3()`
- When iterating a Map and deleting entries: snapshot keys first `[...map.keys()]`

### Dispose / Cleanup

- Every `addEventListener` needs a matching `removeEventListener` in dispose
- Every `new THREE.Geometry/Material/Texture` needs `.dispose()` in cleanup
- WorldEngine.destroy() must dispose ALL subsystems

### InstancedMesh

- Don't replace `instanceMatrix` with `new InstancedBufferAttribute`. Instead: `mesh.instanceMatrix.array.set(data); mesh.instanceMatrix.needsUpdate = true`
- Vertex shaders MUST use `instanceMatrix` — without it, all instances render at origin

### Texture Loading

- Always use ES module imports for textures (Vite hashes filenames for production)
- WRONG: `/src/assets/textures/foo.jpg` (breaks in production)
- RIGHT: `import url from '../assets/textures/foo.jpg'`

---

## 14. DevTuner Integration

Toggle with backtick (`` ` ``). The DevTuner exposes all subsystem parameters as sliders.

### Wiring Gotchas

- **Exposure** → `colorGrade.uniforms.uExposure` (NOT `renderer.toneMappingExposure`)
- **FOV** → set `cameraRig.baseFov` + `cameraRig.currentFov` (CameraRig overwrites `camera.fov` every frame)
- **Firefly/Dust brightness** → also toggle `points.visible` (atmosphere sets visible=false at low brightness)
- **SSAO radius** → use `effect.radius` getter/setter (pmndrs API varies by version)

### Tuning Workflow

1. Freeze atmosphere (pause AtmosphereController)
2. Adjust sliders until it looks right
3. Export JSON preset
4. Apply values to the appropriate keyframe in the keyframes file

---

## 15. Adding a New World (Step-by-Step)

Use the `/build-world` slash command for the template, then:

### Step 1: Create the Environment Config

Create `src/environments/your-world.js` following the schema in Section 9.

### Step 2: Create Keyframes (Optional)

If the world needs scroll-driven atmosphere changes, create `src/meadow/YourWorldKeyframes.js`:

```javascript
export const YOUR_WORLD_KEYFRAMES = [
  { t: 0.0, sunElevation: ..., fogColor: [...], ... },
  { t: 0.25, ... },
  { t: 0.50, ... },
  { t: 0.75, ... },
  { t: 1.0, ... },
]
```

Then add it to the `KEYFRAME_MAP` in `WorldEngine.js`.

If no keyframes, the engine auto-generates static ones from the config.

### Step 3: Register the Environment

Add to `src/environments/index.js`:
- Import the config
- Add to `ENVIRONMENTS` map
- Add to `ENV_ORDER` array
- Wire audio source if available

### Step 4: Add World-Specific Subsystems (if needed)

If the world needs a new subsystem (e.g., a new particle type):
1. Create class in `src/meadow/YourSystem.js`
2. Add conditional creation in `WorldEngine.constructor` gated by config
3. Add `.update(elapsed)` call in `_tick()`
4. Add `.dispose()` call in `destroy()`
5. Wire into AtmosphereController if it has brightness/visibility driven by scroll

### Step 5: Find and Steal Shaders

1. Search GitHub for the visual technique
2. Clone the repo, read actual shader code
3. Extract to `src/meadow/shaders/your-effect.vert.glsl` / `.frag.glsl`
4. Credit the source

### Step 6: Test

- `npx vite build` — verify clean build
- Check all 3 performance tiers
- Verify `prefers-reduced-motion` fallback
- DevTuner: freeze atmosphere, tune values, export preset

---

## 16. Critical Learnings (From Real Bugs)

These are mistakes that were made and fixed. Do not repeat them:

1. `scene.background = color` overrides Sky dome. Don't set it when using Preetham Sky.
2. Shaders must output linear — per-shader gamma/ACES causes double correction.
3. Camera spline Y must account for terrain height or camera clips into hills.
4. `renderer.toneMappingExposure` does NOTHING when `toneMapping = NoToneMapping`.
5. CameraRig.update() sets `camera.fov` every frame — DevTuner must set `cameraRig.baseFov`.
6. Cursor worldPos needs lerping (`worldPos.lerp(hitPoint, 0.12)`) or it jitters.
7. AtmosphereController overwrites everything every frame — freeze mode required for tuning.
8. Lenis hijacks all scroll — use `data-lenis-prevent` on independently-scrolling elements.
9. When cloning ShaderMaterial, cloned materials get independent uniforms. Must iterate all clones.
10. `BufferGeometryUtils` imports from `three/examples/jsm/utils/BufferGeometryUtils.js`, not `THREE.BufferGeometryUtils`.
11. PostProcessingStack.dispose() must clean up ALL effects, not just some.
12. GhibliClouds (hemisphere dome + FBM toon) produced flat blobs — don't attempt without real reference.
13. Textured plane butterflies look terrible — use simple 3D geometry with wing flap, no textures.
14. Score sheets at Y:4.5-8.5m are invisible (camera at ~1.5m). Keep objects within camera view range.
15. pmndrs SSAOEffect property access varies by version — use getter/setter with try/catch fallback.
