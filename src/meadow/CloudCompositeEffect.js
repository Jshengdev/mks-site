// CloudCompositeEffect.js — pmndrs Effect that composites volumetric cloud texture
// Blends half-res cloud FBO behind the scene using depth buffer
// Follows the same pattern as GodRayCompositeEffect
import { Effect, EffectAttribute, BlendFunction } from 'postprocessing'

const fragment = `
uniform sampler2D tClouds;
uniform float uIntensity;

void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
  if (uIntensity < 0.01) {
    outputColor = inputColor;
    return;
  }

  vec4 cloud = texture2D(tClouds, uv);

  // Composite clouds BEHIND scene geometry using depth
  // depth near 1.0 = sky (far plane), depth near 0.0 = geometry
  // Only show clouds where there's sky
  float isSky = smoothstep(0.995, 1.0, depth);
  float cloudAlpha = cloud.a * uIntensity * isSky;

  // Premultiplied alpha blend: cloud behind scene
  vec3 color = mix(inputColor.rgb, cloud.rgb, cloudAlpha);
  outputColor = vec4(color, inputColor.a);
}
`

export class CloudCompositeEffect extends Effect {
  constructor() {
    super('CloudCompositeEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['tClouds', { value: null }],
        ['uIntensity', { value: 0.0 }],
      ]),
      // Read depth buffer for sky detection
      attributes: EffectAttribute.DEPTH,
    })
  }
}
