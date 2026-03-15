// Environment registry — maps route IDs to configs
import goldenMeadow from './golden-meadow.js'
import oceanCliff from './ocean-cliff.js'
import nightMeadow from './night-meadow.js'
import ghibliPainterly from './ghibli-painterly.js'
import stormField from './storm-field.js'

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

// Route path -> env ID lookup
export const ROUTE_MAP = Object.fromEntries(
  Object.values(ENVIRONMENTS).map(env => [env.route, env.id])
)

export { goldenMeadow, oceanCliff, nightMeadow, ghibliPainterly, stormField }
