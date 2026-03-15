// useWorldTransition — React hook for GLSL transitions between environment worlds
// Manages the transition lifecycle: captures from FBO, starts target, blends, completes
import { useRef, useCallback, useState } from 'react'
import TransitionRenderer from './meadow/TransitionRenderer.js'

export default function useWorldTransition() {
  const transitionRef = useRef(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Initialize transition renderer (lazy — created on first use)
  const getTransition = useCallback((renderer) => {
    if (!transitionRef.current && renderer) {
      transitionRef.current = new TransitionRenderer(renderer)
    }
    return transitionRef.current
  }, [])

  // Start transition between environments
  const startTransition = useCallback((fromId, toId, fromEngine, toEngine, onComplete) => {
    if (!fromEngine?.renderer) return

    const transition = getTransition(fromEngine.renderer)
    if (!transition) return

    setIsTransitioning(true)
    transition.start(fromId, toId, fromEngine, toEngine, () => {
      setIsTransitioning(false)
      onComplete?.()
    })
  }, [getTransition])

  // Cleanup
  const dispose = useCallback(() => {
    transitionRef.current?.dispose()
    transitionRef.current = null
  }, [])

  return {
    isTransitioning,
    startTransition,
    transitionRef,
    dispose,
  }
}
