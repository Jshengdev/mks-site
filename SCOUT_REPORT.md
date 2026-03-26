# Scout Report — MKS Immersive Music Site

**Generated:** 2026-03-26
**Branch:** main
**Commit count:** 140 (1 tag: v0.1.0-meadow-stable)

---

## Codebase Summary

| Metric | Value |
|--------|-------|
| **Language** | JavaScript (JSX), GLSL, CSS |
| **Framework** | React 19 + Vite 7 + Three.js vanilla (no R3F) |
| **Total LOC** | ~28,000 (15,500 engine JS, 4,900 GLSL, 3,900 configs, 2,700 React/CSS) |
| **Source files** | ~100 JS/JSX, ~99 GLSL shaders, 18 environment configs, 6 CSS |
| **Build time** | 1.42s (260 modules) |
| **JS bundle** | 1,358 KB (360 KB gzip) — single chunk, no code splitting |
| **Dependencies** | 8 runtime (2 unused: n8ao, three-good-godrays), 8 dev (3 unnecessary) |
| **ESLint errors** | 98 total (80 vendored reference code, 18 in src/) |
| **Maturity** | Late prototype — 17 worlds built, engine functional, no tests, no production deploy |

---

## Structure Map

```
src/
  App.jsx                        Root composition — WorldProvider + entry gate + routing
  EnvironmentScene.jsx            React↔WorldEngine bridge — lifecycle, tier fallback
  WorldContext.jsx                 Global state — world navigation, AudioContext, transitions
  MiniPlayer.jsx + .css            Music-as-router — track selection = world navigation
  MoonlightCursor.jsx             Custom cursor effect
  WorldNav.jsx + .css              World list navigation UI
  SiteLinks.jsx + .css             External links
  DevTuner.jsx + .css              Live parameter panel (backtick toggle)
  useScrollAudio.js               Scroll progress → audio volume ramp
  useWorldTransition.js           GLSL transition hook (currently unused)
  index.css                       Global reset + Lenis CSS

  entry/
    EntryPage.jsx + .css           Canvas 2D dithered flower, audio context gate

  content/
    ContentOverlay.jsx + .css      Scroll-driven DOM section opacity
    LandingContent.jsx             Title + subtitle (placeholder)
    MusicContent.jsx               Glass card (placeholder)
    AboutContent.jsx               Glass card (placeholder)
    StoreContent.jsx               Glass card (placeholder)
    FooterContent.jsx              Copyright

  environments/                    17 pure data configs (no Three.js imports)
    golden-meadow.js               Landing world — rolling hills, golden hour
    ocean-cliff.js                 Cliff + ocean, dusk DOF
    night-meadow.js                Same terrain at night, fireflies, moon
    storm-field.js                 Diamond-square, rain, lightning, volumetric clouds
    ghibli-painterly.js            Cel-shading, Kuwahara, petals
    aurora-tundra.js               Frozen tundra, aurora curtain, footprints
    bioluminescent-deep.js         Ocean floor, jellyfish, anglerfish, marine snow
    clockwork-forest.js            Gear trees, steam, copper leaves
    crystal-cavern.js              Crystals, prismatic dispersion, mushrooms
    floating-library.js            Cloud floor, Escher shelves, floating books
    infinite-staircase.js          Void, floating platforms, portal doors
    memory-garden.js               Dissolving flowers, wilting grass, fog wisps
    paper-world.js                 Flat-shaded, origami grass, fold lines
    sonic-void.js                  No terrain, audio-reactive geometry
    tide-pool.js                   Concave basin, anemones, caustics, macro DOF
    underwater-cathedral.js        Nave with pillars, kelp, coral, fish schools
    volcanic-observatory.js        Caldera, lava lake, embers, heat distortion
    index.js                       Environment registry + track list builder

  meadow/                          Three.js engine (vanilla, class-based)
    WorldEngine.js (988 LOC)       Config-driven orchestrator — 46+ conditional subsystems
    AtmosphereController.js (672)  5-keyframe scroll interpolation, 45 params each
    PostProcessingStack.js         14-effect EffectComposer chain
    CameraRig.js                   CatmullRom spline + terrain follow + FOV boost
    ScrollEngine.js                Lenis wrapper — progress (0→1) + velocity
    TerrainPlane.js (788)          14 terrain algorithms + height-based vertex coloring
    TierDetection.js               3-tier device detection (desktop/laptop/mobile)
    GrassChunkManager.js           60K instanced grass with LOD + chunk pool
    + 50 more subsystem files...

    shaders/ (99 files)
      grass.vert/frag.glsl         6-layer wind + cursor brush + cel-shading
      cloud-march.vert/frag.glsl   Volumetric ray-marched cumulus
      aurora.vert/frag.glsl        nimitz triNoise2d curtain
      jellyfish.vert/frag.glsl     Pulse + trailing physics + species palette
      + 91 more shader pairs...

    effects/ (9 files)
      KuwaharaEffect.js            8-sector anisotropic painterly filter
      ColorGradeEffect.js          SEUS-style lift/gamma/gain/split-tone
      FilmGrainEffect.js           2-layer hash + luminance-aware grain
      + 6 more custom pmndrs Effect subclasses...

  assets/
    textures/cloud.jpg             Perlin FBM noise
    textures/score-sheet.jpg       Score sheet
    textures/mks-portrait.jpg      Artist portrait
    audio/In a Field of Silence.mp3  Golden Meadow composition (11MB)
```

