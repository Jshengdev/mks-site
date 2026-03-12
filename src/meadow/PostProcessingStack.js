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
import { GodraysPass } from 'three-good-godrays'
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

    // God Rays — only on Tier 1 (expensive), uses GodraysPass (a Pass, not an Effect)
    if (!isReduced) {
      const sunSphere = new THREE.Mesh(
        new THREE.SphereGeometry(2, 8, 8),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(1.0, 0.8, 0.4),
          transparent: true,
          opacity: 0.0,
        })
      )
      sunSphere.position.copy(sunPosition).multiplyScalar(50)
      scene.add(sunSphere)
      this._sunSphere = sunSphere

      try {
        this.godraysPass = new GodraysPass(sunSphere, camera, {
          density: 0.96,
          decay: 0.93,
          weight: 0.4,
          samples: 60,
        })
        this.composer.addPass(this.godraysPass)
      } catch (e) {
        console.warn('God rays not available:', e)
      }
    }
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
