// DOFSetup — Depth of Field via pmndrs/postprocessing (Tier 1 only)
// Racks focus toward nearest content section clearing as camera moves
import { DepthOfFieldEffect } from 'postprocessing'

const DEFAULTS = {
  focusDistance: 15.0,
  focusRange: 8.0,
  bokehScale: 3.0,
  resolutionScale: 0.5,
  lerpSpeed: 0.05,
  fallbackFocus: 50,
}

export function createDOF(camera) {
  if (!camera) return null

  const effect = new DepthOfFieldEffect(camera, {
    focusDistance: DEFAULTS.focusDistance,
    focusRange: DEFAULTS.focusRange,
    bokehScale: DEFAULTS.bokehScale,
    resolutionScale: DEFAULTS.resolutionScale,
  })

  let currentFocus = DEFAULTS.focusDistance

  function updateFocus(cameraPos, sectionPositions) {
    let nearest = DEFAULTS.fallbackFocus
    for (const pos of sectionPositions) {
      const d = cameraPos.distanceTo(pos)
      if (d < nearest) nearest = d
    }

    currentFocus += (nearest - currentFocus) * DEFAULTS.lerpSpeed
    effect.cocMaterial.focusDistance = currentFocus
  }

  return {
    effect,
    updateFocus,
    dispose() { effect.dispose() },
  }
}
