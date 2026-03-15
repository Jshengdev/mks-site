// WorldEngine — Config-driven 3D engine for any environment world
// Accepts an environment config object and conditionally creates subsystems.
// The golden meadow's MeadowEngine is a thin wrapper around this.
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
import AtmosphereController, { MEADOW_KEYFRAMES } from './AtmosphereController.js'
import { NIGHT_MEADOW_KEYFRAMES } from './NightMeadowKeyframes.js'
import MusicTrigger from './MusicTrigger.js'
import ScoreSheetCloth from './ScoreSheetCloth.js'
import ArtistFigure from './ArtistFigure.js'
import PortalHint from './PortalHint.js'
import DustMotes from './DustMotes.js'
import GodRayPass from './GodRayPass.js'
import AudioReactive from './AudioReactive.js'
import CursorInteraction from './CursorInteraction.js'
import StarField from './StarField.js'
import { SECTION_T_VALUES } from './constants.js'
import scoreSheetUrl from '../assets/textures/score-sheet.jpg'
import mksPortraitUrl from '../assets/textures/mks-portrait.jpg'

// Generate static atmosphere keyframes from an environment config.
// Two identical keyframes at t=0 and t=1 — no scroll interpolation.
// Used for environments that don't have hand-tuned scroll-driven atmosphere yet.
function staticAtmosphereFromConfig(env) {
  const sky = env.sky ?? {}
  const lighting = env.lighting ?? {}
  const grass = env.grass ?? {}
  const fog = env.fog ?? {}
  const postFX = env.postFX ?? {}
  const particles = env.particles ?? {}

  // Parse fog color hex to RGB array
  const fogColor = fog.color ? hexToRGB(fog.color) : [0.10, 0.07, 0.03]
  const fireflyEnabled = particles.fireflies?.enabled ?? false
  const dustEnabled = particles.dust?.enabled ?? false

  const kf = {
    sunElevation: sky.sunElevation ?? 12,
    sunAzimuth: 240,
    turbidity: sky.turbidity ?? 10,
    rayleigh: sky.rayleigh ?? 1.5,
    mieCoefficient: sky.mieCoefficient ?? 0.008,
    mieDirectionalG: 0.92,
    fogColor,
    fogDensity: fog.density ?? 0.003,
    sunLightColor: lighting.sunColor ?? [1.0, 0.90, 0.70],
    sunLightIntensity: lighting.sunIntensity ?? 1.6,
    ambientIntensity: lighting.ambientIntensity ?? 0.16,
    grassBaseColor: grass.baseColor ?? [0.06, 0.20, 0.03],
    grassTipColor: grass.tipColor ?? [0.25, 0.55, 0.12],
    grassWindSpeed: grass.windSpeed ?? 1.0,
    grassAmbientStrength: 0.35,
    grassTranslucency: 2.0,
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.10,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: fireflyEnabled ? 0.8 : 0.0,
    fireflySize: fireflyEnabled ? (particles.fireflies.count > 500 ? 80 : 60) : 25,
    bloomIntensity: postFX.bloom?.intensity ?? 0.6,
    bloomThreshold: postFX.bloom?.threshold ?? 0.5,
    fogDepthStrength: 0.05,
    fogMidColor: fogColor,
    fogFarColor: fogColor,
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.5,
    colorGradeWarmth: 0.03,
    vignetteDarkness: postFX.vignette?.darkness ?? 0.6,
    grainOpacity: postFX.grain?.intensity ?? 0.06,
    dustMoteBrightness: dustEnabled ? 0.5 : 0.0,
    godRayIntensity: postFX.godRays?.enabled ? 0.5 : 0.0,
    kuwaharaStrength: postFX.kuwahara?.enabled ? (postFX.kuwahara.radius ?? 4) / 10 : 0.0,
    starBrightness: env.sky?.stars?.enabled ? 1.0 : 0.0,
  }

  return [
    { t: 0.0, ...kf },
    { t: 1.0, ...kf },
  ]
}

