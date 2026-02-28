# Landing Page: Sky-to-Flower-Field Reveal

**Date:** 2026-02-27
**Status:** Design approved
**Builds on:** 2026-02-24-landing-design.md (crepuscular rays / "The Knowing")

---

## Concept

The landing page is a four-phase scroll-driven cinematic sequence:

1. **"The Knowing"** — Dark void, crepuscular rays, sacred silence, name reveal
2. **"The Warming"** — Sky intensifies, golden light floods in, clouds thin
3. **"The First Note"** — Scroll-driven wave sweeps left-to-right, revealing a wildflower meadow video beneath a dark mask. Generative p5.js flowers bloom in clusters along and behind the wavefront, becoming the primary visual layer. Audio fades in as the wave crosses center-screen.
4. **"The Field"** — Full generative meadow with video atmosphere beneath. Music plays. Flowers sway with audio. You are inside the world.

**Emotional arc:** Silence → anticipation → the music begins (flowers = the first note) → immersion.

---

## Phase 1: "The Knowing" (0vh – 100vh)

Unchanged from the original landing design:
- Deep void (`#0a0a0a`)
- Crepuscular rays breaking through cloud mass (p5.js Sky scene)
- "MICHAEL KIM SHENG" reveals as light arriving before letterforms resolve
- 3-5 second hold before scroll is possible
- No nav visible until first scroll

---

## Phase 2: "The Warming" (100vh – 200vh)

Scroll-driven transition that prepares the eye for the meadow:

| Scroll Range | Effect |
|---|---|
| 100–150vh | Ray opacity 0.15 → 0.4, color shifts from white-gold to warm amber |
| 150–180vh | Cloud density threshold rises, gaps widen, blue sky patches appear |
| 180–200vh | Full golden flood — sky palette matches golden hour. Video preloading. |

This 100vh zone ensures the wave reveal feels like a natural continuation, not a jarring cut. By the time the wave begins, the sky is already warm enough to blend with the meadow.

---

## Phase 3: "The First Note" (200vh – 350vh)

### The Wave Reveal

A Perlin-noise wavefront sweeps LEFT → RIGHT, controlled by scroll position:

```
scrollProgress = clamp((scrollY - 200vh) / 150vh, 0, 1)
waveX = scrollProgress * viewportWidth

For each pixel (x, y) in mask canvas:
  noiseEdge = noise(y * 0.005, time * 0.1) * 80
  edgeX = waveX + noiseEdge

  if x < edgeX - 60:
    mask = 0 (fully transparent — video + flowers visible)
  else if x < edgeX:
    mask = smoothstep(edgeX - 60, edgeX, x)  // soft feathered edge
  else:
    mask = 1 (fully opaque — dark sky still visible)
```

The wave edge is organic — Perlin noise makes it undulate vertically, not a hard vertical line.

### Layer Stack (bottom to top)

```
z-0: <video>   — wildflower meadow loop (atmospheric depth)
z-1: <canvas>  — DARK MASK (p5.js) — initially opaque, wave erases it
z-2: <canvas>  — GENERATIVE FLOWERS (p5.js) — bloom and persist
z-3: content   — name, nav (fades in after Phase 1)
z-4: overlays  — film grain, vignette (always on)
```

### Generative Flower Layer (The Star of the Show)

The generative flowers are the primary foreground visual. The video is atmospheric depth beneath them.

**Flower population:**
- 150–300 flowers visible at full reveal
- 3 depth layers with parallax:
  - Near (z-front): large, sharp, full opacity, strong wind response
  - Mid: medium size, slight blur, 70% opacity
  - Far: small, more blur, 40% opacity, subtle movement
- 5-6 flower types: daisy, cornflower, marigold, poppy, buttercup, wildgrass
- Randomized: color variation (±15% hue), size (0.7–1.3x), rotation, petal count

**Bloom sequence:**
- Flowers bloom in **clusters** of 5-10 along the wavefront
- Each cluster triggers with slight staggered delays (50-150ms between flowers)
- Bloom animation: petals scale 0 → 1 with spring physics (overshoot + settle)
- Duration: 0.5–1.5s per flower
- Flowers that have bloomed STAY — they become permanent residents
- After blooming: gentle Perlin-wind sway (continuous)

