// Crystal Cavern — Hidden / Resonate
// Emotional temperature: Sacred Discovery
// "Deep underground, where sound becomes light and light becomes feeling.
//  The crystals don't reflect — they remember."

export default {
  id: 'crystal-cavern',
  name: 'Crystal Cavern',
  route: '/resonate',
  emotion: 'Sacred Discovery',
  tagline: 'descent into resonance, light fractured into meaning',

  // What the viewer feels:
  // You descend. The world above ceases to matter.
  // A single shaft of light enters from above and shatters into rainbows
  // against massive crystal formations. The deeper you go, the larger
  // the crystals grow, the more fractured the light becomes.
  // At the bottom, the crystals hum. They vibrate at frequencies
  // that match the music. You realize you are inside the sound.

  terrain: {
    type: 'cavern-floor',
    // Inverted world — camera descends into the earth
    // Rocky cavern floor: irregular, sharp, with pools of still water
    // Stalagmites rise from floor, stalactites hang from void above
    // Uses abs(sin) ridges at low amplitude for jagged rock texture
    size: 300,
    depth: 80,           // total vertical descent range
    floorY: -60,         // cavern floor base level
    ceilingY: 10,        // cavern entrance level
    roughness: 0.8,      // surface irregularity (0-1)
    vertexColor: [0.04, 0.03, 0.06],  // dark purple-grey stone
    poolsEnabled: true,   // still water pools on cavern floor
    poolColor: 0x0a0818,  // near-black indigo
    poolLevel: -58,       // pools sit in the deepest depressions
  },

  sky: {
    type: 'cavern-void',
    // No sky — underground. Dark hemisphere above.
    // Single shaft of light from entrance creates volumetric beam
    // The "sky" is the absence of sky — pure dark with one wound of light
    voidColor: [0.01, 0.01, 0.02],    // near-black blue
    lightShaft: {
      enabled: true,
      origin: [0, 20, 0],              // directly above entrance
      direction: [0.1, -1.0, -0.2],    // angled slightly forward
      color: [0.95, 0.92, 0.85],       // warm white (the one light source)
      intensity: 2.5,
      coneAngle: 0.15,                 // tight beam — 15% of hemisphere
      // Volumetric scattering from dust in the beam
      scatterDensity: 0.03,
      scatterSamples: 32,
    },
    stars: { enabled: false },
  },

  // Crystal formations replace grass entirely
  // These are the SOUL of this world
  crystals: {
    enabled: true,
    // Procedural crystal geometry — elongated octahedra + hex prisms
    // Source: Varun Vachhar rhombic triacontahedron SDF (adapted to mesh)
    // Source: Maxime Heckel chromatic dispersion technique
    types: [
      {
        name: 'amethyst',
        color: [0.35, 0.10, 0.55],      // deep purple
        emissive: [0.15, 0.04, 0.25],   // internal glow
        count: 120,
        sizeRange: [0.3, 2.5],          // small clusters
        placement: 'floor',
      },
      {
        name: 'quartz',
        color: [0.85, 0.82, 0.90],      // near-white with purple tint
        emissive: [0.08, 0.07, 0.10],   // faint internal light
        count: 80,
        sizeRange: [0.5, 4.0],          // medium formations
        placement: 'floor-and-ceiling',
      },
      {
        name: 'citrine',
        color: [0.75, 0.55, 0.15],      // warm amber — artist color territory
        emissive: [0.20, 0.15, 0.03],   // warm glow
        count: 40,
        sizeRange: [1.0, 6.0],          // large anchor pieces
        placement: 'floor',
      },
      {
        name: 'sapphire',
        color: [0.10, 0.20, 0.60],      // deep blue
        emissive: [0.03, 0.06, 0.18],   // cold glow
        count: 60,
        sizeRange: [0.2, 1.5],          // small scattered
        placement: 'ceiling',            // stalactite crystals
      },
    ],
    // Prismatic dispersion shader properties
    // Source: Taylor Petrick — separate RGB IOR refraction
    // Source: Maxime Heckel — multi-sample loop for smooth dispersion
    dispersion: {
      enabled: true,
      iorR: 1.15,         // red bends least (longer wavelength)
      iorG: 1.18,         // green in middle
      iorB: 1.22,         // blue bends most (shorter wavelength)
      refractPower: 0.3,
      chromaticAberration: 0.8,
      fresnelPower: 3.0,  // strong edge reflections
    },
    // Subsurface scattering — crystals glow from within
    // Source: mattdesl fast SSS gist
    subsurface: {
      thicknessPower: 16,       // sharper than default (20) for crystalline look
      thicknessScale: 5,        // brighter than default (4)
      thicknessDistortion: 0.25, // more normal distortion for faceted surfaces
      thicknessAmbient: 0.05,    // slight ambient transmission
    },
    // Resonance — crystals vibrate with the music
    resonance: {
      enabled: true,
      frequencyRange: [80, 800],  // Hz — low hum to mid resonance
      amplitudeScale: 0.02,       // subtle vertex displacement
      glowResponse: 0.5,          // emissive intensifies with audio
    },
  },

  grass: {
    enabled: false, // underground — no grass. Crystals replace vegetation.
  },

  flowers: {
    enabled: false, // crystals ARE the flowers of the underground
  },

  // Bioluminescent mushrooms — ground cover between crystal formations
  // Small hemisphere caps on thin stems, pulsing with chemical light
  // Purple-blue-teal palette — the cave floor's living carpet
  mushrooms: {
    enabled: true,
    count: 300,
    pulseSpeed: 1.5,       // breathing rate — slow chemical cycling
    pulseIntensity: 0.4,   // max brightness swing per pulse
    palette: [
      { glow: [0.35, 0.10, 0.55], stem: [0.06, 0.03, 0.10] },  // deep purple
      { glow: [0.15, 0.25, 0.65], stem: [0.04, 0.05, 0.10] },  // blue
      { glow: [0.10, 0.45, 0.50], stem: [0.03, 0.08, 0.08] },  // teal
      { glow: [0.45, 0.15, 0.60], stem: [0.08, 0.03, 0.10] },  // violet
    ],
  },

  particles: {
    fireflies: { enabled: false },
    dust: { enabled: false },
    rain: { enabled: false },
    spray: { enabled: false },
    // Mineral dust — catches prismatic light from crystal refractions
    crystalDust: {
      enabled: true,
      count: 300,
      // Slow float, near-zero gravity — underground air is still
      velocity: [0.0, 0.02, 0.0],
      // Color shifts based on proximity to nearest crystal type
      // Default: white-lavender, shifts to crystal's emissive color near formations
      baseColor: [0.6, 0.55, 0.7],
      size: 1.5,
      // Prismatic sparkle — brief rainbow flash when dust crosses light shaft
      prismaticFlash: true,
    },
    // Crystal sparkles — tiny point sprites on crystal surfaces
    sparkles: {
      enabled: true,
      count: 500,
      // Attached to crystal surfaces, not free-floating
      attachedToSurface: true,
      // Brief intense white flash, then fade — like light catching a facet
      flashDuration: 0.3,    // seconds
      flashInterval: [2, 8], // random seconds between flashes per sparkle
      color: [1.0, 0.98, 0.95],
      size: 2.0,
    },
  },

  lighting: {
    // NO real sun — all light is crystal-refracted purple
    sunColor: [0.25, 0.12, 0.70],   // purple crystal light, NOT sunlight
    sunIntensity: 0.15,              // very dim — underground has no directional source
    sunDirection: [0.1, -1.0, -0.2], // from above, angled into cave
    ambientIntensity: 0.008,         // near-zero — darkness IS the world
    // All visible illumination comes from crystal emissives + bloom
  },

  fog: {
    near: 3,
    far: 45,
    color: '#05010a',    // deep purple-black — saturated, not grey
    density: 0.035,      // VERY thick — claustrophobic cave atmosphere
  },

  postFX: {
    bloom: {
      threshold: 0.20,   // VERY LOW — any bright pixel blooms hard
      intensity: 1.6,    // VERY HIGH — crystal glow IS the atmosphere
      levels: 8,
    },
    grain: { intensity: 0.06 },           // gritty underground texture
    vignette: { darkness: 0.95, offset: 0.15 }, // HEAVIEST — cave walls press in
    ca: {
      offset: [0.004, 0.002],    // heavy — prismatic lens matching dispersion theme
      radialModulation: true,
    },
    toneMapping: 'UNCHARTED2',   // deep shadow compression
    kuwahara: { enabled: false }, // crystals need sharp facets, not painterly
    godRays: {
      enabled: true,              // light shaft from entrance
      numSamples: 64,             // high quality — this is the KEY light
      decay: 0.95,
      exposure: 1.2,
      // Positioned at cavern entrance (light source origin)
      lightPosition: [0, 20, 0],
    },
    dof: {
      enabled: true,
      focusDistance: 6,           // intimate — looking at crystals up close
      focusRange: 2.0,           // narrow — sharp crystal, blurred everything else
      bokehScale: 6.0,           // heavy bokeh — prismatic quality
    },
    ssao: {
      enabled: true,
      // CRITICAL for cave depth — occlusion makes crevices feel real
      radius: 1.5,
      intensity: 1.0,
    },
    // NEW: Crystal-specific post-processing
    prismaticDispersion: {
      enabled: true,
      // Screen-space chromatic split on bright pixels only
      // Bright areas (crystals catching light) get rainbow fringing
      // Dark areas (cave walls) remain untouched
      brightnessThreshold: 0.4,
      spreadR: 0.003,
      spreadG: 0.000,
      spreadB: -0.003,
      samples: 8,
    },
  },

  camera: {
    pathType: 'descent-spiral',
    // Camera descends into the earth
    // Start: cavern entrance, looking down
    // End: crystal cathedral at the bottom, surrounded
    heightOffset: 1.0,        // LOW — deep underground
    dampingFactor: 1.0,        // smooth, deliberate — you CHOOSE to go deeper
    fov: 42,                   // slightly narrow — intimate, focused
    controlPoints: [
      // THRESHOLD — entrance, light behind you
      [0, 5, 0],
      // DESCENT — first crystals appear at the walls
      [8, -5, -15],
      // PRISMATIC — deep now, light fractures everywhere
      [-5, -20, -30],
      // RESONANCE — vast crystal cathedral opens up
      [3, -40, -50],
      // COMMUNION — at the bottom, surrounded by glow
      [0, -55, -65],
    ],
    // Gentle look-down bias in early sections (descending)
    lookDownBias: {
      start: 0.15,    // slight downward gaze at entrance
      end: 0.0,       // level gaze at communion (surrounded, not above)
    },
  },

  scoreSheets: {
    enabled: true,
    count: 2,
    type: 'crystallized',    // embedded in crystal formation, partially visible
    emissiveRim: true,       // edges glow with crystal color
  },

  figure: {
    enabled: false,
    // No figure — you are INSIDE the instrument.
    // The crystals are the figure. The cave is the body.
  },

  // Prismatic caustics — rainbow refraction patterns on dark stone
  // THE signature visual: "light refracting through crystals creates rainbow patterns"
  // Uses existing CausticProjector with prismatic mode enabled.
  // 3 noise layers → 3 spectral bands (warm/mid/cool) via iquilez cosine palette.
  caustics: {
    enabled: true,
    prismatic: true,
    frequency: 5.0,       // lower than tide pool (8.0) — larger patterns, more geological
    speed: 0.08,          // VERY slow — underground air is still, patterns drift like geology
    intensity: 0.6,       // base intensity, driven by keyframes (causticBrightness)
    sharpness: 4.0,       // sharper than tide pool (3.0) — crisp prismatic lines
    depthFade: 0.0,       // no depth fade — underground, not underwater
    color: [0.7, 0.5, 0.9],  // purple-tinted base (overridden by prismatic spectral bands)
    surfaceHeight: 70,    // full cave depth range for normalization
  },

  // Still water pools on the cavern floor
  water: {
    enabled: true,
    type: 'still-pool',
    // Mirror-flat — no waves underground
    // Reflects crystal light from above = doubled prismatic effect
    size: 80,
    waterLevel: -58,
    colorNear: 0x0a0818,     // near-black indigo
    colorFar: 0x050410,      // void purple
    reflectivity: 0.8,       // high — still water is a perfect mirror
    // No foam, no waves, no bob — absolute stillness
    foamFrequency: 0,
    bobAmplitude: 0,
    bobSpeed: 0,
  },

  audio: {
    ambient: 'cave',          // dripping water, distant echo, crystal resonance hum
    resonance: {
      enabled: true,
      // Crystal hum intensifies with scroll depth
      // Frequency matches the music's fundamental key
      baseFrequency: 136.1,  // C#3 — the resonant frequency of this cave
      harmonics: [1, 2, 3, 5, 8], // Fibonacci — natural resonance series
      gainCurve: 'scroll',   // louder as you descend
    },
    musicTrigger: { threshold: 0.15 }, // early — the descent IS the experience
    track: {
      title: 'Crystal Resonance',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null, // placeholder — wire when MP3 available
    },
  },

  dominantColor: '#3a1a6a', // deep amethyst purple
}
