# score-sheets-dense-scatter-deep-amber.png

### What It Is
Scattered handwritten score sheets — the same family as images 2 and 5 — but the light has shifted deeper. This is the warmest version. The amber is heavier, more saturated, lower on the Kelvin scale. The paper appears denser in its scatter — more pages, packed tighter, less shadow visible between them. The notation is heavier in places, with thicker ink marks and what appears to be more complex scoring. Shot overhead, flat. The feeling is not a surface of pages — it's a depth of them. A pile, not a spread.

### Color Palette

| Color | Hex Approximation | Where | Feeling |
|-------|-------------------|-------|---------|
| Deep amber parchment | `#b89048` | Dominant paper tone, warmest areas | This is past golden hour. This is the light after golden hour — when the gold has thickened into something almost brown. Not nostalgic. Archival. The color of something that has been kept. |
| Dark amber shadow | `#7a5828` | Between-sheet shadows, folded edges | The space between works. Each shadow is a gap between two pieces of music. The dark matter that holds the catalog together. |
| Rich sepia | `#5a3c18` | Deepest pockets, corners | Approaching darkness from within warmth. Not the cold black of image 1's forest floor — warm darkness. Like the inside of a wooden drawer. |
| Notation black-brown | `#2a2018` | Ink, pencil marks, dense scoring | These marks are heavier than image 2's. More notes per page. More density of thought. The handwriting of someone deep in the work, not editing but producing. |
| Highlight edge | `#d0a858` | Brightest paper catching direct light | The highest point. Where a page curls up toward the source and catches one more degree of warmth. The peak before the curve back into shadow. |

### Why It's Dreamy

**The warmth has weight.** Images 2 was warm. This is heavy-warm. The difference is like the difference between afternoon and late afternoon — same sun, but the light has traveled through more atmosphere, picked up more color, become thicker. You can almost feel the temperature of this image. It radiates.

**The density has increased.** More pages. Tighter scatter. Less breathing room between them. This is the same body of work as image 2, but you're deeper into the pile now. You've been looking through the scores for a while. The ones on top were the familiar ones — these are the ones underneath. The deeper catalog. The work most people never see.

**The flattening.** Because the pages are so densely packed and the light is so even-warm, the image starts to flatten into an abstract texture. Individual sheets become harder to distinguish. The score-ness recedes and what remains is pattern — horizontal lines, ink marks, warm tone, repetition. At a certain zoom level, this stops being "photographs of score sheets" and becomes a material. Like wood grain or textile weave. Music as texture.

### Composition Structure

```
[DENSE AMBER FIELD — uniform warmth]
  [sheet][sheet][sheet][sheet]
  [sheet][sheet][sheet][sheet]
  [sheet][sheet][sheet][sheet]
[DENSE AMBER FIELD — no visible background]
```

**Total saturation, deepened.** No hierarchy, no focal point, no single sheet privileged. The image IS the texture. This is the most abstract of the three score-scatter images — the furthest from documentary, the closest to material.

### Philosophy

The three score-sheet images form a trilogy:
- **Image 2** (warm overhead): The work, present tense. The workshop. You see individual pieces.
- **Image 5** (desaturated grey): The work, past tense. The archive. Memory without color.
- **Image 11** (deep amber): The work as substance. Not individual pieces anymore — the accumulated material of a life's practice. You can't pick out one sheet. It's all one thing now.

This is what it looks like when craft becomes identity. The scores aren't things Mike made. They're the material Mike is made of. The website's relationship to the catalog should eventually reach this point — not "here are the individual albums" but "this is a body of work, and the body is continuous."

### Frontend Design Translations

| Insight | CSS/Design Pattern |
|---------|-------------------|
| **Texture as background** | This image (or one like it) used as a literal `background-image` at low opacity behind store or catalog sections. `background: url('scores-amber.png'); opacity: 0.06; mix-blend-mode: multiply`. The scores become the substrate that everything else sits on. |
| **Deep amber as store color** | The store section shifts warmer than the rest of the site. `--store-bg: #1a1208; --store-surface: rgba(184,144,72,0.08)`. Products live in amber light. The store is the warmest room on the website — because desire is warm. |
| **Density increase on scroll** | As the user scrolls deeper into a catalog section, content gets denser — tighter grid gaps, smaller cards, less whitespace. `gap: calc(2rem - (var(--scroll-depth) * 0.5rem))`. The deeper you go, the more there is. The pile grows around you. |
| **Abstract at distance, detailed up close** | Images or content blocks that look like texture at normal zoom but resolve into detail on hover/focus. `transform: scale(1)` shows the pattern; `transform: scale(1.5)` on hover reveals individual elements. The macro-to-micro shift. |
| **Warm darkness (not cool darkness)** | A second dark mode: not `#0a0a0a` (blue-black) but `#1a1208` (amber-black). Used in the store. The darkness of a room lit by a single warm bulb, not by moonlight. `background: #1a1208; color: #d0a858`. Rich. Interior. Enclosed. |
| **Music as continuous material** | In the music/catalog section, avoid hard boundaries between albums. A continuous scrolling field where one release bleeds into the next. No cards with borders. Track listings that flow into each other separated only by thin warm rules. The catalog is one river, not separate pools. |

### Smell & Taste

- **Smell:** The inside of an antique shop. Beeswax and old varnish. Paper that has absorbed decades of room temperature. The warmth is almost physical — the air in this image would be warm to breathe. Slightly sweet, like caramelized sugar at the very beginning before it browns.
- **Taste:** Burnt caramel. Not the clean sweetness of image 2's shortbread — this has gone further. The sugar has darkened. It's richer, more complex, slightly bitter at the edges. The flavor of something that almost went too far but stopped right at the line where intensity becomes beauty.
