---
name: Video-to-Website Skill Reference
description: User shared a tutorial on building scroll-driven animated product landing pages using Claude Code skills — wants to study and adapt the technique
type: reference
---

## Video-to-Website Skill (from tutorial transcript, 2026-03-14)

### What It Does
- Takes a video (product spinning, X-ray reveal, etc.)
- Extracts ~120 frames using ffmpeg
- Each frame mapped to a scroll position (scroll-driven animation)
- Generates a full landing page with professional copy, animations, dark mode
- Results in scroll-animated product pages (like Apple product pages)

### The Pipeline
1. **Video input** → ffmpeg extracts all frames as .webp images
2. **Skill reads frames** → understands the visual narrative (reveal, transform, etc.)
3. **Plan mode first** → asks clarifying questions (brand name, sections, layout)
4. **Generates HTML/CSS/JS** → scroll-driven frame animation + text reveals + stats
5. **Local testing** → localhost preview
6. **Deploy** → GitHub push → Vercel auto-deploy

### Key Techniques
- Scroll position maps to frame index (stop-motion style)
- Dark backgrounds that blend with product imagery
- Text animations timed to scroll milestones
- Feature sections that appear/disappear with scroll
- Video generated via AI (Nano Banana for images → Cling 3.0 for video)

### The Skills Used
1. **Frontend Design Skill** — modified Anthropic official skill for animated websites
2. **Video-to-Website Skill** — custom markdown file defining best practices for scroll-driven animated 3D sites

### Why User Wants This
- Could adapt for MKS site (scroll-driven content already exists)
- The frame-extraction technique is similar to what we're doing with WebGL scroll
- Could create a skill that builds professional product pages for clients
- Source: free School community by video creator

### How to Apply
- Study the skill pattern: markdown file that teaches Claude Code best practices
- The scroll→frame mapping is directly relevant to our scroll→atmosphere mapping
- Could be combined with web extraction pipeline (extract → study → recreate)
- Consider building an MKS-specific skill that generates environment world pages
