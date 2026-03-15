// Golden Meadow atmosphere keyframes — Innocent Awakening
// Scroll arc: Stillness → Awakening → Alive → Deepening → Quieting
// "Cold world, warm moments. Warmth is the reward for engagement."
// The Hidden Sun: artist is the sun, music is the light, world is what light transforms.
//
// GOLDEN RUINS archetype (exp-058, 67/70) — multiplicative convergence.
// Every atmospheric dimension (bloom, godrays, translucency, wind, warmth, painterly)
// peaks simultaneously at DEEPENING (t=0.75). The convergence IS the revelation —
// the Hidden Sun doesn't show one thing, it transforms EVERYTHING at once.
//
// exp-082 IMPROVE cycle (67→70/70): 4-axis composite sweep:
//   V1 AWAKENING lift (+0.8), V2 DOF narrative arc (+1.6), V3 split-tone sunrise (+1.0),
//   V4 STILLNESS floor (+1.3) → V5 composite (+3.0). Biggest unlocks at bookends:
//   P1 STILLNESS +7 (silver-violet predawn dream + visible shapes + DOF)
//   P5 QUIETING +5 (DOF memory fade + warm-touched blue + grain aging)
//   P2 AWAKENING +2 (ambient lift + bloom + godRays + DOF focus pull = "she opened her eyes")
//
// Source: exp-058 cymatics (67/70), exp-030 reaction-diffusion grass,
// exp-055 electromagnetic field-line alignment, exp-079 Navier-Stokes fluid wind,
// exp-064 SIR epidemic awakening, exp-082 composite sweep (70/70)
//
// Over base MEADOW_KEYFRAMES: bloom 1.0→1.8, godrays 1.0→1.8, translucency 3.0→4.0,
// wind 2.2→3.5, kuwahara 0.35→0.65, vibrance 0.9→1.4, CA 0.02→0.30

