// Ghibli Painterly — Store / Collect
// Emotional temperature: The Fall and Acceptance
// "The sun is rising as he is falling,
//  but his life has never felt brighter."

export default {
  id: 'ghibli-painterly',
  name: 'Ghibli Painterly',
  route: '/collect',
  emotion: 'The Fall and Acceptance',
  tagline: 'hyper-vivid, the world rendered as feeling',

  // What the viewer feels:
  // The world becomes hyper-vivid. Like a memory that's more real than reality.
  // Everything has brushstroke texture. Colors are impossible.
  // This is where the music becomes a physical object you can hold.

  terrain: {
    type: 'simplex-layers-stylized',
    octaves: 3, // lower detail — stylized
    celShaded: true,
    colorBands: 3,
    // Moss/grass texture blending: altitude-based
    textureBlendLevels: [20, 50, 60, 85],
  },

  sky: {
    type: 'cel-dome',
    // Hand-painted gradient, not Preetham
    zenithColor: [0.25, 0.45, 0.75],  // warm blue
    midColor: [0.65, 0.55, 0.40],     // warm amber
    horizonColor: [0.85, 0.70, 0.40], // amber
    clouds: {
      type: 'billboard', // flat textured planes, billboarded
    },
    sunElevation: 25,
  },

  grass: {
    enabled: true,
    bladeCount: 40000,
    baseColor: [0.08, 0.25, 0.06],
    tipColor: [0.30, 0.60, 0.15],
    windSpeed: 0.8,
    celShading: {
      enabled: true,
      bands: 4,
      thresholds: [0.6, 0.35, 0.001],
    },
  },

  flowers: {
    enabled: true,
    count: 600,
    palette: ['#4a8d7e', '#377f6a', '#184f52', '#143b36'], // Ghibli greens
    celShading: true,
  },

  particles: {
    fireflies: { enabled: false },
    dust: { enabled: true, count: 150 },
    rain: { enabled: false },
    spray: { enabled: false },
    petals: { enabled: true, count: 300 }, // falling cherry blossom
  },

  lighting: {
    sunColor: [1.0, 0.95, 0.80],
    sunIntensity: 1.8,
    ambientIntensity: 0.20,
    // Flat cel light — world-space, not view-space
    celLighting: true,
  },

  fog: {
    near: 25,
    far: 150,
    color: '#1a2018', // green tint
    density: 0.002,
  },

  postFX: {
    bloom: { threshold: 0.5, intensity: 0.6, levels: 8 },
    grain: { intensity: 0.06 }, // subtle under Kuwahara
    vignette: { darkness: 0.6, offset: 0.35 },
    ca: { offset: [0.002, 0.001] },
    toneMapping: 'ACES_FILMIC',
    kuwahara: {
      enabled: true, // THE differentiator
      radius: 6,
      alpha: 25,
      quantizeLevels: 16,
      saturation: 1.8,
    },
    godRays: {
      enabled: true,
      numSamples: 50,
      decay: 0.97,
      exposure: 0.8,
    },
    dof: { enabled: false },
    ssao: { enabled: false },
  },

  camera: {
    pathType: 'spiral',
    // Spiral or orbital around the store scene
    // Products enter view one at a time
    heightOffset: 2.5,
    dampingFactor: 2,
    fov: 50,
    controlPoints: [
      [0, 0, 0],
      [10, 0, -10],
      [5, 0, -25],
      [-5, 0, -35],
      [-10, 0, -20],
      [0, 0, -45],
    ],
  },

  scoreSheets: {
    enabled: true,
    count: 2,
    type: 'projected', // projected onto 3D surfaces
  },

  figure: {
    enabled: true,
    type: 'walking',
    celShading: { bands: 4, thresholds: [0.6, 0.35, 0.001] },
    distance: 'far', // small in frame
  },

  water: {
    enabled: true, // optional small stream/pond
    type: 'stylized',
  },

  audio: {
    ambient: null,
    musicTrigger: { threshold: 0.3 }, // music as primary driver
    track: {
      title: 'The Fall',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null, // placeholder — wire when MP3 available
    },
  },

  dominantColor: '#4a8d7e', // saturated green
}
