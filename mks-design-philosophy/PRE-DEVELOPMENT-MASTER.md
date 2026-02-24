# MKS Pre-Development Master

**The single document. Everything needed to build. Nothing else to read.**

Built from: 14 image analyses, 4 brand philosophy docs, narrative structure, style decisions, cross-reference synthesis, p5.js/WebGL/Three.js technical research, and storytelling portfolio patterns.

---

## THE SITE IN ONE PARAGRAPH

A scroll-driven cinematic experience where the user moves through emotional seasons. The landing is a dark sky cracking open with crepuscular rays — score sheets drift through it, liberated from the page. Scrolling moves through ocean (Music), open plains (About), golden hour (Store), night city (Tour), and dusk fade (Footer). Each section has its own generative p5.js/WebGL ambient scene. The music is the star — when it plays, the environment responds (warms, moves, reveals). Two real photographs anchor the atmosphere. Everything else is generative, typographic, or interactive. The store is the warmest room. The exit is a fade, not a wall.

---

## TECHNICAL STACK

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | React 19 + Vite (existing) | Already built, keep it |
| Scroll engine | `framer-motion` (`useScroll`, `useTransform`) | Best React integration for scroll-driven animation |
| 2D ambient scenes | p5.js instance mode + WebGL/GLSL shaders | Ocean, sky, clouds, grass, grain, light leaks. Extend existing `FlowerVisual.jsx` pattern. |
| 3D elements | Three.js via `@react-three/fiber` | Score sheets flying through sky with proper 3D rotation, lighting, depth |
| Audio integration | Shared `AudioContext` singleton + `AnalyserNode` | Connect `MiniPlayer.jsx` to visual layers. Frequency bands drive visual parameters. |
| Typography | Variable serif (display) + variable sans-serif (body) | Two voices per STYLE-DECISIONS #9 |
| Commerce | Headless Shopify or Stripe | Glass-panel overlay on atmospheric layer |
| Transitions | GLSL noise-dissolve shaders | Organic scene morphing (sky particles → ocean particles → grass particles) |
| Global overlays | CSS (grain, vignette, light leak) | Runs on GPU compositor, zero JS cost |

**Do NOT use:** `react-p5` (unmaintained, incompatible with React 19). Use p5.js instance mode with `useRef` directly.

---

## THE SCROLL JOURNEY — SECTION BY SECTION

### 1. LANDING (Viewports 1-2) — "The Knowing"

**Narrative:** Prologue. The return. "I've always known I was going to be a composer."

