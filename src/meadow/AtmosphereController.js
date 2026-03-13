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

function lerpArray(a, b, t) {
  return a.map((v, i) => v + (b[i] - v) * t)
}

// ─── 5 Keyframe States ───
// Each keyframe defines EVERY atmospheric parameter at a scroll position.
// Values are interpolated between adjacent keyframes via smoothstep.
const KEYFRAMES = [
  {
    t: 0.0, // STILLNESS — sacred anticipation
    sunElevation: 2,
    sunAzimuth: 240,
    turbidity: 14,
    rayleigh: 2.0,
    mieCoefficient: 0.01,
    mieDirectionalG: 0.95,
    fogColor: [0.25, 0.25, 0.35],
    fogDensity: 0.012,
    sunLightColor: [0.7, 0.7, 0.8],
    sunLightIntensity: 0.5,
    ambientIntensity: 0.08,
    grassBaseColor: [0.02, 0.08, 0.02],
    grassTipColor: [0.08, 0.18, 0.06],
    grassWindSpeed: 0.3,
    grassAmbientStrength: 0.25,
    grassTranslucency: 1.0,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.05,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.0,
    fireflySize: 40,
    bloomIntensity: 0.2,
    bloomThreshold: 0.8,
    fogDepthStrength: 0.03,
    fogMidColor: [0.6, 0.6, 0.7],
    fogFarColor: [0.4, 0.4, 0.5],
    colorGradeContrast: 0.18,
    colorGradeVibrance: 0.8,
    colorGradeWarmth: 0.08,
    vignetteDarkness: 0.7,
    grainOpacity: 0.04,
  },
  {
    t: 0.25, // AWAKENING — light arriving
    sunElevation: 8,
    sunAzimuth: 240,
    turbidity: 12,
    rayleigh: 1.8,
    mieCoefficient: 0.009,
    mieDirectionalG: 0.92,
    fogColor: [0.55, 0.50, 0.45],
    fogDensity: 0.005,
    sunLightColor: [0.85, 0.82, 0.75],
    sunLightIntensity: 1.0,
    ambientIntensity: 0.12,
    grassBaseColor: [0.04, 0.15, 0.02],
    grassTipColor: [0.18, 0.40, 0.08],
    grassWindSpeed: 1.0,
    grassAmbientStrength: 0.30,
    grassTranslucency: 1.5,
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.10,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.0,
    fireflySize: 50,
    bloomIntensity: 0.4,
    bloomThreshold: 0.7,
    fogDepthStrength: 0.05,
    fogMidColor: [0.8, 0.72, 0.55],
    fogFarColor: [0.5, 0.5, 0.55],
    colorGradeContrast: 0.20,
    colorGradeVibrance: 1.2,
    colorGradeWarmth: 0.10,
    vignetteDarkness: 0.55,
    grainOpacity: 0.035,
  },
  {
    t: 0.50, // ALIVE — peak beauty, golden hour
    sunElevation: 12,
    sunAzimuth: 240,
    turbidity: 10,
    rayleigh: 1.5,
    mieCoefficient: 0.008,
    mieDirectionalG: 0.9,
    fogColor: [0.85, 0.78, 0.55],
    fogDensity: 0.003,
    sunLightColor: [1.0, 0.92, 0.75],
    sunLightIntensity: 1.5,
    ambientIntensity: 0.15,
    grassBaseColor: [0.05, 0.18, 0.02],
    grassTipColor: [0.22, 0.50, 0.10],
    grassWindSpeed: 1.5,
    grassAmbientStrength: 0.35,
    grassTranslucency: 2.0,
    grassFogFade: 0.0015,
    cloudShadowOpacity: 0.15,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.5,
    fireflySize: 70,
    bloomIntensity: 0.6,
    bloomThreshold: 0.6,
    fogDepthStrength: 0.06,
    fogMidColor: [1.0, 0.88, 0.55],
    fogFarColor: [0.55, 0.55, 0.65],
    colorGradeContrast: 0.22,
    colorGradeVibrance: 1.6,
    colorGradeWarmth: 0.14,
    vignetteDarkness: 0.4,
    grainOpacity: 0.03,
  },
  {
    t: 0.75, // DEEPENING — peak emotional intensity
    sunElevation: 6,
    sunAzimuth: 240,
    turbidity: 12,
    rayleigh: 1.8,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.95,
    fogColor: [0.92, 0.72, 0.40],
    fogDensity: 0.004,
    sunLightColor: [1.0, 0.85, 0.60],
    sunLightIntensity: 1.8,
    ambientIntensity: 0.12,
    grassBaseColor: [0.08, 0.15, 0.02],
    grassTipColor: [0.35, 0.50, 0.12],
    grassWindSpeed: 2.0,
    grassAmbientStrength: 0.30,
    grassTranslucency: 2.5,
    grassFogFade: 0.0012,
    cloudShadowOpacity: 0.12,
    cloudDriftSpeed: 0.00007,
    fireflyBrightness: 1.0,
    fireflySize: 90,
    bloomIntensity: 0.85,
    bloomThreshold: 0.5,
    fogDepthStrength: 0.08,
    fogMidColor: [1.0, 0.80, 0.45],
    fogFarColor: [0.65, 0.55, 0.50],
    colorGradeContrast: 0.25,
    colorGradeVibrance: 1.8,
    colorGradeWarmth: 0.18,
    vignetteDarkness: 0.35,
    grainOpacity: 0.025,
  },
  {
    t: 1.0, // QUIETING — resolution
    sunElevation: 10,
    sunAzimuth: 240,
    turbidity: 10,
    rayleigh: 1.5,
    mieCoefficient: 0.008,
    mieDirectionalG: 0.9,
    fogColor: [0.65, 0.62, 0.58],
    fogDensity: 0.004,
    sunLightColor: [0.95, 0.90, 0.80],
    sunLightIntensity: 1.2,
    ambientIntensity: 0.15,
    grassBaseColor: [0.04, 0.16, 0.03],
    grassTipColor: [0.20, 0.45, 0.12],
    grassWindSpeed: 0.8,
    grassAmbientStrength: 0.35,
    grassTranslucency: 1.5,
    grassFogFade: 0.0018,
    cloudShadowOpacity: 0.10,
    cloudDriftSpeed: 0.00004,
    fireflyBrightness: 0.3,
    fireflySize: 60,
    bloomIntensity: 0.4,
    bloomThreshold: 0.65,
    fogDepthStrength: 0.05,
    fogMidColor: [0.80, 0.75, 0.60],
    fogFarColor: [0.55, 0.55, 0.60],
    colorGradeContrast: 0.20,
    colorGradeVibrance: 1.3,
    colorGradeWarmth: 0.12,
    vignetteDarkness: 0.5,
    grainOpacity: 0.035,
  },
]