---

## Subsystem Catalog (All 17 Worlds)

### Universal Subsystems (present in most/all worlds)
| Subsystem | Purpose | Reusability |
|-----------|---------|-------------|
| AtmosphereController | 5-keyframe scroll-driven emotional arc | 5/5 |
| PostProcessingStack | 14-effect chain (bloom, CA, vignette, grain, DOF, SSAO, fog, color grade, motion blur, kuwahara, god ray, cloud composite, heat distortion, lens flare) | 5/5 |
| CameraRig | CatmullRom spline + terrain follow | 5/5 |
| GrassChunkManager | 60K instanced grass with 6-layer wind | 4/5 |
| CloudShadows | Multiply-blended shadow plane | 4/5 |
| CursorInteraction | Mouse→world raycast + velocity | 4/5 |

### Top 10 Most Impressive Subsystems

| Rank | System | Visual | Technical | Emotional | Reusability | Key Technique |
|------|--------|--------|-----------|-----------|-------------|---------------|
| 1 | VolumetricCloudSystem | 9.5 | 9.8 | 9.2 | 5/5 | Ray-marched Perlin-Worley, Beer-Lambert, dual-lobe Henyey-Greenstein |
| 2 | AuroraCurtain | 9.8 | 9.2 | 9.7 | 4/5 | nimitz triNoise2d, 5-octave triangle-wave FBM |
| 3 | KuwaharaEffect | 9.1 | 8.9 | 8.8 | 4/5 | 8-sector anisotropic, 16-level quantize, saturation boost |
| 4 | LavaLake | 9.0 | 8.6 | 9.3 | 2/5 | Simplex crust + molten color ramp + heave displacement |
| 5 | JellyfishSystem | 9.2 | 8.4 | 9.4 | 3/5 | 5-species palette, pulse-coupled trailing physics |
| 6 | GearTree | 8.9 | 8.7 | 8.5 | 2/5 | Procedural trunk/branch/gear, per-instance rotation |
| 7 | CrystalFormation | 8.8 | 8.5 | 8.3 | 3/5 | Cluster growth, iridescent cosine palette, Fresnel |
| 8 | GodRayPass | 8.3 | 8.0 | 7.8 | 5/5 | GPU Gems 3 radial blur, half-res FBO |
| 9 | AnemoneSystem | 8.1 | 8.1 | 8.2 | 3/5 | Instanced tentacles, 6-color palette, current sway |
| 10 | MarineSnow | 6.8 | 7.2 | 8.9 | 5/5 | 2000 barely-visible specks — "the only connection to the surface" |

### Unique Subsystems by World

**66 unique subsystems** exist across 17 worlds. Highlights:
- **Volcanic Observatory**: Lava lake, lava cracks (40), embers (1000), ash (500), heat distortion post-FX
- **Bioluminescent Deep**: Jellyfish (30, 5 species), anglerfish lures (12), marine snow (2000), hydrothermal vents (3)
- **Crystal Cavern**: 4 crystal types with prismatic dispersion, bioluminescent mushrooms (300), still water pools
- **Aurora Tundra**: Aurora curtain (50-step raymarch), footprint displacement canvas, snow surface SSS
- **Sonic Void**: Audio-reactive bass spheres (7), melody ribbons (5), harmony crystals (12) — pure sound-as-geometry
- **Underwater Cathedral**: Kelp forest (2000), fish schools (boids), coral (4 types), stained glass, inverted god rays

