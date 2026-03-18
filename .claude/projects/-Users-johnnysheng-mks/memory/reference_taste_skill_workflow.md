---
name: Taste Skill + Video-to-Scroll Workflow
description: Leon's taste-skill for high-end web design + the 3-step workflow for scroll-driven animated sites using AI-generated video frames
type: reference
---

## The Workflow (from video transcript 2026-03-18)

### 3-Step Flow
1. **Bullet points → Claude Code** with taste-skill installed (high-end design principles)
2. **Generate exploded/animated video** using Cling 3.0 via Higsfield ($3-4 per video)
3. **Extract frames → scroll animation** — ffmpeg extracts ~120 JPEG frames, tied to scroll position

### Taste Skill (github.com/Leonxlnx/taste-skill)
- Installed at `~/.claude/skills/taste-skill/SKILL.md`
- 3 dials: DESIGN_VARIANCE (8), MOTION_INTENSITY (6), VISUAL_DENSITY (4)
- Anti-AI-slop rules: no purple glows, no Inter font, no 3-column card layouts, no centered heroes
- Premium patterns: magnetic buttons, liquid glass, spring physics, staggered reveals
- Performance guardrails: hardware-accelerated transforms only, no scroll listeners

### Key Techniques from Video
- Hero header with AI video background + inward masking gradient
- Scroll-driven frame-by-frame animation (like our atmosphere keyframes but with video frames)
- Frame extraction to optimized JPEGs for performance (5.3MB video → 252KB compressed)
- Text overlay with scroll reveal timing
- Deploy to Netlify (free tier)

### How to Apply to MKS
- The taste-skill principles apply to our content overlays and entry page
- The video-to-scroll technique is analogous to our scroll→atmosphere keyframe system
- The "exploding view" concept maps to world transitions (dissolve, reveal)
- Anti-slop rules should be baked into all UI components (WorldNav, MiniPlayer, content sections)
- DESIGN_VARIANCE=8 matches our "imperfection budget" principle
