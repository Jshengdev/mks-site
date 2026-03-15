// WorldContext — Music-driven world state
// MiniPlayer is the router. Track selection drives world transitions.
// No URL routing — the emotional journey is sequential, driven by music.
import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { ENV_ORDER, ENVIRONMENTS } from './environments/index.js'

const WorldContext = createContext(null)

export function WorldProvider({ children }) {
  const [currentWorld, setCurrentWorld] = useState('golden-meadow')
  const [entryComplete, setEntryComplete] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const audioCtxRef = useRef(null)

  // Ensure AudioContext exists (created once on entry confirmation)
  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  const completeEntry = useCallback(() => {
    ensureAudioContext()
    setEntryComplete(true)
  }, [ensureAudioContext])

  // Navigate to a world by ID — called by MiniPlayer when track changes
  const navigateToWorld = useCallback((worldId) => {
    if (worldId === currentWorld || transitioning) return
    if (!ENVIRONMENTS[worldId]) return
    setTransitioning(true)
    setCurrentWorld(worldId)
    // Transition flag cleared by EnvironmentScene after engine swap
    setTimeout(() => setTransitioning(false), 1600) // slightly longer than 1.5s transition
  }, [currentWorld, transitioning])

  // Get next/prev world in sequence
  const nextWorld = useCallback(() => {
    const idx = ENV_ORDER.indexOf(currentWorld)
    if (idx < ENV_ORDER.length - 1) {
      navigateToWorld(ENV_ORDER[idx + 1])
    }
  }, [currentWorld, navigateToWorld])

  const prevWorld = useCallback(() => {
    const idx = ENV_ORDER.indexOf(currentWorld)
    if (idx > 0) {
      navigateToWorld(ENV_ORDER[idx - 1])
    }
  }, [currentWorld, navigateToWorld])

  const value = {
    currentWorld,
    entryComplete,
    transitioning,
    navigateToWorld,
    completeEntry,
    nextWorld,
    prevWorld,
    audioCtx: audioCtxRef,
    ensureAudioContext,
  }

  return (
    <WorldContext.Provider value={value}>
      {children}
    </WorldContext.Provider>
  )
}

export function useWorld() {
  const ctx = useContext(WorldContext)
  if (!ctx) throw new Error('useWorld must be used within WorldProvider')
  return ctx
}

export default WorldContext
