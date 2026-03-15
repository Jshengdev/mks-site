// Underwater Cathedral atmosphere keyframes — Sacred Submersion
// Scroll arc: Surface → Descent → Nave → Crypt → Abyss
// "The music echoes through water — every note distorted, stretched,
//  made sacred by the pressure."
//
// You are sinking into a drowned cathedral. Light fractures above.
// Stone pillars rise like prayers. Fish drift like congregation.
// The deeper you go, the darker it gets — but also the more alive.
// Bioluminescence replaces sunlight. Pressure becomes presence.
//
// CORE ATMOSPHERIC ARC:
// - Natural light: 100% → 5% (sunlight dies with depth)
// - Bioluminescence: 5% → 100% (life replaces light)
// - Fog density: moderate → extreme (water thickens with depth)
// - Color temperature: blue-green → deep indigo → teal bioluminescent
// - DOF: wide → intimate (visibility narrows, focus tightens)
// - Bloom: moderate → heavy (bioluminescence blooms in darkness)
//
// Technique sources:
// - Depth-dependent color absorption: real underwater physics
//   (red dies at 5m, orange 15m, yellow 30m, green 60m, blue 200m)
// - Caustic projection: martinRenou/threejs-caustics + Shadertoy XttyRX
// - Bioluminescent glow curves: based on real deep-sea photometry

