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
    //         PALETTE: deep purple-mauve fog, lavender light, grey-purple grass
    rainBrightness: 0.0,
    petalBrightness: 0.1,    // barely visible — first petals, like dust
    starBrightness: 0.3,     // stars visible through twilight haze — the permanent things
    sunElevation: 1,         // barely at horizon — perpetual twilight edge (NOT golden hour)
    sunAzimuth: 280,         // west-northwest — different axis than golden meadow (250)
    turbidity: 9.0,          // very hazy — memories arrive through gauze
    rayleigh: 3.0,           // strong scattering = deep purple atmosphere
    mieCoefficient: 0.022,   // heavy glow — light through thick fog
    mieDirectionalG: 0.96,
    fogColor: [0.12, 0.06, 0.16],   // deep mauve-purple — NOT the steel-blue of golden meadow
    fogDensity: 0.022,       // VERY thick — denser than any other world. You EARN visibility.
    sunLightColor: [0.50, 0.38, 0.55],   // lavender-violet light — opposite of golden amber
    sunLightIntensity: 0.25,
    ambientIntensity: 0.04,  // barely lit — the garden is potential, not presence
    grassBaseColor: [0.05, 0.02, 0.05],  // purple-brown earth — NOT green
    grassTipColor: [0.12, 0.07, 0.13],   // grey-lavender tips — NOT green
    grassWindSpeed: 0.06,    // nearly frozen — a held breath, waiting to remember
    grassAmbientStrength: 0.10,
    grassTranslucency: 0.2,  // low — grass is more shadow than substance
    grassFogFade: 0.007,
    cloudShadowOpacity: 0.02,
    cloudDriftSpeed: 0.00001,  // glacial — time itself is uncertain
    fireflyBrightness: 0.15, // first memory motes — barely perceptible specks
    fireflySize: 30,         // small — distant memories
    bloomIntensity: 0.35,    // subtle glow through fog
    bloomThreshold: 0.70,
    fogDepthStrength: 0.14,  // HEAVY depth fog — you can't see far into memory
    fogMidColor: [0.14, 0.08, 0.20],   // mid-distance mauve
    fogFarColor: [0.08, 0.04, 0.14],   // far distance deep purple
    colorGradeContrast: 0.02,  // flat — like a faded photograph
    colorGradeVibrance: 0.05,  // nearly monochrome — color hasn't arrived yet
    colorGradeWarmth: 0.0,     // zero warmth — cold start
    vignetteDarkness: 0.92,    // HEAVY tunnel vision — peering through fog
    grainOpacity: 0.12,        // heavy grain — old film, imperfect recall
    dustMoteBrightness: 0.1,   // first dust motes — fragments of memory
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.18,    // slight painterly — memories are never sharp
    caDistortion: 0.0,         // clean — the lens hasn't started to weep
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,       // diagonal — asymmetric, organic
    waveWindSpeed: 0.08,
    waveWindStrength: 0.0,     // frozen
    dofFocusDistance: 2,       // VERY close focus — only the nearest fragment is sharp
    dofBokehScale: 8.0,       // MAXIMUM bokeh — everything beyond 2m is dissolved
    splitToneWarm: [0.72, 0.55, 0.65],   // muted rose — not warm, not cold
    splitToneCool: [0.58, 0.50, 0.78],   // deep lavender — the color of twilight
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
    //          Flowers begin to appear. Colors warm toward pink-gold.
    //          Like the moment a photograph develops in solution — image resolving.
    //          "Oh — I remember this place."
    //          PALETTE: thinning purple fog, warm pink-amber light, rose-brown grass
    rainBrightness: 0.0,
    petalBrightness: 0.45,   // petals becoming visible — gentle fall
    starBrightness: 0.45,    // stars still visible, twilight deepening
    sunElevation: 4,         // slightly higher — the light of remembering
    sunAzimuth: 268,
    turbidity: 6.5,          // clearing — memory resolving
    rayleigh: 2.2,
    mieCoefficient: 0.016,
    mieDirectionalG: 0.94,
    fogColor: [0.18, 0.10, 0.18],   // warmer mauve — fog thinning but still purple
    fogDensity: 0.012,       // thinner — the garden becomes visible
    sunLightColor: [0.68, 0.52, 0.55],   // warm rose-amber arriving through lavender
    sunLightIntensity: 0.55,
    ambientIntensity: 0.08,
    grassBaseColor: [0.07, 0.04, 0.05],  // warm brown-purple — NOT green
    grassTipColor: [0.18, 0.12, 0.14],   // rose-grey tips — faded garden tones
    grassWindSpeed: 0.20,    // gentle stir — the garden breathes
    grassAmbientStrength: 0.20,
    grassTranslucency: 0.7,
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.05,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.55, // memory motes awakening — clustering
    fireflySize: 50,
    bloomIntensity: 0.55,    // glow intensifying
    bloomThreshold: 0.58,
    fogDepthStrength: 0.09,
    fogMidColor: [0.22, 0.14, 0.24],
    fogFarColor: [0.12, 0.07, 0.16],
    colorGradeContrast: 0.04,
    colorGradeVibrance: 0.18,  // color returning — still muted
    colorGradeWarmth: 0.02,    // first hint of warmth
    vignetteDarkness: 0.72,    // opening — you can see more
    grainOpacity: 0.09,
    dustMoteBrightness: 0.35,  // memory fragments materializing
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.22,    // growing painterly — impressionist clarity
    caDistortion: 0.005,       // slight optical tremor — eyes adjusting to memory
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,
    waveWindSpeed: 0.15,
    waveWindStrength: 0.04,    // gentle wave wind — the garden stirs
    dofFocusDistance: 4,       // focus reaching out — seeing more
    dofBokehScale: 6.0,       // still heavy — selective memory
    splitToneWarm: [0.80, 0.62, 0.58],   // warming rose-amber
    splitToneCool: [0.62, 0.55, 0.80],   // lavender softening
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
    //         Memory motes are dense, golden-pink-tinged. This is the moment where
    //         grief gives way to beauty. BUT — at the edges, things are
    //         ALREADY dissolving. The DOF is tight — you can only focus on
    //         one thing, and everything else is already fading.
    //         "This is the most beautiful thing I've ever seen, and it's leaving."
    //         PALETTE: warm pink-gold fog, amber-rose light, faded gold grass
    rainBrightness: 0.0,
    petalBrightness: 0.75,   // petals everywhere — beauty at its peak
    starBrightness: 0.55,    // stars vivid through the clearing
    sunElevation: 7,         // highest point — maximum light (lower than meadow's 8)
    sunAzimuth: 255,
    turbidity: 4.5,          // cleanest — peak clarity
    rayleigh: 1.6,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.92,
    fogColor: [0.30, 0.18, 0.16],   // warm PINK-gold haze — NOT golden meadow's [0.80, 0.65, 0.38]
    fogDensity: 0.005,       // thinnest fog — maximum visibility
    sunLightColor: [0.88, 0.68, 0.60],   // warm amber-ROSE — pink undertone, not pure gold
    sunLightIntensity: 1.0,              // bright but not blazing (meadow is 1.5)
    ambientIntensity: 0.12,
    grassBaseColor: [0.12, 0.06, 0.05],  // warm brown-rose — NOT green like meadow
    grassTipColor: [0.30, 0.18, 0.14],   // faded GOLD-PINK tips — the "fading warm pink/gold"
    grassWindSpeed: 0.45,    // gentle wind — the garden is alive
    grassAmbientStrength: 0.30,
    grassTranslucency: 1.5,  // strong backlit glow — warmth earned
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.08,
    cloudDriftSpeed: 0.00004,
    fireflyBrightness: 1.0,  // memory motes at peak — golden-pink-tinged now
    fireflySize: 75,         // large, close — you're among the memories
    bloomIntensity: 0.80,    // strong bloom — everything glows
    bloomThreshold: 0.48,
    fogDepthStrength: 0.05,  // lighter depth fog — but edges still dissolve
    fogMidColor: [0.35, 0.22, 0.20],   // warm pink-amber mid
    fogFarColor: [0.18, 0.12, 0.14],   // purple-rose distance
    colorGradeContrast: 0.07,
    colorGradeVibrance: 0.40,   // most vivid — but still muted (never full saturation)
    colorGradeWarmth: 0.06,     // warm but not golden-meadow warm. Gentler rose warmth.
    vignetteDarkness: 0.45,     // open — the world reveals itself
    grainOpacity: 0.06,         // lighter grain — clearer recall
    dustMoteBrightness: 0.75,   // memory fragments dense
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.32,     // peak painterly — memories are impressionist paintings
    caDistortion: 0.015,        // mild — like looking through tears of recognition
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,
    waveWindSpeed: 0.25,
    waveWindStrength: 0.10,     // gentle rolling — the garden breathes fully
    dofFocusDistance: 6,        // further focus — you can hold more
    dofBokehScale: 4.5,        // still heavy — but you can see more clearly
    splitToneWarm: [0.92, 0.70, 0.55],   // warm amber-rose — earned
    splitToneCool: [0.68, 0.60, 0.82],   // lavender-rose
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
    //         Colors desaturate toward grey. The grief is that you can FEEL it going.
    //         "I'm watching it leave and I can't stop it."
    //         This is the emotional peak — not the beauty, but the LOSS of beauty.
    //         PALETTE: returning purple, draining warmth, grey-pink grass fading
    rainBrightness: 0.0,
    petalBrightness: 0.95,   // PEAK petals — the garden is shedding everything
    starBrightness: 0.35,    // stars dimming — even the permanent things fade
    sunElevation: 2,         // sun dropping — golden hour ending
    sunAzimuth: 240,
    turbidity: 8.0,          // haze returning — fog of forgetting
    rayleigh: 2.5,
    mieCoefficient: 0.018,
    mieDirectionalG: 0.95,
    fogColor: [0.14, 0.08, 0.16],   // purple returning — memory dimming
    fogDensity: 0.015,       // fog thickening — the garden retreats
    sunLightColor: [0.55, 0.42, 0.50],   // cooling lavender — warmth draining away
    sunLightIntensity: 0.4,
    ambientIntensity: 0.06,
    grassBaseColor: [0.06, 0.03, 0.05],  // desaturating purple-brown — color leaving
    grassTipColor: [0.16, 0.10, 0.13],   // grey-pink — dissolving to grey
    grassWindSpeed: 0.55,    // wind picking up — the garden stirs with urgency
    grassAmbientStrength: 0.15,
    grassTranslucency: 0.5,  // backlit glow fading
    grassFogFade: 0.006,
    cloudShadowOpacity: 0.04,
    cloudDriftSpeed: 0.00005,  // shadows moving faster — time accelerating
    fireflyBrightness: 0.45, // motes scattering — dimming, drifting apart
    fireflySize: 55,         // smaller — moving away from you
    bloomIntensity: 0.60,    // bloom on the remaining glow — poignant
    bloomThreshold: 0.52,
    fogDepthStrength: 0.11,  // heavy depth fog — the world contracts
    fogMidColor: [0.16, 0.10, 0.20],
    fogFarColor: [0.10, 0.06, 0.14],
    colorGradeContrast: 0.04,
    colorGradeVibrance: 0.12,   // desaturating — faded photograph returning
    colorGradeWarmth: 0.02,     // last trace of warmth — residual
    vignetteDarkness: 0.82,     // closing in — the edges darken
    grainOpacity: 0.10,         // grain returns — memory degrading
    dustMoteBrightness: 0.25,   // fragments dimming
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.40,     // PEAK painterly — the garden becomes a painting as it fades
    //                           — the impressionist brushstroke IS the act of forgetting
    caDistortion: 0.025,        // strongest — the lens weeps, looking through tears
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,
    waveWindSpeed: 0.15,
    waveWindStrength: 0.05,
    dofFocusDistance: 3,        // focus contracting — you're losing hold
    dofBokehScale: 7.0,        // extreme bokeh — the world dissolves around your gaze
    splitToneWarm: [0.75, 0.58, 0.62],   // cooling rose — warmth leaving
    splitToneCool: [0.58, 0.52, 0.78],   // lavender strengthening
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
    //        PALETTE: deep purple-black, last traces of rose, near-monochrome
    rainBrightness: 0.0,
    petalBrightness: 0.12,   // last few petals — the final letting go
    starBrightness: 0.20,    // stars fading into haze
    sunElevation: 0.5,       // barely above horizon — last light
    sunAzimuth: 225,
    turbidity: 11.0,         // very hazy — the fog of forgetting envelops
    rayleigh: 3.2,
    mieCoefficient: 0.024,   // maximum haze glow
    mieDirectionalG: 0.96,
    fogColor: [0.08, 0.04, 0.12],   // deep purple-black — absence
    fogDensity: 0.025,       // MAXIMUM fog — denser than start. You can barely see anything.
    sunLightColor: [0.38, 0.30, 0.42],   // cool violet — last trace of light
    sunLightIntensity: 0.15,
    ambientIntensity: 0.03,  // barely there — just enough to know the space exists
    grassBaseColor: [0.03, 0.02, 0.04],  // ghost grass — near invisible purple-grey
    grassTipColor: [0.07, 0.05, 0.08],   // grey with lavender tint
    grassWindSpeed: 0.04,    // stillness returns — but transformed
    grassAmbientStrength: 0.08,
    grassTranslucency: 0.15,
    grassFogFade: 0.009,
    cloudShadowOpacity: 0.01,
    cloudDriftSpeed: 0.000008,
    fireflyBrightness: 0.18, // last few motes — lingering
    fireflySize: 28,         // small, distant — the last memories
    bloomIntensity: 0.45,    // bloom on remaining motes — precious because scarce
    bloomThreshold: 0.62,
    fogDepthStrength: 0.16,  // MAXIMUM depth fog — visibility contracts to arm's reach
    fogMidColor: [0.10, 0.06, 0.16],
    fogFarColor: [0.05, 0.03, 0.10],
    colorGradeContrast: 0.01,  // flat — all contrast dissolved
    colorGradeVibrance: 0.02,  // nearly monochrome — color is gone
    colorGradeWarmth: 0.0,     // zero warmth — cold again, but different from the start
    vignetteDarkness: 0.95,    // MAXIMUM tunnel — the world contracts to a point
    grainOpacity: 0.14,        // heaviest grain — memory is almost static
    dustMoteBrightness: 0.08,  // last fragments
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.08,    // light painterly — the brushstrokes dissolve too
    caDistortion: 0.008,       // residual tremor — the tears dry
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,
    waveWindSpeed: 0.04,
    waveWindStrength: 0.0,     // stillness
    dofFocusDistance: 1.5,     // focus collapsed to just in front of you
    dofBokehScale: 9.0,       // MAXIMUM bokeh — everything is bokeh now
    splitToneWarm: [0.65, 0.52, 0.60],   // cold rose — warmth is a memory
    splitToneCool: [0.52, 0.48, 0.75],   // grey-lavender — twilight dominates
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
