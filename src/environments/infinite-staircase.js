// Infinite Staircase — The Eternal Becoming
// Emotional temperature: The Eternal Becoming
// "You climb forever but arrive everywhere.
//  Each landing is a different life. Each step is the same choice made again."
//
// Surreal Penrose-inspired staircase spiraling through emotional space.
// Not a physical place — a metaphor rendered as architecture.
// Each landing shifts radically: warm, cold, bright, dark, and back.
// The viewer climbs forever. The music changes character at each landing.
// The central void is always below, or above, or both.
//
// Stolen from: impossible-architecture-explorer (Y-warp trick),
// TakashiL/Penrose-Stairs (orthographic illusion math),
// HackerPoet/NonEuclidean (portal camera transforms),
// metzlr/portals (stencil-based recursive portal rendering)
//
// End Cities meets Escher. Regular terrain DISABLED — floating platforms ARE the world.
// 40 stone slabs in ascending spiral, some tilted/inverted (broken gravity).
// 25 stair segments connecting platforms at impossible angles.
// 6 portal doors with FBM swirl noise interiors — gateways to nowhere.
// Heavy fog hides the finite edges. The atmosphere keyframes create
// 5 radically different "landings" that suggest infinite variety.
// Dust rises UPWARD. Ghost lights mark landings you'll never reach.

export default {
  id: 'infinite-staircase',
  name: 'Infinite Staircase',
  route: '/ascend',
  emotion: 'The Eternal Becoming',
  tagline: 'climbing forever, arriving everywhere',

  // What the viewer feels:
  // You stand at the bottom of a staircase that has no bottom.
  // Above you: fog, stone, the suggestion of others who climbed before.
  // Each landing changes everything — the light, the temperature, the meaning.
  // You can't go back. You can't stop. But every step is a choice.
  // The music is the reason you keep climbing.

  terrain: {
    type: 'void',        // DISABLED — floating platforms replace terrain
    size: 300,
  },

  sky: {
    type: 'void-gradient',
    // No sun, no Preetham. A gradient from warm-grey above to blue-black below.
    // The sky IS the void. Stars visible through gaps in the architecture.
    sunElevation: -15,   // sun hidden — light comes from "landings" not sky
    stars: {
      enabled: true,
      gridSize: 48,
      brightnessExp: 8,   // very rare bright stars — most are dim
      maxOffset: 0.45,
      fadeFactor: 8.0,    // visible even in brighter sections
    },
  },

  grass: {
    enabled: false,  // DISABLED — no vegetation on floating stone platforms
  },

  flowers: {
    enabled: false,
  },

  // ─── Floating Platforms — Escher-inspired ascending spiral ───
  floatingPlatforms: {
    enabled: true,
    count: 40,              // 40 stone slabs in ascending spiral
    width: 3.5,             // platform width
    thickness: 0.35,        // thin stone slabs
    depth: 3.5,             // platform depth
    bobAmplitude: 0.3,      // gentle floating bob
  },

  // ─── Stair Segments — impossible geometry connections ───
  stairSegments: {
    enabled: true,
    count: 25,              // 25 stair segments connecting platforms
    stepsPerSegment: 4,     // 4 steps per segment
    bobAmplitude: 0.15,     // subtle bob — less than platforms
  },

  // ─── Portal Doors — glowing gateways to impossible destinations ───
  portalDoors: {
    enabled: true,
    count: 6,               // 6 portal doors on selected platforms
    frameWidth: 2.2,        // door frame width
    frameHeight: 3.2,       // door frame height
    beamThickness: 0.18,    // frame beam thickness
    color: [0.3, 0.45, 0.8], // cool spectral blue — matching firefly palette
    brightness: 1.0,
  },

  particles: {
    fireflies: {
      enabled: true,
      count: 120,                    // sparse ghost-lights on distant landings
      color: [0.65, 0.72, 0.90],    // cool blue-white — NOT warm amber
      brightness: 1.5,
      bobSpeed: 0.3,                 // slow, hovering
      driftRadius: 8.0,             // wide drift — scattered across landings
    },
    dust: {
      enabled: true,
      count: 250,       // dust rising UPWARD (reversed gravity = surreal)
      // Note: requires shader modification for upward drift
    },
    rain: { enabled: false },
    spray: { enabled: false },
  },

  lighting: {
    sunColor: [0.50, 0.50, 0.55],   // neutral grey — light has no warmth by default
    sunIntensity: 0.5,                // dim — light comes from atmosphere, not sun
    ambientIntensity: 0.08,           // low but enough to see stone texture
  },

  fog: {
    near: 8,        // close fog — the infinite is suggested, not shown
    far: 60,        // tight falloff — you see 2-3 landings at most
    color: '#0d0d12', // blue-tinged grey — stone and void
    density: 0.008,
  },

  postFX: {
    bloom: { threshold: 0.7, intensity: 0.35, levels: 8 },
    grain: { intensity: 0.07 },                 // stone texture enhancement
    vignette: { darkness: 0.75, offset: 0.30 }, // heavy — tunnel/stairwell
    ca: { offset: [0.002, 0.001], radialModulation: true }, // vertigo distortion
    toneMapping: 'UNCHARTED2',   // moody, compressed
    kuwahara: { enabled: false },
    godRays: { enabled: false }, // no visible sun
    dof: {
      enabled: true,
      focusDistance: 6,    // mid-range focus — next few steps sharp
      focusRange: 2.0,    // moderate range
      bokehScale: 4.0,    // distant landings become soft orbs
    },
    ssao: { enabled: true },   // CRITICAL for stone depth perception
  },

  camera: {
    pathType: 'ascending-helix',
    // Zigzag upward: the camera climbs, pausing at each landing
    // Heights increase steadily — the feeling of ascent
    // Wider sweeps at landings, tighter in corridors
    heightOffset: 1.5,        // eye level on the steps
    dampingFactor: 1.5,       // moderate lag — measured pace, not urgent
    fov: 48,                  // slightly wide — vertigo without distortion
    controlPoints: [
      [0, 0, 0],          // THRESHOLD — first step
      [6, 2.5, -20],      // Climbing right
      [0, 5, -40],        // WARMTH landing — wide platform
      [-6, 7.5, -60],     // Climbing left
      [0, 10, -80],       // VOID landing — looking down
      [6, 12.5, -100],    // Climbing right
      [0, 15, -120],      // ILLUMINATION landing — looking up
      [-4, 17, -140],     // Climbing left
      [0, 18, -160],      // RETURN — same geometry, different you
    ],
  },

  scoreSheets: {
    enabled: true,
    count: 2,
    type: 'pinned',   // pinned to staircase walls — left by previous climbers
  },

  figure: {
    enabled: false,    // you ARE the climber. No witness, no guide.
  },

  audio: {
    ambient: 'stone-echo',   // footsteps reverberating, distant drips, wind through gaps
    musicTrigger: { threshold: 0.3 },
    track: {
      title: 'The Eternal Becoming',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null,
    },
  },

  dominantColor: '#4a4a5a', // cool grey-blue — stone
}
