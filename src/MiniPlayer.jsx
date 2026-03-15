// MiniPlayer — THE ROUTER
// Music drives world transitions. Selecting a track navigates to its world.
// Track list is the navigation. Play/pause/seek is the interaction.
import { useState, useRef, useEffect, useCallback } from 'react'
import { useWorld } from './WorldContext.jsx'
import { TRACK_LIST, ENVIRONMENTS } from './environments/index.js'
import './MiniPlayer.css'

const BAR_COUNT = 48

export default function MiniPlayer() {
  const { currentWorld, navigateToWorld, entryComplete } = useWorld()
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
  const [showTrackList, setShowTrackList] = useState(false)

  // Current track from the active world
  const currentTrack = ENVIRONMENTS[currentWorld]?.audio?.track
  const currentIdx = TRACK_LIST.findIndex(t => t.worldId === currentWorld)
  const hasAutoPlayed = useRef(false)

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

  // Auto-play on first mount (user just clicked Enter — gesture allows autoplay)
  useEffect(() => {
    if (hasAutoPlayed.current) return
    const audio = audioRef.current
    if (!audio || !currentTrack?.src) return
    hasAutoPlayed.current = true

    audio.src = currentTrack.src
    audio.load()

    // Small delay for engine to initialize, then start playback
    const timer = setTimeout(async () => {
      initAnalyser()
      if (ctxRef.current?.state === 'suspended') {
        await ctxRef.current.resume()
      }
      await audio.play().catch(() => {})
      setPlaying(true)
    }, 500)

    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack])

  // When world changes, update the audio source
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    const wasPlaying = playing
    if (currentTrack.src) {
      audio.src = currentTrack.src
      audio.load()
      if (wasPlaying) {
        audio.play().catch(() => {})
      }
    }
    setCurrentTime(0)
    setDuration(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorld])

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
        const alpha = 0.3 + val * 0.7
        const hue = 210 + val * 30
        c.fillStyle = playing
          ? `hsla(${hue}, 40%, ${70 + val * 20}%, ${alpha})`
          : 'rgba(255, 255, 255, 0.15)'
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

    const onTime = () => { if (!dragging) setCurrentTime(audio.currentTime) }
    const onDuration = () => setDuration(audio.duration)
    const onEnded = () => {
      setPlaying(false)
      // Auto-advance to next world when track ends
      if (currentIdx < TRACK_LIST.length - 1) {
        navigateToWorld(TRACK_LIST[currentIdx + 1].worldId)
        // Will auto-play via the useEffect above
        setTimeout(() => {
          if (audioRef.current?.src) {
            audioRef.current.play().catch(() => {})
            setPlaying(true)
          }
        }, 200)
      }
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('ended', onEnded)
    }
  }, [dragging, currentIdx, navigateToWorld])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio || !currentTrack?.src) return

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

  const selectTrack = (worldId) => {
    navigateToWorld(worldId)
    setShowTrackList(false)
    // Auto-play the new track after a brief delay for engine swap
    setTimeout(async () => {
      const audio = audioRef.current
      if (!audio) return
      initAnalyser()
      if (ctxRef.current?.state === 'suspended') {
        await ctxRef.current.resume()
      }
      if (audio.src) {
        await audio.play().catch(() => {})
        setPlaying(true)
      }
    }, 300)
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

  // Don't render until entry page is complete
  if (!entryComplete) return null

  return (
    <div className={`mini-player ${expanded ? 'expanded' : ''} ${playing ? 'is-playing' : ''}`}>
      <audio ref={audioRef} preload="metadata" />

      {/* Collapsed: compact bar */}
      <div className="player-bar" onClick={() => setExpanded(!expanded)}>
        <canvas
          ref={canvasRef}
          className="player-visualizer"
          width={200}
          height={40}
        />

        <div className="player-info">
          <span className="player-title">{currentTrack?.title || 'No Track'}</span>
          <span className="player-artist">{currentTrack?.artist || ''}</span>
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

      {/* Expanded: progress + track list toggle */}
      {expanded && (
        <div className="player-expanded">
          <div className="player-album-row">
            <span className="player-album">{currentTrack?.album || ''}</span>
            <button
              className="player-tracklist-btn"
              onClick={(e) => { e.stopPropagation(); setShowTrackList(!showTrackList) }}
              aria-label="Track list"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                <path d="M4 6h16M4 12h16M4 18h12" />
              </svg>
            </button>
          </div>
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

          {/* Track list — the navigation */}
          {showTrackList && (
            <div className="player-tracklist">
              {TRACK_LIST.map((track, i) => (
                <button
                  key={track.worldId}
                  className={`player-tracklist-item ${track.worldId === currentWorld ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); selectTrack(track.worldId) }}
                  style={{ '--track-color': track.dominantColor }}
                >
                  <span className="tracklist-num">{i + 1}</span>
                  <span className="tracklist-title">{track.title}</span>
                  <span className="tracklist-emotion">{track.emotion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
