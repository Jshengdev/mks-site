# Atmospheric Scroll Arc — Design Spec

> **V1 of the visual vision:** One meadow world done well, with scroll-driven atmospheric transformation, music trigger, and portal hints for future worlds.

## Goal

Transform the existing static meadow into a living emotional journey where scrolling changes how the world FEELS — through wind, light, fog, and color — not by teleporting between environments. Each scroll zone has a distinct atmospheric mood. A music snippet triggers at the emotional peak. Shimmering portals hint at future worlds.

## Architecture

The meadow's visual parameters are already individually tuneable (proven via DevTuner). This spec adds a **scroll-driven interpolation layer** (`AtmosphereController`) that lerps all atmospheric params between keyframed states based on `scrollEngine.progress`.

**No new rendering systems.** Every visual change uses existing subsystem uniforms/properties. The new code is purely a data-driven interpolation controller.

## Non-Goals

- Multiple distinct environments (forest, ocean, snow field)
- Hub-and-spoke navigation
- Full 7-world experience
- 3D asset integration (albums as objects)
- Audio-reactive coupling (future phase)

---

## The Emotional Arc

The meadow doesn't change WHAT it is. It changes how it FEELS. Scroll progress drives atmospheric zones:

| Zone | Scroll Range | Mood | What Changes |
|------|-------------|------|--------------|
| **Stillness** | 0.0 – 0.15 | Sacred anticipation. Cold, misty, hushed. The world forming. | Heavy fog, muted colors, low wind, no fireflies, dim light |
| **Awakening** | 0.15 – 0.35 | Light arrives. Gentle. Hopeful. Eyes adjusting. | Fog lifts, grass greens, soft wind starts, first warmth in sky |
| **Alive** | 0.35 – 0.60 | The meadow at its fullest. Warm, breathing, golden. | Golden hour light, full wind, flowers vivid, fireflies emerging, bloom up |
| **Deepening** | 0.60 – 0.80 | Richer. More saturated. Almost overwhelming beauty. | Deeper colors, stronger god rays, amber fog, max fireflies |
| **Quieting** | 0.80 – 1.0 | Settling. Not cold again — resolved. Peaceful. | Light softens, wind calms, colors mellow, gentle desaturation |

**Key principle:** These zones are NOT time-of-day. They are emotional temperatures. The sun doesn't "set" — the world's emotional intensity rises and falls like a piece of music.

---

## AtmosphereController — The New System

### Location
`src/meadow/AtmosphereController.js`

### Responsibilities
1. Define keyframes (atmospheric states at scroll t-values)
2. Interpolate between adjacent keyframes based on current scroll progress
3. Push interpolated values to existing subsystem uniforms every frame

### Keyframe Schema

Each keyframe is a plain object with EVERY atmospheric parameter:

```js
{
  t: 0.0, // scroll progress where this state is fully active

  // Sky (Preetham)
  sunElevation: 5,        // degrees
  sunAzimuth: 240,        // degrees
  turbidity: 14,
  rayleigh: 2.0,
  mieCoefficient: 0.01,
  mieDirectionalG: 0.95,

  // Scene fog
  fogColor: [0.3, 0.3, 0.4],
  fogDensity: 0.008,

  // Sunlight
  sunLightColor: [0.7, 0.7, 0.8],
  sunLightIntensity: 0.5,
  ambientIntensity: 0.08,

  // Grass shader uniforms
  grassBaseColor: [0.03, 0.12, 0.02],
  grassTipColor: [0.12, 0.30, 0.08],
  grassWindSpeed: 0.5,
  grassAmbientStrength: 0.25,
  grassTranslucency: 1.0,
  grassFogFade: 0.003,

  // Cloud shadows
  cloudShadowOpacity: 0.05,
  cloudDriftSpeed: 0.00003,

  // Fireflies
  fireflyBrightness: 0.0,  // 0 = invisible
  fireflySize: 40,

  // Post-processing
  bloomIntensity: 0.3,
  bloomThreshold: 0.8,
  fogDepthStrength: 0.03,
  fogMidColor: [0.6, 0.6, 0.7],
  fogFarColor: [0.4, 0.4, 0.5],
  colorGradeContrast: 0.18,
  colorGradeVibrance: 1.2,
  colorGradeWarmth: 0.08,  // splitIntensity
  vignetteDarkness: 0.6,
  grainOpacity: 0.04,
}
```

