# MKS Site — CLAUDE.md

## Self-Updating Rule

**Every session must end by updating this file.** If you learned something new — a preference, a pattern that works, a mistake to avoid, a decision made — append it to the relevant section below. If a section doesn't exist, create one. This file is the living memory of the project. Treat it as the source of truth that compounds over time.

When updating:
- Add to `## Learnings Log` at the bottom with the date and what was learned
- If the learning is a durable rule, also add it to the appropriate section above
- If a previous entry is wrong or outdated, correct it in place
- Keep entries concise — one line per learning when possible

---

## What This Is

A scroll-driven cinematic website for composer **Michael Kim-Sheng**. The entire site is a continuous 3D BotW-style golden hour meadow rendered in WebGL. The user scrolls to move a camera along a winding path through a flower field. Content sections (Landing, Music, About, Store, Footer) are clearings in the meadow, revealed by fog as the camera approaches. React DOM content overlays the canvas.

## Tech Stack

- **React 19** + **Vite 7** — no Next.js, no SSR, pure SPA
- **Three.js** (vanilla, NOT React Three Fiber) — all 3D rendering
- **Lenis** — smooth scroll, exposes progress (0→1) + velocity
- **pmndrs/postprocessing** — bloom, chromatic aberration, vignette, film grain, SSAO, DOF, motion blur
- **Raw GLSL shaders** — adapted from GitHub reference repos (Nitash-Biswas, al-ro, James-Smyth, Alex-DG, daniel-ilett)
- **Vanilla CSS** — no Tailwind, no CSS-in-JS
- **Web Audio API** — AnalyserNode for MiniPlayer visualizer

### Key Dependencies
```
three, lenis, postprocessing
```

## Architecture

