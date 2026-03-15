// Floating Library atmosphere keyframes — Sacred Knowledge
// Scroll arc: Entrance → Recognition → Immersion → Revelation → Belonging
// "A vast library suspended in clouds. Books drift weightlessly.
//  Score sheets are the books — Michael's music IS the collection."
//
// You enter darkness. Something vast is here.
// Then: warm lamplight. Books resolving from fog.
// You spiral upward through stacks that shouldn't be possible.
// At the top, looking down — you realize you were always part of this archive.
//
// Unique atmospheric features:
// - Fireflies repurposed as warm lamp glows (large, steady, amber)
// - Dust motes repurposed as "words escaping pages" (upward drift, warm white)
// - Stars repurposed as distant lamp sparkles between shelves
// - No grass (cloud floor below), but wind params drive page flutter speed
// - No ocean, no rain, no petals (interior space)
// - DOF is CRITICAL — the bokeh between shelves IS the atmosphere
// - Bloom is CRITICAL — lamp halos define the space

export const FLOATING_LIBRARY_KEYFRAMES = [
  {
    t: 0.0, // ENTRANCE — darkness, scale, the first warm glow far away
    // "You step into darkness. Something vast is here — you feel it before you see it."
    // The only light: a single distant amber point. The fog swallows everything else.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.05,           // one or two distant lamp sparkles, almost invisible
    sunElevation: -15,              // deep below horizon — no sun in an interior
    sunAzimuth: 200,                // arbitrary (no visible sun)
    turbidity: 2.0,
    rayleigh: 0.2,                  // minimal sky scattering
    mieCoefficient: 0.005,
    mieDirectionalG: 0.80,
    fogColor: [0.04, 0.03, 0.02],  // near-black, slightly warm
    fogDensity: 0.022,              // VERY thick — can barely see 10 units ahead
    sunLightColor: [0.60, 0.45, 0.25],  // warm amber direction (faked interior light)
    sunLightIntensity: 0.15,        // barely any directional light
    ambientIntensity: 0.03,         // almost no fill — deep darkness
    // Grass params required for interpolation but grass is disabled
    grassBaseColor: [0.06, 0.04, 0.02],  // matches cloud floor
    grassTipColor: [0.08, 0.06, 0.03],
    grassWindSpeed: 0.05,           // drives page flutter — barely moving on entrance
    grassAmbientStrength: 0.10,
    grassTranslucency: 0.1,
    grassFogFade: 0.006,
    cloudShadowOpacity: 0.0,        // no cloud shadows indoors
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.25,        // just a HINT of warm lamp glow far away
    fireflySize: 140,               // large — these are lamp orbs, not insects
    bloomIntensity: 0.15,           // minimal bloom — just the lamp hint
    bloomThreshold: 0.85,           // only brightest source blooms
    fogDepthStrength: 0.08,         // strong depth fog — swallows distance
    fogMidColor: [0.06, 0.04, 0.02],
    fogFarColor: [0.03, 0.02, 0.01],
    colorGradeContrast: 0.02,       // flat — can't distinguish anything yet
    colorGradeVibrance: 0.05,       // desaturated darkness
    colorGradeWarmth: 0.02,         // barely warm — warmth is earned
    vignetteDarkness: 0.92,         // near-total edge darkness — tunnel entrance
    grainOpacity: 0.06,             // film grain — ancient place
    dustMoteBrightness: 0.0,        // no word particles yet — books haven't been disturbed
    godRayIntensity: 0.0,           // no directional light
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.5,
    waveWindDirY: 0.5,
    waveWindSpeed: 0.1,
    waveWindStrength: 0.0,          // no wind in entrance
    dofFocusDistance: 30,            // wide focus — nothing specific to look at
    dofBokehScale: 2.0,             // subtle bokeh — world is uniformly dark
    splitToneWarm: [0.70, 0.55, 0.35],  // cold amber (not yet warm)
    splitToneCool: [0.45, 0.42, 0.40],  // neutral dark
    // Ocean/water zeros (interior space)
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // RECOGNITION — shelves resolve from fog, books drift into view
    // "The warm light multiplies. You begin to see: shelves. Books. Floating."
    // Fog lifts enough to reveal the nearest shelf tier. Multiple lamp glows now.
    // First word particles begin drifting upward — knowledge stirring.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.25,           // more distant lamp sparkles visible
    sunElevation: -12,
    sunAzimuth: 210,
    turbidity: 2.0,
    rayleigh: 0.2,
    mieCoefficient: 0.006,
    mieDirectionalG: 0.82,
    fogColor: [0.06, 0.04, 0.02],  // warm dark brown — fog IS the library darkness
    fogDensity: 0.012,              // lifting — first shelves resolve
    sunLightColor: [0.75, 0.58, 0.32],  // warmer — more lamps casting direction
    sunLightIntensity: 0.35,
    ambientIntensity: 0.06,         // still dim, but shapes are visible
    grassBaseColor: [0.06, 0.04, 0.02],
    grassTipColor: [0.10, 0.07, 0.04],
    grassWindSpeed: 0.2,            // pages begin to stir
    grassAmbientStrength: 0.15,
    grassTranslucency: 0.2,
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00002,
    fireflyBrightness: 0.8,         // multiple lamp glows now visible
    fireflySize: 150,               // large warm orbs
    bloomIntensity: 0.5,            // lamp halos forming
    bloomThreshold: 0.60,           // lamps catch bloom
    fogDepthStrength: 0.06,
    fogMidColor: [0.08, 0.06, 0.03],
    fogFarColor: [0.04, 0.03, 0.02],
    colorGradeContrast: 0.06,       // more definition
    colorGradeVibrance: 0.15,       // amber starts to show
    colorGradeWarmth: 0.04,         // first warmth
    vignetteDarkness: 0.78,         // still heavy, but opening
    grainOpacity: 0.07,
    dustMoteBrightness: 0.3,        // first word particles — knowledge stirring
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.5,
    waveWindDirY: 0.5,
    waveWindSpeed: 0.2,
    waveWindStrength: 0.04,         // gentle stir
    dofFocusDistance: 10,            // focusing on nearest shelf
    dofBokehScale: 3.5,             // moderate bokeh — background starting to separate
    splitToneWarm: [0.85, 0.68, 0.42],  // amber warming
    splitToneCool: [0.50, 0.48, 0.45],  // still neutral
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // IMMERSION — surrounded by warm light, pages drifting past
    // "You're inside it. The warmth is everywhere. Pages drift past your face."
    // PEAK warmth. PEAK word particles. PEAK lamp glow. PEAK intimacy.
    // The DOF is tightest here — you're reading, absorbed, present.
    // The library is alive around you. The music IS these books.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.55,           // many distant lamps visible through gaps
    sunElevation: -10,
    sunAzimuth: 220,
    turbidity: 2.0,
    rayleigh: 0.2,
    mieCoefficient: 0.008,
    mieDirectionalG: 0.85,
    fogColor: [0.10, 0.07, 0.03],  // warmest fog — amber-tinged darkness
    fogDensity: 0.008,              // thinnest — see deep into the stacks
    sunLightColor: [0.95, 0.78, 0.42],  // PEAK warm amber
    sunLightIntensity: 0.60,        // strongest directional — lamps everywhere
    ambientIntensity: 0.10,         // warmest ambient
    grassBaseColor: [0.08, 0.05, 0.03],
    grassTipColor: [0.12, 0.08, 0.04],
    grassWindSpeed: 0.5,            // pages drifting actively
    grassAmbientStrength: 0.25,
    grassTranslucency: 0.3,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 1.5,         // PEAK lamp glow — surrounded by warm light
    fireflySize: 160,               // largest — warm reading lamps
    bloomIntensity: 0.9,            // PEAK bloom — lamp halos define the space
    bloomThreshold: 0.45,           // everything warm catches bloom
    fogDepthStrength: 0.04,         // reduced — see more depth
    fogMidColor: [0.12, 0.08, 0.04],  // warmest mid-fog
    fogFarColor: [0.06, 0.04, 0.02],
    colorGradeContrast: 0.08,       // moderate — readable
    colorGradeVibrance: 0.35,       // PEAK — amber saturation
    colorGradeWarmth: 0.10,         // PEAK warmth — incandescent library
    vignetteDarkness: 0.55,         // SOFTEST — the library opens up to you
    grainOpacity: 0.07,
    dustMoteBrightness: 0.8,        // PEAK word particles — knowledge swirling
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.35,
    waveWindStrength: 0.08,         // gentle wind through stacks
    dofFocusDistance: 5,             // INTIMATE — focus on nearest book
    dofBokehScale: 5.5,             // heavy bokeh — everything beyond focus is warm blur
    splitToneWarm: [0.95, 0.78, 0.48],  // PEAK amber — pure incandescent warmth
    splitToneCool: [0.58, 0.52, 0.45],  // warm neutral (no cold in the heart)
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // REVELATION — the impossible scale, Escher moment
    // "You look out and down. The stacks go on FOREVER. This isn't possible."
    // A moment of vertigo. The fog pulls back. You see the full structure.
    // Cooler — the vastness is slightly awe-struck, not cozy.
    // DOF goes wide — taking in the whole impossible geometry.
    // Star sparkles peak — distant lamps in every direction, infinite depth.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.90,           // PEAK — distant lamps EVERYWHERE, infinite depth
    sunElevation: -8,
    sunAzimuth: 230,
    turbidity: 2.0,
    rayleigh: 0.3,                  // slightly more scattering — haze of scale
    mieCoefficient: 0.006,
    mieDirectionalG: 0.84,
    fogColor: [0.08, 0.06, 0.03],  // slightly cooler — awe, not warmth
    fogDensity: 0.005,              // THINNEST — see the full impossible scale
    sunLightColor: [0.82, 0.68, 0.40],  // slightly cooler — awe-struck moment
    sunLightIntensity: 0.50,
    ambientIntensity: 0.08,         // slightly less ambient — dramatic shadows for Escher geometry
    grassBaseColor: [0.07, 0.05, 0.03],
    grassTipColor: [0.10, 0.07, 0.04],
    grassWindSpeed: 0.3,            // pages drift but you're looking, not reading
    grassAmbientStrength: 0.20,
    grassTranslucency: 0.2,
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00004,
    fireflyBrightness: 1.0,         // lamp glows visible but not peak — context lamps
    fireflySize: 130,               // slightly smaller — they're further away
    bloomIntensity: 0.65,           // reduced bloom — clarity for the reveal
    bloomThreshold: 0.55,           // controlled bloom
    fogDepthStrength: 0.03,         // reduced — see MORE depth for the reveal
    fogMidColor: [0.08, 0.06, 0.03],
    fogFarColor: [0.04, 0.03, 0.02],
    colorGradeContrast: 0.12,       // HIGHEST — sharp edges, Escher geometry pops
    colorGradeVibrance: 0.25,       // moderate — scale doesn't need saturation
    colorGradeWarmth: 0.06,         // cooled from peak — awe is cooler than intimacy
    vignetteDarkness: 0.35,         // WIDEST — panoramic, taking it all in
    grainOpacity: 0.06,
    dustMoteBrightness: 0.5,        // word particles visible but not dominating
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.25,
    waveWindStrength: 0.05,
    dofFocusDistance: 18,            // WIDE focus — taking in the whole structure
    dofBokehScale: 2.5,             // reduced bokeh — clarity for the reveal
    splitToneWarm: [0.88, 0.72, 0.48],  // amber present but not dominating
    splitToneCool: [0.55, 0.58, 0.62],  // cool creeps in — scale is humbling
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // BELONGING — you ARE part of the collection, warmth closes in
    // "The fog returns, but it's not darkness anymore. It's warmth wrapping around you."
    // Fog thickens warmly. Lamp glow softens. Grain increases — memory quality.
    // The most intimate DOF. The heaviest bloom. You belong here.
    // You were always part of this archive. Every note was always yours.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.30,           // fading — the vastness recedes, intimacy returns
    sunElevation: -15,
    sunAzimuth: 200,
    turbidity: 2.0,
    rayleigh: 0.2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.80,
    fogColor: [0.08, 0.06, 0.03],  // warm fog — comforting, not oppressive
    fogDensity: 0.016,              // thick again — but WARM thickness
    sunLightColor: [0.90, 0.72, 0.38],  // deep amber
    sunLightIntensity: 0.40,
    ambientIntensity: 0.07,         // dim but warm
    grassBaseColor: [0.06, 0.04, 0.02],
    grassTipColor: [0.08, 0.06, 0.03],
    grassWindSpeed: 0.1,            // pages slow to a gentle drift
    grassAmbientStrength: 0.15,
    grassTranslucency: 0.1,
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 1.0,         // warm but softened — gentle lamps
    fireflySize: 120,               // slightly smaller — intimate scale
    bloomIntensity: 0.85,           // near-peak bloom — warm halos everywhere
    bloomThreshold: 0.50,
    fogDepthStrength: 0.07,         // strong depth fog — wrapping in
    fogMidColor: [0.10, 0.07, 0.04],  // warmest fog — amber envelope
    fogFarColor: [0.06, 0.05, 0.03],
    colorGradeContrast: 0.05,       // soft — memory quality
    colorGradeVibrance: 0.28,       // warm saturation
    colorGradeWarmth: 0.12,         // DEEPEST warmth — you belong here
    vignetteDarkness: 0.82,         // closing in — like being held by the library
    grainOpacity: 0.10,             // PEAK grain — this is memory, not present
    dustMoteBrightness: 0.4,        // word particles slow, gentle, lingering
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.5,
    waveWindDirY: 0.5,
    waveWindSpeed: 0.15,
    waveWindStrength: 0.02,         // barely any wind — stillness of belonging
    dofFocusDistance: 3,             // MOST intimate — closest book is everything
    dofBokehScale: 6.5,             // HEAVIEST bokeh — world dissolves into warm light
    splitToneWarm: [0.95, 0.80, 0.52],  // deepest amber — you carry this warmth
    splitToneCool: [0.52, 0.50, 0.48],  // neutralized — no cold remains
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
