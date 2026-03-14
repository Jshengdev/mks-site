// src/meadow/MusicTrigger.js
// Triggers a music snippet at a scroll threshold with a visual pulse (BotW discovery feel)

const PULSE_DURATION = 1.5

export default class MusicTrigger {
  constructor(postProcessing, options = {}) {
    this.postProcessing = postProcessing
    this.threshold = options.threshold || 0.35
    this.audioSrc = options.audioSrc || null
    this.triggered = false
    this._audioCtx = null
    this._sourceNode = null
    this._pulseTime = 0
    this._pulsing = false
    this._baseBloom = 0
    this._baseVignette = 0
  }

  update(scrollProgress, deltaTime) {
    if (!this.triggered && scrollProgress >= this.threshold && this.audioSrc) {
      this._trigger()
    }

    if (!this._pulsing) return

    this._pulseTime += deltaTime
    // Quick bloom spike that decays over 1.5s (quadratic decay)
    const pulseAmount = Math.max(0, 1.0 - this._pulseTime / PULSE_DURATION)
    const eased = pulseAmount * pulseAmount
    this.postProcessing.bloom.intensity = this._baseBloom + eased * 0.5
    this.postProcessing.vignette.darkness = this._baseVignette - eased * 0.2

    if (this._pulseTime > PULSE_DURATION) {
      this._pulsing = false
      // AtmosphereController will take over on next frame
    }
  }

  _trigger() {
    this.triggered = true

    // Capture current values for pulse animation baseline
    this._baseBloom = this.postProcessing.bloom.intensity
    this._baseVignette = this.postProcessing.vignette.darkness
    this._pulseTime = 0
    this._pulsing = true

    // Audio fade-in
    try {
      this._audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const gain = this._audioCtx.createGain()
      gain.gain.setValueAtTime(0, this._audioCtx.currentTime)
      gain.gain.linearRampToValueAtTime(0.6, this._audioCtx.currentTime + 2.0)
      gain.connect(this._audioCtx.destination)

      fetch(this.audioSrc)
        .then(r => r.arrayBuffer())
        .then(buf => this._audioCtx.decodeAudioData(buf))
        .then(decoded => {
          this._sourceNode = this._audioCtx.createBufferSource()
          this._sourceNode.buffer = decoded
          this._sourceNode.connect(gain)
          this._sourceNode.start()
        })
        .catch(err => console.warn('MusicTrigger: audio load failed', err))
    } catch (err) {
      console.warn('MusicTrigger: Web Audio not available', err)
    }
  }

  dispose() {
    if (this._sourceNode) {
      try { this._sourceNode.stop() } catch (_) { /* already stopped */ }
    }
    if (this._audioCtx) {
      this._audioCtx.close()
    }
  }
}
