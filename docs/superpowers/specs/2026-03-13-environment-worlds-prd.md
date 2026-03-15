# PRD: Environment Worlds — Five Scenes, One Engine

> **Status:** Draft
> **Date:** 2026-03-13
> **Author:** Human-seeded vision + AI synthesis
> **Depends on:** Meadow engine refactor (in progress in separate window)

---

## 1. Human-Seeded Vision

### The Core Truth

Michael Kim Sheng's music **finds the locked rooms inside listeners**. The website must be the same act of returning. Each environment is not a page — it's a **place** you enter. The emotional atlas (verbatim listener words) defines what each place must feel like.

### What the User Said

> "I want genuinely different environments but they share the same engine architecture. Most things should be different but use the shared resources."

> "Build variations of what the meadow scene is supposed to be... the journey should reflect something that the music has — a lot of the human-seeded questions."

> "Each one gets clicked, it'll bring him into a new world where we can view all these things."

> "Every single scene should be built using everything that we find in the repo extractions."

### The Emotional Atlas (verbatim, never AI-edited)

These listener descriptions define the emotional temperature of each environment:

| Emotion | Listener Words | Environment |
|---------|---------------|-------------|
| **Innocent Awakening** | "She opened her eyes that day, but she also opened their soul. She suddenly realized the love of her life has been right there all along" | **Golden Meadow** (dawn, warmth surfacing) |
| **Peaceful Heartache** | "A goodbye where both protagonists don't want to leave, but they know it'd be better to free each other" | **Ocean Cliff** (vast calm, horizon dissolving) |
| **The Search** | "Running through whatever obstacles are presented... breath comes in a little harder... ears strain to hear the next note" | **Storm Field** (wind, urgency, darkness clearing) |
| **Bittersweet Letting Go** | "Knowing that someday this pain will be joined with peace and more beauty than I can imagine" | **Night Meadow** (stars, fireflies, stillness after grief) |
| **The Fall and Acceptance** | "The sun is rising as he is falling, but his life has never felt brighter" | **Ghibli Painterly** (hyper-vivid, cel-shaded, the world rendered as feeling) |

### The Reference Images

| Image | File | Visual DNA |
|-------|------|-----------|
| Still ocean, hazy horizon | `still-ocean-hazy-horizon-muted-calm.png` | Absolute calm, muted teal, horizon dissolving into sky |
| Lone figure in vast grass | `lone-figure-in-vast-windswept-grass-field-aerial.png` | Cloud shadows, scale of nature vs human, aerial perspective |
| Teal surfer, motion blur | `lone-surfer-teal-ocean-wave-slow-shutter.png` | Lone figure in immensity, slow-shutter dreamlike quality |
| Crepuscular rays | `crepuscular-rays-cloud-mass-backlit-blue.png` | God rays through cloud mass, backlit blue |
| Score sheets on dark ground | `score-sheet-on-dark-ground-leaf-shadows.jpeg` | 85/15 dark-light ratio, cream paper warmth against void |

---

## 2. Architecture: Shared Engine, Different Worlds

### What's Shared (the engine)

Every environment inherits from the same `MeadowEngine` architecture:

```
SharedEngine/
  ├── ScrollEngine.js          — Lenis 0→1 progress + velocity
  ├── CameraRig.js             — CatmullRomCurve3 spline + damped lerp
  ├── TierDetection.js         — 3 performance tiers
  ├── PostProcessingStack.js   — EffectComposer (bloom, CA, vignette, grain)
  ├── ContentOverlay.jsx       — DOM sections with opacity from scroll
  ├── MiniPlayer.jsx           — Audio player (persists across routes)
  └── MoonlightCursor.jsx      — Cursor effect
```

### What's Different (per environment)

