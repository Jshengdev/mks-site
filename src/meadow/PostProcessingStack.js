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

export default class PostProcessingStack {
  constructor(renderer, scene, camera, tier) {
    this.composer = new EffectComposer(renderer, {
      frameBufferType: THREE.HalfFloatType,
    })
    this.composer.addPass(new RenderPass(scene, camera))

    if (tier === 'css') return

    const isReduced = tier === 'reduced'
    const isFull = tier === 'full' || tier === undefined

    // ─── SSAO (NormalPass + SSAOEffect via pmndrs) ───
    this.ssao = createSSAO(scene, camera, tier)
    this.composer.addPass(this.ssao.normalPass)

    // ─── Effects (composed in single EffectPass) ───

    // Bloom
    this.bloom = new BloomEffect({
      intensity: isReduced ? 0.3 : 0.6,
      luminanceThreshold: 0.6,
      luminanceSmoothing: 0.3,
      kernelSize: isReduced ? KernelSize.SMALL : KernelSize.MEDIUM,
    })

    // 3-Zone Fog
    this.fogDepth = createFogDepthEffect()

    // ACES Tonemapping (pmndrs bypasses renderer.toneMapping — must be explicit)
    // Must come before color grade, which expects 0-1 display values
    this.toneMapping = new ToneMappingEffect({
      mode: ToneMappingMode.ACES_FILMIC,
    })

    // SEUS-style Color Grade
    this.colorGrade = createColorGradeEffect()

    // Radial Chromatic Aberration (stolen from filmic-gl — replaces pmndrs CA)
    this.ca = new RadialCAEffect({ distortion: 0.5 })

    // Motion Blur — camera-only (stolen from realism-effects)
    this.motionBlur = new MotionBlurEffect()

    // Vignette
    this.vignette = new VignetteEffect({ darkness: 0.5, offset: 0.3 })

    // DOF (Tier 1 only)
    this.dof = isFull ? createDOF(camera) : null

    // Kuwahara painterly — activates at emotional peak via AtmosphereController
    // Stolen from L19 / heckel-painterly-shaders (4-quadrant variant)
    this.kuwahara = new KuwaharaEffect({ kernelSize: 4, strength: 0.0 })

    // Film Grain — MUST be last (DOF must not blur grain)
    this.grain = new FilmGrainEffect({ grainIntensity: 0.06 })

    // Stack order: SSAO → Bloom → Motion Blur → ToneMapping → FogDepth → ColorGrade
    // → Kuwahara → Radial CA → Vignette → DOF → Film Grain
    const effects = [
      this.ssao.effect,
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

  update(scrollVelocity, cameraPos, sectionPositions) {
    if (!this.ca) return

    // Radial CA intensity scales with scroll velocity
    const caIntensity = Math.min(1.0, 0.3 + Math.abs(scrollVelocity) * 0.2)
    this.ca.uniforms.get('uDistortion').value = caIntensity

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
    this.composer.dispose()
  }
}
