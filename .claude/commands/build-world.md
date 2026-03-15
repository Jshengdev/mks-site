# /build-world — Create a New Environment World

Create a new scroll-driven 3D environment world for the MKS site. This generates the environment config, atmosphere keyframes, and wires it into the engine.

## What You Need to Provide

Before running this command, decide:
1. **World ID** — kebab-case identifier (e.g., `crystal-cave`)
2. **Emotional temperature** — the feeling this world embodies (see Emotional Atlas in CLAUDE.md)
3. **Terrain type** — `simplex-layers`, `diamond-square`, `simplex-layers-cliff`, or custom
4. **Sky type** — `preetham`, `preetham-dusk`, `night-atmosphere`, `cel-dome`, `overcast`
5. **Dominant color** — hex color that represents this world
6. **Camera path** — type and control points for the spline
7. **Which subsystems** — grass, flowers, fireflies, rain, stars, ocean, score sheets, figure

## Steps

### 1. Create the environment config

Create `src/environments/$ARGUMENTS.js` with this template:

```javascript
// [World Name] — [Section] / [Route Word]
// Emotional temperature: [Emotion]
// "[Listener quote from Emotional Atlas]"

export default {
  id: '$ARGUMENTS',
  name: '[Display Name]',
  route: '/[route]',
  emotion: '[Emotional Temperature]',
  tagline: '[short poetic description]',

  terrain: {
    type: '[terrain-type]',
    octaves: 5,
    frequencies: [1.25, 2.5, 5, 10, 20],
    amplitudes: [1.0, 0.5, 0.25, 0.125, 0.0625],
    smoothPasses: 3,
    smoothSigma: 2,
    heightRatio: 0.06,
    size: 400,
  },

  sky: {
    type: '[sky-type]',
    turbidity: 3.0,
    rayleigh: 1.5,
    mieCoefficient: 0.01,
    sunElevation: 15,
    // stars: { enabled: false },
    // moon: { enabled: false },
    // lightning: { enabled: false },
  },

  grass: {
    enabled: true,
    bladeCount: 60000,
    baseColor: [0.06, 0.20, 0.03],
    tipColor: [0.25, 0.55, 0.12],
    windSpeed: 1.0,
    // celShading: { enabled: false },
  },

  flowers: {
    enabled: false,
  },

  particles: {
    fireflies: { enabled: false },
    dust: { enabled: false },
    rain: { enabled: false },
    spray: { enabled: false },
    petals: { enabled: false },
  },

  lighting: {
    sunColor: [1.0, 0.90, 0.70],
    sunIntensity: 1.6,
    ambientIntensity: 0.16,
  },

  fog: {
    near: 15,
    far: 120,
    color: '#1a1208',
    density: 0.003,
  },

  postFX: {
    bloom: { threshold: 0.5, intensity: 0.6, levels: 8 },
    grain: { intensity: 0.06 },
    vignette: { darkness: 0.6, offset: 0.35 },
    ca: { offset: [0.002, 0.001], radialModulation: true },
    toneMapping: 'ACES_FILMIC',
    kuwahara: { enabled: false },
    godRays: { enabled: false },
    dof: { enabled: false },
    ssao: { enabled: true },
  },

  camera: {
    pathType: 's-curve',
    heightOffset: 2.0,
    dampingFactor: 2,
    fov: 45,
    controlPoints: [
      [0, 0, 0],
      [6, 0, -25],
      [-4, 0, -50],
      [8, 0, -75],
      [-6, 0, -100],
      [4, 0, -130],
      [0, 0, -160],
    ],
  },

  scoreSheets: { enabled: false },
  figure: { enabled: false },

  audio: {
    ambient: null,
    musicTrigger: { threshold: 0.35 },
    track: {
      title: '[Track Title]',
      artist: 'Michael Kim-Sheng',
      album: '[Album Name]',
      src: null,
    },
  },

  dominantColor: '#[hex]',
}
```

### 2. Create atmosphere keyframes (if scroll-driven)

If this world needs scroll-driven atmosphere changes (not just static values), create `src/meadow/[WorldName]Keyframes.js`:

```javascript
export const [WORLD_NAME]_KEYFRAMES = [
  {
    t: 0.0,   // Opening emotional state
    sunElevation: 0, sunAzimuth: 240,
    turbidity: 10, rayleigh: 2.0,
    mieCoefficient: 0.01, mieDirectionalG: 0.92,
    fogColor: [0.10, 0.10, 0.15], fogDensity: 0.01,
    sunLightColor: [0.5, 0.5, 0.6], sunLightIntensity: 0.5,
    ambientIntensity: 0.08,
    grassBaseColor: [0.03, 0.08, 0.03], grassTipColor: [0.10, 0.25, 0.08],
    grassWindSpeed: 0.5, grassAmbientStrength: 0.25,
    grassTranslucency: 1.0, grassFogFade: 0.003,
    cloudShadowOpacity: 0.05, cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.0, fireflySize: 30,
    bloomIntensity: 0.3, bloomThreshold: 0.7,
    fogDepthStrength: 0.04,
    fogMidColor: [0.10, 0.10, 0.15], fogFarColor: [0.08, 0.08, 0.12],
    colorGradeContrast: 0.05, colorGradeVibrance: 0.3, colorGradeWarmth: 0.0,
    vignetteDarkness: 0.7, grainOpacity: 0.05,
    dustMoteBrightness: 0.0, godRayIntensity: 0.0, kuwaharaStrength: 0.0,
    starBrightness: 0.0, rainBrightness: 0.0, petalBrightness: 0.0,
  },
  { t: 0.25, /* AWAKENING — first shift */ },
  { t: 0.50, /* ALIVE — peak emotion */ },
  { t: 0.75, /* DEEPENING — climax */ },
  { t: 1.0,  /* QUIETING — exhale */ },
]
```

Then add to `KEYFRAME_MAP` in `src/meadow/WorldEngine.js`:

```javascript
import { [WORLD_NAME]_KEYFRAMES } from './[WorldName]Keyframes.js'
// ...
const KEYFRAME_MAP = {
  // ... existing entries
  '[world-id]': [WORLD_NAME]_KEYFRAMES,
}
```

### 3. Register the environment

Edit `src/environments/index.js`:

```javascript
import newWorld from './[world-id].js'

// Add to ENVIRONMENTS
export const ENVIRONMENTS = {
  // ... existing
  '[world-id]': newWorld,
}

// Add to ENV_ORDER (in journey sequence)
export const ENV_ORDER = [
  // ... existing
  '[world-id]',
]
```

### 4. Add world-specific subsystems (if needed)

If this world introduces a new visual subsystem:

1. Create class in `src/meadow/NewSystem.js`
2. Add conditional creation in `WorldEngine.constructor`:
   ```javascript
   this.newSystem = null
   if (envConfig.newFeature?.enabled) {
     this.newSystem = new NewSystem(this.scene, envConfig.newFeature)
   }
   ```
3. Add `.update(animElapsed)` in `_tick()`
4. Add `.dispose()` in `destroy()`
5. Wire into AtmosphereController if brightness is scroll-driven:
   ```javascript
   this.atmosphere.newSystem = this.newSystem
   ```

### 5. Find shader references

Search GitHub for the visual techniques this world needs. Clone repos, extract shaders, adapt. **Never write GLSL from scratch.**

### 6. Verify

```bash
npx vite build
```

Check:
- [ ] Clean build with no errors
- [ ] World loads when selected via WorldNav
- [ ] Camera path feels right
- [ ] Atmosphere values look correct
- [ ] prefers-reduced-motion fallback works
- [ ] DevTuner can tune all parameters
