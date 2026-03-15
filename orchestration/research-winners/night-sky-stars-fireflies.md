# Winner: Night Sky Stars + Fireflies

> Experiment: exp-008-night-stars-v2 | Score: 56/70 | FPS: 121 @ 1080p
> Source: Nugget8/Three.js-Ocean-Scene (stars) + Alex-DG (fireflies)
> Target: Night Meadow — "Bittersweet Letting Go"

## What It Does

Two-layer particle system for the Night Meadow world:
1. **Stars** — 8K points on a 500-unit sphere, pow(rand,3) brightness distribution, 6 spectral colors, visibility fades with sky brightness
2. **Fireflies** — 400 points with vertical bob, horizontal drift, pulsing brightness, amber glow (artist color), additive blending

## Magic Values Table

### Star Generation (JS-side)
| Value | Purpose |
|-------|---------|
| `count = 8000` | Total star count |
| `seed = 87` | Seeded PRNG (from extraction) |
| `pow(random, 3)` | Brightness distribution (softened from extraction's pow6) |
| `absY * 0.8 + 0.2` | Bias stars toward upper hemisphere |
| `position * 500.0` | Sphere radius (in vertex shader) |
| 6 color types | Warm white, pink-white, cool blue-white, blue-white, pink-white, pure white |

### Star Rendering (GLSL)
| Value | Purpose |
|-------|---------|
| `gl_PointSize = size * (1.0 + brightness * 3.0)` | Size scales with brightness |
| `starSize = 2.5` | Base point size |
| `pow(1-dist, 8.0)` | Point radial falloff (softer than extraction's 50.0) |
| `exp(-skyBrightness * 15.0) * 450.0` | Visibility fade: FALLOFF=15, VISIBILITY=450 |
| `brightness * 10.0` | Alpha multiplier |

### Star Colors (from Nugget8 extraction)
```
vec3(1.0, 0.95, 0.9)   // Warm white (G/K type)
vec3(1.0, 0.9, 0.9)    // Warm pink-white
vec3(0.9, 1.0, 1.0)    // Cool blue-white (A type)
vec3(0.9, 0.95, 1.0)   // Blue-white (B type)
vec3(1.0, 0.9, 1.0)    // Pink-white
vec3(1.0, 1.0, 1.0)    // Pure white
```

### Firefly Rendering
| Value | Purpose |
|-------|---------|
| `count = 400` | Firefly count |
| `sin(uTime * 0.8 + phase * 6.28) * 0.3` | Vertical bob (Alex-DG) |
| `sin(uTime * 0.3 + phase * 3.14) * 0.1` | Horizontal drift |
| `0.5 + 0.5 * sin(uTime * 1.5 + phase * 6.28)` | Pulsing brightness |
| `exp(-dist*dist * 4.0)` | Soft radial glow |
| `amberColor = (0.83, 0.79, 0.41)` | #d4c968 territory (artist color) |
| `gl_PointSize = (3 + brightness * 4) * (200 / -mvPos.z)` | Distance-scaled size |
| Additive blending, no depth write | Glow accumulates |
| `minHeight = 0.5, maxHeight = 3.0` | Hover range above terrain |

### Night Atmosphere
| Value | Purpose |
|-------|---------|
| `skyTurbidity: 2.0` | Minimal haze |
| `skyRayleigh: 0.1` | Minimal scattering (dark sky) |
| `sunElevation: -5°` | Sun below horizon |
| `moonDirection: (0.3, 0.5, -0.4)` | Moon position |
| `moonColor: #6688bb` | Cool blue-white moonlight |
| `moonLight intensity: 0.6` | Subtle illumination |
| `ambient: #1a2a3a @ 0.15` | Very dim blue fill |
| `grassBase: #0a1a10, grassTip: #1a3a28` | Dark blue-green grass |
| `fogColor: #060a10, fogDensity: 0.012` | Very dark blue fog |

### Star Fade with Sky Brightness
```javascript
// In scroll handler:
starMat.uniforms.uSkyBrightness.value = THREE.MathUtils.lerp(0.05, 0.2, scrollProgress)
// At scroll=0 (night): 0.05 → exp(-0.75) * 450 = 213 → clamped to 1.0 (full visibility)
// At scroll=1 (dawn): 0.2 → exp(-3.0) * 450 = 22 → clamped to 1.0 (still visible)
// For actual dawn: skyBrightness > 0.5 → exp(-7.5) * 450 = 0.25 (very faded)
```

## Integration Instructions for MeadowEngine

### Step 1: Add StarField Subsystem

```
src/meadow/StarField.js — THREE.Points with star shader
```

Generate stars in constructor, add to scene. Expose `skyBrightness` uniform for AtmosphereController to drive.

### Step 2: Enhance FireflySystem

The existing FireflySystem.js (500 points, Alex-DG technique) should work with these improved values:
- Amber color `#d4c968` (was warm yellow)
- Pulsing brightness with phase offset
- Larger size range (3-7 pixels)

### Step 3: AtmosphereController Integration

Night Meadow keyframe (QUIETING or new NIGHT keyframe):
```javascript
{
  skyBrightness: 0.05,       // Stars fully visible
  fireflyVisible: true,
  fireflyCount: 400,
  moonDirection: [0.3, 0.5, -0.4],
  moonColor: '#6688bb',
  moonIntensity: 0.6,
  ambientColor: '#1a2a3a',
  ambientIntensity: 0.15,
  grassBase: '#0a1a10',
  grassTip: '#1a3a28',
  fogColor: '#060a10',
}
```

### Step 4: Scroll-Driven Star Fade

As user scrolls from Night Meadow toward Golden Meadow, increase `skyBrightness` from 0.05 → 1.0. Stars naturally vanish. This creates the "dawn approaching" narrative arc without any explicit show/hide logic.

## Performance Profile

| Metric | Value |
|--------|-------|
| FPS @ 1080p | 121 (extremely fast) |
| Draw calls | +2 (stars + fireflies) |
| Texture reads | 0 |
| Memory | ~200KB (8K star positions + 400 firefly positions) |
| GPU cost | Minimal (point sprites, no complex fragment math) |

## Emotional Quality Assessment

The two-layer composition creates a powerful emotional effect:
- **Stars above** = distant, cool, unreachable → the "someday" in "someday this pain will be joined with peace"
- **Fireflies below** = close, warm, fleeting → the beauty in the present moment
- **Dark void between** = the space between pain and peace

This is the strongest emotional match of all experiments so far (56/70).
