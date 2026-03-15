// Memory Garden atmosphere keyframes — Beautiful Impermanence
// Scroll arc: Haze → Surfacing → Vivid → Fading → Absence
// "The garden holds both the bloom and the decay at once.
//  Everything is dissolving even as it appears."
//
// Mono no aware — the pathos of things.
// The beauty is BECAUSE it's impermanent, not despite it.
//
// Technique sources:
//   Dissolve pattern: Codrops 2025 dissolve tutorial (cnoise + uProgress threshold)
//   Particle lifecycle: smoothstep fade-in (0→0.1) + fade-out (0.9→1.0) — no popping
//   Depth-fade: linearize depth + smoothstep transition (soft particles pattern)
//   Emotional arc: exp-049 mapping-mode-change pattern (what dissolve MEANS changes per keyframe)
//
// The scroll arc for Memory Garden is NOT linear warmth (golden meadow) or
// linear darkness (night meadow). It's a BELL CURVE of presence:
//   haze → clarity → haze
// The garden appears, peaks, and dissolves. You can't hold it.

export const MEMORY_GARDEN_KEYFRAMES = [
  {
    t: 0.0, // HAZE — the garden is trying to appear. Fog heavy. You know something
    //         was here but you can't see it yet. First moment of remembering.
    //         Like waking from a dream — fragments, not a picture.
    rainBrightness: 0.0,
    petalBrightness: 0.1,    // barely visible — first petals, like dust
    starBrightness: 0.3,     // stars visible through twilight haze — the permanent things
    sunElevation: 2,         // just at horizon — perpetual golden-hour edge
    sunAzimuth: 260,         // setting — always setting, never set
    turbidity: 8.0,          // very hazy — memories arrive through gauze
    rayleigh: 2.5,           // strong scattering = purple-gold atmosphere
    mieCoefficient: 0.018,   // visible glow — light through fog
    mieDirectionalG: 0.94,
    fogColor: [0.10, 0.08, 0.14],   // purple-grey — the color of almost-remembering
    fogDensity: 0.018,       // thick — everything hidden. You have to EARN visibility.
    sunLightColor: [0.55, 0.45, 0.50],   // cool lavender light — not warm yet
    sunLightIntensity: 0.3,
    ambientIntensity: 0.05,  // barely lit — the garden is potential, not presence
    grassBaseColor: [0.02, 0.04, 0.04],  // near-black teal — grass is ghost
    grassTipColor: [0.06, 0.12, 0.10],
    grassWindSpeed: 0.08,    // nearly frozen — a held breath, waiting to remember
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.3,  // low — grass is more shadow than substance
    grassFogFade: 0.006,
    cloudShadowOpacity: 0.03,
    cloudDriftSpeed: 0.00002,  // glacial — time itself is uncertain
    fireflyBrightness: 0.15, // first memory motes — barely perceptible specks
    fireflySize: 30,         // small — distant memories
    bloomIntensity: 0.3,     // subtle glow
    bloomThreshold: 0.75,
    fogDepthStrength: 0.10,  // heavy depth fog — you can't see far into memory
    fogMidColor: [0.12, 0.10, 0.18],
    fogFarColor: [0.08, 0.06, 0.12],
    colorGradeContrast: 0.02,  // flat — like a faded photograph
    colorGradeVibrance: 0.05,  // nearly monochrome — color hasn't arrived yet
    colorGradeWarmth: 0.0,     // zero warmth — cold start
    vignetteDarkness: 0.90,    // heavy tunnel vision — peering through fog
    grainOpacity: 0.10,        // heavy grain — old film, imperfect recall
    dustMoteBrightness: 0.1,   // first dust motes — fragments of memory
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.15,    // slight painterly — memories are never sharp
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,       // diagonal — asymmetric, organic
    waveWindSpeed: 0.1,
    waveWindStrength: 0.0,     // frozen
    dofFocusDistance: 3,       // very close focus — only the nearest fragment is sharp
    dofBokehScale: 7.0,       // maximum bokeh — everything beyond 3m is dissolved
    splitToneWarm: [0.75, 0.60, 0.65],   // muted rose — not warm, not cold
    splitToneCool: [0.65, 0.60, 0.80],   // lavender — the color of twilight
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // SURFACING — memories sharpen. The garden emerges from fog.
    //          Flowers begin to appear. Colors warm. Memory motes cluster and glow.
    //          Like the moment a photograph develops in solution — image resolving.
    //          "Oh — I remember this place."
    rainBrightness: 0.0,
    petalBrightness: 0.4,    // petals becoming visible — gentle fall
    starBrightness: 0.45,    // stars still visible, twilight deepening
    sunElevation: 5,         // slightly higher — the light of remembering
    sunAzimuth: 250,
    turbidity: 6.0,          // clearing — memory resolving
    rayleigh: 2.0,
    mieCoefficient: 0.014,
    mieDirectionalG: 0.93,
    fogColor: [0.14, 0.12, 0.16],   // warmer purple — fog thinning
    fogDensity: 0.010,       // thinner — the garden becomes visible
    sunLightColor: [0.70, 0.58, 0.55],   // warming — amber arriving through lavender
    sunLightIntensity: 0.6,
    ambientIntensity: 0.10,
    grassBaseColor: [0.03, 0.08, 0.05],
    grassTipColor: [0.12, 0.25, 0.14],   // green returning — life surfacing
    grassWindSpeed: 0.25,    // gentle stir — the garden breathes
    grassAmbientStrength: 0.22,
    grassTranslucency: 0.8,
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.06,
    cloudDriftSpeed: 0.00004,
    fireflyBrightness: 0.6,  // memory motes awakening — clustering
    fireflySize: 55,
    bloomIntensity: 0.5,     // glow intensifying
    bloomThreshold: 0.60,
    fogDepthStrength: 0.07,
    fogMidColor: [0.18, 0.15, 0.22],
    fogFarColor: [0.10, 0.08, 0.15],
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.20,  // color returning — still muted
    colorGradeWarmth: 0.02,    // first hint of warmth
    vignetteDarkness: 0.70,    // opening — you can see more
    grainOpacity: 0.08,
    dustMoteBrightness: 0.4,   // memory fragments materializing
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.20,    // growing painterly — impressionist clarity
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,
    waveWindSpeed: 0.2,
    waveWindStrength: 0.05,    // gentle wave wind — the garden stirs
    dofFocusDistance: 5,       // focus reaching out — seeing more
    dofBokehScale: 5.5,       // still heavy — selective memory
    splitToneWarm: [0.82, 0.65, 0.58],   // warming amber
    splitToneCool: [0.68, 0.62, 0.82],   // lavender softening
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // VIVID — peak clarity. The garden is ALIVE. Every flower is in bloom.
    //         Memory motes are dense, golden-tinged. This is the moment where
    //         grief gives way to beauty. BUT — at the edges, things are
    //         ALREADY dissolving. The DOF is tight — you can only focus on
    //         one thing, and everything else is already fading.
    //         "This is the most beautiful thing I've ever seen, and it's leaving."
    rainBrightness: 0.0,
    petalBrightness: 0.7,    // petals everywhere — beauty at its peak
    starBrightness: 0.55,    // stars vivid through the clearing
    sunElevation: 8,         // highest point — maximum light
    sunAzimuth: 240,
    turbidity: 4.0,          // cleanest — peak clarity
    rayleigh: 1.8,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.92,
    fogColor: [0.22, 0.18, 0.15],   // warm — golden haze at peak
    fogDensity: 0.004,       // thinnest fog — maximum visibility
    sunLightColor: [0.85, 0.72, 0.58],   // warm golden-amber — peak warmth
    sunLightIntensity: 1.2,              // brightest — but not blazing
    ambientIntensity: 0.14,
    grassBaseColor: [0.05, 0.14, 0.06],  // vivid green — life at peak
    grassTipColor: [0.18, 0.38, 0.16],   // golden-green tips
    grassWindSpeed: 0.5,     // gentle wind — the garden is alive
    grassAmbientStrength: 0.32,
    grassTranslucency: 1.8,  // strong backlit glow — warmth earned
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.10,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 1.0,  // memory motes at peak — golden-tinged now
    fireflySize: 80,         // large, close — you're among the memories
    bloomIntensity: 0.75,    // strong bloom — everything glows
    bloomThreshold: 0.50,
    fogDepthStrength: 0.04,  // lighter depth fog — but edges still dissolve
    fogMidColor: [0.30, 0.25, 0.18],
    fogFarColor: [0.15, 0.12, 0.12],
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.45,   // most vivid — but still under 0.5 (never full saturation)
    colorGradeWarmth: 0.05,     // warm but not golden-meadow warm. Gentler.
    vignetteDarkness: 0.45,     // open — the world reveals itself
    grainOpacity: 0.06,         // lighter grain — clearer recall
    dustMoteBrightness: 0.8,    // memory fragments dense
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.30,     // peak painterly — memories are impressionist paintings
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,
    waveWindSpeed: 0.3,
    waveWindStrength: 0.12,     // gentle rolling — the garden breathes fully
    dofFocusDistance: 7,        // further focus — you can hold more
    dofBokehScale: 4.5,        // still heavy — but you can see more clearly
    splitToneWarm: [0.90, 0.72, 0.52],   // warm amber — earned
    splitToneCool: [0.72, 0.68, 0.85],   // lavender-gold
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // FADING — the garden dissolves. Flowers accelerate their decay.
    //         Petals fall faster. Memory motes scatter rather than cluster.
    //         Depth-fade gets aggressive — the visible radius shrinks.
    //         Colors desaturate. The grief is that you can FEEL it going.
    //         "I'm watching it leave and I can't stop it."
    //         This is the emotional peak — not the beauty, but the LOSS of beauty.
    rainBrightness: 0.0,
    petalBrightness: 0.9,    // PEAK petals — the garden is shedding everything
    starBrightness: 0.40,    // stars dimming — even the permanent things fade
    sunElevation: 3,         // sun dropping — golden hour ending
    sunAzimuth: 225,
    turbidity: 7.0,          // haze returning — fog of forgetting
    rayleigh: 2.2,
    mieCoefficient: 0.016,
    mieDirectionalG: 0.94,
    fogColor: [0.12, 0.10, 0.14],   // purple returning — memory dimming
    fogDensity: 0.012,       // fog thickening — the garden retreats
    sunLightColor: [0.60, 0.50, 0.50],   // cooling — warmth draining away
    sunLightIntensity: 0.5,
    ambientIntensity: 0.08,
    grassBaseColor: [0.02, 0.06, 0.04],  // desaturating — color leaving
    grassTipColor: [0.10, 0.20, 0.12],
    grassWindSpeed: 0.6,     // wind picking up — the garden stirs with urgency
    grassAmbientStrength: 0.18,
    grassTranslucency: 0.6,  // backlit glow fading
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.05,
    cloudDriftSpeed: 0.00006,  // shadows moving faster — time accelerating
    fireflyBrightness: 0.5,  // motes scattering — dimming, drifting apart
    fireflySize: 60,         // smaller — moving away from you
    bloomIntensity: 0.55,    // bloom on the remaining glow — poignant
    bloomThreshold: 0.55,
    fogDepthStrength: 0.09,  // heavy depth fog — the world contracts
    fogMidColor: [0.14, 0.12, 0.18],
    fogFarColor: [0.08, 0.07, 0.12],
    colorGradeContrast: 0.04,
    colorGradeVibrance: 0.15,   // desaturating — faded photograph returning
    colorGradeWarmth: 0.02,     // last trace of warmth — residual
    vignetteDarkness: 0.80,     // closing in — the edges darken
    grainOpacity: 0.09,         // grain returns — memory degrading
    dustMoteBrightness: 0.3,    // fragments dimming
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.35,     // PEAK painterly — the garden becomes a painting as it fades
    //                           — the impressionist brushstroke IS the act of forgetting
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,
    waveWindSpeed: 0.2,
    waveWindStrength: 0.06,
    dofFocusDistance: 4,        // focus contracting — you're losing hold
    dofBokehScale: 6.5,        // extreme bokeh — the world dissolves around your gaze
    splitToneWarm: [0.78, 0.62, 0.60],   // cooling — warmth leaving
    splitToneCool: [0.65, 0.60, 0.80],   // lavender strengthening
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // ABSENCE — almost everything has dissolved. The terrain is bare.
    //        Only a few glowing remnants — last memory motes, one or two flowers
    //        in their final bloom. Beautiful emptiness. But not death — potential.
    //        The garden will return. It always returns.
    //        "The space where the garden was is also beautiful."
    rainBrightness: 0.0,
    petalBrightness: 0.15,   // last few petals — the final letting go
    starBrightness: 0.25,    // stars fading into haze
    sunElevation: 1,         // barely above horizon — last light
    sunAzimuth: 215,
    turbidity: 10.0,         // very hazy — the fog of forgetting envelops
    rayleigh: 2.8,
    mieCoefficient: 0.020,   // maximum haze glow
    mieDirectionalG: 0.95,
    fogColor: [0.08, 0.06, 0.10],   // deep purple-black — absence
    fogDensity: 0.020,       // maximum fog — you can barely see anything
    sunLightColor: [0.40, 0.35, 0.42],   // cool, faded — last trace of light
    sunLightIntensity: 0.2,
    ambientIntensity: 0.04,  // barely there — just enough to know the space exists
    grassBaseColor: [0.01, 0.03, 0.03],  // ghost grass — near invisible
    grassTipColor: [0.04, 0.08, 0.06],
    grassWindSpeed: 0.05,    // stillness returns — but transformed
    grassAmbientStrength: 0.10,
    grassTranslucency: 0.2,
    grassFogFade: 0.008,
    cloudShadowOpacity: 0.01,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.2,  // last few motes — lingering
    fireflySize: 35,         // small, distant — the last memories
    bloomIntensity: 0.4,     // bloom on remaining motes — precious because scarce
    bloomThreshold: 0.65,
    fogDepthStrength: 0.12,  // maximum depth fog — visibility contracts to arm's reach
    fogMidColor: [0.10, 0.08, 0.14],
    fogFarColor: [0.06, 0.04, 0.08],
    colorGradeContrast: 0.02,  // flat — all contrast dissolved
    colorGradeVibrance: 0.03,  // nearly monochrome — color is gone
    colorGradeWarmth: 0.0,     // zero warmth — cold again, but different from the start
    vignetteDarkness: 0.92,    // maximum tunnel — the world contracts to a point
    grainOpacity: 0.12,        // heaviest grain — memory is almost static
    dustMoteBrightness: 0.1,   // last fragments
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.10,    // light painterly — the brushstrokes dissolve too
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,
    waveWindSpeed: 0.05,
    waveWindStrength: 0.0,     // stillness
    dofFocusDistance: 2,       // focus collapsed to just in front of you
    dofBokehScale: 8.0,       // maximum bokeh — everything is bokeh now
    splitToneWarm: [0.70, 0.58, 0.62],   // cold rose — warmth is a memory
    splitToneCool: [0.60, 0.58, 0.78],   // lavender-grey — twilight dominates
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
