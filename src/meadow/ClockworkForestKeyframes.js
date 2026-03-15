// Clockwork Forest atmosphere keyframes — Mechanical Becoming
// Scroll arc: Mechanism → Friction → Fracture → Symbiosis → Alive
//
// "The gears turned for centuries with no one watching.
//  Then something grew between the teeth. Then it breathed."
//
// The emotional arc is the machine learning to be alive:
// - Cold precision fractures under its own perfection
// - Life doesn't conquer the machine — it transforms it
// - By the end, you can't tell where brass ends and bark begins
//
// Root parameters that cascade:
// - steamDensity drives fog color (more steam = warmer, hazier)
// - grassWindSpeed follows organic emergence (suppressed → growing → alive)
// - bloomIntensity tracks spark density (high mechanical → low organic)
// - godRayIntensity peaks at Fracture (light through cracking steam canopy)
//
// Source techniques adapted:
// - Nadrin/PBR: brass F0 = vec3(0.95, 0.79, 0.29), roughness progression
// - juniorxsound/Particle-Curl-Noise: steam drift via curl noise
// - EmptySamurai/GearTrain: gear rotation phase sync
// - Scroll arc stagger: steam leads, grass follows (+10%), bloom lags (+10%)

export const CLOCKWORK_FOREST_KEYFRAMES = [
  {
    t: 0.0, // MECHANISM — pure clockwork, no life, cold precision
    // The forest is a factory. Every gear meshes perfectly.
    // Steam rises in scheduled plumes. The light is industrial amber.
    // You are an intruder in a machine that doesn't know you exist.
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: 6,           // low — long shadows through gear trunks
    sunAzimuth: 220,           // side-lit for gear relief
    turbidity: 8.0,            // heavy steam haze
    rayleigh: 1.0,
    mieCoefficient: 0.020,     // strong Mie = steam catching light
    mieDirectionalG: 0.94,
    fogColor: [0.18, 0.14, 0.08],  // warm bronze haze — steam-filtered light
    fogDensity: 0.012,         // thick — machinery half-hidden
    sunLightColor: [0.80, 0.65, 0.40],  // amber through steam
    sunLightIntensity: 1.0,
    ambientIntensity: 0.08,    // low — shadow reveals gear depth
    grassBaseColor: [0.01, 0.03, 0.01],  // near-black — grass barely exists
    grassTipColor: [0.03, 0.06, 0.02],   // dark olive stubs
    grassWindSpeed: 0.05,      // almost frozen — steam dampens air
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.3,    // no translucency — grass is stiff, metallic
    grassFogFade: 0.006,
    cloudShadowOpacity: 0.15,  // gear shadow patterns on ground
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.0,    // no organic light
    fireflySize: 25,
    bloomIntensity: 0.5,       // spark glow — hot metal
    bloomThreshold: 0.5,
    fogDepthStrength: 0.08,
    fogMidColor: [0.22, 0.18, 0.10],
    fogFarColor: [0.14, 0.10, 0.06],
    colorGradeContrast: 0.12,  // high contrast — mechanical precision
    colorGradeVibrance: 0.25,  // desaturated — bronze monotone
    colorGradeWarmth: 0.04,    // cold machine
    vignetteDarkness: 0.75,    // tight — tunnel into machinery
    grainOpacity: 0.08,        // industrial grain
    dustMoteBrightness: 0.6,   // gear dust catching amber light
    godRayIntensity: 0.4,      // rays through steam vents
    kuwaharaStrength: 0.0,
    caDistortion: 0.01,
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,       // 60deg — steam drafts
    waveWindSpeed: 0.15,
    waveWindStrength: 0.0,     // no wave wind — mechanical stillness
    dofFocusDistance: 15,      // mid-range — surveying the machinery
    dofBokehScale: 2.5,       // moderate — see the mechanism clearly
    splitToneWarm: [0.90, 0.70, 0.40],  // bronze shadows
    splitToneCool: [0.70, 0.72, 0.80],  // steel highlights
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // FRICTION — gears grinding harder, heat building, sparks flying
    // The machine is straining. Something is wrong with the precision.
    // Steam thickens. Sparks fly where gears mesh too tight.
    // You feel heat. The amber deepens. The rhythm stutters.
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: 8,
    sunAzimuth: 225,
    turbidity: 7.0,
    rayleigh: 1.1,
    mieCoefficient: 0.018,
    mieDirectionalG: 0.93,
    fogColor: [0.25, 0.18, 0.10],  // warmer — heat building
    fogDensity: 0.010,
    sunLightColor: [0.85, 0.68, 0.42],  // deeper amber — friction heat
    sunLightIntensity: 1.3,
    ambientIntensity: 0.10,
    grassBaseColor: [0.02, 0.04, 0.02],  // barely visible shoots
    grassTipColor: [0.05, 0.10, 0.04],
    grassWindSpeed: 0.15,      // first stirring — steam drafts
    grassAmbientStrength: 0.18,
    grassTranslucency: 0.5,
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.12,
    cloudDriftSpeed: 0.00004,
    fireflyBrightness: 0.0,
    fireflySize: 30,
    bloomIntensity: 0.8,       // PEAK bloom — sparks, hot metal
    bloomThreshold: 0.42,      // lower threshold catches more sparks
    fogDepthStrength: 0.07,
    fogMidColor: [0.30, 0.22, 0.12],
    fogFarColor: [0.18, 0.14, 0.08],
    colorGradeContrast: 0.14,  // peak contrast — tension
    colorGradeVibrance: 0.35,
    colorGradeWarmth: 0.06,    // warmth building but not earned
    vignetteDarkness: 0.68,
    grainOpacity: 0.09,        // peak grain — heat shimmer
    dustMoteBrightness: 0.9,   // peak gear dust — machinery straining
    godRayIntensity: 0.6,      // stronger rays — steam thicker
    kuwaharaStrength: 0.0,
    caDistortion: 0.02,        // slight — heat distortion
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,
    waveWindSpeed: 0.25,
    waveWindStrength: 0.05,    // first wave wind — steam updrafts
    dofFocusDistance: 10,      // closer — danger, focus narrows
    dofBokehScale: 3.5,       // heavier — tension
    splitToneWarm: [0.95, 0.72, 0.38],  // hotter bronze
    splitToneCool: [0.68, 0.70, 0.78],  // steel cooling
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // FRACTURE — the first crack, a green shoot pushes through
    // THIS is the moment. One shoot. One impossible green thread
    // between two gear teeth. The machine doesn't break —
    // it hesitates. The steam parts. God rays pour through.
    // Everything changes in a single frame.
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.2,     // first petals — copper-colored, ambiguous
    sunElevation: 12,          // sun rising — light finds the crack
    sunAzimuth: 230,
    turbidity: 5.5,            // steam clearing — sky visible
    rayleigh: 1.3,
    mieCoefficient: 0.014,
    mieDirectionalG: 0.92,
    fogColor: [0.30, 0.25, 0.15],  // amber-green transition
    fogDensity: 0.006,         // clearing — the fracture lets light in
    sunLightColor: [0.92, 0.80, 0.55],  // golden — warmth earned
    sunLightIntensity: 1.6,    // peak light — the crack is open
    ambientIntensity: 0.15,
    grassBaseColor: [0.04, 0.12, 0.04],  // grass emerging — visible green
    grassTipColor: [0.12, 0.30, 0.08],   // real green tips — life
    grassWindSpeed: 0.6,       // wind entering through the fracture
    grassAmbientStrength: 0.28,
    grassTranslucency: 1.2,    // first translucency — light through blades
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.10,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.0,
    fireflySize: 40,
    bloomIntensity: 0.65,      // moderating — sparks dimming, sunlight replacing
    bloomThreshold: 0.50,
    fogDepthStrength: 0.05,
    fogMidColor: [0.40, 0.35, 0.22],
    fogFarColor: [0.25, 0.22, 0.15],
    colorGradeContrast: 0.10,
    colorGradeVibrance: 0.50,  // color returning — green amid bronze
    colorGradeWarmth: 0.08,    // warmth earned through fracture
    vignetteDarkness: 0.45,    // opening up — light flooding in
    grainOpacity: 0.06,        // softening — less industrial
    dustMoteBrightness: 0.5,   // dust settling — pollen beginning
    godRayIntensity: 1.0,      // PEAK — light through the fracture
    kuwaharaStrength: 0.0,
    caDistortion: 0.015,
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.5,
    waveWindStrength: 0.15,    // wind through grass — real movement
    dofFocusDistance: 6,       // tight focus — on the green shoot
    dofBokehScale: 5.0,       // heavy bokeh — everything else dissolves
    splitToneWarm: [0.92, 0.78, 0.48],  // golden amber
    splitToneCool: [0.65, 0.75, 0.72],  // first green in highlights
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // SYMBIOSIS — organic and mechanical coexist, vines wrap gears
    // The forest is transforming. Moss covers brass. Vines thread through
    // gear teeth and the gears still turn — slower, with resistance,
    // but the resistance is alive. The air smells like rain and oil.
    // Steam becomes mist. Sparks become fireflies. You can't tell which.
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.6,     // copper-green petals drifting
    sunElevation: 15,          // higher — canopy is organic now
    sunAzimuth: 235,
    turbidity: 4.0,            // clearing — organic atmosphere
    rayleigh: 1.5,             // more sky color — blue returning
    mieCoefficient: 0.010,
    mieDirectionalG: 0.90,
    fogColor: [0.20, 0.22, 0.14],  // green-bronze fog
    fogDensity: 0.004,         // mist, not steam
    sunLightColor: [0.95, 0.88, 0.65],  // warm golden-green
    sunLightIntensity: 1.5,
    ambientIntensity: 0.18,    // leafy diffuse light
    grassBaseColor: [0.06, 0.18, 0.04],  // real grass — established
    grassTipColor: [0.20, 0.45, 0.12],   // vivid green tips
    grassWindSpeed: 1.2,       // alive — wind through real grass
    grassAmbientStrength: 0.35,
    grassTranslucency: 2.0,    // strong translucency — backlit meadow
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.14,  // organic cloud shadows
    cloudDriftSpeed: 0.00006,
    fireflyBrightness: 0.3,    // are they fireflies or sparks? ambiguous
    fireflySize: 55,
    bloomIntensity: 0.55,      // warm organic bloom
    bloomThreshold: 0.55,
    fogDepthStrength: 0.04,
    fogMidColor: [0.30, 0.35, 0.22],
    fogFarColor: [0.18, 0.22, 0.14],
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.65,  // vivid — life saturating the scene
    colorGradeWarmth: 0.10,    // warm — earned through transformation
    vignetteDarkness: 0.35,    // wide open — expansive canopy
    grainOpacity: 0.04,        // soft — organic texture
    dustMoteBrightness: 0.4,   // pollen + last gear dust
    godRayIntensity: 0.6,      // rays through leaf canopy
    kuwaharaStrength: 0.0,
    caDistortion: 0.01,
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.6,
    waveWindStrength: 0.25,    // rolling wave wind — meadow alive
    dofFocusDistance: 8,       // mid-range — taking in the symbiosis
    dofBokehScale: 4.0,       // moderate — see the transformation
    splitToneWarm: [0.88, 0.80, 0.55],  // golden-green warmth
    splitToneCool: [0.60, 0.78, 0.65],  // green highlights — organic
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // ALIVE — the forest has won, machine IS the tree
    // The brass is bark now. The gears are growth rings.
    // Where steam rose, mist drifts between real trees.
    // The ground is moss over mechanism. Flowers grow from gear hubs.
    // What was a factory is now a cathedral of green and bronze.
    // The machine didn't die. It learned to breathe.
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.4,     // gentle drift — natural now
    sunElevation: 10,          // golden hour through canopy
    sunAzimuth: 240,
    turbidity: 3.5,
    rayleigh: 1.8,             // rich sky — the canopy has gaps
    mieCoefficient: 0.008,
    mieDirectionalG: 0.88,
    fogColor: [0.15, 0.20, 0.12],  // green mist — forest fog
    fogDensity: 0.005,         // moderate — dappled atmosphere
    sunLightColor: [0.92, 0.85, 0.62],  // golden-green light
    sunLightIntensity: 1.2,
    ambientIntensity: 0.20,    // leafy ambient — dense canopy
    grassBaseColor: [0.05, 0.16, 0.04],  // rich green base
    grassTipColor: [0.22, 0.50, 0.14],   // vivid — nature triumphant
    grassWindSpeed: 0.8,       // gentle — breathing, not pushing
    grassAmbientStrength: 0.38,
    grassTranslucency: 1.8,
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.10,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.5,    // now definitely fireflies — warm amber
    fireflySize: 65,
    bloomIntensity: 0.45,      // soft warm bloom — organic
    bloomThreshold: 0.60,
    fogDepthStrength: 0.04,
    fogMidColor: [0.25, 0.30, 0.18],
    fogFarColor: [0.15, 0.18, 0.12],
    colorGradeContrast: 0.07,
    colorGradeVibrance: 0.55,  // vivid but not hyper — natural
    colorGradeWarmth: 0.08,    // warm — the machine carries warmth
    vignetteDarkness: 0.45,    // moderate — enclosing canopy
    grainOpacity: 0.04,        // subtle — film quality
    dustMoteBrightness: 0.3,   // pollen motes in light shafts
    godRayIntensity: 0.35,     // dappled — through leaves, not steam
    kuwaharaStrength: 0.0,
    caDistortion: 0.005,       // clean — peace
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.4,
    waveWindStrength: 0.15,    // gentle wave wind — breathing
    dofFocusDistance: 10,      // mid-range — observing the cathedral
    dofBokehScale: 3.5,
    splitToneWarm: [0.85, 0.82, 0.60],  // warm amber-green
    splitToneCool: [0.58, 0.80, 0.62],  // cool green
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
