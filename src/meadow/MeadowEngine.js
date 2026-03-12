// MeadowEngine — Top-level orchestrator for the 3D meadow
// Creates renderer, scene, camera. Wires scroll → camera → content visibility.
// Subsystems (grass, flowers, fireflies, post-processing) are added by workers
// and wired in during the integration phase.
import * as THREE from 'three'
import ScrollEngine from './ScrollEngine.js'
import CameraRig from './CameraRig.js'
import { detectTier, TIER_CONFIG } from './TierDetection.js'

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
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0

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

    // Clock for delta time
    this.clock = new THREE.Clock()

    // ─── Subsystem slots (populated during integration phase) ───
    this.sceneSetup = null      // from MeadowScene.js
    this.terrain = null         // from TerrainPlane.js
    this.cloudShadows = null    // from CloudShadows.js
    this.grassManager = null    // from GrassChunkManager.js
    this.flowers = null         // from FlowerInstances.js
    this.fireflies = null       // from FireflySystem.js
    this.postProcessing = null  // from PostProcessingStack.js

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

    // Update camera from scroll
    this.cameraRig.update(this.scrollEngine.progress)

    // Update subsystems (populated during integration phase)
    const camPos = this.cameraRig.getPosition()
    this.cloudShadows?.update(animElapsed)
    this.grassManager?.update(camPos, animElapsed, this.cameraRig.getCurrentT())
    this.fireflies?.update(animElapsed)
    this.flowers?.update(animElapsed)

    // Update content section visibility
    this._updateContentVisibility()

    // Render (post-processing if available, otherwise direct)
    if (this.postProcessing) {
      this.postProcessing.update(this.scrollEngine.velocity)
      this.postProcessing.render(delta)
    } else {
      this.renderer.render(this.scene, this.camera)
    }

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
    this.postProcessing?.setSize(w, h)
  }

  destroy() {
    window.removeEventListener('resize', this._onResize)
    this.scrollEngine?.destroy()
    this.grassManager?.dispose()
    this.flowers?.dispose()
    this.fireflies?.dispose()
    this.postProcessing?.dispose()
    this.renderer.dispose()
  }
}