function hexToRGB(hex) {
  const c = new THREE.Color(hex)
  return [c.r, c.g, c.b]
}

export default class WorldEngine {
  constructor(canvas, envConfig) {
    this.canvas = canvas
    this.envConfig = envConfig
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.NoToneMapping

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      envConfig.camera?.fov ?? 45,
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
    this.cameraRig = new CameraRig(this.camera, envConfig.camera)
    this._contentSections = []
    this._sectionPositions = SECTION_T_VALUES.map(t => this.cameraRig.curve.getPoint(t))
    this.clock = new THREE.Clock()

    // ─── Scene (sky + lights from config) ───
    this.sceneSetup = setupScene(this.scene, envConfig)

    // ─── Terrain (always — color from config) ───
    this.terrain = createTerrain(this.scene, envConfig)

    // ─── Cloud shadows (optional) ───
    this.cloudShadows = new CloudShadows(this.scene)

    // ─── Grass (conditional on config) ───
    this.grassManager = null
    if (envConfig.grass?.enabled !== false && this.config.grassCount > 0) {
      // Override tier grass count with env config blade count (scaled by tier)
      const tierScale = this.config.grassCount / 60000 // fraction of desktop max
      const envBlades = envConfig.grass?.bladeCount ?? 60000
      const scaledConfig = {
        ...this.config,
        grassCount: Math.floor(envBlades * tierScale),
      }
      this.grassManager = new GrassChunkManager(this.scene, scaledConfig, this.cloudShadows.texture)
    }

    // ─── Fireflies (conditional) ───
    this.fireflies = null
    if (envConfig.particles?.fireflies?.enabled) {
      const count = envConfig.particles.fireflies.count ?? 500
      this.fireflies = new FireflySystem(this.scene, count)
    }

    // ─── Flowers (conditional) ───
    this.flowers = null
    if (envConfig.flowers?.enabled) {
      const count = envConfig.flowers.count ?? 800
      this.flowers = new FlowerInstances(this.scene, this.cameraRig, count)
    }

    // ─── Post-processing ───
    this.postProcessing = new PostProcessingStack(
      this.renderer, this.scene, this.camera,
      this.config.postFX
    )

    // ─── Atmosphere (keyframes: hand-tuned per world, or auto-generated) ───
    const KEYFRAME_MAP = {
      'golden-meadow': MEADOW_KEYFRAMES,
      'night-meadow': NIGHT_MEADOW_KEYFRAMES,
    }
    const keyframes = KEYFRAME_MAP[envConfig.id] ?? staticAtmosphereFromConfig(envConfig)

    this.atmosphere = new AtmosphereController(
      this.sceneSetup,
      this.grassManager,
      this.fireflies,
      this.cloudShadows,
      this.postProcessing,
      keyframes
    )

    // ─── Music trigger ───
    this.musicTrigger = new MusicTrigger(this.postProcessing, {
      threshold: envConfig.audio?.musicTrigger?.threshold ?? 0.35,
      audioSrc: null,
    })

    // ─── Score sheets (conditional) ───
    this.scoreSheets = null
    if (envConfig.scoreSheets?.enabled) {
      this.scoreSheets = new ScoreSheetCloth(this.scene, envConfig.scoreSheets.count ?? 3)
      const textureLoader = new THREE.TextureLoader()
      textureLoader.load(scoreSheetUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        this.scoreSheets.setTexture(tex)
      })
    }

    // ─── Artist figure (conditional) ───
    this.artistFigure = null
    if (envConfig.figure?.enabled) {
      this.artistFigure = new ArtistFigure(this.scene)
      this.artistFigure.loadTexture(mksPortraitUrl)
    }

    // ─── Portals (conditional — golden meadow only for now) ───
    this.portals = null
    if (envConfig.id === 'golden-meadow') {
      this.portals = new PortalHint(this.scene, this.camera)
    }