// All scalar/array param keys (exclude 't')
const PARAM_KEYS = Object.keys(KEYFRAMES[0]).filter(k => k !== 't')
const ARRAY_KEYS = new Set(
  PARAM_KEYS.filter(k => Array.isArray(KEYFRAMES[0][k]))
)

export default class AtmosphereController {
  constructor(sceneSetup, grassManager, fireflies, cloudShadows, postProcessing) {
    this.sceneSetup = sceneSetup
    this.grassManager = grassManager
    this.fireflies = fireflies
    this.cloudShadows = cloudShadows
    this.postProcessing = postProcessing
    this.keyframes = KEYFRAMES
    this.current = {}

    // Initialize current to first keyframe
    for (const key of PARAM_KEYS) {
      const val = KEYFRAMES[0][key]
      this.current[key] = Array.isArray(val) ? [...val] : val
    }

    // Reusable THREE objects for sun position calc
    this._sunPos = new THREE.Vector3()
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
    const eased = smoothstep(Math.max(0, Math.min(1, localT)))

    // Interpolate all params
    for (const key of PARAM_KEYS) {
      if (ARRAY_KEYS.has(key)) {
        this.current[key] = lerpArray(prev[key], next[key], eased)
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

    // ─── Ambient light (find it on scene) ───
    const scene = sky.parent
    if (scene) {
      for (const child of scene.children) {
        if (child.isAmbientLight) {
          child.intensity = c.ambientIntensity
          break
        }
      }
    }

    // ─── Scene fog ───
    if (scene && scene.fog) {
      scene.fog.color.setRGB(...c.fogColor)
      scene.fog.density = c.fogDensity
    }

    // ─── Grass (iterate all chunk materials) ───
    for (const [, chunk] of this.grassManager.chunks) {
      const u = chunk.material.uniforms
      u.uBaseColor.value.setRGB(...c.grassBaseColor)
      u.uTipColor.value.setRGB(...c.grassTipColor)
      u.uSpeed.value = c.grassWindSpeed
      u.uAmbientStrength.value = c.grassAmbientStrength
      u.uTranslucencyStrength.value = c.grassTranslucency
      u.uFogFade.value = c.grassFogFade
    }
    // Also update the base material template (for newly created chunks)
    const baseMat = this.grassManager.material
    baseMat.uniforms.uBaseColor.value.setRGB(...c.grassBaseColor)
    baseMat.uniforms.uTipColor.value.setRGB(...c.grassTipColor)
    baseMat.uniforms.uSpeed.value = c.grassWindSpeed
    baseMat.uniforms.uAmbientStrength.value = c.grassAmbientStrength
    baseMat.uniforms.uTranslucencyStrength.value = c.grassTranslucency
    baseMat.uniforms.uFogFade.value = c.grassFogFade

    // ─── Cloud shadows ───
    this.cloudShadows.material.opacity = c.cloudShadowOpacity
    this.cloudShadows._driftSpeed = c.cloudDriftSpeed

    // ─── Fireflies ───
    this.fireflies.material.uniforms.uSize.value = c.fireflySize
    this.fireflies.material.uniforms.uBrightness.value = c.fireflyBrightness
    this.fireflies.points.visible = c.fireflyBrightness > 0.01

    // ─── Post-processing ───
    const pp = this.postProcessing
    pp.bloom.intensity = c.bloomIntensity
    pp.bloom.luminancePass.fullscreenMaterial.threshold = c.bloomThreshold
    pp.vignette.darkness = c.vignetteDarkness
    pp.grain.blendMode.opacity.value = c.grainOpacity

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
  }

  // Expose for DevTuner
  getKeyframes() { return this.keyframes }
  getCurrent() { return { ...this.current } }
}