export const UNDERWATER_CATHEDRAL_KEYFRAMES = [
  {
    t: 0.0, // SURFACE — just beneath the waterline, cathedral glimpsed below
    // Light is strongest here. The world above is a rippling mirror.
    // Below: pillars recede into blue-green murk. Anticipation. A breath held.

    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,              // no stars underwater

    sunElevation: 85,                 // light from nearly directly above (sun through water surface)
    sunAzimuth: 200,
    turbidity: 2.0,                   // water haze
    rayleigh: 0.3,                    // minimal — not atmosphere, it's water
    mieCoefficient: 0.02,             // higher — suspended particles scatter light
    mieDirectionalG: 0.75,            // more isotropic scattering (water)

    fogColor: [0.03, 0.10, 0.15],     // teal-blue — brightest fog of the descent
    fogDensity: 0.008,                // moderate — can see ~30m

    sunLightColor: [0.20, 0.50, 0.65], // blue-green — red already absorbed in first meters
    sunLightIntensity: 0.8,            // strongest point — closest to surface
    ambientIntensity: 0.12,            // water scatters ambient everywhere

    // Grass system repurposed for kelp
    grassBaseColor: [0.02, 0.08, 0.04],  // dark green kelp base
    grassTipColor: [0.05, 0.18, 0.08],   // brighter kelp tips
    grassWindSpeed: 0.15,                  // slow underwater current sway
    grassAmbientStrength: 0.25,
    grassTranslucency: 1.2,               // kelp is translucent — light passes through
    grassFogFade: 0.005,

    cloudShadowOpacity: 0.0,              // no cloud shadows underwater
    cloudDriftSpeed: 0.00003,             // repurposed as current drift speed

    // Fireflies = bioluminescent plankton
    fireflyBrightness: 0.2,              // barely visible near surface (sunlight drowns them)
    fireflySize: 30,                      // small near surface

    bloomIntensity: 0.3,                  // moderate — sunlight through water
    bloomThreshold: 0.65,

    fogDepthStrength: 0.04,
    fogMidColor: [0.04, 0.12, 0.18],     // teal mid-fog
    fogFarColor: [0.02, 0.08, 0.12],     // darker distance

    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.20,             // some color — still near surface
    colorGradeWarmth: -0.02,              // cold — water steals warmth

    vignetteDarkness: 0.50,               // moderate tunnel — water pressure
    grainOpacity: 0.03,                   // light grain — suspended sediment

    dustMoteBrightness: 0.3,              // marine snow visible near surface
    godRayIntensity: 0.6,                 // STRONG light shafts from above
    kuwaharaStrength: 0.0,

    waveWindDirX: 0.3,                    // current direction
    waveWindDirY: 0.0,                    // horizontal current (not wind)
    waveWindSpeed: 0.2,
    waveWindStrength: 0.04,               // gentle current

    // DOF — wide at surface, can see the cathedral layout
    dofFocusDistance: 20,                 // looking down into depths
    dofBokehScale: 2.0,                  // light bokeh — particles catch it

    // Split-tone — cool blue surface light
    splitToneWarm: [0.60, 0.72, 0.80],   // even "warm" is cold underwater
    splitToneCool: [0.40, 0.55, 0.75],   // deep cold blue

    // Ocean params repurposed for water volume effects
    oceanColorNear: [0.03, 0.15, 0.22],  // water tint near camera
    oceanColorFar: [0.01, 0.06, 0.12],   // water tint far
    oceanFoamBrightness: 0.5,            // caustic light brightness on surfaces
    oceanWaveLineIntensity: 0.4,          // ripple pattern on surfaces
    caDistortion: 0.003,                   // subtle water refraction
    cloudCoverage: 0,                      // no volumetric clouds underwater
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // DESCENT — passing through the first light shafts, pillars emerge
    // Stained glass colors fracture through the water. The first pillars
    // materialize from the murk. You pass through a shaft of blue light.
    // The architecture announces itself — Gothic arches overhead.
    // "This was built by someone who believed the ocean was heaven."

    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,

    sunElevation: 80,
    sunAzimuth: 205,
    turbidity: 2.5,
    rayleigh: 0.25,
    mieCoefficient: 0.025,
    mieDirectionalG: 0.72,

    fogColor: [0.02, 0.07, 0.12],     // darker — descended 10m
    fogDensity: 0.010,                // thicker

    sunLightColor: [0.12, 0.38, 0.55], // more blue — orange and yellow absorbed
    sunLightIntensity: 0.55,           // dimming with depth
    ambientIntensity: 0.10,

    grassBaseColor: [0.02, 0.07, 0.04],
    grassTipColor: [0.04, 0.15, 0.07],
    grassWindSpeed: 0.12,
    grassAmbientStrength: 0.20,
    grassTranslucency: 1.0,
    grassFogFade: 0.006,

    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00004,

    fireflyBrightness: 0.5,              // plankton becoming visible as light dims
    fireflySize: 45,                      // growing — closer to plankton clouds

    bloomIntensity: 0.45,                 // light shafts catch bloom
    bloomThreshold: 0.55,

    fogDepthStrength: 0.05,
    fogMidColor: [0.03, 0.08, 0.14],
    fogFarColor: [0.02, 0.05, 0.10],

    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.25,             // stained glass adds vivid color
    colorGradeWarmth: -0.04,              // colder

    vignetteDarkness: 0.58,
    grainOpacity: 0.04,

    dustMoteBrightness: 0.45,             // marine snow thicker mid-depth
    godRayIntensity: 0.75,                // PEAK god rays — light shafts most dramatic here
    kuwaharaStrength: 0.0,

    waveWindDirX: 0.25,
    waveWindDirY: 0.15,
    waveWindSpeed: 0.25,
    waveWindStrength: 0.06,               // current slightly stronger mid-depth

    dofFocusDistance: 15,                 // focusing on approaching pillars
    dofBokehScale: 3.0,                  // more bokeh — particles in foreground blur

    splitToneWarm: [0.55, 0.68, 0.78],
    splitToneCool: [0.35, 0.50, 0.72],   // deepening blue

    oceanColorNear: [0.02, 0.12, 0.18],
    oceanColorFar: [0.01, 0.05, 0.10],
    oceanFoamBrightness: 0.65,            // caustics most vivid at mid-depth
    oceanWaveLineIntensity: 0.55,
    caDistortion: 0.005,                   // light refracts more at depth
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // NAVE — heart of the cathedral, surrounded by pillars and coral
    // This is the peak of the experience. Light shafts from high above
    // illuminate the nave in fractured color. Fish schools drift between
    // pillars like silent congregation. Coral glows on every surface.
    // The architecture is overwhelming — you are small inside something
    // built for a god that lived in the ocean.

    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,

    sunElevation: 75,
    sunAzimuth: 210,
    turbidity: 3.0,
    rayleigh: 0.2,
    mieCoefficient: 0.030,
    mieDirectionalG: 0.70,

    fogColor: [0.02, 0.05, 0.09],     // deep blue-green
    fogDensity: 0.012,                // thick — mid-cathedral

    sunLightColor: [0.08, 0.28, 0.48], // blue dominant — only blue-green survives
    sunLightIntensity: 0.35,           // weak — 25m deep
    ambientIntensity: 0.10,            // bioluminescence starts to fill in

    grassBaseColor: [0.02, 0.06, 0.04],
    grassTipColor: [0.04, 0.12, 0.06],
    grassWindSpeed: 0.10,               // gentle current sway
    grassAmbientStrength: 0.18,
    grassTranslucency: 0.8,
    grassFogFade: 0.008,

    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00005,

    // PEAK plankton brightness — bioluminescence competing with fading sunlight
    fireflyBrightness: 0.9,
    fireflySize: 65,                    // larger — closer, surrounding you

    bloomIntensity: 0.65,               // STRONG — bioluminescence + light shafts
    bloomThreshold: 0.45,               // LOW threshold — everything glows

    fogDepthStrength: 0.06,
    fogMidColor: [0.03, 0.06, 0.12],
    fogFarColor: [0.01, 0.04, 0.08],

    colorGradeContrast: 0.07,           // more contrast — light vs dark drama
    colorGradeVibrance: 0.30,           // PEAK — bioluminescence is vivid
    colorGradeWarmth: -0.06,            // cold — the sacred cold of deep water

    vignetteDarkness: 0.40,             // OPENS — the nave reveals itself
    grainOpacity: 0.04,

    dustMoteBrightness: 0.5,            // marine snow everywhere
    godRayIntensity: 0.55,              // light shafts still visible but fading
    kuwaharaStrength: 0.0,

    waveWindDirX: 0.15,
    waveWindDirY: 0.25,
    waveWindSpeed: 0.18,
    waveWindStrength: 0.08,             // current flows through pillars

    // DOF INTIMATE — focus on nearby coral and fish
    dofFocusDistance: 8,                // close focus — among the pillars
    dofBokehScale: 5.0,                // heavy bokeh — distant pillars dissolve

    // Split-tone peak — bioluminescent teal fights cold blue
    splitToneWarm: [0.45, 0.65, 0.72],  // "warm" is teal underwater
    splitToneCool: [0.30, 0.45, 0.68],  // cold deep blue

    oceanColorNear: [0.02, 0.10, 0.15],
    oceanColorFar: [0.01, 0.04, 0.08],
    oceanFoamBrightness: 0.50,          // caustics dimming with depth
    oceanWaveLineIntensity: 0.40,
    caDistortion: 0.008,                   // peak refraction distortion at nave depth
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // CRYPT — deep cathedral, bioluminescence is primary light
    // Natural light is a memory. A faint glow from above — that's all.
    // But the coral BLAZES. Every pillar is a candelabra of living light.
    // The fish schools are silhouettes against bioluminescent walls.
    // This is the most intimate moment — you're in the crypt,
    // among the dead and the endlessly alive.
    // "The deeper you go, the more alive it gets."

    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,

    sunElevation: 70,
    sunAzimuth: 215,
    turbidity: 3.5,
    rayleigh: 0.15,
    mieCoefficient: 0.035,
    mieDirectionalG: 0.68,

    fogColor: [0.01, 0.03, 0.06],     // near-black blue
    fogDensity: 0.018,                // THICK — oppressive depth

    sunLightColor: [0.04, 0.15, 0.35], // faint blue — barely reaches this depth
    sunLightIntensity: 0.12,           // almost gone — 35m deep
    ambientIntensity: 0.12,            // bioluminescence IS the ambient now

    grassBaseColor: [0.01, 0.05, 0.03],
    grassTipColor: [0.03, 0.10, 0.05],
    grassWindSpeed: 0.08,               // barely moving — deep current is slow
    grassAmbientStrength: 0.15,
    grassTranslucency: 0.6,
    grassFogFade: 0.010,

    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00003,

    // PEAK plankton/bioluminescence — the void is alive
    fireflyBrightness: 1.3,             // BRIGHTEST — they ARE the light now
    fireflySize: 85,                    // large, close, surrounding

    bloomIntensity: 0.85,               // MAXIMUM bloom — everything glows
    bloomThreshold: 0.35,               // very low — catch every point of light

    fogDepthStrength: 0.08,
    fogMidColor: [0.02, 0.04, 0.08],
    fogFarColor: [0.01, 0.02, 0.05],

    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.35,           // PEAK — bioluminescence is the only color
    colorGradeWarmth: -0.03,            // slightly less cold — bioluminescence has warmth

    vignetteDarkness: 0.55,             // tightening — but not yet tunnel
    grainOpacity: 0.05,

    dustMoteBrightness: 0.35,           // marine snow catching bioluminescent light
    godRayIntensity: 0.15,              // faint — a memory of the surface
    kuwaharaStrength: 0.0,

    waveWindDirX: 0.1,
    waveWindDirY: 0.1,
    waveWindSpeed: 0.12,
    waveWindStrength: 0.04,             // deep current — slow, heavy

    // DOF most intimate — the crypt is close quarters
    dofFocusDistance: 5,                // very close focus — coral on nearby pillars
    dofBokehScale: 6.5,                // HEAVY bokeh — distant things are soft orbs of light

    // Split-tone — bioluminescent warmth vs deep cold
    splitToneWarm: [0.40, 0.60, 0.55],  // teal-green warm (bioluminescent cast)
    splitToneCool: [0.25, 0.38, 0.60],  // deep indigo cool

    oceanColorNear: [0.01, 0.06, 0.10],
    oceanColorFar: [0.005, 0.03, 0.06],
    oceanFoamBrightness: 0.20,          // caustics almost invisible at this depth
    oceanWaveLineIntensity: 0.15,
    caDistortion: 0.006,                   // refraction eases in the deep
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // ABYSS — near the floor, looking up at fading light far above
    // The floor of the cathedral. Stone worn smooth by centuries.
    // Looking UP: the pillars recede into darkness, and far, far above,
    // the faintest shimmer of the surface — a distant heaven.
    // The figure kneels here, at the altar. A ghost or a memory.
    // The bioluminescence pulses slowly, like a heartbeat.
    // This is the sacred place. The pressure is presence.
    // "Every note made sacred by the pressure."

    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,

    sunElevation: 65,
    sunAzimuth: 220,
    turbidity: 4.0,
    rayleigh: 0.10,
    mieCoefficient: 0.040,             // maximum scatter — deep water
    mieDirectionalG: 0.65,

    fogColor: [0.008, 0.02, 0.04],    // near-black — the abyss
    fogDensity: 0.025,                // EXTREME — can barely see 15m

    sunLightColor: [0.02, 0.08, 0.20], // faintest blue — 42m deep
    sunLightIntensity: 0.05,           // almost nothing from above
    ambientIntensity: 0.08,            // bioluminescence only

    grassBaseColor: [0.01, 0.04, 0.03],
    grassTipColor: [0.02, 0.08, 0.04],
    grassWindSpeed: 0.05,               // nearly still — deep stillness
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.4,
    grassFogFade: 0.012,

    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00002,

    // Bioluminescence sustains but doesn't peak — the abyss is quieter
    fireflyBrightness: 0.8,             // dimming — even life is quieter here
    fireflySize: 70,                    // medium — settling

    bloomIntensity: 0.60,               // still strong — but less frantic
    bloomThreshold: 0.40,

    fogDepthStrength: 0.10,             // STRONGEST depth fog — the abyss
    fogMidColor: [0.01, 0.03, 0.06],
    fogFarColor: [0.005, 0.015, 0.03],

    colorGradeContrast: 0.04,           // FLATTENING — the abyss compresses contrast
    colorGradeVibrance: 0.18,           // desaturating — color is a luxury of light
    colorGradeWarmth: -0.01,            // almost neutral — beyond temperature

    vignetteDarkness: 0.85,             // HEAVY tunnel — the pressure closes in
    grainOpacity: 0.06,                 // grain increases — old film, old memory

    dustMoteBrightness: 0.15,           // marine snow sparse at depth
    godRayIntensity: 0.03,              // ghost of light from 42m above
    kuwaharaStrength: 0.0,

    waveWindDirX: 0.05,
    waveWindDirY: 0.05,
    waveWindSpeed: 0.08,
    waveWindStrength: 0.02,             // barely any current — stillness

    // DOF — the abyss is paradoxically wide-focus
    // You can see the figure, the coral, the fading pillars — all at once
    // Because there's nowhere else to look
    dofFocusDistance: 10,               // mid-range — the altar and figure
    dofBokehScale: 4.0,                // moderate — let the viewer see clearly

    // Split-tone — the deep beyond temperature
    splitToneWarm: [0.35, 0.50, 0.45],  // muted teal — bioluminescence is fading
    splitToneCool: [0.20, 0.30, 0.50],  // deep indigo — the color of pressure

    oceanColorNear: [0.008, 0.04, 0.07],
    oceanColorFar: [0.003, 0.02, 0.04], // near-black
    oceanFoamBrightness: 0.05,          // caustics are a distant memory
    oceanWaveLineIntensity: 0.05,       // the surface is another world
    caDistortion: 0.004,                   // settling — the deep is still
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
