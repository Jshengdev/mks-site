// Memory Garden — Remember / Mourn
// Emotional temperature: Beautiful Impermanence
// "The garden holds both the bloom and the decay at once.
//  Everything is dissolving even as it appears.
//  This is grief rendered as landscape."

export default {
  id: 'memory-garden',
  name: 'Memory Garden',
  route: '/remember',
  emotion: 'Beautiful Impermanence',
  tagline: 'grief rendered as landscape, bloom and decay at once',

  // What the viewer feels:
  // You walk through a garden that exists in memory.
  // Flowers bloom in seconds and decay just as fast.
  // The grass appears in patches, then dissolves into motes of light.
  // Everything is beautiful because it's leaving.
  // You can't hold any of it — and that IS the beauty.
  // Mono no aware — the pathos of things.

  terrain: {
    type: 'simplex-layers',
    // Gentle garden undulations — smooth, dreamy, curated-then-abandoned
    octaves: 3,              // low detail = soft, rounded
    frequencies: [0.8, 1.6, 3.2],
    amplitudes: [1.0, 0.4, 0.15],
    smoothPasses: 5,         // heavy smoothing = dreamlike
    smoothSigma: 3,
    heightRatio: 0.04,       // subtle hills — a garden, not a landscape
    size: 300,               // smaller than meadow — intimate
    vertexColor: [0.10, 0.08, 0.04], // warm earthy brown — the soil of a fading garden
  },

  sky: {
    type: 'preetham',
    // Warm golden hour drowning in fog — the light of something you're losing.
    // Not purple twilight. WARM. But the fog swallows the warmth.
    turbidity: 8.0,          // hazy — warm haze, not crisp
    rayleigh: 1.8,           // moderate — warm atmosphere, not deep purple
    mieCoefficient: 0.020,   // heavy glow — light diffused through dense fog
    sunElevation: 4,         // low golden hour — warm but sinking
    stars: {
      enabled: true,         // dim stars through warm haze — barely there
      gridSize: 48,
      brightnessExp: 4,
      maxOffset: 0.43,
      fadeFactor: 8.0,
    },
  },

  grass: {
    enabled: true,
    bladeCount: 45000,       // less dense than meadow — garden, not field
    baseColor: [0.15, 0.12, 0.04],   // WARM GOLD — NOT green, NOT purple. Fading golden brown.
    tipColor: [0.25, 0.20, 0.08],    // golden tips — catching the last warm light
    windSpeed: 0.3,          // slow — the garden sighs, doesn't rush
    // FUTURE: dissolve config for noise-based fade in/out
    // dissolve: {
    //   enabled: true,
    //   noiseFreq: 3.5,       // cnoise frequency for dissolve pattern
    //   noiseAmp: 0.8,        // amplitude of dissolve noise
    //   edgeWidth: 0.08,      // glow width at dissolve boundary
    //   edgeColor: [0.6, 0.4, 0.7],  // lavender glow at dissolve edge
    //   scrollModulation: true, // dissolve threshold driven by scroll
    // },
  },

  flowers: {
    enabled: true,
    count: 600,
    colorTypes: 6,
    // Muted warm palette — faded golds, tans, dusty roses. Not vivid, not dead.
    // Colors of flowers you remember but can't quite see — warm tones fading to grey.
    palette: ['#c4a060', '#b8a078', '#c0a880', '#a89878', '#b0a090', '#c4b898'],
    // FUTURE: lifecycle animation config
    // lifecycle: {
    //   enabled: true,
    //   bloomDuration: [1.5, 4.0],   // seconds to fully bloom (randomized range)
    //   decayDuration: [0.8, 2.0],   // seconds to fully decay
    //   cyclePeriod: [3.0, 8.0],     // total lifecycle period (randomized)
    //   stagger: true,                // offset phase per instance
    //   decayToParticles: true,       // on decay, emit particles from flower position
    // },
  },

  particles: {
    fireflies: {
      enabled: true,
      count: 300,              // memory motes — fewer than night meadow
      // Warm amber-gold motes — the residual warmth of what was here
      // These are EMBERS of memory, not spectral ghosts
      color: [0.80, 0.65, 0.30],   // warm amber-gold — fading embers
      brightness: 1.5,
      bobSpeed: 0.3,           // slow, contemplative drift
      driftRadius: 4.0,        // wider drift — memories wander
    },
    dust: {
      enabled: true,
      count: 250,              // memory fragments materializing in air
    },
    rain: { enabled: false },
    spray: { enabled: false },
    petals: {
      enabled: true,
      count: 200,              // constant gentle fall — letting go
      // Slow, drifting petals that dissolve before hitting ground
      // FUTURE: fadeBeforeLanding: true, dissolveHeight: 0.3
    },
  },

  lighting: {
    // Warm amber light filtered through heavy fog — soft, diffuse, fading.
    sunColor: [0.85, 0.65, 0.35],   // warm amber — the garden remembers gold
    sunIntensity: 0.45,              // dim — light eaten by fog
    ambientIntensity: 0.08,          // low — fog absorbs everything
  },

  fog: {
    near: 8,
    far: 60,                         // TIGHT — fog eating everything beyond close range
    color: '#2e2410',                // warm dark amber — golden fog, not purple
    density: 0.025,                  // HEAVY — 8x golden meadow. The defining feature.
  },

  postFX: {
    bloom: { threshold: 0.3, intensity: 0.8, levels: 8 },    // LOW threshold — everything softly glows
    grain: { intensity: 0.10 },       // heavy grain — aged film, imperfect recall
    vignette: { darkness: 0.7, offset: 0.30 },   // moderate tunnel — you see through fog
    ca: { offset: [0.0025, 0.0012], radialModulation: true },
    toneMapping: 'AGX',              // soft rolloff — dreamy
    kuwahara: {
      enabled: true,                 // painterly — memories are impressionist
      radius: 3,
      alpha: 20,
      quantizeLevels: 20,
      saturation: 0.85,              // desaturated — fading photograph
    },
    godRays: { enabled: false },     // no god rays — light is diffuse, swallowed by fog
    dof: {
      enabled: true,
      focusDistance: 3,              // CLOSE focus — only what's near is clear
      focusRange: 1.0,              // VERY narrow — selective memory
      bokehScale: 7.0,              // heavy bokeh — everything beyond focus dissolves
    },
    ssao: { enabled: true },
  },

  camera: {
    pathType: 'wander',              // slow meandering — walking through a dream garden
    // Low, intimate, slightly lost. Like trying to remember
    // which path you took the last time you were here.
    heightOffset: 1.4,               // eye level, intimate — not above, not below
    dampingFactor: 0.8,              // very smooth, dreamy lag
    fov: 48,                         // slightly wide — peripheral memory dissolving
    controlPoints: [
      [0, 0, 0],           // entering the garden — everything hazy
      [4, 0, -15],         // first flowers appear
      [-3, 0, -30],        // deeper — things bloom around you
      [5, -0.3, -48],      // slight descent — among the flowers, peak memory
      [-4, 0, -65],        // the garden thins — memories fading
      [2, 0.2, -85],       // slight rise — looking back at what's dissolving
      [0, 0, -100],        // the garden is almost gone
    ],
  },

  scoreSheets: {
    enabled: true,
    count: 2,
    type: 'ground',                  // scattered on ground, half-dissolved
    emissiveRim: true,               // glowing edges — the paper remembers
  },

  figure: {
    enabled: false,                  // you ARE the one remembering
  },

  // ─── Dissolving flowers (bloom → dissolve → respawn lifecycle) ───
  // Dissolve technique: fragment shader discard based on Quiléz noise threshold
  // Edge glow from Harry Alisavakis dissolve shader
  // 200 instances cycling asynchronously — constant bloom/death rhythm
  dissolvingFlowers: {
    enabled: true,
    count: 200,
    // Muted warm palette — faded golds, dried botanicals, dusty memory
    palette: ['#c4a060', '#b8a078', '#c0a880', '#a89878', '#b0a090', '#c4b898'],
    edgeColor: [0.6, 0.4, 0.7],    // lavender glow at dissolve boundary
    edgeWidth: 0.08,               // transition band width (from Alisavakis)
  },

  // ─── Wilting grass (drooping golden-brown blades — dying garden) ───
  // Heavy quadratic droop physics + golden-brown color gradient
  // Wind from Nitash-Biswas, translucent lighting from al-ro
  wiltingGrass: {
    enabled: true,
    count: 8000,                    // sparse patches, not dense field
    baseColor: [0.12, 0.09, 0.03], // dark warm brown at roots (soil)
    tipColor: [0.30, 0.22, 0.08],  // golden amber tips (dying warmth)
    windSpeed: 0.3,                // slow sighing wind
    droopStrength: 0.6,            // heavy droop — grass weighed down by gravity/grief
    translucency: 1.5,             // backlit amber glow through blades
    fogDensity: 0.025,             // match world fog density
    fogColor: [0.18, 0.14, 0.06],  // match world fog color
  },

  // ─── Fog wisps (drifting billboard sprites — heavy patches of moving fog) ───
  // Billboard technique from three.js sprite shader
  // Radial gradient + Quiléz noise for internal wispy churning
  fogWisps: {
    enabled: true,
    count: 30,                     // sparse but large — patches, not particles
    color: [0.22, 0.17, 0.08],    // warm amber fog matching world palette
    opacity: 0.35,                 // translucent — fog, not smoke
    spreadX: 120,                  // horizontal spread
    spreadZ: 120,
    minHeight: 0.5,                // just above ground — ground fog
    maxHeight: 4.0,                // up to eye level
    minScale: 8,                   // 8-25 world units — LARGE soft blobs
    maxScale: 25,
  },

  audio: {
    ambient: 'garden',               // distant wind chimes, faint birdsong, silence
    musicTrigger: { threshold: 0.30 },
    track: {
      title: 'What Remains',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null, // placeholder — wire when MP3 available
    },
  },

  dominantColor: '#b89848', // warm amber-gold — fading warmth
}
