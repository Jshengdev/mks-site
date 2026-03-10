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

A scroll-driven cinematic website for composer **Michael Kim-Sheng**. Not a portfolio. Not a template. A feeling — the site should make you feel the way his music makes you feel: like something sealed off inside you just opened.

The site is a single React app (no router) with state-based page switching between three views: **Home** (the cinematic scroll experience), **Contact** (glass-card form + info), and **Tour** (placeholder, currently shows hero content).

## Tech Stack

- **React 19** + **Vite 7** — no Next.js, no SSR, pure SPA
- **Vanilla CSS** — no Tailwind, no CSS-in-JS, no preprocessors
- **Canvas API** — hand-rolled for mask effects, flower fields, grain overlay
- **Web Audio API** — AnalyserNode for visualizer, volume ramping on scroll
- **Simplex noise** — custom implementation in `utils/noise.js` for organic distortion
- No framer-motion yet (planned). No Three.js yet (planned for 3D score sheets).

## Architecture

```
src/
  App.jsx              — Root shell, Nav, ContactPage, page routing (useState)
  LandingSection.jsx   — 4-phase scroll sequence (title → warmth → wave → flowers)
  FlowerField.jsx      — 200 procedural flowers, bloom on wave pass, audio-reactive
  FlowerVisual.jsx     — Ambient flowers on Contact/Tour pages
  MiniPlayer.jsx       — Fixed audio widget, analyser visualizer, draggable seek
  MoonlightCursor.jsx  — Custom cursor with bezier trail + dust/petal particles
  Overlays.jsx         — Film grain (128x128 canvas, 12fps) + vignette (always on)
  useScrollAudio.js    — Hook: ramps audio volume based on wave scroll progress
  utils/
    flowers.js         — Flower types, field generation, drawing functions
    noise.js           — 2D simplex noise (seed 42)
```

### Page Routing
No React Router. `App.jsx` holds `page` state (`home` | `contact` | `tour`). Nav only shows on non-home pages. LandingSection is the home page — it's the main event.

### The Landing Scroll Sequence (the core experience)
Four phases driven by scroll position (0-100%):
1. **0-22%** — Title reveal over video background
2. **22-44%** — Warming overlay fades in (amber radial gradient)
3. **44-78%** — Wave effect sweeps left-to-right, erasing dark mask to reveal flower field
4. **78-100%** — Full field visible

The wave uses a canvas mask at half resolution with Perlin noise distortion on the edge. Audio volume ramps with the wave (silent until 30%, full at 50%).

### Layer Stack (z-index)
0: Video background → 0: Warming overlay → 1: Dark mask canvas → 2: FlowerField canvas → 3: Phase text content → 9990: Film grain → 9991: Vignette

## Design First Principles

These are non-negotiable. Every decision filters through them.

### YES — What We Want
- **Cinematic pacing** — everything reveals slowly, nothing pops in
- **Dark dominance** — 85% dark, 15% light. Black is not absence, it's atmosphere
- **Surfaces, not pops** — opacity transitions only. No scale/bounce/slide entrances
- **Nature as structure** — ocean, sky, grass, golden hour are emotional metaphors, not decoration
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

### Nature Elements by Section
| Section | Nature | Emotion |
|---------|--------|---------|
| Landing | Sky, clouds, crepuscular rays | Liberation, vastness |
| Music | Ocean surface | Depth, immersion |
| About | Grass, plains | Journey, grounding |
| Store | Golden hour light | Warmth, desire |
| Tour | Night sky | Gathering, anticipation |
| Footer | Dusk haze | Departure, carrying the feeling |

## Performance Patterns
- Canvas at half resolution (divide dimensions by 2) for mask/flower rendering
- Grain refreshes at 12fps, not 60fps
- Flowers only render when `bloomState > 0.01`
- Audio context lazy-initialized on first play
- FFT size 128 (smallest useful) for analyser

## Where to Read More

All design philosophy lives in `mks-design-philosophy/`:

| Doc | What It Covers |
|-----|---------------|
| `BRAND-ESSENCE.md` | Core truth, non-negotiables, what the site must feel like |
| `BRAND-STORY.md` | Narrative architecture, seasonal arc, the white horse mythology |
| `VISUAL-LANGUAGE.md` | Light/dark principles, typography rules, motion philosophy |
| `SITE-ARCHITECTURE.md` | Six sections breakdown, landing sequence, store philosophy |
| `EMOTIONAL-MAP.md` | User journey stages, brand vocabulary vs anti-vocabulary |
| `DESIGN-SYSTEM.md` | Color tokens, motion scales, seven core visual patterns |
| `STYLE-DECISIONS.md` | Locked-in choices — temperature, nature, piano imagery, interaction level |
| `NARRATIVE-STRUCTURE.md` | Mike's real story mapped to six acts, audience insights |
| `CROSS-REFERENCE.md` | Unified spec — maps acts to sections, colors, emotions |
| `EFFECTS-TECHNICAL-REFERENCE.md` | p5.js patterns, shader specs, Three.js approach, audio integration |
| `PRE-DEVELOPMENT-MASTER.md` | Single build document — section specs, technical stack, component list |
| `IMAGE-ANALYSIS.md` | 15 reference images analyzed — the visual DNA |

**Read `BRAND-ESSENCE.md` and `STYLE-DECISIONS.md` first** if you need to make any design decision. They are the two most important documents.

## What's Built vs. What's Planned

### Built
- Landing scroll sequence (4 phases, wave mask, video bg)
- Generative flower field (200 flowers, 3 depth layers, wave-triggered bloom)
- MiniPlayer with analyser visualizer
- MoonlightCursor with trail + dust particles
- Film grain + vignette overlays
- Contact page with glass-card form
- Scroll-linked audio volume ramping

### Not Yet Built
- MusicSection (ocean surface, cursor-reveal score sheets, pinned sections)
- AboutSection (grass field, piano+flowers image, narrative pulls)
- StoreSection (warm-black gallery, one product per viewport, cinematic product shots)
- TourSection (cool-warm tension, window-effect venue cards)
- FooterSection (gradient fade, minimal departure)
- Three.js score sheets flying through sky
- framer-motion scroll engine (currently using raw getBoundingClientRect)
- Audio singleton / shared AudioContext
- Ambient p5.js scenes per section (ocean, grass, golden hour)

---

## Learnings Log

<!-- Append new learnings here with date. Format: - YYYY-MM-DD: What was learned -->
