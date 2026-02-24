# MKS Cross-Reference Analysis

**Synthesis of all 8 design philosophy documents into a unified build reference.**
**Every claim in this document cites its source document(s).**

---

## 1. Narrative Arc to UX Journey -- Unified Map

The 6 acts from NARRATIVE-STRUCTURE.md mapped to site sections (SITE-ARCHITECTURE.md), emotional states (EMOTIONAL-MAP.md), visual treatments (DESIGN-SYSTEM.md), and style decisions (STYLE-DECISIONS.md).

| Narrative Act | Site Section | Emotional State | Nature Element | Color Temperature | Visual Treatment | Style Decision | What the User Feels |
|---|---|---|---|---|---|---|---|
| **Prologue: The Knowing** | **Landing / Hero** | Sacred anticipation. The silence before the first note. (EMOTIONAL-MAP: "The Threshold") | Sky / clouds -- liberation, vastness (STYLE-DECISIONS #2) | Cold-to-void. Maximum darkness, minimum content. (DESIGN-SYSTEM: Landing) | `--void` background. Name reveal as radiation -- glow before letterforms. 3-5 second hold. Nav hidden on load. 100vw x 100vh, one small focal element. (DESIGN-SYSTEM: Landing) | Score in the sky. Cold world, warm moments baseline. Medium-heavy interaction. (STYLE-DECISIONS #1, #6, #7) | "I've been here before." The landing is a homecoming, not an introduction. The return pattern. (NARRATIVE: Prologue design implications) |
| **Act I: The Sketching Phase** | **Music / Listen** (cursor-reveal layer) | Recognition. "Oh -- I know this feeling." (EMOTIONAL-MAP: "The Recognition") | Ocean -- depth, what lies beneath (STYLE-DECISIONS #2) | Cool teal immersion shifting to warm parchment on engagement. (DESIGN-SYSTEM: Music) | `--void` + teal atmospheric wash. Horizontal band composition. Content surfaces, does not pop. Exposed mechanics on hover (key signature, instrumentation). Color restoration on interaction. (DESIGN-SYSTEM: Music) | Hidden layer scores, cursor-revealed. (STYLE-DECISIONS #3) | The user joins the sketching phase. They are searching with Mike. The cursor reveals the score sheets beneath the surface -- the ocean-parting metaphor. (NARRATIVE: Act I design implications) |
| **Act II: The Voice** | **Music / Listen** (playback experience) | Recognition deepening to personal memory. The forgotten rooms opening. (EMOTIONAL-MAP: "The Recognition" + BRAND-STORY: "The Sound of Forgotten Rooms") | Ocean transitioning -- surface to depth (VISUAL-LANGUAGE: Ocean = "depth of buried emotion") | Transitional. Teal to warm as music plays. (DESIGN-SYSTEM: Music -- "shifting to warm parchment as user engages") | Invisible design. If you notice the CSS, the CSS has failed. Music is easy to find and play. Clarity and intimacy. Track listings as continuous material with thin horizontal rules. (NARRATIVE: Act II + DESIGN-SYSTEM: Music) | Typography as two voices: serif speaks for the artist, sans-serif for information. (STYLE-DECISIONS #9) | "I feel something." The design disappears. The music reaches. The medium becomes invisible -- the listener hears meaning, not grammar. (NARRATIVE: Act II) |
| **Act III: The Tension** | **About / Story** | Connection. Learning who caused the feeling. (EMOTIONAL-MAP: "The Recognition" to "The Desire" transition) | Grass field / plains -- openness, the journey (STYLE-DECISIONS #2) | Warm. The most human section. Golden hour light. (DESIGN-SYSTEM: About) | `--void` + golden gradient wash. Asymmetric layout (`margin-left: 8vw`). Images placed organically, 1deg rotation. `--amber` for emphasis, `--copper` for pull-quote marks. Photography: unposed, candid, real. (DESIGN-SYSTEM: About) | Piano with flowers -- tender, vulnerable, organic meets mechanical. Inside-the-audience performance shots. (STYLE-DECISIONS #4, #5) | The hovering feeling -- elements floating without clear grounding. Then the bass note arrives: the content resolves. Commerce (Store) coexists with art (atmosphere) without either killing the other. (NARRATIVE: Act III) |
| **Act IV: The Boredom That Created Taste** + **Act V: The Audience** | **Store** | Desire made tangible. The Coca-Cola moment. (EMOTIONAL-MAP: "The Desire") | Golden hour / sunset -- warmth, desire, the threshold (STYLE-DECISIONS #2) | The warmest section. Deep amber. `--warm-black` (#1a1208) -- the only warm-dark background. (DESIGN-SYSTEM: Store) | Products as gallery pieces. Clean grid, cinematic products. Each album in its own environmental world (one on grass with wind, another in amber light). Straight-on photography for products. Score sheets at 6% opacity behind products. (DESIGN-SYSTEM: Store) | Clean catalog, elevated products. Each product has its own flavor. (STYLE-DECISIONS #8) | Every viewport earns its existence. No filler. Dense, not long. The value is the effect on the listener, not the price tag. You arrive at something you already want. (NARRATIVE: Act IV + BRAND-ESSENCE: Coca-Cola Principle) |
| **Act VI: The Persona** | **Tour + Footer** | The invitation (Tour): "This exists in the real world." The departure (Footer): The silence after the last song. (EMOTIONAL-MAP: "The Invitation" + "The Departure State") | Tour: Night sky / city through windows. Footer: Dusk haze -- the fade, the aftermath. (STYLE-DECISIONS #2) | Tour: Cool-warm tension -- industrial concrete meets amber lamplight. Footer: Narrow-range fade, lavender-grey dissolving to void. (DESIGN-SYSTEM: Tour + Footer) | Tour: The window effect, dual color temperature, silhouette framing. Footer: Gradient from warm-dark to cool-dark to void. No warm accent. Content becomes sparse, then stops. (DESIGN-SYSTEM: Tour + Footer) | Crepuscular rays + personal mythology. The hidden sun -- the artist is the source of light. (STYLE-DECISIONS #10) | Tour: The persona creates aura. Aura creates desire to engage. "This is not someone you see on the street. This is an artist." The fourth wall breaks. Footer: "I have been somewhere, not browsed something." The lingering quality of a film watched alone. (NARRATIVE: Act VI + EMOTIONAL-MAP: Departure) |

### Notes on the Mapping

The 6 narrative acts do not map 1:1 to the 6 site sections. The relationship is:

- **Prologue** maps cleanly to **Landing**
- **Acts I and II** both map to **Music/Listen** -- Act I is the discovery layer (cursor interaction, score reveals) and Act II is the playback experience (the music itself)
- **Act III** maps to **About/Story** -- the tension between survival and art is the human story
- **Acts IV and V** converge on **Store** -- taste (knowing what's worth making) and audience (knowing who it's for) both culminate in the moment of desire
- **Act VI** spans **Tour and Footer** -- the persona is what makes you want to attend (Tour) and the departure is where the aura lingers (Footer)

---

## 2. The 2 Strongest Reference Photos

Based on STYLE-DECISIONS.md (the locked-in choices: cold world/warm moments, score in the sky, inside-the-audience performance, piano with flowers, crepuscular rays + personal mythology) and the narrative structure, these are the 2 images most essential to retain as actual site assets rather than pure design reference.

### Essential Image 1: img13 -- Crepuscular Rays, Cloud Mass Backlit Blue

**File:** `assets/raw-imports/crepuscular-rays-cloud-mass-backlit-blue.png`

**Justification:**

This image IS the brand. It is not a reference for the brand -- it is the visual sentence itself.

- STYLE-DECISIONS #10 explicitly names this image: "The cloud mass with rays behind it (image 13). But not alone -- layered with Mike's personal vision." It is the "One Image" that reduces the entire visual identity to a single frame.
- STYLE-DECISIONS #6 (Landing Page) describes the landing as "the score flying through the sky" -- this image provides the sky. The crepuscular rays are the hidden sun, and the hidden sun is the artist: "The artist is the sun. The music is the light. The world is what the light transforms."
- BRAND-STORY's "Visual Sentence" describes exactly this image: "A dark sky cracking open with light. Rays fanning outward from a hidden source."
- DESIGN-SYSTEM lists img13 as a source image for the Landing section and confirms it for 5 core design patterns: single focal point, light-as-hierarchy, dissolving/fading edges, silhouette/foreground framing, and radial light from hidden center.
- It is the only image that directly maps to the Prologue's emotional architecture: the knowing that precedes the doing, the light whose source you cannot see but whose effects radiate outward.

**Usage:** Landing page background. Either used directly (with score-sheet overlay composited above it) or as the primary atmospheric source for the sky that opens as the user arrives. This is the one image that could appear on the actual site, not just inform its design.

### Essential Image 2: img04 -- Upright Piano, Open Hammers, Flowers, Golden Light

**File:** `assets/raw-imports/upright-piano-open-hammers-flowers-golden-light.png`

**Justification:**

This image embodies the convergence of every major style decision about the artist's world.

- STYLE-DECISIONS #4 is named after this exact image: "Piano: FLOWERS, GOLDEN LIGHT." It was selected as the definitive representation of the instrument: "The tender version. Organic meets mechanical. Vulnerability over rigor."
- It is confirmed as a source image for 3 of the 5 site sections in DESIGN-SYSTEM: Music/Listen, About/Story, and Store. No other single image spans that many sections.
- It resolves the Romantic Atmosphere vs. Documentary Clarity contradiction identified in DESIGN-SYSTEM Section 4 -- the piano with flowers IS the romantic atmosphere that governs the experience layer, while the visible mechanism (hammers, strings) IS the documentary clarity that grounds the craft.
- NARRATIVE-STRUCTURE Act I (The Sketching Phase) centers on the piano as the instrument of search. Act II (The Voice) centers on the medium becoming transparent. This image captures both -- the mechanism is exposed (Act I: the process visible) but flowers grow from within it (Act II: life has overtaken technique).
- BRAND-STORY's "The Hand" section emphasizes "Hands on keys. The physicality of making music." This image is the only one in the collection that shows the instrument in a state that suggests both the physical act of creation and the emotional result of that act.
- It carries the dual color temperature that DESIGN-SYSTEM identifies as a core pattern: warm amber (golden hour light) and cool structure (the dark piano body) coexisting in one frame. It is the teal/amber conversation in a single photograph.

**Usage:** About section hero image, or the visual anchor for the Music section. It could serve as product photography context for score sheet sales in the Store. It is the image that says "a human being made this, by hand, with intention" -- which is the brand's central claim.

### Why Not the Others

- **img03/img10 (performance shots):** These are inside-the-audience reference (STYLE-DECISIONS #5), but they are compositional guides, not assets. The actual site should use Mike's own performance photography shot from this POV -- not stock/reference images of someone else's venue. These inform the camera angle, not the content.
- **img09 (sunset clouds):** Beautiful but generic. The crepuscular rays (img13) do everything this image does with more specificity and direct brand connection.
- **img06 (lone figure in grass):** Powerful reference for the About section's "plains" nature element, but it is someone else's figure. The site needs Mike's own image in this role, shot with this compositional principle.
- **img11 (deep amber scores):** Informs the Store's color temperature but is a texture reference, not a site asset. The actual score sheets for the store will be Mike's own handwritten scores photographed in amber light.

---

## 3. Contradictions and Ambiguities -- Resolved

### Contradiction 1: Number of Site Sections

**SITE-ARCHITECTURE.md** lists 5 sections: Landing, Music, About, Store, Tour.
**DESIGN-SYSTEM.md** lists 6 sections: Landing, Music, About, Store, Tour, Footer.
**STYLE-DECISIONS.md** (#2, nature mapping) lists 6: Landing, Music, About, Store, Tour, Footer.
**EMOTIONAL-MAP.md** lists 5 emotional states (Threshold, Immersion, Recognition, Desire, Invitation) plus a "Departure State" that is described in prose but not given a section number.

**The gap:** Is the Footer a "section" or not? SITE-ARCHITECTURE does not include it in its section table. EMOTIONAL-MAP treats departure as an epilogue, not a numbered state. But DESIGN-SYSTEM and STYLE-DECISIONS both treat it as a full section with its own design spec.

**Resolution:** The Footer IS a section. It has its own nature element (dusk haze), its own color temperature (cooling to void), its own emotional state (mono no aware), and its own design spec. SITE-ARCHITECTURE should be treated as listing the 5 *content* sections; the Footer is the 6th *experience* section. For build purposes, treat the site as having 6 sections: Landing, Music, About, Store, Tour, Footer.

### Contradiction 2: Emotional States vs. Narrative Acts -- Misaligned Count

**NARRATIVE-STRUCTURE.md** has a Prologue + 6 Acts = 7 narrative units.
**EMOTIONAL-MAP.md** has 5 numbered states + 1 departure = 6 emotional units.
**SITE-ARCHITECTURE.md** has 5 sections.
**BRAND-STORY.md** has 4 seasons (Winter, Spring, Summer, Autumn).

**The gap:** These four systems have different cardinalities (7, 6, 5, 4). Which framework governs?

**Resolution:** The site sections (6, including Footer) are the structural reality. The other frameworks are lenses applied to those 6 sections:

| Site Section | Season (BRAND-STORY) | Emotional State (EMOTIONAL-MAP) | Narrative Act (NARRATIVE-STRUCTURE) |
|---|---|---|---|
| Landing | Winter | Sacred anticipation | Prologue: The Knowing |
| Music | Spring | Recognition ("Oh -- I know this feeling") | Act I: The Sketching Phase + Act II: The Voice |
| About | (no direct season -- between Spring and Summer) | Connection (implicit, between Recognition and Desire) | Act III: The Tension |
| Store | Summer | Desire ("I want to hold this") | Act IV: Boredom/Taste + Act V: The Audience |
| Tour | (no direct season -- between Summer and Autumn) | The Invitation | Act VI: The Persona |
| Footer | Autumn | The Departure | (Epilogue -- no explicit act) |

The About and Tour sections fall between seasons. This is intentional -- they are transitional moments, which aligns with their nature elements (grass/plains = spring-to-summer transition; night sky = summer-to-autumn transition).

### Contradiction 3: EMOTIONAL-MAP's "Immersion" State Has No Clear Section

**EMOTIONAL-MAP.md** Section 2 describes "The Immersion (First Scroll)" -- "Standing at the edge of the ocean at dusk. Being held by something larger than yourself." But the site section table in SITE-ARCHITECTURE assigns no section to this state. It falls between Landing and Music.

**The gap:** Is Immersion a separate section, or a transition within the Landing?

**Resolution:** Immersion is the scroll transition between Landing and Music. It is not a section with its own content -- it is the experience of the Landing giving way to the Music section. DESIGN-SYSTEM's Landing spec confirms this: "Background drifts at 20s cycle" and "The invitation to scroll. Subtle. A shift in the atmosphere." The Immersion state is the animated transition between act 0 and act 1, not a standalone section. For build purposes, it is the 100vh-to-200vh scroll zone where the landing atmosphere opens into the ocean/teal of the Music section.

### Contradiction 4: EMOTIONAL-MAP Word "Vast" vs. EMOTIONAL-MAP Anti-Word "Epic"

**EMOTIONAL-MAP.md** includes "Vast" in the brand vocabulary but bans "Epic" because it is "Too loud. Too Marvel." The distinction is philosophically clear but practically ambiguous when writing alt text, meta descriptions, or internal documentation.

**Resolution:** "Vast" describes scale without drama. "Epic" implies narrative intensity and spectacle. The test: if the word could appear in a Marvel trailer, it does not belong. If the word could appear in a Terrence Malick voiceover, it does. Use "vast" for spatial descriptions. Never use "epic" for anything.

### Contradiction 5: Hero Name Size -- Small vs. Prominent

**DESIGN-SYSTEM.md** specifies `--size-hero-name: clamp(1rem, 2.5vw, 1.5rem)` and explicitly states "NOT giant -- quietly placed" and "The eye finds it because it is the only warm thing."
**SITE-ARCHITECTURE.md** describes the name as "MIKE THE KING SHENG. Not all at once. Letter by letter, or word by word, or as a slow luminous reveal."
**BRAND-STORY.md** says "The hidden sun -- you see the effect before the source."

**The gap:** A max of 1.5rem for the hero name is extremely small. Is this intentional or an overcorrection?

**Resolution:** The smallness is intentional and philosophically grounded. The name is not a logo splash -- it is a point of light in a vast dark. DESIGN-SYSTEM's "2% focal point principle" (from img06 analysis) confirms: the figure in the vast field occupies 2% of the frame, and the emptiness is what gives it power. The name should be small, luminous, and the only warm element on the landing. The "prominence" comes from isolation, not size. If during development it reads as too small at 1.5rem on actual screens, the solution is to increase the viewport darkness and reduce competing elements -- not to increase the font size.

### Contradiction 6: "All Nature Elements Rotating" vs. Specific Section Assignments

**STYLE-DECISIONS.md** #2 says "ALL OF THEM, ROTATING" for nature elements, but then provides a specific mapping (Landing: Sky, Music: Ocean, About: Grass, Store: Golden hour, Tour: Night sky, Footer: Dusk haze).

**The gap:** Are the nature elements fixed per section or rotating?

**Resolution:** Both. Each section has a PRIMARY nature element (the mapping in STYLE-DECISIONS). The rotation applies within the Music section specifically, where the nature element can change per song or album ("rotate depending on the song or something" -- Mike's own words). The other sections maintain their assigned elements. The "four seasons" principle means the temperature shifts across the scroll, not that each section randomly cycles through nature.

### Ambiguity 1: Spanish Version

**STYLE-DECISIONS.md** #7 notes: "Spanish version at `/es`. Needs translator."

This is mentioned once and never addressed in any other document. No other document references internationalization, RTL support, or multilingual content strategy.

**Resolution needed from stakeholder:** Is the Spanish version MVP or post-launch? Does it require full content translation or just UI chrome? Does the atmospheric/emotional design change for a Spanish-speaking audience? This needs a decision before development.

### Ambiguity 2: Sound/Audio Strategy

**SITE-ARCHITECTURE.md** mentions "Sound option. If music auto-plays or is offered: it begins at this moment" and "Sound as design element... The site without sound should work. The site with sound should transform."
**No other document** specifies what audio plays, from what source, how it integrates with streaming links, or whether ambient sound (not music) is part of the atmospheric layer.

**Resolution needed from stakeholder:** See Section 5 (What's Missing) below.

### Ambiguity 3: What Does "Pointing Videos" Mean?

**BRAND-ESSENCE.md** mentions "The pointing videos stay real" as part of the authenticity principle. This is never explained in any other document.

**Resolution needed from stakeholder:** Presumably these are existing social media content (videos of Mike pointing at sunsets, locations, etc.). Their role on the site -- if any -- needs clarification. Are they embedded? Referenced? Used as social proof?

---

## 4. Section-by-Section Build Spec

Compiled from ALL documents. Every property cites its source.

---

### SECTION 1: LANDING

| Property | Specification | Source |
|---|---|---|
| **Narrative Act** | Prologue: The Knowing -- "The identity of 'composer' existed before the ability to compose." | NARRATIVE-STRUCTURE |
| **Season** | Winter -- "Cold. Vast. Dark sky with light breaking through. The moment before the music starts." | BRAND-STORY |
| **Nature Element** | Sky / clouds. "The score flying through the sky. The music unbound from the page, liberated into the vastness." | STYLE-DECISIONS #2, #6 |
| **Color Temperature** | Cold-to-void. Maximum darkness. `--void` (#0a0a0a) background. `--amber` appears only with name reveal. | DESIGN-SYSTEM: Landing; STYLE-DECISIONS #1 |
| **Background** | `var(--void)` transitioning to atmospheric gradient. Crepuscular ray reference (img13). | DESIGN-SYSTEM: Landing |
| **Interaction Level** | Low on load, medium on scroll. Nav hidden initially. "The first moment is sacred. Don't clutter it." | SITE-ARCHITECTURE; STYLE-DECISIONS #7 |
| **Typography Voice** | Artist name: `--weight-light` (300), `--size-hero-name` (max 1.5rem), `--tracking-wide` (0.15em). NOT giant. Quietly placed. Cinematic reveal with glow-before-letterforms. | DESIGN-SYSTEM: Typography; VISUAL-LANGUAGE |
| **Ambient Scene** | Dark sky with light breaking through. Score sheets flying through the sky. A figure carrying a music scroll with a white horse. "The music has escaped the page." Background drifts at 20s cycle. | STYLE-DECISIONS #6; BRAND-STORY: Winter; DESIGN-SYSTEM: Motion |
| **Key Patterns** | Scale-as-emotion (100vw x 100vh), name-reveal-as-radiation, background-motion, vignette framing, no-edge-design | DESIGN-SYSTEM: Landing |
| **User Feeling** | Sacred anticipation. "The stillness that precedes something important." Slowness without boredom, darkness without emptiness. The sense of homecoming. | EMOTIONAL-MAP: The Threshold; NARRATIVE-STRUCTURE: Prologue |

**Sequence (from SITE-ARCHITECTURE):**
1. Black. The screen is dark. Not loading -- waiting.
2. Atmosphere emerges. A world forming.
3. The name arrives. Slow luminous reveal.
4. Sound option (if implemented).
5. Invitation to scroll.

---

### SECTION 2: MUSIC / LISTEN

| Property | Specification | Source |
|---|---|---|
| **Narrative Act** | Act I (The Sketching Phase) + Act II (The Voice). The search that becomes the thing. The medium becoming invisible. | NARRATIVE-STRUCTURE |
| **Season** | Spring -- "The ocean. Things beneath the surface rising up. The frozen world begins to thaw." | BRAND-STORY |
| **Nature Element** | Ocean -- "depth, what lies beneath." Cursor parts the water; scores revealed below. Can rotate per song/album. | STYLE-DECISIONS #2, #3; BRAND-STORY: Spring |
| **Color Temperature** | Cool teal immersion, shifting to warm parchment as user engages. `--void` + `radial-gradient(ellipse, rgba(42,138,138,0.04), transparent)`. | DESIGN-SYSTEM: Music |
| **Background** | `var(--void)` with teal atmospheric wash. | DESIGN-SYSTEM: Music |
| **Interaction Level** | Medium-heavy. Cursor-reveal interaction (ocean-parting scores). Exposed mechanics on hover (key signature, duration, instrumentation). Color restoration on interaction (grey to warm). | STYLE-DECISIONS #3, #7; DESIGN-SYSTEM: Music |
| **Typography Voice** | Track titles: `--text-primary`. Metadata: `--text-secondary`. Monospace for technical data (BPM, key, duration). The music section speaks, the information whispers. | DESIGN-SYSTEM: Music + Typography |
| **Ambient Scene** | Ocean surface as default state. Cursor movement parts it to reveal score sheets beneath. Music plays and colors warm. "Life is returning." | VISUAL-LANGUAGE: Cursor Interaction; BRAND-STORY: Spring |
| **Key Patterns** | Horizontal-band-composition, exposed-mechanics, color-restoration-on-interaction, content-surfacing (translateY, not pop-in), thin horizontal rules between tracks | DESIGN-SYSTEM: Music |
| **User Feeling** | Recognition. "Oh -- I know this feeling." Clarity (music easy to find), intimacy (vastness contracting to something personal), permission (it's okay to feel this). | EMOTIONAL-MAP: The Recognition |

**Interaction detail (from STYLE-DECISIONS #3):** Scores are never wallpaper. They are discovered. The user's attention is what reveals them. "You want to be low-key minimalistic but still capture that feeling."

---

### SECTION 3: ABOUT / STORY

| Property | Specification | Source |
|---|---|---|
| **Narrative Act** | Act III: The Tension -- survival vs. art, the sustained note without a root, "the bass note arrives when it arrives." | NARRATIVE-STRUCTURE |
| **Season** | Transitional (Spring to Summer). The plains: "Open fields. Vast sky. The feeling of being small inside something enormous and being okay with it." | BRAND-STORY: The Plains |
| **Nature Element** | Grass field / plains -- openness, the journey. | STYLE-DECISIONS #2 |
| **Color Temperature** | Warm. The most human section. Golden hour light. `--void` + warm gradient wash: `linear-gradient(180deg, rgba(232,200,120,0.06) 0%, transparent 60%)`. | DESIGN-SYSTEM: About |
| **Background** | `var(--void)` with one-sided golden wash. | DESIGN-SYSTEM: About |
| **Interaction Level** | Medium. Asymmetric layout invites wandering, but content is primarily text and photography. "The About section is not a blog post -- it's a portrait." | NARRATIVE-STRUCTURE: Act VI; SITE-ARCHITECTURE |
| **Typography Voice** | Body text at full opacity -- "this section speaks, not whispers." `--amber` for emphasis, `--copper` for pull-quote marks. Serif for the artist's name and section title. The two-voice system at its most balanced. | DESIGN-SYSTEM: About; STYLE-DECISIONS #9 |
| **Ambient Scene** | A figure in a vast grass field. Golden hour light. Handwritten scores visible in context. The piano with flowers. Photography: unposed, candid, real. `transform: rotate(-1deg)` on photographic elements. | DESIGN-SYSTEM: About; STYLE-DECISIONS #4 |
| **Key Patterns** | Asymmetric-placement (`margin-left: 8vw`), single-focal-point, organic-interrupting-geometric, imperfection budget | DESIGN-SYSTEM: About |
| **User Feeling** | Connection. The user already feels something -- now they learn who caused it. The tension between survival and art is not hidden. It is the story. | EMOTIONAL-MAP (implied, between Recognition and Desire); SITE-ARCHITECTURE |

---

### SECTION 4: STORE

| Property | Specification | Source |
|---|---|---|
| **Narrative Act** | Act IV (Boredom That Created Taste) + Act V (The Audience). Dense value, not padded duration. The audience completes the circuit. | NARRATIVE-STRUCTURE |
| **Season** | Summer -- "Golden hour. The warmest room. Desire is at its highest. The Coca-Cola moment." | BRAND-STORY |
| **Nature Element** | Golden hour / sunset -- warmth, desire, the threshold between having and wanting. | STYLE-DECISIONS #2 |
| **Color Temperature** | The warmest section. `--warm-black` (#1a1208) -- the ONLY section with warm-dark background. `--amber` dominant. | DESIGN-SYSTEM: Store; STYLE-DECISIONS #1 |
| **Background** | `var(--warm-black)` (#1a1208). "The darkness of a room lit by a single amber bulb." | DESIGN-SYSTEM: Store |
| **Interaction Level** | Medium. Clean grid structure for usability. Products dazzle within the grid. Each product in its own environmental world (grass with wind, amber room). Subtle background motion. "Marketed in a way that you wanna fucking buy it." | STYLE-DECISIONS #8; SITE-ARCHITECTURE: Store |
| **Typography Voice** | Product titles: `--text-warm` (#d0a858). Metadata: `--text-secondary`. Price: `--copper`. Store labels: `--weight-medium` (500), `--size-caption`. "Minimal. The product imagery does the talking." | DESIGN-SYSTEM: Store + Typography |
| **Ambient Scene** | "Products bathed in their own worlds -- a CD on a grassy field with wind moving through it, another in amber light." Score sheets at 6% opacity behind products. Straight-on product photography. | BRAND-STORY: Summer; DESIGN-SYSTEM: Store; STYLE-DECISIONS #8 |
| **Key Patterns** | Warm-monochrome-sections, texture-as-background, density-increase-on-scroll (deeper browsing = tighter grid), straight-on documentary framing for products, single-product focus with breathing room | DESIGN-SYSTEM: Store |
| **User Feeling** | Desire made tangible. "The condensation on the Coke bottle." The intangible has become tangible. Tactile imagination -- you can almost feel the object. Simplicity of acquisition. | EMOTIONAL-MAP: The Desire; BRAND-ESSENCE: Coca-Cola Principle |

**Products as art objects (from SITE-ARCHITECTURE):**
- Single product focus. One item visible at a time, or items with significant breathing room.
- CDs photographed as physical objects with weight, texture, dimension. Not flat thumbnails.
- Context over specs. What world does this album take you to?
- Score sheets emphasized for physicality, intimacy, rarity.

---

### SECTION 5: TOUR

| Property | Specification | Source |
|---|---|---|
| **Narrative Act** | Act VI: The Persona -- "Separation as invitation. The inaccessibility IS the marketing." | NARRATIVE-STRUCTURE |
| **Season** | Transitional (Summer to Autumn). The gathering before the departure. | BRAND-STORY (implied) |
| **Nature Element** | Night sky / city through windows -- the gathering. | STYLE-DECISIONS #2 |
| **Color Temperature** | Cool-warm tension. Industrial concrete meets amber lamplight. `--void` + subtle warm glow at boundaries. | DESIGN-SYSTEM: Tour |
| **Background** | `var(--void)` with `box-shadow: inset 0 -80px 120px -60px rgba(184,144,64,0.06)`. | DESIGN-SYSTEM: Tour |
| **Interaction Level** | Medium-low. Functional ticketing access. "The beauty of the site never gets in the way of someone being able to actually go." Clear CTAs. | SITE-ARCHITECTURE: Tour; DESIGN-SYSTEM: Tour |
| **Typography Voice** | Dates/venues: `--text-primary`. City context: `--text-muted`. Venue names: `--amber` (performer's warmth). Ticket links: `--teal` (audience's color). | DESIGN-SYSTEM: Tour |
| **Ambient Scene** | Tour dates as invitations, not a list. Each date with a sense of place. The window effect -- venue images framed by dark borders, like peering into a room where something is happening. Inside-the-audience POV. | SITE-ARCHITECTURE: Tour; DESIGN-SYSTEM: Tour; STYLE-DECISIONS #5 |
| **Key Patterns** | Dual-color-temperature, the-window-effect, silhouette-as-invitation, audience-forward-hierarchy, first-person-viewport framing, social-proof (subtle "others attending") | DESIGN-SYSTEM: Tour |
| **User Feeling** | The invitation. "This person is real. These places are real. This date is real. You could sit in that room and hear this music move through air and hit your actual body." Grounded reality after the dreamlike quality. Urgency without pressure. An open door. | EMOTIONAL-MAP: The Invitation |

---

### SECTION 6: FOOTER

| Property | Specification | Source |
|---|---|---|
| **Narrative Act** | Epilogue. The departure. No explicit narrative act, but corresponds to the aftermath of Act VI's persona -- the aura lingers after the figure has passed. | NARRATIVE-STRUCTURE (implied) |
| **Season** | Autumn -- "The dusk sky. The fade. What remains is the afterglow and the specific beautiful sadness of something ending." | BRAND-STORY |
| **Nature Element** | Dusk haze -- the fade, the aftermath. | STYLE-DECISIONS #2 |
| **Color Temperature** | Narrow-range fade. Post-warm. Lavender-grey dissolving to void. `linear-gradient(to bottom, var(--warm-black) 0%, #181618 40%, var(--void) 100%)`. | DESIGN-SYSTEM: Footer |
| **Background** | `var(--gradient-footer)`. "The page exhales." | DESIGN-SYSTEM: Footer |
| **Interaction Level** | Minimal. No warm accent. No CTAs. "The anti-CTA." Maybe the artist name one more time, very small, very quiet. A single link back to top. | DESIGN-SYSTEM: Footer |
| **Typography Voice** | `--text-muted` at `opacity: 0.4`. Whisper-level. Copyright and links nearly invisible. | DESIGN-SYSTEM: Footer |
| **Ambient Scene** | Content becomes sparse, then stops. The gradient dissolves. No traditional footer grid. "Not a grid of links and a copyright notice." | DESIGN-SYSTEM: Footer |
| **Key Patterns** | Footer-as-fade-out, no-edge-design, the-anti-CTA, narrow-palette-principle (2-3 closely related tones only), dissolve-transitions | DESIGN-SYSTEM: Footer |
| **User Feeling** | "A sense of having been somewhere, not having browsed something. The lingering quality of a film they just watched alone. The quiet certainty that they'll come back." | EMOTIONAL-MAP: The Departure State |

---

## 5. What's Missing -- Open Questions Before Development

### Critical (Blocks Development)

**1. Audio/Sound Strategy**
- Does the site autoplay music? If so, which track? (SITE-ARCHITECTURE mentions "Sound option" but leaves it open.)
- Is there ambient sound separate from the music (ocean waves, wind)?
- How does the site-embedded player interact with streaming links (Spotify, Apple Music)? Does clicking play embed a stream, or does it link out?
- If the user hits play on the Music section, does the audio persist as they scroll to Store/Tour?
- Does the Landing have its own audio, or silence?
- Source: SITE-ARCHITECTURE mentions sound 3 times but never specifies implementation. BRAND-ESSENCE says nothing about audio UX. This is the most important undecided question.

**2. Actual Font Selection**
- DESIGN-SYSTEM specifies `--font-display: 'Your Display Font', serif` and `--font-body: 'Your Body Font', sans-serif`. These are placeholders.
- STYLE-DECISIONS #9 locks in the principle (serif titles, sans-serif body) but no specific fonts are named.
- DESIGN-SYSTEM suggests "Something between Freight Display and Cormorant Garamond in spirit" but makes no final selection.
- This must be decided and tested against all color/background combinations before build.

**3. Score Sheet Assets**
- STYLE-DECISIONS #3 and multiple documents reference Mike's handwritten scores as a core interactive element (cursor-reveal, Store product, background texture).
- No actual score sheet files suitable for web use are present in the assets directory. The raw-imports contain photographs of score sheets (img01, img02, img05, img11) but these are reference images, not the actual MKS scores.
- Needed: High-resolution scans/photographs of Mike's actual handwritten scores, transparent-background or isolatable, for use as: (a) cursor-reveal hidden layer, (b) Store product images, (c) background textures at 6% opacity.

**4. Artist Photography**
- Every document emphasizes "real photography only, no AI-generated artist imagery" (BRAND-ESSENCE, BRAND-STORY, VISUAL-LANGUAGE).
- No actual photographs of Mike are present in the assets directory.
- Needed for: About section portrait, Tour section (inside-the-audience shots from Mike's actual performances), potential Landing sequence.
- The reference images (img03, img10 -- loft performances) are other venues/artists. MKS-specific performance photography must be shot or sourced.

**5. Product Assets**
- The Store section requires "each product in its own environmental world" (STYLE-DECISIONS #8) -- a CD on a grassy field with wind, another in amber light.
- No product photography exists in the assets directory.
- Needed: (a) The actual CD/merch inventory list, (b) Environmental product photography for each item, (c) Straight-on product detail shots.

**6. E-Commerce Platform**
- SITE-ARCHITECTURE describes Store philosophy in detail but specifies no platform.
- Is this Shopify embedded? Stripe direct? A custom cart? Third-party link-out?
- The "purchase moment should feel like acquiring a piece of something meaningful, not checking out of a cart" -- this constrains platform choice significantly. Default Shopify checkout would violate the atmospheric principle.

### Important (Blocks Polish, Not MVP)

**7. The Score-in-the-Sky Landing Animation**
- STYLE-DECISIONS #6 describes "the score flying through the sky" but no technical specification exists for how score sheets animate through the atmospheric background.
- Is this a WebGL/Three.js particle system? CSS animation of positioned elements? A video loop? A canvas-based generative system?
- The complexity of this single interaction could dominate the development timeline. Needs scoping.

**8. Cursor-Reveal Ocean-Parting Interaction**
- STYLE-DECISIONS #3 and VISUAL-LANGUAGE describe "cursor movement parts the water to reveal scores beneath."
- This is technically complex. Needs: shader-based approach? Canvas mask following cursor? CSS clip-path animation? Performance on mobile (where there is no cursor)?
- Mobile fallback: What replaces cursor-reveal on touch devices? Scroll-reveal? Tap-reveal? Gyroscope-based tilt?

**9. The "Listening Now" Social Proof Element**
- DESIGN-SYSTEM mentions "Tiny 'listening now' counter, dots on a map. Peripheral, low-opacity, corner-positioned."
- Source of data? Real-time streaming API? Manually updated? Fake-it-till-you-make-it with plausible numbers?
- If real: which streaming platform provides this data?

**10. Tour Data Source**
- Are tour dates manually entered, or pulled from a service (Bandsintown, Songkick)?
- Venue images: sourced how? Do venues provide press photos? Stock? Self-shot?

**11. Spanish Localization Scope**
- STYLE-DECISIONS #7 notes `/es` version needs a translator.
- Scope: Full site? Just UI? Marketing copy translation or atmospheric copy translation (very different tasks)?
- Impact on design: Do serif display fonts support Spanish characters (tildes, accented vowels)?

**12. Mobile-Specific Design**
- SITE-ARCHITECTURE says "Mobile as intimate. On phone, the experience becomes even more personal. Closer."
- No document provides mobile-specific layouts, breakpoints, or interaction adaptations.
- The cursor-reveal interaction (STYLE-DECISIONS #3) does not work on touch devices. What replaces it?
- The 100vw x 100vh landing: how does it adapt to mobile viewport quirks (iOS Safari address bar, etc.)?

**13. The Scroll Photo / White Horse**
- BRAND-STORY and STYLE-DECISIONS #10 describe Mike's personal mythology image: "carrying a music scroll with a white horse behind him."
- Does this photo exist? Is it yet to be shot? Is it a composite?
- If yet to be shot: it is the most important single asset for the brand. Its production should be prioritized.

**14. Navigation Behavior Detail**
- SITE-ARCHITECTURE: "Navigation should not feel like a toolbar. It should feel like a choice."
- DESIGN-SYSTEM: "Hidden on load. Appears on scroll or after 5s."
- But: What are the exact nav labels? How does the nav behave when the user is mid-section? Does it highlight the current section? Is it a fixed bar, or does it appear/disappear? Does it have a mobile hamburger, or an alternative pattern?

**15. Film Grain Asset**
- DESIGN-SYSTEM references `url('/textures/grain.svg')` for the global overlay.
- This SVG does not exist in the assets directory. It needs to be created or sourced. The opacity (0.03) means it is barely perceptible, but its absence would make the site feel too clean/digital.

---

## Summary

The 8 documents form a remarkably coherent vision. The contradictions are minor and stem from different documents operating at different levels of abstraction (story vs. architecture vs. design system). The core identity -- **a dark, cinematic, breathing world where warmth is earned through engagement, nature is structural, the music opens locked rooms, and every element serves the feeling** -- is consistent across all 8 documents without exception.

The primary risks to development are:

1. **Asset gap** -- The design philosophy is complete but the actual assets (artist photos, score scans, product photography, the scroll/horse image) do not exist yet. The site cannot be built atmospherically without them.
2. **Technical ambition** -- The score-in-the-sky animation and cursor-reveal ocean-parting interaction are both technically demanding features that have no specification beyond their conceptual description. They need prototyping before being committed to a timeline.
3. **Audio strategy** -- For a music site, the audio experience is entirely unspecified. This is the most important UX question that has not been answered.
4. **E-commerce platform** -- The Store philosophy is deeply specified but the platform is not. This choice constrains everything from checkout flow to product data management.

Everything else is ready to build from. The design tokens are defined. The color system is locked. The typography direction is set (pending font selection). The motion system has easing curves and duration tokens. The emotional arc is mapped to sections. The section-to-style mapping is complete.

The documents are the source code. The site compiles from them.
