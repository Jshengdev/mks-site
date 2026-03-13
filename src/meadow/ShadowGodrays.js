// src/meadow/ShadowGodrays.js
// God rays using three-good-godrays (adapted from n8python/goodGodRays)
// Shadow map setup required for GodraysPass raymarching through shadow map depth
import * as THREE from 'three'
import { GodraysPass } from 'three-good-godrays'

/**
 * Creates shadow map infrastructure + GodraysPass for the sun.
 *
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Scene} scene
 * @param {THREE.PerspectiveCamera} camera
 * @param {THREE.DirectionalLight} sunLight
 * @param {THREE.Vector3} sunPosition — unused but kept for API symmetry
 * @param {'full'|'reduced'|'css'} tier
 * @returns {{ pass: GodraysPass, dispose: () => void } | null}
 */
export function createShadowGodrays(renderer, scene, camera, sunLight, sunPosition, tier) {
  if (tier === 'css') return null

  const isReduced = tier === 'reduced'
  const shadowRes = isReduced ? 1024 : 2048

  // --- Shadow map setup ---
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  sunLight.castShadow = true
  sunLight.shadow.mapSize.set(shadowRes, shadowRes)
  sunLight.shadow.camera.near = 0.5
  sunLight.shadow.camera.far = 500
  sunLight.shadow.camera.left = -200
  sunLight.shadow.camera.right = 200
  sunLight.shadow.camera.top = 200
  sunLight.shadow.camera.bottom = -200
  sunLight.shadow.bias = -0.001

  // --- God rays pass (three-good-godrays) ---
  // GodraysPass is a Pass, added via composer.addPass() — NOT an Effect
  // Constructor: new GodraysPass(light, camera, partialParams?)
  const godraysPass = new GodraysPass(sunLight, camera, {
    density: isReduced ? 1 / 256 : 1 / 128,
    maxDensity: 0.5,
    distanceAttenuation: 2,
    color: new THREE.Color(1.0, 0.95, 0.8), // warm amber
    raymarchSteps: isReduced ? 30 : 60,
    blur: true,
    gammaCorrection: true,
  })

  return {
    pass: godraysPass,
    dispose() {
      godraysPass.dispose()
      renderer.shadowMap.enabled = false
      sunLight.castShadow = false
    },
  }
}