### Interpolation

```js
// Pseudocode — actual implementation handles vec3s, colors, etc.
update(scrollProgress) {
  const [prev, next] = findBracketingKeyframes(scrollProgress)
  const localT = (scrollProgress - prev.t) / (next.t - prev.t)
  const eased = smoothstep(localT) // smooth transitions, not linear

  for (const key of paramKeys) {
    this.current[key] = lerp(prev[key], next[key], eased)
  }

  this.pushToSubsystems()
}
```

### pushToSubsystems()

Maps interpolated values to existing subsystem references:

```js
// Sky
sky.material.uniforms.turbidity.value = this.current.turbidity
sky.material.uniforms.rayleigh.value = this.current.rayleigh
// ... etc

// Grass (iterate all chunk materials)
for (const [, chunk] of grassManager.chunks) {
  chunk.material.uniforms.uBaseColor.value.setRGB(...this.current.grassBaseColor)
  chunk.material.uniforms.uTipColor.value.setRGB(...this.current.grassTipColor)
  chunk.material.uniforms.uSpeed.value = this.current.grassWindSpeed
  // ... etc
}

// Post-processing
postProcessing.bloom.intensity = this.current.bloomIntensity
postProcessing.vignette.darkness = this.current.vignetteDarkness
// ... etc
```

### Integration into MeadowEngine

```js
// In constructor:
this.atmosphere = new AtmosphereController(
  this.sceneSetup,
  this.grassManager,
  this.fireflies,
  this.cloudShadows,
  this.postProcessing
)

// In _tick():
this.atmosphere.update(this.scrollEngine.progress)
```

---

## Five Keyframe States

### Keyframe 1: Stillness (t = 0.0)
**Mood:** Sacred anticipation. The held breath before the first note.

| Parameter | Value | Why |
|-----------|-------|-----|
| Sun elevation | 2° | Barely above horizon — pre-dawn glow |
| Fog density | 0.012 | Heavy — world obscured, forming |
| Fog color | (0.25, 0.25, 0.35) | Cool blue-grey mist |
| Grass base | (0.02, 0.08, 0.02) | Near-black green — barely visible |
| Grass tip | (0.08, 0.18, 0.06) | Dark olive |
| Wind speed | 0.3 | Almost still |
| Firefly brightness | 0.0 | None |
| Bloom intensity | 0.2 | Subtle glow in the mist |
| Vignette | 0.7 | Heavy — tunnel vision, focus |
| Vibrance | 0.8 | Desaturated — the "perpetual grey" |

### Keyframe 2: Awakening (t = 0.25)
**Mood:** Light arriving. Hope without certainty. Eyes adjusting.

| Parameter | Value | Why |
|-----------|-------|-----|
| Sun elevation | 8° | Rising — early morning |
| Fog density | 0.005 | Lifting — world revealing |
| Fog color | (0.55, 0.50, 0.45) | Warming — grey becoming amber |
| Grass base | (0.04, 0.15, 0.02) | Green emerging |
| Grass tip | (0.18, 0.40, 0.08) | Spring green tips |
| Wind speed | 1.0 | Gentle breeze |
| Firefly brightness | 0.0 | Not yet |
| Bloom intensity | 0.4 | Light catching mist |
| Vignette | 0.55 | Easing — wider view |
| Vibrance | 1.2 | Color returning |

### Keyframe 3: Alive (t = 0.50)
**Mood:** The meadow at peak beauty. Golden hour. Everything breathing.

