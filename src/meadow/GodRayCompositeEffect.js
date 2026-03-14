// src/meadow/GodRayCompositeEffect.js
// Composites pre-rendered god ray texture into pmndrs post-processing chain
// Works with GodRayPass (GPU Gems 3 radial blur)
import { Effect, BlendFunction } from 'postprocessing'

const fragment = `
uniform sampler2D tGodRays;
uniform float uIntensity;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 rays = texture2D(tGodRays, uv).rgb;
  outputColor = vec4(inputColor.rgb + rays * uIntensity, inputColor.a);
}
`

export class GodRayCompositeEffect extends Effect {
  constructor() {
    super('GodRayComposite', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['tGodRays', { value: null }],
        ['uIntensity', { value: 0.0 }],
      ]),
    })
  }
}
