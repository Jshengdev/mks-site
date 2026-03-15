---
name: Entry Page Aesthetic — Dithered Botanical Flower
description: User's reference for the entry/landing page before WebGL — dithered procedural flower with cursor parallax, 4-tone palette, botanical specimen feel, annotation system
type: project
---

## Entry Page Reference (2026-03-14)

User shared a complete HTML/Canvas 2D implementation of a Hibiscus syriacus botanical specimen with:

### Techniques to Steal
- **Bezier curve petals** — 5 petals with radial gradient (near-black center → cream edge)
- **Double-layer dithering** — Void-and-Cluster 16x16 + Bayer 4x4, blended. Creates risograph/print texture.
- **4-tone palette:** `#ededea, #a8a8a4, #545250, #111110` — monochrome restraint
- **Half-res render** — pixelated quality, like a printed page
- **6-layer cursor parallax** — stem (38px), back petals (42px), front petals (52px), center (18px), stamen (44px)
- **Breathing animation** — petal scale oscillation, flutter, skew
- **SVG annotation system** — leader lines, flicker reveal, draggable endpoints, cycling text pools
- **Poetic/scientific text mixing** — "Anther & filament" alongside "my grandpa used to raise these"

### How to Apply for MKS
- Entry page uses Canvas 2D / p5.js — zero Three.js weight, instant load
- Flower is procedurally generated (different Bezier curves each visit via seeded PRNG)
- As cursor approaches "Enter" button, petals open wider (convergence = "two hands meeting")
- Annotations show brief MKS bio text + poetic quotes about the music
- Clicking Enter: confirms audio context, flower dissolves (dither pattern expands), WebGL meadow fades in
- Music ("In a Field of Silence" from Heavy Moon) starts on Enter

### Song Reference
- **"In a Field of Silence"** by Michael Kim-Sheng (album: Heavy Moon)
- Duration: 4:37, 320kbps, 44.1kHz stereo
- File: `src/assets/audio/In a Field of Silence.mp3`
- This is the Golden Meadow's composition
- Atmosphere keyframes should eventually be scored to this track's structure

### Music-as-Router Confirmed
- MiniPlayer IS the navigation system
- Selecting a different track = entering a different world (portal transition)
- URL updates to reflect current world, but experience is music-driven
- Each world has a "home" composition