| Component | Golden Meadow | Ocean Cliff | Night Meadow | Ghibli Painterly | Storm Field |
|-----------|--------------|-------------|--------------|-----------------|-------------|
| **Terrain** | SimplexLayers rolling hills | Cliff + flat ocean plane | Flat plain, gentle slopes | Stylized rolling hills | DiamondSquare sharp peaks |
| **Sky** | Preetham golden hour | Preetham dusk + stars | Full night + star field | Cel-shaded sky dome | Overcast, dark grey |
| **Water** | None (grass only) | Stylized ocean (Path B) or Reflective (Path A) | None | Stylized cartoon water | Rain puddles |
| **Vegetation** | 100K grass + 800 flowers | Cliff grass (sparse) + moss | Tall dark grass, no flowers | Cel-shaded grass + trees | Windswept grass, no flowers |
| **Particles** | Fireflies (500) + dust | Sea spray + fog wisps | Fireflies (800) + stars | Petals (300) + dust | Rain streaks + lightning |
| **Lighting** | Warm directional (amber) | Cool directional (teal) | Moonlight (blue-white) | Flat cel light (world-space) | Dim, occasional flash |
| **Post-FX** | Film grain + bloom + LUT(warm) | Film grain + DOF + LUT(teal) | Heavy grain + bloom + vignette | Kuwahara filter + toon | Heavy CA + grain + vignette |
| **Figure** | None (you ARE the viewer) | Sitting figure at cliff edge | None (you ARE the viewer) | Walking figure (distant) | None (you ARE the viewer) |
| **Audio** | Music snippet at scroll peak | Ocean ambient + music | Night ambient + music | Music as primary driver | Wind + thunder + music |
| **Score Sheets** | Floating in wind (cloth sim) | Pinned to rock face | Scattered on ground (lit) | Projected onto 3D surfaces | Torn, blowing away |
| **Camera Path** | S-curve through field | Arc around seated figure → horizon | Slow push through dark field | Spiraling around scene | Urgent forward push |

### Route Structure

```
/           → Golden Meadow (landing, the introduction)
/listen     → Ocean Cliff (music section — peaceful heartache, contemplation)
/story      → Night Meadow (about section — bittersweet letting go, reflection)
/collect    → Ghibli Painterly (store section — the fall and acceptance, hyper-vivid)
/witness    → Storm Field (tour section — the search, urgency)
```

Each route is a full-screen 3D environment. Navigation between routes uses a portal transition (gl-transitions GLSL shader dissolve, not a page reload).

---

## 3. Environment Specifications

### 3.1 Golden Meadow (Landing / Introduction)

**Emotional temperature:** Innocent Awakening — warmth surfacing from cold

**What the viewer feels:** The meadow exists before you arrive. You enter a world already in motion. The wind was already blowing. The light was already golden. You were always meant to be here.

**Terrain:**
- Algorithm: SimplexLayers, 5 octaves
- Frequencies: `[1.25, 2.5, 5, 10, 20]`, Amplitudes: `[1.0, 0.5, 0.25, 0.125, 0.0625]`
- Post-smooth: `GaussianBoxBlur(sigma=2, 3 passes)` — dreamy rolling hills
- Height-to-width ratio: 6% (BotW feel)
- Size: 400×400 units
- **Steal from:** `spacejack/terra` (GPU instancing, sliding-window patch), `IceCreamYou/THREE.Terrain` (SimplexLayers algorithm)

**Sky:**
- Preetham atmospheric model (already implemented)
- Golden hour preset: `turbidity: 3.0, rayleigh: 1.5, mieCoefficient: 0.01, sunElevation: 15°`
- **Steal from:** `Tw1ddle/Sky-Shader` (Preetham with Uncharted2 tonemapping, artist presets)

**Grass:**
- 100K instanced blades (desktop), 4-layer wind deform
- Already implemented — this is the current meadow
- **Steal from:** (already stolen) `Nitash-Biswas/grass-shader-glsl`, `al-ro/grass`

**Flowers:**
- 800 instanced, 6 color types, toon shader
- Already implemented
- **Steal from:** (already stolen) `daniel-ilett/shaders-botw-cel-shading`

**Particles:**
- Fireflies: 500, additive blending, vertical bob, amber `(0.83, 0.79, 0.41)`
- Dust motes: 200, tiny, slow drift
- **Steal from:** (already stolen) `Alex-DG/vite-three-webxr-flowers`

**Post-processing:**
- Bloom: `threshold: 0.5, intensity: 0.6, levels: 8`
- Film grain: `intensity: 0.06, interval: 42ms`
- Vignette: `darkness: 0.6, offset: 0.35`
- CA: `offset: (0.002, 0.001), radialModulation: true`
- Tone mapping: `ACES_FILMIC` (warm)
- LUT: Warm golden hour .cube file (user has S-Log3 LUTs)
- **Steal from:** `pmndrs/postprocessing` (EffectComposer, all effects), `mattdesl/filmic-gl` (combined film stack)

