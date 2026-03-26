# Implementation Plan

## CURRENT STATUS
- **Specs:** 13 (6 Phase 1, 4 Phase 2, 3 Phase 3)
- **Steps:** 4 done / 12 remaining
- **QA gates passed:** 0
- **verify-all.sh runs:** 4

| Spec | ACs | Done | Grade |
|------|-----|------|-------|
| lint-cleanup | 9 | 100% | PASS |
| design-rule-enforcement | 8 | 100% | PASS |
| dispose-lifecycle | 7 | 100% | PASS |
| subsystem-extraction | 9 | 22% (AC8-9 constraints) | NOT STARTED |
| config-normalization | 6 | 17% (AC6) | PARTIAL |
| bundle-splitting | 11 | 9% (AC1) | PARTIAL |
| unified-scroll-arc | 6 | 0% | NOT STARTED |
| research-integration | 5 | 0% | NOT STARTED |
| algorithmic-art | 4 | 0% | NOT STARTED |
| front-end-design | 7 | 14% (AC1 partial) | PARTIAL |
| composable-subsystems | 6 | 0% | NOT STARTED |
| source-research | 5 | 10% (AC2 partial) | PARTIAL |
| performance-optimization | 7 | 14% (AC7 partial) | PARTIAL |

---

## PRIORITY TASKS

### STEP 2: Design rule fixes — #000, reduced-motion, opacity-only [DONE]
- [x] Added --void and all color tokens to :root in index.css, replaced raw hex background
- [x] Added prefers-reduced-motion blocks to MiniPlayer.css, DevTuner.css, content-overlay.css
- [x] Replaced playerSlideUp translateY with opacity-only (both desktop + mobile @480px)
- [x] Added Rules 4-6 to verify-all.sh (background hex warning, amber/teal ≤5/file, red-felt ≤1 total)
- [x] Updated Rule 2 check to also flag CSS files with `transition` (not just animation/@keyframes)
- Result: verify-all.sh 54/55 (1 pre-existing orphan shader), `npx vite build` clean

### STEP 3: Dispose lifecycle — WorldEngine + PostProcessingStack + textures [DONE]
- [x] WorldEngine.destroy(): terrain mesh scene.remove + geometry/material dispose (AC2)
- [x] WorldEngine.destroy(): sceneSetup disposal — sky, skyMesh, sunLight, ambientLight (AC2)
- [x] ArtistFigure: store texture ref in loadTexture(), dispose in dispose() (AC3)
- [x] ScoreSheetCloth: store DataTexture as this.dataTexture, dispose it (AC3)
- [x] AudioReactive.dispose(): audioCtx.close() with state !== 'closed' guard (AC4)
- [x] VolumetricCloudSystem + TransitionRenderer: store quad PlaneGeometry, dispose it (AC5)
- [x] PostProcessingStack: store RenderPass ref, dispose RenderPass + EffectPass before effects (AC6)
- Result: verify-all.sh 54/55 (1 pre-existing orphan shader), `npx vite build` clean

### STEP 4: Dispose lifecycle — 45 subsystem scene.remove() sweep [DONE]
- [x] Added `this.scene = scene` + `this.scene.remove()` to 12 points-based subsystems (AC1)
- [x] Added `this.scene = scene` + `this.scene.remove()` to 22 mesh-based subsystems inc. WaterSurface (AC1)
- [x] Fixed 3 special cases: VoidParticle (group), FoldLine (lines), StarField (points+moon) (AC1)
- [x] Fixed 8 array-based subsystems with per-mesh scene.remove in loops (AC1)
- [x] Fixed CrystalFormation/GlowMushroom destructuring to include mesh ref for removal (AC1)
- Result: 51 files with scene.remove(), verify-all.sh 54/55 (1 pre-existing orphan shader), `npx vite build` clean

### STEP 5: Subsystem extraction — shared GLSL utilities [spec: specs/subsystem-extraction.md]
- [ ] Create `_fog-utils.glsl` with fogFactor/applyFog (AC4) [files: src/meadow/shaders/_fog-utils.glsl]
- [ ] Create `_rim-light.glsl` with fresnelRim (AC4) [files: src/meadow/shaders/_rim-light.glsl]
- [ ] Create `_particle-utils.glsl` with scalePointSize (AC4) [files: src/meadow/shaders/_particle-utils.glsl]
- [ ] Refactor consuming shaders to import via JS string concatenation, remove local copies (AC4) [files: 11+ shader files with fresnel duplication]
- Required tests: `npx vite build`; grep for duplicate function definitions returns only shared files

