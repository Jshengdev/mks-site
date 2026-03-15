// Paper World atmosphere keyframes — Quiet Contemplation
// Scroll arc: Blank Page → First Crease → Origami Bloom → Inside the Fold → Release
// "The memory of making something with your hands.
//  The reverence of a blank page before the first mark."
//
// The paper world is MONOCHROME. Depth comes from shadow alone.
// SSAO is the hero effect (set at construction, not keyframed).
// These keyframes control: fog density (cream→clear→cream), god rays (light through folds),
// DOF (intimate with paper surface), grain (paper texture), bloom (edge glow).
//
// Unique to this world: no grass, no fireflies. Dust = paper scraps. Petals = cranes.
// The emotional arc is about REVELATION — the blank page gains depth through folding.

export const PAPER_WORLD_KEYFRAMES = [
  {
    t: 0.0, // BLANK PAGE — pure cream void, nothing has happened yet
    // The paper hasn't been touched. You're above it, looking down.
    // Dense cream fog hides everything. A held breath before the first fold.
    rainBrightness: 0.0,
    petalBrightness: 0.0,    // no cranes yet — paper hasn't been folded
    starBrightness: 0.0,
    sunElevation: 25,         // moderate sun — diffuse overcast light
    sunAzimuth: 200,          // behind/left
    turbidity: 10,            // very hazy — diffuse, flat light
    rayleigh: 0.2,            // minimal scattering — cream sky, not blue
    mieCoefficient: 0.008,
    mieDirectionalG: 0.85,
    fogColor: [0.94, 0.92, 0.88],    // dense cream fog — the blank page
    fogDensity: 0.025,                // VERY thick — white void
    sunLightColor: [1.0, 0.97, 0.92], // warm white through paper
    sunLightIntensity: 0.8,
    ambientIntensity: 0.55,           // HIGH — flat, even light on blank paper
    // Grass values (disabled, but AtmosphereController expects them)
    grassBaseColor: [0.96, 0.94, 0.89],
    grassTipColor: [0.98, 0.95, 0.88],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.5,
    grassTranslucency: 0.0,
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.0,          // no shadows yet — blank page
    cloudDriftSpeed: 0.00001,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.05,             // almost nothing — paper doesn't glow
    bloomThreshold: 0.92,
    fogDepthStrength: 0.08,           // strong fog — white void
    fogMidColor: [0.94, 0.92, 0.88],
    fogFarColor: [0.96, 0.94, 0.90],
    colorGradeContrast: 0.01,         // flat — no contrast on blank paper
    colorGradeVibrance: 0.0,          // zero saturation — pure cream
    colorGradeWarmth: 0.02,           // barely warm
    vignetteDarkness: 0.15,           // very light — don't darken white
    grainOpacity: 0.08,               // paper grain visible even at start
    dustMoteBrightness: 0.0,          // no dust yet
    godRayIntensity: 0.0,             // no rays — flat diffuse light
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.0,
    waveWindStrength: 0.0,
    dofFocusDistance: 0,               // no DOF override — looking at flat expanse
    dofBokehScale: 2.0,
    splitToneWarm: [0.98, 0.95, 0.90], // warm cream
    splitToneCool: [0.92, 0.93, 0.96], // cool cream
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 0.25, // FIRST CREASE — the first fold appears, shadows begin to define depth
    // You're descending. The fog thins. Angular peaks emerge from the cream void.
    // The first shadows appear — SSAO catches the fold creases.
    // A soft rustling. The paper is waking up.
    rainBrightness: 0.0,
    petalBrightness: 0.1,    // first paper scraps lifting
    starBrightness: 0.0,
    sunElevation: 22,
    sunAzimuth: 210,
    turbidity: 8,
    rayleigh: 0.25,
    mieCoefficient: 0.006,
    mieDirectionalG: 0.88,
    fogColor: [0.93, 0.91, 0.86],    // fog thinning — cream clearing
    fogDensity: 0.012,                // clearing — folds becoming visible
    sunLightColor: [1.0, 0.97, 0.92],
    sunLightIntensity: 1.0,           // light increasing — shadows deepen
    ambientIntensity: 0.48,           // still high — paper is evenly lit
    grassBaseColor: [0.96, 0.94, 0.89],
    grassTipColor: [0.98, 0.95, 0.88],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.5,
    grassTranslucency: 0.0,
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.03,         // first hints of moving shadow
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.10,             // paper edges catching light
    bloomThreshold: 0.88,
    fogDepthStrength: 0.06,
    fogMidColor: [0.93, 0.91, 0.86],
    fogFarColor: [0.94, 0.92, 0.88],
    colorGradeContrast: 0.03,         // shadows deepening
    colorGradeVibrance: 0.02,         // still almost monochrome
    colorGradeWarmth: 0.04,           // warming slightly
    vignetteDarkness: 0.20,           // subtle framing
    grainOpacity: 0.10,               // paper grain more visible
    dustMoteBrightness: 0.3,          // paper scraps drifting
    godRayIntensity: 0.15,            // first god rays through fold gaps
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.3,
    waveWindDirY: 0.7,
    waveWindSpeed: 0.2,
    waveWindStrength: 0.0,
    dofFocusDistance: 8,               // focusing on emerging peaks
    dofBokehScale: 3.0,
    splitToneWarm: [0.98, 0.94, 0.88],
    splitToneCool: [0.91, 0.92, 0.95],
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 0.50, // ORIGAMI BLOOM — the landscape fully unfolds, peak geometric complexity
    // You're among the peaks now. The paper world is fully formed.
    // Light streams between the angular folds — god rays at their strongest.
    // Paper cranes drift upward from the creases. The act of folding IS creation.
    rainBrightness: 0.0,
    petalBrightness: 0.6,    // paper cranes taking flight — peak count
    starBrightness: 0.0,
    sunElevation: 20,         // angled light — maximum shadow definition
    sunAzimuth: 220,          // shifted — shadows fall across the folds
    turbidity: 6,             // clearer sky — you can see the full landscape
    rayleigh: 0.3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.90,
    fogColor: [0.92, 0.90, 0.85],    // cream clearing further
    fogDensity: 0.005,                // thin — see the full origami field
    sunLightColor: [1.0, 0.96, 0.90],
    sunLightIntensity: 1.3,           // strong — crisp fold shadows
    ambientIntensity: 0.42,           // reduced slightly — shadows matter more now
    grassBaseColor: [0.96, 0.94, 0.89],
    grassTipColor: [0.98, 0.95, 0.88],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.45,
    grassTranslucency: 0.0,
    grassFogFade: 0.003,
    cloudShadowOpacity: 0.06,         // gentle cloud shadows crossing the paper
    cloudDriftSpeed: 0.00005,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.18,             // peak paper edge glow
    bloomThreshold: 0.82,
    fogDepthStrength: 0.04,
    fogMidColor: [0.92, 0.90, 0.85],
    fogFarColor: [0.93, 0.91, 0.86],
    colorGradeContrast: 0.06,         // shadows have depth — folds read clearly
    colorGradeVibrance: 0.05,         // tiny hint of warmth in the shadows
    colorGradeWarmth: 0.08,           // warm — the act of creation is warm
    vignetteDarkness: 0.22,
    grainOpacity: 0.12,               // peak paper grain — you feel the texture
    dustMoteBrightness: 0.5,          // paper confetti in the light beams
    godRayIntensity: 0.45,            // PEAK — light streaming through fold gaps
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.5,
    waveWindDirY: 0.5,
    waveWindSpeed: 0.3,
    waveWindStrength: 0.0,
    dofFocusDistance: 5,               // close focus — intimate with the surface
    dofBokehScale: 4.0,               // moderate bokeh — peaks blur behind
    splitToneWarm: [0.98, 0.93, 0.85], // warm amber in shadow
    splitToneCool: [0.90, 0.92, 0.96], // cool highlight
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 0.75, // INSIDE THE FOLD — camera descends into a valley between paper walls
    // The most intimate moment. You're INSIDE the paper. Walls of cream rise around you.
    // Shadows are deepest. The fold IS the embrace. Light is a slit above.
    // This is where contemplation becomes reverence.
    rainBrightness: 0.0,
    petalBrightness: 0.35,   // fewer cranes — they're above you now
    starBrightness: 0.0,
    sunElevation: 18,
    sunAzimuth: 230,          // sun at angle — deep valley shadows
    turbidity: 7,
    rayleigh: 0.25,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.88,
    fogColor: [0.90, 0.88, 0.83],    // slightly warmer — enclosed, intimate
    fogDensity: 0.008,                // denser inside the fold — enclosed
    sunLightColor: [1.0, 0.95, 0.88], // warmer — light filtering through paper
    sunLightIntensity: 0.9,           // reduced — less direct light in the valley
    ambientIntensity: 0.38,           // lower — the fold casts shadow
    grassBaseColor: [0.96, 0.94, 0.89],
    grassTipColor: [0.98, 0.95, 0.88],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.4,
    grassTranslucency: 0.0,
    grassFogFade: 0.004,
    cloudShadowOpacity: 0.04,
    cloudDriftSpeed: 0.00003,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.12,             // reduced — enclosed space
    bloomThreshold: 0.85,
    fogDepthStrength: 0.06,           // fog returns — enclosed
    fogMidColor: [0.90, 0.88, 0.83],
    fogFarColor: [0.91, 0.89, 0.84],
    colorGradeContrast: 0.08,         // DEEPEST contrast — fold shadows are strong
    colorGradeVibrance: 0.06,         // warm shadows have subtle color
    colorGradeWarmth: 0.12,           // PEAK warmth — inside the fold is warm
    vignetteDarkness: 0.35,           // PEAK — enclosed, intimate framing
    grainOpacity: 0.14,               // PEAK grain — you can almost feel the paper
    dustMoteBrightness: 0.4,          // scraps catching the slit of light above
    godRayIntensity: 0.30,            // god rays from the slit above
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.2,
    waveWindDirY: 0.8,
    waveWindSpeed: 0.15,
    waveWindStrength: 0.0,
    // DOF — MOST intimate, closest focus = peak contemplation
    dofFocusDistance: 3,               // very close — texture of the paper
    dofBokehScale: 5.5,               // heavy bokeh — world abstracts around you
    splitToneWarm: [0.97, 0.91, 0.82], // warm amber in fold shadows — earned warmth
    splitToneCool: [0.88, 0.90, 0.94], // cool highlights above
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
  {
    t: 1.0, // RELEASE — rising back up, paper relaxes, light floods in
    // The fold releases you. You rise back above the paper landscape.
    // The folds are still there but the fog is returning — softening everything.
    // The paper is at peace. It doesn't need to be anything other than paper.
    // The act of making was the point, not the result.
    rainBrightness: 0.0,
    petalBrightness: 0.15,   // last cranes drifting away
    starBrightness: 0.0,
    sunElevation: 28,         // higher sun — flood of even light
    sunAzimuth: 240,
    turbidity: 9,             // hazier — returning to diffuse
    rayleigh: 0.2,
    mieCoefficient: 0.006,
    mieDirectionalG: 0.85,
    fogColor: [0.94, 0.92, 0.88],    // returning to cream void
    fogDensity: 0.018,                // fog returning — the world softens
    sunLightColor: [1.0, 0.97, 0.93],
    sunLightIntensity: 1.0,
    ambientIntensity: 0.52,           // HIGH — even, peaceful light
    grassBaseColor: [0.96, 0.94, 0.89],
    grassTipColor: [0.98, 0.95, 0.88],
    grassWindSpeed: 0.0,
    grassAmbientStrength: 0.5,
    grassTranslucency: 0.0,
    grassFogFade: 0.005,
    cloudShadowOpacity: 0.02,
    cloudDriftSpeed: 0.00002,
    fireflyBrightness: 0.0,
    fireflySize: 25,
    bloomIntensity: 0.08,             // gentle glow — peace
    bloomThreshold: 0.90,
    fogDepthStrength: 0.07,           // strong fog — world fading gently
    fogMidColor: [0.94, 0.92, 0.88],
    fogFarColor: [0.95, 0.93, 0.89],
    colorGradeContrast: 0.02,         // flattening — shadows releasing
    colorGradeVibrance: 0.02,         // almost monochrome again
    colorGradeWarmth: 0.05,           // residual warmth — you carry it
    vignetteDarkness: 0.18,           // light — open, released
    grainOpacity: 0.09,               // settling back to resting grain
    dustMoteBrightness: 0.15,         // last scraps settling
    godRayIntensity: 0.08,            // fading — diffuse light returns
    kuwaharaStrength: 0.0,
    waveWindDirX: 0.0,
    waveWindDirY: 0.0,
    waveWindSpeed: 0.1,
    waveWindStrength: 0.0,
    dofFocusDistance: 20,              // wide focus — taking it all in one last time
    dofBokehScale: 2.5,               // light bokeh — everything softly clear
    splitToneWarm: [0.96, 0.94, 0.90], // neutral cream — at peace
    splitToneCool: [0.92, 0.93, 0.95], // cool cream — returned to origin
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,
  },
]
