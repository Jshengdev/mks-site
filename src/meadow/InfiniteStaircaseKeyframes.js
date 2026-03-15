// Infinite Staircase atmosphere keyframes — The Eternal Becoming
// Scroll arc: Threshold → Warmth → Void → Illumination → Return
// "You climb forever but arrive everywhere.
//  Each landing is a different life. Each step is the same choice made again."
//
// Each landing is a RADICALLY different emotional space.
// The staircase doesn't change — YOU change. The atmosphere IS the journey.
//
// THRESHOLD: grey stone, neutral, the first step (you don't know what's coming)
// WARMTH: amber light, memory, childhood, something lost
// VOID: blue-black vertigo, looking down the infinite center
// ILLUMINATION: white radiance, revelation, the music's climax
// RETURN: the same grey — but you're different now
//
// Key technique: CONTRAST between landings. Not gradual shifts like other worlds.
// Each transition should feel like passing through a door.
// Fog density is the door mechanism — thickens at transitions, clears at landings.
//
// Stolen values:
// - VOID vignette 0.92 from Storm Field TEMPEST (tunnel vision = vertigo)
// - ILLUMINATION bloom 0.8/0.45 adapted from Golden Meadow ALIVE (revelation)
// - RETURN grain 0.09 from Night Meadow ACCEPTANCE (memory degrading)
// - Ghost-light color [0.65, 0.72, 0.90] — cool blue-white, NOT warm amber
//   (these are other climbers, or other versions of you — not comfort, not nature)

