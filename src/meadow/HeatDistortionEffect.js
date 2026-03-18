// HeatDistortionEffect — screen-space UV displacement above hot surfaces
// Stolen from mrdoob/three.js webgl_shader_lava (turbulence UV offset concept)
// + Ppratik765/liquid-lava-effect (layered sine displacement for organic shimmer)
// Height-biased: strongest at bottom of screen (above lava), zero at top (cold stars)
// The "wavy air" shimmer that sells fire below / ice above
import { Effect, BlendFunction } from 'postprocessing'

const fragment = `
uniform float uIntensity;
uniform float uTime;
uniform float uSpeed;
uniform float uFrequency;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Height mask — heat rises from below, strongest at bottom of screen
  // smoothstep gives gradual falloff: 1.0 at bottom → 0.0 at 65% up screen
  // The top third stays pristine — cold stars don't shimmer
  float heightMask = smoothstep(0.65, 0.15, uv.y);

  // Skip displacement where mask is negligible (top of screen = no work)
  if (heightMask < 0.001 || uIntensity < 0.0001) {
    outputColor = inputColor;
    return;
  }

  float t = uTime * uSpeed;

  // 3-octave sine displacement — stolen from Ppratik765 lava turbulence concept
  // Each octave at different frequency + phase prevents uniform bars
  // Horizontal displacement dominates (heat shimmer = vertical columns of wavy air)
  float dispX = sin(uv.y * uFrequency + t) * 0.50
              + sin(uv.y * uFrequency * 2.3 + t * 0.7 + 1.7) * 0.30
              + sin(uv.y * uFrequency * 4.1 + t * 1.3 + 3.1) * 0.15;

  // Vertical component — much weaker, adds organic irregularity
  // Cross-axis coupling: horizontal position affects vertical wobble
  float dispY = sin(uv.x * uFrequency * 1.4 + t * 0.9 + 0.8) * 0.20
              + sin(uv.x * uFrequency * 3.2 + t * 1.1 + 2.4) * 0.10;

  // Spatial variation — breaks up uniform horizontal bands
  // Without this, the whole bottom half shimmers identically (looks artificial)
  float spatialBreak = sin(uv.x * uFrequency * 0.7 + 0.5) * 0.4 + 0.6;

  vec2 displacement = vec2(dispX * 0.7, dispY * 0.3)
                    * heightMask
                    * spatialBreak
                    * uIntensity;

  // Sample displaced UV — the shimmer
  vec2 displaced = uv + displacement;

  // Clamp to prevent sampling outside framebuffer
  displaced = clamp(displaced, vec2(0.0), vec2(1.0));

  outputColor = texture2D(inputBuffer, displaced);
}
`

export class HeatDistortionEffect extends Effect {
  constructor({ intensity = 0.008, speed = 2.0, frequency = 15.0 } = {}) {
    super('HeatDistortionEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['uIntensity', { value: intensity }],
        ['uTime', { value: 0 }],
        ['uSpeed', { value: speed }],
        ['uFrequency', { value: frequency }],
      ]),
    })
  }
}
