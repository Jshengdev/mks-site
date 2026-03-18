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
import { GOLDEN_MEADOW_KEYFRAMES } from './GoldenMeadowKeyframes.js'
import { NIGHT_MEADOW_KEYFRAMES } from './NightMeadowKeyframes.js'
import { OCEAN_CLIFF_KEYFRAMES } from './OceanCliffKeyframes.js'
import StylizedOcean from './StylizedOcean.js'
import RainSystem from './RainSystem.js'
import LightningSystem from './LightningSystem.js'
import { STORM_FIELD_KEYFRAMES } from './StormFieldKeyframes.js'
import { GHIBLI_KEYFRAMES } from './GhibliKeyframes.js'
import { VOLCANIC_OBSERVATORY_KEYFRAMES } from './VolcanicObservatoryKeyframes.js'
import { FLOATING_LIBRARY_KEYFRAMES } from './FloatingLibraryKeyframes.js'
import { CRYSTAL_CAVERN_KEYFRAMES } from './CrystalCavernKeyframes.js'
import { MEMORY_GARDEN_KEYFRAMES } from './MemoryGardenKeyframes.js'
import { TIDE_POOL_KEYFRAMES } from './TidePoolKeyframes.js'
import { CLOCKWORK_FOREST_KEYFRAMES } from './ClockworkForestKeyframes.js'
import { AURORA_TUNDRA_KEYFRAMES } from './AuroraTundraKeyframes.js'
import { INFINITE_STAIRCASE_KEYFRAMES } from './InfiniteStaircaseKeyframes.js'
import { UNDERWATER_CATHEDRAL_KEYFRAMES } from './UnderwaterCathedralKeyframes.js'
import { BIOLUMINESCENT_DEEP_KEYFRAMES } from './BioluminescentDeepKeyframes.js'
import { PAPER_WORLD_KEYFRAMES } from './PaperWorldKeyframes.js'
import { SONIC_VOID_KEYFRAMES } from './SonicVoidKeyframes.js'
import CrystalFormation from './CrystalFormation.js'
import GlowMushroom from './GlowMushroom.js'
import PetalSystem from './PetalSystem.js'
import SnowParticle from './SnowParticle.js'
import IceSpike from './IceSpike.js'
import AuroraCurtain from './AuroraCurtain.js'
import MusicTrigger from './MusicTrigger.js'
import ScoreSheetCloth from './ScoreSheetCloth.js'
import ArtistFigure from './ArtistFigure.js'
import PortalHint from './PortalHint.js'
import DustMotes from './DustMotes.js'
import GodRayPass from './GodRayPass.js'
import AudioReactive from './AudioReactive.js'
import CursorInteraction from './CursorInteraction.js'
import StarField from './StarField.js'
import VolumetricCloudSystem from './VolumetricCloudSystem.js'
import DissolvingFlower from './DissolvingFlower.js'
import WiltingGrass from './WiltingGrass.js'
import FogWisp from './FogWisp.js'
import OrigamiGrass from './OrigamiGrass.js'
import PaperTree from './PaperTree.js'
import FoldLine from './FoldLine.js'
import FloatingPlatform from './FloatingPlatform.js'
import StairSegment from './StairSegment.js'
import PortalDoor from './PortalDoor.js'
import FloatingBook from './FloatingBook.js'
import ShelfSegment from './ShelfSegment.js'
import WarmLightOrb from './WarmLightOrb.js'
import EmberSystem from './EmberSystem.js'
import LavaCrack from './LavaCrack.js'
import AshSystem from './AshSystem.js'
import GearTree from './GearTree.js'
import SteamVent from './SteamVent.js'
import CopperLeaf from './CopperLeaf.js'
import GiantAnemone from './GiantAnemone.js'
import Starfish from './Starfish.js'
import CausticProjector from './CausticProjector.js'
import JellyfishSystem from './JellyfishSystem.js'
import AnglerLight from './AnglerLight.js'
import MarineSnow from './MarineSnow.js'
import KelpStrand from './KelpStrand.js'
import CoralCluster from './CoralCluster.js'
import AnemoneField from './AnemoneSystem.js'
import PulseOrb from './PulseOrb.js'
import LightRibbon from './LightRibbon.js'
import VoidParticle from './VoidParticle.js'
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
    rainBrightness: particles.rain?.enabled ? 0.7 : 0.0,
    petalBrightness: particles.petals?.enabled ? 0.8 : 0.0,
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
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

    // ─── Scene (sky + lights from config) ───
    this.sceneSetup = setupScene(this.scene, envConfig)

    // ─── Terrain (per-world geometry + height function) ───
    const terrainResult = createTerrain(this.scene, envConfig)
    this.terrain = terrainResult.mesh
    this.getTerrainHeight = terrainResult.getHeight

    // ─── Camera (wired to per-world terrain height) ───
    this.cameraRig = new CameraRig(this.camera, envConfig.camera, this.getTerrainHeight)
    this._contentSections = []
    this._sectionPositions = SECTION_T_VALUES.map(t => this.cameraRig.curve.getPoint(t))
    this.clock = new THREE.Clock()

    // ─── Stylized ocean (conditional) ───
    this.ocean = null
    if (envConfig.ocean?.enabled) {
      this.ocean = new StylizedOcean(this.scene, envConfig.ocean)
    }

    // ─── Lava point light (conditional — volcanic observatory) ───
    // Warm PointLight rising from crater floor, the only warmth in the scene
    this.lavaLight = null
    if (envConfig.lighting?.lavaLight) {
      const ll = envConfig.lighting.lavaLight
      const lavaColor = new THREE.Color().setRGB(...ll.color)
      this.lavaLight = new THREE.PointLight(lavaColor, ll.intensity ?? 2.0, ll.distance ?? 60)
      this.lavaLight.position.set(...(ll.position ?? [0, -5, -60]))
      this.scene.add(this.lavaLight)
    }

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
      this.grassManager = new GrassChunkManager(this.scene, scaledConfig, this.cloudShadows.texture, this.getTerrainHeight)
    }

    // ─── Cel-shading on grass (conditional — ghibli-painterly) ───
    if (this.grassManager && envConfig.grass?.celShading?.enabled) {
      this.grassManager.setUniform('uCelEnabled', 1.0)
      if (envConfig.grass.celShading.thresholds) {
        const t = envConfig.grass.celShading.thresholds
        this.grassManager.material.uniforms.uCelThresholds.value.set(t[0], t[1], t[2])
      }
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
      this.flowers = new FlowerInstances(this.scene, this.cameraRig, count, this.getTerrainHeight, envConfig.flowers)
    }

    // ─── Crystal formations (conditional — crystal cavern) ───
    this.crystals = null
    if (envConfig.crystals?.enabled) {
      this.crystals = new CrystalFormation(
        this.scene, this.cameraRig, envConfig.crystals, this.getTerrainHeight
      )
    }

    // ─── Glow mushrooms (conditional — crystal cavern) ───
    this.mushrooms = null
    if (envConfig.mushrooms?.enabled) {
      this.mushrooms = new GlowMushroom(
        this.scene, this.cameraRig, envConfig.mushrooms, this.getTerrainHeight
      )
    }

    // ─── Giant anemones (conditional — tide pool) ───
    this.anemones = null
    if (envConfig.anemones?.enabled) {
      this.anemones = new GiantAnemone(this.scene, envConfig, this.getTerrainHeight)
    }

    // ─── Starfish (conditional — tide pool) ───
    this.starfish = null
    if (envConfig.starfish?.enabled) {
      this.starfish = new Starfish(this.scene, envConfig, this.getTerrainHeight)
    }

    // ─── Caustic projector (conditional — tide pool) ───
    this.causticProjector = null
    if (envConfig.caustics?.enabled) {
      this.causticProjector = new CausticProjector(this.scene, {
        ...envConfig.caustics,
        surfaceHeight: envConfig.sky?.surfaceHeight ?? 8.0,
        absorptionRed: envConfig.lighting?.absorptionRed,
        absorptionGreen: envConfig.lighting?.absorptionGreen,
        absorptionBlue: envConfig.lighting?.absorptionBlue,
      })
      // Clone terrain geometry for caustic overlay projection
      if (this.terrain) {
        this.causticProjector.setTerrainGeometry(this.terrain.geometry)
      }
    }

    // ─── Post-processing ───
    this.postProcessing = new PostProcessingStack(
      this.renderer, this.scene, this.camera,
      this.config.postFX,
      envConfig.postFX?.dof ?? {}
    )

    // ─── Atmosphere (keyframes: hand-tuned per world, or auto-generated) ───
    const KEYFRAME_MAP = {
      'golden-meadow': GOLDEN_MEADOW_KEYFRAMES,
      'night-meadow': NIGHT_MEADOW_KEYFRAMES,
      'ocean-cliff': OCEAN_CLIFF_KEYFRAMES,
      'storm-field': STORM_FIELD_KEYFRAMES,
      'ghibli-painterly': GHIBLI_KEYFRAMES,
      'volcanic-observatory': VOLCANIC_OBSERVATORY_KEYFRAMES,
      'floating-library': FLOATING_LIBRARY_KEYFRAMES,
      'crystal-cavern': CRYSTAL_CAVERN_KEYFRAMES,
      'memory-garden': MEMORY_GARDEN_KEYFRAMES,
      'tide-pool': TIDE_POOL_KEYFRAMES,
      'clockwork-forest': CLOCKWORK_FOREST_KEYFRAMES,
      'aurora-tundra': AURORA_TUNDRA_KEYFRAMES,
      'infinite-staircase': INFINITE_STAIRCASE_KEYFRAMES,
      'underwater-cathedral': UNDERWATER_CATHEDRAL_KEYFRAMES,
      'bioluminescent-deep': BIOLUMINESCENT_DEEP_KEYFRAMES,
      'paper-world': PAPER_WORLD_KEYFRAMES,
      'sonic-void': SONIC_VOID_KEYFRAMES,
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
      this.artistFigure = new ArtistFigure(this.scene, this.getTerrainHeight)
      this.artistFigure.loadTexture(mksPortraitUrl)
    }

    // ─── Portals (conditional — golden meadow only for now) ───
    this.portals = null
    if (envConfig.id === 'golden-meadow') {
      this.portals = new PortalHint(this.scene, this.camera, this.getTerrainHeight)
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

    // ─── Rain (conditional — storm field) ───
    this.rain = null
    if (envConfig.particles?.rain?.enabled) {
      this.rain = new RainSystem(this.scene, envConfig.particles.rain)
    }

    // ─── Petals (conditional — ghibli painterly) ───
    this.petals = null
    if (envConfig.particles?.petals?.enabled) {
      this.petals = new PetalSystem(this.scene, envConfig.particles.petals)
    }

    // ─── Snow particles (conditional — aurora tundra) ───
    this.snowParticles = null
    if (envConfig.particles?.snow?.enabled) {
      this.snowParticles = new SnowParticle(this.scene, envConfig.particles.snow)
    }

    // ─── Ice spikes (conditional — aurora tundra) ───
    this.iceSpikes = null
    if (envConfig.iceSpikes?.enabled) {
      this.iceSpikes = new IceSpike(this.scene, this.getTerrainHeight, envConfig.iceSpikes)
    }

    // ─── Aurora curtain (conditional — aurora tundra) ───
    this.auroraCurtain = null
    if (envConfig.aurora?.enabled) {
      this.auroraCurtain = new AuroraCurtain(this.scene, envConfig.aurora)
    }

    // ─── Lightning (conditional — storm field) ───
    this.lightning = null
    if (envConfig.sky?.lightning?.enabled) {
      this.lightning = new LightningSystem(
        this.sceneSetup, this.postProcessing, envConfig.sky.lightning
      )
    }

    // ─── Volumetric clouds (conditional — storm field) ───
    // Winner: volumetric-cumulus-3d-noise (49/70)
    this.volumetricClouds = null
    if (envConfig.sky?.clouds?.type === 'volumetric') {
      this.volumetricClouds = new VolumetricCloudSystem(
        this.renderer, this.camera, envConfig.sky.clouds
      )
    }

    // ─── Dissolving flowers (conditional — memory-garden) ───
    this.dissolvingFlowers = null
    if (envConfig.dissolvingFlowers?.enabled) {
      const count = envConfig.dissolvingFlowers.count ?? 200
      this.dissolvingFlowers = new DissolvingFlower(
        this.scene, this.cameraRig, count, this.getTerrainHeight, envConfig.dissolvingFlowers
      )
    }

    // ─── Wilting grass (conditional — memory-garden) ───
    this.wiltingGrass = null
    if (envConfig.wiltingGrass?.enabled) {
      const count = envConfig.wiltingGrass.count ?? 8000
      this.wiltingGrass = new WiltingGrass(
        this.scene, count, this.getTerrainHeight, envConfig.wiltingGrass
      )
    }

    // ─── Fog wisps (conditional — memory-garden) ───
    this.fogWisps = null
    if (envConfig.fogWisps?.enabled) {
      const count = envConfig.fogWisps.count ?? 30
      this.fogWisps = new FogWisp(this.scene, count, envConfig.fogWisps)
    }

    // ─── Origami grass (conditional — paper world) ───
    this.origamiGrass = null
    if (envConfig.origamiGrass?.enabled) {
      this.origamiGrass = new OrigamiGrass(
        this.scene, envConfig.origamiGrass, this.getTerrainHeight
      )
    }

    // ─── Paper trees (conditional — paper world) ───
    this.paperTrees = null
    if (envConfig.paperTrees?.enabled) {
      this.paperTrees = new PaperTree(
        this.scene, envConfig.paperTrees, this.getTerrainHeight, this.cameraRig
      )
    }

    // ─── Fold lines (conditional — paper world) ───
    this.foldLines = null
    if (envConfig.foldLines?.enabled) {
      this.foldLines = new FoldLine(
        this.scene, envConfig.foldLines, this.getTerrainHeight
      )
    }

    // ─── Floating platforms (conditional — infinite staircase) ───
    this.floatingPlatforms = null
    if (envConfig.floatingPlatforms?.enabled) {
      this.floatingPlatforms = new FloatingPlatform(
        this.scene, envConfig.floatingPlatforms
      )
    }

    // ─── Stair segments (conditional — infinite staircase) ───
    this.stairSegments = null
    if (envConfig.stairSegments?.enabled) {
      const platformPositions = this.floatingPlatforms?.platformPositions ?? []
      this.stairSegments = new StairSegment(
        this.scene, envConfig.stairSegments, platformPositions
      )
    }

    // ─── Portal doors (conditional — infinite staircase) ───
    this.portalDoors = null
    if (envConfig.portalDoors?.enabled) {
      const platformPositions = this.floatingPlatforms?.platformPositions ?? []
      this.portalDoors = new PortalDoor(
        this.scene, envConfig.portalDoors, platformPositions
      )
    }

    // ─── Floating books (conditional — floating library) ───
    this.floatingBooks = null
    if (envConfig.library?.enabled) {
      this.floatingBooks = new FloatingBook(this.scene, envConfig.library)
    }

    // ─── Shelf segments (conditional — floating library) ───
    this.shelfSegments = null
    if (envConfig.library?.enabled) {
      this.shelfSegments = new ShelfSegment(this.scene, envConfig.library)
    }

    // ─── Warm light orbs (conditional — floating library) ───
    this.warmLightOrbs = null
    if (envConfig.warmLightOrbs?.enabled) {
      this.warmLightOrbs = new WarmLightOrb(this.scene, envConfig.warmLightOrbs)
    }

    // ─── Embers (conditional — volcanic observatory) ───
    this.embers = null
    if (envConfig.particles?.embers?.enabled) {
      this.embers = new EmberSystem(this.scene, {
        ...envConfig.particles.embers,
        spawnHeight: envConfig.lava?.lavaLevel ?? -5.0,
        centerZ: envConfig.lighting?.lavaLight?.position?.[2] ?? -60,
      })
    }

    // ─── Lava cracks (conditional — volcanic observatory) ───
    this.lavaCracks = null
    if (envConfig.lavaCracks?.enabled !== false && envConfig.lava?.enabled) {
      this.lavaCracks = new LavaCrack(this.scene, this.getTerrainHeight, {
        ...envConfig.lavaCracks,
        crustColor: envConfig.lava?.crustColor,
        moltenColor: envConfig.lava?.moltenColor,
        glowColor: envConfig.lava?.glowColor,
        centerZ: envConfig.lighting?.lavaLight?.position?.[2] ?? -60,
      })
    }

    // ─── Ash (conditional — volcanic observatory) ───
    this.ash = null
    if (envConfig.particles?.ash?.enabled) {
      this.ash = new AshSystem(this.scene, envConfig.particles.ash)
    }

    // ─── Gear trees (conditional — clockwork forest) ───
    this.gearTrees = null
    if (envConfig.gearTrees?.enabled) {
      this.gearTrees = new GearTree(this.scene, this.cameraRig, this.getTerrainHeight, envConfig.gearTrees)
    }

    // ─── Steam vents (conditional — clockwork forest) ───
    this.steamVents = null
    if (envConfig.particles?.steam?.enabled) {
      this.steamVents = new SteamVent(this.scene, this.getTerrainHeight, envConfig.particles.steam)
    }

    // ─── Copper leaves (conditional — clockwork forest) ───
    this.copperLeaves = null
    if (envConfig.copperLeaves?.enabled) {
      this.copperLeaves = new CopperLeaf(this.scene, this.gearTrees, envConfig.copperLeaves)
    }

    // ─── Jellyfish (conditional — bioluminescent deep) ───
    this.jellyfish = null
    if (envConfig.deepsea?.jellyfish?.enabled) {
      this.jellyfish = new JellyfishSystem(this.scene, envConfig.deepsea.jellyfish)
    }

    // ─── Angler lights (conditional — bioluminescent deep) ───
    this.anglerLights = null
    if (envConfig.deepsea?.anglerfish?.enabled) {
      this.anglerLights = new AnglerLight(this.scene, envConfig.deepsea.anglerfish)
    }

    // ─── Marine snow (conditional — bioluminescent deep) ───
    this.marineSnow = null
    if (envConfig.deepsea?.marinesnow?.enabled) {
      this.marineSnow = new MarineSnow(this.scene, envConfig.deepsea.marinesnow)
    }

    // ─── Pulse orbs (conditional — sonic void) ───
    this.pulseOrbs = null
    if (envConfig.audioGeometry?.bassSpheres?.enabled) {
      this.pulseOrbs = new PulseOrb(this.scene, envConfig.audioGeometry.bassSpheres)
    }

    // ─── Light ribbons (conditional — sonic void) ───
    this.lightRibbons = null
    if (envConfig.audioGeometry?.melodyRibbons?.enabled) {
      this.lightRibbons = new LightRibbon(this.scene, envConfig.audioGeometry.melodyRibbons)
    }

    // ─── Void particles (conditional — sonic void) ───
    this.voidParticles = null
    if (envConfig.particles?.voidMotes?.enabled) {
      this.voidParticles = new VoidParticle(this.scene, envConfig.particles.voidMotes)
    }

    // ─── Cursor interaction (always) ───
    this.cursorInteraction = new CursorInteraction()

    // ─── Audio reactive (always) ───
    this.audioReactive = new AudioReactive()

    // Wire optional subsystems into atmosphere
    this.atmosphere.dustMotes = this.dustMotes
    this.atmosphere.godRayPass = this.godRayPass
    this.atmosphere.starField = this.starField
    this.atmosphere.rain = this.rain
    this.atmosphere.petals = this.petals
    this.atmosphere.ocean = this.ocean
    this.atmosphere.volumetricClouds = this.volumetricClouds
    this.atmosphere.fogWisps = this.fogWisps
    this.atmosphere.snowParticles = this.snowParticles
    this.atmosphere.embers = this.embers
    this.atmosphere.ash = this.ash
    this.atmosphere.lavaCracks = this.lavaCracks
    this.atmosphere.iceSpikes = this.iceSpikes
    this.atmosphere.auroraCurtain = this.auroraCurtain

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
    this.ocean?.update(animElapsed)
    this.grassManager?.update(camPos, animElapsed)
    this.fireflies?.update(animElapsed)
    this.flowers?.update(animElapsed)
    this.crystals?.update(animElapsed)
    this.mushrooms?.update(animElapsed)
    this.anemones?.update(animElapsed)
    this.starfish?.update(animElapsed)
    this.causticProjector?.update(animElapsed)

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
    this.rain?.update(animElapsed)
    this.petals?.update(animElapsed)
    this.snowParticles?.update(animElapsed)
    this.iceSpikes?.update(animElapsed)
    this.auroraCurtain?.update(animElapsed)
    this.lightning?.update(animElapsed, delta)
    this.dissolvingFlowers?.update(animElapsed)
    this.wiltingGrass?.update(animElapsed)
    this.fogWisps?.update(animElapsed)
    this.origamiGrass?.update(animElapsed)
    this.paperTrees?.update(animElapsed)
    this.floatingPlatforms?.update(animElapsed)
    this.stairSegments?.update(animElapsed)
    this.portalDoors?.update(animElapsed)
    this.floatingBooks?.update(animElapsed)
    this.shelfSegments?.update(animElapsed)
    this.warmLightOrbs?.update(animElapsed)
    this.embers?.update(animElapsed)
    this.lavaCracks?.update(animElapsed)
    this.ash?.update(animElapsed)
    this.gearTrees?.update(animElapsed)
    this.steamVents?.update(animElapsed)
    this.copperLeaves?.update(animElapsed)
    this.jellyfish?.update(animElapsed)
    this.anglerLights?.update(animElapsed)
    this.marineSnow?.update(animElapsed)

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

    // Volumetric clouds render to half-res FBO before post-processing composites them
    if (this.volumetricClouds) {
      const cloudTex = this.volumetricClouds.render(elapsed)
      this.postProcessing.setCloudTexture(cloudTex, this.atmosphere.current.cloudIntensity ?? 0)
    }

    this.postProcessing.update(this.scrollEngine.velocity, camPos, this._sectionPositions)

    // Atmosphere-driven DOF overrides auto-focus (Ocean Cliff intimate DOF v3)
    const dofCurrent = this.atmosphere.current
    if (this.postProcessing.dof && dofCurrent.dofFocusDistance > 0) {
      this.postProcessing.dof.effect.cocMaterial.focusDistance = dofCurrent.dofFocusDistance
      this.postProcessing.dof.effect.bokehScale = dofCurrent.dofBokehScale
    }

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
    this.volumetricClouds?.setSize(w, h)
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
      crystals: this.crystals,
      mushrooms: this.mushrooms,
      cloudShadows: this.cloudShadows,
      ocean: this.ocean,
      atmosphere: this.atmosphere,
      musicTrigger: this.musicTrigger,
      scoreSheets: this.scoreSheets,
      artistFigure: this.artistFigure,
      portals: this.portals,
      dustMotes: this.dustMotes,
      godRayPass: this.godRayPass,
      starField: this.starField,
      rain: this.rain,
      petals: this.petals,
      lightning: this.lightning,
      volumetricClouds: this.volumetricClouds,
      dissolvingFlowers: this.dissolvingFlowers,
      wiltingGrass: this.wiltingGrass,
      fogWisps: this.fogWisps,
      origamiGrass: this.origamiGrass,
      paperTrees: this.paperTrees,
      foldLines: this.foldLines,
      floatingPlatforms: this.floatingPlatforms,
      stairSegments: this.stairSegments,
      portalDoors: this.portalDoors,
      floatingBooks: this.floatingBooks,
      shelfSegments: this.shelfSegments,
      warmLightOrbs: this.warmLightOrbs,
      snowParticles: this.snowParticles,
      iceSpikes: this.iceSpikes,
      auroraCurtain: this.auroraCurtain,
      embers: this.embers,
      lavaCracks: this.lavaCracks,
      ash: this.ash,
      gearTrees: this.gearTrees,
      steamVents: this.steamVents,
      copperLeaves: this.copperLeaves,
      anemones: this.anemones,
      starfish: this.starfish,
      causticProjector: this.causticProjector,
      jellyfish: this.jellyfish,
      anglerLights: this.anglerLights,
      marineSnow: this.marineSnow,
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
    this.crystals?.dispose()
    this.mushrooms?.dispose()
    this.postProcessing?.dispose()
    this.musicTrigger?.dispose()
    this.scoreSheets?.dispose()
    this.artistFigure?.dispose()
    this.portals?.dispose()
    this.dustMotes?.dispose()
    this.godRayPass?.dispose()
    this.starField?.dispose()
    this.ocean?.dispose()
    if (this.lavaLight) {
      this.scene.remove(this.lavaLight)
      this.lavaLight.dispose()
    }
    this.rain?.dispose()
    this.petals?.dispose()
    this.snowParticles?.dispose()
    this.iceSpikes?.dispose()
    this.auroraCurtain?.dispose()
    this.lightning?.dispose()
    this.volumetricClouds?.dispose()
    this.dissolvingFlowers?.dispose()
    this.wiltingGrass?.dispose()
    this.fogWisps?.dispose()
    this.origamiGrass?.dispose()
    this.paperTrees?.dispose()
    this.foldLines?.dispose()
    this.floatingPlatforms?.dispose()
    this.stairSegments?.dispose()
    this.portalDoors?.dispose()
    this.floatingBooks?.dispose()
    this.shelfSegments?.dispose()
    this.warmLightOrbs?.dispose()
    this.embers?.dispose()
    this.lavaCracks?.dispose()
    this.ash?.dispose()
    this.gearTrees?.dispose()
    this.steamVents?.dispose()
    this.copperLeaves?.dispose()
    this.anemones?.dispose()
    this.starfish?.dispose()
    this.causticProjector?.dispose()
    this.jellyfish?.dispose()
    this.anglerLights?.dispose()
    this.marineSnow?.dispose()
    this.audioReactive?.dispose()
    this.cursorInteraction?.dispose()
    this.cameraRig?.dispose()
    this.cloudShadows?.dispose()
    this.renderer.dispose()
  }
}