| Parameter | Value | Why |
|-----------|-------|-----|
| Sun elevation | 12° | Classic golden hour |
| Fog density | 0.003 | Light golden haze |
| Fog color | (0.85, 0.78, 0.55) | Warm golden |
| Grass base | (0.05, 0.18, 0.02) | Current BotW green |
| Grass tip | (0.22, 0.50, 0.10) | Current vivid tip |
| Wind speed | 1.5 | Full breeze — meadow alive |
| Firefly brightness | 0.5 | Starting to appear |
| Bloom intensity | 0.6 | Current — warm glow |
| Vignette | 0.4 | Open — expansive |
| Vibrance | 1.6 | Full color — current value |

### Keyframe 4: Deepening (t = 0.75)
**Mood:** Peak emotional intensity. Almost overwhelming beauty. The amber moment.

| Parameter | Value | Why |
|-----------|-------|-----|
| Sun elevation | 6° | Lower — amber light intensifies |
| Fog density | 0.004 | Amber haze thickening |
| Fog color | (0.92, 0.72, 0.40) | Deep amber |
| Grass base | (0.08, 0.15, 0.02) | Warmer base |
| Grass tip | (0.35, 0.50, 0.12) | Gold-tipped |
| Wind speed | 2.0 | Stronger — dramatic |
| Firefly brightness | 1.0 | Maximum — the meadow glowing |
| Bloom intensity | 0.85 | Strong — dreamy bloom |
| Vignette | 0.35 | Less vignette — overwhelming openness |
| Vibrance | 1.8 | Hyper-saturated peak |

### Keyframe 5: Quieting (t = 1.0)
**Mood:** Resolution. Not cold again — resolved. The relief after the last note.

| Parameter | Value | Why |
|-----------|-------|-----|
| Sun elevation | 10° | Settled — not setting, just calm |
| Fog density | 0.004 | Gentle haze |
| Fog color | (0.65, 0.62, 0.58) | Neutral warm |
| Grass base | (0.04, 0.16, 0.03) | Slightly softer green |
| Grass tip | (0.20, 0.45, 0.12) | Mellow |
| Wind speed | 0.8 | Calming |
| Firefly brightness | 0.3 | Dimming — not gone |
| Bloom intensity | 0.4 | Gentle |
| Vignette | 0.5 | Closing slightly — intimate |
| Vibrance | 1.3 | Settling |

---

## Music Trigger

### Location
`src/meadow/MusicTrigger.js`

### Behavior
- At a specific scroll threshold (configurable, default `t = 0.35` — the awakening-to-alive transition), a music snippet begins playing
- Uses Web Audio API (already in the project via `useScrollAudio.js`)
- Fade-in over ~2 seconds, not abrupt
- Respects user interaction requirement (audio context requires user gesture — the scroll itself counts)
- Only plays ONCE per session (flag prevents re-trigger on scroll back)
- A subtle visual pulse (brief bloom spike + vignette ease) accompanies the audio start — the BotW "discovery" moment

### Integration
- MeadowEngine passes scroll progress to MusicTrigger each frame
- MusicTrigger checks threshold, triggers audio + visual pulse
- The audio file is a short snippet (30-60s) of an MKS track, provided by the artist

---

## Portal Hints

### Location
`src/meadow/PortalHint.js`

### What They Are
Shimmering, glowing spots in the meadow — visible from the camera path — that suggest other worlds exist. NOT literal doorways. More like heat mirages, aurora-like vertical light, or firefly congregations that form a shape.

### Behavior
- 2-3 portals placed along the spline at specific world positions
- Each is a small particle system or billboard shader effect
- Subtle — you notice them if you're looking, but they don't demand attention
- On click/tap: navigate to a "coming soon" page (or a modal with a music preview + "this world is being composed")
- Each portal has a faint color identity hinting at the world it leads to

### Implementation
- Billboard quad with a custom shimmer shader (noise-driven opacity + color)
- Raycaster on click to detect portal intersection
- Simple HTML overlay for the "coming soon" content

---

## DevTuner Integration

