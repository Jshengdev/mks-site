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
// - Natural light: dim → gone (sunlight dies with depth)
// - Bioluminescence: present → dominant → fading (life replaces light, then quiets)
// - Fog density: thick → extreme (water thickens with depth)
// - Color temperature: teal-blue → deep indigo → near-black
// - DOF: moderate → intimate → wide (crypt closeup, abyss opens)
// - Bloom: strong → maximum → settling (bioluminescence arc)
//
// sunElevation FIXED at -5 across all keyframes — sun doesn't move
// because you're sinking, not the sun. Only intensity changes.
//
// Technique sources:
// - Depth-dependent color absorption: real underwater physics
//   (red dies at 5m, orange 15m, yellow 30m, green 60m, blue 200m)
// - Caustic projection: martinRenou/threejs-caustics + Shadertoy XttyRX
// - Bioluminescent glow curves: based on real deep-sea photometry

export const UNDERWATER_CATHEDRAL_KEYFRAMES = [
  {
    t: 0.0, // SURFACE — immediately underwater, thick teal murk
    // NOT bright. NOT sunny. You are ALREADY submerged.
    // Teal-blue fog swallows everything past 20m.
    // Bioluminescent plankton drift — glowing motes in the dark.
    // Faint god rays angle down from above. No sky. No horizon.
    // This must be INSTANTLY recognizable as deep underwater.

    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,

    sunElevation: -5,                  // sun barely above horizon — diagonal light shafts
    sunAzimuth: 200,
    turbidity: 2.0,
    rayleigh: 0.15,                    // minimal — water, not atmosphere
    mieCoefficient: 0.035,             // HEAVY scatter — suspended particles everywhere
    mieDirectionalG: 0.60,             // very isotropic — water scatters in all directions

    fogColor: [0.02, 0.08, 0.12],     // USER SPEC — deep teal-blue murk
    fogDensity: 0.015,                // USER SPEC — thick, can barely see 20m

    sunLightColor: [0.06, 0.22, 0.40], // deep blue — red and orange completely absorbed
    sunLightIntensity: 0.25,           // DIM — filtered through meters of water
    ambientIntensity: 0.08,            // USER SPEC — very low, darkness is the default

    // Grass = kelp fronds
    grassBaseColor: [0.01, 0.06, 0.03],  // near-black dark green
    grassTipColor: [0.03, 0.14, 0.06],   // dark kelp tips
    grassWindSpeed: 0.10,                 // slow underwater current — not wind
    grassAmbientStrength: 0.15,           // kelp is dark
    grassTranslucency: 0.8,              // some light passes through fronds
    grassFogFade: 0.008,                 // kelp disappears fast in murk

    cloudShadowOpacity: 0.0,             // NO clouds underwater
    cloudDriftSpeed: 0.0,                // no drift

    // Fireflies = bioluminescent plankton — VISIBLE IMMEDIATELY
    fireflyBrightness: 0.6,             // glowing plankton — the first thing you notice
    fireflySize: 50,                     // medium motes of light

    bloomIntensity: 0.55,                // underwater glow — bioluminescence bleeds
    bloomThreshold: 0.40,                // LOW — catch every point of light

    fogDepthStrength: 0.06,
    fogMidColor: [0.02, 0.08, 0.14],    // deep teal
    fogFarColor: [0.01, 0.05, 0.10],    // near-black distance

    colorGradeContrast: 0.04,            // low contrast — water flattens everything
    colorGradeVibrance: 0.15,            // muted — underwater desaturation
    colorGradeWarmth: -0.06,             // VERY COLD — no warmth underwater

    vignetteDarkness: 0.75,              // HEAVY — water pressure, tunnel vision
    grainOpacity: 0.04,                  // suspended sediment texture

    dustMoteBrightness: 0.5,             // marine snow — visible particles drifting
    godRayIntensity: 0.45,               // diagonal light shafts from above
    kuwaharaStrength: 0.0,

    caDistortion: 0.008,                 // STRONG — water refracts light heavily

    waveWindDirX: 0.3,
    waveWindDirY: 0.0,                   // horizontal current (not wind)
    waveWindSpeed: 0.15,
    waveWindStrength: 0.03,              // gentle, lazy current

    dofFocusDistance: 12,                // mid-range — murk limits what you can see
    dofBokehScale: 3.5,                 // moderate bokeh — particles become soft orbs

    // Split-tone — even "warm" is cold teal underwater
    splitToneWarm: [0.50, 0.65, 0.72],
    splitToneCool: [0.35, 0.50, 0.70],

    oceanColorNear: [0.02, 0.12, 0.18],
    oceanColorFar: [0.01, 0.06, 0.10],
    oceanFoamBrightness: 0.4,           // caustic light on surfaces
    oceanWaveLineIntensity: 0.3,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // DESCENT — passing through light shafts, pillars emerge from murk
    // Stained glass colors fracture through the water. The first pillars
    // materialize. You pass through a shaft of blue light.
    // Peak god rays — the last strong light before the deep.

    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,

    sunElevation: -5,                    // sun fixed — you're sinking, not the sun
    sunAzimuth: 205,
    turbidity: 2.5,
    rayleigh: 0.15,
    mieCoefficient: 0.030,
    mieDirectionalG: 0.62,

    fogColor: [0.02, 0.06, 0.10],       // darker — descended 10m
    fogDensity: 0.018,                   // thicker

    sunLightColor: [0.05, 0.18, 0.35],  // more blue — orange and yellow absorbed
    sunLightIntensity: 0.18,             // dimming with depth
    ambientIntensity: 0.08,

    grassBaseColor: [0.01, 0.05, 0.03],
    grassTipColor: [0.03, 0.12, 0.06],
    grassWindSpeed: 0.10,
    grassAmbientStrength: 0.15,
    grassTranslucency: 0.7,
    grassFogFade: 0.009,

    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,

    fireflyBrightness: 0.8,             // plankton growing brighter as sunlight fades
    fireflySize: 55,

    bloomIntensity: 0.60,                // light shafts + growing bioluminescence
    bloomThreshold: 0.40,

    fogDepthStrength: 0.06,
    fogMidColor: [0.02, 0.06, 0.12],
    fogFarColor: [0.01, 0.04, 0.08],

    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.22,            // stained glass adds vivid color
    colorGradeWarmth: -0.06,             // cold

    vignetteDarkness: 0.68,
    grainOpacity: 0.04,

    dustMoteBrightness: 0.5,             // marine snow thicker mid-depth
    godRayIntensity: 0.65,               // PEAK god rays — last strong light
    kuwaharaStrength: 0.0,

    caDistortion: 0.008,                 // strong water refraction

    waveWindDirX: 0.25,
    waveWindDirY: 0.15,
    waveWindSpeed: 0.18,
    waveWindStrength: 0.05,

    dofFocusDistance: 10,                // focusing on approaching pillars
    dofBokehScale: 4.0,

    splitToneWarm: [0.48, 0.62, 0.70],
    splitToneCool: [0.32, 0.48, 0.68],

    oceanColorNear: [0.02, 0.10, 0.16],
    oceanColorFar: [0.01, 0.04, 0.08],
    oceanFoamBrightness: 0.55,           // caustics most vivid at mid-depth
    oceanWaveLineIntensity: 0.45,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // NAVE — heart of the cathedral, peak bioluminescence
    // Sunlight is a memory. Bioluminescence IS the light.
    // Coral blazes on every pillar. Fish schools drift like congregation.
    // The architecture is overwhelming — built for an ocean god.

    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,

    sunElevation: -5,
    sunAzimuth: 210,
    turbidity: 3.0,
    rayleigh: 0.12,
    mieCoefficient: 0.035,
    mieDirectionalG: 0.58,

    fogColor: [0.015, 0.04, 0.07],      // deep blue-green
    fogDensity: 0.020,                   // thick — mid-cathedral

    sunLightColor: [0.03, 0.12, 0.28],  // faint blue — only blue survives
    sunLightIntensity: 0.10,             // barely there — 25m deep
    ambientIntensity: 0.10,              // bioluminescence fills in

    grassBaseColor: [0.01, 0.04, 0.03],
    grassTipColor: [0.02, 0.10, 0.05],
    grassWindSpeed: 0.08,
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.5,
    grassFogFade: 0.010,

    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,

    // PEAK bioluminescence — the nave is ALIVE
    fireflyBrightness: 1.3,             // BRIGHTEST — they ARE the light now
    fireflySize: 75,                     // large, close, surrounding you

    bloomIntensity: 0.80,                // MAXIMUM — everything glows
    bloomThreshold: 0.35,                // very low — catch every point of light

    fogDepthStrength: 0.08,
    fogMidColor: [0.02, 0.05, 0.10],
    fogFarColor: [0.01, 0.03, 0.06],

    colorGradeContrast: 0.07,            // light vs dark drama
    colorGradeVibrance: 0.35,            // PEAK — bioluminescence is vivid
    colorGradeWarmth: -0.04,             // cold sacred water

    vignetteDarkness: 0.45,              // OPENS slightly — the nave reveals itself
    grainOpacity: 0.04,

    dustMoteBrightness: 0.4,
    godRayIntensity: 0.25,               // fading — memory of surface
    kuwaharaStrength: 0.0,

    caDistortion: 0.010,                 // peak refraction distortion

    waveWindDirX: 0.15,
    waveWindDirY: 0.25,
    waveWindSpeed: 0.15,
    waveWindStrength: 0.06,              // current flows through pillars

    dofFocusDistance: 6,                 // INTIMATE — among the pillars
    dofBokehScale: 5.5,                 // heavy bokeh — distant pillars dissolve

    splitToneWarm: [0.42, 0.58, 0.65],   // teal "warm"
    splitToneCool: [0.28, 0.42, 0.62],   // cold deep blue

    oceanColorNear: [0.015, 0.08, 0.12],
    oceanColorFar: [0.008, 0.03, 0.06],
    oceanFoamBrightness: 0.30,           // caustics dimming
    oceanWaveLineIntensity: 0.25,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // CRYPT — deep cathedral, bioluminescence is primary light
    // Natural light is gone. Coral BLAZES on every surface.
    // Every pillar is a candelabra of living light.
    // The most intimate moment — among the dead and the endlessly alive.
    // "The deeper you go, the more alive it gets."

    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,

    sunElevation: -5,
    sunAzimuth: 215,
    turbidity: 3.5,
    rayleigh: 0.10,
    mieCoefficient: 0.040,              // maximum scatter
    mieDirectionalG: 0.55,

    fogColor: [0.01, 0.025, 0.05],      // near-black blue
    fogDensity: 0.025,                   // EXTREME — oppressive depth

    sunLightColor: [0.02, 0.06, 0.15],  // ghost of blue
    sunLightIntensity: 0.04,             // almost nothing — 35m deep
    ambientIntensity: 0.10,              // bioluminescence IS the ambient

    grassBaseColor: [0.008, 0.03, 0.02],
    grassTipColor: [0.02, 0.08, 0.04],
    grassWindSpeed: 0.06,                // barely moving — deep current is slow
    grassAmbientStrength: 0.10,
    grassTranslucency: 0.35,
    grassFogFade: 0.012,

    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,

    // Bioluminescence still strong but not frantic
    fireflyBrightness: 1.1,
    fireflySize: 80,

    bloomIntensity: 0.75,
    bloomThreshold: 0.32,

    fogDepthStrength: 0.10,
    fogMidColor: [0.01, 0.03, 0.06],
    fogFarColor: [0.005, 0.02, 0.04],

    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.30,            // bioluminescence is the only color
    colorGradeWarmth: -0.03,             // slightly less cold — bio has warmth

    vignetteDarkness: 0.60,              // tightening
    grainOpacity: 0.05,

    dustMoteBrightness: 0.25,            // marine snow catching bioluminescent light
    godRayIntensity: 0.08,               // ghost of surface light
    kuwaharaStrength: 0.0,

    caDistortion: 0.007,                 // easing

    waveWindDirX: 0.1,
    waveWindDirY: 0.1,
    waveWindSpeed: 0.10,
    waveWindStrength: 0.03,              // deep, slow current

    dofFocusDistance: 5,                 // very close — coral on nearby pillars
    dofBokehScale: 6.5,                 // HEAVY bokeh — distant = soft light orbs

    splitToneWarm: [0.38, 0.55, 0.52],   // teal-green (bioluminescent cast)
    splitToneCool: [0.22, 0.35, 0.55],   // deep indigo

    oceanColorNear: [0.008, 0.05, 0.08],
    oceanColorFar: [0.004, 0.02, 0.04],
    oceanFoamBrightness: 0.12,           // caustics almost invisible
    oceanWaveLineIntensity: 0.10,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // ABYSS — cathedral floor, fading light far above
    // Stone worn smooth by centuries. Looking UP: pillars recede
    // into darkness, and far above, the faintest shimmer of surface.
    // The figure kneels at the altar. Ghost or memory.
    // Bioluminescence pulses slowly, like a heartbeat.
    // The pressure is presence. "Every note made sacred by the pressure."

    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,

    sunElevation: -5,
    sunAzimuth: 220,
    turbidity: 4.0,
    rayleigh: 0.08,
    mieCoefficient: 0.045,              // maximum scatter — deep water
    mieDirectionalG: 0.50,

    fogColor: [0.006, 0.015, 0.03],     // near-black — the abyss
    fogDensity: 0.030,                   // EXTREME — can barely see 12m

    sunLightColor: [0.01, 0.04, 0.10],  // faintest blue — 42m deep
    sunLightIntensity: 0.02,             // almost nothing from above
    ambientIntensity: 0.06,              // bioluminescence fading too

    grassBaseColor: [0.006, 0.025, 0.02],
    grassTipColor: [0.015, 0.06, 0.03],
    grassWindSpeed: 0.04,                // nearly still — deep stillness
    grassAmbientStrength: 0.08,
    grassTranslucency: 0.25,
    grassFogFade: 0.015,

    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,

    // The abyss is quieter — even life rests here
    fireflyBrightness: 0.6,             // dimming — even life is quieter
    fireflySize: 60,

    bloomIntensity: 0.50,                // settling
    bloomThreshold: 0.38,

    fogDepthStrength: 0.12,              // STRONGEST depth fog
    fogMidColor: [0.008, 0.02, 0.04],
    fogFarColor: [0.003, 0.01, 0.025],

    colorGradeContrast: 0.03,            // FLATTENING — abyss compresses contrast
    colorGradeVibrance: 0.12,            // color is a luxury of light
    colorGradeWarmth: -0.01,             // almost neutral — beyond temperature

    vignetteDarkness: 0.88,              // HEAVY tunnel — the pressure closes in
    grainOpacity: 0.06,                  // grain increases — old film, old memory

    dustMoteBrightness: 0.10,            // marine snow sparse
    godRayIntensity: 0.02,               // ghost of light from 42m above
    kuwaharaStrength: 0.0,

    caDistortion: 0.004,                 // settling — the deep is still

    waveWindDirX: 0.05,
    waveWindDirY: 0.05,
    waveWindSpeed: 0.06,
    waveWindStrength: 0.015,             // barely any current — stillness

    // The abyss is paradoxically wide-focus — nowhere else to look
    dofFocusDistance: 10,                // the altar and figure
    dofBokehScale: 4.0,                 // moderate — let the viewer see

    splitToneWarm: [0.32, 0.45, 0.42],   // muted teal fading
    splitToneCool: [0.18, 0.28, 0.45],   // deep indigo — color of pressure

    oceanColorNear: [0.005, 0.03, 0.05],
    oceanColorFar: [0.002, 0.015, 0.03],
    oceanFoamBrightness: 0.03,           // caustics are a distant memory
    oceanWaveLineIntensity: 0.03,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
