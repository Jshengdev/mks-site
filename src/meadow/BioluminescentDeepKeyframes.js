// Bioluminescent Deep atmosphere keyframes — The Weight of Wonder
// Scroll arc: DESCENT INTO VOID → MIDNIGHT → ABYSS PEAK → HADAL → HYDROTHERMAL
//
// "The Mariana Trench. Total darkness except for bioluminescent creatures.
//  Jellyfish pulse like heartbeats. Anglerfish lights bob in the distance.
//  The music is the only warmth in absolute cold and pressure."
//
// CRITICAL DIFFERENCE FROM GOLDEN MEADOW:
//   - t=0 is PITCH BLACK. ambientIntensity=0.005, fogColor near-zero.
//   - The ONLY visible things are glowing creatures (fireflies=jellyfish).
//   - Bloom at 1.5 from frame 1 — glow IS the world.
//   - No grass visible (disabled), no sky, no sun. Just void + light.
//   - Firefly size 200 (jellyfish bells, not firefly specks).
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
    t: 0.0, // DESCENT INTO VOID — You enter total darkness. Immediately alien.
    // No twilight transition. You are ALREADY in the deep.
    // Huge cyan-green jellyfish pulse in the black. Nothing else is visible.
    // This must look NOTHING like Golden Meadow from the first frame.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,      // no stars — we're underwater
    sunElevation: -40,         // sun is a memory
    sunAzimuth: 180,
    turbidity: 0.5,
    rayleigh: 0.05,            // near-zero scattering
    mieCoefficient: 0.001,
    mieDirectionalG: 0.70,
    fogColor: [0.0, 0.0, 0.02],       // PITCH BLACK with bare blue hint
    fogDensity: 0.025,         // thick — the void swallows everything
    sunLightColor: [0.02, 0.03, 0.06], // near-zero
    sunLightIntensity: 0.01,   // effectively nothing
    ambientIntensity: 0.005,   // ALMOST ZERO — only creatures emit light
    grassBaseColor: [0.01, 0.01, 0.02],  // invisible — grass is disabled anyway
    grassTipColor: [0.01, 0.01, 0.02],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.01,
    grassTranslucency: 0.0,
    grassFogFade: 0.015,
    cloudShadowOpacity: 0.0,   // no clouds in the abyss
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 2.0,    // BRIGHT FROM FRAME 1 — jellyfish ARE the world
    fireflySize: 200,          // HUGE — jellyfish bells, not firefly specks
    bloomIntensity: 1.5,       // MAXIMUM — glow wraps everything, bleeds into void
    bloomThreshold: 0.2,       // VERY LOW — everything bioluminescent blooms hard
    fogDepthStrength: 0.15,    // heavy depth fog — water eats distance
    fogMidColor: [0.0, 0.005, 0.02],
    fogFarColor: [0.0, 0.0, 0.01],
    colorGradeContrast: 0.03,
    colorGradeVibrance: 0.15,  // just enough to make cyan pop against black
    colorGradeWarmth: 0.0,     // zero warmth — earned at the bottom only
    vignetteDarkness: 0.95,    // CRUSHING — tunnel vision, pressure, isolation
    grainOpacity: 0.10,        // heavy — underwater camera noise
    dustMoteBrightness: 0.5,   // marine snow — faint specks in creature light
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.02,        // pressure distortion from the start
    waveWindDirX: 0.3,
    waveWindDirY: 0.954,       // slow deep current
    waveWindSpeed: 0.02,
    waveWindStrength: 0.005,
    dofFocusDistance: 6,        // intimate — nearest jellyfish in focus
    dofBokehScale: 6.0,        // heavy bokeh — distant glow becomes soft orbs
    splitToneWarm: [0.50, 0.40, 0.38],  // muted — warmth doesn't exist here
    splitToneCool: [0.15, 0.55, 0.90],  // deep cyan dominates
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 0.25, // MIDNIGHT ZONE — 1000m. Deeper. More creatures emerge.
    // Eyes have adapted. Plankton clouds flash in the periphery.
    // Each flash is a tiny act of courage against infinite darkness.
    // The jellyfish are closer now, their bells larger in the viewport.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: -40,
    sunAzimuth: 180,
    turbidity: 0.5,
    rayleigh: 0.03,
    mieCoefficient: 0.001,
    mieDirectionalG: 0.65,
    fogColor: [0.0, 0.005, 0.025],    // slightly more blue — plankton tint
    fogDensity: 0.022,         // still thick
    sunLightColor: [0.01, 0.02, 0.05],
    sunLightIntensity: 0.005,  // gone
    ambientIntensity: 0.008,   // creatures add tiny fill
    grassBaseColor: [0.01, 0.01, 0.02],
    grassTipColor: [0.01, 0.02, 0.03],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.01,
    grassTranslucency: 0.0,
    grassFogFade: 0.015,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 2.5,    // BRIGHTER — more creatures, denser bioluminescence
    fireflySize: 180,          // still huge — growing closer
    bloomIntensity: 1.5,       // sustained maximum
    bloomThreshold: 0.2,       // sustained low threshold
    fogDepthStrength: 0.14,
    fogMidColor: [0.005, 0.01, 0.03],
    fogFarColor: [0.0, 0.005, 0.02],
    colorGradeContrast: 0.04,
    colorGradeVibrance: 0.20,  // bioluminescence adds saturation
    colorGradeWarmth: 0.0,     // still cold
    vignetteDarkness: 0.92,    // slightly less crushing — eyes adapting
    grainOpacity: 0.09,
    dustMoteBrightness: 0.6,   // marine snow denser
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.03,        // pressure building
    waveWindDirX: 0.2,
    waveWindDirY: 0.98,
    waveWindSpeed: 0.015,
    waveWindStrength: 0.003,
    dofFocusDistance: 5,        // tighter focus — one creature at a time
    dofBokehScale: 6.5,        // bioluminescent bokeh circles
    splitToneWarm: [0.50, 0.40, 0.38],
    splitToneCool: [0.12, 0.50, 0.88],  // cooler still
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 0.50, // ABYSS — 4000m. PEAK BIOLUMINESCENCE. The jellyfish zone.
    // This is where wonder lives. Jellyfish pulse like heartbeats —
    // slow, deliberate, each contraction a declaration: I AM ALIVE.
    // Their bells glow cyan-green, Fresnel rim light tracing every fold.
    // You are floating in a galaxy of living light.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: -40,
    sunAzimuth: 180,
    turbidity: 0.5,
    rayleigh: 0.02,
    mieCoefficient: 0.001,
    mieDirectionalG: 0.60,
    fogColor: [0.005, 0.01, 0.03],    // faintest blue-violet tint from creature light
    fogDensity: 0.018,         // slightly clearer — jellyfish light illuminates nearby water
    sunLightColor: [0.01, 0.02, 0.04],
    sunLightIntensity: 0.005,
    ambientIntensity: 0.012,   // creatures light the scene — peak fill
    grassBaseColor: [0.01, 0.01, 0.02],
    grassTipColor: [0.02, 0.03, 0.04],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.02,
    grassTranslucency: 0.0,
    grassFogFade: 0.012,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 3.0,    // PEAK — bioluminescence everywhere, the glow IS the world
    fireflySize: 220,          // MAXIMUM — jellyfish right next to you
    bloomIntensity: 1.8,       // PEAK bloom — light overflows, bleeds across the void
    bloomThreshold: 0.15,      // lowest — everything that glows, blooms hard
    fogDepthStrength: 0.10,
    fogMidColor: [0.008, 0.015, 0.04],
    fogFarColor: [0.003, 0.008, 0.025],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.35,  // peak saturation — cyan pops against absolute black
    colorGradeWarmth: 0.0,     // still cold — warmth has not arrived
    vignetteDarkness: 0.75,    // opens — the light pushes back the darkness
    grainOpacity: 0.08,
    dustMoteBrightness: 0.8,   // marine snow glowing in bioluminescent light
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.04,        // pressure distortion at 4000m
    waveWindDirX: 0.15,
    waveWindDirY: 0.99,
    waveWindSpeed: 0.01,
    waveWindStrength: 0.002,
    dofFocusDistance: 4,        // intimate — focus on nearest jellyfish
    dofBokehScale: 7.0,        // heavy bokeh — distant creatures become soft orbs of light
    splitToneWarm: [0.45, 0.38, 0.35],
    splitToneCool: [0.10, 0.55, 0.92],  // peak cyan cool tones
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 0.75, // HADAL — 8000m. Anglerfish territory. Sparser, lonelier.
    // Distant lure-lights bob like lanterns in fog.
    // You can't see what carries the light — only the light itself.
    // The pressure is immense. Each lure is a trap disguised as hope.
    // The music here is the only honest thing.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: -40,
    sunAzimuth: 180,
    turbidity: 0.5,
    rayleigh: 0.01,
    mieCoefficient: 0.001,
    mieDirectionalG: 0.55,
    fogColor: [0.003, 0.005, 0.02],   // almost pure black
    fogDensity: 0.028,         // thicker — deeper, darker, more crushing
    sunLightColor: [0.005, 0.01, 0.03],
    sunLightIntensity: 0.002,  // essentially zero
    ambientIntensity: 0.005,   // back to near-zero — fewer creatures
    grassBaseColor: [0.005, 0.005, 0.01],
    grassTipColor: [0.01, 0.01, 0.02],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.01,
    grassTranslucency: 0.0,
    grassFogFade: 0.018,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 1.5,    // dimmer — fewer creatures, but still bright enough to see
    fireflySize: 140,          // smaller — anglerfish lures, not jellyfish bells
    bloomIntensity: 1.3,       // still heavy — lure light is all you have
    bloomThreshold: 0.2,
    fogDepthStrength: 0.18,    // maximum depth fog — can barely see
    fogMidColor: [0.005, 0.008, 0.025],
    fogFarColor: [0.0, 0.003, 0.015],
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.22,  // less saturated — isolation
    colorGradeWarmth: 0.008,   // the FIRST hint of warmth — vents are near
    vignetteDarkness: 0.95,    // crushing darkness — pressure manifest
    grainOpacity: 0.12,        // heaviest grain — pressure artifacts, camera strain
    dustMoteBrightness: 0.4,   // less marine snow this deep
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.06,        // STRONG — pressure warping the lens
    waveWindDirX: 0.05,
    waveWindDirY: 0.999,
    waveWindSpeed: 0.005,
    waveWindStrength: 0.001,   // dead still
    dofFocusDistance: 12,       // focus further out — watching distant lures
    dofBokehScale: 8.0,        // maximum bokeh — lures become soft discs of hope
    splitToneWarm: [0.60, 0.45, 0.35],  // slightly warmer — vents approaching
    splitToneCool: [0.10, 0.38, 0.82],
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
    // The warm amber glow is the emotional resolution:
    // warmth exists even at the bottom of everything.
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: -40,
    sunAzimuth: 180,
    turbidity: 0.5,
    rayleigh: 0.01,
    mieCoefficient: 0.003,     // mineral particles scatter vent light
    mieDirectionalG: 0.55,
    fogColor: [0.01, 0.008, 0.02],    // warmer tint — vent light stains the water
    fogDensity: 0.020,         // slightly clearer — thermal convection clears particles
    sunLightColor: [0.06, 0.04, 0.02], // warm! — vent light, not sun
    sunLightIntensity: 0.06,   // vent glow replaces sun
    ambientIntensity: 0.018,   // warm ambient from vent light — the most light in this world
    grassBaseColor: [0.015, 0.012, 0.01],
    grassTipColor: [0.03, 0.025, 0.02], // warm tint from vent light
    grassWindSpeed: 0.01,      // thermal convection
    grassAmbientStrength: 0.03,
    grassTranslucency: 0.05,
    grassFogFade: 0.012,
    cloudShadowOpacity: 0.0,
    cloudDriftSpeed: 0.0,
    fireflyBrightness: 1.0,    // bioluminescence dims — competition with vent warmth
    fireflySize: 100,          // smaller — overshadowed by vent glow
    bloomIntensity: 1.2,       // still heavy — vent glow blooms warm amber
    bloomThreshold: 0.25,
    fogDepthStrength: 0.12,
    fogMidColor: [0.02, 0.015, 0.025], // warmer purple-brown
    fogFarColor: [0.008, 0.006, 0.018],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.30,  // saturation returns — warmth has color
    colorGradeWarmth: 0.05,    // WARMTH. Finally. The emotional resolution.
    vignetteDarkness: 0.80,    // opens — vent light pushes back the darkness
    grainOpacity: 0.09,
    dustMoteBrightness: 0.7,   // mineral particles in vent plumes — visible in warm glow
    godRayIntensity: 0.0,
    kuwaharaStrength: 0.0,
    caDistortion: 0.045,       // still present — the pressure never fully leaves
    waveWindDirX: 0.0,
    waveWindDirY: 1.0,         // straight up — thermal convection
    waveWindSpeed: 0.03,       // thermal updraft
    waveWindStrength: 0.006,   // gentle upward push
    dofFocusDistance: 4,        // close — intimacy with the vents, the life
    dofBokehScale: 5.5,        // warm bokeh from vent light
    splitToneWarm: [0.85, 0.60, 0.35],  // amber warmth — the resolution
    splitToneCool: [0.25, 0.35, 0.65],  // still cool in shadows — the cold never fully leaves
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
]
