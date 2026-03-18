// Tide Pool — Primordial Wonder
// Emotional temperature: Infinite Smallness
// "The universe exists at every scale. What is small to you
//  is infinite to something else."

export default {
  id: 'tide-pool',
  name: 'Tide Pool',
  route: '/wonder',
  emotion: 'Infinite Smallness',
  tagline: 'macro scale, caustic light, the world inside a world',

  // What the viewer feels:
  // You are TINY. A tide pool the size of a cathedral.
  // Anemones tower above you like ancient trees. Starfish crawl
  // across the rock floor like tectonic plates. Light from above
  // refracts through the water surface — caustic patterns dance
  // across everything, painting the stone with liquid geometry.
  // Scrolling takes you deeper. Colors shift. Red dies first,
  // then green. Only blue survives. At the bottom, a single
  // bioluminescent creature pulses in the dark.

  terrain: {
    type: 'tide-pool-basin',
    // CONCAVE terrain — a pool, not a hill. Edges curve UP.
    // Low-freq simplex for large rock forms + high-freq for barnacle texture.
    // The pool floor is roughly flat with gentle dips and rises.
    // Walls rise steeply at edges (inverted heightmap).
    octaves: 4,
    frequencies: [0.8, 1.6, 6.0, 12.0],
    amplitudes: [1.0, 0.4, 0.08, 0.03],   // large smooth forms + fine barnacle detail
    smoothPasses: 2,
    heightRatio: 0.04,
    size: 200,          // smaller world — macro scale illusion
    concave: true,      // invert: edges rise, center dips
    basinDepth: 8.0,    // depth of the pool in world units
    rockColor: [0.12, 0.10, 0.08],     // wet dark stone
    mossColor: [0.04, 0.12, 0.06],     // green-brown algae on rock
    mossThreshold: 0.3,                 // altitude blend
  },

  sky: {
    type: 'water-surface',
    // The "sky" is the water surface ABOVE the camera.
    // Rendered as a rippling plane at y=basinDepth with refraction distortion.
    // Light passes through it, creating caustics below.
    // As you descend, the surface becomes more distant and blurred.
    surfaceHeight: 8.0,         // world units above pool floor
    rippleFrequency: 3.5,       // simplex noise frequency for surface ripple
    rippleSpeed: 0.4,           // slow, dreamy ripple animation
    rippleAmplitude: 0.15,      // subtle surface deformation
    surfaceColor: [0.35, 0.55, 0.65],   // bright teal-white from above
    refractionStrength: 0.08,   // how much the surface distorts light
    sunElevation: 45,           // high sun — strong caustics
    // No Preetham sky — the surface IS the sky
    stars: { enabled: false },
  },

  // Caustic light projection — THE signature visual
  // Stolen from: martinRenou/threejs-caustics + Shadertoy MdlXz8 (Dave_Hoskins tileable caustic)
  caustics: {
    enabled: true,
    // Procedural caustic pattern projected downward onto all surfaces
    // Uses world-space XZ coords, animated with time
    frequency: 8.0,         // caustic pattern density
    speed: 0.3,             // animation speed (slow = dreamy)
    intensity: 0.7,         // brightness of caustic highlights
    layers: 3,              // 3 overlapping noise layers for complexity
    layerFrequencies: [1.0, 1.7, 2.3],   // fibonacci-ish spacing
    layerSpeeds: [0.3, -0.2, 0.15],      // different directions for richness
    depthFade: 0.12,        // caustics dim with depth (absorption)
    color: [0.6, 0.85, 0.95],   // slightly cyan-shifted light
    // Technique: project onto terrain frag shader as additive light
    // caustic = max(0, dot(layerA, layerB)) ^ sharpness
    // where layers are offset simplex noise fields
    sharpness: 3.0,         // pow() exponent for caustic line thinness
  },

  // Anemone "vegetation" — replaces grass
  // These ARE the trees of this world
  grass: {
    enabled: false,   // no grass — anemones replace vegetation
  },

  anemones: {
    enabled: true,
    count: 120,           // fewer than grass, but much larger
    // Instanced tube geometry with sine-based sway in vertex shader
    // Multiple frequencies for organic tentacle motion
    // Stolen from: mattatz/unity-verlet-simulator tentacle concept
    // adapted to vertex shader sine deformation (like grass wind but slower, wavier)
    tentacleSegments: 12,      // tube segments per tentacle
    tentacleRadius: 0.08,      // base radius
    tentacleHeight: [1.5, 4.0], // min/max height range (HUGE — these are trees)
    tentaclesPerAnemone: [5, 12], // random range per cluster
    // Color palette — sea anemone species colors
    palette: [
      [0.65, 0.15, 0.20],   // crimson (Waratah anemone)
      [0.20, 0.55, 0.35],   // deep green (giant green)
      [0.75, 0.35, 0.60],   // magenta-pink (Dahlia anemone)
      [0.30, 0.20, 0.50],   // purple (plum anemone)
      [0.80, 0.60, 0.25],   // amber-orange (beadlet)
      [0.15, 0.40, 0.55],   // teal (snakelocks)
    ],
    swaySpeed: 0.4,           // slow underwater sway
    swayAmplitude: 0.3,       // moderate displacement at tips
    currentDirection: [0.6, 0.0, 0.8],  // prevailing underwater current
  },

  // Starfish — macro-scale "continents" on the pool floor
  starfish: {
    enabled: true,
    count: 25,              // 20-30 — continental-scale stars on the pool floor
    size: [3.0, 6.0],       // world units — continental scale
    color: [0.65, 0.25, 0.12],   // orange-red ochre
    textureFrequency: 8.0,       // surface bump detail
    // Nearly static — starfish move imperceptibly
    moveSpeed: 0.001,       // glacial
  },

  flowers: {
    enabled: false,   // underwater — no flowers
  },

  particles: {
    fireflies: { enabled: false },
    dust: { enabled: false },
    rain: { enabled: false },
    spray: { enabled: false },
    // Bioluminescent plankton — the "fireflies" of the deep
    bioluminescence: {
      enabled: true,
      count: 300,
      colors: [
        [0.15, 0.75, 0.90],   // cyan
        [0.30, 0.45, 0.85],   // blue-violet
        [0.10, 0.90, 0.60],   // green bioluminescence
        [0.50, 0.20, 0.80],   // deep purple
      ],
      brightness: 1.5,
      pulseSpeed: 0.8,         // slow pulse
      driftSpeed: 0.15,        // barely moving
      sizeRange: [2.0, 6.0],  // point size range
    },
    // Bubbles — rising slowly toward the surface
    bubbles: {
      enabled: true,
      count: 80,
      riseSpeed: 0.5,          // slow ascent
      wobbleFrequency: 2.0,    // horizontal wobble
      wobbleAmplitude: 0.3,
      sizeRange: [0.05, 0.25], // world units
      opacity: 0.3,            // translucent
      refraction: true,         // distort scene behind them
    },
  },

  lighting: {
    // Light comes from ABOVE through the water surface
    // It's already filtered by water — shifted cool
    sunColor: [0.45, 0.65, 0.80],   // cyan-shifted daylight through water
    sunIntensity: 1.2,
    ambientIntensity: 0.15,
    // Underwater: light direction is nearly vertical (refracts toward normal)
    sunDirection: [0.1, -0.95, 0.05],
    // Color absorption model:
    // near surface: warm (full spectrum)
    // mid-depth: green-blue (red absorbed)
    // deep: blue only (green absorbed)
    absorptionRed: 0.15,     // absorption rate per unit depth
    absorptionGreen: 0.06,
    absorptionBlue: 0.02,
  },

  fog: {
    // Underwater "fog" = particulate scatter in water
    // Much denser than air fog — visibility limited
    near: 5,
    far: 40,                  // tight — underwater visibility
    color: '#0a2a30',         // deep teal
    density: 0.015,           // dense underwater scatter
    // Depth-varying fog color (absorption model)
    nearColor: '#1a4a4a',     // greenish near surface
    farColor: '#050d18',      // deep blue-black at depth
  },

  postFX: {
    bloom: { threshold: 0.5, intensity: 0.8, levels: 8 },  // strong — light scatter in water
    grain: { intensity: 0.04 },           // subtle — underwater is smooth
    vignette: { darkness: 0.7, offset: 0.25 },   // heavy edges — peering through water
    ca: { offset: [0.003, 0.0015], radialModulation: true },  // underwater lens distortion
    toneMapping: 'AGX',       // dreamy underwater
    kuwahara: { enabled: false },
    godRays: { enabled: false },     // no god rays — caustics replace them
    dof: {
      enabled: true,
      // MACRO DOF — extreme shallow depth, the defining visual
      // Stolen from: ocean-cliff DOF v3 but pushed further
      focusDistance: 6,        // very close focus (macro lens)
      focusRange: 1.0,        // extremely narrow — macro photography
      bokehScale: 7.0,        // heavy bokeh — objects dissolve into color
    },
    ssao: { enabled: true },
    // Custom: caustic overlay as additive post-FX layer
    causticOverlay: { enabled: true },
  },

  camera: {
    pathType: 'descending-spiral',
    // Spiral descent into the pool
    // Start: above the pool rim, looking down
    // End: at the bottom, looking up at caustic-painted surface
    heightOffset: 0.5,        // very close to surfaces (macro perspective)
    dampingFactor: 1.0,       // smooth, slow — underwater movement
    fov: 55,                  // slightly wide — immersive macro
    controlPoints: [
      [0, 7.5, 0],           // SURFACE — rim of the pool, looking down
      [3, 5.5, -8],          // DESCENDING — breaking surface, anemones appear
      [-2, 3.5, -18],        // IMMERSION — among the anemone forest, caustics everywhere
      [4, 1.5, -30],         // DEEP — rock floor, starfish territory, colors shifting
      [1, 0.5, -42],         // CREVICE — bottom of pool, bioluminescence, looking up
    ],
    // Subtle underwater sway — camera never perfectly still
    sway: {
      enabled: true,
      frequency: 0.5,        // very slow
      amplitude: 0.03,       // barely perceptible
    },
  },

  scoreSheets: {
    enabled: false,   // no score sheets underwater — they'd dissolve
  },

  figure: {
    enabled: false,   // you are the viewer, shrunk to the size of a shrimp
  },

  audio: {
    ambient: 'underwater',    // muffled water sounds, distant waves above
    musicTrigger: { threshold: 0.3 },
    track: {
      title: 'Tidal Memory',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null,   // placeholder — wire when MP3 available
    },
  },

  dominantColor: '#0a4a5a',   // deep teal
}
