// src/meadow/PostProcessingStack.js
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  BloomEffect,
  VignetteEffect,
  ToneMappingEffect,
  ToneMappingMode,
  KernelSize,
} from 'postprocessing'
import * as THREE from 'three'
import { createFogDepthEffect } from './FogDepthPass.js'
import { createColorGradeEffect } from './ColorGradeEffect.js'
import { createSSAO } from './SSAOSetup.js'
import { createDOF } from './DOFSetup.js'
import { FilmGrainEffect } from './FilmGrainEffect.js'
import { RadialCAEffect } from './RadialCAEffect.js'
import { MotionBlurEffect } from './MotionBlurEffect.js'
import { KuwaharaEffect } from './KuwaharaEffect.js'
import { GodRayCompositeEffect } from './GodRayCompositeEffect.js'
import { CloudCompositeEffect } from './CloudCompositeEffect.js'

export default class PostProcessingStack {
  constructor(renderer, scene, camera, tier, dofConfig = {}) {
    this.composer = new EffectComposer(renderer, {
      frameBufferType: THREE.HalfFloatType,
    })
    this.composer.addPass(new RenderPass(scene, camera))

    if (tier === 'css') return

    const isReduced = tier === 'reduced'

    // ─── SSAO (NormalPass + SSAOEffect via pmndrs) ───
    this.ssao = createSSAO(scene, camera, tier)
    this.composer.addPass(this.ssao.normalPass)

    // ─── Effects (composed in single EffectPass) ───

    this.bloom = new BloomEffect({
      intensity: isReduced ? 0.3 : 0.6,
      luminanceThreshold: 0.6,
      luminanceSmoothing: 0.3,
      kernelSize: isReduced ? KernelSize.SMALL : KernelSize.MEDIUM,
    })

    this.fogDepth = createFogDepthEffect()

    // ACES tonemapping must come before color grade (expects 0-1 display values)
    this.toneMapping = new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC })

    this.colorGrade = createColorGradeEffect()
    this.ca = new RadialCAEffect({ distortion: 0.5 })
    this.motionBlur = new MotionBlurEffect()
    this.vignette = new VignetteEffect({ darkness: 0.5, offset: 0.3 })
    this.dof = isReduced ? null : createDOF(camera, dofConfig)
    this.godRayComposite = new GodRayCompositeEffect()
    // Volumetric cloud composite (half-res FBO blended behind scene via depth)
    // Winner: volumetric-cumulus-3d-noise (49/70)
    this.cloudComposite = new CloudCompositeEffect()

    // Research winner: 8-sector anisotropic, radius=6, alpha=25, 16-level quantize, 1.5x sat
    this.kuwahara = new KuwaharaEffect({
      kernelSize: 6,
      strength: 0.0,
      alpha: 25.0,
      quantizeLevels: 16,
      saturationBoost: 1.5,
    })

    // Film grain MUST be last (DOF must not blur grain)
    this.grain = new FilmGrainEffect({ grainIntensity: 0.06 })

    // Stack order: SSAO → Clouds → GodRays → Bloom → MotionBlur → ToneMapping → FogDepth
    // → ColorGrade → Kuwahara → Radial CA → Vignette → [DOF] → Film Grain
    const effects = [
      this.ssao.effect,
      this.cloudComposite,
      this.godRayComposite,
      this.bloom,
      this.motionBlur,
      this.toneMapping,
      this.fogDepth.effect,
      this.colorGrade.effect,
      this.kuwahara,
      this.ca,
      this.vignette,
      ...(this.dof ? [this.dof.effect] : []),
      this.grain,
    ]

    this.effectPass = new EffectPass(camera, ...effects)
    this.composer.addPass(this.effectPass)
  }

  setGodRayTexture(texture, intensity) {
    this.godRayComposite.uniforms.get('tGodRays').value = texture
    this.godRayComposite.uniforms.get('uIntensity').value = texture ? intensity : 0
  }

  setCloudTexture(texture, intensity) {
    this.cloudComposite.uniforms.get('tClouds').value = texture
    this.cloudComposite.uniforms.get('uIntensity').value = texture ? intensity : 0
  }

  update(scrollVelocity, cameraPos, sectionPositions) {
    if (!this.ca) return

    // CA base is set by AtmosphereController (per-world keyframe-driven)
    // Velocity adds on top — fast scrolling amplifies the world's lens distortion
    const velocityBoost = Math.abs(scrollVelocity) * 0.15
    const current = this.ca.uniforms.get('uDistortion').value
    this.ca.uniforms.get('uDistortion').value = Math.min(1.5, current + velocityBoost)

    if (this.dof && cameraPos && sectionPositions) {
      this.dof.updateFocus(cameraPos, sectionPositions)
    }
  }

  render(deltaTime) {
    this.composer.render(deltaTime)
  }

  setSize(width, height) {
    this.composer.setSize(width, height)
  }

  dispose() {
    this.ssao?.dispose()
    this.fogDepth?.dispose()
    this.colorGrade?.dispose()
    this.dof?.dispose()
    this.bloom?.dispose()
    this.toneMapping?.dispose()
    this.ca?.dispose()
    this.motionBlur?.dispose()
    this.vignette?.dispose()
    this.godRayComposite?.dispose()
    this.cloudComposite?.dispose()
    this.kuwahara?.dispose()
    this.grain?.dispose()
    this.composer.dispose()
  }
}
