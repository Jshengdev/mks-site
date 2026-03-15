// src/meadow/AtmosphereController.js
import * as THREE from 'three'

// Smoothstep for eased transitions between zones
function smoothstep(t) {
  t = Math.max(0, Math.min(1, t))
  return t * t * (3 - 2 * t)
}

function lerpScalar(a, b, t) {
  return a + (b - a) * t
}

function lerpArrayInto(out, a, b, t) {
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i] + (b[i] - a[i]) * t
  }
  return out
}

// ─── 5 Keyframe States ───
// Each keyframe defines EVERY atmospheric parameter at a scroll position.
// Values are interpolated between adjacent keyframes via smoothstep.
// Story arc: "Cold world, warm moments. Warmth is the reward for engagement."
// The Hidden Sun: artist is the sun, music is the light, world is what light transforms.
// Sun azimuth rotates toward artist figure (z=-145) at DEEPENING = "light source revealed"
const KEYFRAMES = [
  {
    t: 0.0, // STILLNESS — cold world, sacred anticipation, held breath
    starBrightness: 0.0,   // no stars in golden meadow
    sunElevation: 2,       // slightly above horizon — hints of color
    sunAzimuth: 250,       // far from artist direction
    turbidity: 12,         // slightly cleaner for more color in sky
    rayleigh: 3.0,         // stronger scattering = richer blue
    mieCoefficient: 0.015, // more glow around sun
    mieDirectionalG: 0.95,
    fogColor: [0.12, 0.18, 0.28],  // steel-teal fog — the cold world
    fogDensity: 0.018,     // thick — everything hidden
    sunLightColor: [0.45, 0.50, 0.65],  // cool blue-steel moonlight
    sunLightIntensity: 0.25,
    ambientIntensity: 0.04,  // barely lit — "darkness is atmosphere"
    grassBaseColor: [0.01, 0.03, 0.03],  // near-black teal
    grassTipColor: [0.03, 0.08, 0.07],
    grassWindSpeed: 0.1,    // frozen — a held breath
    grassAmbientStrength: 0.15,
    grassTranslucency: 0.3,
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.02,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.1,
    bloomThreshold: 0.9,
    fogDepthStrength: 0.05,
    fogMidColor: [0.25, 0.30, 0.45],
    fogFarColor: [0.12, 0.15, 0.25],
    colorGradeContrast: 0.03,
    colorGradeVibrance: 0.1,  // desaturated cold world
    colorGradeWarmth: 0.0,     // zero warmth — earned later
    vignetteDarkness: 0.85,
    grainOpacity: 0.06,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
  },
  {
    t: 0.25, // AWAKENING — first warmth, light finds a crack
    starBrightness: 0.0,
    sunElevation: 6,
    sunAzimuth: 245,       // starting to shift toward artist
    turbidity: 13,
    rayleigh: 2.0,
    mieCoefficient: 0.010,
    mieDirectionalG: 0.93,
    fogColor: [0.40, 0.38, 0.38],  // cold warming to neutral
    fogDensity: 0.008,
    sunLightColor: [0.75, 0.72, 0.65],  // first hint of warmth
    sunLightIntensity: 0.8,
    ambientIntensity: 0.10,
    grassBaseColor: [0.03, 0.10, 0.03],
    grassTipColor: [0.12, 0.30, 0.08],
    grassWindSpeed: 0.7,    // gentle stir
    grassAmbientStrength: 0.28,
    grassTranslucency: 1.2,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.08,
    cloudDriftSpeed: 0.00004,
    fireflyBrightness: 0.0,
    fireflySize: 40,
    bloomIntensity: 0.3,
    bloomThreshold: 0.75,
    fogDepthStrength: 0.04,
    fogMidColor: [0.65, 0.58, 0.48],
    fogFarColor: [0.40, 0.38, 0.42],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.35,
    colorGradeWarmth: 0.02,
    vignetteDarkness: 0.60,
    grainOpacity: 0.04,
    dustMoteBrightness: 0.2,
    godRayIntensity: 0.15,
    kuwaharaStrength: 0.0,
  },
  {
    t: 0.50, // ALIVE — golden hour arrives, the music is playing
    starBrightness: 0.0,
    sunElevation: 12,
    sunAzimuth: 235,       // rotating toward artist
    turbidity: 8,          // cleaner sky = more saturated golden hour
    rayleigh: 1.2,
    mieCoefficient: 0.012, // stronger sun halo
    mieDirectionalG: 0.92, // tighter, more dramatic sun glow
    fogColor: [0.85, 0.75, 0.50],  // golden haze
    fogDensity: 0.003,
    sunLightColor: [1.0, 0.90, 0.70],  // warm golden — earned
    sunLightIntensity: 1.6,
    ambientIntensity: 0.16,
    grassBaseColor: [0.06, 0.20, 0.03],
    grassTipColor: [0.25, 0.55, 0.12],  // vivid green-gold
    grassWindSpeed: 1.5,
    grassAmbientStrength: 0.38,
    grassTranslucency: 2.2,  // strong backlit glow
    grassFogFade: 0.0012,
    cloudShadowOpacity: 0.18,
    cloudDriftSpeed: 0.00006,
    fireflyBrightness: 0.6,
    fireflySize: 75,
    bloomIntensity: 0.65,
    bloomThreshold: 0.55,
    fogDepthStrength: 0.06,
    fogMidColor: [1.0, 0.85, 0.50],
    fogFarColor: [0.60, 0.55, 0.55],
    colorGradeContrast: 0.10,
    colorGradeVibrance: 0.7,
    colorGradeWarmth: 0.06,
    vignetteDarkness: 0.35,
    grainOpacity: 0.03,
    dustMoteBrightness: 0.9,
    godRayIntensity: 0.5,
    kuwaharaStrength: 0.0,
  },
  {
    t: 0.75, // DEEPENING — The Hidden Sun revealed, peak emotional climax
    // "A source of light hidden behind something massive, whose rays fan out"
    starBrightness: 0.0,
    sunElevation: 3,       // sun dropping = long shadows, dramatic rays
    sunAzimuth: 200,       // rotated behind artist figure (z=-145, x=2)
    turbidity: 12,         // slightly cleaner for richer colors
    rayleigh: 2.5,
    mieCoefficient: 0.020, // max Mie = dramatic amber haze
    mieDirectionalG: 0.96,
    fogColor: [0.95, 0.68, 0.30],  // deep amber — "the threshold"
    fogDensity: 0.005,
    sunLightColor: [1.0, 0.78, 0.45],  // deep amber-gold
    sunLightIntensity: 2.2,  // blazing peak warmth
    ambientIntensity: 0.10,
    grassBaseColor: [0.10, 0.12, 0.02],
    grassTipColor: [0.40, 0.45, 0.10],  // amber-gold tips
    grassWindSpeed: 2.2,    // wind crescendo
    grassAmbientStrength: 0.25,
    grassTranslucency: 3.0,  // max backlit glow — "the music IS the light"
    grassFogFade: 0.001,
    cloudShadowOpacity: 0.10,
    cloudDriftSpeed: 0.00008,
    fireflyBrightness: 1.0,
    fireflySize: 100,        // golden sparks everywhere
    bloomIntensity: 1.0,     // peak bloom — light overflowing
    bloomThreshold: 0.4,
    fogDepthStrength: 0.10,
    fogMidColor: [1.0, 0.75, 0.35],
    fogFarColor: [0.70, 0.50, 0.30],
    colorGradeContrast: 0.14,
    colorGradeVibrance: 0.9,
    colorGradeWarmth: 0.10,
    vignetteDarkness: 0.30,   // opens up — expansive
    grainOpacity: 0.02,
    dustMoteBrightness: 1.0,
    godRayIntensity: 1.0,     // max — "rays fan out and touch everything"
    kuwaharaStrength: 0.35,   // painterly glow at emotional peak
  },
  {
    t: 1.0, // QUIETING — dusk haze, the aftermath, exhale
    starBrightness: 0.0,
    sunElevation: 8,
    sunAzimuth: 220,       // settling
    turbidity: 11,
    rayleigh: 1.6,
    mieCoefficient: 0.009,
    mieDirectionalG: 0.92,
    fogColor: [0.55, 0.52, 0.50],  // neutral dusk
    fogDensity: 0.006,     // fog returning — dissolution
    sunLightColor: [0.88, 0.82, 0.72],
    sunLightIntensity: 1.0,
    ambientIntensity: 0.14,
    grassBaseColor: [0.04, 0.14, 0.04],
    grassTipColor: [0.18, 0.40, 0.12],
    grassWindSpeed: 0.5,    // wind settling — exhale
    grassAmbientStrength: 0.35,
    grassTranslucency: 1.5,
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.08,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.4,  // fireflies linger
    fireflySize: 60,
    bloomIntensity: 0.35,
    bloomThreshold: 0.70,
    fogDepthStrength: 0.06,
    fogMidColor: [0.70, 0.65, 0.55],
    fogFarColor: [0.45, 0.42, 0.45],
    colorGradeContrast: 0.07,
    colorGradeVibrance: 0.4,
    colorGradeWarmth: 0.03,
    vignetteDarkness: 0.55,
    grainOpacity: 0.04,
    dustMoteBrightness: 0.3,
    godRayIntensity: 0.2,
    kuwaharaStrength: 0.0,
  },
]

