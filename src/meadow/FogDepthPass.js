// src/meadow/FogDepthPass.js
// 3-Zone Depth Fog Effect — pmndrs/postprocessing Effect
// Fog technique adapted from spacejack/terra + iq (Shadertoy)
import { Effect, EffectAttribute, BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import fragmentShader from './shaders/fog-depth.frag.glsl?raw'

export function createFogDepthEffect() {
  const effect = new Effect('FogDepth', fragmentShader, {
    blendFunction: BlendFunction.NORMAL,
    attributes: EffectAttribute.DEPTH,
    uniforms: new Map([
      ['uNearEnd', new THREE.Uniform(0.15)],
      ['uMidEnd', new THREE.Uniform(0.6)],
      ['uFogStrength', new THREE.Uniform(0.06)],
      ['uMidColor', new THREE.Uniform(new THREE.Vector3(1.0, 0.88, 0.55))],
      ['uFarColor', new THREE.Uniform(new THREE.Vector3(0.55, 0.55, 0.65))],
      ['uDesaturation', new THREE.Uniform(0.6)],
    ]),
  })

  return {
    effect,
    dispose() { effect.dispose() },
  }
}
