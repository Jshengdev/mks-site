/**
 * DOFSetup.js — Depth of Field with DepthOfFieldEffect (pmndrs/postprocessing)
 *
 * Creates a DepthOfFieldEffect that dynamically focuses on the nearest
 * content section clearing as the camera moves along the spline.
 * Tier 1 only — too expensive for Tier 2/3.
 *
 * Returns an Effect (not a Pass) — add to an EffectPass, not composer.addPass().
 */

import { DepthOfFieldEffect } from 'postprocessing'

const DEFAULTS = {
  focusDistance: 0.0,   // normalized 0-1 (0 = near plane, 1 = far plane)
  focusRange: 0.05,     // range around focus that stays sharp
  bokehScale: 3.0,      // blur intensity
  resolutionScale: 0.5, // half-res for performance
  lerpSpeed: 0.05,
  fallbackFocus: 50,    // world-unit fallback when no sections nearby
}

/**
 * @param {THREE.Camera} camera
 * @returns {{ effect: DepthOfFieldEffect, updateFocus: Function, dispose: Function } | null}
 */
export function createDOF(camera) {
  if (!camera) return null

  const effect = new DepthOfFieldEffect(camera, {
    focusDistance: DEFAULTS.focusDistance,
    focusRange: DEFAULTS.focusRange,
    bokehScale: DEFAULTS.bokehScale,
    resolutionScale: DEFAULTS.resolutionScale,
  })

  let currentFocus = 0.02
  const lerpSpeed = DEFAULTS.lerpSpeed

  /**
   * Call each frame to smoothly rack focus toward the nearest content section.
   * @param {THREE.Vector3} cameraPos - current camera world position
   * @param {THREE.Vector3[]} sectionPositions - world positions of content clearings
   */
  function updateFocus(cameraPos, sectionPositions) {
    let nearest = DEFAULTS.fallbackFocus

    for (const pos of sectionPositions) {
      const d = cameraPos.distanceTo(pos)
      if (d < nearest) nearest = d
    }

    // Convert world distance to normalized focus distance (0-1)
    const normalized = nearest / camera.far
    currentFocus += (normalized - currentFocus) * lerpSpeed
    effect.cocMaterial.uniforms.focusDistance.value = currentFocus
  }

  function dispose() {
    effect.dispose()
  }

  return { effect, updateFocus, dispose }
}