### Shared/Duplicated Patterns
- **Firefly variants**: 10 worlds (repurposed as: embers, lamps, ghost lights, bioluminescence, plankton)
- **Dust/particle variants**: 13 worlds (repurposed as: marine snow, confetti, void motes, metallic dust)
- **Caustics**: 3 worlds (Tide Pool, Underwater Cathedral, Crystal Cavern) with different tunings
- **DOF**: 13 worlds enabled, 4 disabled. Range: focusDistance 3-12, bokehScale 3.5-7.0
- **Cel-shading**: 3 worlds (Ocean Cliff figure, Ghibli grass+sky, Volcanic figure)

---

## Redundancy Map

| Pattern | Files | Duplicated LOC | Extraction |
|---------|-------|---------------|------------|
| Atmosphere keyframe schema | 17 keyframe files | ~1,700 | KeyframeTemplate.js with defaults |
| Particle system boilerplate | 10 classes | ~350 | BaseParticleSystem.js |
| Particle geometry creation | 19 files | ~400 | ParticleGeometryBuilder.js |
| GLSL fog/rim/point-size | 35+ shaders | ~1,100 | Shared _utility.glsl includes |
| InstancedMesh setup | 9 files | ~150 | InstancedMeshBuilder.js |
| **Total extractable** | | **~3,800** | **32% of analyzed code** |

---

## Dispose/Lifecycle Gap List

| Gap | Severity | Files Affected | Fix |
|-----|----------|---------------|-----|
| Missing `scene.remove()` in dispose | **HIGH** | 44 subsystems | Add `this.scene.remove(this.mesh/points)` before geo/mat dispose |
| Terrain + sceneSetup not disposed | **CRITICAL** | WorldEngine.js | Dispose terrain mesh, sky dome, lights in destroy() |
| Texture leaks | **MEDIUM** | ArtistFigure, ScoreSheetCloth | Dispose loaded textures and DataTexture |
| AudioContext not closed | **LOW** | AudioReactive.js | Call `this.audioCtx.close()` in dispose |
| Quad geometry not disposed | **LOW** | VolumetricCloudSystem, TransitionRenderer | Dispose PlaneGeometry(2,2) |
| RenderPass/EffectPass not disposed | **LOW** | PostProcessingStack | Dispose pass instances (may be handled by composer) |

---

## Bundle Breakdown

```
Current: 1 JS chunk (1,358 KB gzipped to 360 KB)
├── Three.js core              ~120 KB
├── WorldEngine + 60 subsystems ~200 KB
├── 17 keyframe files           ~35 KB
├── 17 environment configs      ~30 KB
├── PostProcessing (pmndrs)     ~80 KB
├── React + ReactDOM            ~40 KB
├── Lenis, react-router-dom     ~20 KB
├── Custom effects + shaders    ~50 KB
└── Entry page, content, UI     ~30 KB

Also bundled: 11 MB MP3 audio file (should be streamed)
```

**Splitting strategy** (see specs/bundle-splitting.md):
- Phase 1: Entry page split (480KB → 200KB, 58% reduction)
- Phase 2: Async keyframe loading per world
- Phase 3: Dynamic import biome-specific subsystems (185-220KB deferrable)

---

## Portpoo Technique Crosswalk

| Portpoo Taste Theme | MKS Subsystem/Feature |
|---------------------|----------------------|
| **Dimensional Collapse** (2D↔3D) | Entry page dithered flower → WebGL dissolve transition |
| **Destruction as Aesthetic** | Film grain, score sheet cloth weathering, dithering |
| **Fog/Depth as Mystery** | AtmosphereController fog interpolation, content reveal at proximity |
| **Rhythm/Temporal Control** | Scroll-driven atmosphere = musical pacing. Lenis duration=3s |
| **Camera as Character** | CameraRig spline personality — lingers, dips among fireflies, rises for vistas |
| **Floaty > Noisy** | Particle drift (dust, marine snow), gentle bob (fireflies), 0.3 wind speed |
| **Mathematical Legitimacy** | Preetham sky, Verlet cloth, instanced grass, Beer-Lambert clouds |
| **Hand-Made Quality** | Film grain always on, dithered entry page, imperfection budget |