```
src/
  App.jsx                    — Canvas mount + ContentOverlay + MiniPlayer + MoonlightCursor
  index.css                  — Global reset + Lenis CSS
  useScrollAudio.js          — Hook: ramps audio volume from Lenis scroll progress
  DevTuner.jsx + .css        — Live parameter panel (backtick to toggle, freeze/live atmosphere)

  meadow/                    — Three.js engine (vanilla, class-based)
    constants.js             — Shared constants (SECTION_T_VALUES)
    MeadowEngine.js          — Top-level orchestrator, render loop, resize, subsystem wiring
    ScrollEngine.js          — Lenis wrapper, exposes progress + velocity
    CameraRig.js             — CatmullRomCurve3 S-curve spline + damped lerp + terrain follow
    TierDetection.js         — Performance tier detection (1=desktop, 2=laptop, 3=mobile)
    MeadowScene.js           — Sky dome (Preetham), fog, directional + ambient light
    TerrainPlane.js          — 400x400 PlaneGeometry with sin/cos rolling hills
    CloudShadows.js          — Multiply-blended shadow plane with glacial UV drift
    GrassGeometry.js         — Blade mesh generator (7-segment high LOD, 1-segment low)
    GrassChunkManager.js     — Chunk pool (20x20 units), activate/dispose/fade-in, LOD swap
    FlowerInstances.js       — 6 color types x ~133 each, clearing avoidance, toon shader
    FireflySystem.js         — 500 Points with additive blending, vertical bob
    AtmosphereController.js  — 5-keyframe scroll-driven interpolation (sky, grass, fog, post-FX)
    CursorInteraction.js     — Mouse-to-world raycast (y=0 plane), lerped worldPos + smoothed velocity for grass wind
    PostProcessingStack.js   — EffectComposer: bloom, CA, vignette, grain, SSAO, DOF, fog, color grade
    GodRayPass.js            — Screen-space radial blur (GPU Gems 3), half-res FBO
    ScoreSheetCloth.js       — Wind-driven score sheets tumbling through meadow
    ClothSolver.js           — Verlet integration cloth physics (used by ScoreSheetCloth)
    ArtistFigure.js          — 2D cutout billboard at far end of meadow
    PortalHint.js            — Shimmering spots teasing future worlds
    DustMotes.js             — Floating particles catching sunlight
    MusicTrigger.js          — BotW discovery moment at scroll threshold
    AudioReactive.js         — FFT analysis for music-driven effects

    shaders/
      grass.vert.glsl        — 4-layer wind + cursor wind brush, billboard, fake normals
      grass.frag.glsl        — Translucent lighting (al-ro), iquilez fog, cloud shadows
      firefly.vert.glsl      — Point particle vertical bob (Alex-DG)
      firefly.frag.glsl      — Inverse-distance radial glow, warm amber
      flower.vert.glsl       — Gentle sway + instanceMatrix
      flower.frag.glsl       — 3-band toon diffuse + rim light (daniel-ilett)
      dust.vert/frag.glsl    — Dust mote particles
      portal.vert/frag.glsl  — Shimmer portal effect
      score-sheet.vert/frag  — Cloth rendering
      god-ray-blur.frag.glsl — Radial blur pass
      color-grade.frag.glsl  — SEUS-style lift/gamma/gain/split-tone
      fog-depth.frag.glsl    — 3-zone depth fog
      motion-blur.frag.glsl  — Velocity-based motion blur

    effects/ (custom pmndrs Effect subclasses, all in meadow/ currently)
      FilmGrainEffect.js, RadialCAEffect.js, MotionBlurEffect.js,
      KuwaharaEffect.js, GodRayCompositeEffect.js, ColorGradeEffect.js,
      FogDepthPass.js, SSAOSetup.js, DOFSetup.js

  content/                   — React DOM overlays (opacity driven by MeadowEngine, not CSS)
    ContentOverlay.jsx       — Container, registers section DOM refs with engine
    LandingContent.jsx       — Title + subtitle (placeholder)
    MusicContent.jsx         — Glass-card placeholder
    AboutContent.jsx         — Glass-card placeholder
    StoreContent.jsx         — Glass-card placeholder
    FooterContent.jsx        — Copyright
    content-overlay.css      — Fixed overlay styles, glass-card

  MiniPlayer.jsx + .css      — Audio player (surviving component from old site)
  MoonlightCursor.jsx        — Custom cursor effect

  assets/
    textures/cloud.jpg       — Perlin FBM noise texture (from al-ro)
    textures/score-sheet.jpg — Score sheet texture
    textures/mks-portrait.jpg — Artist portrait

docs/
  superpowers/specs/         — Design specification
  superpowers/plans/         — Implementation plan (22 tasks, 7 chunks)
  webgl-reference/           — 26 reference shader/code files from GitHub repos
  mks-design-philosophy/     — 12+ design documents
```

### How the Render Loop Works
1. Lenis updates `scrollEngine.progress` (0→1)
2. CameraRig lerps camera position along CatmullRom spline, offset by terrain height
3. AtmosphereController interpolates 5 keyframes (STILLNESS→AWAKENING→ALIVE→DEEPENING→QUIETING), pushes to all subsystems (skipped when `paused` flag set by DevTuner)
4. Subsystems update: cloud shadows drift, grass wind animates, fireflies bob, flowers sway, cloth physics, cursor wind
5. GodRayPass renders occlusion to half-res FBO
6. PostProcessingStack renders via EffectComposer (bloom, CA, vignette, grain, SSAO, DOF, fog, color grade, kuwahara, god ray composite)

### Content Visibility Formula
```
dist = |cameraT - sectionT|
opacity = 1.0 - smoothstep(0.03, 0.08, dist)
pointerEvents = opacity > 0.1 ? 'auto' : 'none'
```

### Performance Tiers
| Tier | Criteria | Grass | FX |
|------|----------|-------|-----|
| 1 (Desktop) | >1366px, >4 cores, maxTex>4096 | 60K (6 chunks) | Full |
| 2 (Laptop) | 769-1366px or ≤4 cores | 18K (4 chunks) | Reduced |
| 3 (Mobile) | ≤768px or no WebGL2 | 0 | Static fallback |

## DevTuner