**Score Sheets:**
- 3 sheets floating in wind (Verlet cloth simulation)
- Stiffness: 0.4, dampening: 0.92, gravity: -2.0, constraintIterations: 20
- Structural + shear + bend springs (skip-one neighbors for paper rigidity)
- Wind: `sin(t/5000)*0.3, cos(t/8000)*0.1, sin(t/3000)` — three independent oscillations
- **Steal from:** `cybertiwari/Cloth-Simulation` (full Verlet solver, `assets/app.js`)

**Camera:**
- CatmullRomCurve3 S-curve through field
- Damped lerp: `MathUtils.damp(current, target, 2, delta)`
- Terrain following: `getTerrainHeight(x, z) + 2.0` offset

**Content overlay:**
- LandingContent: Artist name + subtitle (opacity surfacing)
- DOM opacity driven by camera distance: `1.0 - smoothstep(0.03, 0.08, dist)`

---

### 3.2 Ocean Cliff (Music / Listen)

**Emotional temperature:** Peaceful Heartache — "a goodbye where both protagonists know it'd be better to free each other"

**What the viewer feels:** You sit at the edge of something infinite. The ocean is the feeling you can't name. The horizon is the future you can't see. The figure sitting there is you, or Mike, or both.

**Reference image:** `still-ocean-hazy-horizon-muted-calm.png` — muted teal, dissolving horizon

**Terrain:**
- Two-part: cliff geometry + flat ocean plane
- Cliff: SimplexLayers with `Edges(direction=false)` for island edges
- Cliff texture: stone at slopes > 36° (`acos(dot(normal, up)) > 0.628`)
- Cliff grass: sparse, 20K blades (cliff-top only, density map)
- **Steal from:** `IceCreamYou/THREE.Terrain` (SimplexLayers + altitude blending + slope detection)

**Ocean:**
- **Primary approach:** Path B (Stylized) — Ashima simplex noise, binary threshold, cartoon foam
- Plane: 256×256 units, rotated -90° on X
- Colors: `uColorNear: 0x0a2e3d` (dark teal), `uColorFar: 0x050d1a` (deep midnight)
- Foam: `textureSize * 2.8` frequency, `smoothstep(0.08, 0.001)` threshold
- Wave lines: threshold `0.6 ± 0.01 * sin(time * 2.0)` (breathing contours)
- Bob: `sin(time * 1.2) * 0.1` amplitude
- UV vignette: `length(uv - 0.5) * 1.5` for fake depth
- **Steal from:** `thaslle/stylized-water` (vertex + fragment shaders from `src/components/Water/shaders/`)
- **Alternative (Tier 1):** Path A (Reflective) — Three.js `Water` with 4-layer normal maps
  - UV divisors: `103, 107, 8907, 9803, 1091, 1027` (primes prevent tiling)
  - Fresnel: Schlick R0=0.3, exp=3.0
  - `waterColor: 0x000a0f`, `distortionScale: 10` (calm)
  - **Steal from:** `jbouny/ocean` via `three/examples/jsm/objects/Water.js`

**Sky:**
- Preetham dusk preset: `turbidity: 1.5, rayleigh: 0.8, sunElevation: -5°` (below horizon)
- Stars: procedural grid (64×64 per cube face, `pow(random, 6)` brightness, `maxOffset: 0.43` jitter)
- Star fade: `visibility * exp(-skyBrightness * 15.0)`
- **Steal from:** `Nugget8/Three.js-Ocean-Scene` (`shaders/SkyboxShader.js` — complete day/night sky with stars)

**Seated Figure:**
- Static `.glb` model (Blender) — silhouette sitting at cliff edge
- Facing ocean, back to camera (the viewer sees what he sees)
- No animation (stillness IS the statement)
- Cel-shaded: 4-band brightness threshold `[0.6, 0.35, 0.001]`
- **Steal from:** `craftzdog/ghibli-style-shader` (discrete cel shading pipeline)
- **Asset:** Must be created in Blender or sourced from open-source .glb

