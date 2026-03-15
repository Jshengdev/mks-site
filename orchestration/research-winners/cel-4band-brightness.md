# Winner: 4-Band Brightness Threshold Cel Shading

> Experiment: exp-004-cel-shading
> Type: shader-extraction
> Score: 42/70
> Source: craftzdog/ghibli-style-shader
> Target Environment: Ghibli Painterly (Store)

## Technique
Discrete 4-band cel shading using NdotL brightness thresholds. Instead of smooth Lambertian lighting, the dot product is quantized into flat color bands that mimic Studio Ghibli watercolor paint layers.

## Magic Values (from craftzdog extraction)
| Parameter | Value | Notes |
|-----------|-------|-------|
| Threshold 1 (highlight) | 0.6 | Brightest band edge |
| Threshold 2 (mid-light) | 0.35 | Mid-tone transition |
| Threshold 3 (shadow) | 0.001 | Shadow band edge |
| Highlight multiplier | 1.2 | Slight boost |
| Mid-light multiplier | 0.9 | Near-base |
| Shadow multiplier | 0.5 | Half brightness |
| Deep shadow multiplier | 0.25 | Quarter brightness |

## Shader Code (fragment, key section)
```glsl
float NdotL = dot(normal, normalize(uSunDirection));
float brightness = NdotL * 0.5 + 0.5;

if (brightness > 0.6) {
  color = baseColor * 1.2;
} else if (brightness > 0.35) {
  color = baseColor * 0.9;
} else if (brightness > 0.001) {
  color = baseColor * 0.5;
} else {
  color = baseColor * 0.25;
}
```

## Integration with MeadowEngine
1. Add `uUseCelShading` uniform to grass shader material
2. Add the 4-band threshold logic to grass.frag.glsl
3. Toggle via AtmosphereController per environment (on for Ghibli, off for others)
4. Best paired with Kuwahara post-processing for full painterly effect
5. Use higher ambient (0.5) for flatter Ghibli look

## Screenshots
- `screenshots/exp-004-cel-shading/scroll-0.0.png`
- `screenshots/exp-004-cel-shading/scroll-1.0.png`

## Next Steps
- Combine with Kuwahara filter (exp from MaximeHeckel extraction)
- Test with cel-shaded terrain material (not just grass)
- Try per-color-band palette mapping instead of brightness multipliers
