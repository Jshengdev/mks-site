import { useState, useRef, useEffect, useCallback } from 'react'
import './MiniPlayer.css'

const TRACK = {
  title: 'Through the Veil',
  artist: 'Michael Kim-Sheng',
  album: 'Heavy Moon',
  src: '/through-the-veil.mp3',
}

const BAR_COUNT = 48

export default function MiniPlayer() {
  const audioRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const ctxRef = useRef(null)
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const progressRef = useRef(null)

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [dragging, setDragging] = useState(false)

  // Set up audio analyser
  const initAnalyser = useCallback(() => {
    if (ctxRef.current) return
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 128
    analyser.smoothingTimeConstant = 0.8
    const source = ctx.createMediaElementSource(audioRef.current)
    source.connect(analyser)
    analyser.connect(ctx.destination)
    ctxRef.current = ctx
    analyserRef.current = analyser
    sourceRef.current = source
  }, [])

  // Visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const c = canvas.getContext('2d')

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      const w = canvas.width
      const h = canvas.height
      c.clearRect(0, 0, w, h)

      if (!analyserRef.current) {
        // Static idle bars
        for (let i = 0; i < BAR_COUNT; i++) {
          const barH = 2
          const x = (i / BAR_COUNT) * w
          const barW = (w / BAR_COUNT) * 0.6
          c.fillStyle = 'rgba(255, 255, 255, 0.15)'
          c.fillRect(x, h / 2 - barH / 2, barW, barH)
        }
        return
      }

      const data = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(data)

      for (let i = 0; i < BAR_COUNT; i++) {
        const dataIndex = Math.floor((i / BAR_COUNT) * data.length)
        const val = data[dataIndex] / 255
        const barH = Math.max(2, val * h * 0.9)
        const x = (i / BAR_COUNT) * w
        const barW = (w / BAR_COUNT) * 0.6

        // Gradient color based on intensity
        const alpha = 0.3 + val * 0.7
        const hue = 210 + val * 30
        c.fillStyle = playing
          ? `hsla(${hue}, 40%, ${70 + val * 20}%, ${alpha})`
          : 'rgba(255, 255, 255, 0.15)'

        // Draw bar centered vertically
        c.fillRect(x, h / 2 - barH / 2, barW, barH)
      }
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing])

  // Time update
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => {
      if (!dragging) setCurrentTime(audio.currentTime)
    }
    const onDuration = () => setDuration(audio.duration)
    const onEnded = () => setPlaying(false)

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('ended', onEnded)
    }
  }, [dragging])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    initAnalyser()
    if (ctxRef.current?.state === 'suspended') {
      await ctxRef.current.resume()
    }

    if (playing) {
      audio.pause()
    } else {
      await audio.play()
    }
    setPlaying(!playing)
  }

  const seek = (e) => {
    const rect = progressRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audioRef.current.currentTime = pct * duration
    setCurrentTime(pct * duration)
  }

  const onProgressDown = (e) => {
    setDragging(true)
    seek(e)
    const onMove = (ev) => seek(ev)
    const onUp = () => {
      setDragging(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className={`mini-player ${expanded ? 'expanded' : ''} ${playing ? 'is-playing' : ''}`}>
      <audio ref={audioRef} src={TRACK.src} preload="metadata" />

      {/* Collapsed: compact bar */}
      <div className="player-bar" onClick={() => setExpanded(!expanded)}>
        {/* Visualizer canvas */}
        <canvas
          ref={canvasRef}
          className="player-visualizer"
          width={200}
          height={40}
        />

        <div className="player-info">
          <span className="player-title">{TRACK.title}</span>
          <span className="player-artist">{TRACK.artist}</span>
        </div>

        <button
          className="player-play-btn"
          onClick={(e) => { e.stopPropagation(); togglePlay() }}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Expanded: progress + time */}
      {expanded && (
        <div className="player-expanded">
          <div className="player-album">{TRACK.album}</div>
          <div
            className="player-progress"
            ref={progressRef}
            onMouseDown={onProgressDown}
          >
            <div className="player-progress-bg" />
            <div className="player-progress-fill" style={{ width: `${progress}%` }} />
            <div className="player-progress-thumb" style={{ left: `${progress}%` }} />
          </div>
          <div className="player-times">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