**Flower rendering (per flower):**
```
- Center: small circle (pistil)
- Petals: 5-8 bezier curves radiating from center
- Each petal: quadratic bezier with randomized control point
- Stem: single curved line anchored at bottom
- Leaf: 1-2 small bezier shapes on stem
- Shadow: offset duplicate at 10% opacity
```

**Color palette (matching PHYLUM.01 reference):**
```
Cornflower blue:  #6495ED, #4169E1
Marigold orange:  #E8A317, #D4752E
Daisy white:      #F5F5DC, #FFFDD0
Poppy red:        #E35335 (used sparingly)
Buttercup yellow: #FFD700, #FFC125
Grass green:      #5A7A40, #3A5A28
```

### Audio Trigger

```
waveProgress = waveX / viewportWidth

0.0–0.3:  silence, visual-only
0.3:      audio begins fading in (0 → target over 3s)
0.5:      full volume reached
0.5+:     sub-bass drives subtle brightness pulse on video layer
          mids drive flower sway amplitude
          highs drive pollen particle spawning
```

---

## Phase 4: "The Field" (350vh+)

Wave is complete. Full meadow revealed. This IS the Music Section backdrop.

**Living behaviors:**
- All 150-300 flowers sway continuously with Perlin wind field
- Wind direction slowly rotates (60s cycle)
- Audio reactivity:
  - Bass (0-150Hz): flower sway amplitude increases
  - Mids (300-2kHz): warm color temperature shift on petals
  - Highs (4kHz+): pollen/particle spawning from flower centers
- Subtle parallax on scroll (3 depth layers shift at different rates)
- Video continues playing beneath — provides atmospheric movement, light shifts

**Scroll behavior:**
- Scroll speed modulates wind intensity (fast scroll = stronger gust)
- Content overlays appear with "surfacing" opacity transitions (per design philosophy)

---

## Video Asset

| Property | Spec |
|---|---|
| Content | Wildflower meadow, golden hour, gentle wind, variety of flowers |
| Format | WebM (primary) + MP4 (fallback) |
| Resolution | 1920x1080 |
| Duration | 10-15s seamless loop |
| Size | ≤8MB WebM, ≤12MB MP4 |
| Playback | autoplay, muted, loop, playsinline |
| Loading | preload="auto" begins during Phase 1 hold |
| Mobile fallback | Single high-res still + CSS gradient animation |

Source: Stock footage (Pexels, Artgrid, or similar) — must be real footage, not AI-generated (per Mike's authenticity principle).

---

## Performance

| Concern | Strategy |
|---|---|
| Mask canvas | Rendered at 50% resolution (960x540), CSS-scaled to viewport |
| Flower canvas | Only active flowers rendered; off-screen culled |
| Flower count | 150-300 max; spawn/despawn based on viewport |
| Video decode | Browser hardware acceleration |
| Frame target | 60fps on mid-range laptops |
| Mobile | No p5.js — CSS mask-image animation + static flower image |
| `prefers-reduced-motion` | Static image, no wave, instant reveal, no sway |
| Memory | Flower objects pooled and recycled |

---

## Accessibility

- `prefers-reduced-motion`: instant reveal, static flowers, no wave animation
- Video has `aria-hidden="true"` (decorative)
- Content layer maintains proper heading hierarchy and focus order
- Audio never autoplays without user scroll interaction (scroll = implicit consent in this design)
- All text meets WCAG AA contrast against both dark sky and bright meadow states

---

## Relationship to Existing Design Docs

This design **extends** the original landing page concept:
- Phase 1-2 are directly from the "Landing Page: The Knowing" spec
- Phase 3-4 are NEW — the flower field reveal replaces the original "noise dissolve → ocean" transition
- The Ocean scene (Music Section) now appears AFTER the flower field, not immediately after the sky
- The flower field becomes the connective tissue between Sky and Ocean scenes

**Updated scene flow:**
```
SKY (Landing) → FLOWER FIELD (Transition/Music intro) → OCEAN (Music deep dive) → GRASS → GOLDEN HOUR → VOID
```

---

## Open Questions

1. **Video sourcing** — Need to find/license the right wildflower footage. Golden hour, gentle wind, mixed flower types.
2. **Flower field → Ocean transition** — How does the meadow give way to the ocean scene? Possible: flowers submerge, water rises through the field.
3. **Mobile experience** — How much of the wave effect is preserved? Or does mobile get a simpler fade reveal?