// All scalar/array param keys (exclude 't')
const PARAM_KEYS = Object.keys(KEYFRAMES[0]).filter(k => k !== 't')
const ARRAY_KEYS = new Set(
  PARAM_KEYS.filter(k => Array.isArray(KEYFRAMES[0][k]))
)

export { KEYFRAMES as MEADOW_KEYFRAMES }

export default class AtmosphereController {
  constructor(sceneSetup, grassManager, fireflies, cloudShadows, postProcessing, keyframes = null) {
    this.sceneSetup = sceneSetup
    this.grassManager = grassManager ?? null
    this.fireflies = fireflies ?? null
    this.cloudShadows = cloudShadows ?? null
    this.postProcessing = postProcessing
    // Optional subsystems — set after construction by engine
    this.dustMotes = null
    this.godRayPass = null
    this.starField = null
    // Pause flag — when true, update() is a no-op (DevTuner freeze mode)
    this.paused = false
    this.keyframes = keyframes ?? KEYFRAMES
    this.current = {}

    // Initialize current to first keyframe
    for (const key of PARAM_KEYS) {
      const val = KEYFRAMES[0][key]
      this.current[key] = Array.isArray(val) ? [...val] : val
    }

    // Reusable THREE objects for sun position calc
    this._sunPos = new THREE.Vector3()

    // Direct references (no per-frame scene traversal)
    this._ambientLight = this.sceneSetup.ambientLight ?? null
    this._scene = this.sceneSetup.sky?.parent
  }

