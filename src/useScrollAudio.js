import { useEffect, useRef } from 'react'

/**
 * Ramps audio volume based on wave progress.
 * waveProgress: 0 (wave hasn't started) -> 1 (wave complete)
 *
 * At 0.0-0.3: silence
 * At 0.3: fade begins
 * At 0.5: full volume
 */
export default function useScrollAudio(waveProgress) {
  const prevVolRef = useRef(1)

  useEffect(() => {
    const audio = document.querySelector('audio')
    if (!audio || audio.paused) return

    if (waveProgress <= 0) {
      // Before wave -- don't touch volume (user may be listening)
      return
    }

    // Wave started -- modulate volume
    const audioFade = Math.max(0, Math.min(1,
      (waveProgress - 0.3) / 0.2
    ))
    const targetVol = audioFade * audioFade // quadratic ease-in
    audio.volume = Math.min(1, targetVol)
    prevVolRef.current = audio.volume
  }, [waveProgress])

  // Restore volume on unmount
  useEffect(() => {
    return () => {
      const audio = document.querySelector('audio')
      if (audio) audio.volume = 1
    }
  }, [])
}
