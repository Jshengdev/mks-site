// src/meadow/FilmGrainEffect.js
// Custom 2-layer film grain (stolen from glsl-film-grain + filmic-gl)
// Replaces pmndrs NoiseEffect with proper cinematic grain
import { Effect, BlendFunction } from 'postprocessing'

// The fragment is a mainImage snippet for pmndrs Effect system
const fragment = `
uniform float uGrainIntensity;

// Hash-based noise for grain texture (simpler than full simplex, still good)
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // 54ms frame intervals = ~18.5fps (real film projector speed from glsl-film-grain)
  float frame = floor(time / 0.054);

  // Layer 1: Large grain clumps (simplex-like offset)
  vec2 grainCoord = uv * resolution;
  float offset = noise2D(grainCoord * 0.02 + vec2(frame * 1.425, frame * 3.892));

  // Layer 2: Fine grain texture (periodic at different frequency)
  float grain = noise2D(grainCoord * 0.15 + offset * 50.0 + frame * 5.835);
  grain = grain * 0.5 + 0.5; // remap to 0-1

  // Luminance-aware suppression (stolen from filmic-gl)
  // pow(lum, 4.0) = grain strongest in shadows, absent in highlights
  float lum = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
  float response = 1.0 - pow(clamp(lum, 0.0, 1.0), 4.0);

  // Apply grain as overlay blend
  float grainValue = mix(0.5, grain, uGrainIntensity * response);

  // Overlay blend mode
  vec3 result = inputColor.rgb;
  result = mix(
    2.0 * result * vec3(grainValue),
    1.0 - 2.0 * (1.0 - result) * (1.0 - vec3(grainValue)),
    step(0.5, result)
  );

  outputColor = vec4(result, inputColor.a);
}
`

export class FilmGrainEffect extends Effect {
  constructor({ grainIntensity = 0.06 } = {}) {
    super('FilmGrainEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uGrainIntensity', { value: grainIntensity }],
      ]),
    })
  }
}
