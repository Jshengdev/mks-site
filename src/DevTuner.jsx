// DevTuner — Live parameter tuning panel for MeadowEngine
// Toggle with ` (backtick) key. Lock values, export to JSON.
import { useState, useEffect, useCallback, useRef } from 'react'
import * as THREE from 'three'
import './DevTuner.css'

// Parameter definitions grouped by subsystem
// Each param: { key, label, min, max, step, get, set }
function buildParamGroups(api) {
  if (!api) return []

  const { renderer, scene, sceneSetup, postProcessing, grassManager, fireflies, cloudShadows, cameraRig, scrollEngine, godRayPass, dustMotes, scoreSheets } = api
  const sky = sceneSetup?.sky
  const sunLight = sceneSetup?.sunLight
  const fogDepth = postProcessing.fogDepth
  const colorGrade = postProcessing.colorGrade
  const ssao = postProcessing.ssao
  const dof = postProcessing.dof

  return [
    {
      id: 'navigation',
      title: 'Navigation',
      badge: 'live',
      params: [
        {
          key: 'scrollPosition', label: 'Scroll Position',
          min: 0, max: 1, step: 0.001,
          get: () => scrollEngine.progress,
          set: v => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight
            scrollEngine.lenis.scrollTo(v * totalHeight, { immediate: true })
          },
        },
      ],
    },
    {
      id: 'renderer',
      title: 'Renderer',
      badge: 'live',
      params: [
        {
          key: 'toneMappingExposure', label: 'Exposure',
          min: 0.1, max: 3, step: 0.05,
          get: () => colorGrade?.uniforms.get('uExposure')?.value ?? 1,
          set: v => { if (colorGrade) colorGrade.uniforms.get('uExposure').value = v },
        },
      ],
    },
    {
      id: 'sky',
      title: 'Sky & Lighting',
      badge: 'live',
      params: [
        {
          key: 'turbidity', label: 'Turbidity',
          min: 0, max: 20, step: 0.5,
          get: () => sky?.material.uniforms.turbidity.value,
          set: v => { if (sky) sky.material.uniforms.turbidity.value = v },
        },
        {
          key: 'rayleigh', label: 'Rayleigh',
          min: 0, max: 6, step: 0.1,
          get: () => sky?.material.uniforms.rayleigh.value,
          set: v => { if (sky) sky.material.uniforms.rayleigh.value = v },
        },
        {
          key: 'mieCoefficient', label: 'Mie Coefficient',
          min: 0, max: 0.05, step: 0.001,
          get: () => sky?.material.uniforms.mieCoefficient.value,
          set: v => { if (sky) sky.material.uniforms.mieCoefficient.value = v },
        },
        {
          key: 'mieDirectionalG', label: 'Mie Directional',
          min: 0, max: 1, step: 0.01,
          get: () => sky?.material.uniforms.mieDirectionalG.value,
          set: v => { if (sky) sky.material.uniforms.mieDirectionalG.value = v },
        },
        {
          key: 'sunElevation', label: 'Sun Elevation',
          min: 0, max: 60, step: 1,
          get: () => {
            const sp = sky?.material.uniforms.sunPosition.value
            if (!sp) return 12
            return 90 - THREE.MathUtils.radToDeg(Math.acos(sp.y / sp.length()))
          },
          set: v => {
            if (!sky || !sunLight) return
            const phi = THREE.MathUtils.degToRad(90 - v)
            const theta = THREE.MathUtils.degToRad(240)
            const sp = new THREE.Vector3()
            sp.setFromSphericalCoords(1, phi, theta)
            sky.material.uniforms.sunPosition.value.copy(sp)
            sunLight.position.copy(sp).multiplyScalar(100)
          },
        },
        {
          key: 'sunIntensity', label: 'Sun Intensity',
          min: 0, max: 5, step: 0.1,
          get: () => sunLight?.intensity,
          set: v => { if (sunLight) sunLight.intensity = v },
        },
        {
          key: 'ambientIntensity', label: 'Ambient Intensity',
          min: 0, max: 2, step: 0.05,
          get: () => sceneSetup?.ambientLight?.intensity ?? 0.3,
          set: v => { if (sceneSetup?.ambientLight) sceneSetup.ambientLight.intensity = v },
        },
      ],
    },
    {
      id: 'fog',
      title: 'Fog',
      badge: 'live',
      params: [
        {
          key: 'fogDensity', label: 'Density',
          min: 0, max: 0.05, step: 0.001,
          get: () => scene.fog?.density,
          set: v => { if (scene.fog) scene.fog.density = v },
        },
        {
          key: 'fogColor', label: 'Color', type: 'color',
          get: () => scene.fog ? '#' + scene.fog.color.getHexString() : '#bdc4e8',
          set: v => { if (scene.fog) scene.fog.color.set(v) },
        },
      ],
    },
    {
      id: 'postfx',
      title: 'Post-Processing',
      badge: 'live',
      params: [
        {
          key: 'bloomIntensity', label: 'Bloom Intensity',
          min: 0, max: 3, step: 0.05,
          get: () => postProcessing.bloom?.intensity,
          set: v => { if (postProcessing.bloom) postProcessing.bloom.intensity = v },
        },
        {
          key: 'bloomThreshold', label: 'Bloom Threshold',
          min: 0, max: 1, step: 0.05,
          get: () => postProcessing.bloom?.luminanceMaterial?.threshold,
          set: v => { if (postProcessing.bloom?.luminanceMaterial) postProcessing.bloom.luminanceMaterial.threshold = v },
        },
        {
          key: 'bloomSmoothing', label: 'Bloom Smoothing',
          min: 0, max: 1, step: 0.05,
          get: () => postProcessing.bloom?.luminanceMaterial?.smoothing,
          set: v => { if (postProcessing.bloom?.luminanceMaterial) postProcessing.bloom.luminanceMaterial.smoothing = v },
        },
        {
          key: 'caDistortion', label: 'Radial CA',
          min: 0, max: 2.0, step: 0.05,
          get: () => postProcessing.ca?.uniforms?.get('uDistortion')?.value,
          set: v => { if (postProcessing.ca) postProcessing.ca.uniforms.get('uDistortion').value = v },
        },
        {
          key: 'vignetteDarkness', label: 'Vignette Darkness',
          min: 0, max: 1, step: 0.05,
          get: () => postProcessing.vignette?.darkness,
          set: v => { if (postProcessing.vignette) postProcessing.vignette.darkness = v },
        },
        {
          key: 'vignetteOffset', label: 'Vignette Offset',
          min: 0, max: 1, step: 0.05,
          get: () => postProcessing.vignette?.offset,
          set: v => { if (postProcessing.vignette) postProcessing.vignette.offset = v },
        },
        {
          key: 'grainIntensity', label: 'Film Grain',
          min: 0, max: 0.2, step: 0.005,
          get: () => postProcessing.grain?.uniforms?.get('uGrainIntensity')?.value,
          set: v => { if (postProcessing.grain) postProcessing.grain.uniforms.get('uGrainIntensity').value = v },
        },
      ],
    },
    {
      id: 'grass',
      title: 'Grass',
      badge: 'live',
      params: [
        {
          key: 'grassWindSpeed', label: 'Wind Speed',
          min: 0, max: 5, step: 0.1,
          get: () => grassManager.material.uniforms.uSpeed.value,
          set: v => grassManager.setUniform('uSpeed', v),
        },
        {
          key: 'grassBladeWidth', label: 'Blade Width',
          min: 0.01, max: 0.2, step: 0.005,
          get: () => grassManager.material.uniforms.uHalfWidth.value,
          set: v => grassManager.setUniform('uHalfWidth', v),
        },
        {
          key: 'grassAmbient', label: 'Ambient Strength',
          min: 0, max: 2, step: 0.05,
          get: () => grassManager.material.uniforms.uAmbientStrength.value,
          set: v => grassManager.setUniform('uAmbientStrength', v),
        },
        {
          key: 'grassTranslucency', label: 'Translucency',
          min: 0, max: 4, step: 0.1,
          get: () => grassManager.material.uniforms.uTranslucencyStrength.value,
          set: v => grassManager.setUniform('uTranslucencyStrength', v),
        },
        {
          key: 'grassFogFade', label: 'Fog Fade',
          min: 0, max: 0.02, step: 0.0005,
          get: () => grassManager.material.uniforms.uFogFade.value,
          set: v => grassManager.setUniform('uFogFade', v),
        },
        {
          key: 'grassBaseColor', label: 'Base Color', type: 'color',
          get: () => '#' + grassManager.material.uniforms.uBaseColor.value.getHexString(),
          set: v => grassManager.setUniform('uBaseColor', new THREE.Color(v)),
        },
        {
          key: 'grassTipColor', label: 'Tip Color', type: 'color',
          get: () => '#' + grassManager.material.uniforms.uTipColor.value.getHexString(),
          set: v => grassManager.setUniform('uTipColor', new THREE.Color(v)),
        },
      ],
    },
    {
      id: 'fireflies',
      title: 'Fireflies',
      badge: 'live',
      params: [
        {
          key: 'fireflyBrightness', label: 'Brightness',
          min: 0, max: 2, step: 0.05,
          get: () => fireflies.material.uniforms.uBrightness.value,
          set: v => {
            fireflies.material.uniforms.uBrightness.value = v
            fireflies.points.visible = v > 0.01
          },
        },
        {
          key: 'fireflySize', label: 'Size',
          min: 10, max: 300, step: 5,
          get: () => fireflies.material.uniforms.uSize.value,
          set: v => { fireflies.material.uniforms.uSize.value = v },
        },
      ],
    },
    {
      id: 'clouds',
      title: 'Cloud Shadows',
      badge: 'live',
      params: [
        {
          key: 'cloudOpacity', label: 'Opacity',
          min: 0, max: 0.5, step: 0.01,
          get: () => cloudShadows.material.opacity,
          set: v => { cloudShadows.material.opacity = v },
        },
      ],
    },
    {
      id: 'camera',
      title: 'Camera',
      badge: 'live',
      params: [
        {
          key: 'cameraFov', label: 'FOV',
          min: 10, max: 120, step: 1,
          get: () => cameraRig.baseFov,
          set: v => { cameraRig.baseFov = v; cameraRig.currentFov = v },
        },
        {
          key: 'cameraLerp', label: 'Damping (Lerp)',
          min: 0.01, max: 0.3, step: 0.005,
          get: () => cameraRig.lerpFactor,
          set: v => { cameraRig.lerpFactor = v },
        },
      ],
    },
    // ─── God Rays (GPU Gems 3 radial blur) ───
    ...(godRayPass ? [{
      id: 'godrays',
      title: 'God Rays',
      badge: 'live',
      params: [
        {
          key: 'godrayIntensity', label: 'Intensity',
          min: 0, max: 2.0, step: 0.05,
          get: () => godRayPass.intensity,
          set: v => { godRayPass.intensity = v },
        },
        {
          key: 'godrayDensity', label: 'Density',
          min: 0.1, max: 2.0, step: 0.05,
          get: () => godRayPass._density,
          set: v => { godRayPass._density = v; godRayPass._blurMat.uniforms.uDensity.value = v },
        },
        {
          key: 'godrayWeight', label: 'Weight',
          min: 0.001, max: 0.05, step: 0.001,
          get: () => godRayPass._weight,
          set: v => { godRayPass._weight = v; godRayPass._blurMat.uniforms.uWeight.value = v },
        },
        {
          key: 'godrayDecay', label: 'Decay',
          min: 0.9, max: 1.0, step: 0.005,
          get: () => godRayPass._decay,
          set: v => { godRayPass._decay = v; godRayPass._blurMat.uniforms.uDecay.value = v },
        },
        {
          key: 'godrayExposure', label: 'Exposure',
          min: 0.1, max: 3.0, step: 0.1,
          get: () => godRayPass._exposure,
          set: v => { godRayPass._exposure = v; godRayPass._blurMat.uniforms.uExposure.value = v },
        },
      ],
    }] : []),
    // ─── Phase 2A: 3-Zone Fog ───
    ...(fogDepth ? [{
      id: 'fogDepth',
      title: '3-Zone Fog',
      badge: 'live',
      params: [
        {
          key: 'fogNearEnd', label: 'Near Zone End',
          min: 0.01, max: 0.4, step: 0.01,
          get: () => fogDepth.effect.uniforms.get('uNearEnd')?.value,
          set: v => { fogDepth.effect.uniforms.get('uNearEnd').value = v },
        },
        {
          key: 'fogMidEnd', label: 'Mid Zone End',
          min: 0.2, max: 0.9, step: 0.01,
          get: () => fogDepth.effect.uniforms.get('uMidEnd')?.value,
          set: v => { fogDepth.effect.uniforms.get('uMidEnd').value = v },
        },
        {
          key: 'fogStrength', label: 'Fog Strength',
          min: 0, max: 1, step: 0.05,
          get: () => fogDepth.effect.uniforms.get('uFogStrength')?.value,
          set: v => { fogDepth.effect.uniforms.get('uFogStrength').value = v },
        },
        {
          key: 'fogDesaturation', label: 'Far Desaturation',
          min: 0, max: 1, step: 0.05,
          get: () => fogDepth.effect.uniforms.get('uDesaturation')?.value,
          set: v => { fogDepth.effect.uniforms.get('uDesaturation').value = v },
        },
      ],
    }] : []),
    // ─── Phase 2B: Color Grade (SEUS) ───
    ...(colorGrade ? [{
      id: 'colorGrade',
      title: 'Color Grade (SEUS)',
      badge: 'live',
      params: [
        {
          key: 'cgContrast', label: 'Contrast',
          min: 0, max: 0.5, step: 0.01,
          get: () => colorGrade.uniforms.get('uContrast')?.value,
          set: v => { colorGrade.uniforms.get('uContrast').value = v },
        },
        {
          key: 'cgLiftR', label: 'Lift R',
          min: -0.1, max: 0.1, step: 0.005,
          get: () => colorGrade.uniforms.get('uLift')?.value.x,
          set: v => { colorGrade.uniforms.get('uLift').value.x = v },
        },
        {
          key: 'cgLiftG', label: 'Lift G',
          min: -0.1, max: 0.1, step: 0.005,
          get: () => colorGrade.uniforms.get('uLift')?.value.y,
          set: v => { colorGrade.uniforms.get('uLift').value.y = v },
        },
        {
          key: 'cgLiftB', label: 'Lift B',
          min: -0.1, max: 0.1, step: 0.005,
          get: () => colorGrade.uniforms.get('uLift')?.value.z,
          set: v => { colorGrade.uniforms.get('uLift').value.z = v },
        },
        {
          key: 'cgGammaR', label: 'Gamma R',
          min: 0.8, max: 1.2, step: 0.01,
          get: () => colorGrade.uniforms.get('uGamma')?.value.x,
          set: v => { colorGrade.uniforms.get('uGamma').value.x = v },
        },
        {
          key: 'cgGammaG', label: 'Gamma G',
          min: 0.8, max: 1.2, step: 0.01,
          get: () => colorGrade.uniforms.get('uGamma')?.value.y,
          set: v => { colorGrade.uniforms.get('uGamma').value.y = v },
        },
        {
          key: 'cgGammaB', label: 'Gamma B',
          min: 0.8, max: 1.2, step: 0.01,
          get: () => colorGrade.uniforms.get('uGamma')?.value.z,
          set: v => { colorGrade.uniforms.get('uGamma').value.z = v },
        },
        {
          key: 'cgGainR', label: 'Gain R',
          min: 0.8, max: 1.2, step: 0.01,
          get: () => colorGrade.uniforms.get('uGain')?.value.x,
          set: v => { colorGrade.uniforms.get('uGain').value.x = v },
        },
        {
          key: 'cgGainG', label: 'Gain G',
          min: 0.8, max: 1.2, step: 0.01,
          get: () => colorGrade.uniforms.get('uGain')?.value.y,
          set: v => { colorGrade.uniforms.get('uGain').value.y = v },
        },
        {
          key: 'cgGainB', label: 'Gain B',
          min: 0.8, max: 1.2, step: 0.01,
          get: () => colorGrade.uniforms.get('uGain')?.value.z,
          set: v => { colorGrade.uniforms.get('uGain').value.z = v },
        },
        {
          key: 'cgSplitIntensity', label: 'Split Tone',
          min: 0, max: 0.5, step: 0.01,
          get: () => colorGrade.uniforms.get('uSplitIntensity')?.value,
          set: v => { colorGrade.uniforms.get('uSplitIntensity').value = v },
        },
        {
          key: 'cgVibrance', label: 'Vibrance',
          min: 0.5, max: 2.0, step: 0.05,
          get: () => colorGrade.uniforms.get('uVibrance')?.value,
          set: v => { colorGrade.uniforms.get('uVibrance').value = v },
        },
        {
          key: 'cgDarkDesat', label: 'Dark Desat',
          min: 0, max: 1, step: 0.05,
          get: () => colorGrade.uniforms.get('uDarkDesat')?.value,
          set: v => { colorGrade.uniforms.get('uDarkDesat').value = v },
        },
      ],
    }] : []),
    // ─── Phase 2B: SSAO ───
    ...(ssao ? [{
      id: 'ssao',
      title: 'SSAO',
      badge: 'live',
      params: [
        {
          key: 'ssaoRadius', label: 'AO Radius',
          min: 0.01, max: 0.15, step: 0.005,
          get: () => {
            try { return ssao.effect.radius ?? ssao.effect.ssaoMaterial?.uniforms?.radius?.value } catch { return 0.05 }
          },
          set: v => {
            try {
              if ('radius' in ssao.effect) ssao.effect.radius = v
              else if (ssao.effect.ssaoMaterial) ssao.effect.ssaoMaterial.uniforms.radius.value = v
            } catch { /* ignore */ }
          },
        },
        {
          key: 'ssaoIntensity', label: 'Intensity',
          min: 0, max: 5, step: 0.1,
          get: () => ssao.effect.intensity,
          set: v => { ssao.effect.intensity = v },
        },
        {
          key: 'ssaoLumInfluence', label: 'Luminance Influence',
          min: 0, max: 1, step: 0.05,
          get: () => {
            try { return ssao.effect.luminanceInfluence ?? ssao.effect.ssaoMaterial?.uniforms?.luminanceInfluence?.value } catch { return 0.7 }
          },
          set: v => {
            try {
              if ('luminanceInfluence' in ssao.effect) ssao.effect.luminanceInfluence = v
              else if (ssao.effect.ssaoMaterial) ssao.effect.ssaoMaterial.uniforms.luminanceInfluence.value = v
            } catch { /* ignore */ }
          },
        },
      ],
    }] : []),
    // ─── Kuwahara Painterly ───
    ...(postProcessing.kuwahara ? [{
      id: 'kuwahara',
      title: 'Kuwahara Painterly',
      badge: 'live',
      params: [
        {
          key: 'kuwaharaStrength', label: 'Strength',
          min: 0, max: 1.0, step: 0.05,
          get: () => postProcessing.kuwahara.uniforms.get('uStrength')?.value,
          set: v => { postProcessing.kuwahara.uniforms.get('uStrength').value = v },
        },
        {
          key: 'kuwaharaKernel', label: 'Kernel Size',
          min: 1, max: 8, step: 1,
          get: () => postProcessing.kuwahara.uniforms.get('uKernelSize')?.value,
          set: v => { postProcessing.kuwahara.uniforms.get('uKernelSize').value = v },
        },
      ],
    }] : []),
    // ─── Dust Motes ───
    ...(dustMotes ? [{
      id: 'dustMotes',
      title: 'Dust Motes',
      badge: 'live',
      params: [
        {
          key: 'dustBrightness', label: 'Brightness',
          min: 0, max: 2.0, step: 0.05,
          get: () => dustMotes.material.uniforms.uBrightness?.value,
          set: v => {
            dustMotes.material.uniforms.uBrightness.value = v
            dustMotes.points.visible = v > 0.01
          },
        },
        {
          key: 'dustSize', label: 'Size',
          min: 5, max: 100, step: 1,
          get: () => dustMotes.material.uniforms.uSize?.value,
          set: v => { dustMotes.material.uniforms.uSize.value = v },
        },
      ],
    }] : []),
    // ─── Cursor Interaction ───
    {
      id: 'cursor',
      title: 'Cursor Interaction',
      badge: 'live',
      params: [
        {
          key: 'cursorRadius', label: 'Grass Push Radius',
          min: 1, max: 10, step: 0.5,
          get: () => grassManager.material.uniforms.uCursorRadius.value,
          set: v => grassManager.setUniform('uCursorRadius', v),
        },
        {
          key: 'cursorStrength', label: 'Grass Brush Strength',
          min: 0, max: 4, step: 0.1,
          get: () => grassManager.material.uniforms.uCursorStrength.value,
          set: v => grassManager.setUniform('uCursorStrength', v),
        },
      ],
    },
    // ─── Score Sheets ───
    ...(scoreSheets ? [{
      id: 'scoreSheets',
      title: 'Score Sheets',
      badge: 'live',
      params: [
        {
          key: 'sheetWind', label: 'Wind Strength',
          min: 0, max: 3.0, step: 0.1,
          get: () => scoreSheets._windStrength,
          set: v => { scoreSheets._windStrength = v },
        },
      ],
    }] : []),
    // ─── Depth of Field ───
    ...(dof ? [{
      id: 'dof',
      title: 'Depth of Field',
      badge: 'live',
      params: [
        {
          key: 'dofBokehScale', label: 'Bokeh Scale',
          min: 0, max: 10, step: 0.1,
          get: () => dof.effect.bokehScale,
          set: v => { dof.effect.bokehScale = v },
        },
        {
          key: 'dofFocusRange', label: 'Focus Range',
          min: 1, max: 30, step: 0.5,
          get: () => dof.effect.cocMaterial?.focusRange,
          set: v => { if (dof.effect.cocMaterial) dof.effect.cocMaterial.focusRange = v },
        },
      ],
    }] : []),
    // ─── Phase 2A: LOD ───
    {
      id: 'lod',
      title: 'Grass LOD',
      badge: 'live',
      params: [
        {
          key: 'lodThreshold', label: 'LOD Threshold',
          min: 5, max: 40, step: 1,
          get: () => grassManager.LOD_THRESHOLD,
          set: v => { grassManager.LOD_THRESHOLD = v },
        },
      ],
    },
  ]
}