| Portpoo Technical Note | MKS Application |
|------------------------|-----------------|
| Bioluminescent Effect Stack | Bloom + particle mask + simplex displacement → frequency-reactive visuals |
| Simulation Over Animation | Already: Verlet cloth, instanced grass wind. Extend to: all particle systems |
| Fog-Proximity Reveal | AtmosphereController already fades subsystems. Extend to: content sections |
| Dimensional Crossover | Entry page (2D) → WebGL world (3D) transition via useWorldTransition |
| Destroy-to-Reveal | Cursor interaction on score sheets (hidden, revealed by parting) |
| Audio-Reactive Keyframes | AudioReactive FFT → bloom/CA modulation (exists). Extend to: full subsystem binding |

---

## Design Rule Compliance

| Rule | Status | Details |
|------|--------|---------|
| No flat black (#000) in CSS | **FAIL** | index.css:36 has `background: #000` |
| prefers-reduced-motion everywhere | **FAIL** | Missing in MiniPlayer.css, DevTuner.css |
| Opacity-only entrances | **FAIL** | MiniPlayer.css playerSlideUp uses translateY |
| 85% dark / 15% light | PASS | Design system enforced |
| Film grain + vignette always present | PASS | PostProcessingStack defaults |
| No AI artist images | PASS | Only real photography |
| Shader code from real repos | PASS | All 99 shaders cite sources |

---

## Ralph Readiness Score: 7/10

**Strengths:**
- Config-driven architecture is well-suited to autonomous iteration
- 13 specs with testable ACs provide clear task definitions
- verify-all.sh provides back pressure (10 sections, ~55 checks)
- Codebase is well-structured with clear separation (engine / configs / UI / shaders)
- Existing CLAUDE.md has 30+ learnings (rich project memory)

**Gaps:**
- No test framework (testing = build + lint + verify-all.sh + visual verification)
- 98 ESLint errors create noise in verification
- No code splitting means builds are slow to iterate on
- 44 dispose gaps will block clean world transitions
- The Big Pivot (17 worlds → 1 journey) requires significant human-taste decisions before autonomous implementation

**Recommended first 5 Ralph iterations:**
1. `lint-cleanup` — clear the noise, get ESLint to 0 errors
2. `design-rule-enforcement` — fix the 3 violations, add automated checks
3. `dispose-lifecycle` — fix all 44 scene.remove gaps + critical leaks
4. `bundle-splitting` Phase 1 — React.lazy for EnvironmentScene
5. `subsystem-extraction` — KeyframeTemplate.js (biggest deduplication win)

---

## Recommended Harness Config

```json
{
  "modes": {
    "build": { "frequency": 1 },
    "retro": { "frequency": 5 },
    "quality-gate": { "frequency": 8 },
    "plan": { "frequency": 10 }
  },
  "verification": "bash scripts/verify-all.sh",
  "build_command": "npx vite build",
  "lint_command": "npx eslint src/",
  "max_context_usage": 0.6,
  "guardrails": []
}
```

---

## Files Generated by This Scout

```
specs/
  README.md                     — The Pin (13 entries with rich keywords)
  bundle-splitting.md           — Code splitting strategy (11 ACs)
  dispose-lifecycle.md          — Resource cleanup audit (6 ACs)
  subsystem-extraction.md       — Deduplication plan (8 ACs)
  config-normalization.md       — Unified config schema (6 ACs)
  lint-cleanup.md               — ESLint + dependency cleanup (7 ACs)
  design-rule-enforcement.md    — Design compliance fixes (8 ACs)
  unified-scroll-arc.md         — One continuous experience design (6 ACs)
  research-integration.md       — Research winner integration plan (5 ACs)
  algorithmic-art.md            — Mathematical systems spec (4 ACs)
  front-end-design.md           — Typography + content design (7 ACs)
  composable-subsystems.md      — Subsystem registry architecture (6 ACs)
  source-research.md            — Shader source process (5 ACs)
  performance-optimization.md   — FX budget + tier scaling (7 ACs)

scripts/
  verify-all.sh                 — Updated: 10 sections, ~55 checks

SCOUT_REPORT.md                 — This file
```

**Total ACs across all specs: 86**
**Total verify-all.sh checks: ~55**
