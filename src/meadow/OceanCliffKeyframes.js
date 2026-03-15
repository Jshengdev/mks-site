// Ocean Cliff atmosphere keyframes — Peaceful Heartache
// Scroll arc: Arrival → Recognition → Contemplation → Understanding → Release
// "A goodbye where both protagonists don't want to leave,
//  but they know it'd be better to free each other."
//
// You sit at the edge of something infinite. The ocean is the feeling
// you can't name. The horizon is the future you can't see.

export const OCEAN_CLIFF_KEYFRAMES = [
  {
    t: 0.0, // ARRIVAL — approaching the cliff edge, fog obscures the view
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.3,   // dusk stars emerging
    sunElevation: -3,      // just below horizon
    sunAzimuth: 260,       // setting position
    turbidity: 1.5,
    rayleigh: 0.8,
    mieCoefficient: 0.01,
    mieDirectionalG: 0.90,
    fogColor: [0.04, 0.06, 0.12],   // teal-blue dusk
    fogDensity: 0.006,
    sunLightColor: [0.40, 0.45, 0.60],  // cool blue-steel
    sunLightIntensity: 0.5,
    ambientIntensity: 0.08,
    grassBaseColor: [0.03, 0.08, 0.03],
    grassTipColor: [0.10, 0.25, 0.08],
    grassWindSpeed: 0.3,    // gentle sea breeze
    grassAmbientStrength: 0.18,
    grassTranslucency: 0.6,
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00002,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.2,
    bloomThreshold: 0.8,
    fogDepthStrength: 0.06,
    fogMidColor: [0.05, 0.08, 0.15],
    fogFarColor: [0.03, 0.05, 0.10],
    colorGradeContrast: 0.04,
    colorGradeVibrance: 0.15,
    colorGradeWarmth: 0.0,
    vignetteDarkness: 0.60,
    grainOpacity: 0.04,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 1.0,       // from the ocean
    waveWindSpeed: 0.3,
    waveWindStrength: 0.1,   // gentle sea breeze
    // DOF v3 (exp-022, 61/70) — far focus on arrival
    dofFocusDistance: 20,
    dofBokehScale: 2.0,
    // Split-tone — no warmth yet, approaching the cliff
    splitToneWarm: [0.95, 0.78, 0.50],   // amber (warm shadows)
    splitToneCool: [0.65, 0.78, 0.95],   // steel-blue (cool highlights)
    // Ocean (exp-007, 47/70) — fog obscures, barely visible
    oceanColorNear: [0.04, 0.18, 0.24],  // dark teal, half-hidden
    oceanColorFar: [0.02, 0.05, 0.10],   // deep midnight
    oceanFoamBrightness: 0.3,            // foam barely visible through fog
    oceanWaveLineIntensity: 0.2,         // wave lines suppressed
  },
  {
    t: 0.25, // RECOGNITION — the ocean comes into view, vastness registers
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.5,
    sunElevation: -5,
    sunAzimuth: 255,
    turbidity: 1.5,
    rayleigh: 0.8,
    mieCoefficient: 0.008,
    mieDirectionalG: 0.88,
    fogColor: [0.03, 0.06, 0.10],
    fogDensity: 0.004,     // clearing — the ocean reveals itself
    sunLightColor: [0.42, 0.48, 0.62],
    sunLightIntensity: 0.65,
    ambientIntensity: 0.09,
    grassBaseColor: [0.03, 0.09, 0.03],
    grassTipColor: [0.10, 0.28, 0.08],
    grassWindSpeed: 0.4,
    grassAmbientStrength: 0.20,
    grassTranslucency: 0.7,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.25,
    bloomThreshold: 0.78,
    fogDepthStrength: 0.05,
    fogMidColor: [0.05, 0.09, 0.16],
    fogFarColor: [0.03, 0.06, 0.12],
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.20,
    colorGradeWarmth: 0.05,   // split-tone first hint — faded memory emerging
    vignetteDarkness: 0.50,
    grainOpacity: 0.04,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 1.0,
    waveWindSpeed: 0.4,
    waveWindStrength: 0.15,
    // DOF v3 — focus pulling closer, ocean reveals itself
    dofFocusDistance: 12,
    dofBokehScale: 4.0,
    // Split-tone — first hint of warmth
    splitToneWarm: [0.95, 0.78, 0.50],
    splitToneCool: [0.65, 0.78, 0.95],
    // Ocean — the ocean comes into view, patterns emerge
    oceanColorNear: [0.04, 0.22, 0.30],  // teal brightening
    oceanColorFar: [0.02, 0.08, 0.14],   // deep blue
    oceanFoamBrightness: 0.6,            // foam dots emerging
    oceanWaveLineIntensity: 0.5,         // wave lines appearing
  },
  {
    t: 0.50, // CONTEMPLATION — beside the figure, looking at the horizon together
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.7,
    sunElevation: -6,
    sunAzimuth: 250,
    turbidity: 1.3,
    rayleigh: 0.7,
    mieCoefficient: 0.006,
    mieDirectionalG: 0.86,
    fogColor: [0.03, 0.05, 0.09],
    fogDensity: 0.003,     // clearest — the infinite ocean
    sunLightColor: [0.45, 0.50, 0.65],  // moonlight + lingering dusk
    sunLightIntensity: 0.8,
    ambientIntensity: 0.10,
    grassBaseColor: [0.03, 0.10, 0.03],
    grassTipColor: [0.12, 0.30, 0.08],
    grassWindSpeed: 0.5,   // stronger sea breeze at peak
    grassAmbientStrength: 0.22,
    grassTranslucency: 0.8,
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.02,
    cloudDriftSpeed: 0.00004,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.3,    // gentle ocean glow
    bloomThreshold: 0.75,
    fogDepthStrength: 0.04,
    fogMidColor: [0.06, 0.10, 0.18],
    fogFarColor: [0.04, 0.07, 0.14],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.25,
    colorGradeWarmth: 0.15,  // split-tone peak — "faded memory" quality (exp-022)
    vignetteDarkness: 0.42,  // opens up
    grainOpacity: 0.03,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 1.0,
    waveWindSpeed: 0.5,
    waveWindStrength: 0.2,   // peak sea breeze
    // DOF v3 — intimate focus, peak "faded memory" quality (exp-022: 61/70)
    dofFocusDistance: 8,
    dofBokehScale: 5.5,      // heavy bokeh — cinematic intimacy
    // Split-tone peak — warm amber shadows at 15%, cool blue highlights
    splitToneWarm: [0.95, 0.78, 0.50],
    splitToneCool: [0.65, 0.78, 0.95],
    // Ocean peak — full visibility, the infinite ocean
    oceanColorNear: [0.06, 0.28, 0.36],  // brightest teal — the ocean you can't name
    oceanColorFar: [0.02, 0.10, 0.16],   // midnight blue
    oceanFoamBrightness: 1.0,            // full foam — the feeling reveals itself
    oceanWaveLineIntensity: 0.8,         // breathing wave lines at their clearest
  },
  {
    t: 0.75, // UNDERSTANDING — the goodbye becomes real, beauty in the sadness
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.8,
    sunElevation: -8,      // deeper into night
    sunAzimuth: 245,
    turbidity: 1.5,
    rayleigh: 0.8,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.85,
    fogColor: [0.03, 0.04, 0.08],
    fogDensity: 0.004,
    sunLightColor: [0.38, 0.42, 0.58],
    sunLightIntensity: 0.6,
    ambientIntensity: 0.08,
    grassBaseColor: [0.02, 0.08, 0.03],
    grassTipColor: [0.08, 0.22, 0.06],
    grassWindSpeed: 0.4,
    grassAmbientStrength: 0.18,
    grassTranslucency: 0.6,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.01,
    cloudDriftSpeed: 0.00002,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.25,
    bloomThreshold: 0.80,
    fogDepthStrength: 0.05,
    fogMidColor: [0.05, 0.08, 0.14],
    fogFarColor: [0.03, 0.05, 0.10],
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.18,
    colorGradeWarmth: 0.12,  // split-tone sustained — beauty in the sadness
    vignetteDarkness: 0.52,
    grainOpacity: 0.04,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 1.0,
    waveWindSpeed: 0.4,
    waveWindStrength: 0.15,
    // DOF v3 — sustained intimacy, the goodbye moment
    dofFocusDistance: 8,
    dofBokehScale: 5.0,
    // Split-tone sustained
    splitToneWarm: [0.95, 0.78, 0.50],
    splitToneCool: [0.65, 0.78, 0.95],
    // Ocean sustained — beauty in the sadness
    oceanColorNear: [0.05, 0.24, 0.32],  // slightly dimmer
    oceanColorFar: [0.02, 0.08, 0.14],
    oceanFoamBrightness: 0.8,            // foam softening
    oceanWaveLineIntensity: 0.7,         // wave lines sustained
  },
  {
    t: 1.0, // RELEASE — letting go, the horizon dissolves into darkness
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.6,
    sunElevation: -10,
    sunAzimuth: 240,
    turbidity: 1.5,
    rayleigh: 0.8,
    mieCoefficient: 0.003,
    mieDirectionalG: 0.85,
    fogColor: [0.02, 0.03, 0.06],   // dissolving
    fogDensity: 0.008,     // fog returning — the horizon swallowed
    sunLightColor: [0.32, 0.36, 0.52],
    sunLightIntensity: 0.35,
    ambientIntensity: 0.06,
    grassBaseColor: [0.02, 0.06, 0.02],
    grassTipColor: [0.06, 0.18, 0.05],
    grassWindSpeed: 0.2,    // wind dying
    grassAmbientStrength: 0.14,
    grassTranslucency: 0.4,
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.15,
    bloomThreshold: 0.85,
    fogDepthStrength: 0.07,
    fogMidColor: [0.04, 0.06, 0.12],
    fogFarColor: [0.02, 0.04, 0.08],
    colorGradeContrast: 0.03,
    colorGradeVibrance: 0.10,
    colorGradeWarmth: 0.03,  // split-tone fading — warmth dissolving
    vignetteDarkness: 0.65,
    grainOpacity: 0.05,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 1.0,
    waveWindSpeed: 0.25,
    waveWindStrength: 0.08,  // dying breeze
    // DOF v3 — letting go, everything dissolves into soft blur
    dofFocusDistance: 20,
    dofBokehScale: 3.0,
    // Split-tone fading — warmth dissolving
    splitToneWarm: [0.95, 0.78, 0.50],
    splitToneCool: [0.65, 0.78, 0.95],
    // Ocean dissolving — fog swallows the patterns
    oceanColorNear: [0.03, 0.14, 0.20],  // darkening
    oceanColorFar: [0.01, 0.04, 0.08],   // near-black
    oceanFoamBrightness: 0.2,            // foam fading to nothing
    oceanWaveLineIntensity: 0.15,        // wave lines dissolving
  },
]
