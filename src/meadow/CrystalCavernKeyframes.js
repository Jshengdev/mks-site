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
    crystalBrightness: 0.3,  // faint — barely visible at entrance
    crystalPulseIntensity: 0.08, // barely breathing — almost imagined, not seen
    mushroomBrightness: 0.2, // dim bioluminescence — just hints
    causticBrightness: 0.0,  // no caustics at entrance — too dark, no crystals to refract
    sunElevation: -60,        // DEEP UNDERGROUND — sun far below horizon
    sunAzimuth: 180,
    turbidity: 0.5,           // no atmospheric scattering underground
    rayleigh: 0.05,           // near-zero — no sky, no Rayleigh
    mieCoefficient: 0.002,
    mieDirectionalG: 0.80,
    fogColor: [0.02, 0.005, 0.04],  // DEEP purple-black — saturated, not grey
    fogDensity: 0.035,        // VERY dense cave air — claustrophobic
    sunLightColor: [0.25, 0.12, 0.70],  // STRONG purple — crystal-refracted, NOT sunlight
    sunLightIntensity: 0.15,  // barely there — underground has no directional source
    ambientIntensity: 0.008,  // near-zero — darkness IS the world
    grassBaseColor: [0.02, 0.005, 0.03],  // near-black purple stone
    grassTipColor: [0.08, 0.06, 0.25],    // deep crystal blue-violet
    grassWindSpeed: 0.0,      // no wind underground
    grassAmbientStrength: 0.03,
    grassTranslucency: 0.0,   // stone doesn't transmit
    grassFogFade: 0.008,
    cloudShadowOpacity: 0.0,  // underground — no clouds
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 1.2,   // crystal sparkle particles — the ONLY light source
    fireflySize: 80,          // large sparkle points — prismatic facets
    bloomIntensity: 1.6,      // VERY HIGH — crystal glow IS the atmosphere
    bloomThreshold: 0.20,     // very low — any bright pixel blooms hard
    fogDepthStrength: 0.14,
    fogMidColor: [0.04, 0.01, 0.08],   // rich purple cave depth
    fogFarColor: [0.015, 0.005, 0.03], // void purple at distance
    colorGradeContrast: 0.10,
    colorGradeVibrance: 0.08,  // almost monochrome at entrance — color is earned deeper
    colorGradeWarmth: 0.0,     // cold world — warmth is below
    vignetteDarkness: 0.95,    // MAXIMUM — cave walls press in from all sides
    grainOpacity: 0.06,        // gritty underground texture
    dustMoteBrightness: 0.4,
    godRayIntensity: 0.0,      // NO god rays — there is no sun
    kuwaharaStrength: 0.0,     // crystals need sharp facets
    caDistortion: 1.0,         // STRONG prismatic refraction — light shatters through crystal
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,     // no wind underground
    dofFocusDistance: 10,
    dofBokehScale: 5.0,        // heavy bokeh — out-of-focus crystals become colored blobs
    splitToneWarm: [0.50, 0.25, 0.85],  // purple crystal warmth
    splitToneCool: [0.20, 0.10, 0.55],  // deep violet shadows
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
    crystalBrightness: 0.6,   // growing — first clusters catch refracted light
    crystalPulseIntensity: 0.25, // first noticeable pulse — you realize the crystals are alive
    mushroomBrightness: 0.5,  // pulsing visible — floor coming alive
    causticBrightness: 0.25,  // first rainbow hints on stone — prismatic whispers
    sunElevation: -65,         // deeper underground
    sunAzimuth: 190,
    turbidity: 0.4,
    rayleigh: 0.04,
    mieCoefficient: 0.004,
    mieDirectionalG: 0.82,
    fogColor: [0.03, 0.01, 0.06],   // deeper purple — passage walls absorb light
    fogDensity: 0.028,         // thinning slightly but still thick
    sunLightColor: [0.30, 0.15, 0.75],  // intensifying purple — more crystal refractions
    sunLightIntensity: 0.20,   // still very dim
    ambientIntensity: 0.012,   // first crystal reflections add faint fill
    grassBaseColor: [0.03, 0.01, 0.05],  // dark purple stone
    grassTipColor: [0.10, 0.08, 0.30],   // crystal blue on edges
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.05,
    grassTranslucency: 0.1,    // faintest subsurface in small crystals
    grassFogFade: 0.007,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 1.4,    // crystal sparkles growing — more facets catching light
    fireflySize: 75,
    bloomIntensity: 1.7,       // bloom increasing — prismatic refractions glow
    bloomThreshold: 0.18,
    fogDepthStrength: 0.12,
    fogMidColor: [0.05, 0.015, 0.10],
    fogFarColor: [0.02, 0.008, 0.05],
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.20,  // color appearing — prismatic hints
    colorGradeWarmth: 0.0,     // still cold
    vignetteDarkness: 0.90,    // slightly opening
    grainOpacity: 0.05,
    dustMoteBrightness: 0.6,   // crystal dust catching refracted light
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 1.1,         // prismatic refraction intensifying
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 7,
    dofBokehScale: 5.5,        // heavy bokeh — out-of-focus crystals become prismatic blur
    splitToneWarm: [0.55, 0.30, 0.85],  // purple warmth growing
    splitToneCool: [0.25, 0.15, 0.60],  // purple deepening
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
    crystalBrightness: 1.0,   // full intensity — prismatic cathedral
    crystalPulseIntensity: 0.55, // each formation breathes independently — the hum begins
    mushroomBrightness: 0.8,  // strong pulse — floor carpet glows
    causticBrightness: 0.7,   // rainbow patterns crawl across stone — the name says it all
    sunElevation: -70,         // deepest point underground
    sunAzimuth: 200,
    turbidity: 0.3,
    rayleigh: 0.03,
    mieCoefficient: 0.006,
    mieDirectionalG: 0.85,
    fogColor: [0.05, 0.02, 0.10],   // rich purple — crystal-infused air
    fogDensity: 0.018,         // thinning — cathedral space opening up
    sunLightColor: [0.35, 0.18, 0.80],  // intense purple crystal light
    sunLightIntensity: 0.25,   // crystal glow, not sun
    ambientIntensity: 0.025,   // crystal reflections as ambient fill
    grassBaseColor: [0.04, 0.015, 0.08],  // deep amethyst stone
    grassTipColor: [0.12, 0.10, 0.35],    // crystal blue-purple tips
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.08,
    grassTranslucency: 0.4,    // crystal subsurface scattering visible
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 1.8,    // crystal sparkles at full prismatic intensity
    fireflySize: 85,
    bloomIntensity: 1.8,       // HIGH — crystals blazing with refracted light
    bloomThreshold: 0.15,      // very low — everything prismatic glows
    fogDepthStrength: 0.08,
    fogMidColor: [0.06, 0.025, 0.13],
    fogFarColor: [0.025, 0.01, 0.06],
    colorGradeContrast: 0.07,
    colorGradeVibrance: 0.45,  // HIGH — prismatic colors VIVID
    colorGradeWarmth: 0.01,    // hint of warmth from amber crystals
    vignetteDarkness: 0.75,    // opening — the cathedral reveals itself
    grainOpacity: 0.04,
    dustMoteBrightness: 0.9,   // crystal dust fully prismatic
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 1.3,         // PEAK prismatic — light fractures everywhere
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 5,        // intimate crystal focus
    dofBokehScale: 6.5,        // heavy bokeh — prismatic quality in the blur
    splitToneWarm: [0.60, 0.35, 0.90],  // purple-warm crystal light
    splitToneCool: [0.25, 0.15, 0.60],  // deep blue-violet shadows
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
    crystalBrightness: 1.4,   // PEAK — cathedral blazes
    crystalPulseIntensity: 0.85, // PEAK — deep breathing, the cave itself is alive
    mushroomBrightness: 1.0,  // peak pulse — floor and ceiling alive
    causticBrightness: 1.0,   // PEAK — every surface painted with prismatic rainbows
    sunElevation: -65,         // still deep underground
    sunAzimuth: 210,
    turbidity: 0.2,
    rayleigh: 0.02,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.82,
    fogColor: [0.06, 0.025, 0.14],   // deep amethyst fog — richest purple
    fogDensity: 0.010,         // THINNEST — vast cathedral space, maximum visibility
    sunLightColor: [0.40, 0.22, 0.85],  // fully crystal-colored light — peak purple
    sunLightIntensity: 0.30,   // crystal glow is everything
    ambientIntensity: 0.05,    // crystal glow fills the space — earned light
    grassBaseColor: [0.06, 0.025, 0.12],  // rich purple stone
    grassTipColor: [0.14, 0.12, 0.40],    // strong crystal blue-violet tips
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.6,    // peak subsurface — crystals glow from within
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 2.0,    // PEAK crystal sparkle — prismatic particles everywhere
    fireflySize: 90,
    bloomIntensity: 2.0,       // MAXIMUM — the cathedral blazes with refracted light
    bloomThreshold: 0.12,      // very low — everything glows
    fogDepthStrength: 0.05,
    fogMidColor: [0.08, 0.035, 0.16],
    fogFarColor: [0.03, 0.015, 0.08],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.55,  // PEAK — maximum prismatic saturation
    colorGradeWarmth: 0.03,    // earned warmth — citrine crystals glow amber
    vignetteDarkness: 0.60,    // WIDEST — the cathedral opens, awe
    grainOpacity: 0.03,        // cleanest — awe needs clarity
    dustMoteBrightness: 1.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 1.5,         // MAXIMUM prismatic CA — cathedral blazes with refraction
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 4,
    dofBokehScale: 7.0,        // maximum bokeh — world dissolves into colored light
    splitToneWarm: [0.65, 0.40, 0.95],  // purple-amber warmth
    splitToneCool: [0.22, 0.12, 0.50],  // deep violet shadows
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
    crystalBrightness: 0.7,   // dimming — communion intimacy, not blaze
    crystalPulseIntensity: 0.40, // softer breath — intimate, womb-like, the hum cradles you
    mushroomBrightness: 0.4,  // fading pulse — womb-like softness
    causticBrightness: 0.35,  // dimming — soft prismatic whispers in communion
    sunElevation: -55,         // still underground
    sunAzimuth: 220,
    turbidity: 0.2,
    rayleigh: 0.02,
    mieCoefficient: 0.003,
    mieDirectionalG: 0.80,
    fogColor: [0.035, 0.012, 0.08],  // deep void purple — closing in
    fogDensity: 0.030,         // fog returns dense — enclosed, intimate, womb-like
    sunLightColor: [0.28, 0.14, 0.65],  // pure crystal color — dimming
    sunLightIntensity: 0.12,   // dimming — communion intimacy
    ambientIntensity: 0.015,   // only crystal emissives light the space
    grassBaseColor: [0.03, 0.01, 0.06],  // fading stone
    grassTipColor: [0.10, 0.08, 0.30],   // crystal blue persists
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.06,
    grassTranslucency: 0.8,    // PEAK subsurface — crystals are pure light vessels
    grassFogFade: 0.007,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.8,    // crystal sparkles dimming — you're below most of them
    fireflySize: 65,
    bloomIntensity: 1.2,       // bloom softening — intimate glow, not blaze
    bloomThreshold: 0.22,
    fogDepthStrength: 0.10,
    fogMidColor: [0.04, 0.015, 0.10],
    fogFarColor: [0.02, 0.008, 0.05],
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.30,  // color softening — approaching synesthesia
    colorGradeWarmth: 0.04,    // warmest — communion warmth, earned
    vignetteDarkness: 0.95,    // MAXIMUM — closing in, protective. Womb.
    grainOpacity: 0.06,        // grittier — deep underground texture
    dustMoteBrightness: 0.3,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.80,        // settling — prismatic fringing softens in communion
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 2,        // extreme close — touching the crystal face
    dofBokehScale: 8.0,        // maximum bokeh — world dissolves into colored light
    splitToneWarm: [0.55, 0.30, 0.80],  // purple communion glow
    splitToneCool: [0.18, 0.10, 0.45],  // deep void violet
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
