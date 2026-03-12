// src/meadow/PostProcessingStack.js
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  BloomEffect,
  ChromaticAberrationEffect,
  VignetteEffect,
  NoiseEffect,
  BlendFunction,
  KernelSize,
} from 'postprocessing'
import * as THREE from 'three'

export default class PostProcessingStack {
  constructor(renderer, scene, camera, sunPosition, tier) {
    this.composer = new EffectComposer(renderer)
    this.composer.addPass(new RenderPass(scene, camera))

    if (tier === 'css') return // No post-fx for tier 3

    const isReduced = tier === 'reduced'

    // Bloom — subtle, warm (flower petals + fireflies glow)
    this.bloom = new BloomEffect({
      intensity: isReduced ? 0.3 : 0.6,
      luminanceThreshold: 0.6,
      luminanceSmoothing: 0.3,
      kernelSize: isReduced ? KernelSize.SMALL : KernelSize.MEDIUM,
    })

    // Chromatic Aberration — very subtle, increases with scroll velocity
    this.ca = new ChromaticAberrationEffect({
      offset: new THREE.Vector2(0.001, 0.001),
    })

    // Vignette
    this.vignette = new VignetteEffect({
      darkness: 0.5,
      offset: 0.3,
    })

    // Film Grain (GPU shader, not canvas — per Cinematic Imperfection principle)
    this.grain = new NoiseEffect({
      blendFunction: BlendFunction.OVERLAY,
      premultiply: true,
    })
    this.grain.blendMode.opacity.value = 0.03

    // Combine effects into single pass
    this.effectPass = new EffectPass(camera, this.bloom, this.ca, this.vignette, this.grain)
    this.composer.addPass(this.effectPass)

    // God Rays — disabled for now (GodraysPass requires DirectionalLight
    // with castShadow + shadow maps enabled; needs proper shadow setup)
    // TODO: Enable after configuring sunLight.castShadow and renderer.shadowMap
  }

  // Called each frame with scroll velocity for reactive params
  update(scrollVelocity) {
    if (!this.ca) return

    // CA increases during camera movement
    const caIntensity = Math.min(0.005, Math.abs(scrollVelocity) * 0.001)
    this.ca.offset.set(caIntensity, caIntensity)
  }

  render(deltaTime) {
    this.composer.render(deltaTime)
  }

  setSize(width, height) {
    this.composer.setSize(width, height)
  }

  dispose() {
    this.composer.dispose()
  }
}
