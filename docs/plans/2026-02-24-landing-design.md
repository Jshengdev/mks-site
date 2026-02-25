# Landing Page Design — Ghibli Field Scene

## Date: 2026-02-24
## Status: Approved

---

## Vision

A Ghibli-inspired pastel field landscape that serves as both the emotional entry point and the home of the site. The user enters a washed-watercolor dream — a vast open field with a sole figure in the distance — and as the music plays, flowers grow organically around them. Scrolling performs a cinematic drone-shot descent from wide establishing view down to ground level with the figure. Once there, the user can stay and simply exist in the ambience, or navigate to other sections via wispy dissolve transitions.

The landing is not a doorway. It is the room.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| 3D scene | Three.js (raw, not R3F) | Field landscape, sky, fog, camera dolly, figure, score sheet |
| Generative flowers | p5.js (instance mode) | Organic hand-drawn flowers growing as 2D overlay |
| Audio | HTML5 Audio element | Plays `public/through-the-veil.mp3` on entry click |
| Entry veil | CSS | Backdrop-filter blur + opacity, removed on click |
| Navigation | React + CSS | Ghost-text links with dissolve transitions |
| UI shell | React 19 + Vite 7 | Component structure, state management |

## Color Palette

Washed watercolor with deep greens. One color emphasized at a time, everything else recedes.

| Color | Hex | Usage |
|-------|-----|-------|
| Hazy cream sky | `#f0ebe0` | Sky gradient top |
| Pale blue haze | `#d8dce6` | Sky gradient bottom / fog color |
| Deep grass shadow | `#1e3018` | Grass troughs, wind shadows |
| Mid grass green | `#3a5a28` | Dominant field tone |
| Lit grass sage | `#5a7a40` | Grass tips catching light |
| Figure warm | `#c8a070` | The sole warm element (figure, name) |
| Flower pastels | varies | Muted pinks, pale lavenders, cream whites |
| Name warm | `#e8e0c8` | The name "MICHAEL KIM SHENG" |

---

## Section 1: Entry Veil

### What the user sees on load
The Three.js scene is already rendering behind a frosted-glass veil:
- CSS `backdrop-filter: blur(20px)` on a full-viewport overlay div
- Warm cream wash at ~60% opacity (`rgba(240, 235, 224, 0.6)`)
- The scene is visible as smeared color and light — you sense beauty but can't resolve it
- Centered text: "click anywhere to begin" — thin serif, barely visible, breathing slowly (opacity pulse animation, ~4s cycle)
- No logo, no nav, no branding. Just an invitation.

### On click anywhere
1. Veil dissolves: blur 20px → 0, opacity fades out over ~2 seconds
2. Music begins: `public/through-the-veil.mp3` plays via HTML5 Audio element
3. Scene sharpens into full clarity
4. Flower growth sequence begins (after ~2s delay)
5. Name "MICHAEL KIM SHENG" fades in (opacity 0→1 over ~2s)

### The feeling
You just woke up inside a painting.

---

## Section 2: Wide Establishing Shot (Three.js)

### Sky
- Hazy cream-to-pale-blue gradient — not crisp, like watercolor paper with pigment bleeding
- Soft cloud shapes as translucent planes drifting slowly
- Totoro's opening credits quality — warm, diffuse, nostalgic

### Field
- A vast ground plane stretching to a distant soft horizon
- Stylized grass — NOT photorealistic
- Vertex displacement for gentle sway (wind animation)
- Deep greens: `#1e3018` shadows, `#3a5a28` body, `#5a7a40` tips
- No hard horizon edge — Three.js exponential fog dissolves the field into the sky

### The Figure
- Real photograph from `assets/raw-imports/lone-figure-in-vast-windswept-grass-field-aerial.png`
- Composited as a textured plane in the Three.js scene
- Placed far in the distance — tiny, ~2% of frame
- The only saturated warm element in the scene
- The eye finds it involuntarily

### Atmosphere
- Three.js `FogExp2` — soft exponential fog
- Distant objects dissolve into sky color
- No hard edges anywhere — everything bleeds
- Soft directional light from above-left, no harsh shadows
- Ghibli flat-but-warm lighting quality

### The Name
- "MICHAEL KIM SHENG" appears front and center after veil lifts
- Large serif type, warm (`#e8e0c8`), the one emphasized element
- Surfaces slowly: opacity 0→1 over ~2s
- After fully visible (~5s), fades to lower opacity so flowers and scene become focal
- One color at a time rule: name is warm → flowers take over → figure draws the eye

### Lighting Emphasis Sequence
1. First: the name (warm amber against muted field)
2. Then: the flowers (color blooming up)
3. Then: the figure in the distance (eye settles naturally)

---

## Section 3: Generative Flowers (p5.js Overlay)

### Setup
- Transparent p5.js canvas layered on top of Three.js canvas
- `pointer-events: none` — clicks pass through to the scene/UI
- Instance mode, `pixelDensity(1)` for performance

### Growth Behavior
- Flowers begin growing ~2-3 seconds after veil lifts (music has started)
- Emerge from bottom edge of viewport, grow upward
- Each flower: unique Bezier-curve stem + hand-drawn bloom (irregular soft petal shapes)
- Grow in waves — a few at a time, organic clustering (left, then right, then middle)
- Growth speed: gentle, ~30-45 seconds for the full meadow to fill in
- Moderate density — field still visible behind them. They frame, not obscure.

### Visual Style
- Muted pastels with one saturated accent at a time
- Soft pinks, pale lavenders, cream whites, occasional deeper bloom
- Stems/leaves match field green palette
- Slightly translucent (alpha on fills, Three.js shows through)
- Hand-drawn quality: slight wobble on lines, imperfect petals, varying stroke weight
- Ghibli wildflower look — small, simple, abundant. Not roses or orchids.

