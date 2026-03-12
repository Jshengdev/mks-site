// Adapted to consume Lenis scroll progress (0->1)
import { useEffect, useRef } from 'react'

export default function useScrollAudio(engineRef) {
  const rafRef = useRef(null)

  useEffect(() => {
    const tick = () => {
      const engine = engineRef.current
      const audio = document.querySelector('audio')
      if (!engine || !audio || audio.paused) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const progress = engine.scrollEngine?.progress ?? 0

      // Volume: silent below 0.05, ramp to full by 0.15
      if (progress <= 0.05) {
        audio.volume = 0
      } else if (progress >= 0.15) {
        audio.volume = 1
      } else {
        const t = (progress - 0.05) / 0.1
        audio.volume = t * t // quadratic ease-in
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(rafRef.current)
  }, [engineRef])
}
