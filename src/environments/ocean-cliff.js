// Ocean Cliff — Music / Listen
// Emotional temperature: Peaceful Heartache
// "A goodbye where both protagonists don't want to leave,
//  but they know it'd be better to free each other."

export default {
  id: 'ocean-cliff',
  name: 'Ocean Cliff',
  route: '/listen',
  emotion: 'Peaceful Heartache',
  tagline: 'vast calm, horizon dissolving',

  // What the viewer feels:
  // You sit at the edge of something infinite. The ocean is the feeling
  // you can't name. The horizon is the future you can't see.
  // The figure sitting there is you, or Mike, or both.

  terrain: {
    type: 'simplex-layers-cliff',
    // Two-part: cliff geometry + flat ocean plane
    // Cliff uses SimplexLayers with Edges(direction=false) for island edges
    // Stone at slopes > 36deg (acos(dot(normal, up)) > 0.628)
    cliffGrassCount: 20000, // sparse, cliff-top only
  },

  sky: {
    type: 'preetham-dusk',
    turbidity: 1.5,
    rayleigh: 0.8,
    mieCoefficient: 0.01,
    sunElevation: -5, // below horizon
    stars: {
      enabled: true,
      gridSize: 64,       // per cube face
      brightnessExp: 6,   // pow(random, 6) for rare bright stars
      maxOffset: 0.43,    // jitter within grid cell
      fadeFactor: 15.0,   // exp(-skyBrightness * fadeFactor)
    },
  },

  ocean: {
    enabled: true,
    type: 'stylized', // Path B — Ashima simplex, binary threshold, cartoon foam
    size: 500,         // large — infinity feel from cliff top
    waterLevel: -0.5,  // cliff drops to -1.5, ocean sits above cliff floor
    colorNear: 0x0a2e3d,   // dark teal
    colorFar: 0x050d1a,    // deep midnight
    foamFrequency: 2.8,
    foamThreshold: [0.08, 0.001], // smoothstep range
    waveLineThreshold: 0.6,
    bobAmplitude: 0.1,
    bobSpeed: 1.2,
  },

  grass: {
    enabled: true,
    bladeCount: 20000,     // cliff-top only, sparse
    baseColor: [0.02, 0.06, 0.06],   // dark teal-grey cliff grass
    tipColor: [0.06, 0.14, 0.12],    // muted teal tips
    windSpeed: 0.5,
  },

  flowers: {
    enabled: false, // cliff edge, no flowers
  },

  particles: {
    fireflies: { enabled: false },
    dust: { enabled: false },
    rain: { enabled: false },
    spray: { enabled: true, count: 100, color: [1.0, 1.0, 1.0] },
    fogWisps: { enabled: true, count: 50 },
  },

  lighting: {
    sunColor: [0.45, 0.50, 0.65],  // cool blue-steel
    sunIntensity: 0.8,
    ambientIntensity: 0.10,
  },

  fog: {
    near: 20,
    far: 200,
    color: '#050d1a', // teal
    density: 0.003,
  },

  postFX: {
    bloom: { threshold: 0.8, intensity: 0.3 },
    grain: { intensity: 0.04 },
    vignette: { darkness: 0.5, offset: 0.3 },
    ca: { offset: [0.001, 0.0005] },
    toneMapping: 'AGX', // dreamy
    kuwahara: { enabled: false },
    godRays: { enabled: false },
    dof: {
      enabled: true,
      focusDistance: 8,    // exp-022 DOF v3 — intimate, close-up focus
      focusRange: 1.5,     // narrow DOF — sharp subject, soft everything else
      bokehScale: 5.5,     // heavy bokeh — cinematic "faded memory" quality
    },
    ssao: { enabled: true },
  },

  camera: {
    pathType: 'arc',
    // Arc around seated figure, settling into over-shoulder
    // Start: behind/above -> End: beside, eye level
    heightOffset: 2.5,
    dampingFactor: 0.5, // very cinematic lag
    fov: 40,
    controlPoints: [
      [15, 8, 10],     // behind, above
      [12, 5, -5],     // moving around
      [5, 3, -15],     // closer, lower
      [2, 2, -20],     // beside, eye level
      [-1, 1.8, -22],  // slightly past, intimate
    ],
  },

  scoreSheets: {
    enabled: true,
    count: 2,
    type: 'pinned', // pinned to rock face
  },

  figure: {
    enabled: true,
    type: 'seated',    // silhouette sitting at cliff edge
    facing: 'ocean',   // back to camera
    celShading: { bands: 4, thresholds: [0.6, 0.35, 0.001] },
  },

  audio: {
    ambient: 'ocean', // looping wave sounds
    musicTrigger: { threshold: 0.5 },
    track: {
      title: 'Through the Veil',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null, // placeholder — wire when MP3 available
    },
  },

  dominantColor: '#0a2e3d', // teal/midnight
}
