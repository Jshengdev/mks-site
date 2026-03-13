// apply-preset.mjs — Apply a visual preset via Playwright and capture screenshots
// Usage: node scripts/apply-preset.mjs <preset-name>
// Presets define DevTuner parameter values to apply before capturing
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const SCREENSHOT_DIR = join(import.meta.dirname, '..', 'screenshots')
const DEV_URL = 'http://localhost:5173'

// Ghibli/BotW golden hour presets to iterate through
const PRESETS = {
  'ghibli-warm': {
    description: 'Ghibli golden hour — warm, lush green grass, amber sky',
    values: {
      toneMappingExposure: 0.6,
      turbidity: 4,
      rayleigh: 1.5,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.85,
      sunElevation: 10,
      sunIntensity: 1.5,
      ambientIntensity: 0.3,
      bloomIntensity: 0.3,
      bloomThreshold: 0.75,
      vignetteDarkness: 0.45,
      grainOpacity: 0.02,
      cgContrast: 0.10,
      cgGainR: 0.92, cgGainG: 0.90, cgGainB: 0.82,
      cgVibrance: 1.25,
      cgSplitIntensity: 0.10,
      cgDarkDesat: 0.25,
      grassBaseColor: '#3a5e1e',
      grassTipColor: '#7a9b42',
    }
  },
  'botw-golden': {
    description: 'BotW Hyrule field — vivid green, soft golden light, gentle haze',
    values: {
      toneMappingExposure: 0.7,
      turbidity: 3,
      rayleigh: 2.0,
      mieCoefficient: 0.003,
      mieDirectionalG: 0.9,
      sunElevation: 15,
      sunIntensity: 1.8,
      ambientIntensity: 0.4,
      bloomIntensity: 0.35,
      bloomThreshold: 0.7,
      vignetteDarkness: 0.35,
      grainOpacity: 0.015,
      cgContrast: 0.08,
      cgGainR: 0.95, cgGainG: 0.93, cgGainB: 0.85,
      cgVibrance: 1.35,
      cgSplitIntensity: 0.06,
      cgDarkDesat: 0.15,
      grassBaseColor: '#2d5a0f',
      grassTipColor: '#8fb84a',
    }
  },
  'ghibli-dusk': {
    description: 'Ghibli dusk — deep amber sky, rich shadows, warm grass',
    values: {
      toneMappingExposure: 0.5,
      turbidity: 6,
      rayleigh: 3.0,
      mieCoefficient: 0.008,
      mieDirectionalG: 0.75,
      sunElevation: 5,
      sunIntensity: 2.0,
      ambientIntensity: 0.2,
      bloomIntensity: 0.5,
      bloomThreshold: 0.55,
      vignetteDarkness: 0.55,
      grainOpacity: 0.025,
      cgContrast: 0.15,
      cgGainR: 0.90, cgGainG: 0.85, cgGainB: 0.75,
      cgVibrance: 1.20,
      cgSplitIntensity: 0.14,
      cgDarkDesat: 0.35,
      grassBaseColor: '#4a5e20',
      grassTipColor: '#a89040',
    }
  },
  'spirited-away': {
    description: 'Spirited Away — magical warmth, saturated greens, rich atmosphere',
    values: {
      toneMappingExposure: 0.55,
      turbidity: 5,
      rayleigh: 2.5,
      mieCoefficient: 0.006,
      mieDirectionalG: 0.82,
      sunElevation: 8,
      sunIntensity: 1.6,
      ambientIntensity: 0.25,
      bloomIntensity: 0.4,
      bloomThreshold: 0.65,
      vignetteDarkness: 0.5,
      grainOpacity: 0.02,
      cgContrast: 0.12,
      cgGainR: 0.93, cgGainG: 0.88, cgGainB: 0.80,
      cgVibrance: 1.40,
      cgSplitIntensity: 0.12,
      cgDarkDesat: 0.30,
      grassBaseColor: '#2a5818',
      grassTipColor: '#6ea035',
    }
  },
}