  update(scrollProgress) {
    // Find bracketing keyframes
    const kf = this.keyframes
    let prevIdx = 0
    for (let i = 0; i < kf.length - 1; i++) {
      if (scrollProgress >= kf[i].t) prevIdx = i
    }
    const nextIdx = Math.min(prevIdx + 1, kf.length - 1)
    const prev = kf[prevIdx]
    const next = kf[nextIdx]

    // Local t within this segment (0-1), eased
    const range = next.t - prev.t
    const localT = range > 0 ? (scrollProgress - prev.t) / range : 0
    const eased = smoothstep(localT)

    // Interpolate all params (array values written in-place to avoid allocations)
    for (const key of PARAM_KEYS) {
      if (ARRAY_KEYS.has(key)) {
        lerpArrayInto(this.current[key], prev[key], next[key], eased)
      } else {
        this.current[key] = lerpScalar(prev[key], next[key], eased)
      }
    }

    this._pushToSubsystems()
  }

  _pushToSubsystems() {
    const c = this.current

    // ─── Sky (Preetham) ───
    const sky = this.sceneSetup.sky
    const skyU = sky.material.uniforms
    skyU['turbidity'].value = c.turbidity
    skyU['rayleigh'].value = c.rayleigh
    skyU['mieCoefficient'].value = c.mieCoefficient
    skyU['mieDirectionalG'].value = c.mieDirectionalG

    // Sun position from elevation + azimuth
    const phi = THREE.MathUtils.degToRad(90 - c.sunElevation)
    const theta = THREE.MathUtils.degToRad(c.sunAzimuth)
    this._sunPos.setFromSphericalCoords(1, phi, theta)
    skyU['sunPosition'].value.copy(this._sunPos)

    // ─── Sun light ───
    const sunLight = this.sceneSetup.sunLight
    sunLight.color.setRGB(...c.sunLightColor)
    sunLight.intensity = c.sunLightIntensity
    sunLight.position.copy(this._sunPos).multiplyScalar(100)

    // ─── Ambient light ───
    if (this._ambientLight) {
      this._ambientLight.intensity = c.ambientIntensity
    }

    // ─── Scene fog ───
    if (this._scene?.fog) {
      this._scene.fog.color.setRGB(...c.fogColor)
      this._scene.fog.density = c.fogDensity
    }

    // ─── Grass (uses setUniform to propagate to base + all chunk clones) ───
    if (this.grassManager) {
      const gm = this.grassManager
      gm.material.uniforms.uBaseColor.value.setRGB(...c.grassBaseColor)
      gm.material.uniforms.uTipColor.value.setRGB(...c.grassTipColor)
      gm.setUniform('uBaseColor', gm.material.uniforms.uBaseColor.value)
      gm.setUniform('uTipColor', gm.material.uniforms.uTipColor.value)
      gm.setUniform('uSpeed', c.grassWindSpeed)
      gm.setUniform('uAmbientStrength', c.grassAmbientStrength)
      gm.setUniform('uTranslucencyStrength', c.grassTranslucency)
      gm.setUniform('uFogFade', c.grassFogFade)
    }

    // ─── Cloud shadows ───
    if (this.cloudShadows) {
      this.cloudShadows.material.opacity = c.cloudShadowOpacity
      this.cloudShadows._driftSpeed = c.cloudDriftSpeed
    }

    // ─── Fireflies ───
    if (this.fireflies) {
      this.fireflies.material.uniforms.uSize.value = c.fireflySize
      this.fireflies.material.uniforms.uBrightness.value = c.fireflyBrightness
      this.fireflies.points.visible = c.fireflyBrightness > 0.01
    }

    // ─── Post-processing ───
    const pp = this.postProcessing
    pp.bloom.intensity = c.bloomIntensity
    pp.bloom.luminancePass.fullscreenMaterial.threshold = c.bloomThreshold
    pp.vignette.darkness = c.vignetteDarkness
    // FilmGrainEffect uses uGrainIntensity uniform (not blendMode opacity)
    pp.grain.uniforms.get('uGrainIntensity').value = c.grainOpacity

    // Fog depth effect
    const fogU = pp.fogDepth.effect.uniforms
    fogU.get('uFogStrength').value = c.fogDepthStrength
    fogU.get('uMidColor').value.set(...c.fogMidColor)
    fogU.get('uFarColor').value.set(...c.fogFarColor)

    // Color grade effect
    const cgU = pp.colorGrade.effect.uniforms
    cgU.get('uContrast').value = c.colorGradeContrast
    cgU.get('uVibrance').value = c.colorGradeVibrance
    cgU.get('uSplitIntensity').value = c.colorGradeWarmth

    // ─── Dust motes ───
    if (this.dustMotes) {
      this.dustMotes.material.uniforms.uBrightness.value = c.dustMoteBrightness
      this.dustMotes.points.visible = c.dustMoteBrightness > 0.01
    }

    // ─── God rays ───
    if (this.godRayPass) {
      this.godRayPass.intensity = c.godRayIntensity
      this.godRayPass.updateSunPosition(this._sunPos)
    }

    // ─── Kuwahara painterly (activates at emotional peak) ───
    if (pp.kuwahara) {
      pp.kuwahara.uniforms.get('uStrength').value = c.kuwaharaStrength
    }

    // ─── Stars (night/dusk skies) ───
    if (this.starField && c.starBrightness !== undefined) {
      this.starField.setBrightness(c.starBrightness)
    }

  }

  // Expose for DevTuner
  getKeyframes() { return this.keyframes }
  getCurrent() { return { ...this.current } }
}
