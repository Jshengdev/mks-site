// MeadowEngine — Top-level orchestrator for the 3D meadow
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
import CursorInteraction from './CursorInteraction.js'
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
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    // Tonemapping handled by ToneMappingEffect in PostProcessingStack
    this.renderer.toneMapping = THREE.NoToneMapping

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    )

    this.tier = detectTier(this.renderer)
    this.config = TIER_CONFIG[this.tier]

    if (this.tier === 3) {
      this.renderer.dispose()
      canvas.style.display = 'none'
      return
    }

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.scrollEngine = new ScrollEngine()
    this.cameraRig = new CameraRig(this.camera)
    this._contentSections = []
    this._sectionPositions = SECTION_T_VALUES.map(t => this.cameraRig.curve.getPoint(t))
    this.clock = new THREE.Clock()

    this.sceneSetup = setupScene(this.scene)
    this.terrain = createTerrain(this.scene)
    this.cloudShadows = new CloudShadows(this.scene)
    this.grassManager = new GrassChunkManager(this.scene, this.config, this.cloudShadows.texture)
    this.fireflies = new FireflySystem(this.scene, 500)
    this.flowers = new FlowerInstances(this.scene, this.cameraRig, 800)

    this.postProcessing = new PostProcessingStack(
      this.renderer, this.scene, this.camera,
      this.config.postFX
    )

    this.atmosphere = new AtmosphereController(
      this.sceneSetup,
      this.grassManager,
      this.fireflies,
      this.cloudShadows,
      this.postProcessing
    )

    this.musicTrigger = new MusicTrigger(this.postProcessing, {
      threshold: 0.35,
      audioSrc: null,
    })

    this.scoreSheets = new ScoreSheetCloth(this.scene, 3)
    this.artistFigure = new ArtistFigure(this.scene)

    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(scoreSheetUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      this.scoreSheets.setTexture(tex)
    })
    this.artistFigure.loadTexture(mksPortraitUrl)

    this.portals = new PortalHint(this.scene, this.camera)
    this.dustMotes = new DustMotes(this.scene, 300)
    this.godRayPass = new GodRayPass(
      this.renderer, this.scene, this.camera,
      this.sceneSetup.sunPosition
    )

    this.cursorInteraction = new CursorInteraction()
    this.audioReactive = new AudioReactive()

    this.atmosphere.dustMotes = this.dustMotes
    this.atmosphere.godRayPass = this.godRayPass

    this._onResize = this._onResize.bind(this)
    window.addEventListener('resize', this._onResize)

    this._tick = this._tick.bind(this)
    this._tick()
  }

  setContentSections(elements) {
    this._contentSections = elements
  }

  _tick() {
    const delta = this.clock.getDelta()
    const elapsed = this.clock.getElapsedTime()
    const animElapsed = this.reducedMotion ? 0 : elapsed

    this.cameraRig.update(this.scrollEngine.progress, this.scrollEngine.velocity)
    const camPos = this.cameraRig.getPosition()
    this.cloudShadows.update(animElapsed)
    this.grassManager.update(camPos, animElapsed)
    this.fireflies.update(animElapsed)
    this.flowers.update(animElapsed)

    if (!this.atmosphere.paused) {
      this.atmosphere.update(this.scrollEngine.progress)
    }

    this.musicTrigger.update(this.scrollEngine.progress, delta)
    this.scoreSheets.update(animElapsed)
    this.scoreSheets.setWindStrength(this.atmosphere.current.grassWindSpeed / 1.5)
    this.artistFigure.update(camPos)
    this.portals.update(animElapsed)
    this.dustMotes.update(animElapsed)

    this.cursorInteraction.update(this.camera, delta)
    const brushStrength = this.cursorInteraction.isOnGround
      ? Math.min(this.cursorInteraction.speed * 0.5, 4.0)
      : 0
    this.grassManager.updateCursor(
      this.cursorInteraction.worldPos,
      brushStrength,
      this.cursorInteraction.velocity
    )
    this.audioReactive.update(delta)

    this._updateContentVisibility()

    // God rays must render before post-processing composites them
    const godRayUniforms = this.postProcessing.godRayComposite.uniforms
    const godRayTex = this.godRayPass.render()
    godRayUniforms.get('tGodRays').value = godRayTex
    godRayUniforms.get('uIntensity').value = godRayTex ? this.godRayPass.intensity : 0

    this.postProcessing.update(this.scrollEngine.velocity, camPos, this._sectionPositions)

    if (this.audioReactive.analyser) {
      this.postProcessing.bloom.intensity += this.audioReactive.bass * 0.3
      this.postProcessing.ca.uniforms.get('uDistortion').value += this.audioReactive.mid * 0.15
    }

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
      cursorInteraction: this.cursorInteraction,
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
    this.cursorInteraction?.dispose()
    this.cameraRig?.dispose()
    this.cloudShadows?.dispose()
    this.renderer.dispose()
  }
}
