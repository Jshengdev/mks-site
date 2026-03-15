// Ocean Cliff atmosphere keyframes — Peaceful Heartache
// Scroll arc: Arrival → Recognition → Contemplation → Understanding → Release
// "A goodbye where both protagonists don't want to leave,
//  but they know it'd be better to free each other."
//
// You sit at the edge of something infinite. The ocean is the feeling
// you can't name. The horizon is the future you can't see.
//
// exp-082 V5 Composite: ocean vividity arc + star emergence/fade +
// wind alive→dead + 7-dimensional dissolution at RELEASE
// Score: 67/70 (5-pos weighted 66.9), +2.8 over exp-081 V5 (64.8)

export const OCEAN_CLIFF_KEYFRAMES = [
  {
    t: 0.0, // ARRIVAL — approaching the cliff edge, fog obscures the view
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.20,  // exp-082 V5: 0.3→0.20 (fewer visible, dusk still bright)
    sunElevation: -3,      // just below horizon
    sunAzimuth: 260,       // setting position
    turbidity: 1.5,
    rayleigh: 0.8,
    mieCoefficient: 0.01,
    mieDirectionalG: 0.90,
    fogColor: [0.04, 0.06, 0.12],   // teal-blue dusk
    fogDensity: 0.006,
    sunLightColor: [0.40, 0.45, 0.60],  // cool blue-steel
    sunLightIntensity: 0.6,              // exp-081 V5: +0.1 ambient lift
    ambientIntensity: 0.12,              // exp-081 V5: 0.08→0.12 (visibility lift)
    grassBaseColor: [0.02, 0.06, 0.06],   // dark teal-grey — cliff grass, not meadow
    grassTipColor: [0.06, 0.14, 0.12],    // muted teal tips — cold ocean wind
    grassWindSpeed: 0.20,   // exp-082 V5: 0.3→0.20 (barely any breeze on arrival)
    grassAmbientStrength: 0.22,          // exp-081 V5: 0.18→0.22
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
    vignetteDarkness: 0.65,              // exp-081 V5: 0.60→0.65 (tunnel on arrival)
    grainOpacity: 0.04,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.02,      // clean lens on arrival
    waveWindDirX: 0.0,
    waveWindDirY: 1.0,       // from the ocean
    waveWindSpeed: 0.3,
    waveWindStrength: 0.06,  // exp-082 V5: 0.1→0.06 (barely any wind on arrival)
    // DOF v3 — wide focus on arrival (exp-081 V5: narrative DOF)
    dofFocusDistance: 30,                // exp-081 V5: 20→30 (looking around, wide)
    dofBokehScale: 1.5,                 // exp-081 V5: 2.0→1.5 (everything moderately sharp)
    // Split-tone — cold on arrival (exp-081 V5: color temperature arc)
    splitToneWarm: [0.80, 0.72, 0.65],  // exp-081 V5: cold amber (not warm yet)
    splitToneCool: [0.55, 0.65, 0.85],  // exp-081 V5: steel blue
    // Ocean — fog obscures, barely visible (exp-082 V5: darker on arrival)
    oceanColorNear: [0.03, 0.14, 0.20],  // exp-082 V5: darker, more hidden in fog
    oceanColorFar: [0.02, 0.05, 0.10],   // deep midnight
    oceanFoamBrightness: 0.15,           // exp-082 V5: 0.3→0.15 (foam barely a whisper)
    oceanWaveLineIntensity: 0.1,         // exp-082 V5: 0.2→0.1 (wave lines almost invisible)
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
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
    sunLightIntensity: 0.75,             // exp-081 V5: 0.65→0.75
    ambientIntensity: 0.15,              // exp-081 V5: 0.09→0.15
    grassBaseColor: [0.02, 0.07, 0.07],   // dark teal deepening
    grassTipColor: [0.06, 0.16, 0.14],    // teal tips — ocean recognition
    grassWindSpeed: 0.35,                 // exp-082 V5: 0.4→0.35 (wind building gradually)
    grassAmbientStrength: 0.26,          // exp-081 V5: 0.20→0.26
    grassTranslucency: 0.7,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.30,                // exp-081 V5: 0.25→0.30 (horizon glow building)
    bloomThreshold: 0.75,                // exp-081 V5: 0.78→0.75
    fogDepthStrength: 0.05,
    fogMidColor: [0.05, 0.09, 0.16],
    fogFarColor: [0.03, 0.06, 0.12],
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.20,
    colorGradeWarmth: 0.08,              // exp-081 V5: 0.05→0.08 (first hint of warmth)
    vignetteDarkness: 0.45,              // exp-081 V5: 0.50→0.45 (opening up)
    grainOpacity: 0.04,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.03,      // subtle — vastness registering
    waveWindDirX: 0.1,                  // exp-082 V5: 0.0→0.1 (wind shifting direction)
    waveWindDirY: 1.0,
    waveWindSpeed: 0.4,
    waveWindStrength: 0.12,              // exp-082 V5: 0.15→0.12 (building, not yet peak)
    // DOF — ocean emerging through soft focus (exp-081 V5: narrative DOF)
    dofFocusDistance: 15,                // exp-081 V5: 12→15 (wider, taking it in)
    dofBokehScale: 3.0,                 // exp-081 V5: 4.0→3.0 (moderate)
    // Split-tone — first warming (exp-081 V5: color temperature arc)
    splitToneWarm: [0.90, 0.76, 0.52],  // exp-081 V5: warming amber
    splitToneCool: [0.58, 0.72, 0.90],  // exp-081 V5: steel brightening
    // Ocean — the ocean comes into view, teal emerging (exp-082 V5: more vivid)
    oceanColorNear: [0.05, 0.26, 0.34],  // exp-082 V5: teal brightening more
    oceanColorFar: [0.02, 0.08, 0.14],   // deep blue
    oceanFoamBrightness: 0.70,           // exp-082 V5: 0.6→0.70 (foam dots emerging)
    oceanWaveLineIntensity: 0.6,         // exp-082 V5: 0.5→0.6 (wave lines appearing)
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // CONTEMPLATION — beside the figure, looking at the horizon together
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.80,                // exp-082 V5: 0.7→0.80 (sky opening above)
    sunElevation: -6,
    sunAzimuth: 250,
    turbidity: 1.3,
    rayleigh: 0.7,
    mieCoefficient: 0.006,
    mieDirectionalG: 0.86,
    fogColor: [0.03, 0.05, 0.09],
    fogDensity: 0.002,                   // exp-081 V5: 0.003→0.002 (clearest — infinite ocean)
    sunLightColor: [0.45, 0.50, 0.65],  // moonlight + lingering dusk
    sunLightIntensity: 1.0,              // exp-081 V5: 0.8→1.0
    ambientIntensity: 0.18,              // exp-081 V5: 0.10→0.18 (see the goodbye)
    grassBaseColor: [0.03, 0.08, 0.08],   // peak teal — contemplation at cliff edge
    grassTipColor: [0.08, 0.18, 0.16],    // teal-silver tips — moonlight on ocean grass
    grassWindSpeed: 0.60,  // exp-082 V5: 0.5→0.60 (world alive with someone — peak wind)
    grassAmbientStrength: 0.30,          // exp-081 V5: 0.22→0.30
    grassTranslucency: 0.8,
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.02,
    cloudDriftSpeed: 0.00004,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.45,                // exp-081 V5: 0.3→0.45 (luminous horizon)
    bloomThreshold: 0.65,                // exp-081 V5: 0.75→0.65 (ocean catches bloom)
    fogDepthStrength: 0.04,
    fogMidColor: [0.06, 0.10, 0.18],
    fogFarColor: [0.08, 0.10, 0.18],    // exp-081 V5: luminous blue-teal horizon
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.30,            // exp-081 V5: 0.25→0.30
    colorGradeWarmth: 0.22,              // exp-081 V5: 0.15→0.22 (peak warmth)
    vignetteDarkness: 0.28,              // exp-081 V5: 0.42→0.28 (wide open — expansive)
    grainOpacity: 0.05,                  // exp-081 V5: 0.03→0.05 (faded memory grain)
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.05,      // minimal — focus is on DOF here, not CA
    waveWindDirX: 0.3,                  // exp-082 V5: 0.0→0.3 (wind shifts direction with someone)
    waveWindDirY: 1.0,
    waveWindSpeed: 0.5,
    waveWindStrength: 0.28,  // exp-082 V5: 0.2→0.28 (PEAK sea breeze — world most alive)
    // DOF — intimate focus (exp-081 V5: tighter than before)
    dofFocusDistance: 5,                 // exp-081 V5: 8→5 (tighter intimate focus)
    dofBokehScale: 6.5,                 // exp-081 V5: 5.5→6.5 (heavier bokeh)
    // Split-tone peak — ocean teal highlights (exp-081 V5: color temperature arc)
    splitToneWarm: [0.95, 0.82, 0.52],  // exp-081 V5: peak amber
    splitToneCool: [0.50, 0.72, 0.85],  // exp-081 V5: ocean teal (audience color!)
    // Ocean peak — FULL vividity, the feeling reveals itself (exp-082 V5: peak teal)
    oceanColorNear: [0.08, 0.34, 0.44],  // exp-082 V5: PEAK teal — "the feeling you can't name" at its most vivid
    oceanColorFar: [0.02, 0.10, 0.16],   // midnight blue
    oceanFoamBrightness: 1.0,            // full foam — the feeling reveals itself
    oceanWaveLineIntensity: 0.95,        // exp-082 V5: 0.8→0.95 (wave lines clearest — the ocean breathes)
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // UNDERSTANDING — the goodbye becomes real, the most intimate moment
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.95,                // exp-082 V5: 0.8→0.95 (PEAK — truths visible only in darkness)
    sunElevation: -8,      // deeper into night
    sunAzimuth: 245,
    turbidity: 1.5,
    rayleigh: 0.8,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.85,
    fogColor: [0.03, 0.04, 0.08],
    fogDensity: 0.003,                   // exp-081 V5: 0.004→0.003 (still clear for goodbye)
    sunLightColor: [0.38, 0.42, 0.58],
    sunLightIntensity: 0.75,             // exp-081 V5: 0.6→0.75
    ambientIntensity: 0.15,              // exp-081 V5: 0.08→0.15 (see the goodbye)
    grassBaseColor: [0.02, 0.06, 0.06],   // darkening teal — the goodbye
    grassTipColor: [0.06, 0.14, 0.12],    // muted teal — warmth fading
    grassWindSpeed: 0.38,                // exp-082 V5: 0.4→0.38 (wind subsiding, goodbye)
    grassAmbientStrength: 0.26,          // exp-081 V5: 0.18→0.26
    grassTranslucency: 0.6,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.01,
    cloudDriftSpeed: 0.00002,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.35,                // exp-081 V5: 0.25→0.35 (horizon glow sustained)
    bloomThreshold: 0.70,                // exp-081 V5: 0.80→0.70
    fogDepthStrength: 0.05,
    fogMidColor: [0.05, 0.08, 0.14],
    fogFarColor: [0.06, 0.08, 0.14],    // exp-081 V5: luminous horizon sustained
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.22,            // exp-081 V5: 0.18→0.22
    colorGradeWarmth: 0.18,              // exp-081 V5: 0.12→0.18 (warmth sustained)
    vignetteDarkness: 0.45,              // exp-081 V5: 0.52→0.45 (still open)
    grainOpacity: 0.05,                  // exp-081 V5: 0.04→0.05 (memory grain)
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.08,      // slight distortion — star-bokeh synergy moment
    waveWindDirX: 0.15,                  // exp-082 V5: 0.0→0.15 (wind shifting back)
    waveWindDirY: 1.0,
    waveWindSpeed: 0.4,
    waveWindStrength: 0.14,              // exp-082 V5: 0.15→0.14 (wind calming)
    // DOF — MOST intimate, the goodbye IS the peak (exp-081 V5: narrative DOF)
    dofFocusDistance: 4,                 // exp-081 V5: 8→4 (closest focus = most intimate)
    dofBokehScale: 7.0,                 // exp-081 V5: 5.0→7.0 (heaviest bokeh — the goodbye)
    // Split-tone — amber holding, teal creeping in (exp-081 V5)
    splitToneWarm: [0.92, 0.78, 0.52],  // exp-081 V5: amber sustained
    splitToneCool: [0.52, 0.74, 0.88],  // exp-081 V5: teal-touched cooling
    // Ocean sustained — beauty in the sadness (exp-082 V5: held slightly brighter)
    oceanColorNear: [0.06, 0.28, 0.36],  // exp-082 V5: slightly brighter — holding the feeling
    oceanColorFar: [0.02, 0.08, 0.14],
    oceanFoamBrightness: 0.75,           // exp-082 V5: 0.8→0.75 (foam softening)
    oceanWaveLineIntensity: 0.65,        // exp-082 V5: 0.7→0.65 (wave lines fading)
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // RELEASE — 7-dimensional sensory dissolution
    // exp-082 V5: Each layer removes a DIFFERENT dimension of visual reality:
    // DOF (spatial) + vibrance drain (color) + contrast flatten (tonal) +
    // fog (depth) + vignette (peripheral) + wind death (temporal) + grain (material)
    // "You can't hold onto ANY aspect of the world."
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.35,                // exp-082 V5: 0.6→0.35 (even the truths go dark)
    sunElevation: -10,
    sunAzimuth: 240,
    turbidity: 1.5,
    rayleigh: 0.8,
    mieCoefficient: 0.003,
    mieDirectionalG: 0.85,
    fogColor: [0.02, 0.03, 0.06],
    fogDensity: 0.015,                   // exp-082 V5: 0.012→0.015 (fog THICKER — horizon swallowed)
    sunLightColor: [0.32, 0.36, 0.52],
    sunLightIntensity: 0.4,              // exp-081 V5: 0.35→0.4 (last visibility)
    ambientIntensity: 0.10,              // exp-081 V5: 0.06→0.10 (still visible)
    grassBaseColor: [0.01, 0.04, 0.04],   // near-black teal — dissolution
    grassTipColor: [0.04, 0.10, 0.09],    // barely visible — the release
    grassWindSpeed: 0.08,                // exp-082 V5: 0.2→0.08 (world stopped breathing)
    grassAmbientStrength: 0.18,          // exp-081 V5: 0.14→0.18
    grassTranslucency: 0.4,
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.04,                // exp-082 V5: 0.08→0.04 (glow extinguished)
    bloomThreshold: 0.92,                // exp-082 V5: 0.90→0.92 (nothing catches bloom)
    fogDepthStrength: 0.07,
    fogMidColor: [0.04, 0.06, 0.12],
    fogFarColor: [0.02, 0.04, 0.08],
    colorGradeContrast: 0.01,            // exp-082 V5: 0.03→0.01 (FLAT — tonal clarity gone)
    colorGradeVibrance: 0.03,            // exp-082 V5: 0.08→0.03 (color DRAINED — world goes gray)
    colorGradeWarmth: 0.05,              // exp-081 V5: residual warmth (you carry it home)
    vignetteDarkness: 0.82,              // exp-082 V5: 0.75→0.82 (tunnel CLOSING — peripheral gone)
    grainOpacity: 0.08,                  // exp-082 V5: 0.06→0.08 (memory DEGRADING)
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.15,      // 8th dimension of dissolution — lens can't hold the image
    waveWindDirX: 0.0,
    waveWindDirY: 1.0,
    waveWindSpeed: 0.25,
    waveWindStrength: 0.02,              // exp-082 V5: 0.08→0.02 (no more sea breeze)
    // DOF — EXTREME dissolve: world becomes abstract blur (exp-081 V5: +6 at P5)
    dofFocusDistance: 50,                // exp-081 V5: 20→50 (can't focus on anything)
    dofBokehScale: 8.0,                 // exp-081 V5: 3.0→8.0 (everything is soft orbs of light)
    // Split-tone — teal-touched amber: "the goodbye changed your color" (exp-081 V5)
    splitToneWarm: [0.82, 0.72, 0.62],  // exp-081 V5: teal crept into the amber — you leave carrying their color
    splitToneCool: [0.48, 0.65, 0.80],  // exp-081 V5: deep teal — the ocean's imprint
    // Ocean dissolved — the feeling you can't hold (exp-082 V5: deeper dissolution)
    oceanColorNear: [0.01, 0.06, 0.10],  // exp-082 V5: nearly black — feeling dissolves
    oceanColorFar: [0.01, 0.04, 0.08],   // deep void
    oceanFoamBrightness: 0.05,           // exp-082 V5: 0.2→0.05 (one last white dot, then nothing)
    oceanWaveLineIntensity: 0.03,        // exp-082 V5: 0.15→0.03 (wave lines vanished)
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
