// MeadowEngine — Top-level orchestrator for the 3D meadow
// Creates renderer, scene, camera. Wires scroll → camera → content visibility.
import * as THREE from 'three'
import ScrollEngine from './ScrollEngine.js'
import CameraRig from './CameraRig.js'
import { detectTier, TIER_CONFIG } from './TierDetection.js'
import { setupScene } from './MeadowScene.js'
import { createTerrain } from './TerrainPlane.js'
import CloudShadows from './CloudShadows.js'
import GrassChunkManager from './GrassChunkManager.js'
import FireflySystem from './FireflySystem.js'
import FlowerInstances from './FlowerInstances.js'
import PostProcessingStack from './PostProcessingStack.js'
import AtmosphereController from './AtmosphereController.js'

// Content section t-values on the spline (must match ContentOverlay)
const SECTION_T_VALUES = [0.075, 0.275, 0.475, 0.725, 0.925]

export default class MeadowEngine {
  constructor(canvas) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    // Shaders output linear values; renderer handles gamma
    // ACES tonemapping applied by post-processing or renderer fallback
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    // Tonemapping handled by pmndrs ToneMappingEffect in PostProcessingStack
    // (pmndrs EffectComposer bypasses renderer.toneMapping)
    this.renderer.toneMapping = THREE.NoToneMapping

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    )

    // Detect performance tier
    this.tier = detectTier(this.renderer)
    this.config = TIER_CONFIG[this.tier]

    // Tier 3: no WebGL, bail early
    if (this.tier === 3) {
      this.renderer.dispose()
      canvas.style.display = 'none'
      return
    }

    // Check reduced motion preference
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Scroll engine (Lenis)
    this.scrollEngine = new ScrollEngine()

    // Camera rig (spline path)
    this.cameraRig = new CameraRig(this.camera)

    // Content section DOM elements (set by setContentSections)
    this._contentSections = []

    // Pre-compute content section world positions for DOF focus tracking
    this._sectionPositions = SECTION_T_VALUES.map(t => this.cameraRig.curve.getPoint(t))

    // Clock for delta time
    this.clock = new THREE.Clock()

    // ─── Wire subsystems ───
    this.sceneSetup = setupScene(this.scene)
    this.terrain = createTerrain(this.scene)
    this.cloudShadows = new CloudShadows(this.scene)

    const cloudTexture = this.cloudShadows.texture
    this.grassManager = new GrassChunkManager(this.scene, this.config, cloudTexture)
    this.fireflies = new FireflySystem(this.scene, 500)
    this.flowers = new FlowerInstances(this.scene, this.cameraRig, 800)

    // PostProcessingStack now receives sunLight for god rays
    this.postProcessing = new PostProcessingStack(
      this.renderer, this.scene, this.camera,
      this.sceneSetup.sunLight, this.sceneSetup.sunPosition,
      this.config.postFX
    )

    // Atmosphere controller — scroll-driven keyframe interpolation
    this.atmosphere = new AtmosphereController(
      this.sceneSetup,
      this.grassManager,
      this.fireflies,
      this.cloudShadows,
      this.postProcessing
    )

    // Resize handler
    this._onResize = this._onResize.bind(this)
    window.addEventListener('resize', this._onResize)

    // Start render loop
    this._tick = this._tick.bind(this)
    this._tick()
  }

  // Called by React to register content section DOM elements
  setContentSections(elements) {
    this._contentSections = elements
  }

  _tick() {
    if (this.tier === 3) return

    const delta = this.clock.getDelta()
    const elapsed = this.clock.getElapsedTime()
    const animElapsed = this.reducedMotion ? 0 : elapsed

    // Update camera from scroll (pass velocity for FOV speed effect)
    this.cameraRig.update(this.scrollEngine.progress, this.scrollEngine.velocity)

    // Update subsystems
    const camPos = this.cameraRig.getPosition()
    this.cloudShadows.update(animElapsed)
    this.grassManager.update(camPos, animElapsed, this.cameraRig.getCurrentT())
    this.fireflies.update(animElapsed)
    this.flowers.update(animElapsed)

    // Drive atmospheric mood from scroll position
    this.atmosphere.update(this.scrollEngine.progress)

    // Update content section visibility
    this._updateContentVisibility()

    // Render via post-processing (pass camPos + section positions for DOF)
    this.postProcessing.update(this.scrollEngine.velocity, camPos, this._sectionPositions)
    this.postProcessing.render(delta)

    requestAnimationFrame(this._tick)
  }

  _updateContentVisibility() {
    const t = this.cameraRig.getCurrentT()
    for (const el of this._contentSections) {
      const sectionT = parseFloat(el.dataset.sectionT)
      const dist = Math.abs(t - sectionT)
      // smoothstep: visible within 3% scroll, faded by 8%
      const opacity = 1.0 - this._smoothstep(0.03, 0.08, dist)
      el.style.opacity = opacity
      el.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none'
    }
  }

  _smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)
  }

  _onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
    this.postProcessing.setSize(w, h)
  }

  // Expose subsystem references for DevTuner
  getDevAPI() {
    return {
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      sceneSetup: this.sceneSetup,
      postProcessing: this.postProcessing,
      grassManager: this.grassManager,
      fireflies: this.fireflies,
      flowers: this.flowers,
      cloudShadows: this.cloudShadows,
      atmosphere: this.atmosphere,
      cameraRig: this.cameraRig,
      scrollEngine: this.scrollEngine,
      tier: this.tier,
      config: this.config,
    }
  }

  destroy() {
    window.removeEventListener('resize', this._onResize)
    this.scrollEngine?.destroy()
    this.grassManager?.dispose()
    this.flowers?.dispose()
    this.fireflies?.dispose()
    this.postProcessing?.dispose()
    this.cloudShadows = null
    this.renderer.dispose()
  }
}
