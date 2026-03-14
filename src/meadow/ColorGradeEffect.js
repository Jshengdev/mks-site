// ColorGradeEffect — SEUS-style shader color grading
// Sources: SEUS Renewed, BSL, Complementary Reimagined
import { Effect, BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import fragmentShader from './shaders/color-grade.frag.glsl?raw'

const DEFAULTS = {
  exposure: 1.0,
  contrast: 0.10,
  lift: new THREE.Vector3(0.003, 0.002, 0.0),
  gamma: new THREE.Vector3(1.03, 1.01, 0.98),
  gain: new THREE.Vector3(0.97, 0.95, 0.88),
  warmColor: new THREE.Vector3(0.925, 0.706, 0.518),
  coolColor: new THREE.Vector3(0.831, 0.769, 0.894),
  splitIntensity: 0.06,
  vibrance: 0.70,
  darkDesat: 0.15,
}

export function createColorGradeEffect() {
  const effect = new Effect('ColorGrade', fragmentShader, {
    blendFunction: BlendFunction.NORMAL,
    uniforms: new Map([
      ['uExposure', new THREE.Uniform(DEFAULTS.exposure)],
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
