// Aurora Tundra atmosphere keyframes — Synesthetic Revelation
// Scroll arc: Silence → First Light → Crescendo → Communion → Dissolution
// "The aurora isn't decoration — it IS the music made visible.
//  Each instrument maps to a color band in the sky."
//
// The aurora builds from nothing to everything and back to nothing.
// The snow transforms from blank white to a mirror of the sky.
// Footprints lead you to a figure who dissolves as you approach.
//
// Source techniques:
// - nimitz "Auroras" (Shadertoy XtGGRt): triNoise2d curtain, 50-step raymarch
// - GDC 2011 Barre-Brisebois: snow SSS (pow(dot(V,-L), 2.0) * 10.0)
// - Quilez voronoi: ice crystal sparkle (glitterSize=400, density=0.15)
// - Active Theory "Neve": canvas displacement footprints
// - Night Meadow (exp-008): star rendering adapted for arctic clarity

export const AURORA_TUNDRA_KEYFRAMES = [
  {
    t: 0.0, // SILENCE — Empty white expanse. No aurora. Just stars and wind.
    // The held breath before the first note. You're standing on the edge of nothing.
    // The footprints stretch ahead into darkness. Who walked here?
    snowBrightness: 0.3,       // gentle snow always present — the tundra breathes
    auroraBrightness: 0.0,     // no aurora yet — darkness and stars
    iceBrightness: 0.7,        // ice spikes visible in starlight — faint Fresnel glow
    starBrightness: 1.0,       // stars dominate — arctic clarity, dry air
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: -25,         // deep arctic night
    sunAzimuth: 180,           // moon position (low arc)
    turbidity: 1.0,            // crystal clear arctic air
    rayleigh: 0.1,             // minimal scattering (dark sky)
    mieCoefficient: 0.003,     // almost none
    mieDirectionalG: 0.80,
    fogColor: [0.03, 0.04, 0.08],   // blue-black void
    fogDensity: 0.003,
    sunLightColor: [0.20, 0.25, 0.45], // faint moonlight — blue-violet
    sunLightIntensity: 0.25,
    ambientIntensity: 0.04,    // barely lit — snow glows faintly from starlight
    grassBaseColor: [0.30, 0.33, 0.38],  // frost-silver frozen grass
    grassTipColor: [0.45, 0.50, 0.58],   // ice-white tips
    grassWindSpeed: 0.05,      // nearly frozen — held breath
    grassAmbientStrength: 0.10,
    grassTranslucency: 0.2,    // ice doesn't transmit much
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.0,   // no clouds — clear arctic sky
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.0,    // ice crystals not yet visible
    fireflySize: 20,
    bloomIntensity: 0.15,      // minimal — just starlight
    bloomThreshold: 0.85,
    fogDepthStrength: 0.04,
    fogMidColor: [0.04, 0.05, 0.10],
    fogFarColor: [0.02, 0.03, 0.06],
    colorGradeContrast: 0.04,
    colorGradeVibrance: 0.1,   // desaturated — monochrome cold
    colorGradeWarmth: 0.0,     // zero warmth — earned later through aurora
    vignetteDarkness: 0.80,    // heavy isolation
    grainOpacity: 0.08,        // harsh cold film stock
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,      // no sun
    kuwaharaStrength: 0.0,     // crisp, not painterly
    caDistortion: 0.0,         // clean — cold air is still
    waveWindDirX: 0.0,
    waveWindDirY: 1.0,         // wind from the north
    waveWindSpeed: 0.1,
    waveWindStrength: 0.0,     // frozen still
    dofFocusDistance: 15,      // footprints in focus
    dofBokehScale: 2.0,       // subtle bokeh
    splitToneWarm: [0.40, 0.50, 0.70],  // blue-steel shadows (NOT warm)
    splitToneCool: [0.50, 0.55, 0.65],  // steel highlights
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // FIRST LIGHT — First aurora flicker. The first instrument enters.
    // A single green curtain unfurls along the horizon. Faint, uncertain.
    // The snow beneath begins to blush green — you're standing on a mirror.
    // Ice crystals materialize, catching the first faint light.
    snowBrightness: 0.5,       // snow picking up — aurora tints the flakes
    auroraBrightness: 0.35,    // first aurora flicker — uncertain, flickering
    iceBrightness: 0.85,       // ice spikes catching first aurora light
    starBrightness: 0.85,      // stars still strong, aurora competing
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: -22,
    sunAzimuth: 190,
    turbidity: 1.0,
    rayleigh: 0.12,
    mieCoefficient: 0.005,     // slight haze from aurora interaction
    mieDirectionalG: 0.82,
    fogColor: [0.04, 0.08, 0.10],   // first green tint enters the void
    fogDensity: 0.003,
    sunLightColor: [0.22, 0.35, 0.40], // aurora-tinted moonlight — green creeping in
    sunLightIntensity: 0.35,
    ambientIntensity: 0.08,    // aurora provides first ambient lift
    grassBaseColor: [0.30, 0.35, 0.38], // frost catching faint green
    grassTipColor: [0.45, 0.55, 0.55],  // green-tinted ice tips
    grassWindSpeed: 0.10,      // slight stir — the air changes
    grassAmbientStrength: 0.15,
    grassTranslucency: 0.4,    // aurora light beginning to transmit through ice
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.3,    // ice crystals appearing — catching aurora
    fireflySize: 35,
    bloomIntensity: 0.35,      // aurora glow emerging
    bloomThreshold: 0.65,
    fogDepthStrength: 0.05,
    fogMidColor: [0.05, 0.10, 0.12],  // green bleeding into fog
    fogFarColor: [0.03, 0.06, 0.08],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.30,  // color entering the world
    colorGradeWarmth: 0.0,     // still cold — aurora is NOT warmth
    vignetteDarkness: 0.70,
    grainOpacity: 0.07,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.008,       // slight — cold air starting to shimmer
    waveWindDirX: 0.0,
    waveWindDirY: 1.0,
    waveWindSpeed: 0.15,
    waveWindStrength: 0.03,    // faint wind stir
    dofFocusDistance: 12,
    dofBokehScale: 3.0,       // aurora bokeh balls appearing in background
    splitToneWarm: [0.40, 0.55, 0.65],  // blue-green shadows
    splitToneCool: [0.45, 0.75, 0.55],  // aurora green entering highlights
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // CRESCENDO — Full aurora erupts. All color bands. The full orchestra.
    // Green curtains billow overhead. Purple fringes pulse. Cyan highlights streak.
    // The entire snow plain is a mirror — you're walking on the sky itself.
    // Ice crystals everywhere, each one a tiny prism splitting aurora light.
    // This is synesthesia — the music IS the light. You can SEE the instruments.
    snowBrightness: 0.7,       // snow catching full aurora colors
    auroraBrightness: 1.0,     // full aurora — the sky is on fire
    iceBrightness: 1.0,        // ice spikes glowing with aurora SSS
    starBrightness: 0.50,      // dimmed by aurora brightness
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: -20,
    sunAzimuth: 200,
    turbidity: 1.2,
    rayleigh: 0.15,
    mieCoefficient: 0.010,     // aurora scatter
    mieDirectionalG: 0.85,
    fogColor: [0.06, 0.14, 0.10],   // rich green-teal aurora fog
    fogDensity: 0.003,
    sunLightColor: [0.30, 0.50, 0.40], // aurora-green ambient light on snow
    sunLightIntensity: 0.55,
    ambientIntensity: 0.15,    // aurora IS the light source now
    grassBaseColor: [0.28, 0.38, 0.32], // green aurora reflected in frost
    grassTipColor: [0.40, 0.60, 0.50],  // vivid green-tinted ice
    grassWindSpeed: 0.20,      // electromagnetic wind — aurora stirs the air
    grassAmbientStrength: 0.28,
    grassTranslucency: 0.8,    // aurora light transmitting through ice crystals
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 1.0,    // ice crystals at maximum — diamond dust
    fireflySize: 80,           // large, bright prismatic particles
    bloomIntensity: 0.80,      // heavy aurora glow
    bloomThreshold: 0.45,      // low threshold — everything glows
    fogDepthStrength: 0.07,
    fogMidColor: [0.08, 0.18, 0.12],  // aurora-saturated fog
    fogFarColor: [0.05, 0.12, 0.08],
    colorGradeContrast: 0.10,
    colorGradeVibrance: 0.75,  // peak color — synesthetic saturation
    colorGradeWarmth: 0.0,     // NOT warm — aurora is cold fire
    vignetteDarkness: 0.45,    // opening up — the sky is everywhere
    grainOpacity: 0.05,        // slightly less grain — aurora smooths perception
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.02,        // aurora-induced atmospheric distortion
    waveWindDirX: 0.3,
    waveWindDirY: 0.95,
    waveWindSpeed: 0.25,
    waveWindStrength: 0.08,    // electromagnetic wind effect
    dofFocusDistance: 10,
    dofBokehScale: 4.5,       // heavy bokeh — aurora particles become bokeh balls
    splitToneWarm: [0.45, 0.60, 0.55],  // green-teal shadows
    splitToneCool: [0.40, 0.85, 0.55],  // vivid aurora green highlights
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // COMMUNION — Ground level. Aurora directly overhead. Peak intimacy.
    // Camera drops low among the frozen grass and ice crystals.
    // The footprints lead to a figure standing still, watching the sky.
    // You realize: the footprints are yours. You've been here before.
    // The aurora responds to you — or you respond to it. The distinction dissolves.
    // Purple enters: the cello. The sky is playing the whole piece.
    snowBrightness: 0.8,       // peak snow — being AMONG the falling flakes
    auroraBrightness: 1.3,     // peak aurora — overwhelming, everywhere
    iceBrightness: 1.0,        // ice at full glow — you're surrounded
    starBrightness: 0.35,
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: -18,
    sunAzimuth: 210,
    turbidity: 1.3,
    rayleigh: 0.18,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.87,
    fogColor: [0.08, 0.12, 0.14],   // deeper teal — purple creeping in
    fogDensity: 0.004,               // slight fog increase — intimacy
    sunLightColor: [0.35, 0.40, 0.55], // purple-teal aurora light
    sunLightIntensity: 0.50,
    ambientIntensity: 0.12,
    grassBaseColor: [0.30, 0.35, 0.40], // purple-tinted frost
    grassTipColor: [0.45, 0.50, 0.65],  // purple-blue ice
    grassWindSpeed: 0.15,
    grassAmbientStrength: 0.22,
    grassTranslucency: 1.0,    // peak — light pouring through every crystal
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 1.2,    // ice crystals brightest — you're among them
    fireflySize: 100,          // large — ground-level intimacy (research: being AMONG > above)
    bloomIntensity: 0.90,      // peak bloom
    bloomThreshold: 0.40,
    fogDepthStrength: 0.08,
    fogMidColor: [0.10, 0.14, 0.18],  // purple entering the fog
    fogFarColor: [0.06, 0.08, 0.14],
    colorGradeContrast: 0.12,
    colorGradeVibrance: 0.85,  // peak vibrance — every color band singing
    colorGradeWarmth: 0.0,
    vignetteDarkness: 0.40,    // widest opening — sky is everything
    grainOpacity: 0.04,
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.025,       // peak distortion — reality bending
    waveWindDirX: 0.5,
    waveWindDirY: 0.87,
    waveWindSpeed: 0.3,
    waveWindStrength: 0.10,    // peak electromagnetic stir
    dofFocusDistance: 8,       // intimate close focus
    dofBokehScale: 5.0,       // heaviest bokeh — aurora becomes abstract color
    splitToneWarm: [0.50, 0.45, 0.65],  // purple shadows
    splitToneCool: [0.45, 0.70, 0.80],  // cyan-green highlights (mixed bands)
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // DISSOLUTION — Aurora fading. The figure is gone. Stars return.
    // Was the figure ever there? The footprints end. The snow still holds
    // faint green — a memory of color in the ice. The music lingers
    // in the light, even as the light withdraws. You're alone on the tundra,
    // but the sky remembers. And somewhere, someone else begins to follow
    // footprints that aren't there yet.
    snowBrightness: 0.4,       // snow settling — fewer flakes, quieter
    auroraBrightness: 0.15,    // aurora fading — ghost of green lingers
    iceBrightness: 0.75,       // ice still faintly glowing — memory of light
    starBrightness: 0.90,      // stars returning as aurora fades
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: -23,
    sunAzimuth: 220,
    turbidity: 1.0,
    rayleigh: 0.10,
    mieCoefficient: 0.004,
    mieDirectionalG: 0.80,
    fogColor: [0.04, 0.06, 0.08],   // returning to blue-black — but not quite the same
    fogDensity: 0.004,
    sunLightColor: [0.22, 0.28, 0.42], // fading aurora tint in moonlight
    sunLightIntensity: 0.30,
    ambientIntensity: 0.06,
    grassBaseColor: [0.32, 0.35, 0.38], // returning to frost-silver
    grassTipColor: [0.48, 0.52, 0.58],  // but with a ghost of green
    grassWindSpeed: 0.08,      // wind settling — exhale
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.3,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.15,   // ice crystals fading — a few linger
    fireflySize: 30,
    bloomIntensity: 0.20,      // aurora afterglow
    bloomThreshold: 0.80,
    fogDepthStrength: 0.05,
    fogMidColor: [0.05, 0.07, 0.10],
    fogFarColor: [0.03, 0.04, 0.07],
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.20,  // color draining, but NOT back to zero — memory remains
    colorGradeWarmth: 0.01,    // the tiniest warmth — earned through witnessing
    vignetteDarkness: 0.75,    // closing back in
    grainOpacity: 0.08,        // harsh grain returns
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.005,       // settling
    waveWindDirX: 0.0,
    waveWindDirY: 1.0,
    waveWindSpeed: 0.12,
    waveWindStrength: 0.02,    // wind dying
    dofFocusDistance: 20,      // focus pulling to distance — looking at nothing
    dofBokehScale: 2.5,       // softer bokeh — gentler
    splitToneWarm: [0.42, 0.50, 0.65],  // blue-steel returning, ghost of green
    splitToneCool: [0.48, 0.58, 0.60],  // faded aurora memory in highlights
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
