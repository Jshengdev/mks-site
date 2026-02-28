import { useEffect, useRef } from 'react'
import './Overlays.css'

export default function Overlays() {
  const grainRef = useRef(null)

  useEffect(() => {
    const canvas = grainRef.current
    if (!canvas) return

    // Check reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    const size = 128
    canvas.width = size
    canvas.height = size

    let raf
    const drawGrain = () => {
      const imageData = ctx.createImageData(size, size)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 255
      }
      ctx.putImageData(imageData, 0, 0)
      // ~12fps grain refresh
      setTimeout(() => { raf = requestAnimationFrame(drawGrain) }, 83)
    }

    drawGrain()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <canvas ref={grainRef} className="overlay-grain" />
      <div className="overlay-vignette" />
    </>
  )
}
