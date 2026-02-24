# MKS Ambient Effects -- Technical Reference

**A comprehensive implementation guide for p5.js, WebGL/GLSL, and Three.js nature effects.**
**Every technique mapped to the MKS design system and brand philosophy.**

---

## Table of Contents

1. [Integration Architecture: p5.js Inside React](#1-integration-architecture)
2. [Effect 1: Ocean Surface with Cursor-Parts-the-Water](#2-ocean-surface)
3. [Effect 2: Sky with Clouds and Crepuscular Rays](#3-sky-with-clouds)
4. [Effect 3: Windswept Grass Field](#4-grass-field)
5. [Effect 4: Score Sheets Flying Through Sky](#5-score-sheets)
6. [Effect 5: Particle System Transitions](#6-particle-transitions)
7. [Effect 6: Golden Hour Light](#7-golden-hour)
8. [Effect 7: Film Grain Overlay](#8-film-grain)
9. [Effect 8: Light Leak Effects](#9-light-leaks)
10. [Scene Transition System](#10-scene-transitions)
11. [WebGL/GLSL Shader Implementations](#11-webgl-shaders)
12. [Three.js Integration for 3D Elements](#12-threejs-integration)
13. [Performance Budget and Optimization](#13-performance)

---

## 1. Integration Architecture: p5.js Inside React {#1-integration-architecture}

### Three Viable Approaches

#### Approach A: Instance Mode with useRef (RECOMMENDED)

This is the cleanest approach for the MKS site. It avoids global p5 pollution, gives full lifecycle control, and works naturally with React 19.

```jsx
import { useEffect, useRef } from 'react';
import p5 from 'p5';

export default function OceanCanvas({ sceneState, onTransitionComplete }) {
  const containerRef = useRef(null);
  const p5Ref = useRef(null);

  useEffect(() => {
    const sketch = (p) => {
      let time = 0;
      let mouse = { x: p.windowWidth / 2, y: p.windowHeight / 2 };

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.pixelDensity(1); // Critical for performance
      };

      p.draw = () => {
        time += p.deltaTime * 0.001;
        // ... drawing logic
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };

      p.mouseMoved = () => {
        mouse.x = p.mouseX;
        mouse.y = p.mouseY;
      };
    };

    p5Ref.current = new p5(sketch, containerRef.current);

    return () => {
      p5Ref.current.remove();
    };
  }, []);

  // Update sketch parameters from React state without remounting
  useEffect(() => {
    if (p5Ref.current) {
      p5Ref.current._sceneState = sceneState;
    }
  }, [sceneState]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,   // Behind content, z-index per design system
        pointerEvents: 'none',
      }}
    />
  );
}
```

**Why this over react-p5:** The `react-p5` wrapper is largely unmaintained and does not handle React 19's strict mode well. Instance mode with a ref is more reliable, smaller, and gives you direct access to the p5 instance for imperative updates from React state.

#### Approach B: Raw Canvas with p5 Math Utilities Only

Use p5's noise, vector, and math functions without its rendering pipeline. Draw on a raw `<canvas>` using the 2D context or WebGL directly. This is what `FlowerVisual.jsx` and `MoonlightCursor.jsx` already do in the codebase.

```jsx
import p5 from 'p5';

// Use p5's Perlin noise without a canvas
const noiseGen = new p5(); // headless instance
const noiseValue = noiseGen.noise(x * 0.01, y * 0.01, time);
```

**Trade-off:** You lose p5's shader loading, WebGL abstractions, and drawing helpers. You gain tighter canvas control and easier integration with the existing `FlowerVisual` pattern.

#### Approach C: Offscreen Canvas via Web Worker

For heavy effects (particle systems with 10,000+ particles, complex shader passes), render on an `OffscreenCanvas` in a Web Worker and composite onto the visible canvas.

```jsx
// Main thread
const offscreen = canvasRef.current.transferControlToOffscreen();
worker.postMessage({ canvas: offscreen, type: 'ocean' }, [offscreen]);

// Worker thread
self.onmessage = (e) => {
  const ctx = e.data.canvas.getContext('2d');
  // ... render loop inside worker
};
```

**Note:** p5.js does not natively support OffscreenCanvas. This approach requires vanilla Canvas2D or raw WebGL in the worker.

### Shared State Bridge: React to Canvas

The MKS site needs React state (current page, scroll position, audio playing state) to influence the canvas effects. Rather than re-mounting, use a shared mutable ref:

```jsx
// In the parent component
const sharedState = useRef({
  page: 'home',
  scrollY: 0,
  audioPlaying: false,
  transitionProgress: 0, // 0-1 between scenes
  mouseX: 0,
  mouseY: 0,
});

// Update from React
useEffect(() => {
  sharedState.current.page = page;
}, [page]);

// Read inside p5 draw loop
p.draw = () => {
  const { page, scrollY, transitionProgress } = sharedState.current;
  // ...
};
```

### Z-Index Layer Stack (from DESIGN-SYSTEM.md)

```
z-9999  Film grain overlay (pointerEvents: none)
z-9998  Light leak overlay (pointerEvents: none)
z-100   Navigation
z-10    Page content (text, cards, forms)
z-5     Flower visual / cursor effects (existing)
z-1     Nature scene canvas (ocean/sky/grass)
z-0     Background image / gradient
z--1    Hidden score sheet layer (revealed by cursor)
```

---

## 2. Effect 1: Ocean Surface with Cursor-Parts-the-Water {#2-ocean-surface}

### Design Intent (from VISUAL-LANGUAGE.md)

> "The ocean surface as default state. Cursor movement parts it to reveal the music (literal score sheets) beneath."

The ocean is the `--teal` world: `#287878` deep, `#4a6a68` mid, `#88b8b8` light. The surface conceals; the cursor reveals. Content beneath the water is score sheets -- the hidden craft layer.

### Mathematical Approach

**Wave surface:** Layered 2D Perlin noise fields at different octaves, combined with sine waves for the primary swell.

```
surfaceHeight(x, t) =
    A1 * sin(x * freq1 + t * speed1)                    // Primary swell
  + A2 * sin(x * freq2 + t * speed2 + phase2)           // Secondary swell
  + A3 * noise(x * noiseScale, t * noiseSpeed)           // Perlin turbulence
  + A4 * noise(x * noiseScale * 2, t * noiseSpeed * 1.5) // High-freq detail
```

Where:
- `A1 = 20px`, `freq1 = 0.008`, `speed1 = 0.4` (long, slow ocean swell)
- `A2 = 8px`, `freq2 = 0.02`, `speed2 = 0.7` (secondary ripple)
- `A3 = 12px`, `noiseScale = 0.005`, `noiseSpeed = 0.1` (organic variation)
- `A4 = 4px` (fine detail)

**Cursor displacement field:** A radial falloff function centered on cursor position that pushes the wave surface downward (parting the water).

```
displacement(x, y, mouseX, mouseY) =
    -depth * smoothstep(radius, 0, distance(x, y, mouseX, mouseY))

smoothstep(edge0, edge1, x) {
    t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
    return t * t * (3 - 2 * t)
}
```

The depth should be large enough to reveal the content beneath (say 200-400px of displacement at the center), with a `radius` of 150-250px. The smoothstep creates a natural bowl shape.

**Cursor trail:** The displacement should linger after the cursor moves, decaying over time. Maintain a displacement map (a 2D array at reduced resolution, e.g., 1/8th of screen pixels) and apply exponential decay each frame:

```
displacementMap[x][y] *= 0.96; // ~60 frames to return to 0.1x
displacementMap[cursorGridX][cursorGridY] = maxDisplacement;
```

Apply spatial blur to the displacement map each frame for smoothness.

### Key p5.js Implementation

```javascript
// p5 instance mode
const sketch = (p) => {
  let cols, rows;
  const RESOLUTION = 8; // pixels per grid cell
  let displacementMap;
  let time = 0;

  // Score sheet images loaded into hidden layer
  let scoreSheetGraphics;

  p.preload = () => {
    // Load score sheet textures for the reveal layer
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    cols = Math.ceil(p.width / RESOLUTION);
    rows = Math.ceil(p.height / RESOLUTION);
    displacementMap = Array.from({ length: cols }, () =>
      new Float32Array(rows)
    );

    // Create offscreen graphics for the score sheet layer
    scoreSheetGraphics = p.createGraphics(p.width, p.height);
    renderScoreSheets(scoreSheetGraphics);
  };

  p.draw = () => {
    time += p.deltaTime * 0.001;

    // Update displacement map with cursor
    updateDisplacement();

    // Draw ocean surface
    p.background(10, 10, 10); // --void

    // First: draw the hidden content layer (score sheets)
    p.image(scoreSheetGraphics, 0, 0);

    // Then: draw water surface ON TOP, with gaps where displacement is strong
    drawWaterSurface();
  };

  function updateDisplacement() {
    const gridX = Math.floor(p.mouseX / RESOLUTION);
    const gridY = Math.floor(p.mouseY / RESOLUTION);
    const brushRadius = 20; // in grid cells = 160px

    // Apply cursor pressure
    for (let dx = -brushRadius; dx <= brushRadius; dx++) {
      for (let dy = -brushRadius; dy <= brushRadius; dy++) {
        const gx = gridX + dx;
        const gy = gridY + dy;
        if (gx < 0 || gx >= cols || gy < 0 || gy >= rows) continue;

        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > brushRadius) continue;

        const t = dist / brushRadius;
        const strength = t * t * (3 - 2 * t); // smoothstep inverted
        const force = (1 - strength) * 1.0; // max displacement = 1.0

        displacementMap[gx][gy] = Math.max(displacementMap[gx][gy], force);
      }
    }

    // Decay and blur
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        displacementMap[x][y] *= 0.965; // decay
      }
    }

    // Simple box blur for smoothness (one pass)
    // (In production, use separable Gaussian for efficiency)
  }

  function drawWaterSurface() {
    p.loadPixels();
    const d = p.pixelDensity();
    const w = p.width * d;
    const h = p.height * d;

    for (let x = 0; x < p.width; x += 2) { // Skip every other pixel for perf
      for (let y = 0; y < p.height; y += 2) {
        const gx = Math.floor(x / RESOLUTION);
        const gy = Math.floor(y / RESOLUTION);
        const disp = displacementMap[gx]?.[gy] || 0;

        // Wave height at this point
        const waveH = getWaveHeight(x, y, time);

        // The "surface line" for this column
        const surfaceY = p.height * 0.45 + waveH;

        // If this pixel is above the surface, draw sky/atmosphere
        // If below surface AND displacement < threshold, draw water
        // If below surface AND displacement > threshold, leave transparent (show score)

        if (y > surfaceY) {
          // Underwater
          const waterAlpha = 1.0 - disp; // displacement reveals content
          if (waterAlpha > 0.05) {
            const depth = (y - surfaceY) / p.height;
            const r = p.lerp(42, 24, depth);   // teal gradient
            const g = p.lerp(138, 88, depth);
            const b = p.lerp(138, 120, depth);
            // Set pixel with alpha proportional to waterAlpha
            setPixel(x, y, r, g, b, waterAlpha * 255);
          }
        }
      }
    }
    p.updatePixels();
  }

  function getWaveHeight(x, y, t) {
    return (
      20 * Math.sin(x * 0.008 + t * 0.4) +
      8 * Math.sin(x * 0.02 + t * 0.7 + 1.3) +
      12 * p.noise(x * 0.005, y * 0.003, t * 0.1) * 2 - 12 +
      4 * p.noise(x * 0.01, y * 0.006, t * 0.15) * 2 - 4
    );
  }
};
```

### IMPORTANT: The Pixel-Level Approach Above Is Too Slow

The per-pixel approach above illustrates the math but will not run at 60fps. For production, use one of these:

#### Option A: Horizontal Strip Rendering (Canvas 2D, ~60fps)

Instead of per-pixel, draw horizontal strips of water color with varying alpha and vertical offset based on wave height and displacement:

```javascript
function drawWaterSurface() {
  const STRIP_HEIGHT = 2; // 2px tall strips

  for (let y = 0; y < p.height; y += STRIP_HEIGHT) {
    for (let x = 0; x < p.width; x += RESOLUTION) {
      const disp = getDisplacementAt(x, y);
      const waveH = getWaveHeight(x, y, time);
      const surfaceY = p.height * 0.45 + waveH;

      if (y > surfaceY - 20) { // Only draw near/below surface
        const waterAlpha = (1.0 - disp) * p.map(y, surfaceY - 20, surfaceY + 50, 0, 1, true);
        const depth = p.constrain((y - surfaceY) / 300, 0, 1);

        p.noStroke();
        p.fill(
          p.lerp(42, 24, depth),
          p.lerp(138, 88, depth),
          p.lerp(138, 120, depth),
          waterAlpha * 255
        );
        p.rect(x, y, RESOLUTION, STRIP_HEIGHT);
      }
    }
  }

  // Draw wave crest highlights
  for (let x = 0; x < p.width; x += 4) {
    const waveH = getWaveHeight(x, 0, time);
    const surfaceY = p.height * 0.45 + waveH;
    const disp = getDisplacementAt(x, surfaceY);

    const crestAlpha = (1 - disp) * 0.6;
    p.stroke(200, 216, 216, crestAlpha * 255);
    p.strokeWeight(1.5);
    p.point(x, surfaceY);
  }
}
```

#### Option B: WebGL Shader (BEST PERFORMANCE, see Section 11)

The ocean effect is the strongest candidate for a GLSL fragment shader. Described fully in the shader section below.

### The Reveal Layer (Score Sheets Beneath the Water)

The hidden content beneath the water surface should be pre-rendered to an offscreen canvas or `p5.Graphics` instance. This layer is always drawn first; the water draws on top with transparency where the cursor has displaced it.

```javascript
function renderScoreSheets(g) {
  g.background(10, 10, 10);

  // Scattered score sheet images with slight rotation
  // Matching img02 "scattered scores" aesthetic
  for (const sheet of scoreSheetData) {
    g.push();
    g.translate(sheet.x, sheet.y);
    g.rotate(sheet.rotation); // slight: -0.05 to 0.05 radians
    g.tint(217, 200, 158, 180); // --parchment with transparency
    g.image(sheet.img, -sheet.w / 2, -sheet.h / 2, sheet.w, sheet.h);
    g.pop();
  }
}
```

### Color Mapping to Design Tokens

| Water Element | Design Token | Hex |
|---------------|-------------|-----|
| Deep water | `--teal-deep` | `#185858` |
| Mid water | `--teal` | `#2a8a8a` |
| Surface highlights | `--teal-light` | `#88b8b8` |
| Wave crest spray | `--text-primary` | `#c8d4e8` |
| Revealed score sheets | `--parchment` | `#d9c89e` |

---

## 3. Effect 2: Sky with Clouds and Crepuscular Rays {#3-sky-with-clouds}

### Design Intent (from STYLE-DECISIONS.md)

> "Landing: Sky / clouds (liberation, vastness)"
> "Cloud mass with rays behind it... The light you can't see but whose effects radiate outward."

This is the landing page environment. Clouds part to reveal content. Crepuscular rays fan from a hidden source (the artist/sun).

### Mathematical Approach: Clouds

**Layered Perlin noise fields at different scales and speeds:**

```
cloudDensity(x, y, t) =
    0.5 * noise(x * 0.002 + t * 0.02, y * 0.003)          // Large cloud masses
  + 0.25 * noise(x * 0.005 + t * 0.04, y * 0.007 + 0.5)   // Medium detail
  + 0.125 * noise(x * 0.012 + t * 0.06, y * 0.015 + 1.0)  // Fine wisps
  + 0.0625 * noise(x * 0.025 + t * 0.08, y * 0.03 + 1.5)  // Turbulence
```

This is Fractional Brownian Motion (fBm) -- the standard technique for cloud generation. Each octave halves the amplitude and doubles the frequency. The `+ t * speed` term in the x-coordinate creates rightward drift; different speeds per octave make smaller features move faster (realistic).

**Thresholding for cloud shape:**

```
cloudAlpha(x, y, t) = smoothstep(threshold, threshold + softness, cloudDensity(x, y, t))
```

Where `threshold ~ 0.45` (controls cloud coverage) and `softness ~ 0.15` (controls edge softness).

**Clouds parting to reveal content:** Animate the threshold or add a radial displacement to the noise coordinates centered on the viewport center:

```
// "Parting" effect: push noise coordinates outward from center
dx = (x - centerX) * partAmount * 0.003;
dy = (y - centerY) * partAmount * 0.003;

cloudDensity(x + dx, y + dy, t)  // displaced noise = gap opens in center
```

Where `partAmount` is 0 (clouds closed) to 1 (clouds fully parted), animated on scroll or time.

### Mathematical Approach: Crepuscular Rays

Rays are radial light shafts emanating from a point (the hidden sun). They are rendered as radial gradients modulated by angular noise.

```
rayIntensity(angle, r, t) =
    baseGlow * falloff(r)
    * (0.5 + 0.5 * noise(angle * rayFrequency, t * 0.1))  // angular variation
    * smoothstep(cloudEdge, cloudEdge - fadeWidth, r)        // fade into cloud
```

Where:
- `angle = atan2(y - sunY, x - sunX)`
- `r = distance(x, y, sunX, sunY)`
- `falloff(r) = 1 / (1 + r * 0.003)` -- inverse distance falloff
- `rayFrequency ~ 8` -- how many rays
- `baseGlow` maps to `--amber` at low opacity

### Key p5.js Implementation

```javascript
const sketch = (p) => {
  let time = 0;
  let partAmount = 0;      // 0=closed, 1=parted
  let targetPart = 0;
  const SUN_X = 0.5;       // normalized
  const SUN_Y = 0.55;      // slightly below center (img09 composition)

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noStroke();
  };

  p.draw = () => {
    time += p.deltaTime * 0.001;
    partAmount += (targetPart - partAmount) * 0.008; // slow ease

    p.background(10, 14, 16); // deep blue-black void

    drawSkyGradient();
    drawCrepuscularRays();
    drawClouds();
  };

  function drawSkyGradient() {
    // Steel blue gradient: #6888a0 at top, darker at bottom
    for (let y = 0; y < p.height; y += 4) {
      const t = y / p.height;
      p.fill(
        p.lerp(104, 56, t),    // steel -> dark
        p.lerp(136, 72, t),
        p.lerp(160, 96, t),
        40  // subtle atmospheric wash
      );
      p.rect(0, y, p.width, 4);
    }
  }

  function drawCrepuscularRays() {
    const sunX = SUN_X * p.width;
    const sunY = SUN_Y * p.height;
    const maxRadius = Math.max(p.width, p.height) * 1.2;

    // Draw radial rays as thin triangles from the sun point
    const RAY_COUNT = 24;
    for (let i = 0; i < RAY_COUNT; i++) {
      const baseAngle = (i / RAY_COUNT) * p.TWO_PI;
      // Perlin noise modulates ray angle slightly for organic feel
      const angleOffset = p.noise(i * 0.5, time * 0.05) * 0.15 - 0.075;
      const angle = baseAngle + angleOffset;

      // Ray width modulated by noise
      const rayWidth = p.noise(i * 0.3, time * 0.08) * 0.08 + 0.02;

      // Ray brightness
      const brightness = p.noise(i * 0.7, time * 0.03) * 0.5 + 0.5;

      const x1 = sunX + Math.cos(angle - rayWidth) * maxRadius;
      const y1 = sunY + Math.sin(angle - rayWidth) * maxRadius;
      const x2 = sunX + Math.cos(angle + rayWidth) * maxRadius;
      const y2 = sunY + Math.sin(angle + rayWidth) * maxRadius;

      // Gradient fill via multiple thin strips
      const STEPS = 12;
      for (let s = 0; s < STEPS; s++) {
        const t = s / STEPS;
        const r = t * maxRadius;
        const alpha = brightness * (1 - t * t) * 0.04; // quadratic falloff

        p.fill(232, 224, 200, alpha * 255); // rim light white-gold
        p.beginShape();
        const nearR = r;
        const farR = r + maxRadius / STEPS;
        p.vertex(sunX + Math.cos(angle - rayWidth) * nearR,
                 sunY + Math.sin(angle - rayWidth) * nearR);
        p.vertex(sunX + Math.cos(angle + rayWidth) * nearR,
                 sunY + Math.sin(angle + rayWidth) * nearR);
        p.vertex(sunX + Math.cos(angle + rayWidth) * farR,
                 sunY + Math.sin(angle + rayWidth) * farR);
        p.vertex(sunX + Math.cos(angle - rayWidth) * farR,
                 sunY + Math.sin(angle - rayWidth) * farR);
        p.endShape(p.CLOSE);
      }
    }

    // Central glow (the rim light around the cloud)
    for (let r = 200; r > 0; r -= 4) {
      const alpha = (1 - r / 200) * 0.03;
      p.fill(232, 224, 200, alpha * 255);
      p.ellipse(sunX, sunY, r * 2, r * 2);
    }
  }

  function drawClouds() {
    // Performance: draw at reduced resolution then scale
    const SCALE = 4; // render at 1/4 resolution
    const cw = Math.ceil(p.width / SCALE);
    const ch = Math.ceil(p.height / SCALE);

    for (let gx = 0; gx < cw; gx++) {
      for (let gy = 0; gy < ch; gy++) {
        const x = gx * SCALE;
        const y = gy * SCALE;

        // Displacement for cloud parting
        const cx = p.width / 2;
        const cy = p.height / 2;
        const dx = (x - cx) * partAmount * 0.003;
        const dy = (y - cy) * partAmount * 0.003;

        // fBm cloud density
        const density = cloudFBM(x + dx, y + dy, time);

        // Threshold
        const threshold = 0.42;
        const softness = 0.15;
        const alpha = smoothstep(threshold, threshold + softness, density);

        if (alpha > 0.01) {
          // Cloud lit from below: brighter at bottom edges
          const litAmount = p.noise(x * 0.003, y * 0.004 + 100, time * 0.05);
          const r = p.lerp(72, 216, litAmount * 0.3);  // cloud face -> gold
          const g = p.lerp(88, 168, litAmount * 0.3);
          const b = p.lerp(104, 96, litAmount * 0.3);

          p.fill(r, g, b, alpha * 220);
          p.rect(x, y, SCALE, SCALE);
        }
      }
    }
  }

  function cloudFBM(x, y, t) {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 0.002;
    let speed = 0.02;

    for (let octave = 0; octave < 4; octave++) {
      value += amplitude * p.noise(
        x * frequency + t * speed,
        y * frequency * 1.3 + octave * 100
      );
      amplitude *= 0.5;
      frequency *= 2.1;
      speed *= 1.5;
    }
    return value;
  }

  function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }
};
```

### Performance Note

The cloud rendering above uses a coarse grid (every 4th pixel). For smoother results at similar cost, render the cloud density field to a small `p5.Graphics` offscreen buffer and scale it up with `p.image()`, which leverages GPU texture filtering for smooth interpolation:

```javascript
const cloudBuffer = p.createGraphics(
  Math.ceil(p.width / 4),
  Math.ceil(p.height / 4)
);

// ... render to cloudBuffer at native resolution of the small buffer

// Display scaled up (GPU does bilinear filtering)
p.image(cloudBuffer, 0, 0, p.width, p.height);
```

---

## 4. Effect 3: Windswept Grass Field {#4-grass-field}

### Design Intent (from image-analyses/06)

> "The grass moves in waves like an ocean surface, catching light and shadow in undulating bands."
> "About: Grass field / plains (openness, the journey)"

### Mathematical Approach

Each blade of grass is a quadratic Bezier curve anchored at a ground point, with the control point displaced by a wind function.

**Wind field:** 2D Perlin noise sampled at the base of each blade, producing a horizontal displacement that propagates upward along the blade with increasing amplitude.

```
windX(baseX, baseY, t) = windStrength * noise(baseX * 0.003, baseY * 0.003, t * 0.3)
windY(baseX, baseY, t) = windStrength * 0.3 * noise(baseX * 0.003 + 100, baseY * 0.003 + 100, t * 0.3)
```

**Blade geometry:**
```
base = (x, groundY)
mid  = (x + windX * 0.5, groundY - bladeHeight * 0.5)
tip  = (x + windX, groundY - bladeHeight + windY)
```

**Parallax depth:** Multiple layers of grass at different y-positions with:
- Near grass: larger blades, more opacity, faster wind response
- Far grass: smaller blades, lower opacity, slower wind response, bluer tint (aerial perspective)

```
// Depth layers
const layers = [
  { y: 0.95, scale: 1.0,  alpha: 1.0,  windMul: 1.0,  tint: [58, 90, 40]  },  // near
  { y: 0.80, scale: 0.7,  alpha: 0.7,  windMul: 0.7,  tint: [70, 100, 60]  },  // mid
  { y: 0.65, scale: 0.4,  alpha: 0.45, windMul: 0.4,  tint: [80, 110, 80]  },  // far
  { y: 0.55, scale: 0.2,  alpha: 0.2,  windMul: 0.2,  tint: [90, 115, 100] },  // distant
];
```

The aerial perspective (blue-shift with distance) maps to the image analysis: `#1e3018` near, `#3a5a28` mid, `#5a7a40` lit tips.

### Key p5.js Implementation

```javascript
const sketch = (p) => {
  let time = 0;
  const BLADES_PER_LAYER = [800, 600, 400, 200]; // near to far

  const layers = [];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    // Pre-generate blade positions for each layer
    const depthConfigs = [
      { groundY: 0.95, scale: 1.0, alpha: 1.0, windMul: 1.0 },
      { groundY: 0.80, scale: 0.7, alpha: 0.7, windMul: 0.7 },
      { groundY: 0.65, scale: 0.4, alpha: 0.45, windMul: 0.4 },
      { groundY: 0.55, scale: 0.2, alpha: 0.2, windMul: 0.2 },
    ];

    depthConfigs.forEach((cfg, i) => {
      const blades = [];
      for (let b = 0; b < BLADES_PER_LAYER[i]; b++) {
        blades.push({
          x: Math.random() * p.width,
          height: (20 + Math.random() * 40) * cfg.scale,
          width: (1 + Math.random() * 2) * cfg.scale,
          phase: Math.random() * 1000, // noise offset for variety
          hue: 90 + Math.random() * 40,
          sat: 30 + Math.random() * 30,
          light: 20 + Math.random() * 30,
        });
      }
      layers.push({ ...cfg, blades });
    });
  };

  p.draw = () => {
    time += p.deltaTime * 0.001;

    // Sky gradient (transition from sky scene)
    drawGrassBackground();

    // Draw layers back-to-front (far first)
    for (let i = layers.length - 1; i >= 0; i--) {
      drawGrassLayer(layers[i], i);
    }
  };

  function drawGrassBackground() {
    // Dark ground visible between blades
    for (let y = 0; y < p.height; y += 2) {
      const t = y / p.height;
      p.stroke(
        p.lerp(30, 15, t),
        p.lerp(48, 24, t),
        p.lerp(24, 12, t),
        255
      );
      p.line(0, y, p.width, y);
    }
  }

  function drawGrassLayer(layer, layerIndex) {
    const groundY = layer.groundY * p.height;

    for (const blade of layer.blades) {
      // Wind at this blade's position
      const windX = 30 * layer.windMul * (
        p.noise(blade.x * 0.003 + blade.phase, time * 0.3) * 2 - 1
      );
      const windY = 10 * layer.windMul * (
        p.noise(blade.x * 0.003 + blade.phase + 50, time * 0.3) * 2 - 1
      );

      // Light catching: blades bent toward light are brighter
      const lightAmount = p.map(windX, -30, 30, 0.6, 1.4);

      const baseX = blade.x;
      const baseY = groundY;
      const tipX = baseX + windX;
      const tipY = baseY - blade.height + windY;
      const midX = baseX + windX * 0.4;
      const midY = baseY - blade.height * 0.55;

      // Aerial perspective tint: far layers get cooler/bluer
      const depthTint = layerIndex / layers.length;
      const r = p.lerp(blade.hue * 0.3, blade.hue * 0.5, depthTint);
      const g = p.lerp(blade.hue * 1.0, blade.hue * 0.9, depthTint);
      const b = p.lerp(blade.hue * 0.3, blade.hue * 0.8, depthTint);

      p.stroke(
        r * lightAmount,
        g * lightAmount,
        b * lightAmount,
        layer.alpha * 255
      );
      p.strokeWeight(blade.width);
      p.noFill();
      p.beginShape();
      p.vertex(baseX, baseY);
      p.quadraticVertex(midX, midY, tipX, tipY);
      p.endShape();
    }
  }
};
```

### Performance Optimization

With 2000 blades, each drawn as a Bezier stroke, this approaches the limit of Canvas 2D. Optimization strategies:

1. **Batch by color:** Sort blades by approximate color, set `stroke()` once for a group.
2. **LOD by layer:** Far layers can use simple lines instead of quadratics.
3. **Wind as texture:** Pre-compute a 2D wind texture (small Perlin noise buffer) and sample it, instead of calling `noise()` per blade per frame.
4. **WebGL shader version:** Render each blade as a GPU instanced quad with vertex shader displacement. See Section 11.

---

## 5. Effect 4: Score Sheets Flying Through Sky {#5-score-sheets}

### Design Intent (from STYLE-DECISIONS.md)

> "What if my score is flying through the sky or something?"
> "The music is freeing and liberating."
> "Liberation. My leash."

Score sheets are parchment-colored rectangles with handwritten texture, floating through the atmospheric space. They rotate in 3D, catch light, and drift on wind currents.

### Mathematical Approach

Each score sheet is a rigid body with:
- **Position:** `(x, y, z)` in 3D space, projected to 2D
- **Rotation:** Euler angles `(rotX, rotY, rotZ)` for tumbling
- **Velocity:** `(vx, vy, vz)` influenced by wind and gravity
- **Wind force:** Perlin noise field sampled at position, applied as acceleration
- **Drag:** Proportional to velocity squared (air resistance)
- **Flutter:** High-frequency oscillation on rotY (the "caught by a gust" look)

```
// Per-frame physics update for each sheet
acceleration.x = windNoise(x, y, t) * windStrength - drag * vx * |vx|
acceleration.y = gravity + liftNoise(x, y, t) * liftStrength - drag * vy * |vy|
acceleration.z = windNoiseZ(x, y, t) * 0.5 - drag * vz * |vz|

velocity += acceleration * dt
position += velocity * dt

// Rotation: gradual tumble + flutter
rotX += rotVelX * dt + flutter * sin(t * flutterFreq + phase)
rotY += rotVelY * dt
rotZ += rotVelZ * dt + flutter * cos(t * flutterFreq * 0.7 + phase)
```

**3D projection (simple perspective):**
```
scale = focalLength / (focalLength + z)
screenX = (x - cameraX) * scale + screenWidth / 2
screenY = (y - cameraY) * scale + screenHeight / 2
```

**Handwritten texture:** Apply a parchment tint (`--parchment: #d9c89e`) with subtle line patterns drawn at slight angles, simulating staff lines and notation marks.

### Key p5.js Implementation (2D with fake 3D)

```javascript
const sketch = (p) => {
  let time = 0;
  const sheets = [];
  const SHEET_COUNT = 12;
  const FOCAL_LENGTH = 800;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    for (let i = 0; i < SHEET_COUNT; i++) {
      sheets.push(createSheet());
    }
  };

  function createSheet() {
    return {
      x: (Math.random() - 0.5) * p.width * 2,
      y: Math.random() * p.height * 1.5 - p.height * 0.5,
      z: Math.random() * 600 + 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -0.3 - Math.random() * 0.5,  // floating upward
      vz: (Math.random() - 0.5) * 0.2,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: (Math.random() - 0.5) * 0.4,
      rotVelX: (Math.random() - 0.5) * 0.008,
      rotVelY: (Math.random() - 0.5) * 0.006,
      rotVelZ: (Math.random() - 0.5) * 0.004,
      flutterPhase: Math.random() * Math.PI * 2,
      width: 60 + Math.random() * 40,
      height: 80 + Math.random() * 50,
      staffLines: 4 + Math.floor(Math.random() * 2),
      notePositions: Array.from({ length: 8 + Math.floor(Math.random() * 12) },
        () => ({ x: Math.random(), y: Math.random(), size: 2 + Math.random() * 3 })
      ),
    };
  }

  p.draw = () => {
    time += p.deltaTime * 0.001;

    // Sort by z for proper depth ordering (far first)
    sheets.sort((a, b) => b.z - a.z);

    for (const sheet of sheets) {
      updateSheet(sheet);
      drawSheet(sheet);

      // Respawn if out of bounds
      if (sheet.y < -p.height || sheet.y > p.height * 2 ||
          Math.abs(sheet.x) > p.width * 2) {
        Object.assign(sheet, createSheet());
        sheet.y = p.height + 100; // enter from bottom
      }
    }
  };

  function updateSheet(s) {
    // Wind from Perlin noise
    const windX = (p.noise(s.x * 0.001, s.y * 0.001, time * 0.2) - 0.5) * 0.3;
    const windY = (p.noise(s.x * 0.001 + 100, s.y * 0.001, time * 0.15) - 0.5) * 0.2;

    // Apply forces
    s.vx += windX * 0.01;
    s.vy += windY * 0.01 - 0.002; // slight upward drift
    s.vz += (p.noise(s.x * 0.002, time * 0.1) - 0.5) * 0.01;

    // Drag
    s.vx *= 0.998;
    s.vy *= 0.998;
    s.vz *= 0.995;

    // Update position
    s.x += s.vx * p.deltaTime * 0.05;
    s.y += s.vy * p.deltaTime * 0.05;
    s.z += s.vz * p.deltaTime * 0.05;

    // Clamp z
    s.z = Math.max(50, Math.min(1000, s.z));

    // Update rotation with flutter
    const flutter = Math.sin(time * 3 + s.flutterPhase) * 0.02;
    s.rotX += s.rotVelX + flutter;
    s.rotY += s.rotVelY;
    s.rotZ += s.rotVelZ + flutter * 0.5;
  }

  function drawSheet(s) {
    const scale = FOCAL_LENGTH / (FOCAL_LENGTH + s.z);
    const screenX = s.x * scale + p.width / 2;
    const screenY = s.y * scale + p.height / 2;
    const w = s.width * scale;
    const h = s.height * scale;

    // Compute facing: dot product of sheet normal with view direction
    // Simplified: use cos(rotX) * cos(rotY) as facing factor
    const facing = Math.abs(Math.cos(s.rotX) * Math.cos(s.rotY));
    const depthAlpha = p.map(s.z, 50, 1000, 0.9, 0.15);
    const alpha = facing * depthAlpha;

    if (alpha < 0.02) return;

    p.push();
    p.translate(screenX, screenY);

    // Apply 2D rotation (rotZ is the visible rotation in screen space)
    // rotX and rotY manifest as scale distortion for fake 3D
    const scaleX = Math.cos(s.rotY) * w;
    const scaleY = Math.cos(s.rotX) * h;
    p.rotate(s.rotZ);

    // Parchment body
    p.fill(217, 200, 158, alpha * 255); // --parchment
    p.noStroke();
    p.rect(-scaleX / 2, -scaleY / 2, scaleX, scaleY, 2);

    // Shadow on one side (depth cue)
    p.fill(138, 125, 90, alpha * 80);
    p.rect(-scaleX / 2 + scaleX * 0.85, -scaleY / 2, scaleX * 0.15, scaleY, 0, 2, 2, 0);

    // Staff lines
    if (scaleY > 20) { // Only draw detail when large enough
      p.stroke(100, 85, 60, alpha * 120);
      p.strokeWeight(0.5 * scale);
      const lineSpacing = scaleY / (s.staffLines + 2);
      for (let i = 1; i <= s.staffLines; i++) {
        const ly = -scaleY / 2 + lineSpacing * (i + 0.5);
        p.line(-scaleX * 0.4, ly, scaleX * 0.4, ly);
      }

      // Note dots (simplified notation marks)
      p.noStroke();
      p.fill(60, 50, 35, alpha * 160);
      for (const note of s.notePositions) {
        if (Math.random() > alpha) continue; // LOD: skip notes at distance
        const nx = (note.x - 0.5) * scaleX * 0.8;
        const ny = (note.y - 0.5) * scaleY * 0.8;
        p.ellipse(nx, ny, note.size * scale, note.size * scale * 0.7);
      }
    }

    p.pop();
  }
};
```

### For True 3D: Use Three.js (Section 12)

The p5.js version above fakes 3D with perspective projection and scale distortion. For proper 3D rotation, lighting, and depth, Three.js is the better tool. The Three.js implementation is detailed in Section 12.

---

## 6. Effect 5: Particle System Transitions {#6-particle-transitions}

### Design Intent

Seamless morphing between nature states: ocean particles become sky particles become grass particles. The environment transforms -- particles lift from the ocean surface, rise into the sky, and settle into grass blades.

### Mathematical Approach

**Dual-target particle system:** Each particle has a `sourcePosition` and a `targetPosition`. During transition, the particle interpolates between them using an eased blend:

```
currentPos = lerp(sourcePos, targetPos, easeInOutCubic(transitionProgress))
```

But simple linear interpolation looks mechanical. Add:

1. **Arc motion:** During transition, each particle follows a parabolic arc:
   ```
   midpoint = (source + target) / 2 + vec2(0, -arcHeight)
   pos = quadraticBezier(source, midpoint, target, t)
   ```

2. **Staggered timing:** Each particle starts its transition at a slightly different time, creating a wave effect:
   ```
   particleT = (globalT - particle.delay) / (1 - particle.delay)
   particleT = clamp(particleT, 0, 1)
   ```
   Where `particle.delay = hash(particleIndex) * maxStagger` and `maxStagger ~ 0.3`.

3. **Noise displacement:** During the transition mid-point, add turbulence:
   ```
   displacementStrength = sin(particleT * PI) // peaks at t=0.5
   displacement = noise3D(pos, time) * displacementStrength * turbulenceScale
   ```

### Particle States by Scene

| Scene | Particle Behavior | Color | Count |
|-------|------------------|-------|-------|
| Ocean | Horizontal flow, sine-wave oscillation, clustered at surface line | `#287878` to `#88b8b8` | 2000 |
| Sky | Slow upward drift, cloud-like clustering, radial expansion | `#607080` to `#e8e0c8` | 1500 |
| Grass | Anchored at ground, vertical oscillation (wind sway), layered depth | `#3a5a28` to `#5a7a40` | 2500 |

### Key p5.js Implementation

```javascript
const PARTICLE_COUNT = 2000;

class TransitionParticle {
  constructor(index, total) {
    this.index = index;
    this.delay = (index / total) * 0.3; // stagger
    this.noiseOffset = Math.random() * 1000;

    this.sourcePos = { x: 0, y: 0 };
    this.targetPos = { x: 0, y: 0 };
    this.currentPos = { x: 0, y: 0 };
    this.currentColor = { r: 0, g: 0, b: 0, a: 0 };
    this.size = 2 + Math.random() * 3;
  }

  setSource(scene, width, height) {
    switch (scene) {
      case 'ocean':
        this.sourcePos.x = Math.random() * width;
        this.sourcePos.y = height * 0.45 + Math.random() * height * 0.55;
        this.sourceColor = { r: 42, g: 138, b: 138 };
        break;
      case 'sky':
        this.sourcePos.x = Math.random() * width;
        this.sourcePos.y = Math.random() * height * 0.7;
        this.sourceColor = { r: 96, g: 112, b: 128 };
        break;
      case 'grass':
        this.sourcePos.x = Math.random() * width;
        this.sourcePos.y = height * 0.5 + Math.random() * height * 0.5;
        this.sourceColor = { r: 58, g: 90, b: 40 };
        break;
    }
  }

  setTarget(scene, width, height) {
    switch (scene) {
      case 'ocean':
        this.targetPos.x = Math.random() * width;
        this.targetPos.y = height * 0.45 + Math.random() * height * 0.55;
        this.targetColor = { r: 42, g: 138, b: 138 };
        break;
      case 'sky':
        this.targetPos.x = Math.random() * width;
        this.targetPos.y = Math.random() * height * 0.7;
        this.targetColor = { r: 96, g: 112, b: 128 };
        break;
      case 'grass':
        this.targetPos.x = Math.random() * width;
        this.targetPos.y = height * 0.5 + Math.random() * height * 0.5;
        this.targetColor = { r: 58, g: 90, b: 40 };
        break;
    }
  }

  update(globalT, time, p) {
    // Per-particle staggered timing
    const localT = Math.max(0, Math.min(1,
      (globalT - this.delay) / (1 - this.delay)
    ));
    const easedT = easeInOutCubic(localT);

    // Arc height peaks in the middle of transition
    const arcPeak = Math.sin(localT * Math.PI) * 100;

    // Noise turbulence during transition
    const turbulence = Math.sin(localT * Math.PI) * 30;
    const nx = p.noise(this.noiseOffset, time * 0.5) * 2 - 1;
    const ny = p.noise(this.noiseOffset + 100, time * 0.5) * 2 - 1;

    // Interpolate position with arc
    this.currentPos.x = p.lerp(this.sourcePos.x, this.targetPos.x, easedT)
      + nx * turbulence;
    this.currentPos.y = p.lerp(this.sourcePos.y, this.targetPos.y, easedT)
      - arcPeak + ny * turbulence;

    // Interpolate color
    this.currentColor.r = p.lerp(this.sourceColor.r, this.targetColor.r, easedT);
    this.currentColor.g = p.lerp(this.sourceColor.g, this.targetColor.g, easedT);
    this.currentColor.b = p.lerp(this.sourceColor.b, this.targetColor.b, easedT);
    this.currentColor.a = 1.0 - Math.sin(localT * Math.PI) * 0.3; // slight fade mid-transition
  }
}

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
```

### Triggering Transitions

```javascript
// In the sketch
let transitionProgress = 0;
let transitioning = false;
let fromScene = 'ocean';
let toScene = 'sky';

function startTransition(from, to) {
  fromScene = from;
  toScene = to;
  transitioning = true;
  transitionProgress = 0;

  particles.forEach((particle, i) => {
    particle.setSource(from, width, height);
    particle.setTarget(to, width, height);
  });
}

// In draw:
if (transitioning) {
  transitionProgress += 0.003; // ~5 second transition at 60fps
  if (transitionProgress >= 1) {
    transitionProgress = 1;
    transitioning = false;
  }
}

particles.forEach(p => p.update(transitionProgress, time, p5Instance));
```

---

## 7. Effect 6: Golden Hour Light {#7-golden-hour}

### Design Intent (from VISUAL-LANGUAGE.md)

> "Warmth appears only through interaction or at specific emotional peaks."
> "The gold is rare and earned."

Golden hour light is a directional warm wash that shifts color temperature over time -- a living sunset that colors the entire scene.

### Mathematical Approach

**Directional light overlay:** A large radial gradient positioned at the "sun" location, with:
- Color cycling between warm tones on a slow period (45s per cycle, per `--duration-sunset`)
- Directional bias (stronger on one side)
- Intensity modulated by scene state (stronger during Store/About sections)

```
lightIntensity(x, y, t) =
    baseSunGlow(x, y, sunPos)
  * colorTemperature(t)
  * sceneMultiplier(currentScene)

baseSunGlow(x, y, sunPos) =
    1.0 / (1.0 + distance(x, y, sunPos) * 0.002)^2

colorTemperature(t) =
    vec3(
      0.95 + 0.05 * sin(t * TAU / 45),    // R oscillates 0.9-1.0
      0.75 + 0.1 * sin(t * TAU / 45 - 1),  // G oscillates 0.65-0.85
      0.45 + 0.15 * sin(t * TAU / 45 - 2)  // B oscillates 0.3-0.6
    )
```

### Key p5.js Implementation

```javascript
function drawGoldenHourOverlay(p, time, intensity) {
  // Sun position drifts slowly
  const sunX = p.width * (0.75 + 0.1 * Math.sin(time * 0.02));
  const sunY = p.height * (0.3 + 0.05 * Math.sin(time * 0.015));

  // Color temperature cycle (45 second period)
  const cycle = time * (Math.PI * 2 / 45);
  const warmth = 0.5 + 0.5 * Math.sin(cycle); // 0=cooler, 1=warmer

  // Multiple gradient layers at different radii for realistic falloff
  const layers = [
    { radius: 800, alpha: 0.04 * intensity },   // wide atmospheric wash
    { radius: 400, alpha: 0.06 * intensity },   // mid glow
    { radius: 150, alpha: 0.08 * intensity },   // near-source intensity
  ];

  for (const layer of layers) {
    const gradient = p.drawingContext.createRadialGradient(
      sunX, sunY, 0,
      sunX, sunY, layer.radius
    );

    // Color shifts with warmth cycle
    const r = Math.floor(p.lerp(200, 232, warmth));
    const g = Math.floor(p.lerp(160, 180, warmth));
    const b = Math.floor(p.lerp(100, 80, warmth));

    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${layer.alpha})`);
    gradient.addColorStop(0.4, `rgba(${r}, ${g - 20}, ${b - 30}, ${layer.alpha * 0.5})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    p.drawingContext.fillStyle = gradient;
    p.drawingContext.fillRect(0, 0, p.width, p.height);
  }

  // Rim light: thin bright line at cloud/obstruction edges
  // (Applied as a screen-blend gradient at very low alpha)
  const rimGradient = p.drawingContext.createRadialGradient(
    sunX, sunY, 80,
    sunX, sunY, 120
  );
  rimGradient.addColorStop(0, 'rgba(232, 224, 200, 0)');
  rimGradient.addColorStop(0.5, `rgba(232, 224, 200, ${0.08 * intensity})`);
  rimGradient.addColorStop(1, 'rgba(232, 224, 200, 0)');

  p.drawingContext.fillStyle = rimGradient;
  p.drawingContext.fillRect(0, 0, p.width, p.height);
}
```

### Color Temperature Mapping

| Phase | Time | Color | Design Equivalent |
|-------|------|-------|-------------------|
| Warm peak | 0s | `rgb(232, 180, 80)` | `--amber` |
| Transitional | 11s | `rgb(216, 170, 90)` | `--amber` slightly cooled |
| Cool peak | 22s | `rgb(200, 160, 100)` | moving toward `--steel` |
| Returning warm | 33s | `rgb(216, 170, 90)` | warming again |
| Warm peak again | 45s | `rgb(232, 180, 80)` | cycle complete |

### Blend Mode

Apply this overlay with `globalCompositeOperation = 'screen'` or `'overlay'` for the most natural light interaction:

```javascript
p.drawingContext.globalCompositeOperation = 'screen';
drawGoldenHourOverlay(p, time, intensity);
p.drawingContext.globalCompositeOperation = 'source-over'; // reset
```

---

## 8. Effect 7: Film Grain Overlay {#8-film-grain}

### Design Intent (from DESIGN-SYSTEM.md)

> "Grain/texture overlay: Subtle film grain on the entire site... Makes digital surfaces feel touched."
> `--grain-opacity: 0.03`

### Mathematical Approach

Film grain is high-frequency temporal noise -- each pixel gets a random brightness offset that changes every frame. For realism, grain should be:

1. **Gaussian distributed** (not uniform) -- real film grain clusters
2. **Slightly correlated spatially** -- adjacent grain particles are slightly similar
3. **Luminance-dependent** -- grain is more visible in midtones, less in deep shadows and highlights

### Approach A: Canvas 2D (Simple, Good Enough)

```javascript
// Grain as a separate fixed overlay canvas (top of z-stack)
function createGrainOverlay() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    mix-blend-mode: overlay;
    opacity: 0.03;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let animId;

  function resize() {
    // Render at half resolution for performance, CSS scales up
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.imageRendering = 'auto'; // bilinear filtering softens grain
  }
  resize();
  window.addEventListener('resize', resize);

  function renderGrain() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    const len = data.length;

    for (let i = 0; i < len; i += 4) {
      const grain = Math.random() * 255;
      data[i] = grain;     // R
      data[i + 1] = grain; // G
      data[i + 2] = grain; // B
      data[i + 3] = 255;   // A (opacity controlled by CSS)
    }

    ctx.putImageData(imageData, 0, 0);
    animId = requestAnimationFrame(renderGrain);
  }

  renderGrain();

  return () => {
    cancelAnimationFrame(animId);
    canvas.remove();
  };
}
```

### Approach B: Pre-rendered Grain Tiles (BEST PERFORMANCE)

Generate 4-6 grain images at startup, then cycle between them each frame using CSS or canvas compositing. This avoids per-pixel random number generation every frame.

```javascript
function createGrainTiles(count = 6, tileSize = 256) {
  const tiles = [];
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = tileSize;
  tempCanvas.height = tileSize;
  const ctx = tempCanvas.getContext('2d');

  for (let t = 0; t < count; t++) {
    const imageData = ctx.createImageData(tileSize, tileSize);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Gaussian-ish distribution via Box-Muller
      const u1 = Math.random();
      const u2 = Math.random();
      const gaussian = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const grain = 128 + gaussian * 40; // mean=128, stddev=40

      data[i] = data[i + 1] = data[i + 2] = Math.max(0, Math.min(255, grain));
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    tiles.push(tempCanvas.toDataURL());
  }

  return tiles;
}

// React component
function FilmGrain() {
  const [tileIndex, setTileIndex] = useState(0);
  const tiles = useRef(null);

  useEffect(() => {
    tiles.current = createGrainTiles();
    let frame = 0;
    const interval = setInterval(() => {
      frame = (frame + 1) % tiles.current.length;
      setTileIndex(frame);
    }, 1000 / 24); // 24fps grain (film-like)

    return () => clearInterval(interval);
  }, []);

  if (!tiles.current) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        opacity: 0.03,
        backgroundImage: `url(${tiles.current[tileIndex]})`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}
```

### Approach C: WebGL Shader (MOST REALISTIC)

See Section 11 for a GLSL grain shader that runs entirely on the GPU with proper Gaussian distribution and temporal variation.

### Performance Note

The grain overlay at `opacity: 0.03` with `mix-blend-mode: overlay` is the most expensive part of any grain implementation, because blend modes force the browser to composite the entire viewport through a non-trivial operation each frame. Mitigations:

1. Render grain at 50% resolution (the softening actually improves realism)
2. Use 24fps update rate (not 60fps -- real film runs at 24fps)
3. Use `will-change: transform` on the grain element
4. Consider CSS-only approach for mobile: `background-image` with a static grain PNG tiled, no animation

---

## 9. Effect 8: Light Leak Effects {#9-light-leaks}

### Design Intent (from image-analyses/14)

> "A `position: fixed` gradient overlay that drifts slowly across the viewport... A barely-there pink warmth that moves across the site like light moving across a room."
> `--pink: #e8a8b0` -- "the accident color"

### Mathematical Approach

Light leaks are large, soft, colored gradients that drift across the viewport on very slow trajectories (60s+ cycle). They simulate light entering a camera body through gaps.

**Position animation:** Each leak blob follows a Lissajous curve (two sine waves at different frequencies for x and y):

```
leakX(t) = centerX + radiusX * sin(t * freqX + phaseX)
leakY(t) = centerY + radiusY * sin(t * freqY + phaseY)
```

Where `freqX` and `freqY` are irrational ratios to each other (e.g., 0.013 and 0.009) so the path never exactly repeats.

**Intensity animation:** The leak fades in and out on a separate cycle:

```
leakAlpha(t) = baseAlpha * (0.5 + 0.5 * sin(t * fadeFreq + fadePhase))
```

### Key p5.js Implementation

```javascript
function drawLightLeaks(p, time) {
  const leaks = [
    {
      // Right-side pink bloom (from img14)
      freqX: 0.013, freqY: 0.009,
      phaseX: 0, phaseY: 1.2,
      radiusX: p.width * 0.3, radiusY: p.height * 0.2,
      centerX: p.width * 0.75, centerY: p.height * 0.3,
      size: 400,
      color: [232, 168, 176], // --pink
      baseAlpha: 0.05,
      fadeFreq: 0.008,
    },
    {
      // Left-edge vertical band (from img14)
      freqX: 0.007, freqY: 0.011,
      phaseX: 2.5, phaseY: 0.8,
      radiusX: p.width * 0.15, radiusY: p.height * 0.35,
      centerX: p.width * 0.1, centerY: p.height * 0.5,
      size: 300,
      color: [232, 216, 208], // light leak white-warm
      baseAlpha: 0.035,
      fadeFreq: 0.006,
    },
    {
      // Subtle warm drift (lower third)
      freqX: 0.01, freqY: 0.014,
      phaseX: 4.0, phaseY: 3.0,
      radiusX: p.width * 0.4, radiusY: p.height * 0.15,
      centerX: p.width * 0.5, centerY: p.height * 0.7,
      size: 500,
      color: [216, 168, 96], // --amber tint
      baseAlpha: 0.025,
      fadeFreq: 0.005,
    },
  ];

  p.drawingContext.globalCompositeOperation = 'screen';

  for (const leak of leaks) {
    const x = leak.centerX + leak.radiusX * Math.sin(time * leak.freqX + leak.phaseX);
    const y = leak.centerY + leak.radiusY * Math.sin(time * leak.freqY + leak.phaseY);
    const alpha = leak.baseAlpha * (0.5 + 0.5 * Math.sin(time * leak.fadeFreq));

    const gradient = p.drawingContext.createRadialGradient(x, y, 0, x, y, leak.size);
    gradient.addColorStop(0, `rgba(${leak.color[0]}, ${leak.color[1]}, ${leak.color[2]}, ${alpha})`);
    gradient.addColorStop(0.5, `rgba(${leak.color[0]}, ${leak.color[1]}, ${leak.color[2]}, ${alpha * 0.4})`);
    gradient.addColorStop(1, `rgba(${leak.color[0]}, ${leak.color[1]}, ${leak.color[2]}, 0)`);

    p.drawingContext.fillStyle = gradient;
    p.drawingContext.beginPath();
    p.drawingContext.arc(x, y, leak.size, 0, Math.PI * 2);
    p.drawingContext.fill();
  }

  p.drawingContext.globalCompositeOperation = 'source-over';
}
```

### CSS-Only Alternative (Lighter Weight)

For maximum performance, the light leak can be pure CSS with no JavaScript animation frame:

```css
.light-leak {
  position: fixed;
  inset: 0;
  z-index: 9998;
  pointer-events: none;
  opacity: 1;
}

.light-leak::before {
  content: '';
  position: absolute;
  width: 60vw;
  height: 60vh;
  border-radius: 50%;
  background: radial-gradient(
    ellipse,
    rgba(232, 168, 176, 0.05) 0%,
    rgba(232, 168, 176, 0.02) 40%,
    transparent 70%
  );
  animation: leak-drift-1 65s ease-in-out infinite alternate;
}

.light-leak::after {
  content: '';
  position: absolute;
  width: 45vw;
  height: 45vh;
  border-radius: 50%;
  background: radial-gradient(
    ellipse,
    rgba(232, 216, 208, 0.04) 0%,
    rgba(232, 216, 208, 0.015) 40%,
    transparent 70%
  );
  animation: leak-drift-2 80s ease-in-out infinite alternate;
}

@keyframes leak-drift-1 {
  0%   { transform: translate(50vw, -10vh); }
  33%  { transform: translate(60vw, 30vh); }
  66%  { transform: translate(40vw, 10vh); }
  100% { transform: translate(55vw, 40vh); }
}

@keyframes leak-drift-2 {
  0%   { transform: translate(-15vw, 20vh); }
  50%  { transform: translate(-5vw, 60vh); }
  100% { transform: translate(-20vw, 35vh); }
}
```

This uses zero JavaScript, runs on the compositor thread (GPU-accelerated), and has essentially no performance cost.

---

## 10. Scene Transition System {#10-scene-transitions}

### The Transition Problem

The site needs to morph between four nature environments:
- **Sky/Clouds** (Landing) -> **Ocean** (Music) -> **Grass** (About) -> **Golden Hour** (Store)

Each transition must feel organic -- not a hard cut, not a simple crossfade.

### Approach: Shader-Based Dissolve with Particle Bridging

The most effective approach uses two layers:

1. **Base layer:** A full-screen shader or canvas that renders both the outgoing and incoming scenes, blending between them with a noise-driven dissolve mask
2. **Particle layer:** The particle system (Section 6) provides the visual bridge -- particles from scene A lift, transform, and settle into scene B positions

### Noise Dissolve Math

Instead of a uniform fade, use Perlin noise to create an organic dissolve boundary:

```
dissolveAlpha(x, y, progress) =
    smoothstep(progress - 0.1, progress + 0.1,
      noise(x * 0.003, y * 0.003) + verticalBias
    )

// verticalBias makes the transition sweep upward or downward
verticalBias = (y / height) * 0.3  // bottom transitions first
```

At `progress = 0`, scene A is fully visible. At `progress = 1`, scene B is fully visible. The noise creates an irregular, cloud-like boundary that sweeps across the screen.

### Implementation Pattern

```javascript
// Scene manager
class SceneManager {
  constructor(p5Instance) {
    this.p = p5Instance;
    this.currentScene = null;
    this.nextScene = null;
    this.transitionProgress = 0;
    this.transitioning = false;

    this.scenes = {
      sky: new SkyScene(p5Instance),
      ocean: new OceanScene(p5Instance),
      grass: new GrassScene(p5Instance),
      golden: new GoldenHourScene(p5Instance),
    };
  }

  transitionTo(sceneName, duration = 5000) {
    if (this.transitioning) return;
    this.nextScene = this.scenes[sceneName];
    this.transitioning = true;
    this.transitionProgress = 0;
    this.transitionDuration = duration;

    // Snapshot current scene to a buffer
    this.currentBuffer = this.p.createGraphics(this.p.width, this.p.height);
    this.currentScene.renderTo(this.currentBuffer);
  }

  update(deltaTime) {
    if (this.transitioning) {
      this.transitionProgress += deltaTime / this.transitionDuration;

      if (this.transitionProgress >= 1) {
        this.transitionProgress = 1;
        this.transitioning = false;
        this.currentScene = this.nextScene;
        this.nextScene = null;
        this.currentBuffer = null;
      }
    }
  }

  render() {
    if (!this.transitioning) {
      this.currentScene.render();
      return;
    }

    // Render incoming scene
    this.nextScene.render();

    // Overlay outgoing scene with dissolve mask
    this.p.push();
    this.p.loadPixels();

    // For each pixel, decide if it should show the old scene
    // (This is slow in Canvas 2D -- use WebGL in production)
    const img = this.currentBuffer;
    img.loadPixels();

    for (let x = 0; x < this.p.width; x += 2) {
      for (let y = 0; y < this.p.height; y += 2) {
        const n = this.p.noise(x * 0.003, y * 0.003);
        const bias = (y / this.p.height) * 0.3;
        const threshold = this.transitionProgress;

        if (n + bias < threshold) {
          // New scene shows through (already rendered)
          continue;
        }
        // Old scene pixel
        // ... copy from currentBuffer to main canvas
      }
    }

    this.p.updatePixels();
    this.p.pop();
  }
}
```

### Recommended: WebGL Dissolve (Section 11)

The per-pixel dissolve above is far too expensive in Canvas 2D. The proper implementation renders both scenes to WebGL textures and blends them in a fragment shader. See Section 11.

### Scene Transition Map (Matching STYLE-DECISIONS.md)

```
LANDING (Sky/Clouds)
  |
  | scroll down -- clouds part, particles descend
  v
MUSIC (Ocean)
  |
  | scroll down -- water drains, particles rise and green
  v
ABOUT (Grass Field)
  |
  | scroll down -- grass warms, golden light intensifies
  v
STORE (Golden Hour)
  |
  | scroll down -- warmth fades, dusk gradient
  v
FOOTER (Dusk/Void)
```

---

## 11. WebGL/GLSL Shader Implementations {#11-webgl-shaders}

Shaders are the correct tool for effects that operate per-pixel at screen resolution (ocean, clouds, grain, light leaks). p5.js supports GLSL shaders in WEBGL mode.

### Loading Shaders in p5.js

```javascript
let oceanShader;

p.preload = () => {
  oceanShader = p.loadShader('shaders/ocean.vert', 'shaders/ocean.frag');
};

p.draw = () => {
  p.shader(oceanShader);
  oceanShader.setUniform('u_time', p.millis() / 1000.0);
  oceanShader.setUniform('u_resolution', [p.width, p.height]);
  oceanShader.setUniform('u_mouse', [p.mouseX / p.width, 1.0 - p.mouseY / p.height]);
  p.rect(0, 0, p.width, p.height); // full-screen quad
};
```

### Vertex Shader (Shared by All Effects)

```glsl
// ocean.vert (same for all full-screen effects)
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
```

### Shader A: Ocean Surface with Cursor Reveal

```glsl
// ocean.frag
precision highp float;

varying vec2 vTexCoord;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;           // normalized 0-1
uniform sampler2D u_scoreTexture; // pre-rendered score sheets
uniform float u_revealRadius;    // cursor reveal radius in UV space

// Simplex noise functions (include a noise library or use this)
// Using the standard GLSL noise approach:

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * snoise(p);
    p *= 2.1;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vTexCoord;
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

  // Wave surface
  float t = u_time;
  float waveHeight =
    0.015 * sin(uv.x * 8.0 + t * 0.4) +
    0.008 * sin(uv.x * 20.0 + t * 0.7 + 1.3) +
    0.012 * fbm(vec3(uv * 5.0, t * 0.1)) +
    0.004 * snoise(vec3(uv * 12.0, t * 0.15));

  float surfaceLine = 0.45 + waveHeight;

  // Cursor displacement -- creates the "parting" bowl
  float cursorDist = length((uv - u_mouse) * aspect);
  float revealStrength = smoothstep(u_revealRadius, 0.0, cursorDist);

  // Deeper displacement near cursor (push surface down)
  float displacedSurface = surfaceLine + revealStrength * 0.4;

  // Water color by depth
  float depth = (uv.y - displacedSurface) / 0.55;
  depth = clamp(depth, 0.0, 1.0);

  vec3 shallowTeal = vec3(0.165, 0.541, 0.541);  // #2a8a8a
  vec3 deepTeal    = vec3(0.094, 0.345, 0.345);   // #185858
  vec3 waterColor  = mix(shallowTeal, deepTeal, depth);

  // Surface highlights (crest foam)
  float crest = smoothstep(0.01, -0.005, uv.y - surfaceLine);
  vec3 crestColor = vec3(0.784, 0.847, 0.847); // spray white #c8d8d8
  waterColor = mix(waterColor, crestColor, crest * 0.5);

  // Water alpha: 0 where cursor reveals, 1 elsewhere
  float waterAlpha = 1.0;
  if (uv.y > displacedSurface) {
    waterAlpha = 1.0 - revealStrength;
  } else {
    waterAlpha = 0.0; // above water = transparent (sky)
  }

  // Score sheet layer (always behind water)
  vec4 scoreColor = texture2D(u_scoreTexture, uv);

  // Composite: score beneath, water on top
  vec3 finalColor = mix(scoreColor.rgb, waterColor, waterAlpha);

  // Above-water area: subtle sky gradient
  if (uv.y < surfaceLine - 0.02) {
    float skyT = uv.y / surfaceLine;
    vec3 skyColor = mix(vec3(0.04, 0.055, 0.063), vec3(0.408, 0.533, 0.627), skyT);
    finalColor = skyColor;
  }

  // Caustic light refraction on the score sheet layer
  if (revealStrength > 0.1) {
    float caustic = snoise(vec3(uv * 30.0, t * 0.3)) * 0.5 + 0.5;
    caustic = pow(caustic, 3.0) * revealStrength * 0.15;
    finalColor += vec3(caustic * 0.5, caustic * 0.8, caustic);
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
```

### Shader B: Cloud Field with Crepuscular Rays

```glsl
// clouds.frag
precision highp float;

varying vec2 vTexCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_partAmount; // 0=closed, 1=parted

// Include snoise and fbm from above

void main() {
  vec2 uv = vTexCoord;
  float t = u_time;

  // Sky gradient
  vec3 skyTop = vec3(0.408, 0.533, 0.627);   // #6888a0 steel
  vec3 skyBot = vec3(0.22, 0.28, 0.35);       // darker
  vec3 sky = mix(skyBot, skyTop, uv.y);

  // Sun position (hidden behind clouds, slightly below center)
  vec2 sunPos = vec2(0.5, 0.55);

  // Crepuscular rays
  float angle = atan(uv.y - sunPos.y, (uv.x - sunPos.x) * (u_resolution.x / u_resolution.y));
  float dist = length((uv - sunPos) * vec2(u_resolution.x / u_resolution.y, 1.0));

  float rayNoise = snoise(vec3(angle * 8.0, t * 0.05, 0.0)) * 0.5 + 0.5;
  float rayFalloff = 1.0 / (1.0 + dist * 3.0);
  float rays = rayNoise * rayFalloff * 0.15;

  vec3 rayColor = vec3(0.91, 0.88, 0.80); // rim light white-gold #e8e0c8
  sky += rayColor * rays;

  // Central glow (the hidden sun's rim light)
  float glow = exp(-dist * 4.0) * 0.2;
  sky += rayColor * glow;

  // Clouds (fBm noise displaced for parting)
  vec2 cloudUV = uv;
  // Displacement for parting: push noise coords away from center
  vec2 partDisp = (uv - vec2(0.5)) * u_partAmount * 0.5;
  cloudUV += partDisp;

  float cloudDensity = fbm(vec3(cloudUV * 3.0 + vec2(t * 0.02, 0.0), t * 0.05));
  cloudDensity = smoothstep(0.0, 0.3, cloudDensity); // threshold

  // Cloud lit from below
  float underlight = smoothstep(0.3, 0.7, 1.0 - uv.y);
  vec3 cloudDark = vec3(0.28, 0.345, 0.41);      // cloud face #485868
  vec3 cloudLit  = vec3(0.847, 0.78, 0.58);       // gold-lit underside
  vec3 cloudColor = mix(cloudDark, cloudLit, underlight * 0.4);

  // Mix cloud into sky
  vec3 finalColor = mix(sky, cloudColor, cloudDensity * 0.85);

  gl_FragColor = vec4(finalColor, 1.0);
}
```

### Shader C: Film Grain (Post-Processing)

```glsl
// grain.frag
precision highp float;

varying vec2 vTexCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_sceneTexture; // the rendered scene
uniform float u_grainIntensity;   // default 0.03

// Hash function for pseudo-random grain
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Gaussian-distributed grain from uniform random
float gaussianGrain(vec2 uv, float t) {
  float u1 = hash(uv + t);
  float u2 = hash(uv + t + 0.1);

  // Box-Muller transform
  float grain = sqrt(-2.0 * log(max(u1, 0.001))) * cos(6.28318 * u2);
  return grain;
}

void main() {
  vec4 scene = texture2D(u_sceneTexture, vTexCoord);

  // Grain varies per pixel per frame
  float grain = gaussianGrain(
    vTexCoord * u_resolution,
    floor(u_time * 24.0) // 24fps grain update
  );

  // Luminance-dependent grain: more visible in midtones
  float luminance = dot(scene.rgb, vec3(0.299, 0.587, 0.114));
  float grainMask = 1.0 - abs(luminance - 0.5) * 2.0; // peaks at mid grey
  grainMask = max(grainMask, 0.3); // always some grain

  float grainAmount = grain * u_grainIntensity * grainMask;

  // Apply as overlay blend
  vec3 grainColor = vec3(grainAmount);
  vec3 result = scene.rgb + grainColor;

  gl_FragColor = vec4(result, scene.a);
}
```

### Shader D: Scene Dissolve Transition

```glsl
// dissolve.frag
precision highp float;

varying vec2 vTexCoord;
uniform sampler2D u_sceneA;       // outgoing scene
uniform sampler2D u_sceneB;       // incoming scene
uniform float u_progress;          // 0-1
uniform float u_time;

// Include snoise from above

void main() {
  vec2 uv = vTexCoord;

  vec4 colorA = texture2D(u_sceneA, uv);
  vec4 colorB = texture2D(u_sceneB, uv);

  // Noise dissolve with vertical bias (bottom transitions first)
  float noise = snoise(vec3(uv * 4.0, u_time * 0.1)) * 0.5 + 0.5;
  float verticalBias = uv.y * 0.3;
  float mask = smoothstep(u_progress - 0.1, u_progress + 0.1, noise + verticalBias);

  // At the dissolve boundary, add a bright edge (the transition glow)
  float edge = smoothstep(0.0, 0.05, abs(noise + verticalBias - u_progress));
  vec3 edgeColor = vec3(0.91, 0.88, 0.80) * (1.0 - edge) * 0.3; // warm glow at boundary

  vec4 result = mix(colorB, colorA, mask);
  result.rgb += edgeColor;

  gl_FragColor = result;
}
```

### p5.js Multi-Pass Rendering Pattern

To use the dissolve shader, render each scene to a framebuffer first:

```javascript
let sceneABuffer, sceneBBuffer, dissolveShader;

p.setup = () => {
  p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
  sceneABuffer = p.createGraphics(p.width, p.height, p.WEBGL);
  sceneBBuffer = p.createGraphics(p.width, p.height, p.WEBGL);
  dissolveShader = p.loadShader('dissolve.vert', 'dissolve.frag');
};

p.draw = () => {
  // Render scene A to buffer
  sceneABuffer.shader(oceanShader);
  oceanShader.setUniform('u_time', p.millis() / 1000);
  // ... set uniforms
  sceneABuffer.rect(0, 0, p.width, p.height);

  // Render scene B to buffer
  sceneBBuffer.shader(cloudShader);
  // ... set uniforms
  sceneBBuffer.rect(0, 0, p.width, p.height);

  // Composite with dissolve
  p.shader(dissolveShader);
  dissolveShader.setUniform('u_sceneA', sceneABuffer);
  dissolveShader.setUniform('u_sceneB', sceneBBuffer);
  dissolveShader.setUniform('u_progress', transitionProgress);
  dissolveShader.setUniform('u_time', p.millis() / 1000);
  p.rect(0, 0, p.width, p.height);
};
```

---

## 12. Three.js Integration for 3D Elements {#12-threejs-integration}

### When to Use Three.js vs. p5.js

| Task | Use p5.js | Use Three.js |
|------|-----------|-------------|
| 2D particle effects | Yes | Overkill |
| Full-screen shader effects | Yes (WEBGL mode) | Also works |
| 3D objects with depth and lighting | Awkward | Yes |
| Camera movement through scenes | No | Yes |
| Score sheets with 3D rotation + lighting | Fake it | Proper solution |
| Realistic paper/parchment materials | No | Yes (PBR materials) |

### Integration Pattern: Three.js Canvas Alongside React

```jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ScoreSheetScene({ scrollProgress }) {
  const mountRef = useRef(null);
  const sceneRef = useRef({});

  useEffect(() => {
    const { current: container } = mountRef;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,  // transparent background to overlay on site
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // transparent
    container.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    // Lighting: warm directional (golden hour)
    const sunLight = new THREE.DirectionalLight(0xd8a860, 0.6);
    sunLight.position.set(5, 8, 3);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x6888a0, 0.3);
    scene.add(ambientLight);

    // Score sheet geometry
    const sheetGeometry = new THREE.PlaneGeometry(1.2, 1.6, 8, 8);

    // Parchment material
    const sheetMaterial = new THREE.MeshStandardMaterial({
      color: 0xd9c89e,         // --parchment
      roughness: 0.8,          // paper texture
      metalness: 0.0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });

    // Create multiple sheets
    const sheets = [];
    const SHEET_COUNT = 15;

    for (let i = 0; i < SHEET_COUNT; i++) {
      const mesh = new THREE.Mesh(sheetGeometry, sheetMaterial.clone());

      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 0.3
      );

      // Store animation parameters
      mesh.userData = {
        windPhase: Math.random() * Math.PI * 2,
        windSpeed: 0.3 + Math.random() * 0.5,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.003,
          y: (Math.random() - 0.5) * 0.002,
          z: (Math.random() - 0.5) * 0.001,
        },
        driftSpeed: {
          x: (Math.random() - 0.5) * 0.005,
          y: 0.002 + Math.random() * 0.005, // upward drift
          z: (Math.random() - 0.5) * 0.003,
        },
        flutterAmplitude: 0.02 + Math.random() * 0.03,
      };

      scene.add(mesh);
      sheets.push(mesh);
    }

    // Staff line texture (procedural)
    function createScoreTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 640;
      const ctx = canvas.getContext('2d');

      // Parchment background
      ctx.fillStyle = '#d9c89e';
      ctx.fillRect(0, 0, 512, 640);

      // Paper texture noise
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 640;
        const alpha = Math.random() * 0.06;
        ctx.fillStyle = `rgba(100, 80, 50, ${alpha})`;
        ctx.fillRect(x, y, 1, 1);
      }

      // Staff lines
      ctx.strokeStyle = 'rgba(80, 65, 40, 0.5)';
      ctx.lineWidth = 1;
      const staffSets = 3; // groups of 5 lines
      const staffSpacing = 180;
      const lineGap = 12;

      for (let s = 0; s < staffSets; s++) {
        const baseY = 80 + s * staffSpacing;
        for (let l = 0; l < 5; l++) {
          ctx.beginPath();
          ctx.moveTo(40, baseY + l * lineGap);
          ctx.lineTo(472, baseY + l * lineGap);
          ctx.stroke();
        }
      }

      // Random "note" marks
      ctx.fillStyle = 'rgba(40, 30, 20, 0.6)';
      for (let i = 0; i < 30; i++) {
        const x = 60 + Math.random() * 380;
        const staffSet = Math.floor(Math.random() * staffSets);
        const y = 78 + staffSet * staffSpacing + Math.random() * (lineGap * 5);

        ctx.beginPath();
        ctx.ellipse(x, y, 4, 3, Math.random() * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Stem
        if (Math.random() > 0.3) {
          ctx.beginPath();
          ctx.moveTo(x + 3.5, y);
          ctx.lineTo(x + 3.5, y - 25);
          ctx.strokeStyle = 'rgba(40, 30, 20, 0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    }

    // Apply texture to sheets
    const scoreTexture = createScoreTexture();
    sheets.forEach(sheet => {
      sheet.material.map = scoreTexture;
      sheet.material.needsUpdate = true;
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
      const time = clock.getElapsedTime();

      sheets.forEach(sheet => {
        const d = sheet.userData;

        // Wind drift
        sheet.position.x += d.driftSpeed.x + Math.sin(time * d.windSpeed + d.windPhase) * 0.003;
        sheet.position.y += d.driftSpeed.y;
        sheet.position.z += d.driftSpeed.z;

        // Rotation: slow tumble + flutter
        sheet.rotation.x += d.rotSpeed.x + Math.sin(time * 3 + d.windPhase) * d.flutterAmplitude;
        sheet.rotation.y += d.rotSpeed.y;
        sheet.rotation.z += d.rotSpeed.z + Math.cos(time * 2.3 + d.windPhase) * d.flutterAmplitude * 0.5;

        // Paper flutter: deform the plane geometry
        const positions = sheet.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);
          const flutter = Math.sin(x * 3 + time * 2 + d.windPhase) * 0.04
                        + Math.sin(y * 2 + time * 1.5) * 0.03;
          positions.setZ(i, flutter);
        }
        positions.needsUpdate = true;

        // Respawn if out of view
        if (sheet.position.y > 15 || Math.abs(sheet.position.x) > 15) {
          sheet.position.set(
            (Math.random() - 0.5) * 20,
            -10 - Math.random() * 5,
            (Math.random() - 0.5) * 10
          );
        }
      });

      // Camera movement linked to scroll
      const progress = sceneRef.current.scrollProgress || 0;
      camera.position.y = progress * 5;
      camera.position.z = 10 - progress * 3;
      camera.lookAt(0, progress * 2, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  // Bridge scroll progress from React
  useEffect(() => {
    sceneRef.current.scrollProgress = scrollProgress;
  }, [scrollProgress]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
```

### Three.js Camera Movement Through Scenes

For a cinematic scroll-through-worlds experience:

```javascript
// Camera path: Bezier curve through scene waypoints
const cameraPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 15),    // Starting: looking at sky/clouds
  new THREE.Vector3(0, -5, 10),   // Descending toward ocean
  new THREE.Vector3(2, -10, 8),   // Through the water
  new THREE.Vector3(0, -8, 5),    // Rising through grass
  new THREE.Vector3(-1, -3, 3),   // Golden hour close-up
]);

// In animation loop:
const scrollT = clamp(scrollProgress, 0, 1);
const pos = cameraPath.getPoint(scrollT);
const lookAt = cameraPath.getPoint(Math.min(scrollT + 0.05, 1));

camera.position.copy(pos);
camera.lookAt(lookAt);
```

### Three.js + p5.js Coexistence

If using both (Three.js for 3D score sheets, p5.js for 2D effects), layer their canvases:

```
z-index: 2  ->  Three.js canvas (3D score sheets, transparent background)
z-index: 1  ->  p5.js canvas (ocean/sky/grass, film grain)
z-index: 0  ->  HTML content
```

Both canvases use `pointerEvents: none`. Mouse coordinates are tracked on the window and shared via the mutable ref pattern described in Section 1.

### R3F (React Three Fiber) Alternative

For deeper React integration, consider `@react-three/fiber` and `@react-three/drei`:

```jsx
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

function ScoreSheet({ position, rotation }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x += 0.001;
    meshRef.current.position.y += Math.sin(time) * 0.001;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position} rotation={rotation}>
        <planeGeometry args={[1.2, 1.6, 8, 8]} />
        <meshStandardMaterial
          color="#d9c89e"
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

function Scene3D() {
  return (
    <Canvas
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
      }}
      gl={{ alpha: true }}
      camera={{ position: [0, 0, 10], fov: 60 }}
    >
      <ambientLight intensity={0.3} color="#6888a0" />
      <directionalLight position={[5, 8, 3]} intensity={0.6} color="#d8a860" />
      {Array.from({ length: 15 }, (_, i) => (
        <ScoreSheet
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10,
          ]}
        />
      ))}
    </Canvas>
  );
}
```

---

## 13. Performance Budget and Optimization {#13-performance}

### Target: 60fps on Mid-Range Hardware

The MKS site must maintain smooth performance alongside React rendering, audio playback, and DOM content. Budget allocation:

| Component | GPU Budget | CPU Budget |
|-----------|-----------|-----------|
| Nature scene (ocean/sky/grass) | 4ms | 2ms |
| Score sheet 3D | 2ms | 1ms |
| Film grain | 1ms | 0.5ms |
| Light leaks | 0.5ms | 0ms (CSS only) |
| Golden hour overlay | 0.5ms | 0ms |
| Particle transitions | 2ms | 2ms |
| React rendering | N/A | 4ms |
| **Total per frame** | **~10ms** | **~9.5ms** |
| **Remaining headroom** | **~6.5ms** | **~7ms** |

### Key Optimizations

#### 1. `pixelDensity(1)` in p5.js

On Retina/HiDPI displays, p5.js defaults to `pixelDensity(2)`, which quadruples the pixel count. For full-screen ambient effects, `pixelDensity(1)` is sufficient and the slight softness actually contributes to the dreamy aesthetic.

```javascript
p.setup = () => {
  p.pixelDensity(1); // CRITICAL
  p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
};
```

#### 2. Offscreen Buffers at Reduced Resolution

Render noise-heavy effects (clouds, ocean) at 50% resolution and scale up:

```javascript
const halfBuffer = p.createGraphics(p.width / 2, p.height / 2, p.WEBGL);
// ... render to halfBuffer
p.image(halfBuffer, 0, 0, p.width, p.height); // GPU scales up
```

#### 3. Temporal Coherence

Many effects (clouds, grain, light leaks) do not need to update every frame. Use frame skipping:

```javascript
// Update clouds every 2nd frame
if (p.frameCount % 2 === 0) {
  updateCloudBuffer();
}
// Always draw the cached buffer
p.image(cloudBuffer, 0, 0);
```

#### 4. Object Pooling for Particles

Never allocate during the animation loop:

```javascript
// Pre-allocate all particles
const pool = Array.from({ length: MAX_PARTICLES }, () => new Particle());
let activeCount = 0;

function spawn() {
  if (activeCount < MAX_PARTICLES) {
    pool[activeCount].reset();
    activeCount++;
  }
}

function remove(index) {
  // Swap with last active
  [pool[index], pool[activeCount - 1]] = [pool[activeCount - 1], pool[index]];
  activeCount--;
}
```

#### 5. Use `requestAnimationFrame` Wisely

When the tab is not visible, pause all canvas animations:

```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(animId);
  } else {
    animId = requestAnimationFrame(animate);
  }
});
```

#### 6. `will-change` and Layer Promotion

For CSS-based effects (light leaks, grain overlay), use `will-change: transform` to promote to GPU compositor layers:

```css
.light-leak {
  will-change: transform;
  transform: translateZ(0); /* force GPU layer */
}
```

#### 7. Mobile Strategy

On mobile (detected via `window.innerWidth < 768` or `navigator.maxTouchPoints > 0`):

- Reduce particle counts by 60%
- Disable film grain animation (use static grain image)
- Disable cursor-parting effect (no cursor on touch)
- Reduce shader resolution to 33%
- Use CSS-only light leaks exclusively
- Skip Three.js entirely (2D score sheet fallback)

```javascript
const IS_MOBILE = window.innerWidth < 768 || navigator.maxTouchPoints > 0;
const PARTICLE_COUNT = IS_MOBILE ? 500 : 2000;
const SHADER_SCALE = IS_MOBILE ? 3 : 1;
```

#### 8. `prefers-reduced-motion` Respect

Per the DESIGN-SYSTEM.md motion anti-patterns:

```javascript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced) {
  // Fall back to static scene images with gentle opacity pulse
  // No particle animations, no wave motion
  // Use CSS `transition: opacity 300ms` only
}
```

### Profiling Checklist

1. **Chrome DevTools Performance tab:** Record 5 seconds of the site, check for frames exceeding 16ms
2. **`p5.js frameRate()` display:** Add `p.text(p.frameRate().toFixed(1), 10, 20)` during development
3. **GPU memory:** Check via `chrome://gpu` -- keep under 200MB for ambient effects
4. **Main thread blocking:** Ensure no `loadPixels()` / `updatePixels()` calls on the main canvas at full resolution
5. **Shader compilation:** Compile all shaders during initial load, not on first use during a transition

---

## Appendix A: File Organization

Recommended file structure for the effects system:

```
src/
  effects/
    EffectsCanvas.jsx        # Main p5.js instance, manages all scenes
    SceneManager.js           # Handles transitions between scenes
    scenes/
      OceanScene.js           # Ocean surface + cursor reveal
      SkyScene.js             # Clouds + crepuscular rays
      GrassScene.js           # Windswept grass field
      GoldenHourScene.js      # Warm directional light
    overlays/
      FilmGrain.jsx           # Grain overlay component
      LightLeaks.jsx          # Light leak CSS component (or canvas)
      GoldenHourOverlay.jsx   # Golden light overlay
    particles/
      ParticleSystem.js       # Core particle engine
      TransitionParticle.js   # Particle with dual-target morphing
    shaders/
      ocean.vert
      ocean.frag
      clouds.vert
      clouds.frag
      grain.frag
      dissolve.frag
      common.glsl             # Shared noise functions
    three/
      ScoreSheetScene.jsx     # Three.js score sheet 3D scene
      scoreTexture.js         # Procedural score sheet texture generator
    utils/
      noiseField.js           # Perlin noise utilities
      easing.js               # Easing functions
      sharedState.js          # React-to-canvas state bridge
```

## Appendix B: Package Dependencies

```json
{
  "dependencies": {
    "p5": "^1.11.0",
    "three": "^0.170.0",
    "@react-three/fiber": "^8.17.0",
    "@react-three/drei": "^9.114.0"
  }
}
```

Notes:
- `p5` is the core creative coding library; use instance mode only (no global mode)
- `three` is needed only if implementing the 3D score sheet scene
- `@react-three/fiber` and `@react-three/drei` are optional convenience layers over Three.js; use if you prefer the declarative React approach
- Do NOT install `react-p5` -- it is unmaintained and incompatible with React 19

## Appendix C: Quick Reference -- Which Technique for Which Effect

| Effect | Simplest | Best Quality | Best Performance |
|--------|----------|-------------|-----------------|
| Ocean surface | Canvas 2D strips | GLSL shader | GLSL shader |
| Cursor reveal | Displacement map on CPU | GLSL uniform mouse | GLSL uniform mouse |
| Clouds | Canvas 2D + noise grid | GLSL fBm shader | GLSL fBm shader |
| Crepuscular rays | Canvas 2D radial gradient | GLSL radial + noise | GLSL shader |
| Cloud parting | Noise coordinate displacement | GLSL uniform | GLSL uniform |
| Grass field | Canvas 2D Bezier strokes | WebGL instanced lines | WebGL instanced quads |
| Score sheets (2D) | Canvas 2D fake perspective | p5.js WEBGL mode | p5.js WEBGL mode |
| Score sheets (3D) | Three.js PlaneGeometry | Three.js + custom shader | Three.js instanced mesh |
| Particle transitions | Canvas 2D circles | WebGL point sprites | WebGL point sprites |
| Golden hour | Canvas 2D radial gradients | GLSL screen blend | CSS radial-gradient + animation |
| Film grain | Pre-rendered tiles + CSS | GLSL post-process shader | Pre-rendered tiles (24fps) |
| Light leaks | CSS gradients + keyframes | Canvas 2D screen blend | CSS gradients + keyframes |
| Scene transitions | Canvas 2D pixel copy | GLSL dissolve shader | GLSL dissolve shader |
