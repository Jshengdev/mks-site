// Tide Pool atmosphere keyframes — Infinite Smallness
// Scroll arc: Surface → Descending → Immersion → Deep → Crevice
// "The universe exists at every scale. What is small to you
//  is infinite to something else."
//
// You are TINY. The tide pool is a cathedral. Scrolling takes you
// deeper. Light refracts through the water surface above — caustic
// patterns paint everything. Colors shift with depth as the water
// absorbs wavelengths. Red dies first. Then green. Only blue survives.
// At the bottom, bioluminescence is the only warmth.
//
// Unique atmosphere properties for this world:
//   causticIntensity — brightness of projected caustic light patterns
//   causticSpeed — animation speed of caustic patterns
//   absorptionDepth — how aggressively color shifts with depth (0=none, 1=full)
//   bioluminBrightness — bioluminescent plankton glow intensity
//   bubbleOpacity — bubble particle visibility
//   anemoneSwaySpeed — tentacle animation speed
//   waterSurfaceRipple — surface distortion intensity (seen from below)

export const TIDE_POOL_KEYFRAMES = [
  {
    t: 0.0, // SURFACE — rim of the pool, warm light, looking down into clear water
    // The world is bright and inviting. You haven't entered yet.
    // Caustics are visible but distant — dancing on the rocks below.
    // Full-spectrum light. Everything is sharp and clear.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 45,          // high sun — strong overhead light for caustics
    sunAzimuth: 200,
    turbidity: 2.0,
    rayleigh: 1.0,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.80,
    fogColor: [0.10, 0.22, 0.25],       // teal-green, water scatter
    fogDensity: 0.005,                   // light scatter near surface
    sunLightColor: [0.55, 0.70, 0.80],  // cyan-shifted daylight through water
    sunLightIntensity: 1.4,              // bright — near-surface illumination
    ambientIntensity: 0.20,              // well-lit shallow water
    grassBaseColor: [0.04, 0.12, 0.06], // algae on rock (used for terrain tint)
    grassTipColor: [0.08, 0.20, 0.10],
    grassWindSpeed: 0.0,                 // no grass in tide pool
    grassAmbientStrength: 0.30,
    grassTranslucency: 0.0,
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.08,            // ripple shadows from surface above
    cloudDriftSpeed: 0.0001,             // surface ripple drift
    fireflyBrightness: 0.0,             // bioluminescence not yet visible
    fireflySize: 30,
    bloomIntensity: 0.5,                 // moderate — caustic light scatter
    bloomThreshold: 0.6,
    fogDepthStrength: 0.03,
    fogMidColor: [0.08, 0.18, 0.22],
    fogFarColor: [0.05, 0.12, 0.18],
    colorGradeContrast: 0.08,            // good contrast at surface
    colorGradeVibrance: 0.40,            // vivid — full spectrum visible
    colorGradeWarmth: 0.12,              // slight warmth from sunlight
    vignetteDarkness: 0.45,              // moderate — peering into the pool
    grainOpacity: 0.03,                  // clean water
    dustMoteBrightness: 0.3,             // particles in water catching light
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 12,                // looking DOWN into pool — moderate distance
    dofBokehScale: 4.0,                 // macro DOF starting gentle
    splitToneWarm: [0.85, 0.75, 0.55],  // warm amber from sunlight
    splitToneCool: [0.55, 0.75, 0.85],  // cool teal of water
    oceanColorNear: [0, 0, 0],          // no ocean plane in tide pool
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // DESCENDING — breaking the surface tension, entering the water
    // The world above becomes rippled and distorted. Colors begin to shift.
    // Red starts to fade. Caustics intensify — you're INSIDE the projection now.
    // Anemones appear as silhouettes, then resolve into detail.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 40,
    sunAzimuth: 205,
    turbidity: 2.5,
    rayleigh: 0.8,
    mieCoefficient: 0.008,
    mieDirectionalG: 0.82,
    fogColor: [0.06, 0.18, 0.22],       // deeper teal — absorption starting
    fogDensity: 0.010,                   // thickening — underwater scatter
    sunLightColor: [0.40, 0.65, 0.78],  // red fading, blue-green dominant
    sunLightIntensity: 1.1,              // dimming as you descend
    ambientIntensity: 0.16,
    grassBaseColor: [0.03, 0.10, 0.05],
    grassTipColor: [0.06, 0.16, 0.08],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.26,
    grassTranslucency: 0.0,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.15,            // caustic shadows PEAK — inside the projection
    cloudDriftSpeed: 0.00015,            // caustic dance speed
    fireflyBrightness: 0.1,             // first hints of bioluminescence
    fireflySize: 35,
    bloomIntensity: 0.7,                 // STRONGER — caustic light scatter in water
    bloomThreshold: 0.50,                // more elements catch bloom underwater
    fogDepthStrength: 0.05,
    fogMidColor: [0.05, 0.15, 0.20],
    fogFarColor: [0.03, 0.10, 0.15],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.35,            // still vivid but red fading
    colorGradeWarmth: 0.05,              // warmth fading — red absorbed
    vignetteDarkness: 0.55,              // edges darkening — water above
    grainOpacity: 0.03,
    dustMoteBrightness: 0.5,             // particles catching caustic light
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 6,                 // MACRO — anemones coming into focus
    dofBokehScale: 6.0,                 // heavy bokeh — macro lens activated
    splitToneWarm: [0.70, 0.68, 0.50],  // warm fading — absorption
    splitToneCool: [0.45, 0.72, 0.88],  // teal strengthening
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // IMMERSION — among the anemone forest, peak wonder
    // You are IN IT. Anemone tentacles sway around you like redwood branches.
    // Caustic light paints everything in shifting geometric patterns.
    // The color palette is pure green-blue — red is fully absorbed.
    // This is the emotional peak: the cathedral revealed.
    // Macro DOF at maximum — objects dissolve into colored bokeh.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 35,
    sunAzimuth: 210,
    turbidity: 3.0,
    rayleigh: 0.6,
    mieCoefficient: 0.012,              // more scatter = more underwater haze
    mieDirectionalG: 0.85,
    fogColor: [0.04, 0.14, 0.18],       // deep teal — peak underwater color
    fogDensity: 0.014,                   // thick — cathedral atmosphere
    sunLightColor: [0.25, 0.55, 0.72],  // RED GONE — green-blue only
    sunLightIntensity: 0.85,             // dimmer but still illuminated
    ambientIntensity: 0.14,
    grassBaseColor: [0.02, 0.08, 0.06],
    grassTipColor: [0.04, 0.14, 0.10],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.22,
    grassTranslucency: 0.0,
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.12,            // caustic shadows still strong
    cloudDriftSpeed: 0.00012,
    fireflyBrightness: 0.5,             // bioluminescence emerging
    fireflySize: 45,                     // larger = closer macro scale
    bloomIntensity: 0.9,                 // PEAK BLOOM — underwater light scatter
    bloomThreshold: 0.45,                // everything glows
    fogDepthStrength: 0.06,
    fogMidColor: [0.03, 0.12, 0.16],
    fogFarColor: [0.02, 0.08, 0.12],
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.30,            // green-blue vivid, red dead
    colorGradeWarmth: -0.05,             // NEGATIVE warmth — cold underwater shift
    vignetteDarkness: 0.60,              // darkening edges — deeper water
    grainOpacity: 0.04,
    dustMoteBrightness: 0.7,             // peak particle visibility
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 3,                 // EXTREME MACRO — focus plane at arm's length
    dofBokehScale: 7.5,                 // HEAVIEST bokeh — the defining visual
    splitToneWarm: [0.50, 0.60, 0.48],  // warm is now green-shifted (absorption)
    splitToneCool: [0.35, 0.68, 0.85],  // deep ocean teal
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // DEEP — rock floor, starfish territory, darkness settling
    // The anemone canopy is above you now. You're on the floor.
    // Starfish are continent-sized beneath you. Light is scarce —
    // only blue wavelengths survive. Bioluminescence becomes the
    // primary light source. The world is intimate and alien.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 30,
    sunAzimuth: 215,
    turbidity: 4.0,
    rayleigh: 0.4,
    mieCoefficient: 0.015,
    mieDirectionalG: 0.88,
    fogColor: [0.02, 0.08, 0.12],       // deep blue-black
    fogDensity: 0.020,                   // HEAVY — deep water
    sunLightColor: [0.12, 0.35, 0.60],  // GREEN FADING — blue-dominant now
    sunLightIntensity: 0.45,             // much dimmer
    ambientIntensity: 0.08,              // dark
    grassBaseColor: [0.01, 0.05, 0.04],
    grassTipColor: [0.02, 0.10, 0.08],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.15,
    grassTranslucency: 0.0,
    grassFogFade: 0.006,
    cloudShadowOpacity: 0.06,            // caustics dimming with depth
    cloudDriftSpeed: 0.00008,
    fireflyBrightness: 1.2,             // BIOLUMINESCENCE PEAK — primary light source
    fireflySize: 55,                     // large, close, intimate
    bloomIntensity: 0.65,                // bloom on bioluminescence
    bloomThreshold: 0.40,
    fogDepthStrength: 0.08,
    fogMidColor: [0.02, 0.06, 0.10],
    fogFarColor: [0.01, 0.04, 0.08],
    colorGradeContrast: 0.03,            // low contrast — deep water flattens
    colorGradeVibrance: 0.18,            // muted — only blue survives naturally
    colorGradeWarmth: -0.10,             // COLD — deep underwater
    vignetteDarkness: 0.75,              // heavy edges — deep well effect
    grainOpacity: 0.05,
    dustMoteBrightness: 0.4,             // particles dimmer at depth
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 2,                 // EXTREME close focus — intimate macro
    dofBokehScale: 6.0,                 // heavy but slightly less than peak (floor is flat)
    splitToneWarm: [0.35, 0.45, 0.55],  // "warm" is now blue-shifted entirely
    splitToneCool: [0.20, 0.50, 0.75],  // deep deep blue
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // CREVICE — bottom of the pool, near darkness, single bioluminescent pulse
    // Almost everything is absorbed. The surface above is a rippling
    // ghost of light — impossibly distant. A single creature pulses
    // in the dark. You realize: this darkness is someone's entire sky.
    // What is small to you is infinite to something else.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 25,          // sun still there, just can't reach
    sunAzimuth: 220,
    turbidity: 5.0,
    rayleigh: 0.3,
    mieCoefficient: 0.018,
    mieDirectionalG: 0.90,
    fogColor: [0.01, 0.04, 0.08],       // near-black blue
    fogDensity: 0.030,                   // THICKEST — deep water absorption
    sunLightColor: [0.06, 0.18, 0.40],  // ONLY BLUE SURVIVES
    sunLightIntensity: 0.15,             // barely any surface light
    ambientIntensity: 0.04,              // near-darkness
    grassBaseColor: [0.01, 0.03, 0.03],
    grassTipColor: [0.01, 0.06, 0.05],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.10,
    grassTranslucency: 0.0,
    grassFogFade: 0.008,
    cloudShadowOpacity: 0.02,            // caustics barely visible — ghost patterns
    cloudDriftSpeed: 0.00004,
    fireflyBrightness: 1.8,             // BIOLUMINESCENCE IS THE ONLY LIGHT
    fireflySize: 65,                     // huge, intimate, close
    bloomIntensity: 0.85,                // bloom on bioluminescence — everything glows
    bloomThreshold: 0.35,                // low threshold — bioluminescence BLOOMS
    fogDepthStrength: 0.10,
    fogMidColor: [0.01, 0.04, 0.07],
    fogFarColor: [0.01, 0.02, 0.05],
    colorGradeContrast: 0.02,            // nearly flat — deep water
    colorGradeVibrance: 0.12,            // only bioluminescent colors have saturation
    colorGradeWarmth: -0.15,             // DEEPEST COLD — no warmth reaches here
    vignetteDarkness: 0.90,              // MAXIMUM — peering through the abyss
    grainOpacity: 0.06,                  // slight noise — deep water impurity
    dustMoteBrightness: 0.2,             // faint particles in the dark
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 1.5,               // CLOSEST — intimate macro in darkness
    dofBokehScale: 8.0,                 // maximum bokeh — bioluminescent orbs
    splitToneWarm: [0.20, 0.30, 0.50],  // "warm" is pure blue now — absorption complete
    splitToneCool: [0.10, 0.35, 0.65],  // deep ocean blue
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