**Particles:**
- Sea spray: 100 particles, additive, white, fast upward drift near cliff edge
- Fog wisps: 50 particles, large soft sprites, very slow horizontal drift
- **Steal from:** `three.quarks` (BatchedRenderer, soft particles with depth fade)

**Post-processing:**
- Bloom: `threshold: 0.8, intensity: 0.3` (subtle ocean glow)
- Film grain: `intensity: 0.04` (calm)
- Vignette: `darkness: 0.5, offset: 0.3`
- DOF: `focusDistance: figure position, focusRange: 1.5, bokehScale: 1.2` (figure sharp, horizon soft)
- Tone mapping: `AGX` (dreamy)
- LUT: Teal-shifted .cube file
- **Steal from:** `pmndrs/postprocessing` (DOF with Fibonacci spiral bokeh, 80 points)

**Camera:**
- Arc around seated figure, settling into over-shoulder looking at horizon
- Start: behind/above → End: beside, eye level
- Damping: `dampingFactor: 0.5` (very cinematic lag)

**Content overlay:**
- MusicContent: Album cards, streaming links
- Glass-card style, opacity surfacing

**Audio:**
- Ocean ambient (looping wave sounds, volume from scroll)
- Music snippet triggers at emotional peak moment in scroll

---

### 3.3 Night Meadow (About / Story)

**Emotional temperature:** Bittersweet Letting Go — "knowing that someday this pain will be joined with peace"

**What the viewer feels:** The same meadow, but at night. What was golden is now silver-blue. What was wind is now stillness. The fireflies are the only warmth. This is where you learn who made the music that found your locked rooms.

**Terrain:**
- Same SimplexLayers as Golden Meadow (literally the same terrain, different time of day)
- Post-smooth: slightly more aggressive `GaussianBoxBlur(sigma=2.5, 3 passes)` — dreamier
- Color: dark green-blue tint on vertex colors

**Sky:**
- Full night: `glsl-atmosphere` with `iSun: 5.0, pSun: vec3(0, -0.3, -1)` (below horizon)
- Teal tint: `kRlh: vec3(3.0e-6, 18.0e-6, 22.0e-6)` (boost green+blue)
- Stars: Nugget8 procedural stars (`sharpness: 50, size: 10, falloff: 15, visibility: 450`)
- Moon: `sharpness: 12000, size: 5000` — bright tight disk
- **Steal from:** `wwwtyro/glsl-atmosphere` (100-line GLSL function, public domain), `Nugget8/Three.js-Ocean-Scene` (star generation)

**Grass:**
- Tall dark grass, 60K blades (slightly less than meadow)
- Color shift: `uBaseColor: #0a1a0f, uTipColor: #1a3020` (dark blue-green)
- Wind: much slower — `windSpeed: 0.3` (vs 1.0 in meadow)
- No flowers (night blooms are too literal)

**Particles:**
- Fireflies: 800 (more than meadow — they ARE the warmth)
- Color: warm amber `(0.83, 0.79, 0.41)` but brighter `intensity: 2.0`
- Behavior: slower bob, wider drift radius
- Stars above: rendered in sky shader (not particles)

**Post-processing:**
- Bloom: `threshold: 0.6, intensity: 0.5` (fireflies glow strongly)
- Film grain: `intensity: 0.08` (noisier, more filmic)
- Vignette: `darkness: 0.8, offset: 0.3` (heavy edge darkening)
- CA: default (subtle)
- Tone mapping: `UNCHARTED2` (moodier compression)
- LUT: Cool blue-shift .cube file
- **Steal from:** `pmndrs/postprocessing`, `mattdesl/glsl-film-grain` (two-layer simplex+periodic for natural grain)

**Camera:**
- Slow push forward through dark field
- Lower to ground: `terrainHeight + 1.2` (intimate, immersed in grass)
- Very slow scroll speed (longer dwell time)

**Content overlay:**
- AboutContent: Bio text, journey narrative, pull quotes
- Text color: `--text-primary: #c8d4e8` (cool luminance against dark)

**Score Sheets:**
- 2-3 sheets scattered on ground, softly lit from above (moonlight)
- Static (no cloth sim) — placed as found objects
- Ambient glow around edges (emissive rim)

---

### 3.4 Ghibli Painterly (Store / Collect)

**Emotional temperature:** The Fall and Acceptance — "the sun is rising as he is falling, but his life has never felt brighter"

