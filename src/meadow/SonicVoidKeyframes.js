// Sonic Void atmosphere keyframes — Pure Presence
// Scroll arc: Silence → Emergence → Convergence → Dissolution → Echo
// "The moment you stop being a person listening to music
//  and become the sound itself."
//
// UNIQUE: These keyframes drive audio-reactive geometry visibility,
// not natural atmosphere. The void has no sun, no grass, no ocean.
// What changes is HOW MUCH sound-geometry the viewer can see,
// and how the post-FX shape the void around it.
//
// Audio geometry params (bassSphereOpacity, melodyRibbonOpacity, etc.)
// are interpolated by AtmosphereController.current but NOT auto-wired.
// WorldEngine._tick() must read atmosphere.current and apply them
// to BassSphereSystem, MelodyRibbonSystem, HarmonyCrystalSystem
// when those subsystems are built.

export const SONIC_VOID_KEYFRAMES = [
  {
    t: 0.0, // SILENCE — the void before sound. Nothing exists yet.
    // Just the faintest particles drifting. A held breath in empty space.
    // The viewer is alone with the darkness.

    // ── Standard atmosphere (all zeroed/minimal — no nature) ──
    sunElevation: -90,
    sunAzimuth: 0,
    turbidity: 0,
    rayleigh: 0,
    mieCoefficient: 0,
    mieDirectionalG: 0,
    fogColor: [0.02, 0.02, 0.03],    // near-black blue
    fogDensity: 0.0008,               // minimal — void is clear
    sunLightColor: [0.10, 0.10, 0.15],
    sunLightIntensity: 0.05,
    ambientIntensity: 0.01,           // near-total darkness

    // Zeroed nature params (must be present for PARAM_KEYS)
    grassBaseColor: [0, 0, 0],
    grassTipColor: [0, 0, 0],
    grassWindSpeed: 0,
    grassAmbientStrength: 0,
    grassTranslucency: 0,
    grassFogFade: 0,
    cloudShadowOpacity: 0,
    cloudDriftSpeed: 0,
    fireflyBrightness: 0,
    fireflySize: 0,
    starBrightness: 0,
    rainBrightness: 0,
    petalBrightness: 0,
    dustMoteBrightness: 0,
    godRayIntensity: 0,
    kuwaharaStrength: 0,
    waveWindDirX: 0,
    waveWindDirY: 0,
    waveWindSpeed: 0,
    waveWindStrength: 0,
    dofFocusDistance: 0,
    dofBokehScale: 0,
    splitToneWarm: [0.50, 0.50, 0.55],  // neutral grey-blue
    splitToneCool: [0.45, 0.45, 0.55],  // neutral grey-blue
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,

    // ── Post-FX ──
    bloomIntensity: 0.2,               // barely any bloom — nothing to bloom
    bloomThreshold: 0.9,               // high threshold — only brightest particles
    fogDepthStrength: 0.01,
    fogMidColor: [0.02, 0.02, 0.03],
    fogFarColor: [0.02, 0.02, 0.03],
    colorGradeContrast: 0.05,          // flat — the void is featureless
    colorGradeVibrance: 0.1,           // desaturated — color hasn't arrived
    colorGradeWarmth: -0.02,           // cold
    vignetteDarkness: 0.95,            // maximum — tunnel vision, claustrophobic
    grainOpacity: 0.04,                // subtle noise — the void isn't smooth

    // ── Audio geometry visibility (NEW — for future subsystem wiring) ──
    // These will be interpolated but not auto-applied until subsystems exist.
    bassSphereOpacity: 0.0,            // invisible — no sound yet
    bassSphereScale: 0.0,
    bassSphereEmissive: 0.0,
    melodyRibbonOpacity: 0.0,
    melodyRibbonLength: 0.0,
    harmonyCrystalOpacity: 0.0,
    harmonyCrystalEmissive: 0.0,
    voidMoteBrightness: 0.15,          // barely visible — the void has texture
    resonanceIntensity: 0.0,           // no beats yet
    audioReactivity: 0.0,              // master audio→geometry coupling
    pointLightIntensity: 0.0,          // no light sources
  },

  {
    t: 0.25, // EMERGENCE — first bass notes create dim pulsing spheres in the distance.
    // Geometry coalesces from nothing. The viewer begins to perceive structure.
    // Like seeing shapes in fog — is that really there?

    sunElevation: -90,
    sunAzimuth: 0,
    turbidity: 0,
    rayleigh: 0,
    mieCoefficient: 0,
    mieDirectionalG: 0,
    fogColor: [0.03, 0.02, 0.05],    // hint of violet in the darkness
    fogDensity: 0.001,
    sunLightColor: [0.10, 0.10, 0.15],
    sunLightIntensity: 0.05,
    ambientIntensity: 0.02,

    grassBaseColor: [0, 0, 0],
    grassTipColor: [0, 0, 0],
    grassWindSpeed: 0,
    grassAmbientStrength: 0,
    grassTranslucency: 0,
    grassFogFade: 0,
    cloudShadowOpacity: 0,
    cloudDriftSpeed: 0,
    fireflyBrightness: 0,
    fireflySize: 0,
    starBrightness: 0,
    rainBrightness: 0,
    petalBrightness: 0,
    dustMoteBrightness: 0,
    godRayIntensity: 0,
    kuwaharaStrength: 0,
    waveWindDirX: 0,
    waveWindDirY: 0,
    waveWindSpeed: 0,
    waveWindStrength: 0,
    dofFocusDistance: 0,
    dofBokehScale: 0,
    splitToneWarm: [0.60, 0.45, 0.60],  // first violet tint in shadows
    splitToneCool: [0.50, 0.55, 0.70],  // first blue tint in highlights
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,

    bloomIntensity: 0.5,               // bloom emerging — halos around new geometry
    bloomThreshold: 0.6,               // lower threshold — more catches bloom
    fogDepthStrength: 0.02,
    fogMidColor: [0.03, 0.02, 0.05],
    fogFarColor: [0.02, 0.02, 0.04],
    colorGradeContrast: 0.08,          // building contrast
    colorGradeVibrance: 0.3,           // color appearing
    colorGradeWarmth: -0.03,           // still cold
    vignetteDarkness: 0.80,            // opening slightly — there's something to see
    grainOpacity: 0.06,

    // Audio geometry: bass spheres appear, everything else still dormant
    bassSphereOpacity: 0.4,            // dim — coalescing from void
    bassSphereScale: 0.6,              // smaller than full size
    bassSphereEmissive: 1.0,
    melodyRibbonOpacity: 0.05,         // ghost traces — barely perceptible
    melodyRibbonLength: 0.2,           // short fragments
    harmonyCrystalOpacity: 0.0,        // not yet — harmony comes last
    harmonyCrystalEmissive: 0.0,
    voidMoteBrightness: 0.3,           // brighter — geometry illuminates nearby motes
    resonanceIntensity: 0.3,           // first beats trigger faint bursts
    audioReactivity: 0.4,              // 40% audio→geometry coupling
    pointLightIntensity: 0.3,          // dim violet point lights from bass spheres
  },

  {
    t: 0.50, // CONVERGENCE — you are inside the music. All geometry types active.
    // Bass spheres pulse close. Melody ribbons weave between them.
    // Harmony crystals catch and scatter light. The camera is INSIDE the cluster.
    // This is the peak. The moment of pure presence.

    sunElevation: -90,
    sunAzimuth: 0,
    turbidity: 0,
    rayleigh: 0,
    mieCoefficient: 0,
    mieDirectionalG: 0,
    fogColor: [0.04, 0.02, 0.06],    // deeper violet fog
    fogDensity: 0.0006,               // CLEAREST — see all geometry
    sunLightColor: [0.12, 0.12, 0.18],
    sunLightIntensity: 0.08,
    ambientIntensity: 0.04,            // geometry light fills the space

    grassBaseColor: [0, 0, 0],
    grassTipColor: [0, 0, 0],
    grassWindSpeed: 0,
    grassAmbientStrength: 0,
    grassTranslucency: 0,
    grassFogFade: 0,
    cloudShadowOpacity: 0,
    cloudDriftSpeed: 0,
    fireflyBrightness: 0,
    fireflySize: 0,
    starBrightness: 0,
    rainBrightness: 0,
    petalBrightness: 0,
    dustMoteBrightness: 0,
    godRayIntensity: 0,
    kuwaharaStrength: 0,
    waveWindDirX: 0,
    waveWindDirY: 0,
    waveWindSpeed: 0,
    waveWindStrength: 0,
    dofFocusDistance: 0,
    dofBokehScale: 0,
    splitToneWarm: [0.72, 0.45, 0.65],  // warm violet — intimacy
    splitToneCool: [0.40, 0.65, 0.85],  // electric cyan highlights
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,

    bloomIntensity: 1.2,               // PEAK bloom — geometry radiates
    bloomThreshold: 0.3,               // LOW — everything glows
    fogDepthStrength: 0.02,
    fogMidColor: [0.04, 0.03, 0.06],
    fogFarColor: [0.03, 0.02, 0.05],
    colorGradeContrast: 0.15,          // PEAK contrast — bright vs void
    colorGradeVibrance: 0.8,           // PEAK saturation — electric colors
    colorGradeWarmth: -0.04,           // cold — transcendence, not comfort
    vignetteDarkness: 0.50,            // WIDE OPEN — see everything
    grainOpacity: 0.06,

    // Audio geometry: FULL SYSTEM — peak presence
    bassSphereOpacity: 1.0,            // full brightness
    bassSphereScale: 1.0,              // full scale
    bassSphereEmissive: 2.0,           // strong self-illumination
    melodyRibbonOpacity: 0.8,          // flowing, visible, alive
    melodyRibbonLength: 1.0,           // full ribbon length
    harmonyCrystalOpacity: 0.9,        // crystals appear at CONVERGENCE
    harmonyCrystalEmissive: 3.0,       // brightest — piercing accents
    voidMoteBrightness: 0.5,           // illuminated by surrounding geometry
    resonanceIntensity: 1.0,           // full beat response
    audioReactivity: 1.0,              // 100% audio→geometry coupling
    pointLightIntensity: 0.8,          // strong violet illumination
  },

  {
    t: 0.75, // DISSOLUTION — everything merges. Geometry becomes less defined.
    // The boundaries between bass/melody/harmony blur.
    // Higher bloom makes edges soft. CA increases — vision distorts.
    // This is ego death. You become the sound. You can't tell where
    // you end and the music begins.

    sunElevation: -90,
    sunAzimuth: 0,
    turbidity: 0,
    rayleigh: 0,
    mieCoefficient: 0,
    mieDirectionalG: 0,
    fogColor: [0.05, 0.03, 0.07],    // warmer violet — dissolution glow
    fogDensity: 0.002,                 // fog RETURNS — blurring depth
    sunLightColor: [0.15, 0.12, 0.20],
    sunLightIntensity: 0.10,
    ambientIntensity: 0.06,            // more ambient — boundaries dissolving

    grassBaseColor: [0, 0, 0],
    grassTipColor: [0, 0, 0],
    grassWindSpeed: 0,
    grassAmbientStrength: 0,
    grassTranslucency: 0,
    grassFogFade: 0,
    cloudShadowOpacity: 0,
    cloudDriftSpeed: 0,
    fireflyBrightness: 0,
    fireflySize: 0,
    starBrightness: 0,
    rainBrightness: 0,
    petalBrightness: 0,
    dustMoteBrightness: 0,
    godRayIntensity: 0,
    kuwaharaStrength: 0,
    waveWindDirX: 0,
    waveWindDirY: 0,
    waveWindSpeed: 0,
    waveWindStrength: 0,
    // DOF activates at DISSOLUTION — world becomes abstract blur
    dofFocusDistance: 20,              // nothing in focus
    dofBokehScale: 6.0,               // heavy bokeh — geometry becomes orbs of light
    splitToneWarm: [0.65, 0.40, 0.70],  // deeper violet — merging
    splitToneCool: [0.45, 0.60, 0.80],  // softened cyan
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,

    bloomIntensity: 1.5,               // MAXIMUM bloom — everything bleeds into everything
    bloomThreshold: 0.25,              // even dimmer geometry catches bloom
    fogDepthStrength: 0.04,
    fogMidColor: [0.05, 0.03, 0.07],
    fogFarColor: [0.04, 0.03, 0.06],
    colorGradeContrast: 0.10,          // flattening — distinctions dissolve
    colorGradeVibrance: 0.6,           // still saturated but softening
    colorGradeWarmth: 0.0,             // neutral — dissolution is neither warm nor cold
    vignetteDarkness: 0.60,            // closing slightly — peripheral dissolving
    grainOpacity: 0.10,                // INCREASED — material reality degrading

    // Audio geometry: blurred, merged, losing distinct form
    bassSphereOpacity: 0.8,            // still visible but softer
    bassSphereScale: 1.3,              // LARGER — expanding, losing definition
    bassSphereEmissive: 2.5,           // brighter as it dissolves
    melodyRibbonOpacity: 0.6,          // fading
    melodyRibbonLength: 1.2,           // LONGER — trailing, smearing
    harmonyCrystalOpacity: 0.7,        // dissolving edges
    harmonyCrystalEmissive: 2.5,       // bright but less distinct
    voidMoteBrightness: 0.7,           // BRIGHTER — the void itself is becoming luminous
    resonanceIntensity: 0.8,           // sustained but less sharp
    audioReactivity: 0.85,             // still responsive but dreamier
    pointLightIntensity: 1.0,          // PEAK light — the void glows from within
  },

  {
    t: 1.0, // ECHO — afterglow. The sound is fading. Geometry dims.
    // Trailing ribbons. Dying resonance. The memory of sound lingering.
    // You're drifting away. The void is reclaiming the space.
    // But you carry the sound with you.

    sunElevation: -90,
    sunAzimuth: 0,
    turbidity: 0,
    rayleigh: 0,
    mieCoefficient: 0,
    mieDirectionalG: 0,
    fogColor: [0.03, 0.02, 0.04],    // darkening — void returns
    fogDensity: 0.003,                 // thicker — distance collapsing
    sunLightColor: [0.10, 0.10, 0.15],
    sunLightIntensity: 0.05,
    ambientIntensity: 0.02,            // returning to darkness

    grassBaseColor: [0, 0, 0],
    grassTipColor: [0, 0, 0],
    grassWindSpeed: 0,
    grassAmbientStrength: 0,
    grassTranslucency: 0,
    grassFogFade: 0,
    cloudShadowOpacity: 0,
    cloudDriftSpeed: 0,
    fireflyBrightness: 0,
    fireflySize: 0,
    starBrightness: 0,
    rainBrightness: 0,
    petalBrightness: 0,
    dustMoteBrightness: 0,
    godRayIntensity: 0,
    kuwaharaStrength: 0,
    waveWindDirX: 0,
    waveWindDirY: 0,
    waveWindSpeed: 0,
    waveWindStrength: 0,
    // DOF extreme — the memory is abstract
    dofFocusDistance: 40,
    dofBokehScale: 8.0,               // maximum blur — can't hold onto anything
    splitToneWarm: [0.55, 0.45, 0.58],  // fading back to neutral
    splitToneCool: [0.48, 0.50, 0.60],  // echo of cyan
    oceanColorNear: [0, 0, 0],
    oceanColorFar: [0, 0, 0],
    oceanFoamBrightness: 0,
    oceanWaveLineIntensity: 0,

    bloomIntensity: 0.4,               // bloom dying — light fading
    bloomThreshold: 0.7,               // higher threshold — only strongest remnants glow
    fogDepthStrength: 0.05,
    fogMidColor: [0.03, 0.02, 0.04],
    fogFarColor: [0.02, 0.02, 0.03],
    colorGradeContrast: 0.03,          // FLAT — visual memory degrading
    colorGradeVibrance: 0.15,          // color draining — back to grey void
    colorGradeWarmth: 0.02,            // faintest warmth — you carry the sound home
    vignetteDarkness: 0.90,            // CLOSING — tunnel vision returns
    grainOpacity: 0.10,                // heavy grain — the void reclaims

    // Audio geometry: fading. Afterglow. Memory of sound.
    bassSphereOpacity: 0.15,           // ghost — barely there
    bassSphereScale: 0.5,              // shrinking — returning to nothing
    bassSphereEmissive: 0.8,           // dim ember
    melodyRibbonOpacity: 0.2,          // trailing wisps — the last melody
    melodyRibbonLength: 0.6,           // shorter — fragmenting
    harmonyCrystalOpacity: 0.1,        // almost gone — last shimmer
    harmonyCrystalEmissive: 1.0,       // fading
    voidMoteBrightness: 0.25,          // back to dim — void texture
    resonanceIntensity: 0.1,           // barely pulsing
    audioReactivity: 0.2,              // mostly disconnected — echo, not live
    pointLightIntensity: 0.1,          // last violet glow
  },
]
