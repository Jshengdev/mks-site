// src/meadow/PostProcessingStack.js
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  BloomEffect,
  ChromaticAberrationEffect,
  VignetteEffect,
  NoiseEffect,
  ToneMappingEffect,
  ToneMappingMode,
  BlendFunction,
  KernelSize,
} from 'postprocessing'
import * as THREE from 'three'
// import { createShadowGodrays } from './ShadowGodrays.js'  // disabled, see TODO above
import { createFogDepthEffect } from './FogDepthPass.js'
import { createColorGradeEffect } from './ColorGradeEffect.js'
import { createSSAO } from './SSAOSetup.js'
import { createLensFlareEffect } from './LensFlareEffect.js'
import { createDOF } from './DOFSetup.js'

export default class PostProcessingStack {
  constructor(renderer, scene, camera, sunLight, sunPosition, tier) {
    this.composer = new EffectComposer(renderer, {
      frameBufferType: THREE.HalfFloatType,
    })
    this.composer.addPass(new RenderPass(scene, camera))

    if (tier === 'css') return

    const isReduced = tier === 'reduced'
    const isFull = tier === 'full' || tier === undefined

    // ─── God Rays (DISABLED — needs terrain/grass castShadow + receiveShadow) ───
    // The GodraysPass renders a sun occlusion disc that appears dark
    // without proper shadow map setup on scene geometry.
    // TODO: Enable once terrain.receiveShadow and grass.castShadow are wired
    this.godrays = null

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

    // Lens Flare (DISABLED — creates dark disc artifact when sun is near screen edge)
    // The user wants the sun off-camera with only golden rays visible,
    // so lens flare is unnecessary. Re-enable if sun moves back on-screen.
    this.lensFlare = null

    // Chromatic Aberration
    this.ca = new ChromaticAberrationEffect({
      offset: new THREE.Vector2(0.001, 0.001),
    })

    // Vignette
    this.vignette = new VignetteEffect({ darkness: 0.5, offset: 0.3 })

    // DOF (Tier 1 only)
    this.dof = isFull ? createDOF(camera) : null

    // Film Grain — MUST be last (DOF must not blur grain)
    this.grain = new NoiseEffect({
      blendFunction: BlendFunction.OVERLAY,
      premultiply: true,
    })
    this.grain.blendMode.opacity.value = 0.03

    // Build effects array — order matters:
    // 1. SSAO (needs linear HDR depth/normals)
    // 2. Bloom (needs HDR to detect bright areas)
    // 3. Tonemapping (HDR → display 0-1) — MUST come before color grade
    // 4. FogDepth, ColorGrade (expect 0-1 display values)
    // 5. CA, Vignette, DOF (display-space effects)
    // 6. Grain MUST be last (DOF must not blur grain)
    const effects = [
      this.ssao.effect,
      this.bloom,
      this.toneMapping,
      this.fogDepth.effect,
      this.colorGrade.effect,
      ...(this.lensFlare ? [this.lensFlare.effect] : []),
      this.ca,
      this.vignette,
      ...(this.dof ? [this.dof.effect] : []),
      this.grain,
    ]

    this.effectPass = new EffectPass(camera, ...effects)
    this.composer.addPass(this.effectPass)
    this._camera = camera
  }

  update(scrollVelocity, cameraPos, sectionPositions) {
    if (!this.ca) return

    const caIntensity = Math.min(0.005, Math.abs(scrollVelocity) * 0.001)
    this.ca.offset.set(caIntensity, caIntensity)

    if (this.lensFlare) {
      this.lensFlare.update(this._camera)
    }

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
    this.godrays?.dispose()
    this.ssao?.dispose()
    this.fogDepth?.dispose()
    this.colorGrade?.dispose()
    this.lensFlare?.dispose()
    this.dof?.dispose()
    this.composer.dispose()
  }
}
