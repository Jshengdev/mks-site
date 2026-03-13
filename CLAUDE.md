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
- **pmndrs/postprocessing** — bloom, chromatic aberration, vignette, film grain
- **Raw GLSL shaders** — adapted from GitHub reference repos (Nitash-Biswas, al-ro, James-Smyth, Alex-DG, daniel-ilett)
- **Vanilla CSS** — no Tailwind, no CSS-in-JS
- **Web Audio API** — AnalyserNode for MiniPlayer visualizer

### Key Dependencies
```
three, lenis, postprocessing, three-good-godrays (installed but godrays disabled pending shadow setup)
```

## Architecture

```
src/
  App.jsx                    — Canvas mount + ContentOverlay + MiniPlayer + MoonlightCursor
  App.css                    — Legacy styles (mostly unused now)
  index.css                  — Global reset + Lenis CSS
  useScrollAudio.js          — Hook: ramps audio volume from Lenis scroll progress

  meadow/                    — Three.js engine (vanilla, class-based)
    MeadowEngine.js          — Top-level orchestrator, render loop, resize, subsystem wiring
    ScrollEngine.js          — Lenis wrapper, exposes progress + velocity
    CameraRig.js             — CatmullRomCurve3 S-curve spline + damped lerp + terrain follow
    TierDetection.js         — Performance tier detection (1=desktop, 2=laptop, 3=mobile)
    MeadowScene.js           — Sky dome (Preetham), fog, directional + ambient light
    TerrainPlane.js          — 400×400 PlaneGeometry with sin/cos rolling hills
    CloudShadows.js          — Multiply-blended shadow plane with glacial UV drift
    GrassGeometry.js         — Blade mesh generator (7-segment high LOD, 1-segment low)
    GrassChunkManager.js     — Chunk pool (20×20 units), activate/dispose/fade-in
    FlowerInstances.js       — 6 color types × ~133 each, clearing avoidance, toon shader
    FireflySystem.js         — 500 Points with additive blending, vertical bob
    PostProcessingStack.js   — EffectComposer: bloom, CA, vignette, grain

    shaders/
      grass.vert.glsl        — 4-layer wind (Nitash-Biswas deform), billboard, fake normals
      grass.frag.glsl        — Translucent lighting (al-ro), iquilez fog, cloud shadows
      firefly.vert.glsl      — Point particle vertical bob (Alex-DG)
      firefly.frag.glsl      — Inverse-distance radial glow, warm amber
      flower.vert.glsl       — Gentle sway + instanceMatrix
      flower.frag.glsl       — 3-band toon diffuse + rim light (daniel-ilett)

  content/                   — React DOM overlays (opacity driven by MeadowEngine, not CSS)
    ContentOverlay.jsx       — Container, registers section DOM refs with engine
    LandingContent.jsx       — Title + subtitle (placeholder)
    MusicContent.jsx         — Glass-card placeholder
    AboutContent.jsx         — Glass-card placeholder
    StoreContent.jsx         — Glass-card placeholder
    FooterContent.jsx        — Copyright
    content-overlay.css      — Fixed overlay styles, glass-card

  MiniPlayer.jsx             — Surviving component from old site
  MiniPlayer.css
  MoonlightCursor.jsx        — Surviving component from old site

  assets/
    textures/cloud.jpg       — Perlin FBM noise texture (from al-ro)

docs/
  superpowers/specs/         — Design specification
  superpowers/plans/         — Implementation plan (22 tasks, 7 chunks)
  webgl-reference/           — 26 reference shader/code files from GitHub repos
  mks-design-philosophy/     — 12+ design documents
```

### How the Render Loop Works
1. Lenis updates `scrollEngine.progress` (0→1)
2. CameraRig lerps camera position along CatmullRom spline, offset by terrain height
3. Subsystems update: cloud shadows drift, grass wind animates, fireflies bob, flowers sway
4. Content sections: MeadowEngine reads `data-section-t` attrs, sets DOM opacity via smoothstep
5. PostProcessingStack renders via EffectComposer (bloom, CA, vignette, grain)

### Content Visibility Formula
```
dist = |cameraT - sectionT|
opacity = 1.0 - smoothstep(0.03, 0.08, dist)
pointerEvents = opacity > 0.1 ? 'auto' : 'none'
```

### Performance Tiers
| Tier | Criteria | Grass | FX |
|------|----------|-------|-----|
| 1 (Desktop) | >1366px, >4 cores, maxTex>4096 | 100K (6 chunks) | Full |
| 2 (Laptop) | 769-1366px or ≤4 cores | 30K (4 chunks) | Reduced |
| 3 (Mobile) | ≤768px or no WebGL2 | 0 | Static fallback |

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

### Built (Meadow Phase 1) ✓
- Full Three.js meadow engine with 7 subsystems wired
- 100K instanced grass with 4-layer wind shaders
- Procedural terrain with rolling hills
- Sky dome (Preetham model) with golden hour lighting
- Cloud shadow plane with glacial drift
- 800 instanced flowers with toon shading
- 500 firefly particles with additive blending
- Post-processing: bloom, chromatic aberration, vignette, film grain
- Content overlay with 5 sections (DOM-driven opacity from scroll)
- Lenis smooth scroll → CameraRig spline path
- Performance tiers (3 levels)
- Camera terrain-following (prevents clipping into hills)
- MiniPlayer + MoonlightCursor preserved

### Next Phase: Polish & Content
- **God rays** — needs shadow map setup (sunLight.castShadow, renderer.shadowMap.enabled)
- **LUT color grading** — create BotW golden hour .cube LUT, add LUT3DEffect
- **DOF** — BokehPass, focus distance tracks camera-to-content distance
- **Custom fog pass** — 3-zone depth shader (near sharp, mid golden haze, far desaturated)
- **Flower .glb models** — replace procedural geometry with stylized GLTF models
- **Real content** — migrate actual album art, bio text, products into content sections
- **Nav component** — minimal fixed top nav
- **Tier 3 fallback** — static screenshot as background image
- **prefers-reduced-motion** — freeze camera lerp, jump directly to target
- **LOD switching** — use lowGeo for grass beyond 15 world units
- **Contact page** — decide if it lives in the meadow or separate
- **Audio integration** — scroll-driven ambient meadow sounds

### Known Issues
- GodraysPass disabled (needs shadow map infrastructure)
- Flower geometry is procedural (cylinder+sphere), not stylized .glb models
- Content sections are placeholder text
- No LOD switching on grass (always uses high-detail geometry)
- `BLADES_PER_CHUNK` constant unused (actual count derived from tier config)

---

## Learnings Log

- 2026-03-12: The old site (LandingSection, FlowerField, Overlays, FlowerVisual) files still exist but are no longer imported — App.jsx was rewritten to mount MeadowEngine
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
