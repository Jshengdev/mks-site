// src/meadow/MusicTrigger.js
// Triggers a music snippet at a scroll threshold with a visual pulse (BotW discovery feel)

export default class MusicTrigger {
  constructor(postProcessing, options = {}) {
    this.postProcessing = postProcessing
    this.threshold = options.threshold || 0.35
    this.audioSrc = options.audioSrc || null // URL to audio file
    this.triggered = false
    this.audioCtx = null
    this.gainNode = null
    this.sourceNode = null
    this._pulseTime = 0
    this._pulsing = false
    this._baseBloom = 0
    this._baseVignette = 0
  }

  update(scrollProgress, deltaTime) {
    // Check trigger
    if (!this.triggered && scrollProgress >= this.threshold && this.audioSrc) {
      this._trigger()
    }

    // Animate visual pulse
    if (this._pulsing) {
      this._pulseTime += deltaTime
      const t = this._pulseTime
      // Quick bloom spike that decays over 1.5s
      const pulseAmount = Math.max(0, 1.0 - t / 1.5)
      const eased = pulseAmount * pulseAmount // quadratic decay
      this.postProcessing.bloom.intensity = this._baseBloom + eased * 0.5
      this.postProcessing.vignette.darkness = this._baseVignette - eased * 0.2

      if (t > 1.5) {
        this._pulsing = false
        // Restore — AtmosphereController will take over on next frame
      }
    }
  }

  _trigger() {
    this.triggered = true

    // Visual pulse
    this._baseBloom = this.postProcessing.bloom.intensity
    this._baseVignette = this.postProcessing.vignette.darkness
    this._pulseTime = 0
    this._pulsing = true

    // Audio fade-in
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      this.gainNode = this.audioCtx.createGain()
      this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime)
      this.gainNode.gain.linearRampToValueAtTime(0.6, this.audioCtx.currentTime + 2.0)
      this.gainNode.connect(this.audioCtx.destination)

      fetch(this.audioSrc)
        .then(r => r.arrayBuffer())
        .then(buf => this.audioCtx.decodeAudioData(buf))
        .then(decoded => {
          this.sourceNode = this.audioCtx.createBufferSource()
          this.sourceNode.buffer = decoded
          this.sourceNode.connect(this.gainNode)
          this.sourceNode.start()
        })
        .catch(err => console.warn('MusicTrigger: audio load failed', err))
    } catch (err) {
      console.warn('MusicTrigger: Web Audio not available', err)
    }
  }

  dispose() {
    if (this.sourceNode) {
      try { this.sourceNode.stop() } catch (e) { /* ignore */ }
    }
    if (this.audioCtx) {
      this.audioCtx.close()
    }
  }
}