async function applyPresetAndCapture(presetName) {
  const preset = PRESETS[presetName]
  if (!preset) {
    console.error(`Unknown preset: ${presetName}`)
    console.log('Available:', Object.keys(PRESETS).join(', '))
    process.exit(1)
  }

  mkdirSync(SCREENSHOT_DIR, { recursive: true })

  const browser = await chromium.launch({
    headless: false,
    args: ['--enable-webgl', '--ignore-gpu-blocklist'],
  })
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })

  await page.goto(DEV_URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)

  // Apply preset values via window.__MEADOW_ENGINE__ (we'll expose this)
  await page.evaluate((values) => {
    // Access the engine via the global ref
    const engine = window.__MEADOW_ENGINE__
    if (!engine) { console.warn('Engine not found on window'); return }
    const api = engine.getDevAPI()
    const r = api.renderer
    const sky = api.sceneSetup.sky
    const sun = api.sceneSetup.sunLight
    const pp = api.postProcessing
    const scene = api.scene

    // Renderer
    if (values.toneMappingExposure != null) r.toneMappingExposure = values.toneMappingExposure

    // Sky
    if (sky && values.turbidity != null) sky.material.uniforms.turbidity.value = values.turbidity
    if (sky && values.rayleigh != null) sky.material.uniforms.rayleigh.value = values.rayleigh
    if (sky && values.mieCoefficient != null) sky.material.uniforms.mieCoefficient.value = values.mieCoefficient
    if (sky && values.mieDirectionalG != null) sky.material.uniforms.mieDirectionalG.value = values.mieDirectionalG

    // Sun elevation
    if (sky && sun && values.sunElevation != null) {
      const phi = (90 - values.sunElevation) * Math.PI / 180
      const theta = 240 * Math.PI / 180
      const x = Math.sin(phi) * Math.sin(theta)
      const y = Math.cos(phi)
      const z = Math.sin(phi) * Math.cos(theta)
      sky.material.uniforms.sunPosition.value.set(x, y, z)
      sun.position.set(x * 100, y * 100, z * 100)
    }

    if (sun && values.sunIntensity != null) sun.intensity = values.sunIntensity
    const amb = scene.children.find(c => c.isAmbientLight)
    if (amb && values.ambientIntensity != null) amb.intensity = values.ambientIntensity

    // Post-processing
    if (pp.bloom && values.bloomIntensity != null) pp.bloom.intensity = values.bloomIntensity
    if (pp.bloom?.luminanceMaterial && values.bloomThreshold != null) pp.bloom.luminanceMaterial.threshold = values.bloomThreshold
    if (pp.vignette && values.vignetteDarkness != null) pp.vignette.darkness = values.vignetteDarkness
    if (pp.grain && values.grainOpacity != null) pp.grain.blendMode.opacity.value = values.grainOpacity

    // Grass colors
    const gm = api.grassManager
    if (gm && values.grassBaseColor) {
      const bc = { r: 0, g: 0, b: 0 }
      const hex = values.grassBaseColor
      bc.r = parseInt(hex.slice(1,3), 16) / 255
      bc.g = parseInt(hex.slice(3,5), 16) / 255
      bc.b = parseInt(hex.slice(5,7), 16) / 255
      gm.material.uniforms.uBaseColor.value.setRGB(bc.r, bc.g, bc.b)
      for (const [, chunk] of gm.chunks) {
        chunk.material.uniforms.uBaseColor.value.setRGB(bc.r, bc.g, bc.b)
      }
    }
    if (gm && values.grassTipColor) {
      const tc = { r: 0, g: 0, b: 0 }
      const hex = values.grassTipColor
      tc.r = parseInt(hex.slice(1,3), 16) / 255
      tc.g = parseInt(hex.slice(3,5), 16) / 255
      tc.b = parseInt(hex.slice(5,7), 16) / 255
      gm.material.uniforms.uTipColor.value.setRGB(tc.r, tc.g, tc.b)
      for (const [, chunk] of gm.chunks) {
        chunk.material.uniforms.uTipColor.value.setRGB(tc.r, tc.g, tc.b)
      }
    }

    // Color grade uniforms
    const cg = pp.colorGrade?.uniforms
    if (cg) {
      if (values.cgContrast != null) cg.get('uContrast').value = values.cgContrast
      if (values.cgGainR != null) cg.get('uGain').value.x = values.cgGainR
      if (values.cgGainG != null) cg.get('uGain').value.y = values.cgGainG
      if (values.cgGainB != null) cg.get('uGain').value.z = values.cgGainB
      if (values.cgVibrance != null) cg.get('uVibrance').value = values.cgVibrance
      if (values.cgSplitIntensity != null) cg.get('uSplitIntensity').value = values.cgSplitIntensity
      if (values.cgDarkDesat != null) cg.get('uDarkDesat').value = values.cgDarkDesat
    }
  }, preset.values)

  // Wait for changes to render
  await page.waitForTimeout(2000)

  // Capture at multiple scroll positions
  const scrollPositions = [0.0, 0.25, 0.5]
  for (const pos of scrollPositions) {
    await page.evaluate((scrollPos) => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: totalHeight * scrollPos, behavior: 'instant' })
    }, pos)
    await page.waitForTimeout(1500)

    const filename = `${presetName}-scroll${pos.toFixed(2).replace('.', '_')}.png`
    await page.screenshot({ path: join(SCREENSHOT_DIR, filename), fullPage: false, timeout: 60000 })
    console.log(`Captured: ${filename}`)
  }

  await browser.close()
  console.log(`\nPreset "${presetName}" applied and captured.`)
  console.log(`Description: ${preset.description}`)
  console.log(`Screenshots: ${SCREENSHOT_DIR}`)
}

const presetName = process.argv[2] || 'ghibli-warm'
if (presetName === '--list') {
  for (const [name, p] of Object.entries(PRESETS)) {
    console.log(`  ${name}: ${p.description}`)
  }
} else {
  applyPresetAndCapture(presetName)
}
