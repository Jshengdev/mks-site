// Volcanic Observatory atmosphere keyframes — Awe at the Threshold of Understanding
// Scroll arc: Approach → Revelation → Wonder → Contemplation → Departure
// "Beauty born from destruction. The telescope points at something
//  the viewer never sees. Fire below. Ice above."
//
// The emotional contrast IS the music: warm destruction below, cold eternity above.
// The viewer stands at the boundary between creation and entropy.
//
// Lava-specific params (emberBrightness, lavaEmissive) are new additions —
// WorldEngine wires them to lava/ember subsystems when present.

export const VOLCANIC_OBSERVATORY_KEYFRAMES = [
  {
    t: 0.0, // APPROACH — darkness, walking toward the rim, only a faint warm glow ahead
    // The viewer doesn't know what's coming. Just a distant orange shimmer.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.15,     // stars barely visible — horizon glow obscures them
    sunElevation: -40,
    sunAzimuth: 180,
    turbidity: 1.0,
    rayleigh: 0.3,
    mieCoefficient: 0.003,
    mieDirectionalG: 0.85,
    fogColor: [0.04, 0.02, 0.02],   // warm-black volcanic haze
    fogDensity: 0.008,              // thick — approaching blind
    sunLightColor: [0.15, 0.10, 0.12],
    sunLightIntensity: 0.15,
    ambientIntensity: 0.03,         // near total darkness
    grassBaseColor: [0.03, 0.03, 0.02],  // dead — no grass on volcano
    grassTipColor: [0.05, 0.05, 0.03],
    grassWindSpeed: 0.0,            // no grass
    grassAmbientStrength: 0.10,
    grassTranslucency: 0.0,
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.0,        // no fireflies — embers replace them
    fireflySize: 25,
    bloomIntensity: 0.3,            // subtle — just the distant glow
    bloomThreshold: 0.4,
    fogDepthStrength: 0.08,
    fogMidColor: [0.06, 0.03, 0.02],
    fogFarColor: [0.03, 0.01, 0.01],
    colorGradeContrast: 0.03,
    colorGradeVibrance: 0.10,       // muted — darkness flattens color
    colorGradeWarmth: 0.05,         // barely warm — cold approach
    vignetteDarkness: 0.85,         // heavy tunnel — can barely see
    grainOpacity: 0.06,
    dustMoteBrightness: 0.2,        // volcanic ash drifting
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 25,           // distant focus — looking toward the glow
    dofBokehScale: 2.0,            // mild bokeh
    splitToneWarm: [0.90, 0.60, 0.35],  // warm amber in shadows (lava cast)
    splitToneCool: [0.70, 0.72, 0.85],  // cold blue above
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // REVELATION — cresting the rim, the lava lake reveals below
    // The abyss opens. Fire below, first real stars above. Breath catches.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.55,          // stars emerging — sky clearing as you rise
    sunElevation: -40,
    sunAzimuth: 180,
    turbidity: 1.0,
    rayleigh: 0.3,
    mieCoefficient: 0.003,
    mieDirectionalG: 0.85,
    fogColor: [0.06, 0.03, 0.02],  // warmer — lava light fills the haze
    fogDensity: 0.004,             // clearing — the crater reveals itself
    sunLightColor: [0.20, 0.12, 0.10],
    sunLightIntensity: 0.25,
    ambientIntensity: 0.05,
    grassBaseColor: [0.03, 0.03, 0.02],
    grassTipColor: [0.05, 0.05, 0.03],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.0,
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.6,            // lava bloom building
    bloomThreshold: 0.35,           // more catches bloom — lava veins glow
    fogDepthStrength: 0.06,
    fogMidColor: [0.08, 0.04, 0.02],
    fogFarColor: [0.04, 0.02, 0.01],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.25,       // color returning — fire is vivid
    colorGradeWarmth: 0.15,         // warming — lava light reaches you
    vignetteDarkness: 0.60,         // opening up — you can see more
    grainOpacity: 0.06,
    dustMoteBrightness: 0.4,        // more ash visible in lava light
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 15,           // focusing on the lava lake
    dofBokehScale: 3.5,            // moderate bokeh
    splitToneWarm: [0.95, 0.65, 0.30],  // strong warm amber — lava dominates
    splitToneCool: [0.60, 0.68, 0.88],  // cool highlights from stars
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // WONDER — peak. Full vista. Fire below, ice above. Maximum contrast.
    // This is the moment. The music lives in the tension between fire and ice.
    // Bloom is highest. Stars are brightest. Lava pulses strongest.
    // The viewer IS the boundary between creation and entropy.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 1.0,           // PEAK — "impossibly clear night sky, every star visible"
    sunElevation: -40,
    sunAzimuth: 180,
    turbidity: 1.0,
    rayleigh: 0.25,
    mieCoefficient: 0.002,
    mieDirectionalG: 0.82,
    fogColor: [0.05, 0.02, 0.01],  // warmest — lava illuminates everything
    fogDensity: 0.002,             // clearest — maximum view distance
    sunLightColor: [0.25, 0.15, 0.10],
    sunLightIntensity: 0.3,
    ambientIntensity: 0.06,
    grassBaseColor: [0.03, 0.03, 0.02],
    grassTipColor: [0.05, 0.05, 0.03],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.15,
    grassTranslucency: 0.0,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.95,           // PEAK BLOOM — the whole crater glows
    bloomThreshold: 0.28,           // low threshold — everything alive with light
    fogDepthStrength: 0.04,
    fogMidColor: [0.10, 0.05, 0.02],
    fogFarColor: [0.05, 0.03, 0.01],
    colorGradeContrast: 0.10,       // maximum contrast — fire vs ice
    colorGradeVibrance: 0.40,       // vivid — colors alive
    colorGradeWarmth: 0.25,         // peak warmth — lava dominates the grade
    vignetteDarkness: 0.35,         // wide open — expansive vista
    grainOpacity: 0.07,
    dustMoteBrightness: 0.6,        // ash clearly visible, rising through the glow
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 10,           // focused on the lava lake surface
    dofBokehScale: 5.0,            // heavy bokeh — cinematic
    splitToneWarm: [1.0, 0.70, 0.25],   // PEAK warm — pure fire amber
    splitToneCool: [0.50, 0.65, 0.90],  // cool blue-ice highlights
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // CONTEMPLATION — near the observatory/telescope, looking inward
    // The wonder settles into something quieter. The telescope is nearby
    // but you never look through it. The mystery remains.
    // What is it pointed at? You'll never know. That's the point.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.85,          // still bright but the viewer is looking inward now
    sunElevation: -40,
    sunAzimuth: 180,
    turbidity: 1.0,
    rayleigh: 0.28,
    mieCoefficient: 0.003,
    mieDirectionalG: 0.84,
    fogColor: [0.04, 0.02, 0.02],
    fogDensity: 0.004,             // slightly hazier — contemplation narrows the world
    sunLightColor: [0.20, 0.12, 0.12],
    sunLightIntensity: 0.25,
    ambientIntensity: 0.05,
    grassBaseColor: [0.03, 0.03, 0.02],
    grassTipColor: [0.05, 0.05, 0.03],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.0,
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.65,           // subsiding but still warm
    bloomThreshold: 0.32,
    fogDepthStrength: 0.06,
    fogMidColor: [0.07, 0.04, 0.02],
    fogFarColor: [0.04, 0.02, 0.01],
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.30,
    colorGradeWarmth: 0.20,
    vignetteDarkness: 0.55,         // narrowing — the world focuses
    grainOpacity: 0.07,
    dustMoteBrightness: 0.5,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 6,            // tight focus — intimate, the telescope nearby
    dofBokehScale: 6.5,            // heavy bokeh — abstract edges
    splitToneWarm: [0.95, 0.68, 0.30],  // amber sustained
    splitToneCool: [0.55, 0.68, 0.88],  // cool holding
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // DEPARTURE — pulling away, the glow fades behind, stars remain
    // You leave carrying the question. What was the telescope pointed at?
    // The warmth fades. The cold remains. But you carry both.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.45,          // stars remain but dim — you're descending the outer slope
    sunElevation: -40,
    sunAzimuth: 180,
    turbidity: 1.0,
    rayleigh: 0.3,
    mieCoefficient: 0.003,
    mieDirectionalG: 0.85,
    fogColor: [0.03, 0.02, 0.02],
    fogDensity: 0.010,             // thickening — the crater recedes into haze
    sunLightColor: [0.15, 0.10, 0.10],
    sunLightIntensity: 0.15,
    ambientIntensity: 0.03,
    grassBaseColor: [0.03, 0.03, 0.02],
    grassTipColor: [0.05, 0.05, 0.03],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.10,
    grassTranslucency: 0.0,
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.15,           // fading — the glow is behind you now
    bloomThreshold: 0.5,
    fogDepthStrength: 0.08,
    fogMidColor: [0.04, 0.02, 0.02],
    fogFarColor: [0.02, 0.01, 0.01],
    colorGradeContrast: 0.03,       // flattening — the contrast dissolves
    colorGradeVibrance: 0.08,       // draining — carrying it as memory, not sensation
    colorGradeWarmth: 0.08,         // residual warmth — "you carry the fire"
    vignetteDarkness: 0.80,         // tunnel closing — back to darkness
    grainOpacity: 0.08,             // grain increasing — memory texture
    dustMoteBrightness: 0.2,        // ash still drifts
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 40,           // losing focus — can't hold it
    dofBokehScale: 7.0,            // everything dissolves into bokeh
    splitToneWarm: [0.85, 0.65, 0.45],  // amber fading — warmth leaving
    splitToneCool: [0.65, 0.70, 0.82],  // cool dominant — cold wins in the end
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