**What the viewer feels:** The world becomes hyper-vivid. Like a memory that's more real than reality. Everything has brushstroke texture. Colors are impossible. This is where the music becomes a physical object you can hold — CDs, merch, score sheets as art.

**Terrain:**
- Stylized rolling hills (same SimplexLayers, lower detail — 3 octaves)
- Cel-shaded ground material: 3-band color quantization
- Moss/grass texture blending: altitude-based `levels: [20, 50, 60, 85]`
- **Steal from:** `IceCreamYou/THREE.Terrain` (onBeforeCompile texture blending shader)

**Sky:**
- Cel-shaded sky dome (not Preetham — hand-painted gradient)
- 3 color bands: zenith blue, mid warm, horizon amber
- Ghibli clouds: flat textured planes with billboarding
- **Steal from:** `craftzdog/ghibli-style-shader` (sky treatment)

**Vegetation:**
- Cel-shaded grass: 40K blades, 4-band brightness shading
- Cel-shaded trees (2-3 background trees, .glb from Blender)
- Flowers: brighter palette `[#4a8d7e, #377f6a, #184f52, #143b36]`
- All foliage uses Ghibli shader: `brightnessThresholds: [0.6, 0.35, 0.001]`
- **Steal from:** `craftzdog/ghibli-style-shader` (complete cel pipeline + GLB model loading)

**Water (optional):**
- Small stylized stream or pond
- Path B (Stylized) — simplex noise, binary threshold, cartoon foam
- **Steal from:** `thaslle/stylized-water`

**Post-processing (THE differentiator):**
- **Kuwahara filter:** `radius: 6, alpha: 25, quantizeLevels: 16, saturation: 1.8`
- Pipeline: TensorPass (Sobel gradients) → KuwaharaPass (anisotropic sampling) → FinalPass (quantization + ACES + saturation boost)
- Bloom: `threshold: 0.5, intensity: 0.6, levels: 8`
- God rays: radial `numSamples: 50, decay: 0.97, exposure: 0.8` (golden hour sun)
- Film grain: `intensity: 0.06` (subtle under Kuwahara)
- LUT: Warm saturated .cube (S-Log3 graded)
- **Steal from:** `MaximeHeckel/blog` (complete 5-stage Kuwahara pipeline), `Erkaman/glsl-godrays` (radial blur)

**Products (the store):**
- Each product (CD, merch item) presented as a 3D object in the painterly world
- Album covers projected onto geometry: `ProjectedMaterial` with saved camera matrix
- Displacement transition between album images: `dispFactor` driven by hover/scroll
- **Steal from:** `marcofugaro/three-projected-material`, `robin-dela/hover-effect` (displacement shader)

**Walking Figure:**
- Distant, small, walking along a path through the painterly world
- Same cel-shading as environment
- Simple walk cycle (4-frame sprite or basic bone animation)
- **Asset:** Must be created in Blender

**Camera:**
- Spiral or orbital path around the store scene
- Products enter view one at a time as camera moves
- Each product gets its own cinematic clearing (per design philosophy: "each album gets its own world")

---

### 3.5 Storm Field (Tour / Witness)

**Emotional temperature:** The Search — "running through whatever obstacles, determined, passionate, led with love"

**What the viewer feels:** Urgency. The wind is loud. The grass is fighting to stand. Rain hits. Lightning illuminates everything for a split second. You're moving faster. Breath comes harder. You're searching for something. The tour dates are the answer — go witness it in person.

**Terrain:**
- DiamondSquare (sharp peaks/valleys) OR Hill accumulation (`freq^2 * 10` features)
- Minimal smoothing (1 pass only) — preserve raw edges
- Dark earth colors, no green
- **Steal from:** `IceCreamYou/THREE.Terrain` (DiamondSquare + Hill algorithms)

**Sky:**
- Overcast: thick clouds, no sun visible
- Dark grey-blue: `HSL(0.6, 0.15, 0.04)` fog matching sky
- Volumetric clouds: Beer Shadow Maps, 4-layer system
- Coverage: `0.7` (heavy overcast)
- Lightning: occasional screen flash (white → decay over 200ms)
- **Steal from:** `takram/three-clouds` (Beer Shadow Maps, multi-layer weather), `glsl-atmosphere` (dark overcast preset)