The AtmosphereController's keyframe values should be editable via DevTuner:
- Add a "Scroll Zone" dropdown to select which keyframe to edit
- All parameter sliders update the selected keyframe in real-time
- "Export" button exports the full keyframe set as JSON
- This lets you visually tune each atmospheric state by scrolling to that zone, tweaking, and seeing results immediately

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/meadow/AtmosphereController.js` | CREATE | Keyframe interpolation, subsystem push |
| `src/meadow/MusicTrigger.js` | CREATE | Audio trigger at scroll threshold |
| `src/meadow/PortalHint.js` | CREATE | Shimmering portal particle/shader |
| `src/meadow/ScoreSheetCloth.js` | CREATE | Wind-driven score sheet cloth flying through scene |
| `src/meadow/ArtistFigure.js` | CREATE | 2D cutout of MKS projected in 3D space |
| `src/meadow/MeadowEngine.js` | MODIFY | Wire all new systems |
| `src/DevTuner.jsx` | MODIFY | Add keyframe zone selector |
| `src/content/content-overlay.css` | MODIFY | Typography upgrade |

---

## Score Sheet Cloth

### What It Is
A piece of cloth/fabric textured with handwritten score sheet imagery, flying through the meadow scene. The "music escaping the page" — the craft liberated into the world. Matches STYLE-DECISIONS.md: "The score flying through the sky. The music unbound from the page."

### Implementation
- Billboard plane or simple cloth simulation mesh (from `three-simplecloth` extraction)
- UV-mapped with a score sheet texture (photograph of real handwritten score)
- Gentle wind-driven animation — tumbling, drifting through the air
- Catches light from the sun (lit by scene directional light)
- Appears in the Awakening or Alive zones — the music becoming visible
- Multiple sheets possible, at different distances for parallax depth

### Location
`src/meadow/ScoreSheetCloth.js`

---

## Michael Kim Sheng Figure

### What It Is
A 2D photographic cutout of Michael standing in the meadow — projected as a billboard in 3D space. He's at the far end of the field, looking up, feeling the music. The persona from NARRATIVE-STRUCTURE.md: "the figure in the landscape."

### Implementation
- A single `PlaneGeometry` with the photo texture (alpha-masked cutout)
- Positioned at the end of the camera spline path, facing the camera
- Receives scene lighting effects (directional light tint, fog, bloom)
- Scale appropriate to look like a person standing in the field at distance
- NOT a 3D model — a 2D photo projected into the 3D world
- The figure is visible from the Deepening zone onward — you see him in the distance, you scroll toward him

### Location
`src/meadow/ArtistFigure.js`

---

## Typography

The DOM content overlays (Landing, Music, About, Store, Tour) need elevated typography that matches the "expensive gallery" feel from VISUAL-LANGUAGE.md:

- **Artist name:** Serif, cinematic reveal. Thin, wide letter-spacing. Appears slowly during Stillness zone.
- **Section titles:** Serif, quiet authority. Not loud — everything else has stepped back.
- **Body text:** Sans-serif, warm, readable. Human voice.
- **Two type voices:** Serif speaks for the artist/work. Sans-serif speaks for the site/information.

### Font Candidates (to be selected — Type B decision for user)
- Display/titles: A distinctive serif (Playfair Display, Cormorant Garrard, or similar classical-but-modern)
- Body: A refined sans-serif (DM Sans already in use, or upgrade)

Typography implementation is CSS + content overlay work — no Three.js involvement.

---

## What This Enables

Once V1 ships with the atmospheric arc:
- **You experience the emotional journey** by scrolling — cold/still → warm/alive → deep/amber → resolved
- **The music trigger** creates the BotW discovery moment at the emotional peak
- **The portals** tease future content and create the "unfinished pull" (from the Emotional Map doc — the feeling of something you'll come back for)
- **DevTuner keyframe editing** lets you visually tune each mood zone by scrolling there and adjusting
- **The vision for other worlds crystallizes** from interacting with this atmospheric system
