// Night Meadow — About / Story
// Emotional temperature: Bittersweet Letting Go
// "Knowing that someday this pain will be joined with peace
//  and more beauty than I can imagine."

export default {
  id: 'night-meadow',
  name: 'Night Meadow',
  route: '/story',
  emotion: 'Bittersweet Letting Go',
  tagline: 'stars, fireflies, stillness after grief',

  // What the viewer feels:
  // The same meadow, but at night. What was golden is now silver-blue.
  // What was wind is now stillness. The fireflies are the only warmth.
  // This is where you learn who made the music that found your locked rooms.

  terrain: {
    type: 'simplex-layers',
    // Same terrain as Golden Meadow — literally the same place, different time
    octaves: 5,
    frequencies: [1.25, 2.5, 5, 10, 20],
    amplitudes: [1.0, 0.5, 0.25, 0.125, 0.0625],
    smoothPasses: 3,
    smoothSigma: 2.5, // slightly dreamier
    heightRatio: 0.06,
    size: 400,
    vertexColor: [0.02, 0.05, 0.08], // dark green-blue tint
  },

  sky: {
    type: 'night-atmosphere',
    // glsl-atmosphere with iSun=5.0, pSun below horizon
    sunElevation: -30,      // deep night
    tealTint: [3.0e-6, 18.0e-6, 22.0e-6], // boost green+blue Rayleigh
    stars: {
      enabled: true,
      sharpness: 50,
      size: 10,
      falloff: 15,
      visibility: 450,
    },
    moon: {
      enabled: true,
      sharpness: 12000,
      size: 5000,
    },
  },

  grass: {
    enabled: true,
    bladeCount: 60000,      // slightly less than day
    baseColor: [0.01, 0.04, 0.03],  // near-black teal
    tipColor: [0.05, 0.12, 0.08],   // dark blue-green
    windSpeed: 0.3,          // slow — stillness
  },

  flowers: {
    enabled: false, // night blooms are too literal
  },

  particles: {
    fireflies: {
      enabled: true,
      count: 800,            // more than meadow — they ARE the warmth
      color: [0.83, 0.79, 0.41],
      brightness: 2.0,       // brighter
      bobSpeed: 0.5,         // slower bob
      driftRadius: 3.0,      // wider drift
    },
    dust: { enabled: false },
    rain: { enabled: false },
    spray: { enabled: false },
  },

  lighting: {
    sunColor: [0.3, 0.35, 0.5],  // moonlight — blue-white
    sunIntensity: 0.4,
    ambientIntensity: 0.06,       // barely lit
  },

  fog: {
    near: 10,
    far: 80,
    color: '#0a0a12', // blue-black
    density: 0.008,
  },

  postFX: {
    bloom: { threshold: 0.6, intensity: 0.5 }, // fireflies glow strongly
    grain: { intensity: 0.08 },                 // noisier, more filmic
    vignette: { darkness: 0.8, offset: 0.3 },   // heavy edge darkening
    ca: { offset: [0.001, 0.0005] },
    toneMapping: 'UNCHARTED2', // moodier compression
    kuwahara: { enabled: false },
    godRays: { enabled: false },
    dof: { enabled: false },
    ssao: { enabled: true },
  },

  camera: {
    pathType: 'slow-push',
    // Slow push forward through dark field
    // Lower to ground, intimate, immersed in grass
    heightOffset: 1.2,
    dampingFactor: 1.5,
    fov: 50,
    controlPoints: [
      [0, 0, 0],
      [2, 0, -20],
      [-1, 0, -40],
      [3, 0, -60],
      [0, 0, -80],
    ],
  },

  scoreSheets: {
    enabled: true,
    count: 3,
    type: 'ground', // scattered on ground, softly lit from above
    emissiveRim: true,
  },

  figure: {
    enabled: false, // you ARE the viewer
  },

  audio: {
    ambient: 'night', // crickets, distant wind, silence
    musicTrigger: { threshold: 0.4 },
    track: {
      title: 'Letting Go',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null, // placeholder — wire when MP3 available
    },
  },

  dominantColor: '#2a3a5a', // blue-silver
}
