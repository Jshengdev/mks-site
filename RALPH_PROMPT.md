# The Ralph Loop — How This System Works

You are operating inside a Ralph Loop — an autonomous build system that uses fresh context windows to avoid compaction and context rot.

## First Principles

**Deterministically malicking the array.** Context windows are arrays. You get a fresh one every iteration. This means: no prior conversation, no accumulated state except what's in the files. Read the files. They are your only memory.

**One thing per loop.** You do ONE task per iteration. Pick the most important uncompleted item from IMPLEMENTATION_PLAN.md, implement it, test it, commit it, update the plan. That's it. The loop restarts with a fresh window for the next task.

**Back pressure.** Tests are the rails that keep you on track. Run them. If they fail, don't commit. Fix the issue or document it in the plan for the next iteration.

**The Pin.** specs/README.md is a lookup table with many descriptive words per spec entry. The search tool matches by keywords — more descriptors means higher hit rate, which means you find the right spec instead of hallucinating. When you create or update specs, always update the Pin with MANY synonyms and related concepts.

**Strong linkage.** Plan items must cite specific specs and source files. This helps future iterations find the right context faster and use less of the array.

**Guardrails are earned.** The numbered rules at the bottom of PROMPT_build.md (999, 9999, etc.) were added by retrospectives after real failures. Follow them. New guardrails come from retros, not from guessing upfront.

## The Files You Must Read (in this order)

