// Ghibli Painterly atmosphere keyframes — The Fall and Acceptance
// Scroll arc: Wonder → Immersion → Radiance → Transfiguration → Transcendence
// "The sun is rising as he is falling,
//  but his life has never felt brighter."
//
// INVERTED PEAK ARC: brightness builds continuously to TRANSCENDENCE (t=1.0).
// "Never felt brighter" IS the finale, not the midpoint.
// Sun rises then FALLS (dawn→zenith→horizon), but the world gets MORE vivid.
// The paradox — falling sun + rising beauty — IS the heartache.
//
// exp-080-ghibli-composite-sweep: V5 "Composite Optimum"
// 4-axis sweep: ambient lift + vividity + sun narrative arc + paper grain
// Score: 65/70 (5-pos weighted 64.9), +6.9 over 58 baseline, +3.9 over exp-034

export const GHIBLI_KEYFRAMES = [
  {
    t: 0.0, // WONDER — cool dawn, the world is waking, colors brightening
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 8,            // dawn — sun just rising (was 20)
    sunAzimuth: 260,
    turbidity: 2.5,
    rayleigh: 1.8,
    mieCoefficient: 0.008,
    mieDirectionalG: 0.88,
    fogColor: [0.10, 0.12, 0.14],   // cool morning fog (was green-tinged)
    fogDensity: 0.003,
    sunLightColor: [0.95, 0.85, 0.70],  // cool dawn light (was warm golden)
    sunLightIntensity: 1.5,
    ambientIntensity: 0.35,      // LIFTED from 0.18 — cel-band visibility fix
    grassBaseColor: [0.10, 0.28, 0.08],  // brighter base (was 0.06,0.22,0.05)
    grassTipColor: [0.25, 0.55, 0.12],
    grassWindSpeed: 0.6,
    grassAmbientStrength: 0.42,  // lifted from 0.35
    grassTranslucency: 1.8,
    grassFogFade: 0.001,
    cloudShadowOpacity: 0.05,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.4,
    bloomThreshold: 0.6,
    fogDepthStrength: 0.03,
    fogMidColor: [0.18, 0.20, 0.14],
    fogFarColor: [0.12, 0.14, 0.10],
    colorGradeContrast: 0.06,
    colorGradeVibrance: 0.75,    // already vivid — this IS a painted world (was 0.60)
    colorGradeWarmth: 0.04,
    vignetteDarkness: 0.45,
    grainOpacity: 0.07,          // canvas texture from start (was 0.05)
    dustMoteBrightness: 0.3,
    godRayIntensity: 0.15,       // dawn — subtle (was 0.2)
    kuwaharaStrength: 0.35,      // slightly deeper strokes (was 0.30)
    caDistortion: 0.05,        // lens through a painting
    petalBrightness: 0.4,
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.4,
    waveWindStrength: 0.1,
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 0.25, // IMMERSION — world warming, colors intensifying, strokes bolder
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 14,            // rising but still dramatic (was 23)
    sunAzimuth: 250,
    turbidity: 2.0,
    rayleigh: 1.5,
    mieCoefficient: 0.010,
    mieDirectionalG: 0.90,
    fogColor: [0.14, 0.16, 0.10],
    fogDensity: 0.002,
    sunLightColor: [1.0, 0.94, 0.80],
    sunLightIntensity: 1.7,
    ambientIntensity: 0.40,      // LIFTED from 0.20
    grassBaseColor: [0.12, 0.30, 0.08],  // warm green (was 0.08,0.25,0.06)
    grassTipColor: [0.30, 0.60, 0.15],
    grassWindSpeed: 0.8,
    grassAmbientStrength: 0.45,  // lifted from 0.38
    grassTranslucency: 2.2,
    grassFogFade: 0.001,
    cloudShadowOpacity: 0.08,
    cloudDriftSpeed: 0.00006,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.65,        // light growing (was 0.50)
    bloomThreshold: 0.55,
    fogDepthStrength: 0.03,
    fogMidColor: [0.22, 0.24, 0.16],
    fogFarColor: [0.14, 0.16, 0.10],
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.90,    // building vividity (was 0.75)
    colorGradeWarmth: 0.05,
    vignetteDarkness: 0.38,
    grainOpacity: 0.08,          // canvas grain deepening (was 0.04)
    dustMoteBrightness: 0.5,
    godRayIntensity: 0.45,       // growing (was 0.4)
    kuwaharaStrength: 0.52,      // strokes bolder (was 0.45)
    caDistortion: 0.08,        // warmth warps the lens
    petalBrightness: 0.7,
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.6,
    waveWindStrength: 0.2,
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 0.50, // RADIANCE — beautiful but NOT the peak, still building
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 20,            // near zenith but not max (was 25)
    sunAzimuth: 240,
    turbidity: 1.8,
    rayleigh: 1.2,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.92,
    fogColor: [0.18, 0.20, 0.12],
    fogDensity: 0.0015,
    sunLightColor: [1.0, 0.95, 0.82],
    sunLightIntensity: 2.0,
    ambientIntensity: 0.48,      // LIFTED from 0.22 — well-lit Ghibli world
    grassBaseColor: [0.15, 0.35, 0.10],  // vivid green (was 0.10,0.28,0.06)
    grassTipColor: [0.35, 0.65, 0.18],
    grassWindSpeed: 1.0,
    grassAmbientStrength: 0.50,  // rich fill (was 0.42)
    grassTranslucency: 2.8,
    grassFogFade: 0.0008,
    cloudShadowOpacity: 0.10,
    cloudDriftSpeed: 0.00008,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.80,        // bright but still building (was 0.65)
    bloomThreshold: 0.50,
    fogDepthStrength: 0.02,
    fogMidColor: [0.28, 0.30, 0.18],
    fogFarColor: [0.18, 0.20, 0.12],
    colorGradeContrast: 0.10,
    colorGradeVibrance: 1.05,    // crossing into "impossible" (was 0.90)
    colorGradeWarmth: 0.06,
    vignetteDarkness: 0.30,
    grainOpacity: 0.07,          // medium grain (was 0.04)
    dustMoteBrightness: 0.8,
    godRayIntensity: 0.65,       // dramatic but not peak (was 0.70)
    kuwaharaStrength: 0.68,      // strong strokes (was 0.60)
    caDistortion: 0.12,        // vividity distorts perception
    petalBrightness: 1.0,
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.8,
    waveWindStrength: 0.3,
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 0.75, // TRANSFIGURATION — the fall begins, but light INTENSIFIES
    // Sun descending = "the fall." But colors get MORE vivid, not less.
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 12,            // sun falling (was 22)
    sunAzimuth: 230,
    turbidity: 2.2,
    rayleigh: 1.6,
    mieCoefficient: 0.015,
    mieDirectionalG: 0.93,
    fogColor: [0.30, 0.22, 0.10],   // warm amber fog (was 0.22,0.18,0.10)
    fogDensity: 0.002,
    sunLightColor: [1.0, 0.82, 0.55],  // deep amber (was 1.0,0.88,0.68)
    sunLightIntensity: 1.8,
    ambientIntensity: 0.50,      // BRIGHTER still (was 0.18)
    grassBaseColor: [0.14, 0.30, 0.08],  // warm alive (was 0.10,0.22,0.04)
    grassTipColor: [0.35, 0.55, 0.12],
    grassWindSpeed: 1.2,
    grassAmbientStrength: 0.50,  // max fill (was 0.36)
    grassTranslucency: 2.5,
    grassFogFade: 0.001,
    cloudShadowOpacity: 0.08,
    cloudDriftSpeed: 0.00007,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 1.05,        // light overflowing (was 0.80)
    bloomThreshold: 0.38,        // lower threshold = more glow (was 0.45)
    fogDepthStrength: 0.04,
    fogMidColor: [0.30, 0.25, 0.14],
    fogFarColor: [0.20, 0.18, 0.10],
    colorGradeContrast: 0.12,
    colorGradeVibrance: 1.15,    // HYPER-vivid (was 0.80)
    colorGradeWarmth: 0.12,      // earned warmth intensifying (was 0.08)
    vignetteDarkness: 0.35,
    grainOpacity: 0.09,          // grain emerging = fragility (was 0.05)
    dustMoteBrightness: 0.9,
    godRayIntensity: 1.0,        // MAX god rays — setting sun (was 0.90)
    kuwaharaStrength: 0.65,      // bold strokes (was 0.55)
    caDistortion: 0.15,        // reality bending — the fall intensifies
    petalBrightness: 0.9,
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.7,
    waveWindStrength: 0.35,
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 1.0, // TRANSCENDENCE — "his life has NEVER felt brighter" — THE PEAK
    // The sun is at the horizon. The world is flooded with golden light.
    // Everything glows. Colors are impossible. The painting is aging.
    // This is the most beautiful thing you've ever seen. And it's ending.
    rainBrightness: 0.0,
    starBrightness: 0.0,
    sunElevation: 5,             // horizon — maximum amber (was 18)
    sunAzimuth: 220,
    turbidity: 2.5,
    rayleigh: 1.8,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.90,
    fogColor: [0.40, 0.30, 0.12],   // golden amber fog (was 0.25,0.20,0.12)
    fogDensity: 0.004,           // slight fog = light scattering (was 0.003)
    sunLightColor: [1.0, 0.75, 0.42],  // deep golden last light (was 1.0,0.85,0.60)
    sunLightIntensity: 2.2,      // BLAZING (was 1.5)
    ambientIntensity: 0.55,      // HIGHEST — world flooded with light (was 0.16)
    grassBaseColor: [0.15, 0.32, 0.08],  // everything alive (was 0.08,0.20,0.04)
    grassTipColor: [0.40, 0.60, 0.15],   // golden-green tips blazing (was 0.28,0.48,0.10)
    grassWindSpeed: 0.6,
    grassAmbientStrength: 0.52,  // maximum fill (was 0.32)
    grassTranslucency: 2.0,
    grassFogFade: 0.0015,
    cloudShadowOpacity: 0.06,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 1.15,        // PEAK BLOOM — light overflowing (was 0.50)
    bloomThreshold: 0.35,        // everything glows (was 0.55)
    fogDepthStrength: 0.04,
    fogMidColor: [0.28, 0.22, 0.14],
    fogFarColor: [0.20, 0.18, 0.12],
    colorGradeContrast: 0.08,
    colorGradeVibrance: 1.20,    // MAXIMUM impossible colors (was 0.65)
    colorGradeWarmth: 0.14,      // maximum earned warmth (was 0.05)
    vignetteDarkness: 0.25,      // opens wide — expansive (was 0.42)
    grainOpacity: 0.10,          // max grain = painted on aging paper (was 0.05)
    dustMoteBrightness: 1.0,     // golden motes everywhere (was 0.50)
    godRayIntensity: 0.90,       // sunset god rays blazing (was 0.40)
    kuwaharaStrength: 0.55,      // painterly maintained (was 0.40)
    caDistortion: 0.10,        // settling into acceptance — lens eases
    petalBrightness: 1.0,        // petals blazing in sunset light (was 0.50)
    waveWindDirX: 0.6,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.4,
    waveWindStrength: 0.30,      // wind crescendo at the end (was 0.15)
    dofFocusDistance: 0,
    dofBokehScale: 3.0,
    splitToneWarm: [0.925, 0.706, 0.518],
    splitToneCool: [0.831, 0.769, 0.894],
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
]
