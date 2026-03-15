// LightningSystem — Screen flash + ambient light burst for storm atmosphere
// Flashes white then decays over configurable duration
// Triggers at random intervals (stolen from standard storm simulation patterns)
import * as THREE from 'three'

export default class LightningSystem {
  constructor(sceneSetup, postProcessing, config = {}) {
    this.sceneSetup = sceneSetup
    this.postProcessing = postProcessing

    this.decayMs = config.decayMs ?? 200
    this.minInterval = config.interval?.[0] ?? 8000
    this.maxInterval = config.interval?.[1] ?? 20000

    this._flashIntensity = 0
    this._nextFlashTime = this._randomInterval()
    this._elapsed = 0

    // Store base ambient intensity to restore after flash
    this._baseAmbient = sceneSetup.ambientLight?.intensity ?? 0.05
  }

  _randomInterval() {
    return this.minInterval + Math.random() * (this.maxInterval - this.minInterval)
  }

  update(elapsed, delta) {
    this._elapsed = elapsed * 1000 // convert to ms

    // Check if it's time for a new flash
    if (this._elapsed > this._nextFlashTime && this._flashIntensity <= 0) {
      this._flashIntensity = 1.0
      this._nextFlashTime = this._elapsed + this._randomInterval()
    }

    // Decay the flash
    if (this._flashIntensity > 0) {
      this._flashIntensity -= (delta * 1000) / this.decayMs
      this._flashIntensity = Math.max(0, this._flashIntensity)
      this._pushFlash()
    }
  }

  _pushFlash() {
    const f = this._flashIntensity

    // Boost ambient light during flash
    if (this.sceneSetup.ambientLight) {
      this.sceneSetup.ambientLight.intensity = this._baseAmbient + f * 1.5
    }

    // Boost sun light briefly
    if (this.sceneSetup.sunLight) {
      this.sceneSetup.sunLight.intensity += f * 3.0
    }

    // Boost bloom during flash for dramatic glow
    if (this.postProcessing?.bloom) {
      this.postProcessing.bloom.intensity += f * 0.8
    }
  }

  // Call when atmosphere updates base ambient (so we know what to restore to)
  setBaseAmbient(value) {
    this._baseAmbient = value
  }

  dispose() {
    // No resources to clean up
  }
}