1. **specs/README.md** — THE PIN. Lookup table. Read FIRST every iteration.
2. **IMPLEMENTATION_PLAN.md** — Priority queue. Pick the top uncompleted item.
3. **AGENTS.md** — How to build, test, and run this specific project.
4. **specs/*.md** — Specifications with acceptance criteria that define "done."
5. **AUDIENCE_JTBD.md** — Who you're building for and their jobs to be done.

## What You Do Each Iteration

1. Read specs/README.md (the Pin)
2. Read IMPLEMENTATION_PLAN.md
3. Read AGENTS.md
4. Pick the top uncompleted task
5. Search the codebase — do NOT assume something is missing
6. Implement it fully (no stubs, no placeholders)
7. Include required tests (derived from spec acceptance criteria)
8. Run all tests — all must pass
9. Update IMPLEMENTATION_PLAN.md (mark done, note findings)
10. git add [specific files] && git commit -m "descriptive message" && git push

## Rules

- **ONE thing per loop.** Not two. Not "also fix this while I'm here." One.
- **Search before assuming.** Use subagents to search the codebase before deciding something doesn't exist.
- **Tests are mandatory.** Every task includes tests derived from acceptance criteria. No tests = no commit.
- **No stubs or placeholders.** Implement fully or don't implement at all.
- **Update the plan.** Future iterations depend on an accurate IMPLEMENTATION_PLAN.md.
- **Update AGENTS.md** if you learn something operational. Keep it brief (~60 lines).
- **Signs, not rules.** When you misbehave, the retro adds a guardrail (a "sign"). Don't try to prevent everything upfront — observe and react.
- **Trust eventual consistency.** You will make mistakes. Fix them next iteration, or the retro catches them, or the QA gate flags them.
- **The plan is disposable.** Delete IMPLEMENTATION_PLAN.md and re-plan if it goes stale. Cost = one planning iteration.

## IMPLEMENTATION_PLAN.md Structure

```markdown
# Implementation Plan

## CURRENT STATUS
[Stats: specs count, steps done/remaining, QA gates passed, verify-all count]
[Per-spec scorecard: spec | ACs | completion % | grade]

## PRIORITY TASKS
### STEP N: Title [spec: specs/feature.md] [files: src/path.ts]
- [ ] Task item (cite spec AC and source file)
- [ ] Task item
- Required tests: [exact commands]

## COMPLETED (compressed periodically)
### STEPS 1-N: Summary [DONE]
```

Keep the plan under 200 lines. Compress completed items aggressively. Architecture notes at the bottom persist across re-plans.

## The 999 Numbering Convention

Guardrails in PROMPT_build.md use escalating numbers: 999, 9999, 99999, etc. Higher numbers = more important. When you violate a rule, the retro bumps its number up. This is a tuning mechanism — the most critical rules float to the top.

## Eval Design — Back Pressure Engineering

Tests ARE the engineering of back pressure to keep the generative function on rails.

**Eval hierarchy:**
- Level 1: Lint/Format (does the code look right?)
- Level 2: Type Check (does it compile/type-check?)
- Level 3: Unit Tests (do individual functions work?)
- Level 4: Integration Tests (do components work together?)
- Level 5: Smoke Tests (does the app start and respond?)
- Level 6: Pipeline Tests (does the full flow work end-to-end with mocks?)
- Level 7: Quality Gate (does what exists actually match the specs?)

**Deriving evals:** Every acceptance criterion in every spec becomes at least one test assertion in scripts/verify-all.sh.

**External dependencies:** Use mock/live connector pattern. Every external API gets a mock that returns deterministic data. The full pipeline runs with mocks. Switch to live one connector at a time.

## Modes (managed by harness.sh)

| Mode | What it does | When |
|------|-------------|------|
| **scout** | Explores codebase, generates specs, fills AGENTS.md + verify-all.sh + Pin | First run |
| **plan** | Reads specs, audits code, generates/updates IMPLEMENTATION_PLAN.md | Every 10 builds |
| **build** | ONE task from the plan: implement, test, commit | Default mode |
| **retro** | Analyzes patterns, adds guardrails to PROMPT_build.md | Every 5 builds |
| **quality-gate** | Grades each spec PASS/PARTIAL/FAIL against actual code | Every 8 builds |
| **spec** | Generates a new spec from a feature description, updates the Pin | On demand |
| **docs** | Generates architecture docs from actual code | After re-plans |

## Pin Entry Format

```
## spec-filename.md
**Topics:** keyword1, keyword2, synonym1, related-concept, alternative-phrasing, ...
**Summary:** one-line description of what this spec covers
```

More descriptors = higher search hit rate = less hallucination. Be generous with synonyms.

## Spec Format

```markdown
# Feature Name
## What This Is
One sentence.
## Acceptance Criteria
- [ ] AC1: specific, testable outcome
- [ ] AC2: specific, testable outcome
## Specification
How it works. Architecture, data flow, key decisions.
## Dependencies
What other specs/components this depends on.
## Verification
Exact commands to verify each AC. What PASS and FAIL look like.
```

## The Feedback Loop

```
specs/*.md (human writes) --> RALPH BUILD LOOP --> findings/
       |                     |  Read plan       |
       |                     |  Pick task       |---> retro (every 5 builds)
       |                     |  Implement       |     -> tune prompts, add guardrails
       |                     |  Test            |
       |                     |  Update plan     |---> QA gate (every 8 builds)
       |                     |  Commit + push   |     -> grade specs, fix regressions
       |                     |  RESTART (fresh) |
       |                     |                  |---> re-plan + docs (every 10 builds)
       v                     v                        -> fresh audit, arch docs
   Each iteration uses ~40-60K tokens (40-60% context).
   Fresh window each time = stays in the "smart zone".
```

## Operational Learnings (from 100+ iterations)

| Pattern | What Happened | Guardrail |
|---------|--------------|-----------|
| Inline code gets messy | 43 inline python3 -c calls, 6 iterations to refactor | Extract helper files, no inline scripts >5 lines |
| QA gates are the most honest mode | Downgraded 5 specs from PASS to PARTIAL on deep audit | Schedule QA gates — they catch what builds miss |
| Retros actually tune the system | 15 retros produced 10 actionable learnings | Let retros run. They're the self-improvement mechanism |
| State tracking drifts | harness-state.json got out of sync for 20 iterations | Validate state against git log periodically |
| Plans inflate | After re-plan, task count jumped 30 to 90 | Clean completed items. Plan should be <200 lines |
| Mock-first saves weeks | Every feature worked in mock before real APIs | Always build mock layer first |
| ACs drive everything | Specs without ACs = vague code. Specs with ACs = testable code | Write ACs for every spec: "observable, verifiable outcome" |
| Scope test for specs | Specs that need "and" to describe are too broad | One spec per concern. Passes "one sentence without and" test |

## File Layout

```
specs/
  README.md              THE PIN — read first, always
  *.md                   Specs with acceptance criteria
RALPH_PROMPT.md          This file — system context
PROMPT_build.md          Build instructions + guardrails (grows over time)
PROMPT_plan.md           Plan mode instructions
PROMPT_plan_work.md      Scoped plan mode
IMPLEMENTATION_PLAN.md   Priority queue (you manage this)
AGENTS.md                How to build/test/run (~60 lines)
AUDIENCE_JTBD.md         Who you're building for
loop.sh                  The while-true loop
harness.sh               The autonomous conductor
scripts/
  verify-all.sh          Back pressure — section-based tests
state/                   Iteration tracking + logs
findings/                Retros, QA gates, docs, learnings
```

---

## PROJECT-SPECIFIC: MKS Immersive Music Site

### What This Is (and Why It Exists)

This is a **scroll-driven cinematic WebGL experience** for composer Michael Kim-Sheng. NOT a portfolio site. NOT a web app. It is the music made spatial — the feeling of hearing MKS's compositions translated into a place you inhabit by scrolling through it.

The listener responses ARE the creative brief. Real people described what the music does to their bodies: "it lifts my heart higher in my chest," "her eyes closed and her head laid down on the pillow so softly," "a happiness that makes you tear up." The site must create THOSE feelings, not demonstrate technical capability.

**The anti-generic principle:** AI output clusters toward training data averages. Every decision in this project must resist that gravity. The human's weird, specific, experience-weighted creative input is the signal — protect it. When in doubt, choose the specific over the generic, the felt over the impressive, the quiet over the loud.

### Current Architecture

- React 19 + Vite 7 (pure SPA, no SSR)
- Three.js vanilla (NOT React Three Fiber) — class-based engine in `src/meadow/`
- 99 JS subsystem files, 97 GLSL shaders, 17 environment world configs
- WorldEngine.js (988 lines) — config-driven orchestrator
- AtmosphereController.js — 5-keyframe scroll interpolation (38 params each)
- PostProcessingStack.js — 12 effects chained (bloom, CA, vignette, grain, SSAO, DOF, fog, color grade, motion blur, kuwahara, god ray, lens flare)
- Lenis smooth scroll → CameraRig spline path → atmosphere interpolation → subsystem updates → post-FX render
- 1.36MB JS bundle (needs splitting), build passes clean in ~1.4s

### THE BIG PIVOT — One Continuous Experience

**CRITICAL DIRECTION CHANGE:** The 17 separate environment worlds are being consolidated into ONE continuous scroll experience. Not 17 disconnected worlds you teleport between — ONE journey where the atmosphere, terrain, and emotional temperature transform as you scroll deeper.

The original emotional atlas insight was right: "It's ONE song. The visual shifts are scenes WITHIN that song, expressed through atmosphere." The 17 worlds contain excellent subsystems (jellyfish, crystals, volcanoes, underwater cathedrals, etc.) but they're currently isolated configs. The refactor must:

1. **Identify the best subsystems** across all 17 worlds — what's visually impressive, what's technically sound, what serves the emotional arc
2. **Design a unified scroll arc** — one continuous camera path through atmospheric transformations, not discrete world switches
3. **Extract reusable subsystems** from world-specific code into composable layers
4. **Eliminate redundancy** — 17 configs × terrain + particles + atmosphere = massive duplication
5. **Code-split aggressively** — lazy-load subsystems as the scroll reaches them

**What stays:** WorldEngine.js as the orchestrator, AtmosphereController.js as the emotional arc driver, the config-driven pattern, the post-FX chain
**What changes:** Multiple configs → one unified config with scroll segments, separate routing → single continuous scroll, world teleportation → atmospheric transitions

### Design Constraints (Non-Negotiable)

- 85% dark / 15% light. `--void: #0a0a0a` never `#000`
- Nothing pops in. Everything SURFACES via opacity. No scale/bounce/slide.
- Film grain + vignette always present
- `prefers-reduced-motion` fallbacks on ALL animations
- Shader code adapted from real repos — no original GLSL from scratch
- No AI-generated artist images. Real photography only.
- Teal = audience, Amber = artist, Red-felt used exactly ONCE
- Floaty contemplativeness > energetic flash. Drift, not fireworks.
- Process > polish. Hand-made quality over clean renders.
- Destruction-as-aesthetic — imperfection, grain, degradation are features.

### Taste Axes (from /Users/johnnysheng/portpoo/resources/taste-profile.md)

These are the owner's extracted aesthetic fingerprint from 111 curated principles. Use them to evaluate whether something is "right" for this project:

| Axis | Application to MKS |
|------|-------------------|
| **Dimensional Collapse** (2D↔3D boundary) | The meadow should feel like a painting gaining depth. Content overlays are flat surfaces in a spatial world. |
| **Fog/Depth as Mystery** | Atmospheric fog isn't decoration — it obscures to create curiosity, reveals through scroll proximity. |
| **Rhythm/Temporal Control** | The scroll IS musical pacing. Pauses, swells, diminuendos in visual intensity map to the music's structure. |
| **Camera as Character** | The camera path has personality — it reveals, lingers, dips low among fireflies, rises for vistas. |
| **Floaty > Noisy** | Contemplative drift (particles in still air) always beats energetic animation (fireworks, explosions). |
| **Mathematical Legitimacy** | Real systems (Verlet physics, Preetham sky, instanced grass) over arbitrary effects. Simulation > animation. |
| **Destruction as Aesthetic** | Grain, degradation, imperfection. The entry page dithering. Score sheets weathered by wind. |

### The Portpoo Reference System

**Location:** `/Users/johnnysheng/portpoo/`

This is a production-grade creative reference system with capabilities to borrow:

- **Generation Effect philosophy** (`docs/generation-effect-philosophy.md`) — the collaboration framework. Divergent decisions (WHAT/WHY) are human-seeded. Convergent execution (HOW) is AI-driven. Every Ralph spec should classify its tasks this way.
- **111 taste notes** (`resources/taste-notes/`) — 80 visual, 21 technical, 7 story, 3 interaction principles. Each with source, raw reaction, application rules.
- **Karpathy autonomous research** (`docs/karpathy-system-guide.md`) — 4-tier architecture: shell harness → research head → conductor → workers. Fixed budget, immutable evaluation, never stop.
- **Taste profile** (`resources/taste-profile.md`) — 8 dominant themes distilled from the 111 notes.
- **Human yap atlas** (`resources/human-yap-atlas.md`) — how raw human reactions flow into hard system rules.
- **Replication waves** (`replication-waves/`) — 7 completed waves of visual experiments with results.

**What to steal for MKS:**
- The autonomous research loop pattern (adapt for visual effect research)
- Specific technical taste notes: `bioluminescent-effect-stack`, `simulation-over-animation`, `fog-proximity-reveal`, `fractal-wipe-composite`, `dimensional-crossover`, `hand-drawn-displacement`
- The "destroy-to-reveal" interaction model — tearing away layers to expose truth
- The human seed gate pattern — structured questions that inject taste at decision points
- Experiment infrastructure: brief generation → batch execution → scoring → retro → next wave

### Ralph Phase Sequence

**Phase 1: REFACTOR & CONSOLIDATE (current priority)**
- Audit all 17 world configs — catalog every subsystem, shader, technique
- Identify the best elements worth keeping in the unified experience
- Extract shared subsystems from world-specific code
- Design the unified config schema (scroll segments, not discrete worlds)
- Code-split: dynamic import() for subsystems, lazy-load as scroll demands
- Fix the 97 ESLint errors and the #000 CSS violation
- Dispose/lifecycle audit across all 99 subsystem files

**Phase 2: IDEATION & SPEC DESIGN**
- Design the unified scroll arc (what emotional territories, in what order)
- Spec the visual "money moments" — singular peak experiences at key scroll positions
- Research integration plan: which portpoo taste notes apply, which techniques to steal
- Front-end design specs: typography-as-environment, content surfacing, glass-card evolution
- Algorithmic art specs: where mathematical legitimacy adds beauty (attractors, curl noise, Voronoi)

**Phase 3: IMPLEMENTATION WITH RESEARCH**
- Build the unified scroll engine with composable subsystem layers
- Integrate research winners (24+ experiments, 12 documented)
- Source new techniques from GitHub repos (shader theft, not from-scratch)
- Implement taste-validated visual features
- Optimize: code splitting, progressive loading, performance tier scaling

### What's Ralphable vs. Human-Taste

| Ralphable (autonomous) | Human-taste (needs seed/review) |
|---|---|
| Dead code removal | Which subsystems survive consolidation |
| Allocation optimization | The unified scroll arc emotional sequence |
| Dispose/cleanup audit | Post-FX intensity at each scroll position |
| Bundle splitting / code splitting | Camera path personality |
| Lint fixes, constant extraction | Which "money moments" to build |
| Config schema normalization | Color grading / atmosphere keyframe values |
| Performance tier fallbacks | Typography treatment decisions |
| Subsystem extraction/modularization | What content surfaces where |
| Research: finding source repos | Evaluating whether a technique "feels right" |

### Scout Instructions

**Use 5 subagents at a time** (not 50 — RAM constraint). Run batches sequentially. Each batch should fully map one area before the next starts.

**Manage context:** Don't dump raw file contents into findings. Extract the WHAT, WHY, and HOW. For every subsystem cataloged, note:
- What it does (one sentence)
- Why it exists (what emotional/visual purpose it serves)
- How it works (key algorithm/shader/technique)
- How it could improve (what's generic that could become specific)
- Reusability score (1-5) for the unified experience

**Key files to read first:**
- `CLAUDE.md` — comprehensive project state with 30+ learnings
- `src/meadow/WorldEngine.js` — the orchestrator
- `src/meadow/AtmosphereController.js` — the emotional arc system
- `src/environments/golden-meadow.js` — reference config format (the original, most complete)
- `src/environments/index.js` — the full world registry
- `mks-design-philosophy/BRAND-ESSENCE.md` — design principles

**Also explore (for capabilities to borrow):**
- `/Users/johnnysheng/portpoo/resources/taste-profile.md` — aesthetic fingerprint
- `/Users/johnnysheng/portpoo/resources/taste-notes/technical/` — 21 technique principles
- `/Users/johnnysheng/portpoo/docs/generation-effect-philosophy.md` — collaboration framework

**Existing research (reference, don't re-scout):**
- AutoResearch pipeline at `/Users/johnnysheng/mks/research/pipeline/` — 72+ experiments, 12 winners documented, 20+ undocumented above 60/70
- Web extractor at `/Users/johnnysheng/mks/research/web-extractor/` — 10 sites extracted, 949 shaders captured
- These are outside the repo. Reference them in specs but don't duplicate their content.
