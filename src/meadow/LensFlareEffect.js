// LensFlareEffect — Screen-space sun burst + ghost reflections
// Adapted from ektogamat's vanilla Three.js lens flare
// Sun screen position computed in JS, passed as uniform
import { Effect, BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import fragmentShader from './shaders/lens-flare.frag.glsl?raw'

export function createLensFlareEffect(sunPosition, camera) {
  const effect = new Effect('LensFlare', fragmentShader, {
    blendFunction: BlendFunction.NORMAL,
    uniforms: new Map([
      ['uSunScreenPos', new THREE.Uniform(new THREE.Vector2(0.5, 0.5))],
      ['uSunVisible', new THREE.Uniform(0.0)],
      ['uIntensity', new THREE.Uniform(0.3)],
      ['uGhostSpacing', new THREE.Uniform(0.3)],
    ]),
  })

  const _sunWorld = sunPosition.clone().multiplyScalar(1000)
  const _projected = new THREE.Vector3()

  function update(camera) {
    _projected.copy(_sunWorld).project(camera)

    // Check if sun is in front of camera
    const visible = _projected.z < 1.0 ? 1.0 : 0.0
    // Fade near screen edges
    const edgeFade = 1.0 - Math.max(
      Math.abs(_projected.x),
      Math.abs(_projected.y)
    )
    const fade = Math.max(0, Math.min(1, edgeFade * 2.0)) * visible

    // Convert NDC (-1,1) to UV (0,1)
    const uv = effect.uniforms.get('uSunScreenPos').value
    uv.set(
      _projected.x * 0.5 + 0.5,
      _projected.y * 0.5 + 0.5
    )
    effect.uniforms.get('uSunVisible').value = fade
  }

  return {
    effect,
    update,
    uniforms: effect.uniforms,
    dispose() { effect.dispose() },
  }
}
