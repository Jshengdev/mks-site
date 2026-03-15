# Winner: Golden Hour Atmosphere Preset

> Experiment: exp-002-golden-hour
> Type: atmosphere-tuning
> Score: 45/70
> Target Environment: Golden Meadow (Landing)

## Technique
Preetham sky model with low sun elevation (8 deg), higher turbidity (4.0), and amber-tinted grass tips. Warm breathing-black fog.

## Magic Values
| Parameter | Value | Notes |
|-----------|-------|-------|
| Sky turbidity | 4.0 | Higher = warmer horizon |
| Sky rayleigh | 2.0 | More scattering for golden tones |
| Sky mieCoefficient | 0.005 | Subtle sun haze |
| Sky mieDirectionalG | 0.85 | Tight sun disk |
| Sun elevation | 8 deg | Low golden hour angle |
| Sun azimuth | 200 deg | Off-center for drama |
| Grass baseColor | #1a2a12 | Dark olive |
| Grass tipColor | #8a7a3a | Amber-gold (earned warmth) |
| Sun color | #ffe0a0 | Warm amber |
| Ambient intensity | 0.3 | Lower for more contrast |
| Fog color | #1a1208 | --warm-black (MKS palette) |
| Fog far | 70 | Moderate depth |
| Tone mapping | ACES Filmic | Warm |
| Exposure | 0.8 | Slightly under for mood |

## Integration with MeadowEngine
Apply these values to AtmosphereController keyframe at AWAKENING or ALIVE position:
- `sceneSetup.sky.material.uniforms.turbidity.value = 4.0`
- `sceneSetup.sky.material.uniforms.rayleigh.value = 2.0`
- `grassManager.setUniform('uBaseColor', new THREE.Color(0x1a2a12))`
- `grassManager.setUniform('uTipColor', new THREE.Color(0x8a7a3a))`

## Screenshots
- `screenshots/exp-002-golden-hour/scroll-0.0.png`
- `screenshots/exp-002-golden-hour/scroll-1.0.png`

## Notes
- Maintains 85/15 dark/light ratio
- Amber grass tips = "earned warmth" principle
- Wind speed 0.8 feels natural at golden hour
