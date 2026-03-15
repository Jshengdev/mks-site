// Crystal Cavern atmosphere keyframes — Sacred Discovery
// Scroll arc: Threshold → Descent → Prismatic → Resonance → Communion
// "Deep underground, where sound becomes light and light becomes feeling.
//  The crystals don't reflect — they remember."
//
// UNDERGROUND throughout. sunElevation ALWAYS negative. No natural light.
// All illumination comes from crystals — purple-blue refracted light.
// Fireflies repurposed as crystal sparkle particles.
//
// Source techniques:
//   Chromatic dispersion: Taylor Petrick (separate RGB IOR), Maxime Heckel (multi-sample loop)
//   Subsurface scattering: mattdesl fast SSS gist (thicknessPower=16, thicknessScale=5)
//   Crystal SDF: Varun Vachhar rhombic triacontahedron (space-folding technique)
//   Iridescence: iquilez cosine palette — pal(t, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0,0.33,0.67))

export const CRYSTAL_CAVERN_KEYFRAMES = [
  {
    t: 0.0, // THRESHOLD — cavern entrance. Near total darkness. One distant glint.
    // You stand at the mouth. The world above is gone.
    // Darkness so thick it has texture. The faintest prismatic glint ahead.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,     // underground — no stars
    sunElevation: -30,        // DEEP UNDERGROUND — no sun, ever
    sunAzimuth: 180,
    turbidity: 2.0,
    rayleigh: 0.3,
    mieCoefficient: 0.008,
    mieDirectionalG: 0.95,
    fogColor: [0.03, 0.01, 0.05],   // deep purple-black cave air
    fogDensity: 0.020,        // dense underground fog
    sunLightColor: [0.30, 0.20, 0.80],  // purple-blue crystal-refracted light, NOT sunlight
    sunLightIntensity: 0.4,   // dim, mysterious
    ambientIntensity: 0.01,   // near darkness — you can barely see your hands
    grassBaseColor: [0.03, 0.01, 0.04],  // dark purple stone
    grassTipColor: [0.10, 0.15, 0.30],   // crystal blue hints on edges
    grassWindSpeed: 0.0,      // no wind underground
    grassAmbientStrength: 0.05,
    grassTranslucency: 0.0,   // stone doesn't transmit
    grassFogFade: 0.006,
    cloudShadowOpacity: 0.0,  // underground — no clouds
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.8,   // crystal sparkle particles — the ONLY light source
    fireflySize: 60,          // large sparkle points
    bloomIntensity: 1.0,      // crystals GLOW
    bloomThreshold: 0.3,      // low — everything prismatic glows
    fogDepthStrength: 0.10,
    fogMidColor: [0.04, 0.02, 0.07],
    fogFarColor: [0.02, 0.01, 0.04],
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.05,  // almost monochrome at entrance
    colorGradeWarmth: 0.0,     // cold world — warmth is below
    vignetteDarkness: 0.90,    // heavy darkness at edges — cave walls close in
    grainOpacity: 0.04,        // subtle cave atmosphere
    dustMoteBrightness: 0.3,
    godRayIntensity: 0.0,      // NO god rays — there is no sun
    kuwaharaStrength: 0.0,     // crystals need sharp facets
    caDistortion: 0.80,        // STRONG prismatic refraction — light shatters through crystal
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,     // no wind underground
    dofFocusDistance: 12,
    dofBokehScale: 4.0,
    splitToneWarm: [0.60, 0.40, 0.85],  // purple crystal warmth
    splitToneCool: [0.30, 0.20, 0.60],  // deep violet shadows
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // DESCENT — first crystal clusters appear. Faint prismatic rainbows on stone.
    // You've committed to the descent. Crystal clusters on the walls
    // catch some distant refracted light and split it — tiny rainbows flicker.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: -35,         // deeper underground
    sunAzimuth: 190,
    turbidity: 1.5,
    rayleigh: 0.2,
    mieCoefficient: 0.010,     // more scatter from crystal dust
    mieDirectionalG: 0.92,
    fogColor: [0.04, 0.02, 0.08],   // deeper purple
    fogDensity: 0.016,         // thinning slightly — passage opens
    sunLightColor: [0.35, 0.25, 0.75],  // purple-blue crystal light intensifying
    sunLightIntensity: 0.5,    // crystals refracting more
    ambientIntensity: 0.02,    // first crystal reflections add faint fill
    grassBaseColor: [0.04, 0.02, 0.06],  // dark purple stone, slightly lighter
    grassTipColor: [0.12, 0.18, 0.35],   // more crystal blue on edges
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.08,
    grassTranslucency: 0.1,    // faintest subsurface in small crystals
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 1.0,    // crystal sparkles growing — more facets catching light
    fireflySize: 65,
    bloomIntensity: 1.1,       // bloom increasing — prismatic refractions glow
    bloomThreshold: 0.28,
    fogDepthStrength: 0.08,
    fogMidColor: [0.05, 0.03, 0.10],
    fogFarColor: [0.03, 0.02, 0.06],
    colorGradeContrast: 0.07,
    colorGradeVibrance: 0.15,  // color appearing — prismatic hints
    colorGradeWarmth: 0.0,     // still cold
    vignetteDarkness: 0.85,    // slightly opening
    grainOpacity: 0.04,
    dustMoteBrightness: 0.5,   // crystal dust catching refracted light
    godRayIntensity: 0.0,      // no god rays underground
    kuwaharaStrength: 0.0,
    caDistortion: 0.90,        // prismatic refraction intensifying
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 8,
    dofBokehScale: 5.0,        // heavy bokeh — out-of-focus crystals become prismatic blur
    splitToneWarm: [0.65, 0.45, 0.85],  // purple warmth growing
    splitToneCool: [0.35, 0.25, 0.65],  // purple deepening
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // PRISMATIC — deep now. Light fractures everywhere. The hum begins.
    // The passage opens into a wider chamber. Crystal formations line every surface.
    // Prismatic spectrum scattered everywhere. Rainbows crawl across the walls.
    // You feel the first vibration in your chest. The crystals are singing.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: -40,         // deepest point underground
    sunAzimuth: 200,
    turbidity: 1.0,
    rayleigh: 0.15,
    mieCoefficient: 0.015,     // maximum crystal dust scatter
    mieDirectionalG: 0.90,
    fogColor: [0.06, 0.03, 0.12],   // rich purple — crystal-infused air
    fogDensity: 0.010,         // thinner — cathedral space opening
    sunLightColor: [0.40, 0.30, 0.85],  // intense purple-blue crystal light
    sunLightIntensity: 0.6,    // crystals are now the primary illumination
    ambientIntensity: 0.04,    // crystal glow as ambient fill
    grassBaseColor: [0.06, 0.03, 0.10],  // deep amethyst tones on stone
    grassTipColor: [0.15, 0.20, 0.40],   // crystal blue-purple tips
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.4,    // crystal subsurface scattering visible
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 1.2,    // crystal sparkles at full prismatic intensity
    fireflySize: 70,
    bloomIntensity: 1.3,       // HIGH — crystals blazing with refracted light
    bloomThreshold: 0.25,      // low threshold — everything prismatic glows
    fogDepthStrength: 0.06,
    fogMidColor: [0.08, 0.04, 0.15],
    fogFarColor: [0.04, 0.02, 0.08],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.35,  // HIGH — prismatic colors are VIVID
    colorGradeWarmth: 0.01,    // hint of warmth from amber crystals
    vignetteDarkness: 0.70,    // opening — the cathedral reveals itself
    grainOpacity: 0.035,
    dustMoteBrightness: 0.8,   // crystal dust fully prismatic
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 1.0,         // PEAK prismatic — light fractures everywhere
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 6,        // intimate crystal focus
    dofBokehScale: 6.0,        // maximum bokeh — prismatic quality in the blur
    splitToneWarm: [0.70, 0.50, 0.90],  // purple-warm crystal light
    splitToneCool: [0.35, 0.25, 0.65],  // deep blue-violet shadows
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // RESONANCE — the crystal cathedral. Peak beauty. Vibration.
    // Massive formations floor to ceiling. Every surface refracts.
    // The air itself seems colored. The hum is inside you now.
    // The music and the crystals are one frequency.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: -38,         // still deep underground
    sunAzimuth: 210,
    turbidity: 0.8,
    rayleigh: 0.1,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.88,
    fogColor: [0.08, 0.04, 0.15],   // deep amethyst fog
    fogDensity: 0.006,         // THINNEST — vast cathedral space, maximum visibility
    sunLightColor: [0.45, 0.35, 0.80],  // fully crystal-colored light
    sunLightIntensity: 0.5,    // crystal glow is everything
    ambientIntensity: 0.08,    // crystal glow fills the space — earned light
    grassBaseColor: [0.08, 0.04, 0.14],  // rich purple stone
    grassTipColor: [0.18, 0.22, 0.45],   // strong crystal blue tips
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.18,
    grassTranslucency: 0.6,    // peak subsurface — crystals glow from within
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 1.5,    // PEAK crystal sparkle — prismatic particles everywhere
    fireflySize: 75,
    bloomIntensity: 1.4,       // MAXIMUM — the cathedral blazes
    bloomThreshold: 0.22,      // very low — everything glows
    fogDepthStrength: 0.04,
    fogMidColor: [0.10, 0.05, 0.18],
    fogFarColor: [0.05, 0.03, 0.10],
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.45,  // PEAK — maximum prismatic saturation
    colorGradeWarmth: 0.03,    // earned warmth — citrine crystals glow amber
    vignetteDarkness: 0.55,    // WIDEST — the cathedral opens, awe
    grainOpacity: 0.03,        // cleanest — awe needs clarity
    dustMoteBrightness: 1.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 1.2,         // MAXIMUM prismatic CA — cathedral blazes with refraction
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 5,
    dofBokehScale: 6.5,        // maximum bokeh
    splitToneWarm: [0.75, 0.55, 0.95],  // purple-amber warmth
    splitToneCool: [0.30, 0.20, 0.55],  // deep violet shadows
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // COMMUNION — surrounded by crystal glow. Inside the sound.
    // Only crystal emissive light remains. The hum is everything.
    // You are inside the instrument. The cave is a throat.
    // The crystals are vocal cords. The sound is the light is the feeling.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: -35,         // still underground
    sunAzimuth: 220,
    turbidity: 0.5,
    rayleigh: 0.05,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.85,
    fogColor: [0.05, 0.02, 0.10],   // deep void purple
    fogDensity: 0.018,         // fog returns — enclosed, intimate, womb-like
    sunLightColor: [0.35, 0.25, 0.70],  // pure crystal color — no natural light
    sunLightIntensity: 0.3,    // dimming — communion intimacy
    ambientIntensity: 0.04,    // only crystal emissives light the space
    grassBaseColor: [0.05, 0.02, 0.08],  // fading stone
    grassTipColor: [0.12, 0.15, 0.35],   // crystal blue persists
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.10,
    grassTranslucency: 0.8,    // PEAK subsurface — crystals are pure light vessels
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.6,    // crystal sparkles dimming — you're below most of them
    fireflySize: 55,
    bloomIntensity: 0.9,       // bloom softening — intimate glow, not blaze
    bloomThreshold: 0.30,
    fogDepthStrength: 0.08,
    fogMidColor: [0.06, 0.03, 0.12],
    fogFarColor: [0.03, 0.02, 0.06],
    colorGradeContrast: 0.04,
    colorGradeVibrance: 0.25,  // color fading — approaching synesthesia
    colorGradeWarmth: 0.04,    // warmest — communion warmth, earned
    vignetteDarkness: 0.92,    // closing in — not oppressive, protective. Womb.
    grainOpacity: 0.05,        // slightly grittier — deep underground texture
    dustMoteBrightness: 0.2,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.60,        // settling — prismatic fringing softens in communion
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 3,        // extreme close — touching the crystal face
    dofBokehScale: 7.0,        // maximum bokeh — world dissolves into colored light
    splitToneWarm: [0.65, 0.45, 0.80],  // purple communion glow
    splitToneCool: [0.25, 0.18, 0.50],  // deep void violet
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
