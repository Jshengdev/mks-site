// Floating Library — Archive / Collection
// Emotional temperature: Sacred Knowledge
// "A vast library suspended in clouds. Books drift weightlessly,
//  pages turning in slow wind. The shelves are impossible —
//  Escher-like perspectives that shift as you scroll.
//  Score sheets are the books — Michael's music IS the collection."

export default {
  id: 'floating-library',
  name: 'Floating Library',
  route: '/archive',
  emotion: 'Sacred Knowledge',
  tagline: 'every note is a book you forgot you wrote',

  // What the viewer feels:
  // You enter darkness. Something vast is here — you feel it before you see it.
  // Then: warm lamplight. Books resolving from fog. Pages drifting past your face.
  // You spiral upward through stacks that shouldn't be possible.
  // The music IS the collection. Each composition is a volume on these shelves.
  // At the top, looking down through the whole library, you realize:
  // you were always part of this archive.

  terrain: {
    type: 'cloud-floor',
    // The "ground" is a cloud bank far below — the library floats above it
    // Camera starts near this level and spirals upward
    size: 300,
    heightRatio: 0.01, // nearly flat — gentle billowing
    vertexColor: [0.06, 0.04, 0.02], // deep warm brown haze
  },

  sky: {
    type: 'interior-void',
    // No traditional sky — this is an interior space with no visible ceiling
    // Deep dark void above, warm amber haze at distance
    // Stars repurposed as distant lamp reflections between shelves
    sunElevation: -15, // below horizon — no direct sun in an interior
    turbidity: 2.0,
    rayleigh: 0.2,
    mieCoefficient: 0.005,
    stars: {
      enabled: true,
      // NOT stars — distant lamp sparkles caught between shelves
      // Like cathedral dust catching window light
      gridSize: 32,
      brightnessExp: 4,    // fewer bright ones
      maxOffset: 0.5,
      fadeFactor: 8.0,
    },
  },

  // ─── Custom: Floating library shelves ───
  // (Needs new subsystem: FloatingLibrary.js — InstancedMesh shelves + books)
  // For now, worldEngine falls back to existing subsystems.
  // Score sheets serve as the "books" and are heavily featured.
  library: {
    enabled: true,
    shelfLayers: 7,         // vertical tiers of impossible shelves
    shelfSpacing: 4.0,      // Y distance between tiers
    shelfWidth: [8, 15],    // min/max width
    bookCount: 200,          // instanced books resting on shelves
    floatingBookCount: 40,   // books drifting free (weightless)
    driftSpeed: 0.002,       // glacial drift of free books
    rotationSpeed: 0.001,    // shelf clusters rotate glacially
    escherTwist: 0.15,       // perspective distortion per scroll (vertex displacement)
    // Materials: dark wood (#2a1a0a), aged paper (#e8dcc8), gold leaf accents (#d4a050)
    woodColor: [0.16, 0.10, 0.04],
    paperColor: [0.91, 0.86, 0.78],
    goldAccent: [0.83, 0.63, 0.31],
  },

  grass: {
    enabled: false, // no grass in a library — the floor is clouds
  },

  flowers: {
    enabled: false, // no flowers — books are the organic life here
  },

  particles: {
    fireflies: {
      enabled: true,
      count: 150,
      // Repurposed: warm lamp glows floating between shelves
      // NOT insects — steady, warm, barely moving light sources
      // "Lamplight from nowhere" — each is a reading lamp that doesn't exist
      color: [0.95, 0.78, 0.42],  // warm incandescent amber
      brightness: 1.5,
      bobSpeed: 0.15,    // barely perceptible — these are lamps, not fireflies
      driftRadius: 0.5,  // nearly still — steady light sources
    },
    dust: {
      enabled: true,
      count: 400,
      // Repurposed: "words escaping pages"
      // Tiny bright motes that drift upward (not downward like normal dust)
      // The metaphor: knowledge released, becoming light
      // Use DustMotes system with warm white color, upward drift bias
    },
    rain: { enabled: false },
    spray: { enabled: false },
    // Custom particle: page flutter (needs PetalSystem adaptation)
    pageFlutter: {
      enabled: true,
      count: 80,
      // Individual pages drifting free from books
      // Like petals but: rectangular silhouette, slower tumble, catching lamplight
      // Fall speed 0.3 (vs petal 0.8) — nearly weightless
      color: [0.92, 0.88, 0.78],  // aged paper
      tumbleSpeed: 0.3,
      // Source: adapt PetalSystem vertex shader with slower fall, wider flutter
    },
  },

  lighting: {
    // No directional sun — only ambient + the "lamp" firefly system
    // The warmth comes from EVERYWHERE and NOWHERE
    sunColor: [0.95, 0.78, 0.42],   // warm amber direction (faked — no visible source)
    sunIntensity: 0.6,               // dim directional — just for shadow direction
    ambientIntensity: 0.08,          // very dim base — dark between the lamps
    // The firefly/lamp system provides the real illumination
  },

  fog: {
    near: 8,
    far: 60,
    color: '#0f0a06', // very dark warm brown — deep library darkness
    density: 0.015,   // thick — shelves fade into warm void at distance
  },

  postFX: {
    bloom: {
      threshold: 0.45,
      intensity: 0.8,   // high — lamp glows should halo strongly
      levels: 8,
    },
    grain: { intensity: 0.08 },     // old library film feeling
    vignette: {
      darkness: 0.85,               // heavy — intimate reading space
      offset: 0.25,
    },
    ca: { offset: [0.001, 0.0005] }, // subtle lens imperfection
    toneMapping: 'ACES_FILMIC',      // warm compression
    kuwahara: { enabled: false },    // no painterly — this world is atmospheric, not stylized
    godRays: { enabled: false },     // no directional light to cast them
    dof: {
      enabled: true,
      focusDistance: 6,    // focus on nearest shelf/book
      focusRange: 2.0,    // moderate — readable zone around focus
      bokehScale: 4.5,    // beautiful warm bokeh on distant shelves
    },
    ssao: { enabled: true },         // critical — depth between shelves, books, stacks
    colorGrade: {
      warmth: 0.08,      // warm shift across everything
      contrast: 0.10,
      vibrance: 0.2,     // muted — library palette is restrained
    },
  },

  camera: {
    pathType: 'spiral-ascend',
    // Spiral upward through the stacks
    // Start: ground level near cloud floor, looking up into infinite shelves
    // Mid: among the books, surrounded, intimate
    // End: high point, looking down through the library's impossible depth
    heightOffset: 1.5,
    dampingFactor: 1.0,      // moderate — deliberate, studious movement
    fov: 42,                 // slightly narrow — focused, intimate
    controlPoints: [
      [0, 0, 0],             // ENTRANCE — cloud floor, looking up into void
      [8, 6, -15],           // RECOGNITION — first shelf tier, books resolve from fog
      [-6, 14, -30],         // IMMERSION — mid-stacks, surrounded by warm light
      [7, 22, -20],          // REVELATION — high, impossible geometry visible
      [0, 28, -10],          // BELONGING — highest point, looking down through all layers
    ],
  },

  scoreSheets: {
    enabled: true,
    count: 8,              // MORE than any other world — these ARE the collection
    type: 'floating',      // drifting free between shelves, not pinned or on ground
    emissiveRim: true,     // warm glow at edges — catching lamplight
  },

  figure: {
    enabled: true,
    type: 'seated',        // reading at a desk deep in the stacks
    facing: 'desk',        // back to camera, absorbed in a score
    celShading: { bands: 4, thresholds: [0.6, 0.35, 0.001] },
  },

  audio: {
    ambient: 'library',    // soft page rustling, distant hum, breathing silence
    musicTrigger: { threshold: 0.35 },
    track: {
      title: 'The Archive',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null, // placeholder — wire when MP3 available
    },
  },

  dominantColor: '#d4a050', // warm amber lamplight
}
