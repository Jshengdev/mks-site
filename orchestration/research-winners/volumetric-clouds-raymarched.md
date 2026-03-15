# Winner: Volumetric Clouds (Ray-Marched, Simplified)

> Experiment: exp-010-clouds-v2 | Score: 35/70 | FPS: 44 @ 1080p
> Source: takram/three-clouds extraction (Beer-Lambert, HG phase, multi-scatter)
> Target: Storm Field — massive cumulus clouds

## What It Does

Screen-space ray-marched cloud layer using FBM noise for density,
Beer-Lambert extinction for light absorption, dual-lobe Henyey-Greenstein
phase function for silver lining, and multi-scattering approximation (Oz Volumes).

**This is a SIMPLIFIED proof-of-concept.** Full takram quality requires:
- 128^3 3D Perlin-Worley noise textures
- Cascaded Beer Shadow Maps (3x512)
- Temporal anti-aliasing upscaling (4x4 Bayer)
- 4+ render passes

## Magic Values Table

### Cloud Layer Geometry
| Value | Purpose |
|-------|---------|
| `CLOUD_BOTTOM = 4.0` | Layer base height (world units) |
| `CLOUD_TOP = 10.0` | Layer ceiling |
| `CLOUD_THICKNESS = 6.0` | Vertical extent |
| `MAX_STEPS = 40` | Ray march samples |
| `LIGHT_STEPS = 6` | Light march samples (toward sun) |

### Density Pipeline (from extraction)
| Value | Purpose |
|-------|---------|
| `shapeAlteringBias = 0.35` | Vertical profile bias (natural cumulus) |
| `coverage = 0.75` | Sky coverage fraction (0.3 fair weather, 0.75 storm) |
| `coverageFilterWidth = 0.6` | Weather-to-density gradient |
| `densityScale = 0.6` | Overall density multiplier |
| `noise freq = 0.04` | Shape noise frequency |
| `detail freq = 0.12` | Detail erosion frequency |
| `pow(detail, 6.0)` | Wispy bottom detail modifier |
| `smoothstep(0.2, 0.4, h)` | Bottom-to-top detail transition |

### Scattering (from extraction)
| Value | Purpose |
|-------|---------|
| `g1 = 0.7` | Forward scatter lobe (silver lining) |
| `g2 = -0.2` | Back scatter lobe |
| `mix = 0.5` | 50/50 dual lobe blend |
| `1/(4*PI)` | HG normalization |
| `attenuation = (0.5, 0.5, 0.5)` | Multi-scatter octave decay |
| `8 octaves` | Multi-scatter depth |

### Beer-Powder Effect (from extraction)
| Value | Purpose |
|-------|---------|
| `powderScale = 0.8` | Interior darkening strength |
| `powderExponent = 150` | Activation sharpness |

### Energy-Conserving Integration (from extraction)
```glsl
float sampleTransmittance = exp(-extinction * stepSize);
float clampedExtinction = max(extinction, 1e-7);
vec3 scatteringIntegral = (cloudColor - cloudColor * sampleTransmittance) / clampedExtinction;
radiance += transmittance * scatteringIntegral;
transmittance *= sampleTransmittance;
```

## Integration Instructions for MeadowEngine

### WARNING: Performance Budget

At 40 march steps + 6 light steps, this shader costs ~44 FPS at 1080p.
For production integration, consider:
- **Half-resolution rendering** with temporal upscaling
- **Reduce march steps** to 20 for Tier 2 (laptop)
- **Disable entirely** for Tier 3 (mobile)
- **Use TAAU** (temporal anti-aliased upscaling) like takram does

### Option A: Simplified Cloud Layer (Current Approach)

Best for: storm atmosphere overlay, distant cloud cover, mood setting.
- Single fullscreen pass after scene render
- Needs scene FBO (already have from Kuwahara pipeline)
- Acceptable for clouds that are far away and partially transparent

### Option B: Full takram Pipeline (Production Quality)

For massive, detailed cumulus clouds, implement the full takram stack:
1. Generate 3D noise textures (128^3 shape, 32^3 detail)
2. Implement cascaded Beer Shadow Maps (3 cascades, 512 each)
3. Add temporal upscaling (4x4 Bayer pattern)
4. Use Structured Volume Sampling for stability

This is a significant engineering effort but produces AAA-quality clouds.

### Step-by-Step (Option A)
1. Render scene to FBO (can share with Kuwahara pipeline's originalFBO)
2. Run cloud composite pass reading scene FBO
3. Cloud density driven by `cloudCoverage` from AtmosphereController
4. For Storm Field: coverage=0.75, density=0.6
5. For Golden Meadow: coverage=0.2, density=0.2 (light, wispy)

## Performance Profile

| Metric | Value |
|--------|-------|
| FPS @ 1080p | 44 (heavy) |
| Draw calls | +1 (fullscreen quad) |
| FBO memory | 1x 1080p HalfFloat = ~16MB |
| GPU bottleneck | Fragment-bound (40 march steps * noise evaluation) |
| Optimization target | Half-res + TAAU → 2-4x speedup |

## Visual Quality Assessment

- Volumetric density variation is visible (light/shadow areas)
- Beer-Lambert extinction creates realistic falloff
- Multi-scattering adds depth perception
- BUT: clouds appear as thin horizontal layer, not massive cumulus towers
- Missing: 3D Perlin-Worley for volumetric shape, cloud shadow on ground
- The simplified FBM approximation cannot produce towering cumulus formations
