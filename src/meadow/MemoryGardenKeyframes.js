// Memory Garden atmosphere keyframes — Beautiful Impermanence
// Scroll arc: WARM GOLD → brief clarity → DISSOLVING → GREY → ABSENCE
// "The garden holds both the bloom and the decay at once.
//  Everything is dissolving even as it appears."
//
// KEY DIFFERENTIATOR from Golden Meadow:
//   Golden Meadow: cold → warm (warmth is the REWARD)
//   Memory Garden: warm → grey (warmth is what you're LOSING)
//
// The fog is the grief. fogDensity=0.025 on load — 8x denser than golden meadow.
// bloomThreshold=0.3 — everything glows softly, indistinctly, like a fading photograph.
// Warm gold grass [0.15,0.12,0.04] desaturates to neutral grey by t=1.0.
//
// Mono no aware — the pathos of things.
// The beauty is BECAUSE it's impermanent, not despite it.

export const MEMORY_GARDEN_KEYFRAMES = [
  {
    t: 0.0, // WARM GOLD IN FOG — the garden exists, beautiful, but already being eaten.
    //        Heavy fog swallows everything beyond arm's reach. What you CAN see
    //        is warm, golden, glowing — but you know it's leaving.
    //        This is what the world looks like on load. IMMEDIATELY recognizable:
    //        warm gold drowned in dense fog, soft glow on everything.
    //        NOT cold. NOT purple. WARM. But suffocating.
    rainBrightness: 0.0,
    petalBrightness: 0.15,   // faint petals drifting through fog — you see them before you see the garden
    starBrightness: 0.2,     // dim stars through warm haze
    sunElevation: 4,         // low golden hour — warm light, long shadows
    sunAzimuth: 280,         // west-northwest — different axis than golden meadow (250)
    turbidity: 8.0,          // hazy — warm haze, not crisp
    rayleigh: 1.8,           // moderate scattering — warm atmosphere
    mieCoefficient: 0.020,   // heavy glow around sun — diffused through fog
    mieDirectionalG: 0.95,
    fogColor: [0.18, 0.14, 0.06],    // WARM AMBER-GREY fog — golden fog, not purple
    fogDensity: 0.025,                // HEAVY — 8x golden meadow. Fog eating everything.
    sunLightColor: [0.85, 0.65, 0.35],  // warm amber light — the garden remembers gold
    sunLightIntensity: 0.45,            // dim — light filtered through dense fog
    ambientIntensity: 0.08,
    grassBaseColor: [0.15, 0.12, 0.04],  // WARM GOLD — NOT green, NOT purple. Golden brown.
    grassTipColor: [0.25, 0.20, 0.08],   // golden tips catching last light
    grassWindSpeed: 0.3,     // slow, gentle — a garden sighing, not a field in wind
    grassAmbientStrength: 0.20,
    grassTranslucency: 0.8,  // backlit gold glow through blades
    grassFogFade: 0.008,
    cloudShadowOpacity: 0.03,
    cloudDriftSpeed: 0.00002,
    fireflyBrightness: 0.25, // warm motes in the fog — like floating embers of memory
    fireflySize: 40,
    bloomIntensity: 0.8,     // STRONG soft glow — everything haloed
    bloomThreshold: 0.3,     // LOW — everything glows. The whole world is luminous and indistinct.
    fogDepthStrength: 0.14,  // heavy depth fog
    fogMidColor: [0.16, 0.12, 0.05],   // warm amber mid-fog
    fogFarColor: [0.10, 0.08, 0.04],   // dark warm distance
    colorGradeContrast: 0.03,   // low contrast — faded photograph
    colorGradeVibrance: 0.15,   // muted warm — not vivid, not grey yet
    colorGradeWarmth: 0.06,     // warm — the garden still holds its color
    vignetteDarkness: 0.7,      // moderate tunnel — you see through a frame of fog
    grainOpacity: 0.10,         // heavy grain — old film stock
    dustMoteBrightness: 0.2,    // golden dust motes in fog
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.15,     // slight painterly — memories are impressionist
    caDistortion: 0.0,
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,
    waveWindSpeed: 0.12,
    waveWindStrength: 0.02,     // gentle wave — barely there
    dofFocusDistance: 3,        // close focus — only what's near is clear
    dofBokehScale: 7.0,        // heavy bokeh — everything beyond focus dissolves
    splitToneWarm: [0.90, 0.72, 0.40],   // warm amber shadows
    splitToneCool: [0.75, 0.68, 0.55],   // muted warm highlights — no cool tones yet
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // BRIEF CLARITY — fog thins just enough. The garden is BEAUTIFUL.
    //         Peak warmth, peak color. Flowers visible. This is the memory
    //         as you wish it was — vivid, warm, alive. But already at t=0.25
    //         you know it won't last. The fog is pulling back but it WILL return.
    //         "I remember this. I remember how warm it was."
    rainBrightness: 0.0,
    petalBrightness: 0.5,    // petals visible — beauty arrives
    starBrightness: 0.35,    // stars through clearing haze
    sunElevation: 7,         // highest — peak light
    sunAzimuth: 268,
    turbidity: 5.0,          // clearer — the garden resolves
    rayleigh: 1.4,
    mieCoefficient: 0.014,
    mieDirectionalG: 0.93,
    fogColor: [0.25, 0.20, 0.08],    // warm golden haze — thinning
    fogDensity: 0.010,                // fog pulling back — brief window of clarity
    sunLightColor: [0.92, 0.75, 0.45],  // rich amber — peak warmth
    sunLightIntensity: 0.85,
    ambientIntensity: 0.12,
    grassBaseColor: [0.18, 0.14, 0.05],  // warm gold — brightest here
    grassTipColor: [0.30, 0.24, 0.10],   // golden tips catching light
    grassWindSpeed: 0.35,    // gentle garden wind
    grassAmbientStrength: 0.30,
    grassTranslucency: 1.5,  // strong backlit gold — translucent beauty
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.06,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.7,  // memory motes bright — golden-warm
    fireflySize: 65,
    bloomIntensity: 0.7,     // bloom but not as overwhelmed
    bloomThreshold: 0.35,    // still low — soft world
    fogDepthStrength: 0.07,
    fogMidColor: [0.28, 0.22, 0.10],
    fogFarColor: [0.14, 0.11, 0.06],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.35,   // peak color — brief vivid moment
    colorGradeWarmth: 0.08,     // warmest point
    vignetteDarkness: 0.50,     // opening — you can see the garden
    grainOpacity: 0.07,         // lighter grain — clearer recall
    dustMoteBrightness: 0.55,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.25,     // painterly — warm impressionism
    caDistortion: 0.008,        // slight — eyes adjusting
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,
    waveWindSpeed: 0.20,
    waveWindStrength: 0.06,
    dofFocusDistance: 5,        // reaching out — you can hold more
    dofBokehScale: 5.0,
    splitToneWarm: [0.95, 0.78, 0.48],   // peak amber warmth
    splitToneCool: [0.80, 0.72, 0.58],   // warm even in highlights
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // DISSOLVING — the gold starts draining to grey. This is the hinge.
    //         Colors desaturate. Fog returns. The warm gold fades toward neutral.
    //         Flowers still present but colors muting. Petals falling faster.
    //         "I can feel it leaving. The warmth is going."
    rainBrightness: 0.0,
    petalBrightness: 0.8,    // petals falling faster — shedding
    starBrightness: 0.3,
    sunElevation: 3,         // sun sinking — light draining
    sunAzimuth: 255,
    turbidity: 7.5,          // haze returning
    rayleigh: 2.2,
    mieCoefficient: 0.018,
    mieDirectionalG: 0.94,
    fogColor: [0.16, 0.14, 0.10],    // gold draining — shifting toward neutral grey
    fogDensity: 0.018,                // fog thickening again
    sunLightColor: [0.65, 0.55, 0.40],  // warmth draining — amber fading to pale
    sunLightIntensity: 0.50,
    ambientIntensity: 0.08,
    grassBaseColor: [0.12, 0.10, 0.07],  // gold fading — brown-grey transition
    grassTipColor: [0.20, 0.17, 0.12],   // tips losing gold — shifting neutral
    grassWindSpeed: 0.25,    // wind slowing — the garden tires
    grassAmbientStrength: 0.22,
    grassTranslucency: 0.9,
    grassFogFade: 0.006,
    cloudShadowOpacity: 0.04,
    cloudDriftSpeed: 0.00004,
    fireflyBrightness: 0.5,  // motes dimming — still warm but fading
    fireflySize: 55,
    bloomIntensity: 0.6,     // bloom on diminishing glow
    bloomThreshold: 0.38,
    fogDepthStrength: 0.10,
    fogMidColor: [0.14, 0.12, 0.09],   // grey creeping in
    fogFarColor: [0.09, 0.08, 0.06],
    colorGradeContrast: 0.04,
    colorGradeVibrance: 0.15,   // desaturating — color leaving
    colorGradeWarmth: 0.03,     // warmth half gone
    vignetteDarkness: 0.68,     // closing in
    grainOpacity: 0.09,
    dustMoteBrightness: 0.35,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.30,     // growing painterly — the dissolve into painting
    caDistortion: 0.015,        // optical stress — watching it leave
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,
    waveWindSpeed: 0.15,
    waveWindStrength: 0.04,
    dofFocusDistance: 4,
    dofBokehScale: 6.0,        // focus narrowing
    splitToneWarm: [0.78, 0.65, 0.50],   // warmth draining
    splitToneCool: [0.68, 0.64, 0.60],   // cooling — grey arriving
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // GREY WASH — almost all color gone. The garden is a grey ghost of itself.
    //         Grass is grey-brown. Fog is grey. Light is grey. Only the faintest
    //         residual warmth in the shadows. The emotional peak: not the beauty
    //         but the LOSS of beauty. Grief as landscape.
    //         "Everything that was golden is grey now."
    rainBrightness: 0.0,
    petalBrightness: 0.4,    // fewer petals — less to shed
    starBrightness: 0.15,    // stars dimming through grey haze
    sunElevation: 1.5,       // sun nearly gone
    sunAzimuth: 240,
    turbidity: 10.0,         // very hazy — grey overcast
    rayleigh: 2.8,
    mieCoefficient: 0.022,
    mieDirectionalG: 0.96,
    fogColor: [0.10, 0.09, 0.08],    // NEUTRAL GREY fog — all warmth gone
    fogDensity: 0.022,                // heavy fog returning
    sunLightColor: [0.45, 0.42, 0.38],  // grey-pale light — no color
    sunLightIntensity: 0.25,
    ambientIntensity: 0.05,
    grassBaseColor: [0.07, 0.06, 0.05],  // GREY-BROWN — gold completely drained
    grassTipColor: [0.12, 0.11, 0.09],   // grey tips — no gold left
    grassWindSpeed: 0.15,    // wind dying — the garden goes still
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.3,  // no more backlit glow
    grassFogFade: 0.007,
    cloudShadowOpacity: 0.02,
    cloudDriftSpeed: 0.00002,
    fireflyBrightness: 0.2,  // last motes — barely there
    fireflySize: 35,         // small, distant
    bloomIntensity: 0.45,    // bloom on what remains — precious because scarce
    bloomThreshold: 0.45,    // threshold rising — less glows
    fogDepthStrength: 0.13,
    fogMidColor: [0.09, 0.08, 0.07],   // grey
    fogFarColor: [0.06, 0.05, 0.05],   // dark grey
    colorGradeContrast: 0.02,
    colorGradeVibrance: 0.05,   // nearly monochrome
    colorGradeWarmth: 0.01,     // last trace
    vignetteDarkness: 0.82,     // closing in hard
    grainOpacity: 0.12,         // heavy grain — degraded memory
    dustMoteBrightness: 0.15,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.35,     // peak painterly — impressionist dissolution
    caDistortion: 0.022,        // strong — lens weeping
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,
    waveWindSpeed: 0.10,
    waveWindStrength: 0.02,
    dofFocusDistance: 2.5,      // focus collapsing
    dofBokehScale: 7.5,        // heavy blur — the world dissolves
    splitToneWarm: [0.62, 0.58, 0.52],   // grey-warm — residual
    splitToneCool: [0.58, 0.56, 0.55],   // grey — no color separation
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // ABSENCE — everything grey. The garden is gone. Only fog and silence.
    //        A few last motes. The grass is grey stubs. No warmth, no color.
    //        But not death — potential. The garden will return. It always returns.
    //        "The space where the garden was is also beautiful."
    rainBrightness: 0.0,
    petalBrightness: 0.05,   // last petal — the final letting go
    starBrightness: 0.08,    // stars almost invisible
    sunElevation: 0.5,       // barely above horizon — last light
    sunAzimuth: 225,
    turbidity: 12.0,         // maximum haze — grey overcast
    rayleigh: 3.0,
    mieCoefficient: 0.025,   // maximum diffusion
    mieDirectionalG: 0.97,
    fogColor: [0.07, 0.07, 0.06],    // DARK GREY — no color at all. Neutral absence.
    fogDensity: 0.028,                // MAXIMUM fog — denser than start. Total erasure.
    sunLightColor: [0.35, 0.33, 0.30],  // grey light — no warmth
    sunLightIntensity: 0.12,
    ambientIntensity: 0.03,
    grassBaseColor: [0.04, 0.04, 0.04],  // DARK GREY — uniform. All identity gone.
    grassTipColor: [0.07, 0.07, 0.06],   // grey — indistinguishable from base
    grassWindSpeed: 0.08,    // nearly still — the garden has stopped breathing
    grassAmbientStrength: 0.08,
    grassTranslucency: 0.1,
    grassFogFade: 0.010,
    cloudShadowOpacity: 0.01,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.08, // last motes — embers dying
    fireflySize: 25,         // tiny, far away
    bloomIntensity: 0.3,     // faint glow on nothing
    bloomThreshold: 0.55,    // only the brightest things glow now
    fogDepthStrength: 0.18,  // MAXIMUM depth fog — visibility arm's reach
    fogMidColor: [0.06, 0.06, 0.05],
    fogFarColor: [0.04, 0.04, 0.03],
    colorGradeContrast: 0.01,   // flat — all contrast dissolved
    colorGradeVibrance: 0.0,    // ZERO — monochrome. Color is gone.
    colorGradeWarmth: 0.0,      // zero warmth
    vignetteDarkness: 0.90,     // near-maximum tunnel
    grainOpacity: 0.14,         // heaviest grain — static
    dustMoteBrightness: 0.05,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.08,     // painterly fading too — even the brushstrokes dissolve
    caDistortion: 0.005,        // residual tremor
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,
    waveWindSpeed: 0.04,
    waveWindStrength: 0.0,      // stillness
    dofFocusDistance: 1.5,      // focus collapsed
    dofBokehScale: 9.0,        // maximum bokeh — the world IS bokeh now
    splitToneWarm: [0.55, 0.52, 0.50],   // grey — no split tone left
    splitToneCool: [0.52, 0.50, 0.50],   // grey — uniform
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
