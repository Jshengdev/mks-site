# W3: Global Overlays + Audio Integration + Accessibility + Mobile — DONE

## What was built

### 1. Film Grain + Vignette Overlays (`src/Overlays.jsx`, `src/Overlays.css`)
- **Film grain**: 128x128 canvas rendered at ~12fps with random noise, fixed fullscreen at 3% opacity with `mix-blend-mode: overlay`. Respects `prefers-reduced-motion` (JS check + CSS `display: none`).
- **Vignette**: CSS `radial-gradient` overlay darkening screen edges (35% black at edges, transparent center).
- Both layers use `pointer-events: none` and high z-index (9990/9991) so they're always visible but never block interaction.

### 2. App.jsx Integration
- Imported `Overlays` component.
- Render order: `FlowerVisual > MiniPlayer > content > Overlays > MoonlightCursor` — cursor stays on top of everything.

### 3. Scroll Audio Hook (`src/useScrollAudio.js`)
- Custom hook `useScrollAudio(waveProgress)` that modulates audio volume based on scroll-driven wave progress.
- 0.0-0.3: silence, 0.3-0.5: quadratic fade-in to full volume.
- Restores volume to 1 on unmount. Standalone — ready for LandingSection integration.

### 4. Landing Accessibility CSS (`src/LandingAccessibility.css`)
- **Reduced motion**: Disables animations, forces opacity to 1, hides mask layer, removes transitions on warming overlay.
- **Mobile (<768px)**: Hides canvas layers (mask, flowers), uses CSS transitions instead, adjusts title sizing with clamp, reduces phase section heights.
- Standalone — ready for LandingSection to import during integration.

## Commits
1. `feat: add film grain and vignette overlays (always-on, design rule)`
2. `feat: useScrollAudio hook for wave-driven volume ramp`
3. `feat: reduced-motion and mobile CSS fallbacks for landing section`

## Verification
- `npm run build` passes cleanly (729ms, no warnings or errors).
