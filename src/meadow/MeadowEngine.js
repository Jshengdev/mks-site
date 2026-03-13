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
import MusicTrigger from './MusicTrigger.js'
import ScoreSheetCloth from './ScoreSheetCloth.js'
import ArtistFigure from './ArtistFigure.js'
import PortalHint from './PortalHint.js'
import DustMotes from './DustMotes.js'
import GodRayPass from './GodRayPass.js'
import AudioReactive from './AudioReactive.js'
import scoreSheetUrl from '../assets/textures/score-sheet.jpg'
import mksPortraitUrl from '../assets/textures/mks-portrait.jpg'

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

    this.postProcessing = new PostProcessingStack(
      this.renderer, this.scene, this.camera,
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

    // Music trigger — BotW discovery moment at scroll threshold
    // TODO: Replace with actual MKS audio file path
    this.musicTrigger = new MusicTrigger(this.postProcessing, {
      threshold: 0.35,
      audioSrc: null, // Set to audio file URL when available
    })

    // Score sheet cloth — wind-driven sheets tumbling through meadow
    this.scoreSheets = new ScoreSheetCloth(this.scene, 3)

    // Artist figure — 2D cutout billboard at far end of meadow
    this.artistFigure = new ArtistFigure(this.scene)

    // Load real textures for score sheets and artist figure
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(scoreSheetUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      this.scoreSheets.setTexture(tex)
    })
    this.artistFigure.loadTexture(mksPortraitUrl)

    // Portal hints — shimmering spots teasing future worlds
    this.portals = new PortalHint(this.scene, this.camera)

    // Dust motes — floating particles catching sunlight
    this.dustMotes = new DustMotes(this.scene, 300)

    // God rays — screen-space radial blur (GPU Gems 3)
    this.godRayPass = new GodRayPass(
      this.renderer, this.scene, this.camera,
      this.sceneSetup.sunPosition
    )

    // Audio reactive — FFT analysis for future music-driven effects
    this.audioReactive = new AudioReactive()

    // Wire optional subsystems into AtmosphereController
    this.atmosphere.dustMotes = this.dustMotes
    this.atmosphere.godRayPass = this.godRayPass

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

    // Music trigger (pass delta for pulse animation)
    this.musicTrigger.update(this.scrollEngine.progress, delta)

    // Score sheets + artist figure
    this.scoreSheets.update(animElapsed)
    this.scoreSheets.setWindStrength(
      this.atmosphere.current.grassWindSpeed / 1.5  // normalize to ~0-1.3
    )
    this.artistFigure.update(camPos)
    this.portals.update(animElapsed)
    this.dustMotes.update(animElapsed)
    this.audioReactive.update(delta)

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
    this.godRayPass.setSize(w, h)
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
      musicTrigger: this.musicTrigger,
      scoreSheets: this.scoreSheets,
      artistFigure: this.artistFigure,
      portals: this.portals,
      dustMotes: this.dustMotes,
      godRayPass: this.godRayPass,
      audioReactive: this.audioReactive,
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
    this.musicTrigger?.dispose()
    this.scoreSheets?.dispose()
    this.artistFigure?.dispose()
    this.portals?.dispose()
    this.dustMotes?.dispose()
    this.godRayPass?.dispose()
    this.audioReactive?.dispose()
    this.cloudShadows = null
    this.renderer.dispose()
  }
}
