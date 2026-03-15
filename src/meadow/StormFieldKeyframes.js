// Storm Field atmosphere keyframes — The Search
// Scroll arc: Unease → Pursuit → Tempest → Break → Revelation
// "Running through whatever obstacles are presented...
//  breath comes in a little harder...
//  ears strain to hear the next note."
//
// Urgency. The wind is loud. The grass is fighting to stand.
// Rain hits. Lightning illuminates everything for a split second.
// You're moving faster. Breath comes harder. You're searching.

export const STORM_FIELD_KEYFRAMES = [
  {
    t: 0.0, // UNEASE — something is coming, the air is charged
    petalBrightness: 0.0,
    starBrightness: 0.0,   // no stars — overcast
    sunElevation: 5,       // low, obscured
    sunAzimuth: 200,
    turbidity: 8.0,
    rayleigh: 0.5,
    mieCoefficient: 0.015,
    mieDirectionalG: 0.85,
    fogColor: [0.04, 0.04, 0.05],   // dark grey
    fogDensity: 0.010,     // thick — oppressive
    sunLightColor: [0.22, 0.22, 0.28],  // dim grey
    sunLightIntensity: 0.25,
    ambientIntensity: 0.04,
    grassBaseColor: [0.03, 0.04, 0.02],  // dark, no green
    grassTipColor: [0.06, 0.08, 0.04],
    grassWindSpeed: 1.5,    // wind building
    grassAmbientStrength: 0.10,
    grassTranslucency: 0.2,
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00008,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.05,
    bloomThreshold: 1.0,   // essentially off
    fogDepthStrength: 0.08,
    fogMidColor: [0.05, 0.05, 0.07],
    fogFarColor: [0.03, 0.03, 0.05],
    colorGradeContrast: 0.10,
    colorGradeVibrance: 0.05,  // desaturated
    colorGradeWarmth: 0.0,
    vignetteDarkness: 0.85,
    grainOpacity: 0.08,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    rainBrightness: 0.3,   // light rain starting
    waveWindDirX: 0.8,
    waveWindDirY: 0.6,
    waveWindSpeed: 0.6,
    waveWindStrength: 0.4,   // wind building
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
  },
  {
    t: 0.25, // PURSUIT — running now, wind howling, rain intensifying
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 4,
    sunAzimuth: 210,
    turbidity: 9.0,
    rayleigh: 0.4,
    mieCoefficient: 0.018,
    mieDirectionalG: 0.82,
    fogColor: [0.04, 0.04, 0.06],
    fogDensity: 0.012,
    sunLightColor: [0.20, 0.20, 0.26],
    sunLightIntensity: 0.2,
    ambientIntensity: 0.04,
    grassBaseColor: [0.03, 0.04, 0.02],
    grassTipColor: [0.07, 0.09, 0.05],
    grassWindSpeed: 2.5,    // strong wind
    grassAmbientStrength: 0.08,
    grassTranslucency: 0.15,
    grassFogFade: 0.006,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0001,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.08,
    bloomThreshold: 0.95,
    fogDepthStrength: 0.10,
    fogMidColor: [0.05, 0.05, 0.08],
    fogFarColor: [0.03, 0.03, 0.05],
    colorGradeContrast: 0.12,
    colorGradeVibrance: 0.03,
    colorGradeWarmth: 0.0,
    vignetteDarkness: 0.88,
    grainOpacity: 0.10,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    rainBrightness: 0.6,
    waveWindDirX: 0.85,
    waveWindDirY: 0.53,
    waveWindSpeed: 1.0,
    waveWindStrength: 0.9,
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
  },
  {
    t: 0.50, // TEMPEST — peak storm, maximum darkness and wind
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 3,
    sunAzimuth: 220,
    turbidity: 10.0,
    rayleigh: 0.3,
    mieCoefficient: 0.020,
    mieDirectionalG: 0.80,
    fogColor: [0.03, 0.03, 0.05],   // darkest
    fogDensity: 0.014,     // maximum opacity
    sunLightColor: [0.18, 0.18, 0.24],
    sunLightIntensity: 0.15,
    ambientIntensity: 0.03,  // nearly black
    grassBaseColor: [0.02, 0.03, 0.02],
    grassTipColor: [0.06, 0.08, 0.04],
    grassWindSpeed: 3.5,    // violent — blown flat
    grassAmbientStrength: 0.06,
    grassTranslucency: 0.1,
    grassFogFade: 0.007,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00015,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.1,    // only for lightning flashes
    bloomThreshold: 0.9,
    fogDepthStrength: 0.12,
    fogMidColor: [0.04, 0.04, 0.07],
    fogFarColor: [0.02, 0.02, 0.04],
    colorGradeContrast: 0.14,
    colorGradeVibrance: 0.02,
    colorGradeWarmth: 0.0,
    vignetteDarkness: 0.92,  // maximum — tunnel vision
    grainOpacity: 0.12,     // grainiest
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    rainBrightness: 0.9,    // peak rain
    waveWindDirX: 0.9,
    waveWindDirY: 0.44,
    waveWindSpeed: 1.5,
    waveWindStrength: 1.5,   // violent — grass flattened
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
  },
  {
    t: 0.75, // BREAK — storm begins to crack, first rays of hope
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 6,       // sun pushing through
    sunAzimuth: 230,
    turbidity: 7.0,
    rayleigh: 0.6,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.85,
    fogColor: [0.06, 0.06, 0.08],
    fogDensity: 0.008,     // clearing
    sunLightColor: [0.30, 0.30, 0.35],  // light returning
    sunLightIntensity: 0.4,
    ambientIntensity: 0.06,
    grassBaseColor: [0.03, 0.05, 0.03],
    grassTipColor: [0.08, 0.12, 0.06],
    grassWindSpeed: 2.0,    // wind easing
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.3,
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.05,
    cloudDriftSpeed: 0.0001,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.15,
    bloomThreshold: 0.85,
    fogDepthStrength: 0.08,
    fogMidColor: [0.08, 0.08, 0.12],
    fogFarColor: [0.05, 0.05, 0.08],
    colorGradeContrast: 0.10,
    colorGradeVibrance: 0.10,  // color returning
    colorGradeWarmth: 0.01,
    vignetteDarkness: 0.78,
    grainOpacity: 0.09,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    rainBrightness: 0.4,    // rain slowing
    waveWindDirX: 0.85,
    waveWindDirY: 0.53,
    waveWindSpeed: 0.8,
    waveWindStrength: 0.8,   // easing
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
  },
  {
    t: 1.0, // REVELATION — you found what you were searching for
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 8,
    sunAzimuth: 240,
    turbidity: 6.0,
    rayleigh: 0.7,
    mieCoefficient: 0.010,
    mieDirectionalG: 0.88,
    fogColor: [0.07, 0.07, 0.09],
    fogDensity: 0.006,
    sunLightColor: [0.35, 0.34, 0.38],
    sunLightIntensity: 0.5,
    ambientIntensity: 0.07,
    grassBaseColor: [0.04, 0.06, 0.03],
    grassTipColor: [0.10, 0.14, 0.07],
    grassWindSpeed: 1.0,    // calm after storm
    grassAmbientStrength: 0.16,
    grassTranslucency: 0.4,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.08,
    cloudDriftSpeed: 0.00006,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.2,
    bloomThreshold: 0.80,
    fogDepthStrength: 0.06,
    fogMidColor: [0.10, 0.10, 0.14],
    fogFarColor: [0.06, 0.06, 0.10],
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.15,
    colorGradeWarmth: 0.02,  // warmth earned through struggle
    vignetteDarkness: 0.65,
    grainOpacity: 0.07,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    rainBrightness: 0.1,    // last drops
    waveWindDirX: 0.8,
    waveWindDirY: 0.6,
    waveWindSpeed: 0.4,
    waveWindStrength: 0.3,   // calm after storm
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
  },
]
