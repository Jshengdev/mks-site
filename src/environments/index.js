// Environment registry — maps world IDs to configs
// Music is the router — each world has an associated track
import goldenMeadow from './golden-meadow.js'
import oceanCliff from './ocean-cliff.js'
import nightMeadow from './night-meadow.js'
import ghibliPainterly from './ghibli-painterly.js'
import stormField from './storm-field.js'

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
}

// Ordered list for navigation (the journey sequence)
export const ENV_ORDER = [
  'golden-meadow',
  'ocean-cliff',
  'night-meadow',
  'ghibli-painterly',
  'storm-field',
]

// Build track list from environments (for MiniPlayer)
export const TRACK_LIST = ENV_ORDER.map(id => ({
  worldId: id,
  ...ENVIRONMENTS[id].audio.track,
  emotion: ENVIRONMENTS[id].emotion,
  dominantColor: ENVIRONMENTS[id].dominantColor,
}))

export { goldenMeadow, oceanCliff, nightMeadow, ghibliPainterly, stormField }
