// Bioluminescent Deep atmosphere keyframes — The Weight of Wonder
// Scroll arc: Twilight → Midnight → Abyss → Hadal → Hydrothermal
//
// "The Mariana Trench. Total darkness except for bioluminescent creatures.
//  Jellyfish pulse like heartbeats. Anglerfish lights bob in the distance.
//  The music is the only warmth in absolute cold and pressure."
//
// Emotional architecture:
//   - Light dies as you descend. Each keyframe is darker than the last.
//   - Bioluminescence INCREASES as natural light DECREASES.
//   - Warmth only appears at the very bottom (hydrothermal vents).
//   - The viewer is alone. The music is the only companion.
//   - Bloom is the primary emotional tool — it IS the wonder.
//
// Source techniques:
//   - Fresnel glow: otanodesignco/Fresnel-Shader-Material (pow(1-dot(N,V), 1.5))
//   - Underwater fog: sixthsurge/photon (per-wavelength absorption)
//   - Caustic patterns: blaze33/droneWorld (iterative sin/cos, 5 iterations)
//   - Marine snow: madmappersoftware/MadMapper-Materials (3D hash field)
//   - Bioluminescent pulse: paulrobello/par-term (0.3 + 0.7 * sin(t * 2.1))
//   - Jellyfish vertex pulse: arodic/Chrysaora (asymmetric sin, Y-weighted)
//   - SSS: mattdesl gist (forward scatter, thicknessPower=12)

