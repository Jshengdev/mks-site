import { useEffect, useRef } from 'react'

export default function MoonlightCursor() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let mouse = { x: -100, y: -100 }
    let trail = []
    let dust = []
    let frameCount = 0
    let lastMouse = { x: -100, y: -100 }

    const TRAIL_LENGTH = 100
    const SMOOTH = 0.18
    let smoothX = -100
    let smoothY = -100

    // Delayed trail head — lags behind cursor for that flowing feel
    let delayedX = -100
    let delayedY = -100
    const DELAY_SMOOTH = 0.09

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e) => {
      lastMouse.x = mouse.x
      lastMouse.y = mouse.y
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    window.addEventListener('mousemove', onMouseMove)

    function createDust(x, y, vx, vy) {
      const angle = Math.atan2(vy, vx) + Math.PI + (Math.random() - 0.5) * 1.2
      const drift = 0.1 + Math.random() * 0.3
      return {
        x,
        y,
        vx: Math.cos(angle) * drift + (Math.random() - 0.5) * 0.1,
        vy: Math.sin(angle) * drift + (Math.random() - 0.5) * 0.1,
        life: 0,
        maxLife: 40 + Math.random() * 35,
        size: 0.5 + Math.random() * 1.5,
        brightness: 0.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        isBlooming: Math.random() < 0.12,
        petalCount: 4 + Math.floor(Math.random() * 2),
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
      }
    }

    function drawTrail() {
      if (trail.length < 4) return

      // Draw smooth bezier trail with tapering width and brightness gradient
      // Use quadratic curves through midpoints for silky smooth path
      for (let i = 2; i < trail.length - 1; i++) {
        const t = i / trail.length

        // Smooth cubic ease for alpha — bright head, long elegant taper
        const alpha = Math.pow(t, 1.6) * 0.8
        // Width tapers from thick to hairline
        const width = Math.pow(t, 1.8) * 8 + 0.3

        if (alpha < 0.002) continue

        const prev = trail[i - 1]
        const curr = trail[i]
        const next = trail[i + 1]

        // Midpoints for smooth bezier
        const mx = (curr.x + next.x) / 2
        const my = (curr.y + next.y) / 2

        ctx.beginPath()
        ctx.moveTo((prev.x + curr.x) / 2, (prev.y + curr.y) / 2)
        ctx.quadraticCurveTo(curr.x, curr.y, mx, my)
        ctx.strokeStyle = `rgba(225, 238, 255, ${alpha})`
        ctx.lineWidth = width
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
      }

      // Soft glow haze — wider, more diffused, follows trail
      for (let i = trail.length - 1; i > trail.length * 0.2; i -= 3) {
        const t = i / trail.length
        const p = trail[i]
        const glowAlpha = Math.pow(t, 1.8) * 0.12
        const glowSize = 22 + (1 - t) * 18

        if (glowAlpha < 0.001) continue

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize)
        g.addColorStop(0, `rgba(215, 230, 255, ${glowAlpha})`)
        g.addColorStop(0.5, `rgba(215, 230, 255, ${glowAlpha * 0.3})`)
        g.addColorStop(1, 'rgba(215, 230, 255, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function drawDust(d) {
      const progress = d.life / d.maxLife
      let alpha
      if (progress < 0.12) {
        alpha = progress / 0.12
      } else if (progress > 0.55) {
        alpha = 1 - (progress - 0.55) / 0.45
      } else {
        alpha = 1
      }
      alpha *= alpha

      if (alpha <= 0) return

      const twinkle = 0.65 + 0.35 * Math.sin(d.phase + d.life * 0.15)
      const finalAlpha = alpha * twinkle * d.brightness * 0.5

      if (d.isBlooming) {
        const bloomOpen = progress < 0.25
          ? Math.pow(progress / 0.25, 2)
          : 1
        const petalLen = d.size * 2.2 * bloomOpen
        const petalW = d.size * 0.7

        ctx.save()
        ctx.translate(d.x, d.y)
        ctx.rotate(d.rotation)

        for (let i = 0; i < d.petalCount; i++) {
          const angle = (Math.PI * 2 / d.petalCount) * i
          ctx.save()
          ctx.rotate(angle)
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.bezierCurveTo(
            -petalW * 0.5, -petalLen * 0.35,
            -petalW * 0.3, -petalLen * 0.8,
            0, -petalLen
          )
          ctx.bezierCurveTo(
            petalW * 0.3, -petalLen * 0.8,
            petalW * 0.5, -petalLen * 0.35,
            0, 0
          )
          ctx.fillStyle = `rgba(230, 240, 255, ${finalAlpha * 0.35})`
          ctx.fill()
          ctx.restore()
        }

        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, d.size * 0.5)
        cg.addColorStop(0, `rgba(255, 255, 255, ${finalAlpha * 0.4})`)
        cg.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = cg
        ctx.beginPath()
        ctx.arc(0, 0, d.size * 0.5, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      } else {
        const r = d.size * (0.5 + alpha * 0.5)

        // Soft glow
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r * 3.5)
        g.addColorStop(0, `rgba(255, 255, 255, ${finalAlpha * 0.6})`)
        g.addColorStop(0.25, `rgba(225, 238, 255, ${finalAlpha * 0.2})`)
        g.addColorStop(1, 'rgba(225, 238, 255, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(d.x, d.y, r * 3.5, 0, Math.PI * 2)
        ctx.fill()

        // Bright core
        ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha * 0.85})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, r * 0.35, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function drawCursor() {
      const x = smoothX
      const y = smoothY

      // Massive outer glow
      const outer = ctx.createRadialGradient(x, y, 0, x, y, 300)
      outer.addColorStop(0, 'rgba(225, 238, 255, 0.15)')
      outer.addColorStop(0.15, 'rgba(220, 235, 255, 0.08)')
      outer.addColorStop(0.4, 'rgba(215, 230, 255, 0.03)')
      outer.addColorStop(0.7, 'rgba(215, 230, 255, 0.008)')
      outer.addColorStop(1, 'rgba(215, 230, 255, 0)')
      ctx.fillStyle = outer
      ctx.beginPath()
      ctx.arc(x, y, 300, 0, Math.PI * 2)
      ctx.fill()

      // Mid glow ring
      const mid = ctx.createRadialGradient(x, y, 0, x, y, 80)
      mid.addColorStop(0, 'rgba(230, 242, 255, 0.25)')
      mid.addColorStop(0.3, 'rgba(220, 235, 255, 0.1)')
      mid.addColorStop(0.7, 'rgba(215, 230, 255, 0.02)')
      mid.addColorStop(1, 'rgba(215, 230, 255, 0)')
      ctx.fillStyle = mid
      ctx.beginPath()
      ctx.arc(x, y, 80, 0, Math.PI * 2)
      ctx.fill()

      // Inner bright core
      const inner = ctx.createRadialGradient(x, y, 0, x, y, 15)
      inner.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
      inner.addColorStop(0.4, 'rgba(240, 248, 255, 0.4)')
      inner.addColorStop(1, 'rgba(225, 238, 255, 0)')
      ctx.fillStyle = inner
      ctx.beginPath()
      ctx.arc(x, y, 15, 0, Math.PI * 2)
      ctx.fill()

      // Crisp center dot
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    function animate() {
      frameCount++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Cursor dot tracks mouse quickly
      smoothX += (mouse.x - smoothX) * SMOOTH
      smoothY += (mouse.y - smoothY) * SMOOTH

      // Trail head lags behind with a slower ease — creates the delay
      delayedX += (smoothX - delayedX) * DELAY_SMOOTH
      delayedY += (smoothY - delayedY) * DELAY_SMOOTH

      const vx = mouse.x - lastMouse.x
      const vy = mouse.y - lastMouse.y
      const speed = Math.hypot(vx, vy)

      // Trail follows the delayed position
      trail.push({ x: delayedX, y: delayedY })
      if (trail.length > TRAIL_LENGTH) trail.shift()

      // Only spawn dust on movement
      if (speed > 1.5 && frameCount % 2 === 0) {
        const count = Math.min(4, Math.floor(speed / 5) + 1)
        for (let i = 0; i < count; i++) {
          const t = Math.random() * 0.35
          const idx = Math.floor(trail.length * (1 - t))
          const spawn = trail[Math.min(idx, trail.length - 1)]
          dust.push(createDust(
            spawn.x + (Math.random() - 0.5) * 5,
            spawn.y + (Math.random() - 0.5) * 5,
            vx, vy
          ))
        }
      }

      // Update dust — zero gravity float
      dust = dust.filter(d => {
        d.life++
        d.x += d.vx
        d.y += d.vy
        d.vx *= 0.988
        d.vy *= 0.988
        d.rotation += d.rotSpeed
        return d.life < d.maxLife
      })

      drawTrail()
      dust.forEach(drawDust)
      drawCursor()

      // Store last mouse for next frame velocity
      lastMouse.x = mouse.x
      lastMouse.y = mouse.y

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  )
}
