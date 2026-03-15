// Night Meadow atmosphere keyframes — Bittersweet Letting Go
// Scroll arc: Silence → Remembrance → Grief → Peace → Acceptance
// "Knowing that someday this pain will be joined with peace
//  and more beauty than I can imagine."
//
// The same meadow at night. What was golden is now silver-blue.
// What was wind is now stillness. The fireflies are the only warmth.

export const NIGHT_MEADOW_KEYFRAMES = [
  {
    t: 0.0, // SILENCE — absolute stillness, the world holds its breath
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.5,   // stars half-visible, emerging
    sunElevation: -30,     // deep night — sun far below
    sunAzimuth: 180,
    turbidity: 1.5,
    rayleigh: 0.8,
    mieCoefficient: 0.002,
    mieDirectionalG: 0.85,
    fogColor: [0.02, 0.02, 0.05],   // near-black blue
    fogDensity: 0.012,     // heavy fog — hidden in darkness
    sunLightColor: [0.25, 0.28, 0.45],  // moonlight blue
    sunLightIntensity: 0.2,
    ambientIntensity: 0.03,  // barely anything
    grassBaseColor: [0.01, 0.03, 0.02],  // near-black
    grassTipColor: [0.03, 0.06, 0.04],
    grassWindSpeed: 0.05,    // frozen
    grassAmbientStrength: 0.10,
    grassTranslucency: 0.3,
    grassFogFade: 0.006,
    cloudShadowOpacity: 0.0,  // no cloud shadows at night
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.1,  // barely visible, waking up
    fireflySize: 40,
    bloomIntensity: 0.3,
    bloomThreshold: 0.7,
    fogDepthStrength: 0.08,
    fogMidColor: [0.03, 0.03, 0.08],
    fogFarColor: [0.02, 0.02, 0.05],
    colorGradeContrast: 0.02,
    colorGradeVibrance: 0.05,  // almost monochrome
    colorGradeWarmth: 0.0,
    vignetteDarkness: 0.90,  // heavy tunnel vision
    grainOpacity: 0.08,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.1,
    waveWindStrength: 0.0,   // frozen stillness
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
  },
  {
    t: 0.25, // REMEMBRANCE — fireflies stir, memories surface
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.8,   // stars becoming vivid
    sunElevation: -25,
    sunAzimuth: 190,
    turbidity: 1.5,
    rayleigh: 0.8,
    mieCoefficient: 0.003,
    mieDirectionalG: 0.88,
    fogColor: [0.03, 0.04, 0.07],
    fogDensity: 0.008,     // fog thinning — vision clearing
    sunLightColor: [0.30, 0.32, 0.50],
    sunLightIntensity: 0.3,
    ambientIntensity: 0.05,
    grassBaseColor: [0.01, 0.04, 0.03],
    grassTipColor: [0.04, 0.10, 0.06],
    grassWindSpeed: 0.15,   // gentle stir
    grassAmbientStrength: 0.15,
    grassTranslucency: 0.5,
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00002,
    fireflyBrightness: 0.6,  // fireflies awakening
    fireflySize: 60,
    bloomIntensity: 0.4,
    bloomThreshold: 0.6,
    fogDepthStrength: 0.06,
    fogMidColor: [0.04, 0.05, 0.10],
    fogFarColor: [0.03, 0.03, 0.07],
    colorGradeContrast: 0.04,
    colorGradeVibrance: 0.15,
    colorGradeWarmth: 0.01,
    vignetteDarkness: 0.80,
    grainOpacity: 0.07,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.1,
    waveWindStrength: 0.02,  // whisper
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
  },
  {
    t: 0.50, // GRIEF — peak emotion, fireflies everywhere like tears of light
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 1.0,   // stars fully blazing
    sunElevation: -20,     // moon at its brightest angle
    sunAzimuth: 200,
    turbidity: 1.2,
    rayleigh: 0.6,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.90,
    fogColor: [0.04, 0.05, 0.10],
    fogDensity: 0.005,     // clearest — you can see far into the night
    sunLightColor: [0.35, 0.40, 0.55],  // moonlight at its strongest
    sunLightIntensity: 0.45,
    ambientIntensity: 0.07,
    grassBaseColor: [0.02, 0.05, 0.04],
    grassTipColor: [0.06, 0.14, 0.10],  // silver-blue tips
    grassWindSpeed: 0.3,    // gentle wind — a sigh
    grassAmbientStrength: 0.22,
    grassTranslucency: 0.8,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.02,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 1.2,  // fireflies at peak — they ARE the warmth
    fireflySize: 85,
    bloomIntensity: 0.6,    // strong bloom on fireflies
    bloomThreshold: 0.5,
    fogDepthStrength: 0.04,
    fogMidColor: [0.06, 0.07, 0.14],
    fogFarColor: [0.04, 0.04, 0.10],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.25,
    colorGradeWarmth: 0.02,  // tiny bit of warmth from fireflies
    vignetteDarkness: 0.65,  // opens up — the world reveals itself
    grainOpacity: 0.06,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.15,
    waveWindStrength: 0.05,  // gentle sigh
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
  },
  {
    t: 0.75, // PEACE — grief settling, a deep exhale, warmth acknowledged
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.9,
    sunElevation: -22,
    sunAzimuth: 210,
    turbidity: 1.3,
    rayleigh: 0.7,
    mieCoefficient: 0.004,
    mieDirectionalG: 0.88,
    fogColor: [0.05, 0.05, 0.08],
    fogDensity: 0.006,
    sunLightColor: [0.32, 0.36, 0.52],
    sunLightIntensity: 0.38,
    ambientIntensity: 0.06,
    grassBaseColor: [0.02, 0.04, 0.03],
    grassTipColor: [0.05, 0.12, 0.08],
    grassWindSpeed: 0.2,    // wind settling
    grassAmbientStrength: 0.18,
    grassTranslucency: 0.6,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.01,
    cloudDriftSpeed: 0.00002,
    fireflyBrightness: 0.9,  // still warm, slightly dimming
    fireflySize: 75,
    bloomIntensity: 0.5,
    bloomThreshold: 0.55,
    fogDepthStrength: 0.05,
    fogMidColor: [0.05, 0.06, 0.12],
    fogFarColor: [0.03, 0.04, 0.08],
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.20,
    colorGradeWarmth: 0.015,
    vignetteDarkness: 0.72,
    grainOpacity: 0.07,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.12,
    waveWindStrength: 0.03,
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
  },
  {
    t: 1.0, // ACCEPTANCE — stillness returns, deeper now, transformed
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.6,   // stars softening
    sunElevation: -28,
    sunAzimuth: 220,
    turbidity: 1.5,
    rayleigh: 0.8,
    mieCoefficient: 0.002,
    mieDirectionalG: 0.85,
    fogColor: [0.03, 0.03, 0.06],
    fogDensity: 0.010,     // fog returning — dissolution
    sunLightColor: [0.28, 0.30, 0.48],
    sunLightIntensity: 0.25,
    ambientIntensity: 0.04,
    grassBaseColor: [0.01, 0.03, 0.03],
    grassTipColor: [0.04, 0.08, 0.06],
    grassWindSpeed: 0.1,    // nearly still again
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.4,
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.4,  // fireflies dimming but still present
    fireflySize: 50,
    bloomIntensity: 0.35,
    bloomThreshold: 0.65,
    fogDepthStrength: 0.07,
    fogMidColor: [0.04, 0.04, 0.09],
    fogFarColor: [0.02, 0.02, 0.06],
    colorGradeContrast: 0.03,
    colorGradeVibrance: 0.10,
    colorGradeWarmth: 0.005,
    vignetteDarkness: 0.85,  // closing in — a gentle embrace
    grainOpacity: 0.08,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.08,
    waveWindStrength: 0.0,   // still again
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
  },
]
