// src/meadow/AudioReactive.js
// FFT frequency-to-shader coupling + beat detection
// Stolen from L17 + interactive-particles-music-visualizer

const FFT_SIZE = 2048
const SMOOTHING = 0.7
const PEAK_SENSITIVITY = 1.1
const BEAT_COOLDOWN_MS = 0.2
const HISTORY_LENGTH = 30

export default class AudioReactive {
  constructor() {
    this.audioCtx = null
    this.analyser = null
    this.dataArray = null
    this.bass = 0
    this.mid = 0
    this.high = 0
    this.beat = false
    this._beatHistory = new Array(HISTORY_LENGTH).fill(0)
    this._historyIdx = 0
    this._beatCooldown = 0
  }

  connectElement(audioElement) {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    this._initAnalyser()
    const source = this.audioCtx.createMediaElementSource(audioElement)
    source.connect(this.analyser)
    this.analyser.connect(this.audioCtx.destination)
  }

  connectSource(audioCtx, sourceNode) {
    this.audioCtx = audioCtx
    this._initAnalyser()
    sourceNode.connect(this.analyser)
  }

  _initAnalyser() {
    this.analyser = this.audioCtx.createAnalyser()
    this.analyser.fftSize = FFT_SIZE
    this.analyser.smoothingTimeConstant = SMOOTHING
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
  }

  update(deltaTime) {
    if (!this.analyser) return
    this.analyser.getByteFrequencyData(this.dataArray)
    const sr = this.audioCtx.sampleRate

    // Band extraction (stolen from L17: bin = freq * fftSize / sampleRate)
    this.bass = this._avgBand(0, Math.round(250 * FFT_SIZE / sr))
    this.mid = this._avgBand(
      Math.round(150 * FFT_SIZE / sr),
      Math.round(2000 * FFT_SIZE / sr)
    )
    this.high = this._avgBand(
      Math.round(2000 * FFT_SIZE / sr),
      Math.round(6000 * FFT_SIZE / sr)
    )

    // Beat detection (stolen from L17: adaptive peak)
    const energy = this.bass
    this._beatHistory[this._historyIdx] = energy
    this._historyIdx = (this._historyIdx + 1) % HISTORY_LENGTH
    const avg = this._beatHistory.reduce((a, b) => a + b) / HISTORY_LENGTH
    this._beatCooldown = Math.max(0, this._beatCooldown - deltaTime)

    if (energy > avg * PEAK_SENSITIVITY && this._beatCooldown <= 0) {
      this.beat = true
      this._beatCooldown = BEAT_COOLDOWN_MS
    } else {
      this.beat = false
    }
  }

  _avgBand(start, end) {
    if (!this.dataArray || end <= start) return 0
    const len = Math.min(end, this.dataArray.length)
    let sum = 0
    for (let i = start; i < len; i++) sum += this.dataArray[i]
    return sum / (end - start) / 256
  }

  dispose() {
    if (this.analyser) this.analyser.disconnect()
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close()
    }
  }
}
