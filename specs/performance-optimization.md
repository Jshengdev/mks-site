# Performance Optimization

## What This Is
Progressive loading, tier scaling, and FX budget management for the unified scroll experience.

## Why This Matters
Current bundle is 1.36MB with no code splitting. The unified experience will be longer and denser than any single world. Without budget management, low-tier devices will fail and high-tier devices will accumulate subsystem overhead.

## Acceptance Criteria
- [ ] AC1: FX budget system tracks GPU cost per active subsystem and throttles when frame time exceeds 16ms (60fps target)
- [ ] AC2: Progressive loading: subsystems near the camera's scroll position are loaded first, distant ones queued
- [ ] AC3: Tier 2 (laptop) maintains ≥30fps with ≥3 active subsystems
- [ ] AC4: Tier 3 (mobile) gets a meaningful CSS/static fallback (not just a hidden canvas)
- [ ] AC5: Post-processing effects have per-effect enable/disable flags (currently hardcoded in PostProcessingStack constructor)
- [ ] AC6: Kuwahara effect is disabled or reduced kernel on Tier 2 (currently full cost even on reduced tier)
- [ ] AC7: Effects with zero-strength uniforms have early-out in fragment shader (grain at 0, CA at 0 currently still process every pixel)

## Specification
### FX Budget System
Each subsystem declares its estimated GPU cost (light/medium/heavy). SubsystemRegistry tracks total cost of active subsystems. When frame time exceeds 16ms:
1. Reduce quality of heavy effects (bloom kernel size, SSAO samples)
2. Skip optional effects (motion blur, CA velocity boost)
3. Reduce particle counts by 50%
4. Log performance warnings to console

### Progressive Loading
Based on scroll position + velocity, predict which segment is next. Pre-load subsystem classes 1 segment ahead. This pairs with bundle-splitting (dynamic imports).

### Tier Scaling
- Tier 1: Full quality, all effects, 60fps target
- Tier 2: Reduced SSAO (9 samples), no DOF, small bloom kernel, no Kuwahara, particle counts halved
- Tier 3: Static screenshot with CSS scroll-snap sections, no WebGL

### Early-Out Optimization
Add to fragment shaders: `if (uStrength < 0.001) { /* early return unchanged color */ }` for: FilmGrainEffect, RadialCAEffect, KuwaharaEffect, HeatDistortionEffect.

## Ralphable vs Human-Taste
- AC1-2, AC5-7: **Ralphable** (budget tracking, progressive loading, shader optimization)
- AC3-4: **Partially Ralphable** (tier thresholds are measurable, but fallback design needs taste)

## Dependencies
- bundle-splitting (code splitting enables progressive loading)
- composable-subsystems (registry enables budget tracking)
- dispose-lifecycle (clean deactivation for budget management)

## Verification
- AC1: Console logs GPU budget when frame time > 16ms
- AC2: Network tab shows subsystem chunks loading ahead of scroll position
- AC3: Chrome DevTools FPS meter stays ≥30 on Tier 2 simulation (throttle CPU 4x)
- AC4: Tier 3 renders meaningful static content (not blank screen)
- AC5: PostProcessingStack has setEffectEnabled(name, bool) method
- AC6: Kuwahara kernel reduced or disabled on tier 'reduced'
- AC7: grep for "early-out" or strength check in all 4 effect shaders
