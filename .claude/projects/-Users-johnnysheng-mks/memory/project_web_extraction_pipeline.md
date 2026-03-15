---
name: Web Extraction AutoResearch Pipeline
description: User wants an autonomous pipeline that scrapes live WebGL/creative coding websites to extract shaders, techniques, magic values, architecture — adapted from the autoresearch pattern for creative coding research
type: project
---

## Intent (2026-03-14)

User wants to build a tool that can point at any creative coding website and extract:
- GLSL shaders (vertex + fragment, can't be minified)
- Uniform values (magic numbers, tuned per frame)
- Texture data (uploaded to GPU)
- Geometry buffers (vertex positions, normals, UVs)
- Scene graph (Three.js/R3F object hierarchy, materials, lights, cameras)
- Source maps (recover original codebase if shipped)
- Scroll→visual mapping (behavioral recording)
- Architecture patterns (React components, state management, routing)

**Why:** "If we wanted to train our model on how to do stuff based off of all these websites, where do we go?" — the goal is building a dataset of how award-winning WebGL sites work, extractable as technique → shader → magic values → integration pattern → visual result.

**How to apply:** This becomes a second autoresearch pipeline — not experimenting with techniques, but FINDING techniques by scraping live sites. The two pipelines feed each other: web extraction finds techniques → experiment pipeline validates them → Window 1 integrates winners.

### The Depth Levels (agreed with user)
1. Surface (HTML/CSS) — useless
2. Network (bundles, assets) — raw materials
3. Runtime State (live JS objects, scene graph) — architecture
4. **WebGL Interception** (shaders, textures, uniforms, draw calls) — THE GOLD
5. **Source Map Recovery** (original source code) — holy grail
6. Behavioral Recording (scroll→visual, cursor→response) — interaction design

### Technical Approach
- **Playwright** (not Chrome extension) — headless browser automation
- Inject WebGL proxy BEFORE page loads (monkey-patch getContext)
- Wrap every WebGL call to capture shaders, textures, uniforms, geometry
- Check for .map files and recover original source
- Traverse Three.js scene graph if detected
- Record scroll→screenshot at 50 positions
- Output structured extraction folder per site

### Target Sites
- Awwwards WebGL winners
- FWA featured sites
- Chrome Experiments
- Codrops demos
- Any site the user points at (iglood.com, etc.)

### Output Format Per Site
```
extractions/{site-name}/
  shaders/           — every GLSL shader pair (vert + frag)
  textures/          — every uploaded texture
  uniforms.json      — all uniform values with names
  scene-graph.json   — Three.js hierarchy if detected
  source/            — recovered source maps if available
  screenshots/       — scroll position captures (50 frames)
  scroll-map.json    — scroll position → visual state mapping
  analysis.md        — auto-generated technique summary
```