    // ─── Star field (conditional — night/dusk skies) ───
    this.starField = null
    if (envConfig.sky?.stars?.enabled) {
      this.starField = new StarField(this.scene, {
        ...envConfig.sky.stars,
        moon: envConfig.sky.moon,
      })
    }

    // ─── Dust motes (conditional) ───
    this.dustMotes = null
    if (envConfig.particles?.dust?.enabled) {
      const count = envConfig.particles.dust.count ?? 300
      this.dustMotes = new DustMotes(this.scene, count)
    }

    // ─── God rays (conditional) ───
    this.godRayPass = null
    if (envConfig.postFX?.godRays?.enabled) {
      this.godRayPass = new GodRayPass(
        this.renderer, this.scene, this.camera,
        this.sceneSetup.sunPosition
      )
    }

    // ─── Cursor interaction (always) ───
    this.cursorInteraction = new CursorInteraction()

    // ─── Audio reactive (always) ───
    this.audioReactive = new AudioReactive()

    // Wire optional subsystems into atmosphere
    this.atmosphere.dustMotes = this.dustMotes
    this.atmosphere.godRayPass = this.godRayPass
    this.atmosphere.starField = this.starField

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
    this.grassManager?.update(camPos, animElapsed)
    this.fireflies?.update(animElapsed)
    this.flowers?.update(animElapsed)

    if (!this.atmosphere.paused) {
      this.atmosphere.update(this.scrollEngine.progress)
    }

    this.musicTrigger.update(this.scrollEngine.progress, delta)
    this.scoreSheets?.update(animElapsed)
    if (this.scoreSheets) {
      this.scoreSheets.setWindStrength(this.atmosphere.current.grassWindSpeed / 1.5)
    }
    this.artistFigure?.update(camPos)
    this.portals?.update(animElapsed)
    this.dustMotes?.update(animElapsed)
    this.starField?.update(animElapsed)

    this.cursorInteraction.update(this.camera, delta)
    if (this.grassManager) {
      const brushStrength = this.cursorInteraction.isOnGround
        ? Math.min(this.cursorInteraction.speed * 0.5, 4.0)
        : 0
      this.grassManager.updateCursor(
        this.cursorInteraction.worldPos,
        brushStrength,
        this.cursorInteraction.velocity
      )
    }
    this.audioReactive.update(delta)

    this._updateContentVisibility()

    // God rays must render before post-processing composites them
    if (this.godRayPass) {
      this.postProcessing.setGodRayTexture(this.godRayPass.render(), this.godRayPass.intensity)
    }

    this.postProcessing.update(this.scrollEngine.velocity, camPos, this._sectionPositions)

    if (this.audioReactive.analyser) {
      this.postProcessing.bloom.intensity += this.audioReactive.bass * 0.3
      this.postProcessing.ca.uniforms.get('uDistortion').value += this.audioReactive.mid * 0.15
    }

    this.postProcessing.render(delta)

    this._rafId = requestAnimationFrame(this._tick)
  }

  _updateContentVisibility() {
    const t = this.cameraRig.getCurrentT()
    for (const el of this._contentSections) {
      const sectionT = parseFloat(el.dataset.sectionT)
      const dist = Math.abs(t - sectionT)
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
    this.godRayPass?.setSize(w, h)
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
      starField: this.starField,
      audioReactive: this.audioReactive,
      cursorInteraction: this.cursorInteraction,
      cameraRig: this.cameraRig,
      scrollEngine: this.scrollEngine,
      tier: this.tier,
      config: this.config,
      envConfig: this.envConfig,
    }
  }

  destroy() {
    if (this._rafId) cancelAnimationFrame(this._rafId)
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
    this.starField?.dispose()
    this.audioReactive?.dispose()
    this.cursorInteraction?.dispose()
    this.cameraRig?.dispose()
    this.cloudShadows?.dispose()
    this.renderer.dispose()
  }
}
