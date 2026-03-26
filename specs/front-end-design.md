# Front-End Design — Typography as Environment

## What This Is
Spec for the DOM content layer that surfaces during scroll — typography treatment, content sections, glass-card evolution, and how text interacts with the 3D world.

## Why This Matters
Current content sections are placeholder text in glass cards. The design philosophy demands typography as "physical object" and content that surfaces at emotional peaks. The front-end must feel like part of the world, not an overlay pasted on top.

## Acceptance Criteria
- [ ] AC1: Typography system uses two voices — serif (Cormorant Garamond or similar) for titles/artist name, sans-serif (Inter or similar) for body text
- [ ] AC2: Content sections surface via opacity at scroll positions aligned with emotional peaks (not arbitrary SECTION_T_VALUES)
- [ ] AC3: Glass cards evolve — not one generic style, but per-section visual treatment (landing = minimal, music = warm, about = intimate, store = amber-lit)
- [ ] AC4: prefers-reduced-motion fallback exists for all content animations
- [ ] AC5: Text contrast meets WCAG AA against glass card backgrounds
- [ ] AC6: Content responds to 3D world state — e.g., text warms when atmosphere warms, text opacity correlates with fog density
- [ ] AC7: Artist name reveal follows the design pattern — edges glow first via text-shadow, then letter opacity rises, 3-5 second hold

## Specification
### Typography
- Artist name: serif, all-caps, letter-spacing 0.15em, clamp(2.5rem, 6vw, 5rem)
- Section titles: serif, title-case, clamp(1.5rem, 3vw, 2.5rem)
- Body text: sans-serif, #90a0a0, line-height 1.6
- Two-voice contrast creates classical (titles) + modern (body) tension

### Content-World Binding
Current ContentOverlay uses fixed SECTION_T_VALUES and WorldEngine pushes opacity. Evolve to:
1. Content sections read atmosphere state (temperature, brightness, fog density)
2. Glass card background-color shifts with atmosphere (cold sections = blue tint, warm = amber tint)
3. Text color adjusts for contrast against shifting backgrounds

### Section-Specific Treatments (Human-Taste)
- Landing: No card. Text floats. Artist name is THE visual. 5-second hold.
- Music: Warm glass card. Teal play button. Album art as depth-displaced 3D element.
- About: Intimate. Narrower width. Real photography (not AI). Off-center placement (8vw margin).
- Store: Deep amber (#1a1208). Products as gallery pieces. Straight-on photography.
- Footer: Fade to void. Minimal. The silence after the last song.

## Ralphable vs Human-Taste
- AC1, AC4-5: **Ralphable** (typography setup, accessibility, reduced-motion)
- AC2-3, AC6-7: **Human-Taste** (content placement at emotional peaks, per-section visual treatment, world-text binding)

## Dependencies
- Unified scroll arc (determines emotional peaks for content placement)
- Design rule enforcement (color system, animation rules)
- Content from the actual artist (bio text, album art, products) — currently placeholder

## Verification
- AC1: CSS contains serif + sans-serif font-family declarations on appropriate selectors
- AC2: SECTION_T_VALUES align with documented emotional peaks in scroll arc
- AC3: Each glass-card has a unique CSS modifier class
- AC4: @media (prefers-reduced-motion: reduce) exists in content-overlay.css
- AC5: Contrast ratio tool passes AA for body text on glass card backgrounds
- AC6: ContentOverlay.jsx reads atmosphere state (verify import/binding)
- AC7: Landing animation sequence matches spec (text-shadow → opacity → hold)