export const INFINITE_STAIRCASE_KEYFRAMES = [
  {
    t: 0.0, // THRESHOLD — the first step. You don't know where it leads.
    // Cool grey. Neutral. The stone is ancient and indifferent.
    // Heavy fog above and below — you can see exactly one landing.
    // The ghost-lights are far away. You're alone.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.25,         // a few stars visible through gaps in architecture
    sunElevation: -15,            // no sun — light is ambient, sourceless
    sunAzimuth: 180,
    turbidity: 2.0,
    rayleigh: 0.4,
    mieCoefficient: 0.003,
    mieDirectionalG: 0.85,
    fogColor: [0.06, 0.06, 0.08], // blue-tinged grey — stone dust
    fogDensity: 0.012,            // thick — you see 2 landings at most
    sunLightColor: [0.40, 0.40, 0.45],  // neutral grey light
    sunLightIntensity: 0.35,
    ambientIntensity: 0.06,       // just enough to see the stone
    grassBaseColor: [0.02, 0.04, 0.03],  // near-black moss
    grassTipColor: [0.05, 0.08, 0.05],
    grassWindSpeed: 0.05,          // still — interior space
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.2,        // moss doesn't transluce
    grassFogFade: 0.006,
    cloudShadowOpacity: 0.0,       // no clouds, no shadows
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.3,        // ghost-lights visible but distant
    fireflySize: 35,               // small — far away
    bloomIntensity: 0.15,          // barely any bloom
    bloomThreshold: 0.85,
    fogDepthStrength: 0.07,
    fogMidColor: [0.08, 0.08, 0.10],
    fogFarColor: [0.04, 0.04, 0.06],
    colorGradeContrast: 0.04,
    colorGradeVibrance: 0.05,      // near-monochrome — stone is grey
    colorGradeWarmth: 0.0,         // zero warmth — not earned yet
    vignetteDarkness: 0.80,        // heavy — stairwell tunnel
    grainOpacity: 0.06,
    dustMoteBrightness: 0.2,       // dust barely visible
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.02,            // barely there
    waveWindDirX: 0.0,
    waveWindDirY: 1.0,
    waveWindSpeed: 0.05,
    waveWindStrength: 0.0,         // no wind — dead air
    dofFocusDistance: 8,           // mid-range — next landing in focus
    dofBokehScale: 3.5,           // moderate — distant things soft
    splitToneWarm: [0.80, 0.78, 0.75],   // cold grey — no warmth
    splitToneCool: [0.65, 0.68, 0.78],   // steel blue
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // WARMTH — the first landing you remember.
    // Amber light seeps from unseen windows. The stone turns warm.
    // This landing smells like memory — childhood, a kitchen, something lost.
    // The dust rises gently, catching amber light.
    // Ghost-lights cluster here, brighter. You're not alone on this landing.
    // But the warmth is borrowed. You have to keep climbing.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.15,          // stars dimmed by warm light
    sunElevation: -10,
    sunAzimuth: 200,
    turbidity: 2.5,
    rayleigh: 0.5,
    mieCoefficient: 0.008,         // warm haze
    mieDirectionalG: 0.90,
    fogColor: [0.12, 0.08, 0.04],  // amber fog — warmth permeates
    fogDensity: 0.006,             // thinner — the warm landing opens up
    sunLightColor: [0.85, 0.65, 0.35],  // AMBER — the warmth landing
    sunLightIntensity: 0.80,
    ambientIntensity: 0.14,        // much brighter — warm light fills the space
    grassBaseColor: [0.04, 0.06, 0.02],  // moss catches amber
    grassTipColor: [0.10, 0.12, 0.04],   // warm-tipped moss
    grassWindSpeed: 0.12,          // barely stirring — warmth has no wind
    grassAmbientStrength: 0.25,
    grassTranslucency: 0.5,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00002,
    fireflyBrightness: 0.8,        // ghost-lights brighter here — gathering
    fireflySize: 55,               // closer, larger — warmth draws them
    bloomIntensity: 0.50,          // warm bloom
    bloomThreshold: 0.60,          // amber catches bloom
    fogDepthStrength: 0.04,
    fogMidColor: [0.14, 0.10, 0.06],
    fogFarColor: [0.08, 0.06, 0.04],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.30,      // color returns — warmth has saturation
    colorGradeWarmth: 0.15,        // WARM — the earning
    vignetteDarkness: 0.50,        // opens up — warm spaces feel larger
    grainOpacity: 0.05,
    dustMoteBrightness: 0.7,       // dust catches amber light beautifully
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.01,            // clean lens — warmth is clear
    waveWindDirX: 0.5,
    waveWindDirY: 0.5,
    waveWindSpeed: 0.1,
    waveWindStrength: 0.03,        // whisper
    dofFocusDistance: 5,           // intimate — focus on nearby details
    dofBokehScale: 4.5,           // warm bokeh — ghost-lights become soft amber orbs
    splitToneWarm: [0.95, 0.78, 0.45],   // PEAK amber — this is the warm landing
    splitToneCool: [0.78, 0.72, 0.65],   // warm shadows too — everything is warm
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // VOID — looking down the central spiral. The abyss.
    // Deep blue-black. The coldest point. Maximum vertigo.
    // The staircase drops away below you. Or is that above?
    // A single ghost-light far below (or far above) — unreachable.
    // This is where you realize you can't go back.
    // The music is at its most minimal here. A single held note.
    // Maximum CA distortion. Maximum vignette. The lens can't hold.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.60,          // stars vivid through the void above
    sunElevation: -25,             // deep darkness
    sunAzimuth: 220,
    turbidity: 1.0,
    rayleigh: 0.3,
    mieCoefficient: 0.002,
    mieDirectionalG: 0.80,
    fogColor: [0.02, 0.02, 0.06],  // near-black blue — the void
    fogDensity: 0.005,             // thin fog — you can see DOWN
    sunLightColor: [0.20, 0.22, 0.40],  // cold blue — moonlight through stone
    sunLightIntensity: 0.20,
    ambientIntensity: 0.03,        // near-dark — just edges visible
    grassBaseColor: [0.01, 0.02, 0.03],  // blue-black moss
    grassTipColor: [0.03, 0.05, 0.08],   // blue-tipped
    grassWindSpeed: 0.02,          // dead still — the void has no wind
    grassAmbientStrength: 0.08,
    grassTranslucency: 0.1,
    grassFogFade: 0.008,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.4,        // a single ghost-light far away
    fireflySize: 30,               // tiny — impossibly distant
    bloomIntensity: 0.25,          // bloom on the distant ghost-light
    bloomThreshold: 0.70,
    fogDepthStrength: 0.10,        // maximum depth fog — the void IS depth
    fogMidColor: [0.03, 0.03, 0.08],
    fogFarColor: [0.01, 0.01, 0.04],
    colorGradeContrast: 0.02,      // flat — everything is shadow
    colorGradeVibrance: 0.02,      // near-monochrome blue-black
    colorGradeWarmth: -0.05,       // COLD — negative warmth
    vignetteDarkness: 0.92,        // MAXIMUM tunnel vision — stolen from Storm TEMPEST
    grainOpacity: 0.08,            // noisy — the void distorts perception
    dustMoteBrightness: 0.1,       // dust nearly invisible in darkness
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.35,            // HEAVY vertigo distortion — the void warps the lens
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,         // absolute stillness
    dofFocusDistance: 20,          // focus on distant void — nothing nearby matters
    dofBokehScale: 6.0,           // heavy blur — the nearby steps dissolve
    splitToneWarm: [0.60, 0.58, 0.65],   // cool grey — no warmth at all
    splitToneCool: [0.40, 0.45, 0.70],   // deep blue — the void's color
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // ILLUMINATION — the revelation landing.
    // White light pours from above. Almost blinding after the void.
    // The stone is radiant — every crack, every moss patch is vivid.
    // This is the music's climax. Bloom at maximum.
    // Ghost-lights are everywhere — you can see all the other climbers.
    // You understand: the staircase IS the destination.
    // The journey was never about arriving.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.10,          // stars washed out by the light
    sunElevation: -5,              // light seems to come from everywhere
    sunAzimuth: 240,
    turbidity: 1.5,
    rayleigh: 0.8,
    mieCoefficient: 0.015,         // radiant haze
    mieDirectionalG: 0.92,
    fogColor: [0.18, 0.18, 0.22],  // luminous grey — the light fills fog
    fogDensity: 0.004,             // thin — revelation is clarity
    sunLightColor: [0.90, 0.88, 0.85],  // near-white — pure radiance
    sunLightIntensity: 1.40,       // BRIGHT — the revelation
    ambientIntensity: 0.25,        // everything is lit — no shadows
    grassBaseColor: [0.06, 0.10, 0.05],  // moss is vivid in the light
    grassTipColor: [0.15, 0.22, 0.10],   // emerald tips catch radiance
    grassWindSpeed: 0.20,          // gentle stirring — the light has warmth
    grassAmbientStrength: 0.40,    // high — light everywhere
    grassTranslucency: 1.2,        // translucent moss glows in radiance
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 1.2,        // ghost-lights BLAZING — all the climbers visible
    fireflySize: 80,               // large — close and vivid
    bloomIntensity: 0.80,          // MAXIMUM bloom — radiance overflows
    bloomThreshold: 0.45,          // everything blooms — stolen from Golden Meadow ALIVE
    fogDepthStrength: 0.03,
    fogMidColor: [0.22, 0.22, 0.26],
    fogFarColor: [0.14, 0.14, 0.18],
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.35,      // VIVID — the world in full color for the first time
    colorGradeWarmth: 0.10,        // warm but not amber — pure radiance
    vignetteDarkness: 0.25,        // WIDE OPEN — no tunnel, the world is vast
    grainOpacity: 0.04,            // clean — revelation is sharp
    dustMoteBrightness: 1.0,       // dust catches the light — every particle visible
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.01,            // clean lens — clarity after vertigo
    waveWindDirX: 0.3,
    waveWindDirY: 0.7,
    waveWindSpeed: 0.15,
    waveWindStrength: 0.05,        // gentle breeze — the light has a current
    dofFocusDistance: 4,           // intimate — see the stone grain up close
    dofBokehScale: 5.0,           // ghost-lights become radiant orbs
    splitToneWarm: [0.92, 0.88, 0.82],   // warm whites
    splitToneCool: [0.82, 0.85, 0.92],   // cool whites — everything is light
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // RETURN — back to grey. But you're different now.
    // Same cool stone. Same fog. Same ghost-lights in the distance.
    // But the vignette is softer. The grain is heavier (memory of the climb).
    // You carry a residual warmth from the landings you passed through.
    // The loop is complete. Or is it beginning again?
    // The music returns to its opening phrase — but you hear it differently now.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.30,          // same as threshold — the loop
    sunElevation: -15,             // same as threshold
    sunAzimuth: 180,
    turbidity: 2.0,
    rayleigh: 0.4,
    mieCoefficient: 0.003,
    mieDirectionalG: 0.85,
    fogColor: [0.07, 0.07, 0.09],  // almost the same — but subtly warmer
    fogDensity: 0.010,             // slightly thinner than threshold — you've been here
    sunLightColor: [0.42, 0.42, 0.46],  // subtly warmer than threshold
    sunLightIntensity: 0.38,       // slightly brighter — you carry light now
    ambientIntensity: 0.07,
    grassBaseColor: [0.03, 0.05, 0.03],  // slightly more alive than threshold
    grassTipColor: [0.06, 0.10, 0.06],
    grassWindSpeed: 0.08,
    grassAmbientStrength: 0.14,
    grassTranslucency: 0.25,
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.35,       // ghost-lights persist — same as threshold
    fireflySize: 38,
    bloomIntensity: 0.18,
    bloomThreshold: 0.82,
    fogDepthStrength: 0.06,
    fogMidColor: [0.09, 0.09, 0.11],
    fogFarColor: [0.05, 0.05, 0.07],
    colorGradeContrast: 0.04,
    colorGradeVibrance: 0.08,      // slightly more color than threshold — you remember color
    colorGradeWarmth: 0.03,        // residual warmth — you carry it from WARMTH landing
    vignetteDarkness: 0.70,        // SOFTER than threshold (was 0.80) — the tunnel opened
    grainOpacity: 0.09,            // HEAVIER than threshold — memory of climb degrading
    dustMoteBrightness: 0.25,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.04,            // slightly more than threshold — vision forever changed
    waveWindDirX: 0.0,
    waveWindDirY: 1.0,
    waveWindSpeed: 0.05,
    waveWindStrength: 0.01,
    dofFocusDistance: 10,          // mid-range — the same, but seeing further
    dofBokehScale: 3.8,
    splitToneWarm: [0.82, 0.80, 0.76],   // slightly warmer than threshold — you carry warmth
    splitToneCool: [0.68, 0.70, 0.78],   // slightly warmer cool tones too
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