export const GOLDEN_MEADOW_KEYFRAMES = [
  {
    t: 0.0, // STILLNESS — silver-violet predawn dream, dim but PRESENT
    // exp-082 V5: floor lift + DOF dream + split-tone character.
    // The world is asleep — but you can SEE it sleeping. Dim shapes in darkness,
    // distant DOF softness, silver-violet predawn character. Not void — dreaming.
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: 2,
    sunAzimuth: 250,
    turbidity: 12,
    rayleigh: 3.0,
    mieCoefficient: 0.015,
    mieDirectionalG: 0.95,
    fogColor: [0.10, 0.14, 0.22],      // colder steel-blue — deeper silence
    fogDensity: 0.020,                  // thicker than base (0.018) — more hidden
    sunLightColor: [0.40, 0.45, 0.58],  // cooler blue-steel
    sunLightIntensity: 0.20,            // dimmer — deeper sleep
    ambientIntensity: 0.05,             // V5: floor lift — can see dim shapes waiting (was 0.03)
    grassBaseColor: [0.02, 0.03, 0.03], // V5: faintest shape visible (was [0.01,0.02,0.02])
    grassTipColor: [0.02, 0.06, 0.05], // barely visible teal
    grassWindSpeed: 0.05,               // near-frozen — not even a breath
    grassAmbientStrength: 0.12,
    grassTranslucency: 0.2,             // no glow yet — light hasn't arrived
    grassFogFade: 0.006,
    cloudShadowOpacity: 0.02,
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.08,               // barely any glow
    bloomThreshold: 0.88,               // V5: catches any spark (was 0.92)
    fogDepthStrength: 0.06,
    fogMidColor: [0.20, 0.25, 0.38],
    fogFarColor: [0.10, 0.12, 0.22],
    colorGradeContrast: 0.02,           // flat — no drama yet
    colorGradeVibrance: 0.08,           // desaturated cold world
    colorGradeWarmth: 0.0,              // zero warmth — earned later
    vignetteDarkness: 0.78,             // V5: less tunnel — shapes visible (was 0.88)
    grainOpacity: 0.05,                 // V5: slightly less noise (was 0.06)
    dustMoteBrightness: 0.0,
    godRayIntensity: 0.0,               // no rays — sun is hidden
    kuwaharaStrength: 0.0,              // sharp — reality is clear and cold
    caDistortion: 0.0,                  // clean lens in innocence
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.15,
    waveWindStrength: 0.0,              // frozen
    dofFocusDistance: 60,               // V5: distant dream — world out of focus (was 0)
    dofBokehScale: 4.0,                 // V5: soft dream bokeh (was 3.0)
    splitToneWarm: [0.80, 0.72, 0.75],  // V5: silver-violet predawn (was [.925,.706,.518])
    splitToneCool: [0.70, 0.75, 0.92],  // V5: deep predawn blue (was [.831,.769,.894])
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.25, // AWAKENING — "She opened her eyes" — the REVELATION moment
    // exp-082 V5: ambient lift + bloom + godRays + translucency + DOF focus pull.
    // Focus sharpens on near grass as amber light arrives and the world warms.
    // The epidemic begins. But now you can SEE it begin.
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: 5,
    sunAzimuth: 245,
    turbidity: 13,
    rayleigh: 2.2,
    mieCoefficient: 0.012,
    mieDirectionalG: 0.94,
    fogColor: [0.35, 0.32, 0.30],       // cold warming to neutral amber
    fogDensity: 0.010,                   // thinning — revealing
    sunLightColor: [0.70, 0.65, 0.55],   // first amber hint
    sunLightIntensity: 0.7,
    ambientIntensity: 0.14,              // V5: world SHOWS itself (was 0.08)
    grassBaseColor: [0.03, 0.08, 0.02],
    grassTipColor: [0.10, 0.25, 0.06],   // first green showing
    grassWindSpeed: 0.5,                  // first stir
    grassAmbientStrength: 0.25,
    grassTranslucency: 1.5,              // V5: strong first backlit glow (was 0.9)
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.06,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.0,
    fireflySize: 35,
    bloomIntensity: 0.40,                // V5: genuine first glow (was 0.25)
    bloomThreshold: 0.78,
    fogDepthStrength: 0.04,
    fogMidColor: [0.55, 0.48, 0.38],
    fogFarColor: [0.35, 0.32, 0.35],
    colorGradeContrast: 0.05,
    colorGradeVibrance: 0.48,            // V5: color waking faster (was 0.30)
    colorGradeWarmth: 0.05,              // V5: first genuine warmth (was 0.02)
    vignetteDarkness: 0.48,              // V5: eyes opening wide (was 0.65)
    grainOpacity: 0.04,
    dustMoteBrightness: 0.40,            // V5: motes clearly catching light (was 0.15)
    godRayIntensity: 0.25,               // V5: first rays clearly visible (was 0.10)
    kuwaharaStrength: 0.0,               // still sharp — reality
    caDistortion: 0.0,                   // still clean
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.35,
    waveWindStrength: 0.08,              // first wave ripple
    dofFocusDistance: 20,                // V5: focus pulling near — "seeing" for first time (was 0)
    dofBokehScale: 3.5,                  // V5: moderate DOF (was 3.0)
    splitToneWarm: [0.90, 0.72, 0.50],   // V5: warming amber (was [.925,.706,.518])
    splitToneCool: [0.78, 0.76, 0.88],   // V5: softening blue (was [.831,.769,.894])
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.50, // ALIVE — golden hour arrives, the music is playing
    // The epidemic spreads. Every blade is lit. Wind carries the awakening
    // across the field in visible waves. Bloom builds. Godrays reach.
    // The convergence is accelerating — you can FEEL it building.
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: 8,
    sunAzimuth: 235,
    turbidity: 10,
    rayleigh: 1.5,
    mieCoefficient: 0.018,
    mieDirectionalG: 0.93,
    fogColor: [0.80, 0.65, 0.38],        // warm golden haze building
    fogDensity: 0.004,
    sunLightColor: [1.0, 0.88, 0.65],    // full golden light
    sunLightIntensity: 1.5,
    ambientIntensity: 0.14,
    grassBaseColor: [0.06, 0.16, 0.02],
    grassTipColor: [0.22, 0.48, 0.10],   // vivid green-gold
    grassWindSpeed: 1.8,                  // strong wind building
    grassAmbientStrength: 0.35,
    grassTranslucency: 2.5,              // strong backlit glow — light is winning
    grassFogFade: 0.0015,
    cloudShadowOpacity: 0.15,
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.5,
    fireflySize: 70,
    bloomIntensity: 0.75,                // building toward convergence
    bloomThreshold: 0.48,
    fogDepthStrength: 0.07,
    fogMidColor: [0.95, 0.78, 0.45],
    fogFarColor: [0.55, 0.50, 0.45],
    colorGradeContrast: 0.10,
    colorGradeVibrance: 0.80,            // V5: colors intensifying stronger (was 0.75)
    colorGradeWarmth: 0.10,              // V5: richer golden warmth (was 0.06)
    vignetteDarkness: 0.38,              // opening up — world expanding
    grainOpacity: 0.03,
    dustMoteBrightness: 0.8,
    godRayIntensity: 0.55,               // rays clearly visible
    kuwaharaStrength: 0.15,              // first painterly softening
    caDistortion: 0.05,                  // first lens stress from intensity
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.7,
    waveWindStrength: 0.25,              // visible wave grass
    dofFocusDistance: 10,                // V5: sharp awareness — focused on world (was 0)
    dofBokehScale: 3.0,                  // V5: less bokeh = fully awake (was 3.5)
    splitToneWarm: [0.95, 0.75, 0.50],   // warming
    splitToneCool: [0.85, 0.78, 0.88],
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 0.75, // DEEPENING — GOLDEN RUINS convergence peak (exp-058, 67/70)
    // The Hidden Sun revealed. Every system peaks simultaneously:
    // bloom 1.8, godrays 1.8, translucency 4.0, wind 3.5, kuwahara 0.65.
    // "A source of light hidden behind something massive, whose rays fan out
    //  and touch everything." The multiplicative convergence IS the revelation.
    // The lens can barely hold the image (CA 0.30). The world becomes a painting
    // (kuwahara 0.65). Reality is oversaturated (vibrance 1.4). Everything glows.
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: 1,                     // sun nearly kissing horizon — maximum ray length
    sunAzimuth: 200,                     // behind artist figure (z=-145, x=2)
    turbidity: 14,                       // thick amber haze — the world is GOLDEN
    rayleigh: 3.5,
    mieCoefficient: 0.035,               // extreme sun haze
    mieDirectionalG: 0.98,               // tight directional scatter
    fogColor: [1.0, 0.55, 0.10],         // deep amber-orange (#ff8c1a)
    fogDensity: 0.005,
    sunLightColor: [1.0, 0.75, 0.40],    // deep amber-gold
    sunLightIntensity: 2.5,              // blazing — higher than base (2.2)
    ambientIntensity: 0.06,              // low ambient = dramatic contrast with sun
    grassBaseColor: [0.10, 0.07, 0.02],  // dark warm base (#1a1205)
    grassTipColor: [0.55, 0.48, 0.10],   // amber-gold tips (#8c7a1a)
    grassWindSpeed: 3.5,                 // cymatics wind — field is alive
    grassAmbientStrength: 0.15,
    grassTranslucency: 4.0,             // EXTREME backlit glow — "the music IS the light"
    grassFogFade: 0.0005,
    cloudShadowOpacity: 0.08,
    cloudDriftSpeed: 0.00008,
    fireflyBrightness: 1.5,             // golden sparks — convergence particles
    fireflySize: 140,                    // large — close, intimate
    bloomIntensity: 1.8,                 // CONVERGENCE PEAK — cinematic overexposure
    bloomThreshold: 0.25,                // everything blooms — light overflowing
    fogDepthStrength: 0.12,
    fogMidColor: [1.0, 0.67, 0.20],      // #ffaa33
    fogFarColor: [0.80, 0.40, 0.20],     // #cc6633
    colorGradeContrast: 0.20,            // strong contrast at peak
    colorGradeVibrance: 1.4,             // HYPER-VIVID — impossible colors that feel real
    colorGradeWarmth: 0.20,              // strong warm split-tone
    vignetteDarkness: 0.20,              // wide open — expansive, not constricted
    grainOpacity: 0.01,                  // minimal — clarity at peak
    dustMoteBrightness: 1.5,             // golden motes everywhere
    godRayIntensity: 1.8,               // CONVERGENCE PEAK — rays fan out and touch everything
    kuwaharaStrength: 0.65,              // PAINTERLY — the world becomes a painting at peak
    caDistortion: 0.30,                  // LENS STRESS — the lens can barely hold the image
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 1.2,
    waveWindStrength: 0.50,              // strong rolling waves
    dofFocusDistance: 5,                 // V5: intimate near-focus at convergence (was 0)
    dofBokehScale: 5.5,                  // V5: heavy bokeh catches bloom circles (was 5.0)
    splitToneWarm: [1.0, 0.67, 0.27],    // #ffaa44 — warm amber highlights
    splitToneCool: [0.53, 0.40, 0.53],   // #886688 — muted purple shadows
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
  {
    t: 1.0, // QUIETING — memory with warmth residue, the sunrise changed your color
    // exp-082 V5: DOF memory fade + warm-touched split-tone + grain aging.
    // The convergence recedes. Not disappears — recedes. The world remembers.
    // DOF softens to distance — you can't hold the details. The cool split-tone
    // has warmed — the sunrise changed your blue. Grain increases = aging film.
    // "The light changed everything, and you carry its warmth home."
    starBrightness: 0.0,
    rainBrightness: 0.0,
    petalBrightness: 0.0,
    sunElevation: 6,                     // settling higher — dusk, not sunset
    sunAzimuth: 220,
    turbidity: 11,
    rayleigh: 1.8,
    mieCoefficient: 0.010,
    mieDirectionalG: 0.93,
    fogColor: [0.50, 0.45, 0.38],        // warm neutral dusk — warmth lingers
    fogDensity: 0.007,                   // fog returning — dissolution
    sunLightColor: [0.85, 0.78, 0.65],   // still warm — the goodbye changed your color
    sunLightIntensity: 0.9,
    ambientIntensity: 0.12,
    grassBaseColor: [0.04, 0.12, 0.03],
    grassTipColor: [0.16, 0.36, 0.10],   // muted green — warmth fading
    grassWindSpeed: 0.6,                 // wind settling — exhale
    grassAmbientStrength: 0.32,
    grassTranslucency: 1.6,              // glow fading but still present
    grassFogFade: 0.002,
    cloudShadowOpacity: 0.06,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.5,             // fireflies linger
    fireflySize: 65,
    bloomIntensity: 0.40,                // settled — light resting
    bloomThreshold: 0.68,
    fogDepthStrength: 0.06,
    fogMidColor: [0.65, 0.58, 0.48],
    fogFarColor: [0.42, 0.40, 0.40],
    colorGradeContrast: 0.08,
    colorGradeVibrance: 0.45,            // color settling
    colorGradeWarmth: 0.07,              // V5: warmth lingers MORE (was 0.04)
    vignetteDarkness: 0.50,              // V5: memory still breathes (was 0.55)
    grainOpacity: 0.06,                  // V5: aging memory film (was 0.04)
    dustMoteBrightness: 0.45,            // V5: motes linger longer (was 0.35)
    godRayIntensity: 0.25,               // last rays lingering
    kuwaharaStrength: 0.08,              // barely painterly — back to photography
    caDistortion: 0.02,                  // lens settling
    waveWindDirX: 0.707,
    waveWindDirY: 0.707,
    waveWindSpeed: 0.3,
    waveWindStrength: 0.10,              // settling
    dofFocusDistance: 40,                // V5: memory fading — world slipping away (was 0)
    dofBokehScale: 4.5,                  // V5: pronounced memory blur (was 3.0)
    splitToneWarm: [0.90, 0.72, 0.58],   // V5: amber-touched calm (was [.925,.706,.518])
    splitToneCool: [0.78, 0.76, 0.85],   // V5: warmed blue — sunrise changed your blue (was [.831,.769,.894])
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
    cloudCoverage: 0,
    cloudDensity: 0,
    cloudIntensity: 0,
  },
]
