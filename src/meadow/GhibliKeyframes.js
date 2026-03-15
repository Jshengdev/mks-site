// Ghibli Painterly atmosphere keyframes — The Fall and Acceptance
// Scroll arc: Wonder → Immersion → Radiance → Transfiguration → Transcendence
// "The sun is rising as he is falling,
//  but his life has never felt brighter."
//
// INVERTED PEAK ARC: brightness builds continuously to TRANSCENDENCE (t=1.0).
// "Never felt brighter" IS the finale, not the midpoint.
// Sun rises then FALLS (dawn→zenith→horizon), but the world gets MORE vivid.
// The paradox — falling sun + rising beauty — IS the heartache.
//
// exp-083-ghibli-improve-sweep: V5 "Composite Optimum" (4-axis: split-tone + kuwahara crescendo + paradox amplifier + dawn fix)
// Over exp-080: +2 honest (65→67). Split-tone arc gives painting emotional color age.
// Kuwahara INVERTED to peak at TRANSCENDENCE (0.78). Paradox amplified at P4/P5.
// Dawn positions fixed with translucency + cloud shadows + atmospheric scattering.
// Score: 67/70 (5-pos weighted 66.85), +2.0 over exp-080, +8.85 over 58 baseline

export const GHIBLI_KEYFRAMES = [
  {
    t: 0.0, // WONDER — cool dawn, awakening INTO a painting
    // The painting is fresh. Cool morning paper. Backlit grass glows through translucency.
    // Cloud shadows reveal the painting has LAYERS. Atmospheric scattering = dawn glow.
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 8,            // dawn — sun just rising
    sunAzimuth: 260,
    turbidity: 2.5,
    rayleigh: 1.8,
    mieCoefficient: 0.012,      // up from 0.008 — forward scatter creates dawn atmospheric glow
    mieDirectionalG: 0.88,
    fogColor: [0.10, 0.12, 0.14],   // cool morning fog
    fogDensity: 0.003,
    sunLightColor: [0.95, 0.85, 0.70],  // cool dawn light
    sunLightIntensity: 1.5,
    ambientIntensity: 0.35,      // cel-band visibility fix (exp-080)
    grassBaseColor: [0.10, 0.28, 0.08],
    grassTipColor: [0.25, 0.55, 0.12],
    grassWindSpeed: 0.6,
    grassAmbientStrength: 0.42,
    grassTranslucency: 2.3,      // up from 1.8 — backlit dawn grass GLOWS through each blade
    grassFogFade: 0.001,
    cloudShadowOpacity: 0.10,    // up from 0.05 — painted layers visible = "this IS a painting"
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.4,
    bloomThreshold: 0.6,
    fogDepthStrength: 0.03,
    fogMidColor: [0.18, 0.20, 0.14],
    fogFarColor: [0.12, 0.14, 0.10],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.75,
    colorGradeWarmth: 0.04,
    vignetteDarkness: 0.45,
    grainOpacity: 0.06,          // down from 0.07 — fresh canvas, not yet aged
    dustMoteBrightness: 0.3,
    godRayIntensity: 0.15,
    kuwaharaStrength: 0.30,      // down from 0.35 — gentle at start, painting is fresh
    caDistortion: 0.05,
    petalBrightness: 0.4,
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.4,
    waveWindStrength: 0.1,
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.82, 0.75, 0.68],   // cool morning paper (was static [.925,.706,.518])
    splitToneCool: [0.75, 0.80, 0.92],   // steel blue dawn shadows (was static [.831,.769,.894])
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // IMMERSION — the painting warms, colors intensify, motes appear
    // The world is coming alive as a painting. Golden motes visible earlier.
    // Strokes still building — not bold yet. Backlit grass stronger.
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 14,
    sunAzimuth: 250,
    turbidity: 2.0,
    rayleigh: 1.5,
    mieCoefficient: 0.010,
    mieDirectionalG: 0.90,
    fogColor: [0.14, 0.16, 0.10],
    fogDensity: 0.002,
    sunLightColor: [1.0, 0.94, 0.80],
    sunLightIntensity: 1.7,
    ambientIntensity: 0.40,
    grassBaseColor: [0.12, 0.30, 0.08],
    grassTipColor: [0.30, 0.60, 0.15],
    grassWindSpeed: 0.8,
    grassAmbientStrength: 0.45,
    grassTranslucency: 2.6,      // up from 2.2 — backlit growing stronger
    grassFogFade: 0.001,
    cloudShadowOpacity: 0.08,
    cloudDriftSpeed: 0.00006,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.72,        // up from 0.65 — light growing faster
    bloomThreshold: 0.55,
    fogDepthStrength: 0.03,
    fogMidColor: [0.22, 0.24, 0.16],
    fogFarColor: [0.14, 0.16, 0.10],
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.90,
    colorGradeWarmth: 0.05,
    vignetteDarkness: 0.38,
    grainOpacity: 0.07,          // down from 0.08 — canvas still young
    dustMoteBrightness: 0.7,     // up from 0.5 — golden motes visible EARLIER
    godRayIntensity: 0.45,
    kuwaharaStrength: 0.45,      // down from 0.52 — still building, medium strokes
    caDistortion: 0.08,
    petalBrightness: 0.7,
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.6,
    waveWindStrength: 0.2,
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.90, 0.78, 0.55],   // warming amber — paint absorbing sun
    splitToneCool: [0.70, 0.78, 0.90],   // warming highlights
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // RADIANCE — beautiful but NOT the peak, still building
    // Vivid but you sense it's STILL BUILDING — tension.
    // Kuwahara eased back (not peak) — the painting isn't finished yet.
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 20,
    sunAzimuth: 240,
    turbidity: 1.8,
    rayleigh: 1.2,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.92,
    fogColor: [0.18, 0.20, 0.12],
    fogDensity: 0.0015,
    sunLightColor: [1.0, 0.95, 0.82],
    sunLightIntensity: 2.0,
    ambientIntensity: 0.48,
    grassBaseColor: [0.15, 0.35, 0.10],
    grassTipColor: [0.35, 0.65, 0.18],
    grassWindSpeed: 1.0,
    grassAmbientStrength: 0.50,
    grassTranslucency: 2.8,
    grassFogFade: 0.0008,
    cloudShadowOpacity: 0.10,
    cloudDriftSpeed: 0.00008,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.80,
    bloomThreshold: 0.50,
    fogDepthStrength: 0.02,
    fogMidColor: [0.28, 0.30, 0.18],
    fogFarColor: [0.22, 0.22, 0.14],  // warmer distant fog (was [.18,.20,.12])
    colorGradeContrast: 0.10,
    colorGradeVibrance: 1.10,    // up from 1.05 — slightly more vivid
    colorGradeWarmth: 0.06,
    vignetteDarkness: 0.30,
    grainOpacity: 0.08,          // up from 0.07 — canvas aging begins
    dustMoteBrightness: 0.8,
    godRayIntensity: 0.65,
    kuwaharaStrength: 0.60,      // down from 0.68 — NOT peak, still building
    caDistortion: 0.12,
    petalBrightness: 1.0,
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.8,
    waveWindStrength: 0.3,
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.95, 0.82, 0.50],   // vivid amber peak
    splitToneCool: [0.62, 0.74, 0.86],   // cool contrast — painting at full color
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // TRANSFIGURATION — the fall begins, but light INTENSIFIES
    // Sun descending = "the fall." But colors get MORE vivid, not less.
    // Bold brushstrokes emerging. Deep amber split-tone. Teal enters the shadows.
    // The paradox is VISIBLE: falling sun + rising beauty + aging paint.
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 12,            // sun falling
    sunAzimuth: 230,
    turbidity: 2.2,
    rayleigh: 1.6,
    mieCoefficient: 0.015,
    mieDirectionalG: 0.93,
    fogColor: [0.30, 0.22, 0.10],
    fogDensity: 0.002,
    sunLightColor: [1.0, 0.82, 0.55],
    sunLightIntensity: 2.0,      // up from 1.8 — BRIGHTER despite lower sun = paradox
    ambientIntensity: 0.50,
    grassBaseColor: [0.14, 0.30, 0.08],
    grassTipColor: [0.35, 0.55, 0.12],
    grassWindSpeed: 1.2,
    grassAmbientStrength: 0.50,
    grassTranslucency: 2.5,
    grassFogFade: 0.001,
    cloudShadowOpacity: 0.08,
    cloudDriftSpeed: 0.00007,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 1.15,        // up from 1.05 — light overflowing harder
    bloomThreshold: 0.38,
    fogDepthStrength: 0.04,
    fogMidColor: [0.30, 0.25, 0.14],
    fogFarColor: [0.20, 0.18, 0.10],
    colorGradeContrast: 0.12,
    colorGradeVibrance: 1.25,    // up from 1.15 — pushing toward impossible
    colorGradeWarmth: 0.12,
    vignetteDarkness: 0.35,
    grainOpacity: 0.10,          // up from 0.09 — canvas aging accelerates
    dustMoteBrightness: 1.0,     // up from 0.9 — golden motes everywhere
    godRayIntensity: 1.0,
    kuwaharaStrength: 0.72,      // up from 0.65 — BOLD strokes: the fall visible in paint
    caDistortion: 0.15,
    petalBrightness: 0.9,
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.7,
    waveWindStrength: 0.35,
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.98, 0.78, 0.42],   // deep amber — aged warm paint
    splitToneCool: [0.55, 0.70, 0.85],   // teal EMERGING in shadows — audience color enters the painting
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // TRANSCENDENCE — "his life has NEVER felt brighter" — THE PEAK
    // The sun is at the horizon. The world is flooded with golden light.
    // Kuwahara 0.78 = the world IS an oil painting. Massive brushstrokes.
    // Grain 0.12 = the canvas itself is visible, aging, cracking with beauty.
    // Split-tone: aged golden canvas with TEAL in the shadows — the viewer's
    // color now lives INSIDE the painting. The artwork was changed by being seen.
    // Bloom 1.35 + threshold 0.28 = EVERYTHING glows. Impossible vibrance 1.35.
    // This is the most beautiful thing you've ever seen. And it's ending.
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 5,             // horizon — dying sun
    sunAzimuth: 220,
    turbidity: 2.5,
    rayleigh: 1.8,
    mieCoefficient: 0.018,       // up from 0.012 — forward scatter = golden sun glow halo
    mieDirectionalG: 0.90,
    fogColor: [0.40, 0.30, 0.12],
    fogDensity: 0.005,           // up from 0.004 — more atmospheric golden scatter
    sunLightColor: [1.0, 0.75, 0.42],
    sunLightIntensity: 2.5,      // up from 2.2 — BLAZING despite dying sun = paradox screams
    ambientIntensity: 0.55,
    grassBaseColor: [0.15, 0.32, 0.08],
    grassTipColor: [0.40, 0.60, 0.15],
    grassWindSpeed: 0.6,
    grassAmbientStrength: 0.52,
    grassTranslucency: 2.0,
    grassFogFade: 0.0015,
    cloudShadowOpacity: 0.06,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 1.35,        // up from 1.15 — EXTREME glow, light overflowing the frame
    bloomThreshold: 0.28,        // down from 0.35 — EVERYTHING glows at the end
    fogDepthStrength: 0.04,
    fogMidColor: [0.28, 0.22, 0.14],
    fogFarColor: [0.30, 0.25, 0.14],  // warmer (was [.20,.18,.12]) — golden atmospheric haze
    colorGradeContrast: 0.08,
    colorGradeVibrance: 1.35,    // up from 1.20 — BEYOND impossible, past the ceiling
    colorGradeWarmth: 0.18,      // up from 0.14 — maximum golden warmth
    vignetteDarkness: 0.18,      // down from 0.25 — WIDEST open: no frame, pure light
    grainOpacity: 0.12,          // up from 0.10 — MAX: aged master painting, canvas cracking through
    dustMoteBrightness: 1.3,     // up from 1.0 — suspended pigment particles catching fire
    godRayIntensity: 0.90,
    kuwaharaStrength: 0.78,      // up from 0.55 — MASSIVE strokes: world IS an oil painting
    caDistortion: 0.10,
    petalBrightness: 1.2,        // up from 1.0 — petals catching golden fire
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.4,
    waveWindStrength: 0.30,
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.92, 0.68, 0.38],   // aged golden canvas — deep warm paint darkened by time
    splitToneCool: [0.48, 0.65, 0.80],   // deep teal in shadows — audience color LIVES in the painting
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
