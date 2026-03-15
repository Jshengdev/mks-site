# Winner: Volumetric Cumulus Clouds (3D Perlin-Worley Noise)

> Experiment: exp-011-cumulus-v3 | Score: 49/70 | FPS: 78 @ 1080p
> Source: takram/three-clouds + Schneider GDC 2015 (Perlin-Worley blend)
> Target: Storm Field — massive towering cumulus clouds behind grass field
> Upgrades exp-010 (35/70, 44 FPS)

## What Changed from exp-010

1. **CPU-generated 128^3 3D Perlin-Worley noise texture** (DataTexture3D)
   - Perlin FBM (4 oct) for large structure, Worley F1 for cellular billowy edges
   - Schneider remap: `(perlin - (1 - worley)) / worley` for natural cumulus
   - Detail channels: high-freq Worley + Worley FBM for erosion
   - Generation time: ~3-5s on M-series Mac

2. **Reshaped vertical profile for towering cumulus**
   - Layer: bottom=3, top=18 (15 unit thickness vs old 6)
   - Profile: `smoothstep(0.0, 0.15, h) * smoothstep(1.0, 0.65, h)` — flat base, rounded top
   - Coverage boost at middle heights for tower effect

3. **Half-resolution cloud rendering** with bilinear upscale
   - Clouds ray-marched at 50% resolution → 4x fewer fragments
   - Bilinear filtering on upscale smooths the difference
   - Result: 78 FPS (vs 44 FPS in exp-010)

4. **Improved ambient lighting**
   - Height-dependent sky ambient (top brighter)
   - Ground bounce (warm) from below
   - Atmospheric perspective fade on distant clouds

## Magic Values Table

### 3D Noise Texture
| Value | Purpose |
|-------|---------|
| `size = 128` | 128^3 RGBA texture (~8MB) |
| `perlin freq = 4.0` | Base Perlin frequency |
| `perlin octaves = 4` | FBM detail |
| `worley freq = 6` | Cellular feature frequency |
| `detail worley freq = 12` | High-freq erosion |
| `worley FBM freq = 8, oct=3` | Secondary detail |
| R channel | Perlin-Worley blend (shape) |
| G channel | Worley F1 (cellular) |
| B channel | Detail Worley (erosion) |
| A channel | Worley FBM (secondary) |

### Cloud Geometry
| Value | Purpose |
|-------|---------|
| `CLOUD_BOTTOM = 3.0` | Layer base |
| `CLOUD_TOP = 18.0` | Layer ceiling |
| `CLOUD_THICKNESS = 15.0` | Vertical extent (2.5x bigger than exp-010) |
| `MAX_STEPS = 48` | March samples |
| `LIGHT_STEPS = 6` | Light march |

### Density Pipeline
| Value | Purpose |
|-------|---------|
| `smoothstep(0.0, 0.15, h)` | Flat bottom ramp |
| `smoothstep(1.0, 0.65, h)` | Rounded top falloff |
| `noise sample * 0.03` | Noise-to-world scale |
| `coverageBoost = 1.0 + 0.3 * heightProfile` | Tower boosting |
| `erosionWeight = mix(0.6, 0.2, h)` | More erosion at base |

### Performance
| Metric | Value |
|--------|-------|
| FPS @ 1080p | 78 (half-res clouds) |
| Draw calls | 3 (scene + cloud + upscale) |
| 3D texture memory | ~8MB |
| FBO memory | 1x full + 1x half = ~20MB |
| Noise gen time | ~3-5s one-time |

## Integration Instructions

### Step 1: Generate noise texture at init
```javascript
// In MeadowEngine constructor or lazy init:
this.noise3D = generate3DNoiseTexture(128) // ~3-5s, do once
```

### Step 2: Half-res cloud FBO
```javascript
const cloudW = Math.floor(width * 0.5)
const cloudH = Math.floor(height * 0.5)
this.cloudFBO = new THREE.WebGLRenderTarget(cloudW, cloudH, { type: HalfFloatType })
```

### Step 3: GLSL3 required for sampler3D
The cloud shader needs `glslVersion: THREE.GLSL3` on ShaderMaterial.
Use `in/out` instead of `varying`, `texture()` instead of `texture2D()`.

### Step 4: Render pipeline
```
1. Scene → sceneFBO (full res)
2. Cloud pass → cloudFBO (half res, reads sceneFBO + noise3D)
3. Upscale → screen (full res, bilinear from cloudFBO)
```

## Known Issues
- Sun-side overexposure (right side blown out white)
- Hard horizon edge where cloud march starts
- Could benefit from temporal anti-aliasing for stability
- 3D texture generation blocks main thread (~3-5s) — move to worker