| Property | Value |
|----------|-------|
| Duration | 100vh hold + 100vh transition |
| Background | `--void` (#0a0a0a) |
| Ambient scene | **Sky + Crepuscular Rays** (p5.js WEBGL). Clouds rendered via fBm Perlin noise. Rays fan from hidden sun point (center-bottom). Score sheets drift through the sky (Three.js 3D planes with staff-line textures, wind physics). |
| Photo used | **img13 (crepuscular rays)** — composited into the generative sky as the base atmosphere, with procedural clouds layered on top |
| Color temp | Cold. Maximum darkness. `--void` dominant. Only light is the rays and the score sheet parchment glow. |
| Name reveal | Light before word. `text-shadow: 0 0 40px rgba(232,224,200,0.3)` appears first, then letterforms resolve over 2s. Serif typeface. Small — `clamp(1rem, 2vw, 1.5rem)`. The 2% focal point. |
| Interaction | None on load. 3-5 second hold (the void, the silence). Scroll begins the sky parting. Nav hidden until first scroll. |
| Music | Silent. Or: a single sustained note begins, barely audible. |
| Transition out | Noise dissolve. Sky particles descend, become water. The crepuscular rays fade as the ocean surface forms below. |
| Mobile | Static sky image (img13) with CSS parallax. No Three.js. Score sheets as CSS-animated flat elements. |

### 2. MUSIC / LISTEN (Viewports 3-5) — "The Sketching Phase + The Voice"

**Narrative:** Act I + II. The ocean. Discovery beneath the surface. The music speaks.

| Property | Value |
|----------|-------|
| Duration | 300vh (pinned sections for featured tracks) |
| Background | `--void` + teal atmospheric wash (`--teal` at 0.08 opacity) |
| Ambient scene | **Ocean Surface** (p5.js WEBGL shader). Layered Perlin noise + sine waves for wave height. Colors: `--teal-deep` (#2a4a48), `--teal` (#4a6a68), `--teal-light` (#8aa8a8). |
| Cursor interaction | **The ocean-parting reveal.** Cursor movement creates a radial displacement in the water shader (smoothstep falloff, exponential decay trail). Beneath the water surface: score sheet imagery (the hidden layer). Moving the cursor reveals parchment and notation below the teal. |
| Color temp | Cool teal immersion → shifts warm on music play. When a track starts, `--amber` bleeds into the teal at the edges. Color restoration on interaction. |
| Track presentation | Horizontal band composition. Track listings as continuous material with thin `--divider` rules between them. On hover: exposed mechanics (duration, key signature, instrumentation appear). Monospace metadata. |
| Music | This is where music starts. The play button is `--teal`. When audio plays, `AnalyserNode` frequency data drives: sub-bass → background pulse, mids → wave intensity, highs → sparkle highlights on water surface. |
| Transition out | Ocean surface gradually shows grass blades growing through the water. Teal shifts toward green. |
| Mobile | Simplified ocean (CSS gradient animation). Tap to reveal scores instead of cursor. Horizontal scroll for track listing. |

### 3. ABOUT / STORY (Viewports 6-7) — "The Tension"

**Narrative:** Act III. The open plains. Survival vs. art. The bass note arriving.

| Property | Value |
|----------|-------|
| Duration | 200vh |
| Background | `--void` + golden directional gradient (`linear-gradient(135deg, rgba(232,200,120,0.08) 0%, transparent 60%)`) |
| Ambient scene | **Windswept Grass Field** (p5.js Canvas 2D). Bezier-curve blades, 4 depth layers, Perlin noise wind field. Colors from img06: `#1e3018` shadow, `#3a5a28` mid, `#5a7a40` lit tips. |
| Photo used | **img04 (piano with flowers)** — placed asymmetrically (`margin-left: 8vw`), `rotate(-1deg)`, the single organic accent in a text-heavy section. |
| Content | The story. Serif pull-quotes from the narrative ("No matter how far I stray from it, I'll always return to music"). Sans-serif body text. Mike's real words, structured as the tension arc. |
| Color temp | Warm. The most human section. `--amber` for emphasis, `--copper` for pull-quote marks. |
| Interaction | Parallax grass layers respond to scroll speed. Scroll fast: the grass bends harder. Scroll slow: it sways gently. The environment mirrors the reader's pace. |
| Transition out | Golden hour intensifies. Grass field fills with warm light. The sunset begins. |
| Mobile | Static grass image from img06 with parallax. Content-first layout. |

### 4. STORE (Viewports 8-10) — "The Taste + The Audience"

**Narrative:** Acts IV + V. Golden hour. The warmest room. Desire made tangible.

| Property | Value |
|----------|-------|
| Duration | 300vh (one product per viewport-height, gallery-style) |
| Background | `--warm-black` (#1a1208) — the ONLY warm-dark background on the site |
| Ambient scene | **Golden Hour Light** (p5.js). Directional warm wash via layered radial gradients. 45-second color temperature cycle. Score sheet texture at `opacity: 0.06` behind products. |
| Product presentation | Gallery mode. One product at a time, full viewport. Clean grid structure underneath, but each album exists in its own environmental world. The darker CD: night atmosphere. A pastoral album: grassy field with CSS-animated wind. Each product shot straight-on (the anti-dreamy mode — clarity for commerce). |
| Color temp | The warmest. `--amber` is dominant here. Products glow. |
| Typography | Serif for album titles. Sans-serif for price/description. The whisper weight — thin, generous spacing. |
| Interaction | Hover on product: `filter: brightness(1.15)`. The rim-light effect (`box-shadow: 0 0 20px 2px rgba(232,224,200,0.08)`). Add-to-cart button: `--teal` (the audience's color touching the artist's warm world). |
| The hidden red | `--red-felt` (#983028) used exactly ONCE on the entire site — as the active/selected state indicator on a product or cart element. The heart inside the machine. |
| Transition out | Warmth cools. Golden light fades to amber, then to the cool-warm tension of nightfall. |
| Mobile | Swipe-through product cards. Glass-panel overlay for cart. |

### 5. TOUR (Viewport 11) — "The Persona"

**Narrative:** Act VI. Night city. The invitation. "This is not someone you see on the street."

| Property | Value |
|----------|-------|
| Duration | 100vh |
| Background | `--void` + ambient warm glow at edges (`box-shadow: inset 0 -80px 120px -60px rgba(184,144,64,0.06)`) |
| Ambient scene | Minimal. The atmosphere cools. Dark with warm city-light scatter points. Optional: particle system at low density, warm amber dots drifting like distant city lights. |
| Content | Tour dates as horizontal bands. Each date framed as an invitation, not a listing. Venue name, city, date — serif type. Ticket link: `--teal`. The window effect: each date framed in dark borders, as if peering into the venue from outside. |
| Color temp | Cool-warm tension. Dual temperature. Industrial concrete + amber lamplight. |
| Performance shots | If used: inside-the-audience angle (img10 energy). Dark foreground silhouettes framing the bright performance space. |
| Interaction | Hover on a date: the ambient warm glow intensifies around that entry. The city gets warmer where you look. |
| Mobile | Simple list with glass-card styling per date. |

### 6. FOOTER (Viewport 12) — "The Departure"

**Narrative:** Epilogue. Dusk haze. The silence after the last song.

| Property | Value |
|----------|-------|
| Duration | 50-80vh (short — the fade should feel inevitable, not prolonged) |
| Background | `--gradient-footer`: `linear-gradient(to bottom, #1a1208 0%, #181618 40%, #0e0e10 100%)` — warm dark to cool dark to void |
| Ambient scene | Fading. Whatever scene was running reduces to particles, then to nothing. The grain overlay persists. The vignette deepens. |
| Content | Minimal. Social links. Copyright. Newsletter signup. All at `--text-muted` at 0.4 opacity. No warm accent. No CTA. No "back to top." |
| Color temp | Cooling to void. The narrow-range palette from img12. Lavender-grey dissolving. |
| Interaction | None. The anti-CTA. The user leaves when they're ready. The space is quiet. |
| Music | If music was playing, it could fade here. Or continue — letting the user carry it with them as they leave. |
| Mobile | Same gradient. Minimal content. |

---

## THE 2 PHOTOGRAPHS

Only 2 images from the reference collection appear on the actual site:

### 1. Crepuscular Rays (`crepuscular-rays-cloud-mass-backlit-blue.png`)
- **Where:** Landing page. Composited into the generative sky as base atmosphere.
- **Why:** This IS the brand's visual sentence. The hidden sun. The artist as source. The light you can't see but whose effects radiate outward.

### 2. Piano with Flowers (`upright-piano-open-hammers-flowers-golden-light.png`)
- **Where:** About section. Single organic image in a text-heavy section.
- **Why:** Embodies the convergence: tenderness inside the mechanism, organic meets precision, golden light transforming the functional into the sacred.

All other images are reference only — they informed color, composition, and mood but don't appear on the site. The site needs Mike's own photography, product shots, and score sheet scans for everything else.

---

## AUDIO-VISUAL INTEGRATION

The music is the star. When it plays, the environment responds.

### Shared AudioContext Pattern

```
MiniPlayer.jsx → AudioContext (singleton)
                    ↓
              AnalyserNode
                    ↓
         getByteFrequencyData()
                    ↓
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓
  Sub-bass       Mids           Highs
  (0-150Hz)    (300-2kHz)     (4kHz+)
    ↓               ↓               ↓
  Background    Wave/grass      Sparkle
  pulse/glow    intensity     highlights
```

### Frequency-to-Visual Mapping

| Band | Frequency | Visual Parameter | Scene Element |
|------|-----------|-----------------|---------------|
| Sub-bass | 0-150Hz | Background opacity pulse, slow breathing | All scenes — the heartbeat |
| Bass | 150-300Hz | Wave amplitude (ocean), wind intensity (grass) | Ocean, Grass |
| Low-mids | 300-800Hz | Color temperature shift toward warm | All scenes — warmth responding to melody |
| Mids | 800-2kHz | Cloud density/parting speed (sky), grass blade height | Sky, Grass |
| High-mids | 2-4kHz | Score sheet visibility (ocean reveal layer) | Ocean reveal layer |
| Highs | 4kHz+ | Sparkle/particle intensity, grain visibility | All scenes — texture responding to harmonics |

---

## SCENE TRANSITION SYSTEM

Scenes don't cut. They morph.

### Transition Sequence (scroll-driven)

```
SKY (Landing)
  ↓ noise dissolve: cloud particles descend, become water droplets
OCEAN (Music)
  ↓ organic growth: grass blades push through water surface
GRASS (About)
  ↓ golden wash: grass field floods with warm light
GOLDEN HOUR (Store)
  ↓ cooling fade: warm particles cool to amber dots, scatter
CITY LIGHTS (Tour)
  ↓ dimming: lights reduce to nothing
VOID (Footer)
```

### Technical Approach

Each transition uses a **GLSL noise-dissolve shader**: Perlin noise + vertical bias creates an organic boundary that sweeps across the viewport. The outgoing scene dissolves where noise value exceeds a threshold (driven by scroll position). The incoming scene is revealed beneath.

The transition boundary glows at `--amber` — a thin luminous edge between worlds. Like the horizon at sunset. Like the rim light on the cloud mass.

---

## GLOBAL OVERLAY STACK

Always running. Applied to the root element.

```css
/* 1. Film grain — body::after */
opacity: 0.03; mix-blend-mode: overlay;
/* Pre-rendered grain tile cycled at 24fps (best perf) */

/* 2. Vignette — body::before */
radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%);

/* 3. Analog color treatment — on all images */
filter: saturate(0.85) sepia(0.04);

/* 4. Ambient color shift — imperceptible, continuous */
animation: sunset-cycle 45s ease-in-out infinite alternate;
/* Shifts entire page between warm and cool by 2% */

/* 5. Light leak — position: fixed, drifting */
radial-gradient pink blob at opacity 0.04-0.06
Lissajous curve path, 60s drift cycle
CSS-only (GPU compositor, zero JS cost)
```

---

## TYPOGRAPHY SYSTEM

### Two Voices

| Role | Style | Feel | Example Faces |
|------|-------|------|---------------|
| **Display** (artist name, album titles, section headers) | Serif, variable weight. Thin for whisper, medium for carved. Wide letter-spacing on titles. | Distant but in a huge room. Classical score title page. The artist speaks. | Cormorant Garamond, Playfair Display, Lora |
| **Body** (descriptions, metadata, UI) | Sans-serif, variable weight. Regular weight, standard spacing. | Modern, clean, doesn't compete. The site speaks. | Inter, General Sans, Satoshi |
| **Data** (BPM, key, duration, price) | Monospace. | Function as aesthetic. The mechanism visible. | JetBrains Mono, IBM Plex Mono |

### Name Reveal Typography

MICHAEL KIM SHENG in serif. Not large — `clamp(1rem, 2vw, 1.5rem)`. Letter-spacing: `0.3em`. The confidence of not needing to be the biggest thing on your own page. Light weight (300). Color: `--text-primary` arriving from `opacity: 0` through `text-shadow` glow.

---

## THE 10 COMMANDMENTS (from DESIGN-SYSTEM.md)

1. Darkness is the canvas, not the absence
2. One thing glows, everything else recedes
3. Warmth is earned, not given
4. The site breathes
5. Nothing pops in, everything surfaces
6. Teal belongs to the audience, amber belongs to the artist
7. The score lines never stop
8. Imperfection is intentional
9. The store is the warmest room
10. The exit is a fade, not a wall

---

## OPEN QUESTIONS (Must Resolve Before Build)

### Critical Blockers

1. **Audio strategy:** Does music autoplay on landing (with gate pattern for user gesture), or is it opt-in only via the MiniPlayer?
2. **Font selection:** Need to pick the actual serif and sans-serif faces. Test against the design system.
3. **Score sheet assets:** Need high-res scans of Mike's actual handwritten scores for the ocean-reveal layer and flying-scores Three.js scene.
4. **Artist photography:** Need new photos of Mike in the persona-style (scroll, horse, cinematic). The existing reference images are mood only.
5. **Product assets:** Need CD/merch product photography. Straight-on shots per STYLE-DECISIONS #8.
6. **E-commerce platform:** Shopify headless, Stripe direct, or other?

### Important But Not Blocking

7. Mobile cursor-reveal fallback (tap? tilt? simplified?)
8. Spanish `/es` version scope
9. The scroll photo / white horse — is this an existing photo or needs to be shot?
10. Navigation behavior detail (when does nav appear? what does it look like?)
11. Social proof data source (listening-now counter — real data or simulated?)
12. Tour data source (manual entry? API?)
13. Film grain SVG asset (generate procedurally or use pre-made?)

---

## FILE MANIFEST — WHAT EXISTS

```
mks-design-philosophy/
├── README.md                          ← Directory overview
├── BRAND-ESSENCE.md                   ← Core truth, Coca-Cola principle, non-negotiables
├── BRAND-STORY.md                     ← Visual sentence, four seasons, site mapping
├── CROSS-REFERENCE.md                 ← Unified map: narrative → section → emotion → visual
├── DESIGN-SYSTEM.md                   ← 12 color tokens, 70+ CSS vars, 10 commandments
├── EMOTIONAL-MAP.md                   ← Emotional arc per section, brand vocabulary
├── EFFECTS-TECHNICAL-REFERENCE.md     ← p5.js/WebGL/Three.js implementation guide
├── IMAGE-ANALYSIS.md                  ← Combined 14 image analyses
├── NARRATIVE-STRUCTURE.md             ← The real story in 6 acts + quote archive
├── PRE-DEVELOPMENT-MASTER.md          ← THIS FILE — the build document
├── SITE-ARCHITECTURE.md               ← Section structure, landing sequence, store philosophy
├── STYLE-DECISIONS.md                 ← All locked-in design choices
├── VISUAL-LANGUAGE.md                 ← Color, type, motion, imagery, spatial design
├── storytelling-web-reference.md      ← Scroll-narrative, music-driven, commerce patterns
├── image-analyses/                    ← Individual analysis per image (15 files)
└── assets/
    ├── raw-imports/                   ← All 16 reference images (renamed)
    └── curated/                       ← Empty — awaiting Mike's own photography
```

---

*This document is the single source of truth for development. Every decision traces back to a source document. Every visual choice traces back to an image analysis. Every interaction traces back to the narrative structure. Build from this.*
