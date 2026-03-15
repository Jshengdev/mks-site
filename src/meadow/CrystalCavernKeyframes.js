// Crystal Cavern atmosphere keyframes — Sacred Discovery
// Scroll arc: Threshold → Descent → Prismatic → Resonance → Communion
// "Deep underground, where sound becomes light and light becomes feeling.
//  The crystals don't reflect — they remember."
//
// Camera descends into the earth. Light fractures. Crystals hum.
// You are inside the instrument.
//
// Source techniques:
//   Chromatic dispersion: Taylor Petrick (separate RGB IOR), Maxime Heckel (multi-sample loop)
//   Subsurface scattering: mattdesl fast SSS gist (thicknessPower=16, thicknessScale=5)
//   Crystal SDF: Varun Vachhar rhombic triacontahedron (space-folding technique)
//   Iridescence: iquilez cosine palette — pal(t, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0,0.33,0.67))

export const CRYSTAL_CAVERN_KEYFRAMES = [
  {
    t: 0.0, // THRESHOLD — cavern entrance. Light behind you. Darkness ahead.
    // You stand at the mouth. The world above is fading.
    // A single shaft of warm light cuts the darkness behind you.
    // Ahead: the faintest glint of something catching that light.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,     // underground — no stars
    sunElevation: 45,         // light shaft from entrance above/behind
    sunAzimuth: 180,          // behind the viewer
    turbidity: 2.0,
    rayleigh: 0.3,            // minimal scattering underground
    mieCoefficient: 0.008,    // dust in the light shaft
    mieDirectionalG: 0.95,    // tight forward scatter (beam-like)
    fogColor: [0.03, 0.02, 0.05],   // deep purple-black cave air
    fogDensity: 0.020,        // thick — oppressive, can barely see
    sunLightColor: [0.95, 0.92, 0.85],  // warm white shaft from entrance
    sunLightIntensity: 2.0,   // intense but narrow beam
    ambientIntensity: 0.02,   // near-zero — darkness IS the world
    grassBaseColor: [0.04, 0.03, 0.06],  // mapped to stone color (no grass)
    grassTipColor: [0.06, 0.04, 0.08],
    grassWindSpeed: 0.0,      // no grass, no wind
    grassAmbientStrength: 0.05,
    grassTranslucency: 0.0,   // stone doesn't transmit
    grassFogFade: 0.006,
    cloudShadowOpacity: 0.0,  // underground — no clouds
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.0,   // no fireflies — crystal dust is different
    fireflySize: 25,
    bloomIntensity: 0.4,      // moderate — shaft has some glow
    bloomThreshold: 0.6,
    fogDepthStrength: 0.10,   // heavy depth fog — cave walls fade fast
    fogMidColor: [0.04, 0.03, 0.07],
    fogFarColor: [0.02, 0.01, 0.04],
    colorGradeContrast: 0.08,  // punchy — high contrast in darkness
    colorGradeVibrance: 0.05,  // almost monochrome at entrance
    colorGradeWarmth: 0.01,    // cold world — warmth is below
    vignetteDarkness: 0.95,    // HEAVIEST — cave walls close in
    grainOpacity: 0.08,        // gritty underground
    dustMoteBrightness: 0.3,   // dust motes in the entrance shaft
    godRayIntensity: 0.8,      // strong — the shaft is visible, volumetric
    kuwaharaStrength: 0.0,     // crystals need sharp facets
    caDistortion: 0.003,       // subtle prismatic fringing — matches crystal dispersion theme
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,     // no wind underground
    dofFocusDistance: 12,       // focus on middle distance — the first glint
    dofBokehScale: 4.0,
    splitToneWarm: [0.90, 0.85, 0.75],  // stone warmth in shaft light
    splitToneCool: [0.60, 0.55, 0.75],  // purple shadows
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // DESCENT — first crystals appear. Small rainbows on stone.
    // You've committed. The entrance light is dimming behind you.
    // Crystal clusters on the walls catch the fading shaft and split it —
    // tiny rainbows flicker across dark stone. The first hint of color.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 30,          // shaft angling as you descend
    sunAzimuth: 190,
    turbidity: 1.5,
    rayleigh: 0.2,
    mieCoefficient: 0.010,     // more scatter from crystal dust
    mieDirectionalG: 0.92,
    fogColor: [0.04, 0.03, 0.08],   // deeper purple
    fogDensity: 0.015,         // thinning slightly — passage opens
    sunLightColor: [0.85, 0.82, 0.78],  // shaft cooling as it scatters
    sunLightIntensity: 1.2,    // weakening — you're deeper
    ambientIntensity: 0.03,    // first crystal reflections add faint fill
    grassBaseColor: [0.05, 0.03, 0.08],
    grassTipColor: [0.08, 0.05, 0.12],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.08,
    grassTranslucency: 0.1,    // faintest subsurface in small crystals
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.15,   // crystal dust beginning to sparkle
    fireflySize: 35,
    bloomIntensity: 0.6,       // bloom increasing — prismatic refractions glow
    bloomThreshold: 0.5,
    fogDepthStrength: 0.08,
    fogMidColor: [0.05, 0.04, 0.10],
    fogFarColor: [0.03, 0.02, 0.06],
    colorGradeContrast: 0.07,
    colorGradeVibrance: 0.15,  // color appearing — prismatic hints
    colorGradeWarmth: 0.0,     // still cold
    vignetteDarkness: 0.88,    // slightly opening
    grainOpacity: 0.07,
    dustMoteBrightness: 0.5,   // crystal dust catching refracted light
    godRayIntensity: 0.5,      // shaft still visible but weakening
    kuwaharaStrength: 0.0,
    caDistortion: 0.005,       // prismatic fringing increasing — light splitting through crystals
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 8,        // closer focus — crystal clusters on walls
    dofBokehScale: 5.0,        // heavy bokeh — out-of-focus crystals become prismatic blur
    splitToneWarm: [0.85, 0.75, 0.65],  // fading warmth
    splitToneCool: [0.55, 0.45, 0.70],  // purple deepening
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
    // The entrance shaft is a distant memory — but the crystals have caught its light
    // and scattered it into a full prismatic spectrum. Rainbows crawl across the walls.
    // You feel the first vibration in your chest. The crystals are singing.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 15,          // shaft barely reaching this deep
    sunAzimuth: 200,
    turbidity: 1.0,
    rayleigh: 0.15,
    mieCoefficient: 0.015,     // maximum crystal dust scatter
    mieDirectionalG: 0.90,
    fogColor: [0.06, 0.04, 0.12],   // rich purple — crystal-infused air
    fogDensity: 0.010,         // thinner — cathedral space opening
    sunLightColor: [0.70, 0.65, 0.80],  // shaft now purple-tinted from crystal refraction
    sunLightIntensity: 0.6,    // weak shaft — crystals are now the primary illumination
    ambientIntensity: 0.06,    // crystal glow as ambient fill
    grassBaseColor: [0.08, 0.04, 0.15],  // deep amethyst tones on stone
    grassTipColor: [0.15, 0.08, 0.25],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.4,    // crystal subsurface scattering visible
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.5,    // crystal dust fully lit — prismatic sparkles
    fireflySize: 50,
    bloomIntensity: 1.0,       // HIGH — crystals blazing with refracted light
    bloomThreshold: 0.35,      // low threshold — everything prismatic glows
    fogDepthStrength: 0.06,
    fogMidColor: [0.08, 0.05, 0.15],
    fogFarColor: [0.04, 0.03, 0.08],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.35,  // HIGH — the prismatic colors are VIVID
    colorGradeWarmth: 0.01,    // hint of warmth from amber crystals
    vignetteDarkness: 0.70,    // opening — the cathedral reveals itself
    grainOpacity: 0.06,
    dustMoteBrightness: 0.8,   // crystal dust fully prismatic
    godRayIntensity: 0.2,      // shaft barely visible — distant memory
    kuwaharaStrength: 0.0,
    caDistortion: 0.008,       // peak prismatic — light fractures everywhere
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 6,        // intimate crystal focus
    dofBokehScale: 6.0,        // maximum bokeh — prismatic quality in the blur itself
    splitToneWarm: [0.80, 0.60, 0.90],  // purple-warm — crystal light
    splitToneCool: [0.40, 0.35, 0.65],  // deep blue-violet shadows
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
    // Massive formations. The largest crystals you've seen — floor to ceiling.
    // Every surface refracts. The air itself seems colored.
    // The hum is inside you now. The music and the crystals are one frequency.
    // This is the emotional peak — awe, wonder, dissolution of self into sound.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 5,           // shaft nearly gone — crystal glow is everything
    sunAzimuth: 210,
    turbidity: 0.8,
    rayleigh: 0.1,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.88,
    fogColor: [0.08, 0.05, 0.15],   // deep amethyst fog
    fogDensity: 0.006,         // THINNEST — vast cathedral space, maximum visibility
    sunLightColor: [0.55, 0.45, 0.75],  // fully crystal-colored light
    sunLightIntensity: 0.3,    // shaft nearly gone
    ambientIntensity: 0.10,    // crystal glow fills the space — earned light
    grassBaseColor: [0.12, 0.06, 0.22],  // rich purple stone
    grassTipColor: [0.20, 0.10, 0.35],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.18,
    grassTranslucency: 0.6,    // peak subsurface — crystals glow from within
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.8,    // crystal dust bright — prismatic particles everywhere
    fireflySize: 65,
    bloomIntensity: 1.2,       // MAXIMUM — the cathedral blazes
    bloomThreshold: 0.30,      // very low — everything glows
    fogDepthStrength: 0.04,
    fogMidColor: [0.10, 0.06, 0.18],
    fogFarColor: [0.05, 0.03, 0.10],
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.45,  // PEAK — maximum prismatic saturation
    colorGradeWarmth: 0.03,    // earned warmth — citrine crystals glow amber
    vignetteDarkness: 0.55,    // WIDEST — the cathedral opens, awe
    grainOpacity: 0.05,        // cleanest — awe needs clarity
    dustMoteBrightness: 1.0,   // crystal dust at maximum — prismatic cloud
    godRayIntensity: 0.05,     // shaft gone — only ghost remains
    kuwaharaStrength: 0.0,
    caDistortion: 0.012,       // maximum prismatic CA — cathedral blazes with refraction
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 5,        // closest focus — looking at a single crystal face
    dofBokehScale: 6.5,        // maximum bokeh — everything beyond focus is prismatic blur
    splitToneWarm: [0.85, 0.65, 0.95],  // purple-amber warmth
    splitToneCool: [0.35, 0.25, 0.60],  // deep violet shadows
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // COMMUNION — complete darkness except crystal glow. Inside the sound.
    // The entrance is forgotten. The shaft is gone.
    // Only the crystals illuminate — their own internal light.
    // The hum is everything. You are not observing the cave.
    // You are inside the instrument. The cave is a throat. The crystals are vocal cords.
    // The sound is the light is the feeling.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: -10,         // shaft completely gone — below horizon metaphorically
    sunAzimuth: 220,
    turbidity: 0.5,
    rayleigh: 0.05,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.85,
    fogColor: [0.05, 0.03, 0.10],   // deep void purple
    fogDensity: 0.018,         // fog returns — enclosed, intimate, womb-like
    sunLightColor: [0.35, 0.25, 0.55],  // pure crystal color — no natural light left
    sunLightIntensity: 0.1,    // nearly zero
    ambientIntensity: 0.05,    // only crystal emissives light the space
    grassBaseColor: [0.08, 0.04, 0.14],
    grassTipColor: [0.12, 0.06, 0.20],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.10,
    grassTranslucency: 0.8,    // PEAK subsurface — crystals are pure light vessels
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.4,    // crystal dust dimming — you're below most of it
    fireflySize: 45,
    bloomIntensity: 0.8,       // bloom softening — intimate glow, not blaze
    bloomThreshold: 0.35,
    fogDepthStrength: 0.08,
    fogMidColor: [0.06, 0.04, 0.12],
    fogFarColor: [0.03, 0.02, 0.06],
    colorGradeContrast: 0.04,
    colorGradeVibrance: 0.25,  // color fading — approaching synesthesia
    colorGradeWarmth: 0.04,    // warmest — communion warmth, earned
    vignetteDarkness: 0.92,    // closing in — not oppressive, protective. Womb.
    grainOpacity: 0.09,        // grittiest — deep underground texture
    dustMoteBrightness: 0.2,   // fading crystal dust
    godRayIntensity: 0.0,      // shaft gone completely
    kuwaharaStrength: 0.0,
    caDistortion: 0.006,       // settling — prismatic fringing softens in communion
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 3,        // extreme close — touching the crystal face
    dofBokehScale: 7.0,        // maximum bokeh — the world dissolves into colored light
    splitToneWarm: [0.75, 0.55, 0.85],  // purple communion glow
    splitToneCool: [0.30, 0.20, 0.50],  // deep void violet
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
