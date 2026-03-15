---
name: Immersive Experience Vision
description: User's core vision for how the site should feel — entry ritual, music-as-router, cursor-as-touch, scroll-as-timeline within each world
type: project
---

## The Vision (articulated 2026-03-14)

### Entry Ritual (3 beats)
1. **The Question** — dark screen, serif typography, invitation: "Are you ready to enter the world of Michael Kim Sheng?" Not a loading screen — a threshold.
2. **The Convergence** — p5.js procedural flowers on the entry page respond to cursor. As cursor approaches "Enter," flowers grow toward it (the "two hands meeting" metaphor). Lightweight 2D generative art — first taste of the aesthetic before WebGL.
3. **The Permission** — clicking Enter confirms audio context (browser requirement) and transitions into the 3D world. Music starts. You're in.

### Music IS the Router
- You don't navigate between worlds — the music navigates you
- Each environment corresponds to a composition
- Selecting a different track in MiniPlayer = entering a different world (with portal transition)
- MiniPlayer IS the navigation system
- Scroll moves you through space within the current world
- The scroll arc maps to the structure of the current piece

### Golden Meadow Song
- "In a Field of Silence" by Michael Kim Sheng
- Emotional arc TBD — will be mapped to atmosphere keyframes later

### Cursor as Touch
- Cursor is not a pointer — it's your hand inside the world
- You touch grass, push fog, stir fireflies
- World responds to presence, not clicks
- "Interacting with the moon and feeling and embracing the music while playing around with the visuals"

### Scroll as Timeline
- Scrolling generates movement through space
- Each world has its own scroll journey
- The composition plays while you traverse
- "Enter" world starts with intro of the song

### Environment Switching
- Each environment switches based on which music is playing
- Different starting points possible (different songs = different worlds)
- Portal transitions between worlds when music changes

**Why:** The core insight is that the music and the world are the same thing. The website isn't a portfolio with background music — it's a place you enter where the music is the physics engine.

**How to apply:** Every technical decision should serve this — atmosphere keyframes scored to music, environment configs tied to compositions, cursor interaction that feels like touch not pointing, entry experience that feels like an invitation not a loading screen.
