# Winner: Stylized Water with Cartoon Foam

> Experiment: exp-007-stylized-water | Score: 47/70 | FPS: 121 @ 1080p
> Source: thaslle/stylized-water (Ashima simplex noise + binary threshold)
> Target: Ocean Cliff world — "Peaceful Heartache"

## What It Does

Purely procedural cartoon water surface using 2D simplex noise + binary `step()` thresholding.
Two layers create visual richness:
1. **Foam dots** — high-frequency noise (textureSize * 2.8), sparse dots
2. **Wave lines** — lower-frequency noise (textureSize * 1.0), organic contour lines

Zero textures. Zero depth buffer reads. Fully procedural.

## Magic Values Table

### Ashima Simplex Noise Constants
| Value | Purpose |
|-------|---------|
| `34.0` | Permutation polynomial coefficient |
| `289.0` | Hash modulus (17*17) |
| `130.0` | Output scale → [-1, 1] |
| `1.79284291400159` | Taylor approx 1/sqrt() |
| `0.85373472095314` | Taylor approx 1/sqrt() |
| Skew constants C | `(0.2113, 0.3660, -0.5774, 0.0244)` |

### Foam Dots (Layer 1)
| Value | Purpose |
|-------|---------|
| `textureSize * 2.8` | Foam frequency (high-freq small dots) |
| `sin(uTime * 0.3)` | Drift speed (very slow) |
| `smoothstep(0.08, 0.001, n)` | Narrow band extraction |
| `step(0.5, foam)` | Binary: 0 or 1 (cartoon hardness) |

### Wave Lines (Layer 2)
| Value | Purpose |
|-------|---------|
| `textureSize * 1.0` | Wave frequency (larger features) |
| `sin(uTime * -0.1)` | Drift speed (opposite direction) |
| `threshold = 0.6 + 0.01 * sin(uTime * 2.0)` | Oscillating center (breathes) |
| `smoothstep(t+0.03, t+0.032, n)` | Upper edge (0.002 gap = very thin) |
| `smoothstep(t, t-0.01, n)` | Lower edge |
| `step(0.5, waveEffect)` | Binary contour lines |

### UV-Distance Fake Depth
| Value | Purpose |
|-------|---------|
| `length(vUv - 0.5) * 1.5` | Vignette (0 center, ~1 corners) |
| `smoothstep(0.1, 0.3, vignette)` | Near-to-far transition |
| Deep water: patterns fade to 0 | No surface detail far from camera |

### Waterline Foam Stripe (Cliff/Rock)
| Value | Purpose |
|-------|---------|
| `sin(uTime * uWaveSpeed) * uWaveAmplitude` | Synchronized water bob |
| `smoothstep(h+0.01, h-0.01, worldY)` | Sharp upper edge |
| `uFoamDepth = 0.08` | Stripe thickness in world units |

### Water Plane Setup
| Value | Purpose |
|-------|---------|
| `waveSpeed = 1.2` | Sine bob frequency |
| `waveAmplitude = 0.1` | Bob height (world units) |
| `textureSize = 45` | Pattern scale (inverted: 100-45=55 effective) |

## Integration Instructions for MeadowEngine

### Step 1: Create Water Subsystem

```
src/meadow/WaterSurface.js — ShaderMaterial with simplex noise water
```

The water plane is a simple `PlaneGeometry` (no subdivision needed) with the custom shader. The vertex shader bobs uniformly (no per-vertex waves — intentional flat cartoon look).

### Step 2: Color Palette Adjustment

The extraction's colors are too dark for MKS. Replace with Ocean Cliff palette:
```javascript
uWaterColor: new THREE.Color('#1a4a5a'),  // MKS teal territory
uDeepColor: new THREE.Color('#0a2a3a'),   // Deep midnight blue
// Foam color in shader: change from vec3(1.0) to vec3(0.8, 0.85, 0.9)  — cool grey-white
```

### Step 3: Wire Uniforms

```javascript
// In MeadowEngine._tick():
waterMat.uniforms.uTime.value = elapsed
// uWaveSpeed, uWaveAmplitude synchronized with cliff foam stripe
```

### Step 4: Cliff Terrain Height-Based Coloring

The cliff fragment shader includes:
- Moss coloring near waterline (smoothstep transition, 0.35 world units)
- Wet sand darkening (50% brightness reduction)
- Waterline foam stripe synchronized with water bob
- These share `uWaterLevel`, `uWaveSpeed`, `uWaveAmplitude` via common uniforms

### Step 5: AtmosphereController Integration

Water color should shift with atmosphere keyframes:
- Bright dusk: more teal, visible patterns
- Night: darker, patterns fade
- Storm: grey-blue, patterns become larger (increase textureSize)

### Step 6: Transparency Handling

The water plane uses `transparent: true, depthWrite: false`. In MeadowEngine's render order:
1. Render terrain, grass, cliff (opaque)
2. Render water plane (transparent, on top)

## Performance Profile

| Metric | Value |
|--------|-------|
| FPS @ 1080p | 121 (extremely fast) |
| Draw calls | +1 (single plane) |
| Texture reads | 0 (fully procedural) |
| Fragment cost | 2x simplex noise evaluations per pixel |
| Memory | Negligible (no textures, no FBOs) |

## Visual Quality Notes

- Wave line patterns are organic and beautiful — clearly cartoon/stylized
- Foam dots add subtle secondary detail
- UV-distance fake depth creates convincing perspective fading
- The technique works best from angled overhead views (not first-person underwater)
- Pattern scale needs tuning based on camera distance in final integration
- Consider adding a subtle teal color tint to foam patterns (not pure white)

## What Needs Human Taste in Integration

- Water color palette (how much teal vs midnight blue)
- Pattern density (textureSize slider)
- Foam brightness (currently pure white — may want cooler grey)
- Whether to add specular highlights from sun
- Waterline foam stripe width and visibility
