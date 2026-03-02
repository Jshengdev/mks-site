# W2: Generative Flower Rendering System + Bloom Wave — Complete

## What was built

### 1. `src/utils/noise.js` — Simplex Noise
- 2D simplex noise function seeded at 42
- Used by FlowerField to create organic, non-uniform bloom wavefront
- Zero dependencies, pure math implementation

### 2. `src/utils/flowers.js` — Flower Generation + Drawing
- **6 flower types**: daisy, cornflower, marigold, poppy, buttercup, wildgrass
- **3 depth layers**: foreground (60%, large), midground (25%, medium), background (15%, small)
- `createFlower(x, y, depthLayer)` — generates a flower data object with pre-computed petal shapes, randomized hue/saturation/lightness, stem properties, sway animation params, and bloom state
- `drawFlower(ctx, flower, time, energy)` — renders a flower to canvas with stem, petals (bezier curves), center pistil, and glow effect; supports bloom animation and audio reactivity
- `generateFlowerField(width, height, count)` — distributes ~200 flowers across the canvas with depth-aware Y positioning, sorted back-to-front

### 3. `src/FlowerField.jsx` — Standalone Canvas Component
- React component accepting `scrollProgress` prop (0-1)
- Maps scroll range 0.44-0.78 to a left-to-right bloom wave
- Noise-modulated wavefront for organic edge (not a straight line)
- Spring physics bloom animation with cluster staggering
- Audio-reactive sway and petal brightness
- Full-viewport fixed canvas at z-index 2, pointer-events none
- Proper cleanup (cancelAnimationFrame, removeEventListener)

## Integration
FlowerField is standalone — import it and pass `scrollProgress`:
```jsx
import FlowerField from './FlowerField'
<FlowerField scrollProgress={0.6} />
```

## Verification
- `npm run build` passes with no errors
- No new dependencies added
