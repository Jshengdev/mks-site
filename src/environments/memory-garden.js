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
    vertexColor: [0.04, 0.03, 0.05], // purple-brown earth tint
  },

  sky: {
    type: 'preetham',
    // Permanent twilight — neither day nor night. The light of memory.
    // Not the harsh sun of the present nor the darkness of forgetting.
    // Purple-gold, like the last light before you forget what color the sky was.
    turbidity: 5.0,          // hazy — memories are never crystal clear
    rayleigh: 2.0,           // rich scattering for purple-gold gradient
    mieCoefficient: 0.015,   // visible sun halo — the source you can't look at
    sunElevation: 5,         // perpetual golden hour edge — slipping away
    stars: {
      enabled: true,         // stars visible through twilight — the permanent things
      gridSize: 48,          // fewer stars than night meadow (twilight, not night)
      brightnessExp: 4,      // more visible stars (lower power = more visible)
      maxOffset: 0.43,
      fadeFactor: 8.0,       // faster fade — stars compete with twilight glow
    },
  },

  grass: {
    enabled: true,
    bladeCount: 45000,       // less dense than meadow — garden, not field
    baseColor: [0.05, 0.02, 0.05],   // purple-brown earth — NOT green
    tipColor: [0.12, 0.07, 0.13],    // grey-lavender tips — faded, remembered, not vivid
    windSpeed: 0.4,          // gentle — a garden is sheltered
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
    // Muted, memory-faded palette — not vivid, not dead. Between.
    // Colors of flowers you remember but can't quite see.
    palette: ['#b8a0c4', '#c4a080', '#a0b8c4', '#c4c0a0', '#c0a0b0', '#a8c4a0'],
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
      // NOT amber (that's the artist color, warmth, life)
      // These are SPECTRAL — the residual light of something that was just here
      color: [0.65, 0.55, 0.80],   // lavender-silver — ghostly, not warm
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
    // Twilight light — warm but fading. The last light of the day.
    sunColor: [0.80, 0.65, 0.55],   // warm amber fading to dusk
    sunIntensity: 0.9,               // not bright — memory light is softer
    ambientIntensity: 0.12,          // visible but not harsh
  },

  fog: {
    near: 10,
    far: 80,                         // tight — you can't see far into memory
    color: '#1a1520',                // purple-black — the color of forgetting
    density: 0.008,                  // moderately heavy — memories are hazy
  },

  postFX: {
    bloom: { threshold: 0.55, intensity: 0.7, levels: 8 },   // memories glow
    grain: { intensity: 0.09 },       // heavy grain — aged film, imperfect recall
    vignette: { darkness: 0.75, offset: 0.30 },  // strong tunnel vision — selective memory
    ca: { offset: [0.0025, 0.0012], radialModulation: true }, // optical distortion of looking back
    toneMapping: 'AGX',              // dreamy, like ocean cliff — soft rolloff
    kuwahara: {
      enabled: true,                 // painterly at all times — memories are impressionist
      radius: 3,                     // lighter than ghibli — softened, not stylized
      alpha: 20,
      quantizeLevels: 20,
      saturation: 0.9,               // UNDER 1.0 — desaturated. Faded photograph.
    },
    godRays: { enabled: false },     // no god rays — this isn't about light, it's about absence
    dof: {
      enabled: true,
      focusDistance: 6,              // intimate — only the nearest things are sharp
      focusRange: 1.0,              // VERY narrow — memory focuses on one thing
      bokehScale: 6.0,              // heavy bokeh — everything outside focus dissolves
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

  // FUTURE: Memory-specific systems (need new subsystem code)
  // dissolve: {
  //   // Noise-based dissolve on ALL vegetation
  //   // cnoise(position * freq) * amp compared against scrolling threshold
  //   // Technique: Codrops 2025 dissolve tutorial + Ashima cnoise
  //   noiseFunction: 'cnoise',       // 3D Perlin (Stefan Gustavson / Ashima Arts)
  //   frequency: 3.5,                // spatial frequency of dissolve pattern
  //   amplitude: 0.8,
  //   edgeWidth: 0.08,               // transition band width
  //   edgeColor: [0.6, 0.4, 0.7],   // lavender glow at dissolve boundary
  //   // Scroll-adaptive dissolve arc (from exp-049 mapping-mode-change pattern):
  //   // t=0.0: threshold=0.8 (most hidden, trying to appear)
  //   // t=0.25: threshold=0.5 (surfacing)
  //   // t=0.50: threshold=0.15 (almost everything visible)
  //   // t=0.75: threshold=0.55 (fading back)
  //   // t=1.0: threshold=0.85 (nearly all dissolved)
  // },
  //
  // depthFade: {
  //   // Objects become transparent with distance from camera
  //   // Technique: linearize depth + smoothstep transition
  //   enabled: true,
  //   nearFull: 5,                   // fully opaque within 5 units
  //   farGone: 40,                   // fully transparent beyond 40 units
  //   curve: 'smoothstep',           // easing function
  //   // "You can only hold so much memory at once"
  // },

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

  dominantColor: '#7a5b8a', // twilight purple — the color of fading memory
}
