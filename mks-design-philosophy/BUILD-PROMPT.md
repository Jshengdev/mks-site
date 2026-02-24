# MKS Website Build Prompt

Copy everything below the line and paste it as your prompt.

---

## THE PROMPT

I'm building the website for Michael Kim Sheng (MKS), a composer. The complete design philosophy, brand story, technical research, and pre-development master plan already exist. Your job is to read the key documents, understand the vision, and build the first scaffolding of the site.

### STEP 1: Read these files IN THIS ORDER

**The build document (read this first — it's the single source of truth):**
```
mks-design-philosophy/PRE-DEVELOPMENT-MASTER.md
```

**The design system (color tokens, CSS custom properties, the 10 commandments):**
```
mks-design-philosophy/DESIGN-SYSTEM.md
```

**The style decisions (all locked-in choices — cold world/warm moments, typography, interaction level, etc.):**
```
mks-design-philosophy/STYLE-DECISIONS.md
```

**The narrative structure (the real story — 6 acts, key quotes, design implications per act):**
```
mks-design-philosophy/NARRATIVE-STRUCTURE.md
```

**The cross-reference (unified map: narrative act → site section → emotion → visual → ambient scene):**
```
mks-design-philosophy/CROSS-REFERENCE.md
```

**The effects technical reference (p5.js/WebGL/Three.js implementation guide for all ambient scenes):**
```
mks-design-philosophy/EFFECTS-TECHNICAL-REFERENCE.md
```

**The storytelling web patterns (scroll-driven narrative, music-driven experiences, commerce-inside-atmosphere):**
```
mks-design-philosophy/storytelling-web-reference.md
```

**Read if needed for deeper context:**
```
mks-design-philosophy/BRAND-ESSENCE.md
mks-design-philosophy/BRAND-STORY.md
mks-design-philosophy/EMOTIONAL-MAP.md
mks-design-philosophy/VISUAL-LANGUAGE.md
mks-design-philosophy/SITE-ARCHITECTURE.md
```

### STEP 2: Read the existing codebase

The site already exists as a React 19 + Vite app. Read these files to understand the current patterns:
```
package.json
vite.config.js
index.html
src/main.jsx
src/App.jsx
src/App.css
src/index.css
src/FlowerVisual.jsx
src/MiniPlayer.jsx
src/MiniPlayer.css
src/MoonlightCursor.jsx
```

### STEP 3: Build the first scaffolding

Using the PRE-DEVELOPMENT-MASTER.md as the build spec, create the foundational scaffolding of the new site. This means:

**A. Install dependencies:**
- `framer-motion` (scroll engine — `useScroll`, `useTransform`, `motion`)
- `p5` (ambient scenes — instance mode, NOT react-p5)
- `three` + `@react-three/fiber` + `@react-three/drei` (3D score sheets)

**B. Set up the CSS foundation:**
- Implement the full `:root {}` block from DESIGN-SYSTEM.md (all 70+ CSS custom properties)
- Set up the global overlay stack (film grain `body::after`, vignette `body::before`, analog filter on images, ambient color shift animation)
- Typography system: placeholder font families for now (serif display, sans-serif body, monospace data) — we'll pick exact faces later

**C. Create the section architecture:**
Build out the scroll-driven section structure with 6 sections, each as its own component:

1. `LandingSection.jsx` — The void → sky cracking open → name reveal. 100vh hold + scroll transition.
2. `MusicSection.jsx` — Ocean surface with cursor-reveal. Track listing with horizontal band composition. Pinned scroll sections for featured tracks.
3. `AboutSection.jsx` — Grass field ambient. Asymmetric text layout. Piano-with-flowers image placement. Pull quotes in serif.
4. `StoreSection.jsx` — Warm-black background. Gallery-style product presentation. One product per viewport.
5. `TourSection.jsx` — Cool-warm tension. Tour dates as horizontal bands with window-effect framing.
6. `FooterSection.jsx` — The gradient fade. Minimal content. The exit dissolve.

**D. Build the ambient scene infrastructure:**
- Create a reusable `AmbientCanvas.jsx` component using p5.js instance mode with `useRef` (extend the existing FlowerVisual.jsx pattern)
- Build the first ambient scene: the **Sky with Crepuscular Rays** for the landing section (Perlin noise clouds, fBm, radial light rays from hidden sun point) per EFFECTS-TECHNICAL-REFERENCE.md Section 3
- Set up the scene transition system skeleton (the noise-dissolve framework, even if individual transitions come later)

**E. Integrate the existing components:**
- Keep `MiniPlayer.jsx` but plan for the shared AudioContext singleton pattern
- Adapt `MoonlightCursor.jsx` for the new atmospheric context
- Retire or evolve `FlowerVisual.jsx` into the new ambient scene system

**F. Implement the scroll engine:**
- Use `framer-motion`'s `useScroll()` for scroll progress tracking
- Each section registers its scroll range
- Scroll progress drives: section transitions, ambient scene state, color temperature shifts, element reveals
- The landing section has a 3-5 second hold before scroll begins (the void, the silence)

### STEP 4: Follow these rules while building

1. **The 10 Commandments** from DESIGN-SYSTEM.md are non-negotiable. Especially: darkness is the canvas (85/15 ratio), one thing glows, warmth is earned, nothing pops in — everything surfaces.
2. **Extend existing patterns** — don't rebuild from scratch. The `FlowerVisual.jsx` canvas pattern, the `MiniPlayer.jsx` audio handling, and the glass-card styling are all architecturally sound.
3. **Performance budget** — target 60fps on mid-range hardware. Use `pixelDensity(1)`, half-resolution offscreen buffers for shaders, visibility-based animation pausing. Mobile gets simplified scenes (static images + CSS animations instead of p5.js).
4. **Respect `prefers-reduced-motion`** — all ambient animations and scroll-triggered reveals must have reduced-motion fallbacks.
5. **The name reveal** — MICHAEL KIM SHENG appears as light before letterforms. `text-shadow` glow first, then opacity. Small (`clamp(1rem, 2vw, 1.5rem)`). Serif. The 2% focal point principle.
6. **Color temperature shifts on scroll** — the site goes from cold (landing) to cool-teal (music) to warm-green (about) to hot-amber (store) to cool-warm (tour) to void (footer). This is the four seasons.
7. **Commit after each major section is scaffolded** so progress is saved incrementally.

### WHAT SUCCESS LOOKS LIKE

When done, the site should:
- Load to a dark void that slowly reveals a sky with light rays
- The name MICHAEL KIM SHENG appears as a glow resolving into text
- Scrolling moves through 6 distinct atmospheric sections with color temperature shifting
- Each section has its ambient canvas placeholder (even if the full shader isn't implemented yet)
- The MiniPlayer persists across sections
- The global overlays (grain, vignette, light leak) are running
- Mobile has graceful fallbacks
- The emotional arc of scrolling FEELS like the four seasons: cold → cool → warm → hot → cool → void
