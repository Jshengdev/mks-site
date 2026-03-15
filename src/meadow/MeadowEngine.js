// MeadowEngine — Backward-compatible wrapper around WorldEngine
// Provides the same API as before for existing code (DevTuner, etc.)
// New code should use WorldEngine directly with an environment config.
import WorldEngine from './WorldEngine.js'
import goldenMeadow from '../environments/golden-meadow.js'

export default class MeadowEngine extends WorldEngine {
  constructor(canvas) {
    super(canvas, goldenMeadow)
  }
}
