# Window 1 Update 002 — ARCHITECTURAL CHANGE: Music as Router

## The Shift

Navigation is NO LONGER URL-driven. The music IS the router.

- MiniPlayer is the navigation system — selecting a track = entering that track's world
- URL updates to reflect current world, but the EXPERIENCE is music-driven
- Each world has a "home" composition
- Portal transitions fire when the track changes

### Route-to-Track Mapping
| Route | World | Track |
|-------|-------|-------|
| `/` | Golden Meadow | "In a Field of Silence" (Heavy Moon album) |
| `/listen` | Ocean Cliff | TBD |
| `/story` | Night Meadow | TBD |
| `/collect` | Ghibli Painterly | TBD |
| `/witness` | Storm Field | TBD |

### Implementation
- MiniPlayer.jsx should dispatch route changes when track changes
- WorldNav still exists as secondary navigation but clicking a nav item = starting that track
- The scroll arc maps to the structure of the current piece (atmosphere keyframes scored to music)

## Entry Page (NEW — separate from WebGL)

Before the WebGL meadow, there's an entry page:
- Canvas 2D procedural flower (dithered botanical specimen aesthetic)
- "Are you ready to enter the world of Michael Kim Sheng?"
- Cursor parallax on flower parts (6 depth layers)
- As cursor → Enter button, petals converge (open wider)
- Click Enter → audio context confirmed → music starts → dissolve into WebGL
- This page is p5.js / raw Canvas 2D — zero Three.js weight, instant load

Reference HTML saved at `src/entry/flower-reference.html`

## Audio Asset

"In a Field of Silence" MP3 copied to `src/assets/audio/In a Field of Silence.mp3`
- 4:37 duration, 320kbps, 44.1kHz stereo
- Album: Heavy Moon
- This is the Golden Meadow's composition

## Window 2 Results to Integrate

Read `orchestration/window-2-status.md` for 7 winners with integration instructions.
Priority order:
1. Night Stars + Fireflies (56/70, zero perf cost) → Night Meadow
2. Stylized Water (121 FPS, zero textures) → Ocean Cliff
3. Cel-Shading (proven) → Ghibli Painterly
4. Rain Particles (121 FPS) → Storm Field
5. Kuwahara Pipeline (expensive but essential) → Ghibli Painterly
6. Volumetric Clouds (needs optimization) → Storm Field
