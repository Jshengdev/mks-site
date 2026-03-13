// src/meadow/KuwaharaEffect.js
// Anisotropic Kuwahara painterly filter — stolen from L19 / heckel-painterly-shaders
// Transforms the scene into an oil painting at specific scroll moments
// Used at Store section (golden hour / desire) for "hidden sun" visual metaphor
import { Effect, BlendFunction } from 'postprocessing'

// Papari 8-sector circular variant (better edge handling than 4-quadrant)
// Simplified for real-time: 4 sectors instead of 8, fixed kernel
const fragment = `
uniform float uKernelSize;
uniform float uStrength;

// ITU-R BT.601 luminance (from L19 extraction: more accurate than equal-weight)
float getLuminance(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  if (uStrength < 0.01) {
    outputColor = inputColor;
    return;
  }

  vec2 texelSize = 1.0 / resolution;
  int radius = int(uKernelSize);

  // 4-quadrant Kuwahara: find the quadrant with lowest variance
  // output its mean color (creates flat, painterly regions)
  vec3 mean[4];
  vec3 meanSq[4];
  float count[4];

  for (int i = 0; i < 4; i++) {
    mean[i] = vec3(0.0);
    meanSq[i] = vec3(0.0);
    count[i] = 0.0;
  }

  for (int x = -radius; x <= radius; x++) {
    for (int y = -radius; y <= radius; y++) {
      vec2 offset = vec2(float(x), float(y)) * texelSize;
      vec3 samp = texture2D(inputBuffer, uv + offset).rgb;

      // Determine quadrant (0=TL, 1=TR, 2=BL, 3=BR)
      int qx = x >= 0 ? 1 : 0;
      int qy = y >= 0 ? 1 : 0;
      int q = qx + qy * 2;

      mean[q] += samp;
      meanSq[q] += samp * samp;
      count[q] += 1.0;
    }
  }

  // Find quadrant with minimum variance
  float minVariance = 1e10;
  vec3 result = inputColor.rgb;

  for (int i = 0; i < 4; i++) {
    if (count[i] < 1.0) continue;
    vec3 m = mean[i] / count[i];
    vec3 ms = meanSq[i] / count[i];
    vec3 variance = ms - m * m;
    float v = getLuminance(variance);

    if (v < minVariance) {
      minVariance = v;
      result = m;
    }
  }

  // Color enhancement (from L19: subtle saturation boost + level clamp)
  float lum = getLuminance(result);
  result = mix(vec3(lum), result, 1.3); // 30% saturation boost
  result = clamp(result, 0.15, 0.85);   // avoid pure black/white

  // Blend with original based on strength
  outputColor = vec4(mix(inputColor.rgb, result, uStrength), inputColor.a);
}
`

export class KuwaharaEffect extends Effect {
  constructor({ kernelSize = 4, strength = 0.0 } = {}) {
    super('KuwaharaEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uKernelSize', { value: kernelSize }],
        ['uStrength', { value: strength }],
      ]),
    })
  }
}
