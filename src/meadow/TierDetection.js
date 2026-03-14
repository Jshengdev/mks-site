// Performance tier detection
// Tier 1: Desktop (dedicated GPU) — 100K grass, all FX, 60fps
// Tier 2: Laptop (integrated GPU) — 30K grass, reduced FX, 45fps
// Tier 3: Mobile — static image fallback, no WebGL

export function detectTier(renderer) {
  const width = window.screen.width
  const cores = navigator.hardwareConcurrency || 2

  // Tier 3: Mobile or no WebGL2
  if (width <= 768 || !renderer.capabilities.isWebGL2) return 3

  // Tier 2: Integrated GPU / low-end laptop
  const maxTexSize = renderer.capabilities.maxTextureSize
  if (cores <= 4 || maxTexSize <= 4096 || width <= 1366) return 2

  // Tier 1: Desktop with dedicated GPU
  return 1
}

export const TIER_CONFIG = {
  1: { grassCount: 60000, grassChunks: 6, postFX: 'full' },
  2: { grassCount: 18000, grassChunks: 4, postFX: 'reduced' },
  3: { grassCount: 0, grassChunks: 0, postFX: 'css' },
}