function formatValue(v, step) {
  if (typeof v === 'string') return v
  if (v == null) return '—'
  if (step < 0.001) return v.toFixed(5)
  if (step < 0.1) return v.toFixed(3)
  if (step < 1) return v.toFixed(2)
  return v.toFixed(0)
}

export default function DevTuner({ engineRef }) {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState({})
  const [locks, setLocks] = useState({})
  const [values, setValues] = useState({})
  const [showJson, setShowJson] = useState(false)
  const [toast, setToast] = useState('')
  const [frozen, setFrozen] = useState(false)
  const groupsRef = useRef([])
  const atmosphereRef = useRef(null)
  const rafRef = useRef(null)

  // Build param groups when engine is ready
  useEffect(() => {
    const check = () => {
      const engine = engineRef.current
      if (!engine || engine.tier === 3) return
      const api = engine.getDevAPI()
      atmosphereRef.current = api.atmosphere
      groupsRef.current = buildParamGroups(api)
      // Initialize values
      const initial = {}
      for (const group of groupsRef.current) {
        for (const p of group.params) {
          try { initial[p.key] = p.get() } catch { initial[p.key] = 0 }
        }
      }
      setValues(initial)
    }
    // Retry until engine is mounted
    const timer = setInterval(() => {
      if (engineRef.current?.getDevAPI) {
        check()
        clearInterval(timer)
      }
    }, 200)
    return () => clearInterval(timer)
  }, [engineRef])

  // Sync displayed values from engine at 10fps (for params that change externally)
  useEffect(() => {
    if (!open) return
    const sync = () => {
      const next = {}
      for (const group of groupsRef.current) {
        for (const p of group.params) {
          try { next[p.key] = p.get() } catch { /* skip */ }
        }
      }
      setValues(prev => {
        // Only update non-locked values
        const merged = { ...prev }
        for (const k in next) {
          if (!locks[k]) merged[k] = next[k]
        }
        return merged
      })
      rafRef.current = setTimeout(sync, 100)
    }
    sync()
    return () => clearTimeout(rafRef.current)
  }, [open, locks])

  // Keyboard toggle: backtick
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === 'Escape' && showJson) {
        setShowJson(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showJson])

  const handleChange = useCallback((param, rawValue) => {
    const v = param.type === 'color' ? rawValue : parseFloat(rawValue)
    param.set(v)
    setValues(prev => ({ ...prev, [param.key]: v }))
  }, [])

  const toggleLock = useCallback((key) => {
    setLocks(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const toggleCollapse = useCallback((id) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const toggleFreeze = useCallback(() => {
    setFrozen(prev => {
      const next = !prev
      if (atmosphereRef.current) atmosphereRef.current.paused = next
      return next
    })
  }, [])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }, [])

  const gatherJson = useCallback(() => {
    const result = { _meta: { exported: new Date().toISOString(), locked: [] } }
    for (const group of groupsRef.current) {
      const section = {}
      for (const p of group.params) {
        section[p.key] = {
          value: values[p.key],
          locked: !!locks[p.key],
        }
        if (locks[p.key]) result._meta.locked.push(p.key)
      }
      result[group.id] = section
    }
    return result
  }, [values, locks])

  const handleExport = useCallback(() => setShowJson(true), [])

  const downloadJson = useCallback((toastMsg) => {
    const blob = new Blob([JSON.stringify(gatherJson(), null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `mks-tuner-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    showToast(toastMsg)
  }, [gatherJson, showToast])

  const handleSave = useCallback(() => {
    downloadJson('Settings saved')
  }, [downloadJson])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(gatherJson(), null, 2))
    showToast('Copied to clipboard')
    setShowJson(false)
  }, [gatherJson, showToast])

  const handleDownload = useCallback(() => {
    downloadJson('Downloaded')
    setShowJson(false)
  }, [downloadJson])

  const handleLoadJson = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          const newLocks = {}
          for (const group of groupsRef.current) {
            const section = data[group.id]
            if (!section) continue
            for (const p of group.params) {
              const entry = section[p.key]
              if (!entry) continue
              p.set(entry.value)
              setValues(prev => ({ ...prev, [p.key]: entry.value }))
              if (entry.locked) {
                newLocks[p.key] = true
              }
            }
          }
          setLocks(prev => ({ ...prev, ...newLocks }))
          showToast('Loaded preset')
        } catch {
          showToast('Invalid JSON')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [showToast])

  if (groupsRef.current.length === 0) return null

  return (
    <>
      <button
        className={`dev-tuner-toggle${open ? ' active' : ''}`}
        onClick={() => setOpen(o => !o)}
        title="Toggle DevTuner (`)"
      >
        {open ? '\u2715' : '\u2699'}
      </button>

      <div className={`dev-tuner${open ? ' open' : ''}`}>
        <div className="dt-header">
          <h2>Dev Tuner</h2>
          <button
            className={`dt-btn dt-freeze${frozen ? ' active' : ''}`}
            onClick={toggleFreeze}
            title="Freeze scroll-driven atmosphere so slider changes stick"
          >
            {frozen ? '\u2744 Frozen' : '\u25B6 Live'}
          </button>
        </div>

        <div className="dt-scroll-area" data-lenis-prevent>
          {groupsRef.current.map(group => (
            <div key={group.id} className={`dt-panel${collapsed[group.id] ? ' collapsed' : ''}`}>
              <div className="dt-panel-header" onClick={() => toggleCollapse(group.id)}>
                <span className="dt-panel-title">{group.title}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`dt-panel-badge dt-badge-${group.badge}`}>{group.badge}</span>
                  <span className="dt-chevron">{'\u25BC'}</span>
                </span>
              </div>
              <div className="dt-panel-body">
                {group.params.map(p => {
                  if (p.type === 'color') {
                    const v = values[p.key] || '#000000'
                    return (
                      <div key={p.key} className="dt-param-color">
                        <span className="dt-param-name">{p.label}</span>
                        <div className="dt-swatch" style={{ background: v }}>
                          <input
                            type="color"
                            value={v}
                            onChange={e => handleChange(p, e.target.value)}
                            disabled={locks[p.key]}
                          />
                        </div>
                        <span className="dt-value">{v}</span>
                        <button
                          className={`dt-lock${locks[p.key] ? ' locked' : ''}`}
                          onClick={() => toggleLock(p.key)}
                        >
                          {locks[p.key] ? '\u{1F512}' : '\u{1F513}'}
                        </button>
                      </div>
                    )
                  }

                  const v = values[p.key]
                  return (
                    <div key={p.key} className="dt-param">
                      <div className="dt-param-slider">
                        <span className="dt-param-name">{p.label}</span>
                        <input
                          type="range"
                          min={p.min}
                          max={p.max}
                          step={p.step}
                          value={v ?? p.min}
                          className={locks[p.key] ? 'locked' : ''}
                          onChange={e => handleChange(p, e.target.value)}
                          disabled={locks[p.key]}
                        />
                      </div>
                      <span className="dt-value">{formatValue(v, p.step)}</span>
                      <button
                        className={`dt-lock${locks[p.key] ? ' locked' : ''}`}
                        onClick={() => toggleLock(p.key)}
                      >
                        {locks[p.key] ? '\u{1F512}' : '\u{1F513}'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="dt-footer">
          <button className="dt-btn" onClick={handleLoadJson}>Load</button>
          <button className="dt-btn" onClick={handleExport}>Export</button>
          <button className="dt-btn dt-btn-save" onClick={handleSave}>Save</button>
        </div>
      </div>

      {showJson && (
        <div className="dt-json-overlay" onClick={() => setShowJson(false)}>
          <div className="dt-json-panel" onClick={e => e.stopPropagation()}>
            <h3>Tuner Export</h3>
            <pre>{JSON.stringify(gatherJson(), null, 2)}</pre>
            <div className="dt-json-actions">
              <button className="dt-btn" onClick={() => setShowJson(false)}>Close</button>
              <button className="dt-btn" onClick={handleCopy}>Copy</button>
              <button className="dt-btn dt-btn-export" onClick={handleDownload}>Download</button>
            </div>
          </div>
        </div>
      )}

      <div className={`dt-toast${toast ? ' visible' : ''}`}>{toast}</div>
    </>
  )
}
