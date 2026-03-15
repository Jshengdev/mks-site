// Sonic Void — Hidden / Dissolve
// Emotional temperature: Pure Presence
// "The moment you stop being a person listening to music
//  and become the sound itself."
//
// Pure abstraction — no landscape, no ground, no sky.
// Bass frequencies create pulsing spheres.
// Melody draws flowing ribbons.
// Harmony builds crystalline structures.
// The viewer floats through a space where sound IS matter.

export default {
  id: 'sonic-void',
  name: 'Sonic Void',
  route: '/dissolve',
  emotion: 'Pure Presence',
  tagline: 'where sound becomes matter',

  // What the viewer feels:
  // There is no ground. There is no sky. There is no you.
  // Bass pulses in your chest as spheres breathe around you.
  // Melody traces luminous ribbons through empty space.
  // Harmony crystallizes into impossible structures of light.
  // You are floating inside the music. You ARE the music.

  terrain: {
    type: 'void',
    // No geometry. No ground plane. Pure empty space.
    // createTerrain should return null mesh + getHeight returning 0.
    size: 0,
  },

  sky: {
    type: 'void-dark',
    // No sky dome. No Preetham. scene.background = backgroundColor.
    backgroundColor: '#050508', // near-black, faint blue frost
    sunElevation: -90,          // no sun exists
    stars: { enabled: false },  // no natural phenomena — only sound
  },

  // ═══ AUDIO-REACTIVE GEOMETRY ═══
  // New subsystem types. WorldEngine will need BassSphereSystem,
  // MelodyRibbonSystem, HarmonyCrystalSystem to consume these.
  // Until those exist, this config is a SPEC.

  audioGeometry: {
    enabled: true,

    // ─── Bass Spheres ───
    // Pulsing icosahedrons that breathe with sub-bass to bass (20-250 Hz).
    // 7 spheres in asymmetric cluster. Scale driven by FFT bass band.
    // Steal: Fresnel edge glow from daniel-ilett rim light pattern.
    // Steal: FFT smoothing from L17 (attack 0.15, release 0.97).
    // Steal: sqrt compression from exp-038 spectral fireflies.
    bassSpheres: {
      enabled: true,
      count: 7,                       // odd number — asymmetric cluster
      type: 'icosahedron',            // low-poly faceted sphere
      detail: 2,                      // 320 faces — visible facets catch bloom
      baseRadius: 0.8,                // world units at rest
      maxScale: 2.5,                  // pulse to 2.5x on bass hit
      frequencyRange: [20, 250],      // Hz — sub-bass through bass
      // Response curve (stolen from exp-038 ADSR pattern)
      responseSmoothing: 0.85,        // organic breathing, not jitter
      attackSpeed: 0.15,              // slow swell — NOT popping
      releaseDecay: 0.97,             // ~2s to 10% — long resonance tail
      pulseFalloff: 'sqrt',           // sqrt(fft) * 2.0 — organic compression
      // Visuals
      color: [0.545, 0.184, 0.788],  // #8B2FC9 — deep violet
      emissiveIntensity: 2.0,         // self-illuminating — light source
      wireframe: false,               // solid — mass, weight, presence
      // Shader: Fresnel edge glow
      // rim = 1.0 - max(dot(viewDir, normal), 0.0)
      // rim = pow(rim, 2.0) * 1.5 — sharper, brighter than flower rim
      fresnelPower: 2.0,
      fresnelIntensity: 1.5,
      fresnelColor: [0.706, 0.353, 1.0], // #B45AFF — lighter violet edge
      // Spatial layout
      spatialSpread: 30,              // world units — cluster radius
      verticalSpread: 15,
      // Point lights — bass spheres ARE the light sources
      emitLight: true,
      pointLightIntensity: 0.8,
      pointLightDistance: 15,
      pointLightDecay: 2,
    },

    // ─── Melody Ribbons ───
    // Flowing tube geometry that traces melodic contours (250-2000 Hz).
    // 5 ribbons through void. Vertices displaced by mid FFT band.
    // Steal: CatmullRomCurve3 from CameraRig spline architecture.
    // Steal: spite/THREE.MeshLine for GPU line rendering.
    // Steal: Active Theory curl noise for organic curve evolution.
    melodyRibbons: {
      enabled: true,
      count: 5,                       // flowing ribbon paths
      type: 'tube-geometry',          // TubeGeometry along CatmullRom curve
      segments: 128,                  // tube segments for smooth flow
      radius: 0.12,                   // thin ribbon — not tubes, ribbons
      radialSegments: 4,              // low-poly cross-section (flat ribbon feel)
      frequencyRange: [250, 2000],    // Hz — melody/voice range
      curveType: 'catmull-rom',
      curvePoints: 32,                // control points per ribbon
      // Dynamics
      driftSpeed: 0.3,                // curve control points evolve slowly
      responseSmoothing: 0.90,        // very smooth — flowing, not jittery
      // Curl noise advection (stolen from Active Theory)
      curlNoiseScale: 0.05,           // spatial frequency of curl field
      curlNoiseSpeed: 0.1,            // temporal evolution speed
      curlStrength: 0.8,              // displacement magnitude
      // Visuals
      color: [0.0, 0.831, 1.0],      // #00D4FF — electric cyan
      emissiveIntensity: 1.5,
      opacity: 0.7,                   // slightly transparent — ethereal
      // Trail fade: alpha decreases along ribbon length
      // alpha = 1.0 - (segmentIndex / totalSegments) * trailFade
      trailFade: 0.85,                // head=bright, tail=dim
      // Spatial layout
      spatialSpread: 40,
      verticalSpread: 20,
    },

    // ─── Harmony Crystals ───
    // Wireframe octahedrons that shimmer with harmonic content (2000-8000 Hz).
    // 12 crystals scattered wider than spheres. Fast response — shimmer.
    // Steal: wireframe rendering from THREE.js WireframeGeometry.
    // Steal: rotation from score sheet cloth tumble pattern.
    harmonyCrystals: {
      enabled: true,
      count: 12,                      // crystalline accents
      type: 'octahedron',             // faceted, angular — tension
      detail: 0,                      // sharp, unsubdivided — 8 faces
      baseSize: 0.4,                  // small — accents, not masses
      maxScale: 1.8,                  // shimmer to 1.8x on harmonic content
      frequencyRange: [2000, 8000],   // Hz — harmonics + overtones
      // Response (faster than bass — shimmer quality)
      responseSmoothing: 0.75,
      attackSpeed: 0.25,
      releaseDecay: 0.92,             // ~0.8s to 10% — quick fade
      // Visuals
      color: [0.878, 0.941, 1.0],    // #E0F0FF — ice white
      emissiveIntensity: 3.0,         // brightest element — piercing points
      wireframe: true,                // wireframe = crystalline lattice
      // Animation
      rotationSpeed: 0.5,             // slow tumble (radians/sec base)
      rotationJitter: 0.3,            // per-instance rotation speed variance
      // Spatial layout — wider spread, everywhere
      spatialSpread: 50,
      verticalSpread: 25,
    },
  },

  grass: {
    enabled: false, // no natural vegetation in the void
  },

  flowers: {
    enabled: false, // no natural forms
  },

  particles: {
    fireflies: { enabled: false },
    dust: { enabled: false },
    rain: { enabled: false },
    spray: { enabled: false },

    // ─── Void Motes ───
    // Sparse field of drifting particles. The void has texture.
    // Adapted from DustMotes — cooler color, wider spread, slower drift.
    // Steal: dustMote.vert.glsl noise3D turbulence pattern.
    // Steal: firefly.frag.glsl radial glow (softer falloff for motes).
    voidMotes: {
      enabled: true,
      count: 800,                     // sparse — emptiness is the point
      color: [0.690, 0.784, 0.878],  // #B0C8E0 — cool white
      brightness: 0.4,               // dim — background texture, not focus
      driftSpeed: 0.05,              // barely moving — emphasizes void scale
      spread: 200,                   // world units — vast empty space
      verticalRange: [-50, 50],      // full 3D spread (no ground constraint)
      sizeRange: [20, 60],           // point sizes
      blending: 'additive',          // glow accumulation
      // Audio response — subtle brightening on sound
      audioResponse: 0.3,            // 30% brightness boost from FFT energy
      audioSmoothing: 0.95,          // very smooth — motes don't jitter
    },

    // ─── Resonance Particles ───
    // Burst-on-beat particles. Radial explosion from bass sphere positions.
    // Adapted from lightning sparks (storm-field).
    // Steal: rain.vert.glsl cross-product stretch for velocity trails.
    resonanceParticles: {
      enabled: true,
      count: 200,                     // particle pool
      color: [0.545, 0.184, 0.788],  // match bass sphere violet
      burstOnBeat: true,
      burstCount: 15,                 // particles per beat event
      decayMs: 1500,                  // fade over 1.5s
      velocitySpread: 5.0,           // radial burst speed (world units/s)
      // Velocity stretch (stolen from rain shader cross-product)
      streakLength: 0.03,            // stretch multiplier
      emissive: true,
      emissiveIntensity: 2.0,
      blending: 'additive',
    },
  },

  lighting: {
    // No directional sun. All light is emissive from audio geometry.
    // Minimal ambient keeps void surfaces barely visible.
    sunColor: [0.10, 0.10, 0.15],   // deep blue ambient fill
    sunIntensity: 0.05,              // near-zero directional
    ambientIntensity: 0.02,          // near-total darkness
    // Dynamic point lights attached to bass spheres (see audioGeometry.bassSpheres.emitLight)
  },

  fog: {
    near: 30,
    far: 300,                        // very far — void needs perceived depth
    color: '#050508',                // matches background — seamless fade
    density: 0.001,                  // minimal — void is clear, not hazy
  },

  postFX: {
    bloom: {
      threshold: 0.3,               // LOW — emissive geometry MUST glow
      intensity: 1.2,               // STRONG — bloom IS the atmosphere here
      levels: 8,                     // maximum mip levels for wide halos
    },
    grain: { intensity: 0.08 },      // texture the darkness
    vignette: {
      darkness: 0.85,                // heavy — tunnel vision into void
      offset: 0.2,                   // tight
    },
    ca: {
      offset: [0.004, 0.002],       // strong — lens distortion in abstraction
      radialModulation: true,
    },
    toneMapping: 'UNCHARTED2',       // moody compression for deep darks
    kuwahara: { enabled: false },    // no painterly — clean/digital void
    godRays: { enabled: false },     // no sun, no god
    dof: { enabled: false },         // everything in focus — all is important
    ssao: { enabled: false },        // no surfaces to occlude
    // Color grade driven by keyframes — purple shadows, cyan highlights
    colorGrade: {
      contrast: 0.15,                // high contrast — bright geometry, dark void
      vibrance: 0.8,                 // saturated — electric colors
      warmth: -0.05,                 // cold bias — this is not a warm place
      // Split-tone: purple shadows + cyan highlights
      // Stolen from exp-081 split-tone pattern (zero perf cost)
      splitTone: {
        shadowHue: 0.75,             // purple
        shadowSaturation: 0.15,
        highlightHue: 0.55,          // cyan
        highlightSaturation: 0.10,
      },
    },
  },

  camera: {
    pathType: 'helix',               // helical spiral through void
    // No terrain to follow — full 3D freedom.
    // Spiral through clusters of audio geometry.
    // At t=0.50 (CONVERGENCE), camera is INSIDE the densest cluster.
    // At t=0.75 (DISSOLUTION), camera descends below the cluster.
    heightOffset: 0,                 // no terrain offset — raw Y from controlPoints
    dampingFactor: 1.5,              // moderate lag — floating, not snappy
    fov: 60,                         // wide — immersive void
    controlPoints: [
      [0, 0, 0],                     // SILENCE — origin, empty space
      [15, 8, -20],                  // EMERGENCE — rising, distant geometry appears
      [5, 0, -50],                   // CONVERGENCE — through the center of the cluster
      [-10, -5, -75],                // DISSOLUTION — descending, geometry above
      [0, 3, -100],                  // ECHO — drifting out, looking back
    ],
    // Slow rotation — void has no fixed orientation
    autoRotate: {
      enabled: true,
      speed: 0.02,                   // degrees per frame — glacial
    },
  },

  scoreSheets: {
    enabled: false, // no physical objects in the void
  },

  figure: {
    enabled: false, // you ARE dissolved into the music
  },

  audio: {
    ambient: null,                   // music IS the world — no ambient needed
    musicTrigger: { threshold: 0.1 }, // music starts almost immediately
    track: {
      title: 'Dissolution',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null, // placeholder — wire when MP3 available
    },
    // ═══ UNIQUE: This world is audio-dependent ═══
    // Without music playing, the void is truly empty.
    // The geometry IS the sound. No sound = no world.
    audioRequired: true,
    // Upload FFT data as 1x1024 DataTexture (RED format)
    // Stolen from exp-038 spectral fireflies pipeline.
    fftTextureEnabled: true,
    fftTextureSize: 1024,
  },

  dominantColor: '#8B2FC9', // deep violet
}