### STEP 6: Subsystem extraction — BaseParticleSystem + ParticleGeometryBuilder [spec: specs/subsystem-extraction.md]
- [ ] Create ParticleGeometryBuilder.js with addAttribute/addPositions/addPhases/build (AC3) [files: src/meadow/ParticleGeometryBuilder.js]
- [ ] Create BaseParticleSystem.js with shared constructor/update/dispose (AC2) [files: src/meadow/BaseParticleSystem.js]
- [ ] Refactor 10 particle classes to extend BaseParticleSystem (AC2) [files: FireflySystem.js, DustMotes.js, RainSystem.js, PetalSystem.js, AshSystem.js, EmberSystem.js, BubbleSystem.js, MarineSnow.js, SnowParticle.js, VoidParticle.js]
- Required tests: `npx vite build`; all 10 particle classes import BaseParticleSystem

### STEP 7: Subsystem extraction — KeyframeTemplate [spec: specs/subsystem-extraction.md]
- [ ] Create KeyframeTemplate.js with KEYFRAME_DEFAULTS (54 properties) + createKeyframe() + createAtmosphereKeyframes() (AC1) [files: src/meadow/KeyframeTemplate.js]
- [ ] Refactor 17 keyframe files to use createKeyframe() with overrides only (AC1) [files: src/meadow/*Keyframes.js × 17]
- Required tests: `npx vite build`; line count reduction >= 1,500 across keyframe files

### STEP 8: Config normalization — schema + validation [spec: specs/config-normalization.md]
- [ ] Create config-schema.js with all valid fields, types, defaults grouped by subsystem (AC1) [files: src/environments/config-schema.js]
- [ ] Implement validateConfig() returning errors/warnings (AC5) [files: src/environments/config-schema.js]
- [ ] Validate all 17 configs pass without errors (AC2) [files: src/environments/*.js]
- [ ] Add segment addressing to schema (optional segments array with t-ranges) (AC3) [files: src/environments/config-schema.js]
- [ ] WorldEngine: call validateConfig in dev mode, handle both legacy + segment configs (AC4) [files: src/meadow/WorldEngine.js]
- Required tests: `npx vite build`; node validation script passes for all 17 configs

### STEP 9: Bundle splitting — React.lazy + audio isolation [spec: specs/bundle-splitting.md]
- [ ] Wrap EnvironmentScene in React.lazy() in App.jsx with Suspense fallback (AC3, AC11) [files: src/App.jsx]
- [ ] Move audio to public/audio/, set preload="none" in MiniPlayer (AC7) [files: src/MiniPlayer.jsx, public/audio/]
- [ ] Create LoadingShell component (void-black, subtle opacity fade) (AC11) [files: src/LoadingShell.jsx]
- Required tests: `npx vite build`; audio files in public/audio/; EnvironmentScene in separate chunk

### STEP 10: Bundle splitting — keyframes + subsystems + manualChunks [spec: specs/bundle-splitting.md]
- [ ] Extract keyframes to src/environments/keyframes/ with dynamic import() (AC4) [files: src/environments/keyframes/*.js, src/meadow/WorldEngine.js]
- [ ] Create SubsystemLoader.js with SUBSYSTEM_REGISTRY (AC6) [files: src/meadow/SubsystemLoader.js]
- [ ] Make WorldEngine.init() async, load subsystems via SubsystemLoader (AC5) [files: src/meadow/WorldEngine.js, src/EnvironmentScene.jsx]
- [ ] Add manualChunks to vite.config.js (three, postprocessing, per-world) (AC8) [files: vite.config.js]
- Required tests: `npx vite build`; >= 6 JS chunks; entry chunk < 220KB

### STEP 11: Performance — early-out shaders + per-effect toggle [spec: specs/performance-optimization.md]
- [ ] Add early-out to FilmGrainEffect (uGrainIntensity < 0.001) (AC7) [files: src/meadow/effects/FilmGrainEffect.js]
- [ ] Add early-out to RadialCAEffect (uDistortion < 0.001) (AC7) [files: src/meadow/effects/RadialCAEffect.js]
- [ ] Add setEffectEnabled(name, bool) to PostProcessingStack (AC5) [files: src/meadow/PostProcessingStack.js]
- [ ] Reduce Kuwahara kernel on tier 'reduced' (AC6) [files: src/meadow/PostProcessingStack.js]
- Required tests: `npx vite build`; grep for early-out in 4 effect shaders

### STEP 12: Source research — shader registry + attribution [spec: specs/source-research.md]
- [ ] Create docs/shader-sources.md with all current sources (7+ entries) (AC3) [files: docs/shader-sources.md]
- [ ] Create docs/source-research-template.md with evaluation criteria + anti-clustering field (AC1, AC4) [files: docs/source-research-template.md]
- [ ] Audit 52 shaders missing attribution, add header comments (AC2) [files: src/meadow/shaders/*.glsl]
- Required tests: grep "Source:" returns entries for all shader files

---

## PHASE 2 TASKS (Human-Taste — need creative direction)

### STEP 13: Front-end design — typography system (Ralphable portion) [spec: specs/front-end-design.md]
- [ ] Verify/add Inter font alongside existing Cormorant Garamond + DM Sans (AC1) [files: src/index.css]
- [ ] Add prefers-reduced-motion to content-overlay.css (AC4) [files: src/content/content-overlay.css]
- [ ] Verify WCAG AA contrast on glass card backgrounds (AC5)
- **Human-taste:** AC2-3, AC6-7 (content placement, per-section treatment, world-text binding, artist name reveal)

### STEP 14: Unified scroll arc design [spec: specs/unified-scroll-arc.md] [HUMAN-TASTE]
- [ ] Design emotional territory sequence with scroll positions (AC1)
- [ ] Define 3-5 money moments with visual descriptions (AC2)
- [ ] Map content sections to emotional peaks (AC5)
- **Depends on:** Steps 1-8 (Phase 1 complete), AUDIENCE_JTBD.md

### STEP 15: Research integration catalog [spec: specs/research-integration.md]
- [ ] Catalog all experiments ≥60/70 with integration status (AC3) [ref: /Users/johnnysheng/mks/research/pipeline/]
- [ ] Map winners to scroll segments + subsystems (AC1)
- [ ] Write 5 portpoo taste note implementation briefs (AC2) [ref: /Users/johnnysheng/portpoo/resources/taste-profile.md]
- [ ] Write 3 web extractor technique briefs (AC4) [ref: /Users/johnnysheng/mks/research/web-extractor/]

### STEP 16: Composable subsystem architecture [spec: specs/composable-subsystems.md]
- [ ] Create SubsystemRegistry.js with register/activate/deactivate/dispose (AC1) [files: src/meadow/SubsystemRegistry.js]
- [ ] Define standard subsystem interface (AC2)
- [ ] Refactor WorldEngine to delegate to registry (AC5) [files: src/meadow/WorldEngine.js]
- **Depends on:** Steps 8, 10 (config normalization, bundle splitting)

---

## COMPLETED
### STEP 1: Lint cleanup — ESLint zero-error baseline [DONE]
- Excluded docs/webgl-reference/ in globalIgnores (80 vendored errors eliminated)
- Fixed 11 no-unused-vars across 8 files (removed dead vars/imports, restructured destructuring)
- Fixed 4 ref-during-render in DevTuner.jsx (mirrored groupsRef to state for render reads)
- Fixed setState-in-effect in EnvironmentScene.jsx (lazy useState for tier detection)
- Fixed react-refresh in WorldContext.jsx (removed default export) + main.jsx (inlined Suspense)
- Fixed ContentOverlay.jsx (dot-notation instead of destructuring Component)
- Removed 5 unused deps: n8ao, three-good-godrays, @types/react, @types/react-dom, playwright
- Added argsIgnorePattern + allowExportNames to ESLint config for hook/context patterns
- Result: `npx eslint .` → 0 errors, `npx vite build` → clean, verify-all 51/53 (2 pre-existing)

---

## ARCHITECTURE NOTES (persist across re-plans)
- **92 JS files** in src/meadow/, **102 GLSL shaders**, **17 environment configs**
- **WorldEngine.js** has 82 static imports — the primary target for bundle splitting
- **TerrainPlane.js** already uses HEIGHT_FN_MAP registry (14 terrain types) — good pattern to extend
- **verify-all.sh** has 10 sections, design rules section covers Rules 1-3 (needs 4-6)
- **Entry page already split** via React.lazy in main.jsx (ProfessionalSite at /, ExperienceApp at /experience)
- **Build output:** index 232KB + App 1162KB = 2 chunks. Target: 6+ chunks, entry < 220KB
- **Fresnel duplication** across 11 shaders is the biggest GLSL extraction win
- **49 subsystems** missing scene.remove() — largest single sweep task
- **17 keyframe files × 54 properties × 5 keyframes** = biggest line-count reduction opportunity
- Spec location corrections: AC5 error is in EnvironmentScene.jsx (not WorldContext), AC6 error is in WorldContext.jsx (not ContentOverlay)
