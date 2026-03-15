// Bioluminescent Deep — The Abyss / Immerse
// Emotional temperature: The Weight of Wonder
// "The Mariana Trench. Total darkness except for bioluminescent creatures.
//  Jellyfish pulse like heartbeats. Anglerfish lights bob in the distance.
//  The music is the only warmth in absolute cold and pressure."

export default {
  id: 'bioluminescent-deep',
  name: 'Bioluminescent Deep',
  route: '/immerse',
  emotion: 'The Weight of Wonder',
  tagline: 'light persisting in impossible darkness',

  // What the viewer feels:
  // You are sinking. The last traces of surface light vanish above you.
  // The pressure becomes the music — you feel it in your chest.
  // Then: a pulse. Cyan. Gone. Another. A jellyfish, translucent,
  // its bell contracting like a heartbeat you forgot you had.
  // Deeper: anglerfish lures bob in the distance like stars
  // that fell into the ocean and kept burning.
  // The music is the only warm thing in this entire world.
  // Each scroll reveals a new creature, a new light, a new depth.
  // At the bottom: hydrothermal vents. Heat. Life. Impossible life.

  terrain: {
    type: 'simplex-layers',
    // Abyssal floor — mostly flat with gentle ridges, occasional sharp crevasses
    octaves: 4,
    frequencies: [0.8, 1.6, 3.2, 6.4],
    amplitudes: [0.6, 0.3, 0.15, 0.05],
    smoothPasses: 4,
    smoothSigma: 3.0,       // very smooth — silt-covered abyss
    heightRatio: 0.03,       // low relief — flat ocean floor with gentle undulations
    size: 300,
    vertexColor: [0.02, 0.02, 0.04], // near-black with blue undertone — abyssal sediment
  },

  sky: {
    type: 'void',
    // No sky. No sun. No stars. Just the weight of 11km of water above you.
    // The "sky" is the water column fading to absolute black.
    turbidity: 0.5,
    rayleigh: 0.1,
    mieCoefficient: 0.001,
    sunElevation: -90,       // sun doesn't exist here
    stars: { enabled: false }, // we're underwater
  },

  grass: {
    enabled: false,
    // Nothing grows on the abyssal floor in the traditional sense.
    // Life here is not photosynthetic. It's chemosynthetic.
    // Tube worms and vent fauna are handled as particles/special geometry.
  },

  flowers: {
    enabled: false,
    // No flowers. Only bioluminescent organs that look like flowers
    // but are hunting machines. Beauty as lure.
  },

  particles: {
    fireflies: {
      // REPURPOSED: These ARE the jellyfish and plankton.
      // The firefly system's additive blending + point sprite + bob
      // is perfect for bioluminescent organisms.
      enabled: true,
      count: 350,             // less than meadow — life is sparse in the deep
      color: [0.15, 0.85, 0.75], // cyan-green bioluminescence (dinoflagellate spectrum)
      brightness: 2.5,        // BRIGHT — these are the only light source
      bobSpeed: 0.3,          // slow, dreamy pulse — heartbeat rhythm
      driftRadius: 5.0,       // wider drift — currents are slow but vast
    },
    dust: {
      // REPURPOSED: Marine snow — the endless rain of organic detritus
      // from the surface world. The only connection to sunlight.
      // Stolen from: madmappersoftware/MadMapper-Materials (MarineSnow.fs)
      // and p-chops/video-flows (ulp-bioluminescent-field.fs)
      enabled: true,
      count: 400,              // dense marine snow — it never stops falling
      // Marine snow falls UPWARD relative to camera (we're sinking)
      // but actually falls down in world space at ~0.002 units/frame
    },
    rain: { enabled: false },
    spray: { enabled: false },
    // Future subsystems (not yet in WorldEngine):
    // jellyfish: { count: 8, bellRadius: 1.5-4.0, pulseFreq: 1.8 },
    // anglerLures: { count: 12, swingFreq: 1.5, glowColor: [0.4, 1.0, 0.95] },
    // ventParticles: { count: 200, color: [0.6, 0.3, 0.1], riseSpeed: 0.5 },
  },

  // Deep-sea specific systems (config for future WorldEngine extensions)
  deepsea: {
    jellyfish: {
      enabled: true,
      count: 8,
      // Procedural geometry: rib + spine system
      // Stolen from: jpweeks/particulate-medusae (procedural constraint system)
      // 20 ribs, 36 segments each, parametric radius: sin(PI - PI*0.55*t*1.8) + log(t*100+2)/3
      bellRadius: [1.5, 4.0],  // min/max — variation per instance
      ribCount: 20,
      segmentsPerRib: 36,
      tentacleSegments: 80,    // reduced from medusae's 120 for perf
      tentacleLength: 1.5,     // segment length
      // Animation — stolen from arodic/Chrysaora:
      // Asymmetric pulse: fast contraction, slow expansion
      // time = mod(uTime + posY * 1.50, TAU)
      // offset = smoothstep(0, 1, max(0, -posY - 0.8) / 10.0)
      pulseFreq: 1.8,          // Hz — heartbeat rhythm (paulrobello/par-term)
      // Colors — translucent bell with Fresnel rim glow
      // Stolen from: otanodesignco/Fresnel-Shader-Material
      // fresnel = pow(1.0 - dot(N, V), 1.5) * 1.5
      bellColor: [0.05, 0.15, 0.25],     // deep blue translucent
      rimGlowColor: [0.20, 0.90, 0.80],  // cyan bioluminescence
      fresnelPower: 1.5,
      fresnelOffset: 0.05,
      // Subsurface scattering — stolen from mattdesl gist:
      // LTLight = normalize(L + N * 0.185)
      // LTDot = pow(saturate(dot(V, -LTLight)), 20) * 4
      sssDistortion: 0.185,
      sssPower: 12,       // softened from 20 — jellyfish are more translucent
      sssScale: 3.0,
    },
    anglerfish: {
      enabled: true,
      count: 5,
      // Distant bobbing lights — NOT full fish geometry
      // Just the lure: a point light on a pendulum
      // Stolen from: paulrobello/par-term (floating particle technique)
      // pendulum swing: sin(time * 1.5) * amplitude
      // glow: exp(-dist^2 * 2.5) * 0.85
      // pulse: 0.3 + 0.7 * sin(time * 2.1 + phase * 1.73)
      lureColor: [0.40, 1.00, 0.95],  // cyan-green (ctenophore spectrum)
      lureSize: 3.0,
      swingFreq: 1.5,         // Hz — pendulum swing
      swingAmplitude: 0.8,    // world units
      glowFalloff: 2.5,       // exp(-dist^2 * this)
      pulseRange: [0.3, 1.0], // min/max brightness
      pulseFreq: 2.1,         // Hz
      // Point light attenuation — stolen from drahcc/ppgsoFinal:
      // intensity / (1.0 + 0.09*dist + 0.032*dist^2)
      attenLinear: 0.09,
      attenQuadratic: 0.032,
      distance: [30, 80],     // spawn distance from camera path
    },
    caustics: {
      enabled: true,
      // Faint caustic patterns on the ocean floor — memory of the surface
      // Stolen from: blaze33/droneWorld (iterative sin/cos feedback loop)
      // Classic Shadertoy caustic: p + vec2(cos(t-i.x)+sin(t+i.y), sin(t-i.y)+cos(t+i.x))
      // 5 iterations, intensity 0.005, contrast pow(c, 1.4)
      // Adapted: much dimmer at this depth, blue-shifted
      iterations: 5,
      intensity: 0.005,
      contrast: 1.4,
      finalPower: 8.0,
      colorTint: [0.0, 0.20, 0.35],  // blue-cyan (shifted from surface teal)
      brightness: 0.08,               // very faint — ghosts of the surface
      speed: 0.05,                     // glacial
    },
    hydroVents: {
      enabled: true,
      count: 3,
      // Hydrothermal vent plumes — appear only at t=0.75-1.0
      // Warm particles rising from cracks in the floor
      // Stolen from: p-chops/video-flows (ulp-infernal-drift.fs rising particles)
      // Grid scale 30.0, glow Gaussian 0.0015, flicker 0.4-1.0 at 3.5Hz
      plumeColor: [0.6, 0.3, 0.1],   // warm amber-orange (volcanic heat)
      plumeHeight: 15.0,
      particleCount: 200,
      riseSpeed: 0.5,
      // The ONLY warm light in the entire scene
      // This is the emotional resolution: warmth exists even at the bottom
    },
    marinesnow: {
      // Separate from dust motes — these have specific deep-sea behavior
      // Stolen from: madmappersoftware/MadMapper-Materials (MarineSnow.fs)
      // 3D hash: fract(sin(p2.x*133.3)*19.9 + sin(p2.y*177.7)*13.3 + sin(p2.z*199.9)*17.7)
      // 10% cell density, sphere radius 4.4, camera drift 7.0 vertical
      hashPrimes: [133.3, 177.7, 199.9],
      spawnThreshold: 0.9,   // 10% of cells have particles
      fallSpeed: 0.002,       // world units per frame — barely moving
      color: [0.4, 0.45, 0.5], // pale blue-grey
      size: [0.02, 0.08],     // tiny specks
    },
  },

  lighting: {
    // No sun. No moon. No ambient light from above.
    // All light is bioluminescent — emitted by creatures.
    sunColor: [0.05, 0.08, 0.15],  // extremely dim blue residual scatter
    sunIntensity: 0.05,              // barely exists
    ambientIntensity: 0.02,          // near-total darkness
    // Bioluminescent contribution handled via bloom + emissive particles
  },

  fog: {
    near: 5,          // very close — water absorbs light fast at depth
    far: 60,          // can't see far — the abyss swallows everything
    color: '#020208', // near-black with violet undertone — deep water scatter
    density: 0.02,    // thick — this is 11km of water
  },

  postFX: {
    bloom: {
      threshold: 0.3,    // LOW — everything bioluminescent should bloom
      intensity: 1.2,    // HIGH — the glow IS the world
      levels: 8,         // full mip chain for wide glow spread
    },
    grain: {
      intensity: 0.10,   // heavy — underwater camera noise, pressure artifacts
    },
    vignette: {
      darkness: 0.95,    // CRUSHING — tunnel vision in the abyss
      offset: 0.20,      // tight — the darkness presses in from every edge
    },
    ca: {
      offset: [0.004, 0.002], // strong — pressure distortion on the "lens"
      radialModulation: true,
    },
    toneMapping: 'UNCHARTED2', // deep compression — preserve dark detail
    kuwahara: { enabled: false },
    godRays: { enabled: false },  // no sun = no rays
    dof: {
      enabled: true,
      // Intimate focus — one creature at a time, everything else dissolves
      // Adapted from Ocean Cliff DOF v3 (exp-022, 61/70)
      focusDistance: 6,      // close focus — intimate with nearest creature
      focusRange: 2.0,       // slightly wider than ocean cliff (more atmosphere)
      bokehScale: 6.0,       // heavy bokeh — bioluminescent orbs become soft discs
    },
    ssao: { enabled: false },  // no ambient light = no ambient occlusion
    // Custom deep-sea post-FX (config for future implementation):
    pressureDistortion: {
      // Screen-space wavering — simulates water pressure on the "camera housing"
      // Adapted from: blaze33/droneWorld underwater distortion
      enabled: true,
      frequency: 0.5,       // Hz — slow, heavy breathing
      amplitude: 0.003,     // subtle but present
    },
    underwaterFog: {
      // Per-wavelength absorption — red dies first, then green, blue survives longest
      // Stolen from: sixthsurge/photon (water_fog_vl.glsl)
      // absorption_coeff = vec3(WATER_ABSORPTION_R, G, B)
      // transmittance = exp(-extinction_coeff * distance)
      enabled: true,
      absorptionR: 0.45,    // red dies fast
      absorptionG: 0.12,    // green survives longer
      absorptionB: 0.04,    // blue survives longest
      scattering: 0.008,    // minimal — water is clear at depth
    },
  },

  camera: {
    pathType: 'descent',
    // The descent: start high, sink into the abyss, move through creature zones
    // Camera height decreases with scroll — you're going DOWN
    // Horizontal movement reveals new creatures at each depth
    heightOffset: 3.0,      // start above the floor
    dampingFactor: 0.8,     // heavy, slow — like moving through water
    fov: 55,                // wide — claustrophobic immersion
    controlPoints: [
      [0, 8, 0],           // TWILIGHT — high, looking down into darkness
      [5, 4, -20],         // MIDNIGHT — sinking, first glows appear
      [-3, 2, -45],        // ABYSS — jellyfish level, surrounded by pulse
      [4, 0.5, -70],       // HADAL — ground level, anglerfish territory
      [0, 0.8, -95],       // HYDROTHERMAL — among the vents, warmth found
    ],
  },

  scoreSheets: {
    enabled: true,
    count: 2,
    type: 'suspended',   // floating in water column, slowly rotating
    // Score sheets as if dropped from the surface — sinking like the viewer
    emissiveRim: true,    // faint bioluminescent edge glow
  },

  figure: {
    enabled: false,
    // No figure. You are alone in the deep.
    // The loneliness is the point.
    // The music is your only companion.
  },

  audio: {
    ambient: 'deep-ocean',  // low-frequency hum, distant groans, whale calls
    musicTrigger: { threshold: 0.25 }, // music starts early — you need it
    track: {
      title: 'The Weight of Light',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null, // placeholder — wire when MP3 available
    },
  },

  dominantColor: '#0a3a4a', // deep cyan-teal — bioluminescent spectrum
}
