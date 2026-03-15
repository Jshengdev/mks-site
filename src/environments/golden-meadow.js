// Golden Meadow — Landing / Introduction
// Emotional temperature: Innocent Awakening
// "She opened her eyes that day, but she also opened their soul."

export default {
  id: 'golden-meadow',
  name: 'Golden Meadow',
  route: '/',
  emotion: 'Innocent Awakening',
  tagline: 'warmth surfacing from cold',

  // What the viewer feels:
  // The meadow exists before you arrive. You enter a world already in motion.
  // The wind was already blowing. The light was already golden.
  // You were always meant to be here.

  terrain: {
    type: 'simplex-layers',
    octaves: 5,
    frequencies: [1.25, 2.5, 5, 10, 20],
    amplitudes: [1.0, 0.5, 0.25, 0.125, 0.0625],
    smoothPasses: 3,
    smoothSigma: 2,
    heightRatio: 0.06,
    size: 400,
    // Warm earthy vertex colors — visible between grass blades and on distant hills
    // [valley, hillside, hilltop] — amber/gold identity
    colorPalette: [
      [0.08, 0.06, 0.03],   // dark warm soil (valleys)
      [0.18, 0.14, 0.06],   // golden-brown hillside
      [0.22, 0.18, 0.08],   // amber hilltop catching light
    ],
  },

  sky: {
    type: 'preetham',
    turbidity: 3.0,
    rayleigh: 1.5,
    mieCoefficient: 0.01,
    sunElevation: 15,
  },

  grass: {
    enabled: true,
    bladeCount: 100000,
    baseColor: [0.06, 0.20, 0.03],
    tipColor: [0.25, 0.55, 0.12],
    windSpeed: 1.0,
  },

  flowers: {
    enabled: true,
    count: 800,
    colorTypes: 6,
  },

  particles: {
    fireflies: { enabled: true, count: 500, color: [0.83, 0.79, 0.41] },
    dust: { enabled: true, count: 200 },
    rain: { enabled: false },
    spray: { enabled: false },
  },

  lighting: {
    sunColor: [1.0, 0.90, 0.70],
    sunIntensity: 1.6,
    ambientIntensity: 0.16,
  },

  fog: {
    near: 15,
    far: 120,
    color: '#1a1208',
    density: 0.003,
  },

  postFX: {
    bloom: { threshold: 0.5, intensity: 0.6, levels: 8 },
    grain: { intensity: 0.06, interval: 42 },
    vignette: { darkness: 0.6, offset: 0.35 },
    ca: { offset: [0.002, 0.001], radialModulation: true },
    toneMapping: 'ACES_FILMIC',
    kuwahara: { enabled: false },
    godRays: { enabled: true },
    dof: { enabled: true },  // exp-082: DOF narrative arc (dream→awakening→intimate→memory)
    ssao: { enabled: true },
  },

  camera: {
    pathType: 's-curve',
    heightOffset: 2.0,
    dampingFactor: 2,
    fov: 45,
    controlPoints: [
      [0, 0, 0],
      [6, 0, -25],
      [-4, 0, -50],
      [8, 0, -75],
      [-6, 0, -100],
      [4, 0, -130],
      [0, 0, -160],
    ],
  },

  scoreSheets: {
    enabled: true,
    count: 3,
    type: 'cloth', // Verlet physics, wind-driven
  },

  figure: {
    enabled: false, // you ARE the viewer
  },

  audio: {
    ambient: null,
    musicTrigger: { threshold: 0.35 },
    track: {
      title: 'In a Field of Silence',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null, // resolved at runtime via ES import
    },
  },

  dominantColor: '#d4a830', // amber/gold
}