export const BIOLUMINESCENT_DEEP_KEYFRAMES = [
  {
    t: 0.0, // TWILIGHT ZONE — 200m depth. Last traces of sunlight filter down.
    // The surface world is a fading memory. Blue twilight gives way to indigo.
    // You can still see — barely. The transition from light to dark begins.
    // Marine snow drifts past like the world's slowest blizzard.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,      // no stars — we're underwater
    sunElevation: -60,         // sun exists but barely reaches here
    sunAzimuth: 180,
    turbidity: 0.5,
    rayleigh: 0.1,             // minimal scattering
    mieCoefficient: 0.001,
    mieDirectionalG: 0.80,
    fogColor: [0.02, 0.04, 0.08],    // deep blue — last filtered sunlight
    fogDensity: 0.015,         // moderate — water column absorbs
    sunLightColor: [0.08, 0.12, 0.22], // dim blue — only blue wavelengths survive
    sunLightIntensity: 0.12,   // fading fast
    ambientIntensity: 0.04,    // dim residual scatter
    grassBaseColor: [0.02, 0.02, 0.04],  // abyssal sediment (terrain vertex color)
    grassTipColor: [0.03, 0.04, 0.06],
    grassWindSpeed: 0.02,      // barely any current at this depth
    grassAmbientStrength: 0.08,
    grassTranslucency: 0.1,   // nothing to transmit
    grassFogFade: 0.008,
    cloudShadowOpacity: 0.0,   // no clouds down here
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.2,    // first faint plankton appear — hints of what's below
    fireflySize: 30,           // small — distant bioluminescence
    bloomIntensity: 0.4,       // moderate — glow is starting
    bloomThreshold: 0.5,
    fogDepthStrength: 0.10,    // heavy depth fog — water absorbs everything
    fogMidColor: [0.03, 0.05, 0.10],
    fogFarColor: [0.01, 0.02, 0.06],
    colorGradeContrast: 0.02,
    colorGradeVibrance: 0.08,  // muted — color is dying with the light
    colorGradeWarmth: 0.0,     // zero warmth — cold descent
    vignetteDarkness: 0.85,    // heavy — the water presses in
    grainOpacity: 0.08,        // noisy — underwater camera
    dustMoteBrightness: 0.3,   // marine snow — faint
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.01,        // minimal pressure distortion at this depth
    waveWindDirX: 0.5,
    waveWindDirY: 0.866,       // slow deep current
    waveWindSpeed: 0.05,
    waveWindStrength: 0.01,    // barely any current
    dofFocusDistance: 0,       // no DOF override — auto
    dofBokehScale: 4.0,
    splitToneWarm: [0.60, 0.50, 0.45],  // muted — warmth doesn't exist here
    splitToneCool: [0.30, 0.50, 0.80],  // blue dominates
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 0.25, // MIDNIGHT ZONE — 1000m depth. Total darkness has arrived.
    // The last photon from the surface died 200 meters ago.
    // Your eyes adapt. Faint cyan sparks appear in the periphery.
    // Bioluminescent plankton — the first creatures brave enough to glow.
    // Each flash is a tiny act of courage against infinite darkness.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: -90,          // sun is a concept, not a reality
    sunAzimuth: 180,
    turbidity: 0.5,
    rayleigh: 0.05,
    mieCoefficient: 0.001,
    mieDirectionalG: 0.75,
    fogColor: [0.01, 0.02, 0.05],    // near-black blue
    fogDensity: 0.018,         // thicker — visibility shrinking
    sunLightColor: [0.04, 0.06, 0.12], // vestigial — almost nothing
    sunLightIntensity: 0.05,   // gone
    ambientIntensity: 0.02,    // bioluminescent ambient only
    grassBaseColor: [0.01, 0.02, 0.03],
    grassTipColor: [0.02, 0.03, 0.05],
    grassWindSpeed: 0.01,
    grassAmbientStrength: 0.05,
    grassTranslucency: 0.05,
    grassFogFade: 0.010,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.8,    // plankton awakening — scattered cyan flashes
    fireflySize: 50,           // closer — growing as we descend
    bloomIntensity: 0.7,       // bloom growing — the glow becomes the world
    bloomThreshold: 0.4,       // lower threshold — more things glow
    fogDepthStrength: 0.12,
    fogMidColor: [0.02, 0.03, 0.07],
    fogFarColor: [0.01, 0.01, 0.04],
    colorGradeContrast: 0.04,
    colorGradeVibrance: 0.15,  // bioluminescence adds saturation
    colorGradeWarmth: 0.0,     // still cold
    vignetteDarkness: 0.90,    // tighter — the darkness is winning
    grainOpacity: 0.09,
    dustMoteBrightness: 0.5,   // marine snow — denser at this depth
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.02,        // pressure building
    waveWindDirX: 0.3,
    waveWindDirY: 0.954,
    waveWindSpeed: 0.03,
    waveWindStrength: 0.005,
    dofFocusDistance: 8,        // DOF starting — blur distant things
    dofBokehScale: 5.0,        // bioluminescent bokeh circles
    splitToneWarm: [0.55, 0.45, 0.40],
    splitToneCool: [0.20, 0.45, 0.85],  // cooler and cooler
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 0.50, // ABYSS — 4000m depth. The jellyfish zone. Peak bioluminescence.
    // This is where wonder lives. Jellyfish pulse like heartbeats —
    // slow, deliberate, each contraction a declaration: I AM ALIVE.
    // Their bells glow cyan-green, Fresnel rim light tracing every fold.
    // The water is thick with marine snow. You are floating in a galaxy.
    // This is the emotional peak — life persisting in impossible conditions.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: -90,
    sunAzimuth: 180,
    turbidity: 0.5,
    rayleigh: 0.02,
    mieCoefficient: 0.001,
    mieDirectionalG: 0.70,
    fogColor: [0.01, 0.015, 0.04],   // dark blue-violet
    fogDensity: 0.014,         // slightly clearer — jellyfish light illuminates
    sunLightColor: [0.02, 0.04, 0.08],
    sunLightIntensity: 0.02,
    ambientIntensity: 0.03,    // bioluminescent fill — creatures light the scene
    grassBaseColor: [0.01, 0.02, 0.03],
    grassTipColor: [0.02, 0.04, 0.06],
    grassWindSpeed: 0.01,
    grassAmbientStrength: 0.06,
    grassTranslucency: 0.05,
    grassFogFade: 0.008,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 1.8,    // PEAK — bioluminescence is everywhere
    fireflySize: 90,           // large — jellyfish are close, huge
    bloomIntensity: 1.2,       // HEAVY bloom — the glow wraps around everything
    bloomThreshold: 0.3,       // low — everything that glows, blooms
    fogDepthStrength: 0.08,
    fogMidColor: [0.02, 0.03, 0.06],
    fogFarColor: [0.01, 0.015, 0.04],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.30,  // bioluminescent saturation — cyan pops
    colorGradeWarmth: 0.0,     // still cold — warmth has not arrived
    vignetteDarkness: 0.70,    // opens slightly — the light pushes back darkness
    grainOpacity: 0.08,
    dustMoteBrightness: 0.7,   // marine snow glowing in bioluminescent light
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.035,       // pressure distortion at 4000m — the lens warps
    waveWindDirX: 0.2,
    waveWindDirY: 0.98,
    waveWindSpeed: 0.02,
    waveWindStrength: 0.003,
    dofFocusDistance: 5,        // intimate — focus on nearest jellyfish
    dofBokehScale: 6.0,        // heavy bokeh — distant creatures become soft orbs
    splitToneWarm: [0.50, 0.40, 0.38],
    splitToneCool: [0.15, 0.55, 0.90],  // deep cyan cool tones
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 0.75, // HADAL — 8000m depth. The deepest inhabited zone.
    // Anglerfish territory. Distant lights bob like lanterns in fog.
    // You can't see what carries the light — only the light itself.
    // The pressure is immense. The chromatic aberration is strong.
    // Each lure is a trap disguised as hope. Beauty as weapon.
    // The music here is the only honest thing.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: -90,
    sunAzimuth: 180,
    turbidity: 0.5,
    rayleigh: 0.01,
    mieCoefficient: 0.001,
    mieDirectionalG: 0.65,
    fogColor: [0.008, 0.01, 0.03],   // almost black
    fogDensity: 0.020,         // thicker again — deeper, darker
    sunLightColor: [0.01, 0.02, 0.05],
    sunLightIntensity: 0.01,   // essentially zero
    ambientIntensity: 0.015,   // barely anything
    grassBaseColor: [0.01, 0.01, 0.02],
    grassTipColor: [0.02, 0.02, 0.04],
    grassWindSpeed: 0.005,     // dead still
    grassAmbientStrength: 0.03,
    grassTranslucency: 0.02,
    grassFogFade: 0.012,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 1.0,    // still bright but sparser — fewer creatures here
    fireflySize: 70,           // anglerfish lures are smaller, distant
    bloomIntensity: 1.0,       // still heavy — lure light is all you have
    bloomThreshold: 0.25,      // very low threshold — everything glows
    fogDepthStrength: 0.14,    // heavy depth fog — can barely see
    fogMidColor: [0.01, 0.02, 0.05],
    fogFarColor: [0.005, 0.008, 0.025],
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.22,  // less saturated — isolation
    colorGradeWarmth: 0.005,   // the FIRST hint of warmth — vents are near
    vignetteDarkness: 0.92,    // crushing darkness — pressure manifest
    grainOpacity: 0.10,        // heavy grain — pressure artifacts
    dustMoteBrightness: 0.4,   // less marine snow this deep
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.05,        // STRONG — pressure warping the lens
    waveWindDirX: 0.1,
    waveWindDirY: 0.995,
    waveWindSpeed: 0.01,
    waveWindStrength: 0.001,   // dead still
    dofFocusDistance: 10,       // focus further out — watching distant lures
    dofBokehScale: 7.0,        // maximum bokeh — lures become soft discs of hope
    splitToneWarm: [0.60, 0.45, 0.35],  // slightly warmer — vents approaching
    splitToneCool: [0.12, 0.40, 0.85],
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 1.0, // HYDROTHERMAL — 11,000m. The Challenger Deep. The very bottom.
    // Hydrothermal vents. Black smokers. Superheated water at 400C.
    // And LIFE. Tube worms, ghost crabs, chemosynthetic bacteria.
    // Life that has never seen the sun and never will.
    // The warm amber glow of the vents is the emotional resolution:
    // warmth exists even at the bottom of everything.
    // The music was always here, waiting.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: -90,
    sunAzimuth: 180,
    turbidity: 0.5,
    rayleigh: 0.01,
    mieCoefficient: 0.002,     // mineral particles scatter vent light
    mieDirectionalG: 0.60,
    fogColor: [0.015, 0.012, 0.03],   // warmer — vent light tints the water
    fogDensity: 0.016,         // slightly clearer near vents — heat creates convection
    sunLightColor: [0.08, 0.05, 0.03], // warm! — vent light, not sun
    sunLightIntensity: 0.08,   // vent glow replaces sun
    ambientIntensity: 0.025,   // warm ambient from vent light
    grassBaseColor: [0.02, 0.02, 0.02],
    grassTipColor: [0.04, 0.03, 0.03],  // warm tint from vent light
    grassWindSpeed: 0.02,      // thermal convection — slight upward current
    grassAmbientStrength: 0.05,
    grassTranslucency: 0.08,   // vent light passes through sediment structures
    grassFogFade: 0.010,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.6,    // bioluminescence dims near vents — competition with heat
    fireflySize: 55,           // smaller — overshadowed by vent glow
    bloomIntensity: 0.9,       // still heavy — vent glow blooms warm
    bloomThreshold: 0.35,
    fogDepthStrength: 0.10,
    fogMidColor: [0.03, 0.025, 0.04],  // warmer purple-brown
    fogFarColor: [0.01, 0.01, 0.025],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.28,  // saturation returns — warmth has color
    colorGradeWarmth: 0.04,    // WARMTH. Finally. The emotional resolution.
    vignetteDarkness: 0.75,    // opens — vent light pushes back the darkness
    grainOpacity: 0.09,
    dustMoteBrightness: 0.6,   // mineral particles in vent plumes
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.04,        // still present — pressure never leaves
    waveWindDirX: 0.0,
    waveWindDirY: 1.0,         // straight up — thermal convection
    waveWindSpeed: 0.04,       // thermal updraft
    waveWindStrength: 0.008,   // gentle upward push
    dofFocusDistance: 4,        // close — intimacy with the vents, the life
    dofBokehScale: 5.0,        // warm bokeh from vent light
    splitToneWarm: [0.85, 0.60, 0.35],  // amber warmth — the resolution
    splitToneCool: [0.25, 0.35, 0.65],  // still cool in shadows — the cold never fully leaves
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
]