**Grass:**
- Windswept: 50K blades, `windSpeed: 3.0` (vs 1.0 normal)
- Low to ground, blown flat: `bendStrength: 0.8`
- Dark color: `uBaseColor: #0a0f08, uTipColor: #1a2018`
- No flowers (stripped bare by wind)

**Particles:**
- Rain: 2000 stretched particles (velocity-stretched billboards via three.quarks)
  - `velocityMultiplier: vec3(0.5, -15.0, 0.5)` (fast downward)
  - `lengthFactor: 3.0` (elongated streaks)
- Lightning sparks: 50 particles, burst on lightning event, fast decay
- **Steal from:** `three.quarks` (velocity-stretched billboards, `stretched_bb_particle_vert.glsl`)

**Post-processing:**
- Bloom: disabled or minimal `intensity: 0.1`
- Film grain: `intensity: 0.10` (grainy, stressed)
- Vignette: `darkness: 0.9, offset: 0.25` (darkest edges)
- CA: increased `offset: (0.003, 0.0015)` (lens stress)
- Tone mapping: `UNCHARTED2` (moody, compressed)
- No god rays (overcast)
- **Steal from:** `pmndrs/postprocessing`, `mattdesl/filmic-gl`

**Camera:**
- Urgent forward push — faster scroll-to-movement ratio
- Lower to ground, slight shake (via `Math.sin(time * 30) * 0.02` on camera.position.y)
- Wind direction = camera forward direction (running INTO it)

**Content overlay:**
- TourContent: Dates, venues, ticketing
- Brighter text against dark: high contrast for readability
- Each date appears as a brief flash of clarity in the storm

**Audio:**
- Wind ambient (constant, loud)
- Thunder rumbles (triggered at scroll milestones)
- Music: builds urgency, crescendo toward call-to-action

---

## 4. Transition System (Between Environments)

### Portal Transition Pattern

When navigating between routes, use a GLSL shader transition (not a page reload):

1. Current environment renders to FBO A
2. Target environment begins rendering to FBO B (hidden)
3. Transition shader blends A → B over 1.5 seconds
4. Transition types per route:
   - Meadow → Ocean: **fade through fog** (white → teal)
   - Meadow → Night: **fade through darkness** (dim → black → moonlit)
   - Meadow → Ghibli: **brush stroke dissolve** (Kuwahara edge detection as mask)
   - Meadow → Storm: **lightning flash** (white screen → new scene)
   - Any → Meadow (home): **reverse of entry transition**

**Steal from:** `gl-transitions/gl-transitions` (80+ GLSL transition shaders, MIT license)

### Route Architecture

```javascript
// React Router with transition wrapper
<Routes>
  <Route path="/" element={<EnvironmentScene env="golden-meadow" />} />
  <Route path="/listen" element={<EnvironmentScene env="ocean-cliff" />} />
  <Route path="/story" element={<EnvironmentScene env="night-meadow" />} />
  <Route path="/collect" element={<EnvironmentScene env="ghibli-painterly" />} />
  <Route path="/witness" element={<EnvironmentScene env="storm-field" />} />
</Routes>

// EnvironmentScene loads the appropriate:
// - Terrain generator
// - Sky preset
// - Vegetation config
// - Particle system
// - Post-processing stack
// - Camera path
// - Content overlay
// - Audio layer
```

---

## 5. Repo Extraction Map (What to Clone, What to Steal)

### Priority 1: Clone and Extract Immediately

| Repo | Stars | Clone For | Exact Files |
|------|-------|-----------|-------------|
| `thaslle/stylized-water` | — | Ocean Cliff water shader | `src/components/Water/shaders/vertex.glsl`, `fragment.glsl` |
| `craftzdog/ghibli-style-shader` | — | Ghibli environment cel shading | `src/GhibliShader.js` (4-band threshold shader) |
| `Nugget8/Three.js-Ocean-Scene` | — | Sky with stars, day/night, Beer's law | `shaders/Settings.js`, `SkyboxShader.js`, `OceanMaterial.js` |
| `IceCreamYou/THREE.Terrain` | 841 | Terrain generation algorithms | `THREE.Terrain.js` (SimplexLayers, DiamondSquare, Hill, texture blending) |
| `cybertiwari/Cloth-Simulation` | — | Score sheet cloth physics | `assets/app.js` (full Verlet solver) |
| `MaximeHeckel/blog` | — | Kuwahara painterly post-processing | `core/components/MDX/Widgets/PainterlyShaders/final.ts` |
| `Erkaman/glsl-godrays` | — | God rays for golden hour/Ghibli | `index.glsl` (radial blur algorithm) |

