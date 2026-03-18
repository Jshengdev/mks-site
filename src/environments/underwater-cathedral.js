// Underwater Cathedral — Sacred / Devotion
// Emotional temperature: Sacred Submersion
// "The music echoes through water — every note distorted, stretched,
//  made sacred by the pressure."
//
// Technique sources:
// - Caustics: martinRenou/threejs-caustics + Shadertoy XttyRX (Worley noise)
// - Fish schooling: cshenton/cshenton.github.io (instanced boids)
// - Underwater shader: ywang170/three.js-glsl-simple-underwater-shader
// - Volumetric light: Erkaman/glsl-godrays (inverted for top-down shafts)
// - Bioluminescence: Alex-DG firefly system adapted for coral glow

export default {
  id: 'underwater-cathedral',
  name: 'Underwater Cathedral',
  route: '/devotion',
  emotion: 'Sacred Submersion',
  tagline: 'sinking into something holy',

  // What the viewer feels:
  // You are sinking. Not falling — sinking. The descent is voluntary.
  // Above you, light fractures through what might have been stained glass
  // windows, now colonized by coral. Stone pillars rise like prayers
  // frozen in stone. Fish drift like congregation — they've been here
  // longer than the architecture. The deeper you go, the darker it gets,
  // but also the more alive. Bioluminescence replaces sunlight.
  // The cathedral breathes with current. Every note of music arrives
  // delayed, stretched, reverberant — made holy by depth.

  terrain: {
    type: 'cathedral-nave',
    // Flat stone floor with procedural pillar positions
    // Height function: low-amplitude simplex for worn stone texture
    // Pillars on irregular grid (time-warped, not uniform)
    octaves: 2,
    frequencies: [0.8, 1.6],
    amplitudes: [0.15, 0.05],       // very flat — stone floor
    smoothPasses: 4,                // worn smooth by centuries of water
    smoothSigma: 3,
    heightRatio: 0.008,             // almost flat — this is a floor, not terrain
    size: 200,                      // smaller than meadow — enclosed, claustrophobic
    vertexColor: [0.06, 0.07, 0.08], // dark grey-blue stone
    pillars: {
      enabled: true,
      count: 24,                     // 2 rows of 12 (nave layout)
      spacing: 12,                   // meters between pillars
      rowSeparation: 16,             // width of nave
      heightRange: [25, 40],         // pillars reach toward surface
      radiusRange: [0.8, 1.5],       // thick stone columns
      irregularity: 0.15,            // position jitter (centuries of shifting)
      coralCoverage: 0.4,            // 40% of pillar surface has coral
    },
    arches: {
      enabled: true,
      count: 8,                      // pointed Gothic arches connecting pillars
      heightOffset: 20,              // arch starts at 20m up the pillar
    },
  },

  sky: {
    type: 'water-surface',
    // No Preetham sun dome. Instead: a rippling water surface plane at y=45
    // Light filters DOWN through this surface, creating caustic patterns
    // The "sky" is the underside of the ocean seen from below
    surfaceHeight: 45,               // y-position of water surface plane
    surfaceColor: [0.02, 0.12, 0.18], // dark teal — what light looks like from below
    surfaceRippleSpeed: 0.3,          // slow, heavy ripple
    surfaceRippleScale: 4.0,          // large wave pattern
    surfaceOpacity: 0.6,              // partially transparent — light comes through

    caustics: {
      enabled: true,
      // Stolen from Shadertoy XttyRX + martinRenou/threejs-caustics
      // Worley noise for cellular caustic pattern, animated with time
      type: 'worley-animated',
      projectionScale: 0.08,          // caustic pattern UV scale on floor
      speed: 0.15,                    // slow caustic drift
      intensity: 0.6,                 // caustic brightness multiplier
      colorTint: [0.4, 0.8, 1.0],    // blue-white caustic light
      depthFade: 0.02,               // caustics fade with depth (distance from surface)
    },

    // Stained glass windows — colored light shafts
    stainedGlass: {
      enabled: true,
      windowCount: 6,                 // 3 per side of nave
      windowHeight: 30,               // high up on the walls
      colors: [
        [0.8, 0.2, 0.1],             // deep red
        [0.1, 0.3, 0.9],             // sapphire blue
        [0.7, 0.5, 0.1],             // amber gold
        [0.1, 0.7, 0.3],             // emerald green
        [0.6, 0.1, 0.7],             // amethyst purple
        [0.2, 0.6, 0.8],             // aquamarine
      ],
      shaftWidth: 3,                  // width of each light shaft
      shaftFalloff: 0.04,             // how quickly light fades with distance from window
    },

    sunElevation: -5,                 // sun barely above horizon through water surface
    stars: { enabled: false },
  },

  // Caustic light projection on cathedral floor — THE underwater signature
  // Light refracts through the water surface and casts animated cellular patterns
  // onto the worn stone. At the surface this is vivid; at the abyss, a ghost.
  // Uses same CausticProjector as tide-pool but tuned for 45m depth:
  //   - slower speed (heavy water, not shallow pool)
  //   - lower frequency (larger, lazier patterns — cathedral scale)
  //   - heavy depth fade (caustics die fast through 45m of murk)
  //   - blue-shifted color (red absorbed, only blue-green survives)
  //
  // Stolen from: martinRenou/threejs-caustics + Shadertoy MdlXz8 (Dave_Hoskins)
  caustics: {
    enabled: true,
    frequency: 5.0,              // LOWER than tide pool (8.0) — larger patterns, cathedral scale
    speed: 0.15,                 // SLOWER — heavy water, glacial drift
    intensity: 0.55,             // dimmer base — 45m of water absorbs most light
    sharpness: 2.5,              // softer lines — water scatter blurs caustic edges at depth
    depthFade: 0.06,             // STRONG fade — caustics vanish well before the floor
    color: [0.35, 0.70, 0.90],  // blue-shifted — red channel is gone at this depth
  },

  // DISABLED — underwater cathedral has kelp, not grass
  grass: {
    enabled: false,
  },

  // No flowers — replaced by coral formations
  flowers: {
    enabled: false,
  },

  // Kelp forest — tall instanced ribbon blades with underwater current sway
  // (KelpStrand.js — adapted from GrassGeometry 5x taller, al-ro/spacejack sway)
  kelp: {
    enabled: true,
    bladeCount: 2000,                 // 2000 kelp strands across the nave floor
    baseColor: [0.01, 0.06, 0.03],   // dark green kelp base
    tipColor: [0.05, 0.18, 0.08],    // lighter translucent green tips
    bladeHeight: 12.0,               // TALL — 5x grass, reaches toward surface
    swaySpeed: 0.15,                  // slow underwater current (3-5x slower than wind)
    swayAmplitude: 1.5,               // large, lazy movements
    currentDir: [0.6, 0.8],          // prevailing current direction (diagonal drift)
  },

  // Anemone field — tube tentacles waving in current
  // (AnemoneSystem.js — boytchev tentacle technique, instanced)
  anemoneField: {
    enabled: true,
    count: 100,                       // 100 anemone clusters on the floor
    palette: [
      [0.08, 0.30, 0.35],           // deep teal (matches cathedral water)
      [0.15, 0.45, 0.40],           // jade green
      [0.20, 0.25, 0.50],           // indigo-blue
      [0.40, 0.20, 0.45],           // purple (bioluminescent accent)
      [0.10, 0.50, 0.30],           // emerald
      [0.30, 0.15, 0.35],           // dark amethyst
    ],
    tentaclesPerAnemone: [4, 8],     // fewer tentacles than tide pool (sacred, sparse)
    tentacleHeight: [1.5, 3.5],      // shorter — cathedral floor ornaments
    tentacleRadius: 0.06,
    swaySpeed: 0.3,                  // gentle underwater current
    swayAmplitude: 0.25,
    currentDirection: [0.6, 0.0, 0.8],
  },

  particles: {
    fireflies: {
      // REPURPOSED as bioluminescent plankton
      enabled: true,
      count: 300,                     // "the void between them IS the depth — don't fill it"
      color: [0.2, 0.8, 0.6],        // bioluminescent teal-green
      brightness: 1.5,
      bobSpeed: 0.2,                  // slow vertical drift (underwater)
      driftRadius: 5.0,              // wider drift — current carries them
    },
    dust: {
      // REPURPOSED as suspended sediment / marine snow
      enabled: true,
      count: 400,                     // heavy — water is full of particles
    },
    rain: { enabled: false },
    spray: { enabled: false },

    // New particle types for this world
    fishSchools: {
      enabled: true,
      // Adapted from cshenton/cshenton.github.io boids implementation
      // Instanced geometry with simplified boids behavior
      schoolCount: 5,                 // 5 separate schools
      fishPerSchool: 30,              // 30 fish per school
      fishSize: 0.15,                 // small — they're background, not subject
      // Boids parameters (stolen from tunneln/foids)
      separationWeight: 1.5,          // don't overlap
      alignmentWeight: 1.0,           // face same direction
      cohesionWeight: 1.2,            // stay together
      maxSpeed: 0.8,                  // slow — drifting, not darting
      avoidPillars: true,             // steer around columns
      bodyColor: [0.15, 0.15, 0.20],  // dark silver — catch light on turns
      finColor: [0.08, 0.08, 0.12],   // darker fins
    },
    jellyfish: {
      enabled: true,
      count: 4,                       // rare — 4 large forms
      size: [1.5, 3.0],              // 1.5-3m diameter
      pulseSpeed: 0.4,               // slow rhythmic pulse
      tentacleLength: 5.0,
      bodyColor: [0.15, 0.4, 0.6],   // translucent teal
      glowColor: [0.3, 0.7, 0.9],    // bioluminescent edge glow
      opacity: 0.3,                   // highly translucent
      driftSpeed: 0.1,               // barely moving — they just exist
    },
  },

  // Coral formations on pillars (emissive geometry)
  coral: {
    enabled: true,
    // Branching coral on pillar surfaces + floor clusters
    types: [
      { name: 'brain', count: 15, size: [0.5, 1.2], glowColor: [0.1, 0.6, 0.8], glowIntensity: 0.4 },
      { name: 'branching', count: 25, size: [0.3, 1.5], glowColor: [0.2, 0.9, 0.5], glowIntensity: 0.6 },
      { name: 'tube', count: 20, size: [0.2, 0.8], glowColor: [0.8, 0.3, 0.9], glowIntensity: 0.5 },
      { name: 'fan', count: 10, size: [0.8, 2.0], glowColor: [0.9, 0.6, 0.2], glowIntensity: 0.3 },
    ],
    // Glow increases as depth increases (replaces sunlight with bioluminescence)
    depthGlowMultiplier: 1.5,         // coral glows 50% brighter at bottom than top
    attachToPillars: true,            // grow on pillar surfaces
    floorClusters: true,              // also cluster on floor between pillars
  },

  lighting: {
    // Light from above, filtered through 45m of water
    // Water absorbs red first, then orange, yellow, green
    // Only blue and green penetrate deep
    sunColor: [0.15, 0.35, 0.55],    // deep blue — all warmth absorbed
    sunIntensity: 0.5,                // dim — filtered through 45m of water
    ambientIntensity: 0.08,           // very low — underwater darkness
    // Per-channel absorption rates for CausticProjector shader
    // Real underwater physics: red dies fast, blue persists
    // Lower than tide-pool defaults (0.15/0.06/0.02) because cathedral
    // caustics need to survive longer through 45m — the floor must still shimmer
    absorptionRed: 0.04,             // red dies within ~10m
    absorptionGreen: 0.015,          // green fades by ~25m
    absorptionBlue: 0.005,           // blue penetrates deepest
    // Bioluminescent ambient increases with depth (handled by keyframes)
    biolumAmbient: {
      color: [0.1, 0.5, 0.4],        // teal-green bioluminescent fill
      intensity: 0.05,                // subtle — just enough to see coral glow
      depthScale: true,               // intensity increases as sunlight decreases
    },
  },

  fog: {
    // Underwater visibility is limited — much tighter than any land world
    // This is the OCEAN, not air. Particles scatter light aggressively.
    near: 3,                          // fog starts 3m from camera (claustrophobic)
    far: 35,                          // can't see past 35m (oppressive, sacred)
    color: '#05141e',                 // teal-blue murk [0.02, 0.08, 0.12]
    density: 0.015,                   // HEAVY — thickest of any world
  },

  postFX: {
    bloom: {
      threshold: 0.35,                // LOW — catch all bioluminescence
      intensity: 0.8,                 // STRONG — underwater glow bleeds
      levels: 8,
    },
    grain: {
      intensity: 0.04,                // subtle — suspended particles in water
      interval: 60,                   // slower grain movement (water)
    },
    vignette: {
      darkness: 0.75,                 // heavy — tunnel vision, pressure
      offset: 0.25,                   // starts closing in early
    },
    ca: {
      offset: [0.004, 0.002],         // STRONG — water refracts light heavily
      radialModulation: true,          // more distortion at edges (lens effect)
    },
    toneMapping: 'AGX',               // dreamy — matches underwater quality
    kuwahara: { enabled: false },      // no painterly effect underwater
    godRays: {
      // INVERTED god rays — light shafts from ABOVE, not from horizon
      // Adapted from Erkaman/glsl-godrays
      enabled: true,
      direction: 'top-down',           // unique to this world
      numSamples: 60,                  // more samples for smoother underwater shafts
      decay: 0.985,                    // slower decay — light travels far through water
      exposure: 0.5,                   // dimmer than land god rays
      density: 0.8,                    // denser — water scatters light
    },
    dof: {
      enabled: true,
      focusDistance: 12,               // mid-range focus
      focusRange: 3.0,                // narrow — underwater visibility is limited
      bokehScale: 4.0,                // moderate bokeh — particles become orbs
    },
    ssao: {
      enabled: true,                   // crucial for pillar depth perception
    },
    // NEW: underwater color aberration
    underwaterTint: {
      enabled: true,
      // Water absorbs colors by wavelength: red dies at 5m, orange at 15m, yellow at 30m
      // Only blue and green survive at depth
      depthAbsorption: {
        red: 0.06,                     // 6% absorption per meter
        green: 0.02,                   // 2% absorption per meter
        blue: 0.01,                    // 1% absorption per meter (least absorbed)
      },
    },
  },

  camera: {
    pathType: 'descent',
    // THE CORE DIFFERENTIATOR: camera DESCENDS through scroll
    // Y values decrease — you're sinking into the cathedral
    // Slight lateral movement — current carries you
    // Slow, heavy damping — water resistance
    heightOffset: 0,                   // camera follows spline Y directly
    dampingFactor: 0.8,               // HEAVY damping — water resistance
    fov: 55,                          // wide — claustrophobic, immersive
    shake: {
      enabled: true,
      frequency: 2,                   // very slow — gentle current
      amplitude: 0.03,               // subtle sway — you're floating
    },
    controlPoints: [
      // Y values DECREASE — descending through the cathedral
      [0, 42, 0],                     // SURFACE — just below water, looking down into depths
      [3, 32, -15],                   // DESCENT — passing through upper windows, light shafts visible
      [-2, 20, -30],                  // NAVE — heart of the cathedral, surrounded by pillars
      [4, 10, -45],                   // CRYPT — deep, bioluminescence is primary light
      [-1, 3, -60],                   // ABYSS — near the floor, looking up at fading light
    ],
  },

  scoreSheets: {
    enabled: true,
    count: 3,
    type: 'sunken',                    // waterlogged, drifting gently in current
    currentDrift: true,               // score sheets sway with underwater current
    emissiveRim: true,                // faint glow from bioluminescent bacteria on paper
  },

  figure: {
    enabled: true,
    type: 'kneeling',                  // figure kneeling in prayer at the altar
    facing: 'altar',                   // facing away from camera, toward the deep end
    position: [0, 0, -50],            // at the far end of the nave, near the abyss
    celShading: {
      bands: 3,                        // fewer bands — softer in water
      thresholds: [0.5, 0.2, 0.001],
    },
    opacity: 0.6,                     // semi-transparent — ghost or memory?
  },

  audio: {
    ambient: 'underwater',             // deep hum, distant whale-song, water pressure
    musicTrigger: { threshold: 0.3 },  // music starts early — it's the reason you descended
    track: {
      title: 'Cathedral of Tides',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null,                       // placeholder — wire when MP3 available
    },
    // Reverb increases with depth (scroll position drives wet/dry mix)
    reverbDepthScale: true,
    reverbWet: [0.2, 0.8],            // 20% wet at surface, 80% wet at abyss
  },

  dominantColor: '#0a3d4d',            // deep teal — the color of sacred water
}
