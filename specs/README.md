# Specifications — Lookup Table (The Pin)

This is the search tool's entry point. Each entry links to a spec with
many descriptive words so searches find the right spec for any topic.
More descriptors = higher hit rate = less hallucination.

---

## Phase 1: Refactor & Consolidate

### bundle-splitting.md
**Topics:** code splitting, dynamic import, React.lazy, Suspense, lazy loading, chunks, manualChunks, Vite rollup, entry page split, subsystem loader, async keyframes, audio streaming, MP3, bundle size, initial load, time to interactive, performance, progressive loading
**Summary:** Split the 1.36MB monolithic JS bundle into entry page, shared engine, and per-world chunks via React.lazy + dynamic import + Vite manualChunks

### dispose-lifecycle.md
**Topics:** dispose, cleanup, teardown, memory leak, garbage collection, scene.remove, texture leak, AudioContext close, requestAnimationFrame cancel, event listener removal, resource management, lifecycle, destroy, deactivation, world transition, subsystem disposal
**Summary:** Fix ~40 subsystems missing scene.remove() in dispose, plus terrain/sceneSetup/texture/AudioContext leaks in WorldEngine

### subsystem-extraction.md
**Topics:** deduplication, shared code, base class, particle system, KeyframeTemplate, ParticleGeometryBuilder, BaseParticleSystem, GLSL include, fog utilities, rim light, shader shared, atmosphere keyframe schema, duplication, extraction, refactor, DRY
**Summary:** Extract ~3,800 lines of duplicated code into shared utilities: keyframe schema template, particle base class, geometry builder, GLSL shader includes

### config-normalization.md
**Topics:** config schema, validation, segment addressing, scroll segments, unified config, terrain registry, height function map, field types, defaults, constraints, backward compatible, validateConfig, extensible
**Summary:** Create a validated config schema with scroll-segment addressing to support both legacy single-world configs and the unified continuous experience

### lint-cleanup.md
**Topics:** ESLint, lint errors, unused variables, no-unused-vars, react-hooks, ref during render, setState in effect, react-refresh, vendored code exclusion, dependency cleanup, n8ao, three-good-godrays, @types, playwright, unused dependencies, package.json
**Summary:** Fix 98 ESLint errors (exclude 80 vendored, fix 18 in src/) and remove 5 unused dependencies

### design-rule-enforcement.md
**Topics:** design rules, flat black, #000, #000000, prefers-reduced-motion, reduced motion, accessibility, a11y, opacity only, no transform entrance, translateY, animation, transition, CSS custom properties, color tokens, amber usage, teal usage, red-felt, verify-all checks, automated compliance
**Summary:** Fix #000 CSS violation, add prefers-reduced-motion to MiniPlayer/DevTuner CSS, replace translateY entrance animation, add 6 automated design rule checks to verify-all.sh

---

## Phase 2: Ideation & Spec Design

### unified-scroll-arc.md
**Topics:** unified experience, continuous scroll, one journey, emotional sequence, money moments, peak experiences, atmospheric transition, camera spline, scroll segments, emotional atlas, innocent awakening, peaceful heartache, the search, bittersweet, acceptance, JTBD, audience, music supervisor, listener, discoverer
**Summary:** Design the ONE continuous scroll experience — emotional territory sequence, money moments, atmospheric transitions, camera path, content placement serving all 4 audience JTBDs

### research-integration.md
**Topics:** AutoResearch, pipeline, experiment winners, 60/70, DOF v3, split-tone, wave wind, firefly count, Kuwahara, atmosphere fix, portpoo, taste notes, bioluminescent effect stack, simulation over animation, fog proximity reveal, dimensional crossover, hand-drawn displacement, destroy to reveal, web extractor, curl noise, wave propagation
**Summary:** Integrate 72+ AutoResearch experiment winners and 6 portpoo taste notes into the unified experience with prioritized implementation briefs

### algorithmic-art.md
**Topics:** mathematical legitimacy, algorithmic, strange attractor, Lorenz, curl noise, flow field, Voronoi, reaction-diffusion, Gray-Scott, L-system, Verlet cloth, Perlin worm, procedural, simulation, real systems, anti-clustering, GitHub source, shader theft
**Summary:** Identify where mathematical/algorithmic systems (attractors, curl noise, Voronoi, reaction-diffusion) add genuine beauty, with prototype shaders from real repos

### front-end-design.md
**Topics:** typography, two-voice, serif, sans-serif, Cormorant Garamond, Inter, glass card, content overlay, content sections, scroll-driven, opacity, artist name reveal, text-shadow, WCAG, contrast, accessibility, per-section treatment, landing, music, about, store, footer, gallery feel, off-center, asymmetric
**Summary:** Typography-as-environment design for DOM content layer — two-voice type system, per-section glass card evolution, world-responsive text, artist name reveal animation

---

## Phase 3: Implementation

### composable-subsystems.md
**Topics:** SubsystemRegistry, composable layers, activation, deactivation, scroll-driven, t-range, segment, lifecycle interface, init, update, activate, deactivate, dispose, stagger, frame budget, WorldEngine delegation, subsystem management
**Summary:** Architecture for subsystems as composable scroll-driven layers with SubsystemRegistry managing activation/deactivation per segment without frame drops

### source-research.md
**Topics:** shader theft, GitHub source, real repos, source research, template, evaluation, license, anti-clustering, header comment, citation, reference registry, shader-sources, al-ro, Nitash-Biswas, Alex-DG, daniel-ilett, nimitz, GPU Gems, Ashima
**Summary:** Process for finding, evaluating, and integrating real GitHub source code for new visual techniques — enforces the "no from-scratch GLSL" rule

### performance-optimization.md
**Topics:** FX budget, GPU cost, frame time, 60fps, 30fps, progressive loading, tier scaling, Tier 1, Tier 2, Tier 3, mobile fallback, CSS fallback, per-effect enable, disable, Kuwahara tier, early-out, zero-strength, fragment shader optimization, throttle, particle count
**Summary:** FX budget system, progressive subsystem loading, tier-aware quality scaling, and shader early-out optimizations for the unified experience
