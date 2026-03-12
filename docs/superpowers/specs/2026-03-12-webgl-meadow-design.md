# MKS WebGL Meadow — Design Specification

**Date:** 2026-03-12
**Status:** Draft (pending spec review)
**Scope:** Full site rebuild — scroll-driven 3D flower field replacing all existing sections

---

## 1. Vision

Replace the entire MKS website with a single, continuous 3D meadow rendered in WebGL. The user scrolls to move a camera along a winding path through a Breath of the Wild-style golden hour flower field. Content sections (Landing, Music, About, Store, Footer) are clearings in the meadow, revealed by fog as the camera approaches.

**Reference site:** [unseen.co](https://unseen.co) — 3D spatial positioning, Z-axis scroll, fog reveal, content as spatial nodes.

**Aesthetic:** BotW golden hour — warm directional light, stylized shading, atmospheric haze, dense swaying grass, cloud shadows, firefly particles. The dark cinematic identity (typography, glass panels, the music) lives in the content, not the scene lighting.

---

## 2. Architecture

### System Layers

```
┌─────────────────────────────────────────────────┐
│  React DOM Layer (z-index: 10)                  │
│  ├── Nav (minimal, fixed top)                   │
│  ├── ContentSections (positioned by scroll %)   │
│  │   ├── LandingContent (title, subtitle)       │
│  │   ├── MusicContent (album art, tracklist)    │
│  │   ├── AboutContent (bio, narrative)          │
│  │   ├── StoreContent (products)                │
│  │   └── FooterContent (links, credits)         │
│  └── MiniPlayer (fixed bottom)                  │
├─────────────────────────────────────────────────┤
│  Three.js Canvas (z-index: 0, full viewport)    │
│  ├── MeadowScene                                │
│  │   ├── SkyDome (gradient + sun position)      │
│  │   ├── DirectionalLight (golden hour angle)   │
│  │   ├── GrassChunkManager                      │
│  │   │   └── chunks[] (InstancedMesh, 20K each) │
│  │   ├── FlowerInstances (6 types, ~1K total)   │
│  │   ├── FireflyParticles (Points + shader)     │
│  │   ├── CloudShadowPlane (scrolling noise tex)  │
│  │   └── TerrainPlane (subtle rolling hills)    │
│  ├── CameraRig                                  │
│  │   ├── CatmullRomCurve3 (S-curve spline)     │
│  │   └── damped lerp to scroll position         │
│  └── PostProcessing (EffectComposer)            │
│       ├── UnrealBloomPass                       │
│       ├── FogPass (custom, depth-based)         │
│       ├── GodRayPass (from sun position)        │
│       ├── FilmGrainPass (custom shader)         │
│       ├── VignettePass                          │
│       ├── ColorGradingPass (BotW warm LUT)      │
│       ├── BokehPass (DOF)                       │
│       └── ChromaticAberrationPass               │
├─────────────────────────────────────────────────┤
│  Scroll Engine                                  │
│  ├── Lenis (smooth scroll with damping)         │
│  ├── scrollProgress (0→1 normalized)            │
│  ├── → Camera position on spline               │
│  └── → Content section visibility/transforms    │
└─────────────────────────────────────────────────┘
```

### Framework Choices

- **3D Engine:** Vanilla Three.js (not React Three Fiber). Direct render loop, raw GLSL shaders.
- **Content Layer:** React DOM on top of WebGL canvas. HTML for text, nav, player.
- **Scroll:** Lenis smooth scroll → maps to camera Z-position along CatmullRomCurve3 spline.
- **Post-processing:** pmndrs/postprocessing library + custom shaders.
- **Approach:** Start with single-scene + spatial chunking (Approach A). Architect clean interfaces (renderToTarget, compositable post-processing) so it can evolve to layered render targets (Approach B) later.

### Key Interfaces (Approach B-ready)

- `MeadowScene.renderToTarget(target)` — today renders to screen, later to a WebGLRenderTarget
- `PostProcessing` accepts array of input textures — today one, later composites multiple
- `ScrollEngine` is standalone, emits normalized progress — consumed by both Three.js and React independently

---

## 3. Camera Path

**Type:** Winding S-curve through the meadow (not linear Z-axis).

**Implementation:** `THREE.CatmullRomCurve3` with control points defining a gentle S-curve. Scroll progress (0→1) maps to position on the spline via `curve.getPoint(t)`. Camera `lookAt` targets slightly ahead: `curve.getPoint(t + 0.01)`.

**Damping:** Lenis damping at 0.1 (heavy, cinematic). Camera position lerps to target with factor 0.05 (buttery).

**Height:** Eye-level in the grass. Camera starts low in dense flowers, maintains roughly constant height through the journey.

**Content clearings:** At 5 points along the spline, the grass thins into clearings where content sections are positioned. Each clearing is a "money moment" with its own spatial character.

### Content Section Positions (approximate Z-depths)

| Section | Spline t | Character |
|---------|----------|-----------|
| Landing | 0.0–0.15 | Dense flowers, title emerges from fog |
| Music | 0.20–0.35 | Clearing with floating glass panels |
| About | 0.40–0.55 | Deeper in field, warmer light |
| Store | 0.65–0.80 | Golden hour intensifies |
| Footer | 0.85–1.0 | Field thins, minimal nav |

---

## 4. Rendering: Hybrid Grass + Flowers + Particles

### Grass Field (100K+ instanced blades)

**Primary source:** [Nitash-Biswas/grass-shader-glsl](https://github.com/Nitash-Biswas/grass-shader-glsl)

- Geometry: Procedural tapered triangle strip (7 segments near, 1 segment far via LOD)
- LOD threshold: Blades within 15 world units of camera use 7-segment mesh; beyond 15 units use 1-segment
- Instancing: `THREE.InstancedMesh` × 2 (high/low detail) managed by `GrassChunkManager`
- Wind: 4-layer GLSL system from the repo's `deform()` function:
  1. Static bezier bend (per-instance hash)
  2. Gentle sin sway (per-instance timing offset)
  3. Strong Perlin noise wind gusts (world-space scrolling)
  4. Billboard rotation to face camera
- Normals: Deform called 3× for post-deformation normal recalculation + fake curved normals
- Colors: Base-to-tip gradient via `smoothstep(0.2, 1.0, vElevation)`. BotW warm greens.

### GrassChunkManager Strategy

- **Chunk size:** 20×20 world units (each chunk holds ~20K grass instances)
- **Active window:** 3 chunks ahead of camera + 1 behind (4 active at any time = ~80K blades visible)
- **Activation:** Chunks activate when their center is within `chunkSize * 3` of camera position along the spline
- **Disposal:** Chunks are disposed when camera has passed them by more than `chunkSize * 1.5`
- **Pop-in prevention:** New chunks fade in over 0.5s by animating blade scale from 0→1 via a per-chunk uniform
- **Frustum culling:** Three.js built-in frustum culling on each chunk's bounding box (InstancedMesh respects this)
- **Pool:** Pre-allocate 6 chunk slots and recycle geometry buffers (no GC pressure from allocation/disposal)

**Secondary patterns stolen from:**
- [James-Smyth/three-grass-demo](https://github.com/James-Smyth/three-grass-demo) — vertex color animation weights, cloud shadow UV scrolling
- [spacejack/terra](https://github.com/spacejack/terra) — terrain integration, heightmap-driven wind, depth-based fog alpha, translucent grass lighting (`abs(dot(normal, lightDir))`)
- al-ro grass — ACES tonemapping, iquilezles height-dependent fog, infinite world tiling

### Stylized Flowers (~1K, 6 types)

**Source:** [Alex-DG/vite-three-webxr-flowers](https://github.com/Alex-DG/vite-three-webxr-flowers) for GLTF loading + placement pattern.

- 6 flower types: daisy, poppy, marigold, cornflower, buttercup, wildgrass
- Loaded as `.glb` models, instanced via clone() + random placement
- Wind: Share vertex shader deformation from grass system (adapted for flower geometry)
- Toon shading on flowers: [daniel-ilett/shaders-botw-cel-shading](https://github.com/daniel-ilett/shaders-botw-cel-shading) patterns ported to GLSL. Step function lighting, 2-3 tone bands, rim lighting.
- Reference: [maya-ndljk.com toon shader tutorial](https://www.maya-ndljk.com/blog/threejs-basic-toon-shader) for Three.js-specific implementation.

### Firefly Particles

**Source:** [Alex-DG/vite-three-webxr-flowers](https://github.com/Alex-DG/vite-three-webxr-flowers) — `FirefliesMaterial.js`, vertex.glsl, fragment.glsl.

- Entire `FirefliesMaterial` class stolen directly
- Point particles with additive blending, depthWrite: false
- Vertex: gentle vertical bob via `sin(time + worldPos.x * 100.0) * aScale * 0.2`
- Fragment: radial glow via inverse distance `0.05 / distanceToCenter - 0.1`
- Adaptations: color white → warm amber, count 250 → 500, spread per-chunk, height-constrained to low in grass

---

## 5. Environment

### Sky Dome

**Source:** [Three.js built-in Sky shader](https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_sky.html) — Preetham atmospheric scattering model.

- Sun elevation: ~10-15° (golden hour angle)
- Turbidity: 8-10 (warm atmospheric haze)
- Rayleigh scattering: 2-3 (amber tones)
- Sun position locked (no day cycle animation)

Additional reference: [Tw1ddle/Sky-Shader](https://github.com/Tw1ddle/Sky-Shader) for parameter tuning.

### Cloud Shadows

**Source:** [James-Smyth/three-grass-demo](https://github.com/James-Smyth/three-grass-demo) — `grass.frag.glsl` cloudUV scrolling technique.

```glsl
cloudUV.x += iTime / 20000.;  // glacial speed (floaty contemplativeness)
cloudUV.y += iTime / 10000.;
color = mix(color, texture2D(cloudTexture, cloudUV).rgb, 0.25);  // subtle blend
```

### Terrain

**Source:** [spacejack/terra](https://github.com/spacejack/terra) — `terrain.ts`, heightfield generation, grass-on-terrain placement.

- Gentle rolling hills (not flat plane)
- Clearings at content section positions (grass and flower density reduced to near-zero — both thin out together)
- Terrain color matches grass base color to hide edges

### Golden Hour Color Reference (from fetched repos)

| Element | Color Values |
|---------|-------------|
| Light | `vec3(1.0, 1.0, 0.99)` (spacejack/terra) |
| Fog | `vec3(0.74, 0.77, 0.91)` (spacejack/terra) |
| Sun glare | `vec3(1.0, 0.8, 0.4)` (spacejack/terra) |
| Grass base | `vec3(0.45, 0.46, 0.19)` (spacejack/terra) |
| Near-sun haze | `vec3(1.0, 1.0, 0.75)` (al-ro) |
| Far-sun haze | `vec3(0.35, 0.5, 0.9)` (al-ro) |
| Specular | `vec3(1.0, 1.0, 0.0)` yellow (spacejack/terra) |

---

## 6. Post-Processing Stack

**Primary source:** [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing) — all effects merged into single `EffectPass` for performance.

| Effect | Source | Parameters |
|--------|--------|-----------|
| Bloom | pmndrs `BloomEffect` | Subtle, warm. Flower petals + fireflies glow. |
| Fog | Custom depth shader (spacejack/terra pattern) | 3-zone: near sharp, mid golden haze, far desaturated |
| God Rays | [Ameobea/three-good-godrays](https://github.com/Ameobea/three-good-godrays) | Light source = sky sun position, warm amber tint |
| Film Grain | pmndrs `NoiseEffect` | Opacity 0.03 (matches existing site). GPU shader, not canvas overlay. |
| Vignette | pmndrs `VignetteEffect` | Matches existing radial gradient |
| Color Grading | pmndrs `LUT3DEffect` + [.cube loader gist](https://gist.github.com/rc1/433177bd0c2ce38fcccd) | BotW golden hour `.cube` LUT file — to be created in DaVinci Resolve (or equivalent) as a build asset at `src/assets/luts/botw-golden-hour.cube` |
| DOF | Three.js `BokehPass` | Close flowers sharp, distant field softly blurred |
| Chromatic Aberration | pmndrs `ChromaticAberrationEffect` | Very subtle (0.001). Increases during transitions. |

**Cinematic Imperfection principle:** "Don't use film grain as texture overlay instead of shader (looks fake)." Current canvas grain → GPU shader.

**Scroll-reactive:** CA increases during camera movement, DOF focus distance tracks camera-to-content distance, bloom intensifies near content clearings.

---

## 7. Scroll Engine

**Source:** [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis)

```
Lenis.on('scroll') → scrollProgress (0→1)
  → CameraRig: curve.getPoint(lerp(currentT, targetT, 0.05))
  → ContentSections: opacity = smoothstep(fadeOut, fadeIn, abs(cameraT - sectionT))
    // fadeIn = 0.03 (content fully visible within 3% scroll of section center)
    // fadeOut = 0.08 (content fades out 8% scroll away from section center)
  → PostProcessing: CA intensity = scrollVelocity * 0.001
  → useScrollAudio: volume = f(scrollProgress) (adapted from existing hook)
```

**Scroll as Rhythm principle:** "Scrub, don't trigger. Stop-means-stop." Camera position is directly mapped to scroll, not triggered animations.

Additional scroll patterns from:
- [fireship-io/threejs-scroll-animation-demo](https://github.com/fireship-io/threejs-scroll-animation-demo) — scroll-to-spline mapping
- [vaneenige/scroll-transitions-webgl](https://github.com/vaneenige/scroll-transitions-webgl) — DOM ↔ WebGL sync pattern

---

## 8. Content Overlay (React DOM)

**Pattern:** unseen.co — HTML navigation/content overlaid on WebGL canvas.

- Canvas is `position: fixed; inset: 0; z-index: 0`
- React DOM content is `position: absolute; z-index: 10`
- Content sections fade in/out based on camera proximity to their Z-position
- Glass card styling from existing `App.css` preserved
- Typography: Birch Std (titles), PT Serif (body) — unchanged

**Existing code that survives:**
- `MiniPlayer.jsx` + `MiniPlayer.css` — keeps working as-is (DOM layer)
- `MoonlightCursor.jsx` — keeps working as-is (DOM layer, z-index above everything)
- `App.css` glass card styles — preserved for content panels
- `useScrollAudio.js` — adapted to consume Lenis scroll progress:
  - **Interface:** `useScrollAudio(scrollProgress: number)` where `scrollProgress` is the 0→1 float emitted by the ScrollEngine
  - **Contract:** ScrollEngine calls `lenis.on('scroll', ({ progress }) => ...)` and stores `progress` in a shared ref/store. `useScrollAudio` reads that ref on each frame via `requestAnimationFrame`, not via event subscription (avoids duplicate listeners)
  - **Behavior:** Volume ramps from 0 at progress < 0.05 to full at progress > 0.15 (adapted from existing wave-based ramp)

**Existing code replaced:**
- `FlowerField.jsx` → `GrassChunkManager` + `FlowerInstances`
- `LandingSection.jsx` → Camera spline + content overlay
- `Overlays.jsx` (canvas grain/vignette) → GPU post-processing shaders
- `FlowerVisual.jsx` → No longer needed (entire site is the meadow)

---

## 9. Taste Principles Governing the Design

All from the taste library (local path: `/Users/johnnysheng/portpoo/resources/taste-notes/`, referenced for design rationale — not a runtime dependency):

| Principle | File | What It Controls |
|-----------|------|-----------------|
| Tunnel Not Scroll | `visual/tunnel-not-scroll.md` | Z-axis camera movement, no vertical scroll |
| Fog Proximity Reveal | `visual/fog-proximity-reveal.md` | Content sections emerge from haze as camera approaches |
| Atmospheric Separation | `visual/atmospheric-separation.md` | 3-zone fog (near sharp, mid hazy, far desaturated) |
| Choreographed Camera Dance | `visual/choreographed-camera-dance.md` | S-curve spline with lookAt ahead of position |
| Cinematic Imperfection | `visual/cinematic-imperfection.md` | Entire post-processing stack (grain, CA, DOF, bloom) |
| Scroll as Rhythm | `interaction/scroll-as-rhythm.md` | Scrub-based, stop-means-stop, discrete beats |
| Generative Calm | `visual/generative-calm.md` | Pure meadow between content = breathing room |
| Spatial Storytelling | `visual/spatial-storytelling.md` | World not slides, continuous camera path |
| Signal Through Noise | `visual/signal-through-noise.md` | Content partially obscured by foreground grass |
| Selective Illumination | `visual/selective-illumination.md` | Golden hour light as narrative focus tool |

**Taste Profile axes applied:**
- **Floaty Contemplativeness:** Slow wind, lazy fireflies, heavy camera damping (0.1)
- **Camera as Character:** S-curve path makes camera feel alive, not a viewport
- **Destruction as Aesthetic:** Film grain, CA, vignette — camera "struggles" to capture beauty
- **Mathematical Legitimacy:** Perlin noise, CatmullRom splines, instanced geometry — real math, not keyframes
- **Money Moment:** Each content clearing is a peak; meadow between is buildup

---

## 10. Performance & Mobile

### Performance Targets

| Tier | GPU | Grass Count | Post-FX | FPS Target |
|------|-----|-------------|---------|------------|
| Tier 1 (desktop) | Dedicated GPU | 100K+ | All 8 effects | 60fps |
| Tier 2 (laptop) | Integrated GPU | 30K | No DOF, no god rays, lighter bloom | 45fps |
| Tier 3 (mobile) | Mobile GPU | 0 (static image) | CSS filters only | 30fps |

### Detection

```js
function detectTier(renderer, cores, width) {
  // Tier 3: Mobile — no WebGL
  if (width <= 768 || !renderer.capabilities.isWebGL2) return 3;

  // Tier 2: Integrated GPU / low-end laptop
  const maxTexSize = renderer.capabilities.maxTextureSize;
  if (cores <= 4 || maxTexSize <= 4096 || width <= 1366) return 2;

  // Tier 1: Desktop with dedicated GPU
  return 1;
}
```

**Decision logic:**
- **Tier 3** if screen ≤ 768px (phone/small tablet) OR no WebGL2 support
- **Tier 2** if ≤ 4 CPU cores (integrated GPU likely) OR max texture size ≤ 4096 OR screen ≤ 1366px (laptop)
- **Tier 1** otherwise (dedicated GPU, large screen, ≥ 6 cores)

### Mobile Fallback (Tier 3)

Static golden-hour photograph/render as background + CSS parallax content sections. No WebGL. Same content overlay system, same typography, same glass cards. A beautiful poster version.

### `prefers-reduced-motion`

All wind/particle animation stops. Static meadow. Content sections still scroll-positioned. Camera stays fixed or jumps without animation.

---

## 11. New Dependencies

```bash
npm install three              # core 3D engine
npm install lenis              # smooth scroll (darkroomengineering)
npm install postprocessing     # pmndrs post-fx (bloom, grain, CA, vignette, DOF, LUT)
npm install three-good-godrays # screen-space godrays
```

Everything else is raw GLSL stolen from the repos listed in this spec.

---

## 12. Reference Code Index

All reference source code saved to `docs/webgl-reference/`:

| File | Source Repo | What It Contains |
|------|-------------|-----------------|
| `spacejack-terra--grass.vert.glsl` | spacejack/terra | Wind via heightmap, translucent lighting, AO |
| `spacejack-terra--grass.frag.glsl` | spacejack/terra | Depth fog alpha, terrain lightmap |
| `spacejack-terra--grass.ts` | spacejack/terra | InstancedBufferGeometry setup, blade geometry |
| `spacejack-terra--terrain.vert.glsl` | spacejack/terra | Heightmap vertex displacement |
| `spacejack-terra--terrain.frag.glsl` | spacejack/terra | Grass/dirt blending by altitude |
| `spacejack-terra--terrain.ts` | spacejack/terra | Terrain mesh generation |
| `spacejack-terra--water.vert.glsl` | spacejack/terra | Water plane pass-through |
| `spacejack-terra--water.frag.glsl` | spacejack/terra | Inverted skydome reflection |
| `spacejack-terra--world.ts` | spacejack/terra | Scene orchestration, fog/light colors |
| `spacejack-terra--heightfield.ts` | spacejack/terra | CPU heightfield from image |
| `al-ro--grass.js` | al-ro grass | 100K instances, ACES tonemapping, iquilez fog |
| `daniel-ilett--BotWGrass.shader` | daniel-ilett | BotW tessellation + geometry shader |
| `toon-shader-threejs.glsl` | maya-ndljk.com | Toon vertex + fragment with shadow integration |

| `nitash-biswas--grass-vertex.glsl` | Nitash-Biswas/grass-shader-glsl | 4-layer wind deform(), the primary grass shader |
| `nitash-biswas--grass-fragment.glsl` | Nitash-Biswas/grass-shader-glsl | Grass fragment: base-to-tip color gradient |
| `nitash-biswas--grass-setup.jsx` | Nitash-Biswas/grass-shader-glsl | InstancedMesh setup, blade geometry generation |
| `james-smyth--grass.vert.glsl` | James-Smyth/three-grass-demo | BotW vertex color wind animation |
| `james-smyth--grass.frag.glsl` | James-Smyth/three-grass-demo | Cloud shadow UV scrolling, grass coloring |
| `james-smyth--grass-setup.js` | James-Smyth/three-grass-demo | Merged geometry setup, scene composition |
| `alex-dg--fireflies-material.js` | Alex-DG/vite-three-webxr-flowers | Full FirefliesMaterial class |
| `alex-dg--fireflies-vertex.glsl` | Alex-DG/vite-three-webxr-flowers | Firefly point particle vertex shader |
| `alex-dg--fireflies-fragment.glsl` | Alex-DG/vite-three-webxr-flowers | Firefly radial glow fragment shader |
| `alex-dg--experience.js` | Alex-DG/vite-three-webxr-flowers | Scene orchestration, GLTF flower loading |

---

## 13. Design Philosophy Reconciliation

This design **departs from** the original MKS design docs in key ways:

| Original Design Doc Rule | New Direction | Justification |
|--------------------------|---------------|---------------|
| 85% dark / 15% light | Full BotW golden hour | Dark identity lives in content (typography, glass, music), not scene lighting |
| `--void` (#0a0a0a) primary BG | Golden sky + warm green field | The meadow IS the brand world; void exists between content sections as fog |
| Teal = audience, Amber = artist | Amber dominates (golden hour), Teal in content UI | Scene lighting is inherently amber; teal reserved for interactive elements |
| `--red-felt` used exactly once | Preserved — red accent in Footer clearing | Footer clearing at dusk could be the single red moment |
| Nothing pops in, everything surfaces | **Preserved** — fog proximity reveal IS surfacing | Core principle directly mapped to Fog Proximity Reveal taste note |
| Film grain + vignette always on | **Preserved** — GPU shaders instead of canvas | Moved from canvas overlay to post-processing pipeline |
| prefers-reduced-motion fallbacks | **Preserved** — static meadow fallback | All animation stops, content still accessible |

---

*Spec written 2026-03-12. Pending spec review and user approval.*
