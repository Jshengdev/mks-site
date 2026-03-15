// Paper World — Contemplation / Fold
// Emotional temperature: Quiet Contemplation
// "The memory of making something with your hands.
//  The reverence of a blank page before the first mark."

export default {
  id: 'paper-world',
  name: 'Paper World',
  route: '/fold',
  emotion: 'Quiet Contemplation',
  tagline: 'white on white, depth through shadow alone',

  // What the viewer feels:
  // Everything is paper. The mountains are folds. The sky is the back of a page.
  // You exist inside an origami landscape that unfolds as you scroll.
  // Shadows are the only color. Light passing through paper edges
  // is the only warmth. The score sheets scattered in the valleys
  // are the reason this world was folded into existence.
  //
  // The absence of color IS the aesthetic. In a world where every
  // other environment shouts with atmosphere, this one whispers.
  // Depth comes from shadow alone. SSAO is the hero effect.

  terrain: {
    type: 'paper-fold',
    // Low-poly, flat-shaded — triangular facets = paper faces
    // Fewer segments (64 vs 128) makes facets large and visible
    // Height quantization in the height function creates flat planes
    flatShading: true,     // CRITICAL — makes facets visible as paper
    size: 300,
    // Cream/ivory vertex colors with height + slope variation
    // Warm cream peaks, cool cream valleys, shadow in crease zones
    vertexColor: [0.96, 0.94, 0.89],  // fallback cream
  },

  sky: {
    type: 'preetham',
    // Overcast, diffuse light — no harsh sun, soft shadows everywhere
    // Like a room with large windows, not direct sunlight
    turbidity: 8.0,        // hazy, diffuse
    rayleigh: 0.3,         // low scattering — muted sky, not blue
    mieCoefficient: 0.005,
    sunElevation: 25,      // moderate — need shadows for depth but not harsh
  },

  grass: {
    enabled: false, // Paper doesn't grow. The terrain IS the surface.
  },

  flowers: {
    enabled: false, // No organic elements. Everything is folded geometry.
  },

  particles: {
    fireflies: { enabled: false },
    dust: {
      enabled: true,
      count: 120,
      // Paper confetti — small scraps catching light as they drift
      // Cream-colored to match the paper world
    },
    rain: { enabled: false },
    spray: { enabled: false },
    petals: {
      enabled: true,
      count: 180,
      // Paper cranes drifting — the petal system tumbles flat particles,
      // which reads as origami cranes at a distance
      // Slightly warmer cream than the terrain to catch light
    },
  },

  lighting: {
    // The lighting is THE design tool in a monochrome world
    // Warm white like tungsten light through rice paper
    sunColor: [1.0, 0.97, 0.92],
    sunIntensity: 1.2,
    // HIGH ambient — paper world is evenly lit, shadows are subtle not harsh
    // This + SSAO creates "shadow IS depth" look
    ambientIntensity: 0.45,
  },

  fog: {
    near: 30,
    far: 180,
    color: '#f0ece4',    // Cream fog — matches paper
    density: 0.004,
  },

  postFX: {
    // SSAO is THE hero effect — fold shadows define the entire visual
    // In a white-on-white world, ambient occlusion IS the rendering
    bloom: { threshold: 0.85, intensity: 0.15, levels: 6 },  // barely there
    grain: { intensity: 0.12, interval: 30 },    // paper grain texture — higher than usual
    vignette: { darkness: 0.25, offset: 0.45 },  // light vignette — don't darken the white
    ca: { offset: [0.0008, 0.0004] },             // minimal — clean, precise
    toneMapping: 'ACES_FILMIC',
    kuwahara: { enabled: false },                  // paper is crisp, not painterly
    godRays: {
      enabled: true,
      // Light streaming between/through paper folds
      // The geometric peaks create natural occlusion for god rays
      numSamples: 40,
      decay: 0.96,
      exposure: 0.5,
    },
    dof: {
      enabled: true,
      focusDistance: 5,    // close focus — intimate with the paper surface
      focusRange: 2.5,     // moderate range
      bokehScale: 3.5,     // soft bokeh — contemplative
    },
    ssao: {
      enabled: true,
      // SSAO is the hero effect for paper world
      // Without it, the white-on-white world has no readable depth
      // High radius creates broad fold shadows; high intensity makes them definitive
    },
  },

  camera: {
    pathType: 'descend-and-rise',
    // Start above the paper landscape (bird's eye of the blank page)
    // Descend into the folds (intimate, enclosed by paper walls)
    // Rise back out (release, acceptance)
    heightOffset: 1.5,
    dampingFactor: 1.0,    // smooth, contemplative movement
    fov: 42,               // slightly narrow — focused, contemplative
    controlPoints: [
      [0, 5, 0],           // BLANK PAGE — above, looking down at white expanse
      [5, 2.5, -22],       // FIRST CREASE — descending toward the first folds
      [-3, 0.5, -48],      // ORIGAMI BLOOM — low, among the paper peaks
      [2, -0.3, -68],      // INSIDE THE FOLD — in a valley, paper walls rising around
      [0, 3, -95],         // RELEASE — rising back up, light flooding in from above
    ],
  },

  scoreSheets: {
    enabled: true,
    count: 5,
    // MORE score sheets than any other world — they're the reason this world exists
    // In a paper world, score sheets aren't props, they're sacred objects
    // The music was written on paper. The world IS paper. Full circle.
    type: 'ground',
  },

  figure: {
    enabled: false, // You ARE the viewer. Your scroll IS the folding.
  },

  audio: {
    ambient: 'paper',      // Paper rustling, soft creasing, the sound of hands making
    musicTrigger: { threshold: 0.30 },
    track: {
      title: 'Quiet Hands',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null,  // placeholder — wire when MP3 available
    },
  },

  dominantColor: '#f0ece4', // Cream/ivory
}
