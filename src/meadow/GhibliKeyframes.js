// Ghibli Painterly atmosphere keyframes — The Fall and Acceptance
// Scroll arc: Wonder → Immersion → Radiance → Transfiguration → Transcendence
// "The sun is rising as he is falling,
//  but his life has never felt brighter."
//
// The world becomes hyper-vivid. Like a memory more real than reality.
// Everything has brushstroke texture. Colors are impossible.

export const GHIBLI_KEYFRAMES = [
  {
    t: 0.0, // WONDER — entering the painterly world, colors brightening
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 20,       // bright morning
    sunAzimuth: 260,
    turbidity: 2.5,
    rayleigh: 1.8,
    mieCoefficient: 0.008,
    mieDirectionalG: 0.88,
    fogColor: [0.12, 0.14, 0.10],   // green-tinged
    fogDensity: 0.003,
    sunLightColor: [1.0, 0.92, 0.78],  // warm golden
    sunLightIntensity: 1.5,
    ambientIntensity: 0.18,  // brighter — Ghibli worlds are well-lit
    grassBaseColor: [0.06, 0.22, 0.05],
    grassTipColor: [0.25, 0.55, 0.12],
    grassWindSpeed: 0.6,
    grassAmbientStrength: 0.35,
    grassTranslucency: 1.8,
    grassFogFade: 0.001,
    cloudShadowOpacity: 0.05,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.4,
    bloomThreshold: 0.6,
    fogDepthStrength: 0.03,
    fogMidColor: [0.18, 0.20, 0.14],
    fogFarColor: [0.12, 0.14, 0.10],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.6,   // vivid from the start
    colorGradeWarmth: 0.04,
    vignetteDarkness: 0.45,
    grainOpacity: 0.05,
    dustMoteBrightness: 0.3,
    godRayIntensity: 0.2,
    kuwaharaStrength: 0.3,    // painterly from the start
    petalBrightness: 0.4,     // petals drifting
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.4,
    waveWindStrength: 0.1,
  },
  {
    t: 0.25, // IMMERSION — deeper into the world, Kuwahara intensifying
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 23,
    sunAzimuth: 250,
    turbidity: 2.0,
    rayleigh: 1.5,
    mieCoefficient: 0.010,
    mieDirectionalG: 0.90,
    fogColor: [0.14, 0.16, 0.10],
    fogDensity: 0.002,      // clearer — everything vivid
    sunLightColor: [1.0, 0.94, 0.80],
    sunLightIntensity: 1.7,
    ambientIntensity: 0.20,
    grassBaseColor: [0.08, 0.25, 0.06],
    grassTipColor: [0.30, 0.60, 0.15],  // vivid green
    grassWindSpeed: 0.8,
    grassAmbientStrength: 0.38,
    grassTranslucency: 2.2,
    grassFogFade: 0.001,
    cloudShadowOpacity: 0.08,
    cloudDriftSpeed: 0.00006,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.5,
    bloomThreshold: 0.55,
    fogDepthStrength: 0.03,
    fogMidColor: [0.22, 0.24, 0.16],
    fogFarColor: [0.14, 0.16, 0.10],
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.75,
    colorGradeWarmth: 0.05,
    vignetteDarkness: 0.38,
    grainOpacity: 0.04,
    dustMoteBrightness: 0.5,
    godRayIntensity: 0.4,
    kuwaharaStrength: 0.45,
    petalBrightness: 0.7,
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.6,
    waveWindStrength: 0.2,
  },
  {
    t: 0.50, // RADIANCE — peak vividity, the world is impossibly beautiful
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 25,       // sun at brightest
    sunAzimuth: 240,
    turbidity: 1.8,
    rayleigh: 1.2,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.92,
    fogColor: [0.18, 0.20, 0.12],
    fogDensity: 0.0015,     // minimal fog — crystal clarity
    sunLightColor: [1.0, 0.95, 0.82],
    sunLightIntensity: 2.0,  // blazing
    ambientIntensity: 0.22,
    grassBaseColor: [0.10, 0.28, 0.06],
    grassTipColor: [0.35, 0.65, 0.18],  // peak vivid
    grassWindSpeed: 1.0,
    grassAmbientStrength: 0.42,
    grassTranslucency: 2.8,
    grassFogFade: 0.0008,
    cloudShadowOpacity: 0.10,
    cloudDriftSpeed: 0.00008,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.65,
    bloomThreshold: 0.5,
    fogDepthStrength: 0.02,
    fogMidColor: [0.28, 0.30, 0.18],
    fogFarColor: [0.18, 0.20, 0.12],
    colorGradeContrast: 0.10,
    colorGradeVibrance: 0.90,  // maximum saturation
    colorGradeWarmth: 0.06,
    vignetteDarkness: 0.30,   // most open
    grainOpacity: 0.04,
    dustMoteBrightness: 0.8,
    godRayIntensity: 0.7,     // dramatic rays
    kuwaharaStrength: 0.6,    // peak painterly
    petalBrightness: 1.0,     // petals everywhere
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.8,
    waveWindStrength: 0.3,   // flowing waves
  },
  {
    t: 0.75, // TRANSFIGURATION — the falling begins, beauty becoming bittersweet
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 22,
    sunAzimuth: 230,
    turbidity: 2.2,
    rayleigh: 1.6,
    mieCoefficient: 0.015,
    mieDirectionalG: 0.93,
    fogColor: [0.22, 0.18, 0.10],  // shifting amber
    fogDensity: 0.002,
    sunLightColor: [1.0, 0.88, 0.68],  // amber deepening
    sunLightIntensity: 1.8,
    ambientIntensity: 0.18,
    grassBaseColor: [0.10, 0.22, 0.04],
    grassTipColor: [0.35, 0.55, 0.12],
    grassWindSpeed: 1.2,
    grassAmbientStrength: 0.36,
    grassTranslucency: 2.5,
    grassFogFade: 0.001,
    cloudShadowOpacity: 0.08,
    cloudDriftSpeed: 0.00007,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.8,     // light overflowing
    bloomThreshold: 0.45,
    fogDepthStrength: 0.04,
    fogMidColor: [0.30, 0.25, 0.14],
    fogFarColor: [0.20, 0.18, 0.10],
    colorGradeContrast: 0.12,
    colorGradeVibrance: 0.80,
    colorGradeWarmth: 0.08,
    vignetteDarkness: 0.35,
    grainOpacity: 0.05,
    dustMoteBrightness: 0.9,
    godRayIntensity: 0.9,
    kuwaharaStrength: 0.55,
    petalBrightness: 0.9,
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.7,
    waveWindStrength: 0.35,  // peak whimsical waves
  },
  {
    t: 1.0, // TRANSCENDENCE — his life has never felt brighter
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 18,
    sunAzimuth: 220,
    turbidity: 2.5,
    rayleigh: 1.8,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.90,
    fogColor: [0.25, 0.20, 0.12],   // golden amber fog
    fogDensity: 0.003,
    sunLightColor: [1.0, 0.85, 0.60],  // deep golden
    sunLightIntensity: 1.5,
    ambientIntensity: 0.16,
    grassBaseColor: [0.08, 0.20, 0.04],
    grassTipColor: [0.28, 0.48, 0.10],
    grassWindSpeed: 0.6,     // settling
    grassAmbientStrength: 0.32,
    grassTranslucency: 2.0,
    grassFogFade: 0.0015,
    cloudShadowOpacity: 0.06,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.5,
    bloomThreshold: 0.55,
    fogDepthStrength: 0.04,
    fogMidColor: [0.28, 0.22, 0.14],
    fogFarColor: [0.20, 0.18, 0.12],
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.65,
    colorGradeWarmth: 0.05,
    vignetteDarkness: 0.42,
    grainOpacity: 0.05,
    dustMoteBrightness: 0.5,
    godRayIntensity: 0.4,
    kuwaharaStrength: 0.4,
    petalBrightness: 0.5,    // petals softening
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.4,
    waveWindStrength: 0.15,  // settling
  },
]
