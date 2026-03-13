// src/meadow/AudioReactive.js
// FFT frequency-to-shader coupling + beat detection
// Stolen from L17 + interactive-particles-music-visualizer
export default class AudioReactive {
  constructor() {
    this.audioCtx = null
    this.analyser = null
    this.source = null
    this.dataArray = null
    this.bass = 0
    this.mid = 0
    this.high = 0
    this.beat = false
    this._beatHistory = new Array(30).fill(0)
    this._historyIdx = 0
    this._beatCooldown = 0
    this.peakSensitivity = 1.1
    this.fftSize = 2048
    this.smoothing = 0.7
  }

  connectElement(audioElement) {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    this.analyser = this.audioCtx.createAnalyser()
    this.analyser.fftSize = this.fftSize
    this.analyser.smoothingTimeConstant = this.smoothing
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.source = this.audioCtx.createMediaElementSource(audioElement)
    this.source.connect(this.analyser)
    this.analyser.connect(this.audioCtx.destination)
  }

  connectSource(audioCtx, sourceNode) {
    this.audioCtx = audioCtx
    this.analyser = audioCtx.createAnalyser()
    this.analyser.fftSize = this.fftSize
    this.analyser.smoothingTimeConstant = this.smoothing
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    sourceNode.connect(this.analyser)
    this.source = sourceNode
  }

  update(deltaTime) {
    if (!this.analyser) return
    this.analyser.getByteFrequencyData(this.dataArray)
    const sr = this.audioCtx.sampleRate

    // Band extraction (stolen from L17: bin = freq * fftSize / sampleRate)
    this.bass = this._avgBand(0, Math.round(250 * this.fftSize / sr))
    this.mid = this._avgBand(
      Math.round(150 * this.fftSize / sr),
      Math.round(2000 * this.fftSize / sr)
    )
    this.high = this._avgBand(
      Math.round(2000 * this.fftSize / sr),
      Math.round(6000 * this.fftSize / sr)
    )

    // Beat detection (stolen from L17: adaptive peak)
    const energy = this.bass
    this._beatHistory[this._historyIdx] = energy
    this._historyIdx = (this._historyIdx + 1) % 30
    const avg = this._beatHistory.reduce((a, b) => a + b) / 30
    this._beatCooldown = Math.max(0, this._beatCooldown - deltaTime)

    if (energy > avg * this.peakSensitivity && this._beatCooldown <= 0) {
      this.beat = true
      this._beatCooldown = 0.2 // 200ms from L17
    } else {
      this.beat = false
    }
  }

  _avgBand(start, end) {
    if (!this.dataArray || end <= start) return 0
    let sum = 0
    for (let i = start; i < Math.min(end, this.dataArray.length); i++) sum += this.dataArray[i]
    return sum / (end - start) / 256
  }

  getUniforms() {
    return { uBass: this.bass, uMid: this.mid, uHigh: this.high, uBeat: this.beat ? 1.0 : 0.0 }
  }

  dispose() {
    if (this.analyser) this.analyser.disconnect()
  }
}
