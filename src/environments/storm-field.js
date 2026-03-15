// Storm Field — Tour / Witness
// Emotional temperature: The Search
// "Running through whatever obstacles are presented...
//  breath comes in a little harder...
//  ears strain to hear the next note."

export default {
  id: 'storm-field',
  name: 'Storm Field',
  route: '/witness',
  emotion: 'The Search',
  tagline: 'wind, urgency, darkness clearing',

  // What the viewer feels:
  // Urgency. The wind is loud. The grass is fighting to stand.
  // Rain hits. Lightning illuminates everything for a split second.
  // You're moving faster. Breath comes harder. You're searching.
  // The tour dates are the answer — go witness it in person.

  terrain: {
    type: 'diamond-square',
    // Sharp peaks/valleys, minimal smoothing
    smoothPasses: 1,
    // Dark earth colors, no green
    vertexColor: [0.04, 0.04, 0.03],
  },

  sky: {
    type: 'overcast',
    turbidity: 8.0,
    rayleigh: 0.5,
    sunElevation: 5, // low, obscured
    fogMatchColor: [0.04, 0.04, 0.06], // HSL(0.6, 0.15, 0.04)
    clouds: {
      type: 'volumetric',
      // Beer Shadow Maps, 4-layer system
      coverage: 0.7, // heavy overcast
      layers: 4,
    },
    lightning: {
      enabled: true,
      decayMs: 200,   // flash white -> decay
      interval: [8000, 20000], // random ms between strikes
    },
  },

  grass: {
    enabled: true,
    bladeCount: 50000,
    baseColor: [0.03, 0.04, 0.02],  // dark, no green
    tipColor: [0.08, 0.10, 0.06],
    windSpeed: 3.0,       // violent
    bendStrength: 0.8,    // low to ground, blown flat
  },

  flowers: {
    enabled: false, // stripped bare by wind
  },

  particles: {
    fireflies: { enabled: false },
    dust: { enabled: false },
    rain: {
      enabled: true,
      count: 2000,
      velocity: [0.5, -15.0, 0.5],  // fast downward
      lengthFactor: 3.0,             // elongated streaks
    },
    spray: { enabled: false },
    lightningSparks: {
      enabled: true,
      count: 50,    // burst on lightning event
      decayMs: 500,
    },
  },

  lighting: {
    sunColor: [0.25, 0.25, 0.30],  // dim grey
    sunIntensity: 0.3,
    ambientIntensity: 0.05,
    // Lightning flashes handled separately
  },

  fog: {
    near: 15,
    far: 60, // tight — oppressive
    color: '#0a0a0f', // dark grey
    density: 0.012,
  },

  postFX: {
    bloom: { threshold: 1.0, intensity: 0.1 }, // disabled effectively
    grain: { intensity: 0.10 },                  // grainy, stressed
    vignette: { darkness: 0.9, offset: 0.25 },   // darkest edges
    ca: { offset: [0.003, 0.0015] },              // lens stress
    toneMapping: 'UNCHARTED2',
    kuwahara: { enabled: false },
    godRays: { enabled: false }, // no sun visible
    dof: { enabled: false },
    ssao: { enabled: true },
  },

  camera: {
    pathType: 'urgent-push',
    // Urgent forward push — faster scroll-to-movement ratio
    // Lower to ground, slight shake
    heightOffset: 1.0,
    dampingFactor: 3,  // responsive, not floaty
    fov: 55,           // wider = more immersive
    shake: {
      enabled: true,
      frequency: 30,   // Math.sin(time * 30) * amplitude
      amplitude: 0.02,
    },
    controlPoints: [
      [0, 0, 0],
      [3, 0, -30],
      [-2, 0, -55],
      [4, 0, -80],
      [0, 0, -110],
      [-3, 0, -140],
    ],
  },

  scoreSheets: {
    enabled: true,
    count: 4,
    type: 'torn', // torn, blowing away
  },

  figure: {
    enabled: false, // you ARE the viewer, running
  },

  audio: {
    ambient: 'storm',  // constant wind, layered gusts
    thunder: {
      enabled: true,
      triggerOnScroll: true, // at scroll milestones
    },
    musicTrigger: { threshold: 0.4 },
    track: {
      title: 'The Search',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null, // placeholder — wire when MP3 available
    },
  },

  dominantColor: '#1a1a20', // dark grey
}