### Audio Reactivity (Subtle)
- Music amplitude gently influences growth rate — louder = new flowers emerge faster
- Bass presence makes existing stems sway slightly
- Must be FELT, not NOTICED. If someone says "the flowers dance to the music" — it's too much.
- The flowers and the music should seem to breathe together by coincidence.

---

## Section 4: Scroll — Drone Shot Descent (Three.js Camera)

Camera path mapped to scroll progress (0 → 1):

### 0% — Wide establishing
- Camera high up, looking at horizon
- Figure is a tiny speck
- This is where user sits enjoying the music

### 0–30% — Push forward
- Camera pushes forward across the field, slow, cinematic
- Horizon line drops slightly
- Figure gets gradually larger
- p5.js flowers thin out (fade) — we're moving "past" them

### 30–70% — Descend
- Camera descends, angle shifts from outward to downward
- Sky takes up less frame, grass fills more
- Figure becomes clearly visible — a person lying in the field
- Score sheet begins to be visible

### 70–100% — Arrive at ground level
- Camera at near eye-level with the figure
- Grass is tall around you
- Score sheet (real handwritten scan) clearly visible — in figure's hand or on grass nearby
- Sky is just a strip at the top
- You're IN the field

### During scroll
- p5.js flowers transition: top flowers drift away on descent, at ground level flowers are at frame edges rather than in front
- Fog thins as we approach (distant haze clears to reveal detail)
- Name has already faded to subtle/minimal — scene is the focus

---

## Section 5: Resting State + Navigation

### Ambient state (ground level = home)
- Grass sways gently (Three.js vertex animation, slow wind)
- Score sheet visible and readable — real artifact in the dream
- Figure lies peacefully. No animation on figure — stillness is the point
- p5.js flowers at frame edges breathe subtly
- Music continues. The whole thing just lives.

### Navigation
- After a few seconds at rest, minimal nav fades in at edges
- Ghost-text: "Music" · "About" · "Store" · "Tour"
- Small, thin serif, low opacity (~0.4), positioned unobtrusively (bottom edge or along one side)
- Hover: text warms slightly (opacity increases, gentle glow)
- Click: entire scene does a wispy dissolve — field, flowers, everything softens into blur and fog, fading into the next section's world
- Transition: like waking from one dream into another. Not a hard cut. A breath between rooms.

### Scroll back up
- Camera reverses. Pull back up, wide shot returns, flowers come back.
- You can always return to the wide pastoral view.
- The "return" motif from the narrative — the foundational pattern of everything.

### MiniPlayer
- Persists across everything — fixed position, minimal, stays out of the way
- Already exists in codebase at `src/MiniPlayer.jsx`
- Plays `public/through-the-veil.mp3`

---

## Audio

- **Source:** `public/through-the-veil.mp3` — loaded via HTML5 `<audio>` element
- **Trigger:** Plays on entry click (veil dismiss)
- **AudioContext:** Create shared AudioContext + AnalyserNode on click for frequency data
- **Frequency data:** Fed to p5.js flower layer for subtle audio reactivity
- **MiniPlayer:** Adapted to use the same AudioContext singleton

---

## Performance Targets

- 60fps on mid-range hardware (MacBook Air M1 level)
- Three.js: `pixelDensity(1)`, moderate poly count on field, instanced grass
- p5.js: `pixelDensity(1)`, limit flower count (~80-120 max), 30fps cap on flower canvas
- Mobile: detect and serve simplified version (static field image + CSS flowers, no Three.js)
- `prefers-reduced-motion`: skip flower growth animation, show static flowers, disable grass sway

---

## File Structure (Planned)

```
src/
├── components/
│   ├── Landing.jsx              — Main landing orchestrator
│   ├── EntryVeil.jsx            — Frosted glass overlay
│   ├── EntryVeil.css
│   ├── FieldScene.jsx           — Three.js scene wrapper
│   ├── FlowerOverlay.jsx        — p5.js flower canvas
│   ├── LandingNav.jsx           — Ghost-text navigation
│   └── LandingNav.css
├── three/
│   ├── createFieldScene.js      — Three.js scene setup (sky, field, fog, light)
│   ├── createGrass.js           — Grass geometry + sway shader
│   ├── cameraPath.js            — Scroll-driven camera animation
│   └── loadAssets.js            — Texture loading (figure photo, score sheet)
├── p5/
│   ├── flowerSketch.js          — p5 instance mode sketch for flowers
│   └── flowerTypes.js           — Generative flower shape definitions
├── utils/
│   └── audioSingleton.js        — Shared AudioContext + AnalyserNode
├── App.jsx
├── App.css
├── MiniPlayer.jsx               — Existing, adapt
├── MiniPlayer.css               — Existing
└── MoonlightCursor.jsx          — Existing, keep or adapt
```

---

## Assets Required

| Asset | Source | Format |
|-------|--------|--------|
| Figure in field | `assets/raw-imports/lone-figure-in-vast-windswept-grass-field-aerial.png` | Texture for Three.js plane |
| Handwritten score sheet | Need scan/photo from Mike | Texture for Three.js plane |
| Through the Veil | `public/through-the-veil.mp3` | Audio |

---

## Open Questions

1. **Score sheet asset:** Do we have a scan of Mike's handwritten score? Need to source this.
2. **Other section designs:** Deferred — nail the landing first, then workshop Music/About/Store/Tour individually.
3. **Mobile fallback specifics:** How simplified? Static image + CSS, or skip Three.js but keep p5.js flowers?
