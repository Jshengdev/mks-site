// Aurora Tundra — The Music Made Visible
// Emotional temperature: Synesthetic Revelation
// "The aurora isn't decoration — it IS the music made visible.
//  Each instrument maps to a color band in the sky.
//  The snow reflects the aurora colors.
//  Footprints appear ahead of the camera — someone was here before you."

export default {
  id: 'aurora-tundra',
  name: 'Aurora Tundra',
  route: '/aurora',
  emotion: 'Synesthetic Revelation',
  tagline: 'the music made visible, written on the sky',

  // What the viewer feels:
  // An endless snow plain. The horizon is a knife edge between white and black.
  // Then the aurora ignites — not as spectacle, but as SOUND becoming LIGHT.
  // Each color band is an instrument. The green curtain is the piano.
  // The purple fringe is the cello. The snow beneath your feet becomes a mirror
  // of the sky. You follow footprints that appeared before you arrived.
  // Someone heard this music before you. Someone will hear it after.

  terrain: {
    type: 'frozen-tundra',
    // Wind-sculpted snow dunes — very flat, subtle undulation
    // The flatness IS the point. Person against infinity.
    // Frozen river channels as subtle depressions
    size: 500,           // vast — infinity feel
    heightRatio: 0.02,   // very low amplitude (max ~1m dunes)
    vertexColor: [0.75, 0.80, 0.90], // blue-white snow
  },

  sky: {
    type: 'night-atmosphere',
    sunElevation: -25,       // deep arctic night
    tealTint: [3.0e-6, 12.0e-6, 22.0e-6], // boost blue Rayleigh for dark polar sky
    stars: {
      enabled: true,
      sharpness: 60,         // crisper arctic stars (dry air, no moisture)
      size: 12,
      falloff: 12,
      visibility: 500,       // arctic clarity
    },
    moon: {
      enabled: true,
      sharpness: 15000,
      size: 4000,            // smaller, colder moon
    },
  },

  // Aurora system — the core unique feature
  // nimitz "Auroras" (Shadertoy XtGGRt) technique:
  // - triNoise2d with triangle wave FBM (NOT smooth Perlin — creates vein/curtain patterns)
  // - 50-step raymarching through overhead plane
  // - Color cycle: sin(1.0 - vec3(2.15, -0.5, 1.2) + i * 0.043)
  // - Horizon fade: rd.y * 15.0 + 0.4
  // - Ground reflection: flip ray upward, dimmed to 0.6x, wider smoothstep
  aurora: {
    enabled: true,
    type: 'curtain',           // nimitz triNoise2d curtain technique
    speed: 0.06,               // animation speed (nimitz default)
    intensity: 1.8,            // final multiplier
    colorShift: 0.043,         // per-step color cycle rate
    colorBase: [2.15, -0.5, 1.2], // drives green→purple cycle
    horizonFade: 15.0,         // rd.y * horizonFade + 0.4
    raySteps: 50,              // raymarch quality
    // Instrument-to-color mapping (the synesthetic core):
    // Piano → green curtain (dominant, wide)
    // Cello → deep purple fringe (edges)
    // Violin → cyan-white highlights (bright tips)
    // Breath/wind → faint red (rare, bottom edge)
    bands: [
      { instrument: 'piano', color: [0.2, 0.9, 0.4], weight: 0.4 },
      { instrument: 'cello', color: [0.6, 0.2, 0.8], weight: 0.25 },
      { instrument: 'violin', color: [0.3, 0.8, 0.9], weight: 0.25 },
      { instrument: 'breath', color: [0.8, 0.2, 0.3], weight: 0.10 },
    ],
    // Ground reflection (snow mirrors the aurora)
    groundReflection: {
      enabled: true,
      dimming: 0.6,            // 60% of sky aurora brightness
      smoothstepRange: [0.0, 2.5], // wider = softer, more diffuse reflection
      snowNoise: {
        darkColor: [0.2, 0.25, 0.5],   // blue-gray shadows
        lightColor: [0.3, 0.3, 0.5],   // blue-gray highlights
        noiseScale: 0.4,
      },
    },
  },

  // Footprints — displacement trail ahead of camera
  // Canvas-to-DisplacementMap technique (Active Theory "Neve")
  // Pre-baked footprint positions along the camera path
  footprints: {
    enabled: true,
    type: 'displacement-canvas',
    canvasSize: 512,           // displacement map resolution
    displacementScale: -0.15,  // negative = depress into snow
    spacing: 1.8,              // meters between prints
    depth: 0.08,               // print depression depth
    rimHeight: 0.02,           // subtle snow push-up at edges
    fadeRate: 0.0,             // 0 = permanent (someone was here before you)
    // Prints lead ahead of camera path, offset slightly left-right alternating
    // Generated from camera controlPoints with stagger
    stagger: 0.35,             // left-right offset (meters)
    aheadDistance: 15,         // how far ahead of camera prints appear
  },

  // Snow surface — reflective, subsurface scattering
  snowSurface: {
    enabled: true,
    // Fresnel-driven sky reflection (snow picks up aurora colors)
    fresnel: {
      bias: 0.02,             // ice IOR ~1.31 → F0 = 0.018
      scale: 0.5,             // reflection intensity
      power: 3.0,             // falloff (softer than glass at 5.0)
    },
    // Subsurface scattering (GDC 2011 Barre-Brisebois technique)
    sss: {
      distortion: 0.1,        // fine crystal structure
      power: 2.0,             // moderate falloff
      scale: 10.0,            // snow transmits significant light
      color: [0.7, 0.8, 1.0], // blue-tinted (snow scatters blue)
      ambient: 0.15,          // ambient translucency
    },
    // Ice crystal sparkle (Quilez voronoi noise)
    sparkle: {
      enabled: true,
      glitterSize: 400,        // fine snow crystals (higher = smaller cells)
      glitterDensity: 0.15,    // moderate density
      // Sparkle color responds to aurora — picked up from sky
      respondToAurora: true,
    },
  },

  // Ice spike formations — Minecraft Ice Spikes biome inspired
  // Tall tapered hexagonal cones, translucent blue-white, SSS glow
  iceSpikes: {
    enabled: true,
    count: 80,
    color: [0.7, 0.8, 0.95],      // blue-white ice
    sssColor: [0.4, 0.6, 0.9],    // subsurface blue glow
  },

  grass: {
    enabled: true,
    bladeCount: 8000,          // sparse frozen grass tufts
    baseColor: [0.35, 0.38, 0.42], // frost-silver
    tipColor: [0.55, 0.60, 0.70],  // ice-blue tips
    windSpeed: 0.15,           // barely moving — frozen stiff
    bendStrength: 0.2,         // rigid, crystallized
  },

  flowers: {
    enabled: false,            // arctic — no flowers. The aurora IS the bloom.
  },

  particles: {
    fireflies: { enabled: false },
    dust: { enabled: false },
    rain: { enabled: false },
    spray: { enabled: false },
    // Gentle snow — not a blizzard. Individual flakes catching light.
    snow: {
      enabled: true,
      count: 800,              // sparse, individual flakes
      velocity: [0.1, -1.5, 0.05], // gentle drift down
      size: 3.0,               // larger than rain — flakes, not drops
      color: [0.9, 0.92, 1.0], // blue-white
      tumble: true,            // slow rotation (snowflakes tumble)
      // Snow catches aurora light — particles tinted by sky color
      auroraResponse: 0.3,     // 30% aurora color pickup
    },
    // Ice crystals — diamond dust hanging in the air
    // Like fireflies but white/prismatic, catching aurora light
    iceCrystals: {
      enabled: true,
      count: 200,              // sparse diamond dust
      color: [0.85, 0.90, 1.0],
      brightness: 1.5,
      bobSpeed: 0.2,           // very slow vertical drift
      driftRadius: 5.0,        // wide, lazy drift
      sparkleRate: 3.0,        // flicker as crystal faces catch light
      // Prismatic: splits aurora light into micro-rainbows
      prismatic: true,
    },
  },

  lighting: {
    sunColor: [0.25, 0.30, 0.50],  // moonlight — blue-violet arctic
    sunIntensity: 0.3,
    ambientIntensity: 0.08,         // very dim — aurora provides the light
    // Aurora acts as dynamic area light source
    auroraLighting: {
      enabled: true,
      intensity: 0.4,               // aurora illumination on snow
      colorFromSky: true,           // light color follows aurora bands
    },
  },

  fog: {
    near: 30,
    far: 250,                  // vast visibility (arctic clarity)
    color: '#080810',          // deep blue-black
    density: 0.004,            // light fog — clarity is the point
  },

  postFX: {
    bloom: {
      threshold: 0.4,         // aurora glows strongly
      intensity: 0.8,         // heavy bloom for aurora
      levels: 8,
    },
    grain: { intensity: 0.08 },      // cold film stock — grainy, harsh
    vignette: { darkness: 0.75, offset: 0.3 }, // isolation at edges
    ca: { offset: [0.0015, 0.0008] }, // subtle lens distortion (cold air refraction)
    toneMapping: 'UNCHARTED2',        // moody compression (dark scenes)
    kuwahara: { enabled: false },     // NOT painterly — crisp and cold
    godRays: { enabled: false },      // no sun visible
    dof: {
      enabled: true,
      focusDistance: 12,       // footprints in focus
      focusRange: 3.0,        // moderate DOF
      bokehScale: 4.0,        // aurora bokeh balls in background
    },
    ssao: { enabled: true },          // footprint depth definition
    // Color grade: cold split-tone
    colorGrade: {
      splitToneWarm: [0.4, 0.5, 0.7],  // blue-steel shadows (NOT warm)
      splitToneCool: [0.5, 0.8, 0.6],  // aurora green highlights
    },
  },

  camera: {
    pathType: 'slow-push',
    // Following the footprints across the tundra
    // Low, intimate, looking slightly up to see aurora
    heightOffset: 1.0,         // low — walking height
    dampingFactor: 1.0,        // slow, deliberate
    fov: 55,                   // wide — vast expanse
    lookUpBias: 0.15,          // camera tilts up slightly toward aurora
    controlPoints: [
      [0, 0, 0],              // SILENCE — entering the white void
      [2, 0, -30],            // FIRST LIGHT — aurora flicker begins
      [-1, 0, -60],           // CRESCENDO — full aurora, footprints deepen
      [3, -0.3, -90],         // COMMUNION — ground level, aurora overhead
      [0, 0, -120],           // DISSOLUTION — fading, stars remain
    ],
  },

  scoreSheets: {
    enabled: true,
    count: 2,
    type: 'frozen',            // half-buried in snow, ice-crusted edges
    emissiveRim: true,         // faint aurora-colored rim glow
  },

  figure: {
    enabled: true,
    type: 'standing',          // silhouette at the end of the footprints
    facing: 'aurora',          // looking up at the sky
    distance: 'far',           // small in frame — you approaching them
    // The figure dissolves as you get close — it was you all along
    dissolveOnApproach: {
      enabled: true,
      startDistance: 20,
      endDistance: 8,
    },
  },

  audio: {
    ambient: 'arctic-wind',    // low howl, crystalline tinkle
    musicTrigger: { threshold: 0.25 }, // music starts early (it IS the aurora)
    track: {
      title: 'Northern Silence',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null,               // placeholder — wire when MP3 available
    },
  },

  dominantColor: '#2aff6a',    // aurora green
}
