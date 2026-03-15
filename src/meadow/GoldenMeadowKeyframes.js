// Golden Meadow atmosphere keyframes — Innocent Awakening
// Scroll arc: Stillness → Awakening → Alive → Deepening → Quieting
// "Cold world, warm moments. Warmth is the reward for engagement."
// The Hidden Sun: artist is the sun, music is the light, world is what light transforms.
//
// GOLDEN RUINS archetype (exp-058, 67/70) — multiplicative convergence.
// Every atmospheric dimension (bloom, godrays, translucency, wind, warmth, painterly)
// peaks simultaneously at DEEPENING (t=0.75). The convergence IS the revelation —
// the Hidden Sun doesn't show one thing, it transforms EVERYTHING at once.
//
// Source: exp-058 cymatics (67/70), exp-030 reaction-diffusion grass,
// exp-055 electromagnetic field-line alignment, exp-079 Navier-Stokes fluid wind,
// exp-064 SIR epidemic awakening
//
// Over base MEADOW_KEYFRAMES: bloom 1.0→1.8, godrays 1.0→1.8, translucency 3.0→4.0,
// wind 2.2→3.5, kuwahara 0.35→0.65, vibrance 0.9→1.4, CA 0.02→0.30

export const GOLDEN_MEADOW_KEYFRAMES = [
  {
    t: 0.0, // STILLNESS — cold world, sacred anticipation, held breath
    // Darker than base to maximize contrast with DEEPENING convergence.
    // The world is asleep. Not dead — waiting.
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: 2,
    sunAzimuth: 250,
    turbidity: 12,
    rayleigh: 3.0,
    mieCoefficient: 0.015,
    mieDirectionalG: 0.95,
    fogColor: [0.10, 0.14, 0.22],      // colder steel-blue — deeper silence
    fogDensity: 0.020,                  // thicker than base (0.018) — more hidden
    sunLightColor: [0.40, 0.45, 0.58],  // cooler blue-steel
    sunLightIntensity: 0.20,            // dimmer — deeper sleep
    ambientIntensity: 0.03,             // near-dark — the void before music
    grassBaseColor: [0.01, 0.02, 0.02], // near-black
    grassTipColor: [0.02, 0.06, 0.05], // barely visible teal
    grassWindSpeed: 0.05,               // near-frozen — not even a breath
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.2,             // no glow yet — light hasn't arrived
    grassFogFade: 0.006,
    cloudShadowOpacity: 0.02,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.08,               // barely any glow
    bloomThreshold: 0.92,               // only brightest spots
    fogDepthStrength: 0.06,
    fogMidColor: [0.20, 0.25, 0.38],
    fogFarColor: [0.10, 0.12, 0.22],
    colorGradeContrast: 0.02,           // flat — no drama yet
    colorGradeVibrance: 0.08,           // desaturated cold world
    colorGradeWarmth: 0.0,              // zero warmth — earned later
    vignetteDarkness: 0.88,             // tight tunnel — world is small
    grainOpacity: 0.06,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,               // no rays — sun is hidden
    kuwaharaStrength: 0.0,              // sharp — reality is clear and cold
    caDistortion: 0.0,                  // clean lens in innocence
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.15,
    waveWindStrength: 0.0,              // frozen
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // AWAKENING — first warmth, light finds a crack
    // The epidemic begins. One blade catches light, then two, then a patch.
    // Wind stirs. The convergence is seeding.
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: 5,
    sunAzimuth: 245,
    turbidity: 13,
    rayleigh: 2.2,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.94,
    fogColor: [0.35, 0.32, 0.30],       // cold warming to neutral amber
    fogDensity: 0.010,                   // thinning — revealing
    sunLightColor: [0.70, 0.65, 0.55],   // first amber hint
    sunLightIntensity: 0.7,
    ambientIntensity: 0.08,
    grassBaseColor: [0.03, 0.08, 0.02],
    grassTipColor: [0.10, 0.25, 0.06],   // first green showing
    grassWindSpeed: 0.5,                  // first stir
    grassAmbientStrength: 0.25,
    grassTranslucency: 0.9,              // first hint of backlit glow
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.06,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.0,
    fireflySize: 35,
    bloomIntensity: 0.25,                // gentle glow beginning
    bloomThreshold: 0.78,
    fogDepthStrength: 0.04,
    fogMidColor: [0.55, 0.48, 0.38],
    fogFarColor: [0.35, 0.32, 0.35],
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.30,            // color waking up
    colorGradeWarmth: 0.02,              // first earned warmth
    vignetteDarkness: 0.65,              // opening slightly
    grainOpacity: 0.04,
    dustMoteBrightness: 0.15,            // first motes catching light
    godRayIntensity: 0.10,               // first ray breaks through
    kuwaharaStrength: 0.0,               // still sharp — reality
    caDistortion: 0.0,                   // still clean
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.35,
    waveWindStrength: 0.08,              // first wave ripple
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // ALIVE — golden hour arrives, the music is playing
    // The epidemic spreads. Every blade is lit. Wind carries the awakening
    // across the field in visible waves. Bloom builds. Godrays reach.
    // The convergence is accelerating — you can FEEL it building.
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: 8,
    sunAzimuth: 235,
    turbidity: 10,
    rayleigh: 1.5,
    mieCoefficient: 0.018,
    mieDirectionalG: 0.93,
    fogColor: [0.80, 0.65, 0.38],        // warm golden haze building
    fogDensity: 0.004,
    sunLightColor: [1.0, 0.88, 0.65],    // full golden light
    sunLightIntensity: 1.5,
    ambientIntensity: 0.14,
    grassBaseColor: [0.06, 0.16, 0.02],
    grassTipColor: [0.22, 0.48, 0.10],   // vivid green-gold
    grassWindSpeed: 1.8,                  // strong wind building
    grassAmbientStrength: 0.35,
    grassTranslucency: 2.5,              // strong backlit glow — light is winning
    grassFogFade: 0.0015,
    cloudShadowOpacity: 0.15,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.5,
    fireflySize: 70,
    bloomIntensity: 0.75,                // building toward convergence
    bloomThreshold: 0.48,
    fogDepthStrength: 0.07,
    fogMidColor: [0.95, 0.78, 0.45],
    fogFarColor: [0.55, 0.50, 0.45],
    colorGradeContrast: 0.10,
    colorGradeVibrance: 0.75,            // colors intensifying
    colorGradeWarmth: 0.06,
    vignetteDarkness: 0.38,              // opening up — world expanding
    grainOpacity: 0.03,
    dustMoteBrightness: 0.8,
    godRayIntensity: 0.55,               // rays clearly visible
    kuwaharaStrength: 0.15,              // first painterly softening
    caDistortion: 0.05,                  // first lens stress from intensity
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.7,
    waveWindStrength: 0.25,              // visible wave grass
    dofFocusDistance: 0,
    dofBokehScale: 3.5,
    splitToneWarm: [0.95, 0.75, 0.50],   // warming
    splitToneCool: [0.85, 0.78, 0.88],
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // DEEPENING — GOLDEN RUINS convergence peak (exp-058, 67/70)
    // The Hidden Sun revealed. Every system peaks simultaneously:
    // bloom 1.8, godrays 1.8, translucency 4.0, wind 3.5, kuwahara 0.65.
    // "A source of light hidden behind something massive, whose rays fan out
    //  and touch everything." The multiplicative convergence IS the revelation.
    // The lens can barely hold the image (CA 0.30). The world becomes a painting
    // (kuwahara 0.65). Reality is oversaturated (vibrance 1.4). Everything glows.
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: 1,                     // sun nearly kissing horizon — maximum ray length
    sunAzimuth: 200,                     // behind artist figure (z=-145, x=2)
    turbidity: 14,                       // thick amber haze — the world is GOLDEN
    rayleigh: 3.5,
    mieCoefficient: 0.035,               // extreme sun haze
    mieDirectionalG: 0.98,               // tight directional scatter
    fogColor: [1.0, 0.55, 0.10],         // deep amber-orange (#ff8c1a)
    fogDensity: 0.005,
    sunLightColor: [1.0, 0.75, 0.40],    // deep amber-gold
    sunLightIntensity: 2.5,              // blazing — higher than base (2.2)
    ambientIntensity: 0.06,              // low ambient = dramatic contrast with sun
    grassBaseColor: [0.10, 0.07, 0.02],  // dark warm base (#1a1205)
    grassTipColor: [0.55, 0.48, 0.10],   // amber-gold tips (#8c7a1a)
    grassWindSpeed: 3.5,                 // cymatics wind — field is alive
    grassAmbientStrength: 0.15,
    grassTranslucency: 4.0,             // EXTREME backlit glow — "the music IS the light"
    grassFogFade: 0.0005,
    cloudShadowOpacity: 0.08,
    cloudDriftSpeed: 0.00008,
    fireflyBrightness: 1.5,             // golden sparks — convergence particles
    fireflySize: 140,                    // large — close, intimate
    bloomIntensity: 1.8,                 // CONVERGENCE PEAK — cinematic overexposure
    bloomThreshold: 0.25,                // everything blooms — light overflowing
    fogDepthStrength: 0.12,
    fogMidColor: [1.0, 0.67, 0.20],      // #ffaa33
    fogFarColor: [0.80, 0.40, 0.20],     // #cc6633
    colorGradeContrast: 0.20,            // strong contrast at peak
    colorGradeVibrance: 1.4,             // HYPER-VIVID — impossible colors that feel real
    colorGradeWarmth: 0.20,              // strong warm split-tone
    vignetteDarkness: 0.20,              // wide open — expansive, not constricted
    grainOpacity: 0.01,                  // minimal — clarity at peak
    dustMoteBrightness: 1.5,             // golden motes everywhere
    godRayIntensity: 1.8,               // CONVERGENCE PEAK — rays fan out and touch everything
    kuwaharaStrength: 0.65,              // PAINTERLY — the world becomes a painting at peak
    caDistortion: 0.30,                  // LENS STRESS — the lens can barely hold the image
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 1.2,
    waveWindStrength: 0.50,              // strong rolling waves
    dofFocusDistance: 0,
    dofBokehScale: 5.0,                  // soft background at peak
    splitToneWarm: [1.0, 0.67, 0.27],    // #ffaa44 — warm amber highlights
    splitToneCool: [0.53, 0.40, 0.53],   // #886688 — muted purple shadows
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // QUIETING — dusk haze, the aftermath, exhale
    // The convergence recedes. Not disappears — recedes. The world remembers
    // what just happened. Bloom fades but warmth lingers. Wind settles but
    // the grass still sways. The painting softens back toward photography.
    // "The light changed everything, and now everything rests."
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: 6,                     // settling higher — dusk, not sunset
    sunAzimuth: 220,
    turbidity: 11,
    rayleigh: 1.8,
    mieCoefficient: 0.010,
    mieDirectionalG: 0.93,
    fogColor: [0.50, 0.45, 0.38],        // warm neutral dusk — warmth lingers
    fogDensity: 0.007,                   // fog returning — dissolution
    sunLightColor: [0.85, 0.78, 0.65],   // still warm — the goodbye changed your color
    sunLightIntensity: 0.9,
    ambientIntensity: 0.12,
    grassBaseColor: [0.04, 0.12, 0.03],
    grassTipColor: [0.16, 0.36, 0.10],   // muted green — warmth fading
    grassWindSpeed: 0.6,                 // wind settling — exhale
    grassAmbientStrength: 0.32,
    grassTranslucency: 1.6,              // glow fading but still present
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.06,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.5,             // fireflies linger
    fireflySize: 65,
    bloomIntensity: 0.40,                // settled — light resting
    bloomThreshold: 0.68,
    fogDepthStrength: 0.06,
    fogMidColor: [0.65, 0.58, 0.48],
    fogFarColor: [0.42, 0.40, 0.40],
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.45,            // color settling
    colorGradeWarmth: 0.04,              // warmth lingers
    vignetteDarkness: 0.55,              // closing gently
    grainOpacity: 0.04,                  // grain returns — film aging
    dustMoteBrightness: 0.35,
    godRayIntensity: 0.25,               // last rays lingering
    kuwaharaStrength: 0.08,              // barely painterly — back to photography
    caDistortion: 0.02,                  // lens settling
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.3,
    waveWindStrength: 0.10,              // settling
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
