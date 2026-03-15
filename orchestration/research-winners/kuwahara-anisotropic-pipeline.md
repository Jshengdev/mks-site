# Winner: Anisotropic Kuwahara Post-Processing Pipeline

> Experiment: exp-006-kuwahara-v2 | Score: 48/70 | FPS: 96 @ 1080p
> Source: MaximeHeckel painterly-shaders blog + craftzdog/ghibli-style-shader
> Target: Ghibli Painterly world — "The Fall and Acceptance"

## What It Does

3-pass post-processing pipeline that transforms rendered output into painterly, Ghibli-style visuals:
1. **Structure Tensor (Sobel)** — detects edge orientation via gradient analysis
2. **Anisotropic Kuwahara** — smooths along edges, preserves across them (painterly strokes)
3. **Final Composite** — color quantization (16 levels) + saturation boost (1.5x)

Combined with **4-band cel shading** on grass (exp-004 winner) for discrete lighting bands.

## Magic Values Table

### Structure Tensor (Pass 1)
| Value | Purpose |
|-------|---------|
| Sobel Gx: `(-1,-2,-1, 0,0,0, 1,2,1)` | X-direction gradient kernel |
| Sobel Gy: `(-1,0,1, -2,0,2, -1,0,1)` | Y-direction gradient kernel |
| Luminance: `vec3(0.299, 0.587, 0.114)` | Rec. 601 for variance (NOT Rec. 709) |
| Output: `vec4(Sx*Sx, Sy*Sy, Sx*Sy, 1.0)` | R=Jxx, G=Jyy, B=Jxy |

### Anisotropic Kuwahara (Pass 2)
| Value | Purpose |
|-------|---------|
| `alpha = 25.0` | Anisotropy intensity (Heckel: 25, NOT paper: 1) |
| `radius = 6` | Kernel radius (4-6 for real-time, 8-10 for stills) |
| `sigma = radius / 3.0` | Gaussian weight sigma (3-sigma rule) |
| `SECTOR_COUNT = 8` | Circular sectors for variance analysis |
| `arcHalfWidth = PI/8` | Per-sector angular span |
| `angularSamples = 5` | Samples per arc per radius step |
| `epsilon = 1e-6` | Division-by-zero guard in anisotropy calc |

### Final Composite (Pass 3)
| Value | Purpose |
|-------|---------|
| Quantization levels: `16` | Color palette reduction |
| Quantize clamp: `[0.1, 0.8]` | Avoids pure black/white |
| Shadow floor: `0.08` | Not pure black (adjusted for dark scenes) |
| Saturation boost: `1.5` | 50% increase |
| Saturation weights: `(0.2125, 0.7154, 0.0721)` | Rec. 709 (NOT 601!) |

### Cel Shading (Grass Fragment)
| Value | Purpose |
|-------|---------|
| Threshold 1: `0.6` | Highlight band boundary |
| Threshold 2: `0.35` | Mid-light band boundary |
| Threshold 3: `0.001` | Shadow band boundary |
| Multipliers: `1.2, 0.9, 0.5, 0.25` | Per-band brightness |

## Architecture (Three.js Vanilla)

```
Scene → originalFBO (HalfFloat) → Tensor Pass → tensorFBO → Kuwahara Pass → kuwaharaFBO → Final Pass → Screen
```

### Critical Implementation Details

1. **Dual-texture read in Kuwahara**: COLORS from `tOriginal`, TENSOR from `tTensor`. Backwards = psychedelic garbage.
2. **FBO format**: `THREE.HalfFloatType` for HDR headroom in the pipeline.
3. **Fullscreen quad**: `PlaneGeometry(2,2)` + `OrthographicCamera(-1,1,1,-1,0,1)`, vertex shader uses `position.xy` directly.
4. **Separate scenes per pass**: Each fullscreen quad lives in its own `THREE.Scene()` to avoid cross-contamination.
5. **Don't name functions `saturate()`** — Three.js defines `#define saturate(a) clamp(a, 0.0, 1.0)`. Use `adjustSaturation()`.
6. **sRGB handling**: If renderer uses `SRGBColorSpace` + `ACESFilmicToneMapping`, do NOT apply ACES again in final pass.
7. **Resize handler must update ALL FBOs**: `originalFBO.setSize(w,h)`, `tensorFBO.setSize(w,h)`, `kuwaharaFBO.setSize(w,h)`.

## Integration Instructions for MeadowEngine

### Step 1: Add to PostProcessingStack

The Kuwahara pipeline needs to run BEFORE the existing pmndrs EffectComposer, or as a replacement for it in the Ghibli Painterly world.

**Option A (Replacement):** When `world === 'ghibli-painterly'`, bypass EffectComposer entirely and use the 3-pass Kuwahara pipeline.

**Option B (Layered):** Render scene → originalFBO, run Tensor+Kuwahara passes, feed Kuwahara output as input to EffectComposer (for bloom, grain, vignette on top).

### Step 2: Create New Files

```
src/meadow/effects/TensorPass.js     — Structure tensor shader + render target
src/meadow/effects/KuwaharaPass.js   — Anisotropic Kuwahara shader + render target
src/meadow/effects/FinalCompPass.js  — Quantization + saturation shader
```

### Step 3: Wire in MeadowEngine._tick()

```javascript
// Before EffectComposer render:
if (this.useKuwahara) {
  renderer.setRenderTarget(this.originalFBO)
  renderer.render(scene, camera)
  renderer.setRenderTarget(this.tensorFBO)
  renderer.render(this.tensorScene, this.fsCamera)
  renderer.setRenderTarget(this.kuwaharaFBO)
  renderer.render(this.kuwaharaScene, this.fsCamera)
  // Feed kuwaharaFBO.texture to EffectComposer or render directly
}
```

### Step 4: Atmosphere Values

Pair with these atmosphere values (from exp-002 golden-hour winner, adjusted for Ghibli warmth):
- `skyTurbidity: 6.0, skyRayleigh: 1.5, sunElevation: 6°`
- `baseColor: #3a5c28, tipColor: #b8a852`
- `sunColor: #ffd080, ambientIntensity: 0.6`
- `fogColor: #2a2010`

### Step 5: Toggle via AtmosphereController

Add `uUseKuwahara` uniform or a boolean check per world. Only active for Ghibli Painterly world. Use `prefers-reduced-motion` to disable entirely.

## Performance Profile

| Metric | Value |
|--------|-------|
| FPS @ 1080p | 96 (well above 30 threshold) |
| Draw calls | 6 total (3 scene + 3 fullscreen quads) |
| Texture reads per pixel | ~250 (Kuwahara at radius 6) |
| FBO memory | 3x 1080p HalfFloat = ~48MB |
| GPU bottleneck | Fragment-bound (Kuwahara sampling) |

## Known Limitations

- Grass area appears very dark — needs brighter atmosphere values during integration (higher ambient, brighter base grass color)
- Quantization creates visible banding in smooth gradients — acceptable for painterly aesthetic
- No paper/grain texture overlay (extraction mentions multiplicative watercolor.png — not implemented)
- Radius 6 produces subtle strokes; for more dramatic effect, test radius 8-10 (may drop below 30 FPS on laptops)
