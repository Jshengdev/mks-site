// ScrollEngine — Lenis smooth scroll wrapper
// Source: darkroomengineering/lenis
// Exposes progress (0→1) and velocity as plain properties read synchronously each frame
import Lenis from 'lenis'

export default class ScrollEngine {
  constructor() {
    this.progress = 0
    this.velocity = 0
    this._raf = null

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    })

    this.lenis.on('scroll', (e) => {
      this.progress = e.progress
      this.velocity = e.velocity
    })

    this._tick = this._tick.bind(this)
    this._tick(performance.now())
  }

  _tick(time) {
    this.lenis.raf(time)
    this._raf = requestAnimationFrame(this._tick)
  }

  destroy() {
    cancelAnimationFrame(this._raf)
    this.lenis.destroy()
  }
}