### Priority 2: Clone for Reference

| Repo | Clone For | Exact Files |
|------|-----------|-------------|
| `gl-transitions/gl-transitions` | Route transition shaders | `transitions/` (80+ GLSL files) |
| `robin-dela/hover-effect` | Album art displacement reveals | `src/hover-effect.js` (complete shader) |
| `marcofugaro/three-projected-material` | Album art projected onto 3D | `src/ProjectedMaterial.js` |
| `nytimes/three-story-controls` | Camera rig Body/Head/Eyes | `src/CameraRig.ts`, `src/controlschemes/ScrollControls.ts` |
| `Alchemist0823/three.quarks` | Rain particles, soft particles | `src/shaders/stretched_bb_particle_vert.glsl`, `soft_fragment.glsl` |
| `mattdesl/glsl-film-grain` | Natural two-layer grain | Main shader file (simplex + periodic) |
| `wwwtyro/glsl-atmosphere` | Night sky atmosphere | `index.glsl` (100-line ray-march function) |
| `takram/three-clouds` | Storm clouds (Beer Shadow Maps) | Cloud density + BSM shaders |

### Priority 3: Already Extracted (in `research/extractions/`)

| Extraction | Used In |
|------------|---------|
| `al-ro-grass.md` | All environments with grass |
| `grass-shader-glsl-nitash.md` | 4-layer wind deform |
| `three-grass-demo.md` | Cloud shadow UV scrolling |
| `pmndrs-postprocessing.md` | All post-processing stacks |
| `filmic-gl.md` | Film grain + lens distortion |
| `glsl-atmosphere.md` | Night sky, storm sky |
| `sky-shader.md` | Preetham presets |
| `terra.md` | GPU grass instancing + terrain |
| `ShaderParticleEngine.md` | High-count particles |
| `jongleur.md` | Damped scroll progress |

---

## 6. Magic Values Quick Reference (Per Environment)

| Property | Golden Meadow | Ocean Cliff | Night Meadow | Ghibli Painterly | Storm Field |
|----------|--------------|-------------|--------------|-----------------|-------------|
| **Sky turbidity** | 3.0 | 1.5 | N/A (below horizon) | N/A (cel dome) | 8.0 |
| **Sky rayleigh** | 1.5 | 0.8 | N/A | N/A | 0.5 |
| **Sun elevation** | 15° | -5° (below) | -30° (deep night) | 25° (bright) | 5° (low, obscured) |
| **Fog near/far** | 15 / 120 | 20 / 200 | 10 / 80 | 25 / 150 | 15 / 60 (tight) |
| **Fog color** | `#1a1208` warm | `#050d1a` teal | `#0a0a12` blue-black | `#1a2018` green | `#0a0a0f` dark grey |
| **Grass count** | 100K | 20K (cliff only) | 60K | 40K (cel-shaded) | 50K |
| **Wind speed** | 1.0 | 0.5 | 0.3 | 0.8 | 3.0 |
| **Firefly count** | 500 | 0 | 800 | 0 | 0 |
| **Bloom threshold** | 0.5 | 0.8 | 0.6 | 0.5 | disabled |
| **Bloom intensity** | 0.6 | 0.3 | 0.5 | 0.6 | 0 |
| **Grain intensity** | 0.06 | 0.04 | 0.08 | 0.06 | 0.10 |
| **Vignette darkness** | 0.6 | 0.5 | 0.8 | 0.6 | 0.9 |
| **CA offset** | (0.002, 0.001) | default | default | (0.002, 0.001) | (0.003, 0.0015) |
| **Tone mapping** | ACES_FILMIC | AGX | UNCHARTED2 | ACES_FILMIC | UNCHARTED2 |
| **Dominant color** | Amber/gold | Teal/midnight | Blue-silver | Saturated green | Dark grey |

---

## 7. Asset Requirements

### 3D Models (Blender → .glb)

