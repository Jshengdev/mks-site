// Volcanic Observatory — Hidden World (unlockable)
// Emotional temperature: Awe at the Threshold of Understanding
// "Beauty born from destruction. The telescope points at something
//  the viewer never sees. Fire below. Ice above. The contrast IS the music."

export default {
  id: 'volcanic-observatory',
  name: 'Volcanic Observatory',
  route: '/observe',
  emotion: 'Awe at the Threshold of Understanding',
  tagline: 'fire below, ice above, beauty born from destruction',

  // What the viewer feels:
  // You stand on the rim of a dormant volcano. Below: a lake of cooling lava
  // that pulses with deep orange light. Above: an impossibly clear night sky —
  // every star visible. A glass observatory sits on the rim. Its telescope
  // points at something you never see. The warmth rises from below.
  // The cold descends from above. You are the boundary between creation
  // and entropy. The music lives in that tension.

  terrain: {
    type: 'volcanic-caldera',
    // Inverted gaussian: deep center (lava lake), raised rim, gentle outer slopes
    // Camera walks along the rim
    size: 300,
    vertexColor: [0.04, 0.03, 0.03], // dark basalt
  },

  sky: {
    type: 'night-atmosphere',
    // Lava is the light source from below — sun is absent but not buried
    sunElevation: -10,      // just below horizon — orange glow at rim
    tealTint: [2.0e-6, 8.0e-6, 20.0e-6], // cool blue Rayleigh above
    stars: {
      enabled: true,
      sharpness: 60,        // sharper than night-meadow — impossibly clear
      size: 12,             // larger — every star visible
      falloff: 20,
      visibility: 600,      // max star count — "every star visible"
    },
    moon: {
      enabled: false, // no moon — lava is the only warm light
    },
  },

  // ─── Lava lake (uses StylizedOcean system with lava shader swap) ───
  // Sits in the crater floor below the rim. Adaptation of ocean config.
  lava: {
    enabled: true,
    type: 'magma',            // signals WorldEngine to use lava shaders instead of ocean
    size: 80,                 // smaller than ocean — contained in crater
    lavaLevel: -7.0,          // sits on crater floor
    crustColor: [0.10, 0.04, 0.02],  // cooled dark basalt crust
    moltenColor: [1.0, 0.27, 0.0],   // deep molten orange (#FF4400)
    glowColor: [1.0, 0.53, 0.0],     // bright emission (#FF8800)
    crustFreq: 1.8,
    crustThreshold: 0.35,
    pulseSpeed: 0.3,
    pulseIntensity: 0.4,
    heaveAmplitude: 0.3,
    heaveSpeed: 0.4,
  },

  // ─── Lava cracks (glowing fissures on terrain surface) ───
  // Pulsing orange-red PlaneGeometry strips placed on dark basalt
  lavaCracks: {
    enabled: true,
    count: 40,                // 30-50 cracks across crater surface
    spreadRadius: 50,         // spread across the caldera rim area
    pulseSpeed: 1.5,          // oscillation speed — cooling/heating lava
    pulseIntensity: 0.4,      // amplitude of brightness oscillation
  },

  // Ocean system disabled — lava replaces it
  ocean: {
    enabled: false,
  },

  grass: {
    enabled: false, // nothing grows on volcanic rock
  },

  flowers: {
    enabled: false, // barren
  },

  particles: {
    fireflies: { enabled: false },
    dust: { enabled: false },
    rain: { enabled: false },
    spray: { enabled: false },
    // Embers rising from lava lake — the warm counterpart to stars
    // 1000 instances, additive blending, slow upward drift with wobble
    embers: {
      enabled: true,
      count: 1000,            // full ember field — Basalt Deltas intensity
      riseSpeed: 0.15,        // slow contemplative rise
      brightness: 1.5,        // bright against dark sky
      size: 90,               // larger than fireflies — these are burning sparks
      spawnRadius: 40,        // concentrated around crater
      ceilingHeight: 20,      // die before reaching stars
    },
    // Volcanic ash — slow-falling grey particles
    // 500 instances, NormalBlending (not additive), very low opacity
    ash: {
      enabled: true,
      count: 500,             // atmospheric density
      fallSpeed: 0.8,         // slow descent — volcanic ash drifts
      size: 30,               // small grey flecks
      brightness: 1.0,
      spreadX: 120,           // wide horizontal spread
      spreadZ: 120,
      baseHeight: 15,         // falls from 15m above terrain
    },
  },

  lighting: {
    // Lava below (orange) + starlight above (cool blue-white)
    sunColor: [1.0, 0.4, 0.1],     // orange — lava IS the directional light
    sunIntensity: 1.0,
    ambientIntensity: 0.10,         // warm orange ambient from below
    // Lava point light (wired by WorldEngine if lava.enabled)
    lavaLight: {
      color: [1.0, 0.35, 0.05],    // deep orange
      intensity: 3.0,
      distance: 80,
      position: [0, -5, -60],       // crater center
    },
  },

  fog: {
    near: 20,
    far: 150,
    color: '#261008',   // orange volcanic haze — NOT black
    density: 0.003,
  },

  postFX: {
    bloom: {
      threshold: 0.3,    // low threshold — lava and embers bloom heavily
      intensity: 0.9,     // strong bloom — the glow IS the atmosphere
      levels: 8,
    },
    grain: { intensity: 0.07 },
    vignette: { darkness: 0.7, offset: 0.3 },
    ca: { offset: [0.002, 0.001], radialModulation: true },
    toneMapping: 'ACES_FILMIC', // handles the HDR lava glow well
    kuwahara: { enabled: false },
    godRays: { enabled: false },  // no sun for god rays
    dof: {
      enabled: true,
      focusDistance: 12,    // focused on the lava lake below
      focusRange: 4.0,      // wider than Ocean Cliff — see both fire and stars
      bokehScale: 4.0,      // moderate bokeh — not as dreamy as ocean cliff
    },
    ssao: { enabled: true },
    // Heat distortion — screen-space UV displacement above lava
    // Implemented as post-FX uniform in the existing pipeline
    heatDistortion: {
      enabled: true,
      intensity: 0.008,    // subtle shimmer
      speed: 2.0,
      frequency: 15.0,
    },
  },

  camera: {
    pathType: 'rim-orbit',
    // Orbit along the crater rim, looking inward/downward at lava
    // Start: approaching the rim in darkness
    // Mid: on the rim, full view of fire below + stars above
    // End: near the observatory, pulling away
    heightOffset: 2.0,
    dampingFactor: 1.0,     // medium — contemplative but not sluggish
    fov: 48,                // slightly wide — sense of scale
    controlPoints: [
      [25, 10, -30],       // APPROACH — outer slope, lava glow ahead
      [30, 12, -50],       // ASCENT — climbing to rim
      [25, 12, -65],       // REVELATION — cresting the rim, lava below
      [10, 11, -75],       // WONDER — looking down into the crater
      [-5, 10, -80],       // CONTEMPLATION — near observatory, telescope
      [-15, 11, -70],      // DEPARTURE — pulling away along rim
    ],
  },

  scoreSheets: {
    enabled: true,
    count: 2,
    type: 'pinned', // pinned to observatory glass (like ocean cliff rock face)
  },

  figure: {
    enabled: true,
    type: 'standing',          // silhouette at the telescope
    facing: 'crater',          // looking into the abyss
    celShading: { bands: 3, thresholds: [0.5, 0.2, 0.001] }, // fewer bands, harsher light
  },

  // Observatory glass structure — implied through lighting and camera, not modeled
  // The "glass" is the post-FX: slight chromatic aberration at edges = looking through glass
  // The telescope is what you never see — the mystery

  audio: {
    ambient: 'volcanic',  // deep low-frequency rumble, occasional hiss, distant cracking
    musicTrigger: { threshold: 0.45 },
    track: {
      title: 'The Observatory',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null, // placeholder — wire when MP3 available
    },
  },

  dominantColor: '#ff4400', // molten orange
}