Toggle with backtick (`). **Freeze/Live button** pauses AtmosphereController so slider changes stick. `data-lenis-prevent` on the scroll area prevents Lenis from hijacking scroll inside the panel.

When AtmosphereController is NOT frozen, it overwrites all subsystem values every frame from keyframe interpolation. This is by design — the scroll drives the atmosphere. Freeze to tune individual values.

### DevTuner Wiring Gotchas
- **Exposure** goes to `colorGrade.uniforms.uExposure` (pre-grade multiplier), NOT `renderer.toneMappingExposure` (which does nothing when toneMapping=NoToneMapping)
- **FOV** must set `cameraRig.baseFov` + `cameraRig.currentFov`, NOT `camera.fov` (CameraRig overwrites camera.fov every frame)
- **Firefly/Dust brightness** must also toggle `points.visible` — atmosphere sets visible=false at STILLNESS
- **SSAO radius** — use `effect.radius` getter/setter, not `ssaoMaterial.uniforms.radius.value` (pmndrs API varies by version)

## Design First Principles

These are non-negotiable. Every decision filters through them.

### YES — What We Want
- **Cinematic pacing** — everything reveals slowly, nothing pops in
- **Dark dominance** — 85% dark, 15% light. Black is not absence, it's atmosphere
- **Surfaces, not pops** — opacity transitions only. No scale/bounce/slide entrances
- **Nature as structure** — the meadow IS the site, not decoration
- **Expensive gallery feel** — generous whitespace, single focal point per viewport, restraint
- **Real photography only** — no AI-generated artist images, ever
- **Invisible design** — if you notice the CSS, it failed
- **Earned warmth** — cold is the default. Warmth appears through interaction/engagement
- **Two-voice typography** — serif for titles/artist name (classical), sans-serif for body (modern)
- **Imperfection budget** — slight rotations (1-2deg), soft blur, grain. Never pixel-perfect
- **prefers-reduced-motion** — every animation needs a fallback. Always.

### NO — What We Never Do
- No flat black (`#000`). Use breathing blacks (`--void: #0a0a0a`, `--warm-black: #1a1208`)
- No neon colors. Cool luminance only (`--text-primary: #c8d4e8`)
- No grid layouts for products. Each album gets its own cinematic world
- No "epic" (too Marvel), "vibes" (too casual), "content" (these are works), "minimal" (reducing to trend)
- No spectacle. Craft over flash
- No AI-generated images of the artist
- No transform-based entrance animations (scale, translateY). Opacity only for surfacing

### Color System
| Token | Hex | Usage |
|-------|-----|-------|
| `--void` | `#0a0a0a` | Primary background |
| `--warm-black` | `#1a1208` | Warm section backgrounds |
| `--text-primary` | `#c8d4e8` | Body text (cool luminance) |
| `--text-secondary` | `#90a0a0` | Secondary text |
| `--teal` | `#4a6a68` | Audience color — the viewer's emotional space |
| `--amber` | `#d4c968` | Artist color — warmth, presence, earned moments |
| `--red-felt` | `#983028` | Used exactly ONCE in the entire site |

## Reference Code Sources

All shader code is adapted from real GitHub repos. Reference files live in `docs/webgl-reference/`.

| Author | Repo | What We Stole |
|--------|------|--------------|
| Nitash-Biswas | grass-shader-glsl | 4-layer wind deform(), billboard rotation, fake curved normals |
| al-ro | grass (WebGL) | ACES tonemapping, iquilez fog, translucent lighting, quaternion blade bend |
| James-Smyth | BotW grass | Cloud shadow UV scrolling, vertex color wind weights |
| Alex-DG | vite-three-webxr-flowers | FirefliesMaterial, additive blending, vertical bob particles |
| daniel-ilett/maya-ndljk | toon shader | Step-function toon lighting (3-band + rim) |
| spacejack | terra | FOG_COLOR, GRASS_COLOR, scene orchestration constants |

**Rule:** All shader code must be stolen from real repos and adapted. No original GLSL from scratch.

## Orchestration System

- **Location:** `/Users/johnnysheng/mks/orchestration/`
- **Meadow orchestrator:** `orchestration/meadow-orchestrator.sh`
- **Commands:** `init`, `launch`, `status`, `monitor`, `merge`, `build`, `cleanup`
- **Worker structure:** `orchestration/meadow-workers/wN-name/{CLAUDE.md, TASK.md, CORRECTIONS.md, output/}`
- Uses `tmux` sessions + `git worktree` for parallel Claude Code workers
- **Critical:** Must `unset CLAUDECODE` before launching nested Claude instances in tmux
- Workers write DONE.md and FILES.md to their output dir when complete
- Workers must NOT modify MeadowEngine.js — integration is post-merge

## Where to Read More

Design philosophy: `mks-design-philosophy/` — Read `BRAND-ESSENCE.md` and `STYLE-DECISIONS.md` first.

Spec: `docs/superpowers/specs/2026-03-12-webgl-meadow-design.md`

Plan: `docs/superpowers/plans/2026-03-12-webgl-meadow.md`

## What's Built vs. What's Next

### Built (Meadow Phase 1 + Phase 2A) ✓
- Full Three.js meadow engine with 17 subsystems wired
- 60K instanced grass (thinner blades, sparser) with 4-layer wind + cursor wind brush
- Procedural terrain with rolling hills
- Sky dome (Preetham model) with golden hour lighting
- Cloud shadow plane with glacial drift
- 800 instanced flowers with toon shading
- 500 firefly particles with additive blending
- Post-processing: bloom, CA, vignette, grain, SSAO, DOF, 3-zone fog, color grade (SEUS), motion blur, kuwahara painterly, god ray composite
- GodRayPass — screen-space radial blur (GPU Gems 3)
- AtmosphereController — 5-keyframe scroll-driven interpolation with 38 params each
- Cursor interaction — mouse→world raycast, lerped worldPos (smooth grass push), smoothed velocity
- Score sheet cloth — Verlet physics, wind-driven
- Artist figure — 2D billboard at far end
- Portal hints — shimmering spots for future worlds
- Dust motes — floating particles
- Music trigger — BotW discovery moment
- Audio reactive — FFT analysis
- Content overlay with 5 sections (DOM-driven opacity from scroll)
- Lenis smooth scroll → CameraRig spline path
- Performance tiers (3 levels) with LOD switching
- Camera terrain-following (prevents clipping into hills)
- DevTuner — live parameter panel with freeze mode, Lenis-safe scrolling, exposure/FOV/firefly brightness/dust size controls all properly wired
- MiniPlayer + MoonlightCursor preserved

### Stripped (decided against / needs redo)
- **GhibliClouds** — toon-shaded hemisphere dome. Removed: looked like flat blobs, not Ghibli. Needs reference implementation from a real repo if attempted again.
- **CursorCreatures** — butterflies (PNG texture) + cursor fireflies. Removed: butterflies looked terrible as textured planes. User wants simple 3D geometry butterfly with wing flap, no textures. Fireflies were too aggressive. Needs complete rethink.

### Next Phase: Polish & Content
- **3D butterflies** — simple geometry (no texture), flapping wings, flying away from screen. Find a GitHub repo with good wing-flap math.
- **Cursor fireflies** — revisit with subtler approach, sparser, fewer
- **Stylized sky** — Preetham model is too realistic. Needs more golden hour / stylized feel.
- **Clouds** — need a completely different approach. Reference a real implementation.
- **Real content** — migrate actual album art, bio text, products into content sections
- **Nav component** — minimal fixed top nav
- **Tier 3 fallback** — static screenshot as background image
- **prefers-reduced-motion** — freeze camera lerp, jump directly to target
- **Contact page** — decide if it lives in the meadow or separate
- **Audio integration** — scroll-driven ambient meadow sounds

### Known Issues
- Flower geometry is procedural (cylinder+sphere), not stylized .glb models
- Content sections are placeholder text
- God rays render the full scene twice per frame (occlusion pass + normal), doubling draw calls when enabled

## Refactor Plan

### Completed (Tier 1) ✓
1. ~~Extract shared `SECTION_T_VALUES`~~ → `src/meadow/constants.js`, imported by MeadowEngine, FlowerInstances, ContentOverlay
2. ~~`GrassChunkManager.setUniform(key, value)`~~ → propagates to base material + all chunk clones. Used in AtmosphereController and DevTuner.
3. ~~`PostProcessingStack.setGodRayTexture(tex, intensity)`~~ → god ray wiring moved out of `_tick()`
4. ~~Return ambient light from `setupScene()`~~ → `sceneSetup.ambientLight` replaces fragile `scene.children.find()`

### Tier 2: Do Soon (moderate effort, reduces maintenance pain)

5. **Move effect files into `meadow/effects/`** — 10 effect files only imported by PostProcessingStack. Grouping reduces cognitive load. *Claude can do autonomously.*

6. **DevTuner param builder cleanup** — `buildParamGroups()` still ~500 lines but grass setters are now 1-line each (via setUniform). Consider subsystems exposing `getDevParams()`. *Claude can do autonomously, human should review param organization.*

### Tier 3: Consider Later (larger refactor, needs taste)

7. **Per-parameter atmosphere locking** — freeze is all-or-nothing. Per-param locking would let tuned values survive scroll changes. *Human taste: is the complexity worth it?*

8. **Audio-reactive composition** — `_tick()` mutates bloom/CA additively on atmosphere values. Fragile. Should use multiplier or layer system. *Human taste: decide the musical interaction model.*

9. **Subsystem lifecycle audit** — systematic audit of all `addEventListener` / `new THREE.*` for clean teardown. *Claude can do autonomously.*

### Where Human Taste Is Critical

| Step | What Needs Human Input |
|------|----------------------|
| **Any visual feature** (butterflies, clouds, sky) | How it looks, feels, what reference to chase |
| **Atmosphere keyframe values** | The emotional arc (cold→warm→peak→exhale) is artistic |
| **Post-FX intensity curves** | Bloom, grain, vignette darkness at each scroll position |
| **Content layout** | What goes in each clearing, how text interacts with meadow |
| **Audio integration** | What sounds play, when, how they interact with visuals |
| **DevTuner param ranges** | What min/max makes sense for each slider |

### Where Claude Can Act Autonomously

| Task | Why It's Safe |
|------|--------------|
| Dead code removal | No ambiguity — unused = delete |
| Allocation optimization | Module-level reusable vectors follow established pattern |
| Method extraction | Pure mechanical refactor, no taste needed |
| Constant extraction | No behavior change |
| Dispose/cleanup methods | Preventing leaks, following existing patterns |
| Build verification | Objective pass/fail |

## Context Preservation

If a session runs out of context, the next session should:

1. **Read this CLAUDE.md first** — it's the complete project state
2. **Check `git log --oneline -20`** — see what was done recently
3. **Check `git diff --stat`** — see uncommitted work
4. **Read `docs/superpowers/specs/2026-03-12-webgl-meadow-design.md`** — the design spec
5. **Run `npx vite build`** — verify the build is clean before starting

The codebase is now clean enough that reading MeadowEngine.js + AtmosphereController.js + this file gives a complete picture of the system.

---

## Learnings Log

- 2026-03-12: `three-good-godrays` exports `GodraysPass` (a Pass), not `GodRaysEffect` (an Effect). It needs a DirectionalLight with castShadow=true, not a Mesh. Params use `raymarchSteps` not `samples`.
- 2026-03-12: `BufferGeometryUtils` must be imported from `three/examples/jsm/utils/BufferGeometryUtils.js`, not from `THREE.BufferGeometryUtils` (doesn't exist on the THREE namespace)
- 2026-03-12: When cloning ShaderMaterial for per-instance uniforms, cloned materials get independent uniform objects. Must iterate all clones to update shared uniforms like `uTime`.
- 2026-03-12: Shaders must output linear values when post-processing (bloom etc) is in the pipeline. Per-shader gamma/ACES causes double correction. Let renderer handle tonemapping+gamma.
- 2026-03-12: `scene.background = color` overrides Sky dome visuals. Don't set it when using Sky from three/examples.
- 2026-03-12: Texture paths like `/src/assets/textures/foo.jpg` work in dev but break in production (Vite hashes filenames). Use ES module imports: `import url from '../assets/textures/foo.jpg'`
- 2026-03-12: Camera spline Y must account for terrain height — constant Y will clip into rolling hills. Use `getTerrainHeight(x, z) + offset`.
- 2026-03-12: InstancedMesh vertex shaders MUST use `instanceMatrix` — without it, all instances render at origin. Also compute normals from `mat3(instanceMatrix) * normal`.
- 2026-03-12: `instanceMatrix` on InstancedMesh: don't replace with `new InstancedBufferAttribute(data, 16)`. Instead: `mesh.instanceMatrix.array.set(data); mesh.instanceMatrix.needsUpdate = true`
- 2026-03-12: tmux workers launched from Claude Code fail with "nested session" error. Fix: `unset CLAUDECODE && claude --dangerously-skip-permissions`
- 2026-03-12: tmux correction files (CORRECTIONS.md) may not be read by workers if they've already started. Send corrections early or pre-merge fix.
- 2026-03-13: User wants all shader code stolen from real GitHub repos, never written from scratch. Sources matter — verify they contain real creative techniques, not generic AI-generated examples.
- 2026-03-13: GhibliClouds (hemisphere dome + FBM toon shader) produced flat blobs. Don't attempt procedural clouds without a real reference implementation.
- 2026-03-13: Textured plane butterflies look terrible. User explicitly wants simple 3D geometry with wing flap, no textures. Don't try PNG-based approaches.
- 2026-03-13: AtmosphereController overwrites all subsystem values every frame. DevTuner changes won't stick unless atmosphere is paused (freeze mode). This is the root cause of "sliders don't work."
- 2026-03-13: Lenis hijacks scroll events globally. Use `data-lenis-prevent` attribute on elements that need independent scrolling (DevTuner panel).
- 2026-03-13: Always avoid per-frame allocations (`new THREE.Vector3()` etc). Use module-level reusable objects prefixed with underscore (`const _lookTarget = new THREE.Vector3()`).
- 2026-03-13: When iterating a Map and deleting entries, snapshot keys first (`[...map.keys()]`) to avoid mutation-during-iteration bugs.
- 2026-03-13: Old site files (LandingSection, FlowerField, Overlays, FlowerVisual, App.css, noise.js, flowers.js) were deleted — they were never imported by the current App.jsx.
- 2026-03-13: PostProcessingStack.dispose() was only cleaning up 5 of 12 effects. Always dispose ALL effects/passes in cleanup methods.
- 2026-03-13: TerrainPlane had duplicated height formula in createTerrain and getTerrainHeight. Single-source the formula by calling getTerrainHeight from createTerrain.
- 2026-03-13: User wants to use DevTuner to dial in visual values before committing to them in code. The workflow is: freeze atmosphere → tune sliders → export JSON → apply values to keyframes. Human taste step.
- 2026-03-14: `renderer.toneMappingExposure` does NOTHING when `renderer.toneMapping = NoToneMapping`. Since we use pmndrs ToneMappingEffect in the post-processing pipeline, exposure must be a uniform in the color grade shader (`uExposure`).
- 2026-03-14: CameraRig.update() sets `camera.fov = this.currentFov` every frame (for scroll-velocity FOV boost). DevTuner must set `cameraRig.baseFov` (not `camera.fov`) or the value gets instantly overwritten.
- 2026-03-14: Cursor grass push was jittery because worldPos snapped to raycast hit every frame. Fixed with `worldPos.lerp(hitPoint, 0.12)` + velocity smoothing. Reset `_initialized` flag on mouseleave so re-entry doesn't lerp from stale position.
- 2026-03-14: Score sheets were invisible because they were at Y:4.5-8.5m (camera is ~1.5m above terrain). Lowered to Y:2.0-4.5m and enlarged (1.8x1.3) to be visible.
- 2026-03-14: pmndrs SSAOEffect property access varies by version. Use `effect.radius` getter/setter rather than digging into `ssaoMaterial.uniforms.radius.value`. Add try/catch with fallback for robustness.
- 2026-03-14: User's first DevTuner tuning session (JSON export at scroll ~0.48). Key taste: wants more golden/desaturated colors, liked cloud shadows, wants smoother grass push, FOV should go more extreme. Effects need to be visually obvious or user can't tell they exist.