| Asset | Environment | Notes |
|-------|-------------|-------|
| Seated figure (silhouette) | Ocean Cliff | Back to camera, facing ocean, no face detail needed |
| Walking figure (distant) | Ghibli Painterly | Simple walk cycle, cel-shaded, small on screen |
| Cliff geometry | Ocean Cliff | Rocky cliff edge, ~50 units wide, textured stone |
| Rock formations | Ocean Cliff | 3-5 scattered rocks near cliff edge |
| Stylized trees (2-3) | Ghibli Painterly | Ghibli-style foliage, 4-band cel shading |
| Score sheet mesh | All | Flat plane geometry, UV-mapped for handwritten score texture |

### Textures

| Texture | Source | Used In |
|---------|--------|---------|
| Grass blade alpha | Create procedurally OR steal from `al-ro/grass` | All grass environments |
| Cloud FBM noise | Already have: `assets/textures/cloud.jpg` | Cloud shadows |
| Normal map (ocean) | `three/examples/textures/waternormals.jpg` | Ocean Cliff (Path A) |
| Score sheet photo | Real photograph of Mike's handwritten score | All environments |
| Stone/cliff texture | Open source OR Blender procedural | Ocean Cliff terrain |
| LUT files (.cube) | User's S-Log3 LUT collection + new per-env variants | All environments |
| Displacement map | Perlin noise texture (for album art reveals) | Ghibli Painterly store |
| Rain streak texture | Elongated white gradient | Storm Field |

### Audio

| Sound | Environment | Type |
|-------|-------------|------|
| Music snippet (landing) | Golden Meadow | Mike's composition, triggers at scroll peak |
| Ocean ambient | Ocean Cliff | Looping wave sounds |
| Night ambient | Night Meadow | Crickets, distant wind, silence |
| Music (full piece) | All | Available via MiniPlayer throughout |
| Wind ambient | Storm Field | Constant, layered gusts |
| Thunder rumbles | Storm Field | Triggered at scroll milestones |

---

## 8. Performance Budget

| Environment | Desktop Target | Laptop Target | Mobile Fallback |
|-------------|---------------|---------------|-----------------|
| Golden Meadow | 60fps, 100K grass | 30fps, 30K grass | Static screenshot |
| Ocean Cliff | 60fps, reflective water | 30fps, stylized water | Static screenshot |
| Night Meadow | 60fps, 800 fireflies | 30fps, 200 fireflies | Static screenshot |
| Ghibli Painterly | 30fps (Kuwahara expensive) | 20fps or disable Kuwahara | Static screenshot |
| Storm Field | 60fps, 2000 rain | 30fps, 500 rain | Static screenshot |

**Draw call budget per environment:** ≤ 15 (grass chunks count as 1 each via instancing)

**prefers-reduced-motion:** Every environment must have a static fallback. Freeze camera, disable particles, show single frame with content visible.

---

## 9. Implementation Order

1. **Refactored engine lands** (other window completes refactoring)
2. **Abstract shared vs per-env configs** (EnvironmentScene component, config objects)
3. **Golden Meadow polish** (improve existing terrain with SimplexLayers, add cloth score sheets)
4. **Ocean Cliff** (highest visual impact, recreates reference image)
5. **Night Meadow** (reuses meadow terrain, lowest new geometry)
6. **Storm Field** (reuses terrain generation, adds rain particles)
7. **Ghibli Painterly** (most complex post-processing, last)
8. **Transition system** (gl-transitions between routes)
9. **Real content** (actual album art, bio text, tour dates, products)
10. **Mobile fallbacks** (static screenshots per environment)

---

## 10. Success Criteria

- [ ] Each environment loads in < 3 seconds on desktop
- [ ] Each environment feels emotionally distinct (not just a color swap)
- [ ] The "sitting at ocean" reference image is recognizable in env-2
- [ ] Transitions between environments feel cinematic (not jarring)
- [ ] Music plays continuously across route changes (MiniPlayer persists)
- [ ] prefers-reduced-motion works in all 5 environments
- [ ] User can browse all 5 and say "this is the one" for each section
- [ ] Score sheets appear as physical objects in the world, not UI elements
- [ ] No environment feels like a template — each has personality
- [ ] The emotional atlas descriptions feel true when experienced
