// ColorGradeEffect — SEUS-style shader color grading
// Sources: SEUS Renewed, BSL, Complementary Reimagined
import { Effect, BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import fragmentShader from './shaders/color-grade.frag.glsl?raw'

const DEFAULTS = {
  contrast: 0.22,
  lift: new THREE.Vector3(0.005, 0.003, 0.0),
  gamma: new THREE.Vector3(1.06, 1.02, 0.96),
  gain: new THREE.Vector3(0.95, 0.90, 0.78),
  warmColor: new THREE.Vector3(0.925, 0.706, 0.518),
  coolColor: new THREE.Vector3(0.831, 0.769, 0.894),
  splitIntensity: 0.14,
  vibrance: 1.60,
  darkDesat: 0.30,
}

export function createColorGradeEffect() {
  const effect = new Effect('ColorGrade', fragmentShader, {
    blendFunction: BlendFunction.NORMAL,
    uniforms: new Map([
      ['uContrast', new THREE.Uniform(DEFAULTS.contrast)],
      ['uLift', new THREE.Uniform(DEFAULTS.lift.clone())],
      ['uGamma', new THREE.Uniform(DEFAULTS.gamma.clone())],
      ['uGain', new THREE.Uniform(DEFAULTS.gain.clone())],
      ['uWarmColor', new THREE.Uniform(DEFAULTS.warmColor.clone())],
      ['uCoolColor', new THREE.Uniform(DEFAULTS.coolColor.clone())],
      ['uSplitIntensity', new THREE.Uniform(DEFAULTS.splitIntensity)],
      ['uVibrance', new THREE.Uniform(DEFAULTS.vibrance)],
      ['uDarkDesat', new THREE.Uniform(DEFAULTS.darkDesat)],
    ]),
  })

  return {
    effect,
    uniforms: effect.uniforms,
    dispose() { effect.dispose() },
  }
}
