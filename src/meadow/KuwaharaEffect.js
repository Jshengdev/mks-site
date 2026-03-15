// src/meadow/KuwaharaEffect.js
// Anisotropic Kuwahara painterly filter — stolen from MaximeHeckel painterly-shaders
// Upgraded from 4-quadrant to 8-sector circular variant (Papari)
// Research winner values: alpha=25.0, radius=6, 8 sectors, 16-level quantization, 1.5x saturation
// GOTCHA: Don't name functions `saturate()` — Three.js macro conflict
import { Effect, BlendFunction } from 'postprocessing'

// 8-sector circular Kuwahara — better edge handling than 4-quadrant
// Samples along 8 directional sectors, picks lowest-variance sector's mean
const fragment = `
uniform float uKernelSize;
uniform float uStrength;
uniform float uAlpha;           // sector weighting sharpness (25.0)
uniform float uQuantizeLevels;  // color quantization (16.0)
uniform float uSaturationBoost; // saturation multiplier (1.5)

// ITU-R BT.601 luminance (from L19 extraction)
float getLuminance(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

// Saturation boost — named boostSaturation to avoid Three.js saturate() macro
vec3 boostSaturation(vec3 color, float amount) {
  float lum = getLuminance(color);
  return mix(vec3(lum), color, amount);
}

// Quantize color to N levels for painterly banding
vec3 quantizeColor(vec3 color, float levels) {
  return floor(color * levels + 0.5) / levels;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  if (uStrength < 0.01) {
    outputColor = inputColor;
    return;
  }

  vec2 texelSize = 1.0 / resolution;
  int radius = int(uKernelSize);

  // 8-sector Kuwahara: each sector is a 45-degree wedge
  // Stolen from MaximeHeckel anisotropic variant
  vec3 sectorMean[8];
  vec3 sectorMeanSq[8];
  float sectorCount[8];

  for (int i = 0; i < 8; i++) {
    sectorMean[i] = vec3(0.0);
    sectorMeanSq[i] = vec3(0.0);
    sectorCount[i] = 0.0;
  }

  // 8 sector directions (45-degree increments)
  // 0=E, 1=NE, 2=N, 3=NW, 4=W, 5=SW, 6=S, 7=SE
  for (int x = -radius; x <= radius; x++) {
    for (int y = -radius; y <= radius; y++) {
      // Skip corners for circular kernel
      float dist = sqrt(float(x * x + y * y));
      if (dist > float(radius)) continue;

      vec2 offset = vec2(float(x), float(y)) * texelSize;
      vec3 samp = texture2D(inputBuffer, uv + offset).rgb;

      // Determine sector from angle (atan2)
      float angle = atan(float(y), float(x)); // -PI to PI
      // Map to 0-7 sector index
      float normalized = (angle + 3.14159265) / 6.28318530; // 0 to 1
      int sector = int(normalized * 8.0);
      if (sector > 7) sector = 7;

      sectorMean[sector] += samp;
      sectorMeanSq[sector] += samp * samp;
      sectorCount[sector] += 1.0;
    }
  }

  // Weighted blend: sectors with lower variance get exponentially more weight
  // alpha controls the sharpness of selection (higher = harder selection)
  vec3 result = vec3(0.0);
  float totalWeight = 0.0;

  for (int i = 0; i < 8; i++) {
    if (sectorCount[i] < 1.0) continue;

    vec3 m = sectorMean[i] / sectorCount[i];
    vec3 ms = sectorMeanSq[i] / sectorCount[i];
    vec3 variance = ms - m * m;
    float v = getLuminance(variance);

    // Exponential weighting — low variance = high weight
    // alpha=25 makes this quite sharp (near-winner-takes-all)
    float weight = exp(-v * uAlpha);
    result += m * weight;
    totalWeight += weight;
  }

  if (totalWeight > 0.0) {
    result /= totalWeight;
  } else {
    result = inputColor.rgb;
  }

  // Color quantization — creates painterly banding (16 levels from winner)
  if (uQuantizeLevels > 1.0) {
    result = quantizeColor(result, uQuantizeLevels);
  }

  // Saturation boost (1.5x from winner — boosts vividness for Ghibli look)
  result = boostSaturation(result, uSaturationBoost);

  // Clamp to avoid pure black/white (preserve breathing blacks aesthetic)
  result = clamp(result, 0.08, 0.92);

  // Blend with original based on strength
  outputColor = vec4(mix(inputColor.rgb, result, uStrength), inputColor.a);
}
`

export class KuwaharaEffect extends Effect {
  constructor({
    kernelSize = 6,       // radius=6 from winner
    strength = 0.0,
    alpha = 25.0,         // sector weighting sharpness from winner
    quantizeLevels = 16,  // 16-level quantization from winner
    saturationBoost = 1.5 // 1.5x saturation from winner
  } = {}) {
    super('KuwaharaEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uKernelSize', { value: kernelSize }],
        ['uStrength', { value: strength }],
        ['uAlpha', { value: alpha }],
        ['uQuantizeLevels', { value: quantizeLevels }],
        ['uSaturationBoost', { value: saturationBoost }],
      ]),
    })
  }
}
