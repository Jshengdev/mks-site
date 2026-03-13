// src/meadow/RadialCAEffect.js
// Radial chromatic aberration — cubic lens distortion + chromatic dispersion
// Stolen from filmic-gl: eta = (1.009, 1.006, 1.003)
import { Effect, BlendFunction } from 'postprocessing'

const fragment = `
uniform float uDistortion;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 center = uv - 0.5;
  float r2 = dot(center, center);

  // Cubic lens distortion (stolen from filmic-gl: k=0.05, kcube=0.1)
  float k = uDistortion * 0.05;
  float kcube = uDistortion * 0.1;
  float f = 1.0 + r2 * (k + kcube * sqrt(r2));

  // Per-channel dispersion (stolen from filmic-gl: eta per channel)
  // Red shifts most, blue least
  vec2 uvR = 0.5 + center * f * 1.009;
  vec2 uvG = 0.5 + center * f * 1.006;
  vec2 uvB = 0.5 + center * f * 1.003;

  float r = texture2D(inputBuffer, uvR).r;
  float g = texture2D(inputBuffer, uvG).g;
  float b = texture2D(inputBuffer, uvB).b;

  outputColor = vec4(r, g, b, 1.0);
}
`

export class RadialCAEffect extends Effect {
  constructor({ distortion = 0.5 } = {}) {
    super('RadialCAEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uDistortion', { value: distortion }],
      ]),
    })
  }
}
