// Volcanic Observatory atmosphere keyframes — Awe at the Threshold of Understanding
// Scroll arc: RIM ARRIVAL → REVELATION → PEAK AWE → CONTEMPLATION → DEPARTURE
// "Beauty born from destruction. Fire below. Ice above. The contrast IS the music."
//
// CRITICAL: t=0 must be IMMEDIATELY recognizable as volcanic.
// Split world: orange-red glow from BELOW (lava), cold blue-white stars ABOVE.
// The viewer stands on the rim from the start — no slow dark approach.
// sunLightColor is orange because lava IS the light source.
// fogColor is orange haze, not black.

export const VOLCANIC_OBSERVATORY_KEYFRAMES = [
  {
    t: 0.0, // RIM ARRIVAL — already on the rim, lava glowing below, stars above
    // Immediately dramatic. Orange haze from below, cold stars above.
    // The viewer knows this is NOT the meadow.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.7,            // stars visible from the start — cold sky above
    sunElevation: -10,              // just below horizon — orange rim glow
    sunAzimuth: 180,
    turbidity: 1.0,
    rayleigh: 0.3,
    mieCoefficient: 0.003,
    mieDirectionalG: 0.85,
    fogColor: [0.15, 0.05, 0.02],   // ORANGE haze — lava light diffused through air
    fogDensity: 0.003,              // see the crater — not blind
    sunLightColor: [1.0, 0.4, 0.1], // ORANGE — lava IS the directional light
    sunLightIntensity: 1.0,         // strong — the orange glow illuminates terrain
    ambientIntensity: 0.10,         // warm orange ambient from below
    grassBaseColor: [0.04, 0.03, 0.02],  // dark basalt — no grass grows here
    grassTipColor: [0.06, 0.04, 0.03],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.10,
    grassTranslucency: 0.0,
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.0,         // no fireflies — embers are separate particle system
    fireflySize: 25,
    bloomIntensity: 0.75,            // heavy bloom — the lava glow spills everywhere
    bloomThreshold: 0.25,            // low threshold — catches all orange-hot surfaces
    fogDepthStrength: 0.06,
    fogMidColor: [0.15, 0.06, 0.02], // orange mid-distance haze
    fogFarColor: [0.08, 0.03, 0.01], // darker orange at distance
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.35,        // vivid — fire is saturated
    colorGradeWarmth: 0.18,          // strong warmth — everything orange-tinted
    vignetteDarkness: 0.50,          // moderate — can see the full scene
    grainOpacity: 0.06,
    dustMoteBrightness: 0.4,         // volcanic ash visible in orange light
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.005,             // slight — heat shimmer tension
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 15,            // focused on crater below
    dofBokehScale: 3.0,
    splitToneWarm: [1.0, 0.55, 0.15],   // deep fire amber in shadows
    splitToneCool: [0.55, 0.65, 0.92],  // cold blue-white in highlights (stars)
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // REVELATION — looking deeper into the crater, lava veins visible
    // The glow intensifies as the view opens up. Stars sharpen above.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.85,           // stars sharpening — sky clearing
    sunElevation: -10,
    sunAzimuth: 180,
    turbidity: 1.0,
    rayleigh: 0.3,
    mieCoefficient: 0.003,
    mieDirectionalG: 0.85,
    fogColor: [0.18, 0.06, 0.02],   // warmer — closer to lava
    fogDensity: 0.002,              // clearing — the crater reveals itself
    sunLightColor: [1.0, 0.45, 0.12], // intensifying orange
    sunLightIntensity: 1.3,
    ambientIntensity: 0.12,
    grassBaseColor: [0.04, 0.03, 0.02],
    grassTipColor: [0.06, 0.04, 0.03],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.0,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.85,            // building — lava veins glowing through
    bloomThreshold: 0.22,
    fogDepthStrength: 0.05,
    fogMidColor: [0.18, 0.07, 0.02],
    fogFarColor: [0.10, 0.04, 0.01],
    colorGradeContrast: 0.10,
    colorGradeVibrance: 0.45,        // more vivid — fire revealing color
    colorGradeWarmth: 0.22,
    vignetteDarkness: 0.40,          // opening up
    grainOpacity: 0.06,
    dustMoteBrightness: 0.5,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.008,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 12,
    dofBokehScale: 4.0,
    splitToneWarm: [1.0, 0.60, 0.18],
    splitToneCool: [0.50, 0.62, 0.90],
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // PEAK AWE — maximum fire/ice contrast. The boundary between creation and entropy.
    // Bloom at max. Stars at max. Lava pulses strongest. Extreme split-tone.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 1.0,            // PEAK — every star blazing, cold white above
    sunElevation: -10,
    sunAzimuth: 180,
    turbidity: 1.0,
    rayleigh: 0.25,
    mieCoefficient: 0.002,
    mieDirectionalG: 0.82,
    fogColor: [0.20, 0.07, 0.02],   // peak orange haze — molten light in the air
    fogDensity: 0.0015,             // clearest — maximum view distance
    sunLightColor: [1.0, 0.5, 0.15], // peak orange — lava at full power
    sunLightIntensity: 1.6,          // blazing
    ambientIntensity: 0.14,
    grassBaseColor: [0.04, 0.03, 0.02],
    grassTipColor: [0.06, 0.04, 0.03],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.15,
    grassTranslucency: 0.0,
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 1.1,             // MAX BLOOM — the whole crater is incandescent
    bloomThreshold: 0.18,            // everything orange catches bloom
    fogDepthStrength: 0.04,
    fogMidColor: [0.22, 0.08, 0.02], // deep orange mid
    fogFarColor: [0.12, 0.05, 0.01],
    colorGradeContrast: 0.14,        // maximum contrast — fire vs ice
    colorGradeVibrance: 0.55,        // peak vivid
    colorGradeWarmth: 0.28,          // maximum warmth — lava dominates the grade
    vignetteDarkness: 0.30,          // wide open — expansive
    grainOpacity: 0.07,
    dustMoteBrightness: 0.7,         // ash swirling in the glow
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.018,             // peak tension — heat distortion
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 10,            // focused on the lava surface
    dofBokehScale: 5.5,             // heavy cinematic bokeh
    splitToneWarm: [1.0, 0.50, 0.10],   // PURE FIRE — deep molten amber in shadows
    splitToneCool: [0.45, 0.60, 0.95],  // ICE BLUE — cold stars in highlights
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // CONTEMPLATION — near the observatory, looking inward, wonder settles
    // The telescope is nearby but you never look through it.
    // Bloom subsides slightly. The mystery remains.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.80,
    sunElevation: -10,
    sunAzimuth: 180,
    turbidity: 1.0,
    rayleigh: 0.28,
    mieCoefficient: 0.003,
    mieDirectionalG: 0.84,
    fogColor: [0.12, 0.05, 0.02],   // slightly cooler — pulling back from the heat
    fogDensity: 0.003,
    sunLightColor: [1.0, 0.42, 0.12],
    sunLightIntensity: 1.1,
    ambientIntensity: 0.10,
    grassBaseColor: [0.04, 0.03, 0.02],
    grassTipColor: [0.06, 0.04, 0.03],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.0,
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.65,
    bloomThreshold: 0.28,
    fogDepthStrength: 0.06,
    fogMidColor: [0.12, 0.05, 0.02],
    fogFarColor: [0.06, 0.03, 0.01],
    colorGradeContrast: 0.10,
    colorGradeVibrance: 0.38,
    colorGradeWarmth: 0.20,
    vignetteDarkness: 0.50,          // narrowing — focus on the mystery
    grainOpacity: 0.07,
    dustMoteBrightness: 0.5,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.010,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 6,             // tight — intimate with the telescope
    dofBokehScale: 6.5,
    splitToneWarm: [0.98, 0.58, 0.20],
    splitToneCool: [0.52, 0.64, 0.90],
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // DEPARTURE — pulling away, glow fades, stars remain. Cold wins.
    // You leave carrying the question. The warmth fades. The cold remains.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.40,           // dimming — descending the outer slope
    sunElevation: -10,
    sunAzimuth: 180,
    turbidity: 1.0,
    rayleigh: 0.3,
    mieCoefficient: 0.003,
    mieDirectionalG: 0.85,
    fogColor: [0.08, 0.03, 0.02],   // cooling — orange fading to dark
    fogDensity: 0.006,              // thickening — the crater recedes
    sunLightColor: [0.8, 0.3, 0.08], // fading orange
    sunLightIntensity: 0.5,          // dimming — the glow is behind you
    ambientIntensity: 0.05,
    grassBaseColor: [0.04, 0.03, 0.02],
    grassTipColor: [0.06, 0.04, 0.03],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.10,
    grassTranslucency: 0.0,
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.25,            // fading — the glow is behind you
    bloomThreshold: 0.40,
    fogDepthStrength: 0.08,
    fogMidColor: [0.06, 0.03, 0.02],
    fogFarColor: [0.03, 0.02, 0.01],
    colorGradeContrast: 0.04,
    colorGradeVibrance: 0.12,        // draining — memory, not sensation
    colorGradeWarmth: 0.08,          // residual warmth — "you carry the fire"
    vignetteDarkness: 0.75,          // tunnel closing
    grainOpacity: 0.08,
    dustMoteBrightness: 0.2,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.003,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 40,            // losing focus — can't hold it
    dofBokehScale: 7.0,             // everything dissolves
    splitToneWarm: [0.85, 0.60, 0.35],  // amber fading
    splitToneCool: [0.62, 0.68, 0.85],  // cool dominant — cold wins
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
