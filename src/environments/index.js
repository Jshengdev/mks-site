// Environment registry — maps world IDs to configs
// Music is the router — each world has an associated track
import goldenMeadow from './golden-meadow.js'
import oceanCliff from './ocean-cliff.js'
import nightMeadow from './night-meadow.js'
import ghibliPainterly from './ghibli-painterly.js'
import stormField from './storm-field.js'
import volcanicObservatory from './volcanic-observatory.js'
import floatingLibrary from './floating-library.js'
import crystalCavern from './crystal-cavern.js'
import memoryGarden from './memory-garden.js'
import tidePool from './tide-pool.js'
import clockworkForest from './clockwork-forest.js'
import auroraTundra from './aurora-tundra.js'
import infiniteStaircase from './infinite-staircase.js'
import bioluminescentDeep from './bioluminescent-deep.js'
import paperWorld from './paper-world.js'
import sonicVoid from './sonic-void.js'
import underwaterCathedral from './underwater-cathedral.js'

// Wire actual audio files via ES imports (Vite resolves these to hashed URLs)
import inAFieldOfSilence from '../assets/audio/In a Field of Silence.mp3'

// Set resolved audio sources
goldenMeadow.audio.track.src = inAFieldOfSilence

export const ENVIRONMENTS = {
  'golden-meadow': goldenMeadow,
  'ocean-cliff': oceanCliff,
  'night-meadow': nightMeadow,
  'ghibli-painterly': ghibliPainterly,
  'storm-field': stormField,
  'volcanic-observatory': volcanicObservatory,
  'floating-library': floatingLibrary,
  'crystal-cavern': crystalCavern,
  'memory-garden': memoryGarden,
  'tide-pool': tidePool,
  'clockwork-forest': clockworkForest,
  'aurora-tundra': auroraTundra,
  'infinite-staircase': infiniteStaircase,
  'bioluminescent-deep': bioluminescentDeep,
  'paper-world': paperWorld,
  'sonic-void': sonicVoid,
  'underwater-cathedral': underwaterCathedral,
}

// Ordered list for navigation (the journey sequence)
export const ENV_ORDER = [
  'golden-meadow',
  'ocean-cliff',
  'night-meadow',
  'ghibli-painterly',
  'storm-field',
  'volcanic-observatory',
  'floating-library',
  'memory-garden',
  'tide-pool',
  'clockwork-forest',
  'aurora-tundra',
  'infinite-staircase',
  'bioluminescent-deep',
  'paper-world',
  'sonic-void',
  'underwater-cathedral',
]

// Build track list from environments (for MiniPlayer)
export const TRACK_LIST = ENV_ORDER.map(id => ({
  worldId: id,
  ...ENVIRONMENTS[id].audio.track,
  emotion: ENVIRONMENTS[id].emotion,
  dominantColor: ENVIRONMENTS[id].dominantColor,
}))

export { goldenMeadow, oceanCliff, nightMeadow, ghibliPainterly, stormField, volcanicObservatory, floatingLibrary, crystalCavern, memoryGarden, tidePool, clockworkForest, auroraTundra, infiniteStaircase, bioluminescentDeep, paperWorld, sonicVoid, underwaterCathedral }
