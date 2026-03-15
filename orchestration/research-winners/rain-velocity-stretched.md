# Winner: Rain Velocity-Stretched Billboards

> Experiment: exp-009-rain-v2 | Score: 39/70 | FPS: 121 @ 1080p
> Source: three.quarks extraction (velocity-stretched billboard technique)
> Target: Storm Field — "The Search"

## What It Does

2000 velocity-stretched rain streaks falling fast downward with wind push.
Each raindrop is a PlaneGeometry quad that gets stretched along its velocity direction
and narrowed perpendicular to it using the cross-product billboard technique.

## Magic Values Table

### Rain Vertex Shader (Stretch Formula)
| Value | Purpose |
|-------|---------|
| `dropWidth = 0.04` | Base width of rain streak (world units) |
| `lengthFactor = 30.0` | Stretch multiplier (dropWidth * lengthFactor = streak length) |
| `cross(mvPosition.xyz, velDir)` | Perpendicular direction via cross product |
| `position.y * perpendicular * dropWidth` | Width expansion |
| `(position.x + 0.5) * velDir * streakLength` | Length stretch along velocity |

### Rain Physics
| Value | Purpose |
|-------|---------|
| `rainSpeed = 15.0` | Base downward velocity (world units/sec) |
| `windX = 3.0, windZ = 1.0` | Horizontal wind push |
| `random variation: ±1.0 X, ±5.0 Y, ±0.5 Z` | Natural variation |
| `rainSpread = 50` | Horizontal spawn area (100x100 unit square) |
| `rainMaxHeight = 25` | Spawn ceiling |
| Recycle below ground → respawn near camera at top | Infinite rain loop |

### Rain Fragment Shader
| Value | Purpose |
|-------|---------|
| `rainColor = (0.65, 0.7, 0.8)` | Near-white with cool blue tint |
| `smoothstep(0.0, 0.3, height) * smoothstep(1.0, 0.7, height)` | Tail fade (both ends) |
| `alpha = brightness * fade * 0.6` | Semi-transparent |
| Additive blending, no depth write | Rain glows against dark |

### Storm Atmosphere (from exp-005)
| Value | Purpose |
|-------|---------|
| `skyTurbidity: 10.0` | Heavy haze |
| `skyRayleigh: 0.3` | Minimal blue |
| `fogDensity: 0.025` | Tight fog (30 unit visibility) |
| `toneMapping: Cineon @ 0.5` | Dark compression |
| `grassBendStrength: 0.7` | Storm wind |

## Integration Instructions for MeadowEngine

### Step 1: Create RainSystem Subsystem

```
src/meadow/RainSystem.js — InstancedMesh with velocity-stretched quad shader
```

**Key architecture:**
- InstancedMesh with PlaneGeometry(1,1) base
- Per-instance attributes: `offset` (vec3), `velocity` (vec3), `brightness` (float)
- CPU-side animation loop recycling drops that fall below ground
- `InstancedBufferAttribute.needsUpdate = true` each frame

### Step 2: Fix Blending for Dark Backgrounds

In the pipeline experiment, rain is invisible against dark ground (additive blending + dark = invisible).
For MeadowEngine integration, use **alpha blending** instead:

```javascript
blending: THREE.NormalBlending,  // NOT AdditiveBlending
```

And make the rain color slightly brighter: `vec3(0.75, 0.8, 0.85)`.

### Step 3: Camera-Relative Spawning

Respawn raindrops relative to camera position so rain follows the viewer:
```javascript
if (position.y < ground) {
  position.x = camera.position.x + (random - 0.5) * spread
  position.z = camera.position.z + (random - 0.5) * spread
  position.y = camera.position.y + maxHeight + random * 5
}
```

### Step 4: AtmosphereController Integration

Storm Field keyframe should set:
- `rainEnabled: true, rainCount: 2000`
- `windX: 3.0, windZ: 1.0` (drives both rain and grass bend)
- `grassBendStrength: 0.7` (storm wind)
- `fogDensity: 0.025` (tight claustrophobic fog)

### Step 5: Lightning Flash (Future Enhancement)

Add occasional white flash via:
```javascript
// In _tick():
if (Math.random() < 0.001) {
  ambientLight.intensity = 2.0  // brief flash
  setTimeout(() => ambientLight.intensity = 0.2, 50)  // reset after 50ms
}
```

## Performance Profile

| Metric | Value |
|--------|-------|
| FPS @ 1080p | 121 (2000 drops, extremely fast) |
| Draw calls | +1 |
| CPU cost | O(n) per frame for position updates |
| GPU cost | Minimal (simple vertex stretch, no textures) |
| Memory | ~40KB (2000 * (3+3+1) * 4 bytes) |

## Visual Quality Notes

- Rain streaks are properly elongated and diagonal (wind-pushed)
- Velocity-stretch technique from three.quarks works correctly
- Rain is visible against light sky but invisible against dark ground (additive blending)
- For Storm Field emotional quality, needs MUCH darker/greyer sky (not sunset)
- Consider adding rain splash particles at ground level
- The atmosphere from exp-005 (storm preset) is closer to correct — use that instead
