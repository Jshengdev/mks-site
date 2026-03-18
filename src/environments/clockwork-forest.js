// Clockwork Forest — The Awakening
// Emotional temperature: Mechanical Becoming
// "The gears turned for centuries with no one watching.
//  Then something grew between the teeth. Then it breathed."

export default {
  id: 'clockwork-forest',
  name: 'Clockwork Forest',
  route: '/forge',
  emotion: 'Mechanical Becoming',
  tagline: 'precision fractures, life finds the cracks',

  // What the viewer feels:
  // You enter a forest that shouldn't exist. The trees are brass and copper,
  // their branches are gear trains, their leaves unfold on schedule.
  // Steam rises from vents in the forest floor — the earth itself is an engine.
  // But as you move deeper, something impossible happens:
  // green shoots push through gear teeth. Moss covers clockwork.
  // By the end, you can't tell where machine ends and life begins.
  // The music is the moment the machine learns to breathe.

  terrain: {
    type: 'clockwork-forest',
    // Overlapping gear-tooth ridges + tree trunk mounds + steam channels
    // Source: polar repetition (Shadertoy sphere gears) + gaussian mounds
    size: 400,
    segments: 192, // high detail for gear teeth
  },

  sky: {
    type: 'preetham',
    turbidity: 6.0,         // hazy from steam
    rayleigh: 1.2,
    mieCoefficient: 0.015,  // stronger Mie = steam catching light
    sunElevation: 10,       // low enough for long shadows through gear trees
    // No stars — the steam canopy obscures the sky
  },

  grass: {
    enabled: true,
    bladeCount: 25000,       // sparse at first — nature reclaiming, not meadow
    baseColor: [0.02, 0.06, 0.02],   // dark under steam canopy
    tipColor: [0.10, 0.28, 0.06],    // muted olive — not golden, not vivid
    windSpeed: 0.4,          // slow — steam-dampened air
  },

  flowers: {
    enabled: true,
    count: 200,              // rare — each one is a miracle
    // Warm copper-to-green palette: flowers born from oxidation
    palette: ['#b87333', '#8b6914', '#4a7a4a', '#6b8e6b', '#d4a830', '#3a6a3a'],
  },

  particles: {
    fireflies: { enabled: false },  // no fireflies — sparks instead
    dust: {
      enabled: true,
      count: 300,            // metallic gear dust catching light
    },
    rain: { enabled: false },
    spray: { enabled: false },
    // Steam plumes — rising from vents in the gear floor
    // Adapted from: SqrtPapere/SmokeGL (particle lifetime, upward velocity)
    // + juniorxsound/Particle-Curl-Noise (curl noise for organic drift)
    steam: {
      enabled: true,
      count: 400,
      color: [0.85, 0.80, 0.75],  // warm grey — not pure white
      riseSpeed: 1.5,
      disperseRadius: 3.0,
    },
    // Sparks — from gear friction, orange-amber bursts
    // Adapted from: existing DustMotes with orange→yellow color variance
    sparks: {
      enabled: true,
      count: 120,
      color: [0.95, 0.65, 0.20],  // orange-amber
      burstInterval: [3000, 8000], // ms between spark bursts
    },
  },

  lighting: {
    sunColor: [0.85, 0.72, 0.50],   // warm amber through steam
    sunIntensity: 1.3,
    ambientIntensity: 0.12,
    // Steam scatters light — high ambient relative to sun = soft fill
  },

  fog: {
    near: 15,
    far: 90,
    color: '#2a2218',    // warm brown-bronze haze
    density: 0.008,      // moderate — dense enough to hide gear edges
  },

  postFX: {
    bloom: { threshold: 0.45, intensity: 0.7, levels: 8 },  // spark glow + steam catch
    grain: { intensity: 0.08 },      // industrial grain — gritty
    vignette: { darkness: 0.65, offset: 0.30 },
    ca: { offset: [0.002, 0.001] },  // subtle lens stress from heat shimmer
    toneMapping: 'ACES_FILMIC',      // warm compression
    kuwahara: { enabled: false },    // NOT painterly — this world is precise
    godRays: {
      enabled: true,                 // rays through steam gaps = defining visual
      numSamples: 50,
      decay: 0.96,
      exposure: 0.7,
    },
    dof: {
      enabled: true,
      focusDistance: 12,     // mid-range focus
      focusRange: 3.0,      // moderate DOF — see the machinery
      bokehScale: 3.5,      // gear bokeh
    },
    ssao: { enabled: true },  // SSAO critical — reveals gear depth and shadow
  },

  camera: {
    pathType: 's-curve',
    // Winding through the gear forest — weaving between mechanical trees
    // Height varies: low through steam channels, rising over gear ridges
    heightOffset: 2.0,
    dampingFactor: 1.8,   // slightly cinematic — machinery reveals slowly
    fov: 48,              // slightly wider than meadow — immersive machinery
    controlPoints: [
      [0, 0, 0],          // entrance — fog, steam, first gear sounds
      [5, 0, -25],        // past first gear tree — brass canopy above
      [-4, 0, -50],       // through steam channel — visibility drops
      [6, 0, -75],        // FRACTURE point — first green shoot visible
      [-5, 0, -105],      // symbiosis zone — gears wrapped in vines
      [3, 0, -135],       // deep organic — machine barely visible
      [0, 0, -160],       // exit — fully alive, the machine IS the tree
    ],
  },

  scoreSheets: {
    enabled: true,
    count: 2,
    type: 'pinned',      // pinned to gear surfaces — blueprint fragments
  },

  figure: {
    enabled: false,       // you ARE the viewer — walking through the awakening
  },

  audio: {
    ambient: 'mechanical',  // ticking, hissing steam, distant gear grinding
    musicTrigger: { threshold: 0.35 },
    track: {
      title: 'Mechanical Becoming',
      artist: 'Michael Kim-Sheng',
      album: 'Heavy Moon',
      src: null, // placeholder — wire when MP3 available
    },
  },

  // ─── Gear Trees ─── 20 brass/copper trees with rotating gears at branch tips
  // Techniques: EmptySamurai/GearTrain (gear profile), mattatz/THREE.Tree (branching)
  gearTrees: {
    enabled: true,
    count: 20,
    trunkColor: [0.72, 0.45, 0.20],   // dark aged copper
    branchColor: [0.91, 0.78, 0.42],  // warm brass
    gearColor: [0.96, 0.64, 0.54],    // bright polished copper
    gearTeeth: 12,
    maxGearSpeed: 0.5,                 // radians/sec — slow and deliberate
  },

  // ─── Copper Leaves ─── metallic leaf instances clustered near gear trees
  // PBR: roughness 0.3, metalness 0.9 — physicallybased.info copper values
  copperLeaves: {
    enabled: true,
    count: 400,
    color: [0.96, 0.64, 0.54],  // matches gear copper
  },

  dominantColor: '#8b6914',  // aged brass
}
