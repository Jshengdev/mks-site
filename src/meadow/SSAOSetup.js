// SSAOSetup — Screen-space ambient occlusion via pmndrs/postprocessing
// Adds grass contact shadows. Uses NormalPass + SSAOEffect (native pmndrs).
import { SSAOEffect, NormalPass } from 'postprocessing'

export function createSSAO(scene, camera, tier) {
  const isReduced = tier === 'reduced'

  const normalPass = new NormalPass(scene, camera)

  const effect = new SSAOEffect(camera, normalPass, {
    samples: isReduced ? 9 : 16,
    rings: 4,
    radius: isReduced ? 0.03 : 0.05,
    intensity: isReduced ? 1.0 : 1.5,
    luminanceInfluence: 0.7,
    bias: 0.025,
  })

  return {
    normalPass,
    effect,
    dispose() {
      normalPass.dispose()
      effect.dispose()
    },
  }
}
