# W1: Landing Section Infrastructure + Mask Canvas — DONE

## What was built

### 1. `src/utils/noise.js` — Simplex Noise Utility
- 2D simplex noise function returning values in [0, 1]
- Seeded permutation table (seed 42) for deterministic output
- Used by the mask canvas for organic wave edge animation

### 2. `src/LandingSection.jsx` — Scroll-driven cinematic landing
A full-viewport component with 4 scroll phases (~450vh total):

- **Phase 1 "The Knowing" (0-100vh):** Dark void with title/subtitle that fade in after 3s delay
- **Phase 2 "The Warming" (100-200vh):** Golden radial gradient overlay fades in (22-44% scroll)
- **Phase 3 "The First Note" (200-350vh):** Wave sweeps left-to-right, erasing dark mask to reveal video beneath (44-78% scroll). Wave edge uses simplex noise for organic feel with 30px feathering.
- **Phase 4 "The Field" (350-450vh):** Full meadow video visible

Layer stack:
- z-0: `<video>` — wildflower meadow loop (`/meadow.mp4`)
- z-0: warming overlay — golden radial gradient
- z-1: `<canvas>` — dark mask (wave erases this)
- z-3: content (title, subtitle)

Performance: Canvas renders at half resolution (window dimensions / 2).

### 3. `src/LandingSection.css` — Styles
- Fixed-position video, warming overlay, and mask canvas
- Responsive typography with `clamp()`
- CSS keyframe animation for title reveal

### 4. `src/App.jsx` — Wired up
- Imported `LandingSection` component
- Replaced `<HomePage />` with `<LandingSection />` on the home route

## Build status
`npm run build` passes with no errors.
