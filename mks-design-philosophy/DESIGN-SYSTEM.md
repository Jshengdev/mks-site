# MKS Design System

**Synthesized from 15 image analyses and 4 brand philosophy documents.**
**This is the build document. Everything here is actionable.**

---

## 1. Consolidated Color System

Every hex code across all 15 image analyses was cataloged, clustered by proximity, and distilled into 12 named design tokens organized by role. Each token includes its source images as confirmation.

### Backgrounds

| Token Name | Hex | Role | Confirmed By |
|------------|-----|------|-------------|
| `--void` | `#0a0a0a` | Primary site background. The dominant dark canvas. Not flat black -- it breathes. | img01 (dark ground), img03 (audience silhouette), img10 (audience black #0e0e0e), img15 (piano frame #0e0e0e) |
| `--warm-black` | `#1a1208` | Secondary dark background for warm-context sections (Store, deep catalog). The darkness of a room lit by a single amber bulb. | img11 (deep amber shadows #5a3c18 context), img04 (piano lacquer #1a1a18), img01 (wet stone #1a1020) |
| `--surface` | `#1e1e1e` | Card/container surfaces, elevated elements. One step above void. | img05 (near-black vignette #1e1e1e), img06 (deep grass shadow #1e3018), img07 (surfer silhouette #1a2a2a) |

### Text & Luminance

| Token Name | Hex | Role | Confirmed By |
|------------|-----|------|-------------|
| `--text-primary` | `#c8d4e8` | Primary text color. Cool luminance -- the color of light when it is the only light left. Not white. Bioluminescent. | img03 (projection white-blue #c8d4e8), img10 (screen glow #d0d8e8), VISUAL-LANGUAGE ("cool luminance") |
| `--text-secondary` | `#90a0a0` | Secondary text, captions, metadata. The horizon mist -- present but not asserting. | img08 (horizon mist #90a0a0), img12 (mid haze mauve #a8a098), img13 (crepuscular ray pale #a8b8c0) |
| `--text-muted` | `#5a5550` | Tertiary text, timestamps, fine print. Concrete warmth. | img03 (industrial concrete grey #5a5550), img13 (cloud face #485868) |

### Warm Accents

| Token Name | Hex | Role | Confirmed By |
|------------|-----|------|-------------|
| `--amber` | `#d8a860` | Primary warm accent. The sunset gold. Used at moments of emotional peak -- hover states, transitions, the Store. Rare. Earned. Significant. | img09 (cloud gold #d8a860), img02 (lit parchment #d9c89e), img04 (golden hour #e8c878), img11 (deep amber #b89048), img03 (warm lamp #c49550), img10 (city amber #b88838), img15 (brass gold #b89838) |
| `--copper` | `#a06830` | Deep warm accent for detail elements. The color of piano strings and aged craft. | img04 (copper string #a06830), img15 (copper bass string #a86028), img11 (dark amber shadow #7a5828) |

### Cool Accents

| Token Name | Hex | Role | Confirmed By |
|------------|-----|------|-------------|
| `--teal` | `#2a8a8a` | Primary interactive color. The audience's color. Buttons, links, active states, the user's touch point. Used 3-5 times per page maximum. | img03 (teal accent #2a8a8a), img10 (teal clothing #28787a), img07 (ocean teal #4a6a68), img14 (deep ocean teal #287878) |
| `--steel` | `#6888a0` | Atmospheric cool tone for transitional sections and sky-states. | img13 (clear sky steel blue #6888a0), img09 (clear sky blue #6a90a8), img08 (mid-water steel blue #687878) |

### Signal Colors

| Token Name | Hex | Role | Confirmed By |
|------------|-----|------|-------------|
| `--pink` | `#e8a8b0` | The accident color. Used for singular, unexpected, unrepeatable moments only. A 404 page flash. A page-transition tint. A one-time hover state. Not a brand color -- a brand secret. | img14 (light leak pink #e8a8b0) |
| `--red-felt` | `#983028` | The hidden accent. One small element buried deep in the UI -- an active indicator, a micro-detail. The heart inside the machine. Used exactly once. | img15 (red felt detail #983028) |

### Color Cluster Resolution Notes

The following raw hex values across all images were clustered into the tokens above:

- **The Black Cluster** (8 images): `#0a0a0a`, `#0e0e0e`, `#111111`, `#1a1a18`, `#1a1020`, `#1a2a2a`, `#1e1e1e`, `#2a2018` -- all resolve to `--void` or `--surface` depending on warmth
- **The Parchment/Amber Cluster** (7 images): `#d9c89e`, `#d4c9a8`, `#e8c878`, `#c49550`, `#b89048`, `#b88838`, `#d8a860`, `#b89838`, `#c8a070`, `#d0a858` -- all resolve to `--amber` with lightness variants handled through opacity
- **The Teal Cluster** (4 images): `#2a8a8a`, `#28787a`, `#4a6a68`, `#287878`, `#3a5a58` -- all resolve to `--teal` or `--steel` depending on saturation
- **The Grey Cluster** (5 images): `#5a5550`, `#6a6058`, `#485868`, `#b8b8b8`, `#787878`, `#383838` -- context-dependent: warm greys become `--text-muted`, cool greys become `--text-secondary`

---

## 2. Ranked Design Patterns

All CSS/design patterns from the 15 Frontend Design Translations tables were collected, deduplicated, and ranked by how many images independently confirm each principle.

### CORE Patterns (confirmed by 3+ images)

These are non-negotiable. They define the site.

| Rank | Pattern | Confirmation Count | Source Images | Implementation |
|------|---------|-------------------|--------------|----------------|
| 1 | **Dark-dominant canvas (85/15 ratio)** | 10 | img01, img03, img04, img06, img07, img08, img09, img10, img13, img15 | `background: var(--void)`. Content occupies a narrow luminous column. Most of the viewport is breathing room. The darkness is not emptiness -- it is the vastness before dawn. |
| 2 | **Single focal point per viewport** | 8 | img01, img06, img07, img08, img09, img13, img14, img15 | Each section has ONE bright/warm element. Everything else recedes via `opacity: 0.3` on secondary elements. The eye has nowhere else to go. |
| 3 | **Warm accent used sparingly** | 7 | img01, img03, img04, img09, img10, img11, img15 | `--amber` appears only at moments of transition or emotional peak. Hover states, section reveals, the Store. Not a primary color -- an event. `transition: color 0.6s ease`. |
| 4 | **Near-invisible section dividers** | 6 | img06, img07, img08, img09, img12, img14 | No hard borders between sections. `border-top: 1px solid rgba(160,176,176,0.06)`. Content density and spacing signal section changes. The field has no fence. |
| 5 | **Horizontal band composition** | 6 | img03, img04, img07, img08, img12, img15 | Sections read as horizontal strata of different atmospheric density. Repeating thin horizontal lines as motif: `border-bottom: 1px solid rgba(200,192,176,0.12)` between list items. |
| 6 | **Light-as-hierarchy (not size)** | 5 | img01, img02, img05, img09, img13 | Emphasis through brightness, not bold/scale. `filter: brightness(1.15)` on hover, `brightness(0.6)` on siblings. The "lit" element is the focus. |
| 7 | **Grain/texture overlay** | 5 | img05, img12, img13, img14, img02 | Subtle film grain on the entire site: `background-image: url('grain.svg'); opacity: 0.03; mix-blend-mode: overlay; pointer-events: none` on `body::after`. Makes digital surfaces feel touched. |
| 8 | **Asymmetric/off-center placement** | 5 | img01, img02, img04, img06, img10 | No perfect centering. `margin-left: 8vw` instead of `margin: 0 auto`. Elements offset from center. The "found" quality -- stumbled upon, not placed. |
| 9 | **Dissolving/fading edges** | 5 | img07, img08, img09, img12, img14 | Elements fade at their boundaries instead of hard-clipping. `mask-image: linear-gradient(to right, black 70%, transparent 100%)`. Content dissolves like spray off a wave crest. |
| 10 | **Dual color temperature** | 4 | img03, img04, img09, img10 | Mix warm and cool light in the same section. `linear-gradient(135deg, rgba(216,168,96,0.08), rgba(104,136,160,0.08))`. Not one temperature -- a conversation between them. |
| 11 | **Vignette framing** | 4 | img01, img05, img10, img13 | `background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)`. Darkening at viewport edges pulls focus inward. The frame you feel but do not see. |
| 12 | **Background motion (wind/drift)** | 4 | img06, img07, img08, img09 | Slow CSS animations on background elements. `animation: drift 20s ease-in-out infinite alternate`. 4-8s oscillation. The environment breathes on its own, not driven by scroll. |
| 13 | **Scale as emotion (vast viewport)** | 4 | img06, img07, img08, img09 | Hero sections at true `100vw x 100vh` with one small focal element. The emptiness IS the design. Not `max-width: 1200px` centered content -- vastness. |
| 14 | **Silhouette/foreground framing** | 3 | img03, img10, img13 | Dark foreground elements that frame bright content behind them. `position: fixed` dark gradient overlays at viewport bottom during immersive sections. The user peers through dark structure to reach the light. |
| 15 | **Warm monochrome sections** | 3 | img02, img05, img11 | Entire sections built from one warm hue at 3 lightness levels. `--parchment-light`, `--parchment-mid`, `--parchment-dark`. Hierarchy through lightness alone, not hue. |
| 16 | **Color restoration on interaction** | 3 | img05, img09, img14 | Elements that start desaturated and bloom warm when engaged. `filter: grayscale(1)` default, `filter: grayscale(0)` on hover. The user's attention is what restores the color. |

### ACCENT Patterns (confirmed by 1-2 images)

These are contextual. Use them in their specific appropriate sections.

| Pattern | Count | Source | Best Context |
|---------|-------|--------|-------------|
| **Layered overlap with varied rotation** | 2 | img02, img11 | Score sheet gallery, Store product scatter |
| **Edge-to-edge texture (no container)** | 2 | img02, img11 | Background texture behind Store or catalog sections |
| **Fragment revealing (partial visibility)** | 2 | img02, img07 | Cards extending past viewport edge, overflow: hidden used artistically |
| **The "window" effect** | 2 | img03, img10 | Tour section -- images framed by dark borders like peering into a venue |
| **Exposed mechanics (expandable detail)** | 2 | img04, img15 | Track listings that reveal instrumentation on hover; `max-height` unfold transitions |
| **Organic element interrupting grid** | 2 | img04, img15 | One curved/organic image in otherwise strict horizontal layouts |
| **Straight-on documentary framing** | 2 | img15, img05 | Store product photography -- no tilt, no depth-of-field romance |
| **Radial light from hidden center** | 2 | img13, img09 | Behind main content element: `radial-gradient(ellipse, rgba(232,224,200,0.06), transparent 60%)` |
| **Rim light glow on dark elements** | 1 | img13 | Album artwork, profile images: `box-shadow: 0 0 20px 2px rgba(232,224,200,0.08)` |
| **Name reveal as radiation** | 1 | img13 | Landing page name: `text-shadow` glow appears before letter opacity rises |
| **Light leak overlay** | 1 | img14 | Drifting `position: fixed` pink-warm gradient at very low opacity, 60s animation cycle |
| **Overexposure flash at peak moments** | 1 | img14 | Brief white wash (`rgba(255,255,255,0.08)`) on first music play or purchase confirmation |
| **Imperfection budget (2-3 per page)** | 1 | img14 | Margins 3px off grid, 1deg image rotation, 5% color warmth variance |
| **Social proof without testimonials** | 1 | img10 | Tiny "listening now" counter, dots on a map. Peripheral, low-opacity, corner-positioned. |
| **Hidden single-use red accent** | 1 | img15 | One `#983028` element buried deep in the UI. An active state indicator. The heart inside the machine. |
| **Gradient of visual weight** | 1 | img15 | Elements graduating light-to-heavy in a row. Font weight increasing. The treble-to-bass principle. |

---

## 3. Section-to-Style Mapping

Each site section mapped to its specific color temperature, dominant patterns, and source images.

### Landing / Hero

**Emotional State:** Sacred anticipation. The silence before the first note.
**Color Temperature:** Cool-to-void. Maximum darkness. Minimum content.
**Source Images:** img06 (vast grass field), img08 (still ocean), img09 (sunset opening), img13 (crepuscular rays)

| Property | Value |
|----------|-------|
| Background | `var(--void)` transitioning to atmospheric gradient |
| Text color | `var(--text-primary)` at reduced opacity initially, building to full |
| Accent | None on load. `--amber` arrives only with the name reveal. |
| Layout | True `100vw x 100vh`. One small focal element (the name). Vast emptiness. |
| Key patterns | Scale-as-emotion, name-reveal-as-radiation, background-motion (wind/drift), untethered layout (no nav on load), parting-clouds content reveal |
| Animation | Name appears edge-first: `text-shadow: 0 0 40px rgba(232,224,200,0.3)` before `opacity` of text rises. 3-5 second hold before any content. Background drifts at 20s cycle. |
| Nav | Hidden on load. Appears on scroll or after 5s. The first moment is sacred. |

### Music / Listen

**Emotional State:** Recognition. "Oh -- I know this feeling."
**Color Temperature:** Transitional. Cool teal immersion shifting to warm parchment as the user engages.
**Source Images:** img07 (surfer/teal), img04 (piano with flowers), img02 (warm score sheets)

| Property | Value |
|----------|-------|
| Background | `var(--void)` with teal atmospheric wash: `radial-gradient(ellipse, rgba(42,138,138,0.04), transparent)` |
| Text color | `var(--text-primary)` for track titles. `var(--text-secondary)` for metadata. |
| Accent | `--teal` for the play button (the interactive element). `--amber` on hover/active state. |
| Layout | Music is continuous material, not separate cards. Track listings flow with thin horizontal rules (`1px solid rgba(200,192,176,0.12)`) between them. No hard card boundaries. |
| Key patterns | Horizontal-band-composition, exposed-mechanics (expand to show key signature, duration, instrumentation), monochrome-teal sections for immersive listening moments, color-restoration-on-interaction |
| Animation | Content surfaces (rises from below), does not pop. `transform: translateY(20px); opacity: 0` -> `translateY(0); opacity: 1` over 0.8s. |

### About / Story

**Emotional State:** Connection. Learning who caused the feeling.
**Color Temperature:** Warm. The most human section. Golden hour light.
**Source Images:** img04 (piano/flowers/golden light), img01 (score on dark ground), img06 (lone figure)

| Property | Value |
|----------|-------|
| Background | `var(--void)` with warm gradient wash from one side: `linear-gradient(180deg, rgba(232,200,120,0.06) 0%, transparent 60%)` |
| Text color | `var(--text-primary)` slightly warmer. Body text at full opacity -- this section speaks, not whispers. |
| Accent | `--amber` for emphasis. `--copper` for photographic borders or pull-quote marks. |
| Layout | Asymmetric. Text offset left (`margin-left: 8vw`). Images placed organically, not grid-locked. The "found" quality. `transform: rotate(-1deg)` on photographic elements. |
| Key patterns | Asymmetric-placement, single-focal-point, organic-interrupting-geometric, the small-performer principle (artist portrait modestly sized inside vast atmospheric section) |
| Photography | Unposed. Candid. Real sunsets, real locations. No AI generation. Shot with light as character. |

### Store

**Emotional State:** Desire made tangible. The Coca-Cola moment.
**Color Temperature:** The warmest section. Deep amber. Interior warmth. The room with one warm bulb.
**Source Images:** img11 (deep amber scores), img04 (piano golden hour), img15 (piano mechanism straight-on)

| Property | Value |
|----------|-------|
| Background | `var(--warm-black)` (`#1a1208`). The only section that uses warm-dark instead of cool-dark. |
| Text color | `--amber` (`#d8a860`) for product titles. `var(--text-secondary)` for details. |
| Accent | `--amber` is dominant here. `--teal` for add-to-cart / purchase actions. `--copper` for price. |
| Layout | Products as gallery pieces. Generous breathing room. Single-product focus. Straight-on photography (no tilt, full detail). The strict grid for inventory (`display: grid; grid-template-columns: repeat(12, 1fr); gap: 1px`). |
| Key patterns | Warm-monochrome-sections, texture-as-background (score sheets at 6% opacity behind products), density-increase-on-scroll (deeper browsing = tighter grid), abstract-at-distance / detailed-up-close, hard-black-framing on featured items |
| Score sheets | Presented as physical artifacts. Emphasis on handwriting, paper texture, rarity. The craft-as-credibility principle. |

### Tour

**Emotional State:** The invitation. Breaking the fourth wall. This is real.
**Color Temperature:** Cool-warm tension. Industrial concrete meets amber lamplight.
**Source Images:** img03 (loft performance), img10 (audience wide-angle)

| Property | Value |
|----------|-------|
| Background | `var(--void)` with subtle warm glow at boundaries: `box-shadow: inset 0 -80px 120px -60px rgba(184,144,64,0.06)` |
| Text color | `var(--text-primary)` for dates/venues. `var(--text-muted)` for city context. |
| Accent | `--teal` for ticket links (audience color). `--amber` for venue names (performer's warmth). |
| Layout | Horizontal stratification. Date/venue pairs as horizontal bands. The window effect -- venue images framed by dark borders like peering inside. Lead with the experience of attending, not the performer bio. |
| Key patterns | Dual-color-temperature, silhouette-as-invitation, the-window-effect, audience-forward-hierarchy, first-person-viewport framing, social-proof (subtle "others attending" indicators) |
| Feel | Grounded reality after dreamlike quality. Functional ticketing access. Beauty never blocks action. |

### Footer / Exit

**Emotional State:** The silence after the last song. Mono no aware.
**Color Temperature:** Narrow-range fade. Post-warm. Lavender-grey dissolving to void.
**Source Images:** img12 (fading sky/dusk), img08 (still ocean)

| Property | Value |
|----------|-------|
| Background | `linear-gradient(to bottom, var(--warm-black) 0%, #181618 40%, var(--void) 100%)`. The page exhales. |
| Text color | `var(--text-muted)`. Copyright and links at `opacity: 0.4`. Whisper-level. |
| Accent | None. No warm accent in the exit. The warmth has already left. |
| Layout | Content becomes sparse, then stops. No traditional footer grid. Maybe the artist name one more time, very small, very quiet. A single link back to top. |
| Key patterns | Footer-as-fade-out, no-edge-design, the-anti-CTA (no buttons, no calls to action), narrow-palette-principle (2-3 closely related tones only), dissolve-transitions |
| Exit feeling | "I have been somewhere, not browsed something." The lingering quality of a film watched alone. |

---

## 4. Contradiction Resolution

Where images pull opposite directions, each tension is explicitly resolved by assigning each pole to its appropriate context.

### Flat Grey vs. Dramatic Gold

**The tension:** img05 (desaturated grey scores) is austere, archival, cold. img11 (deep amber scores) is warm, rich, immersive. Same subject, opposite temperature.

**Resolution:** These are two states of the same component, not competing aesthetics. The grey state is the **default/resting** state -- used for browse mode, the deep catalog, the archive. The warm state is the **engaged/active** state -- used when the user interacts, hovers, or scrolls into focus. CSS custom properties toggle between them:
```css
--surface-resting: #b8b8b8;  /* grey */
--surface-active: #d9c89e;   /* warm */
```
The user's attention is the golden light. They restore color to what they touch.

### Strict Grid vs. Organic Scatter

**The tension:** img15 (piano mechanism) is perfectly ordered -- horizontal bands, no disorder. img02 (scattered scores) is deliberately chaotic -- overlapping, rotated, organic.

**Resolution:** Both exist on the site but in different sections:
- **Strict grid** applies to: Store inventory, track listings, tour dates, the credits section. Anywhere the user needs to acquire information or make a decision. Precision serves function.
- **Organic scatter** applies to: Score sheet galleries, the About section imagery, background texture layers. Anywhere the goal is atmosphere over information. Chaos serves feeling.

The piano PLAYS the scores. The grid processes the scatter. Both are necessary.

### Vast Emptiness vs. Dense Abundance

**The tension:** img06/img08 (vast field, still ocean) are nearly empty -- 2% content, 98% space. img02/img11 (score sheets) are edge-to-edge dense -- no breathing room.

**Resolution:** These map to different emotional states in the user journey:
- **Vast emptiness** governs: Landing, transitional moments between sections, the exit. These are the inhales.
- **Dense abundance** governs: The music catalog, the store browse, the body-of-work sections. These are the exhales -- where the accumulated weight of craft is displayed.

The rhythm of the site alternates between them. Vast -> Dense -> Vast -> Dense. Inhale -> Exhale.

### Cool Teal vs. Warm Amber

**The tension:** The teal world (img07, img08, img14) and the amber world (img02, img04, img11) pull in opposite thermal directions.

**Resolution:** These belong to different parties:
- **Teal** is the **audience's color**. It marks interactive elements, user-facing states, buttons, links. The person experiencing the work. (Confirmed by img03 and img10 where teal appears specifically on audience members' clothing.)
- **Amber** is the **artist's/work's color**. It marks the music, the products, the creative output, the warmth of the human hand behind the craft.

When the user (teal) touches the work (amber), the interaction itself is the site's most important moment.

### Romantic Atmosphere vs. Documentary Clarity

**The tension:** img04 (piano with flowers, golden light, romance) vs. img15 (piano mechanism, straight-on, clinical).

**Resolution:** Romance governs the **experience layer** -- landing, transitions, atmospheric photography, the emotional envelope. Documentary clarity governs the **information layer** -- product detail, technical metadata, store photography, track specs. The site has both layers running simultaneously. The user is always in an atmosphere, but when they need data, the data is crisp, straight-on, and unflinching. Confidence to be both dreamy and precise.

---

## 5. CSS Custom Properties

A ready-to-use `:root {}` block containing all design tokens.

```css
:root {
  /* ============================
     BACKGROUNDS
     ============================ */
  --void: #0a0a0a;                    /* Primary dark canvas */
  --warm-black: #1a1208;              /* Warm-dark (Store, deep catalog) */
  --surface: #1e1e1e;                 /* Elevated surface / cards */
  --surface-warm: rgba(212, 201, 168, 0.05);  /* Warm glow on dark surfaces */
  --surface-teal: rgba(42, 138, 138, 0.04);   /* Cool atmospheric wash */

  /* ============================
     TEXT & LUMINANCE
     ============================ */
  --text-primary: #c8d4e8;           /* Cool luminance -- primary text */
  --text-secondary: #90a0a0;         /* Horizon mist -- secondary text */
  --text-muted: #5a5550;             /* Concrete grey -- tertiary text */
  --text-warm: #d0a858;              /* Warm text for Store context */
  --text-on-warm: #2a2018;           /* Dark text on warm surfaces */

  /* ============================
     WARM ACCENTS
     ============================ */
  --amber: #d8a860;                  /* Sunset gold -- primary warm accent */
  --amber-deep: #c07828;             /* Intense amber -- peak warmth edge */
  --copper: #a06830;                 /* Piano strings -- craft detail */
  --parchment: #d9c89e;              /* Lit score paper -- warm surface */
  --parchment-shadow: #8a7d5a;       /* Aged score -- warm shadow */

  /* ============================
     COOL ACCENTS
     ============================ */
  --teal: #2a8a8a;                   /* Audience's color -- interactive */
  --teal-deep: #185858;              /* Deep ocean -- weight and gravity */
  --teal-light: #88b8b8;             /* Pale opening -- portal, passage */
  --steel: #6888a0;                  /* Sky steel -- atmospheric transitions */

  /* ============================
     SIGNAL COLORS (use once or never)
     ============================ */
  --pink: #e8a8b0;                   /* Light leak -- the accident color */
  --red-felt: #983028;               /* Hidden heart -- single buried detail */

  /* ============================
     SEMANTIC ALIASES
     ============================ */
  --bg-primary: var(--void);
  --bg-store: var(--warm-black);
  --bg-card: var(--surface);
  --color-interactive: var(--teal);
  --color-accent: var(--amber);
  --color-focus-ring: var(--teal);
  --color-link: var(--teal);
  --color-link-hover: var(--amber);

  /* ============================
     BORDERS & DIVIDERS
     ============================ */
  --border-invisible: 1px solid rgba(160, 176, 176, 0.06);
  --border-subtle: 1px solid rgba(200, 192, 176, 0.12);
  --border-frame: 8px solid #0e0e0e;
  --divider: 1px solid rgba(200, 192, 176, 0.08);

  /* ============================
     SHADOWS & GLOWS
     ============================ */
  --glow-rim: 0 0 20px 2px rgba(232, 224, 200, 0.08);
  --glow-warm: 0 0 60px 10px rgba(216, 168, 96, 0.06);
  --vignette: radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.35) 100%);
  --shadow-ambient: inset 0 -80px 120px -60px rgba(184, 144, 64, 0.06);

  /* ============================
     GRADIENTS
     ============================ */
  --gradient-void: linear-gradient(to bottom, #0e0e10, #0a0a0a);
  --gradient-teal-immersion: linear-gradient(to bottom, #2a4a48, #4a6a68, #2a4a48);
  --gradient-warm-cool: linear-gradient(135deg, rgba(216, 168, 96, 0.08), rgba(104, 136, 160, 0.08));
  --gradient-footer: linear-gradient(to bottom, #1a1208 0%, #181618 40%, #0e0e10 100%);
  --gradient-golden-wash: linear-gradient(180deg, rgba(232, 200, 120, 0.06) 0%, transparent 60%);
  --gradient-ocean-depth: linear-gradient(to bottom, #b0b8b8, #687878, #485858);
  --gradient-dusk: linear-gradient(to bottom, #9898a0 0%, #a8a098 50%, #c0a890 100%);

  /* ============================
     TYPOGRAPHY
     ============================ */
  --font-display: 'Your Display Font', serif;       /* Thin, gallery-weight */
  --font-body: 'Your Body Font', sans-serif;         /* Warm, readable, human */
  --font-mono: 'Your Mono Font', monospace;          /* Technical metadata */

  --weight-thin: 200;              /* Display headings, section titles */
  --weight-light: 300;             /* Artist name, large text */
  --weight-regular: 400;           /* Body text */
  --weight-medium: 500;            /* Emphasis, interactive labels */

  --size-hero-name: clamp(1rem, 2.5vw, 1.5rem);     /* NOT giant -- quietly placed */
  --size-section-title: clamp(1.5rem, 3vw, 2.5rem);
  --size-body: clamp(0.95rem, 1.1vw, 1.1rem);
  --size-caption: clamp(0.75rem, 0.85vw, 0.85rem);
  --size-meta: 0.7rem;

  --tracking-wide: 0.15em;          /* Section titles, the name */
  --tracking-normal: 0.02em;        /* Body text */
  --tracking-tight: -0.01em;        /* Dense data displays */

  --leading-tight: 1.25;            /* Stacked compressed elements */
  --leading-normal: 1.6;            /* Body text */
  --leading-loose: 1.9;             /* Spacious, gallery-style captions */

  /* ============================
     SPACING
     ============================ */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;
  --space-2xl: 8rem;
  --space-section: clamp(6rem, 15vh, 12rem);  /* Between major sections */
  --space-breath: clamp(3rem, 8vh, 6rem);     /* The inhale between content */

  /* ============================
     MOTION
     ============================ */
  --ease-surface: cubic-bezier(0.25, 0.1, 0.25, 1.0);   /* Default: water-like */
  --ease-reveal: cubic-bezier(0.16, 1, 0.3, 1);          /* Content surfacing */
  --ease-fade: cubic-bezier(0.4, 0, 0.2, 1);             /* Dissolves */

  --duration-instant: 150ms;       /* Micro-interactions */
  --duration-quick: 300ms;         /* Hover states */
  --duration-normal: 600ms;        /* State transitions */
  --duration-slow: 1200ms;         /* Content reveals, color shifts */
  --duration-cinematic: 2500ms;    /* The name reveal, major transitions */
  --duration-drift: 20s;           /* Background drift animation */
  --duration-breath: 8s;           /* Environmental breathing */
  --duration-sunset: 45s;          /* Imperceptible color temperature shift */

  /* ============================
     Z-INDEX SCALE
     ============================ */
  --z-background: -1;
  --z-base: 0;
  --z-content: 1;
  --z-overlay: 10;
  --z-nav: 100;
  --z-modal: 1000;
  --z-grain: 9999;    /* Film grain overlay is always on top */

  /* ============================
     LAYOUT
     ============================ */
  --content-max-width: 1200px;
  --content-narrow: 720px;
  --content-offset: 8vw;           /* Asymmetric left margin */
  --viewport-full: 100vh;
  --viewport-full-w: 100vw;

  /* ============================
     FILM & TEXTURE
     ============================ */
  --grain-opacity: 0.03;
  --analog-saturation: saturate(0.88);
  --analog-sepia: sepia(0.03);
  --analog-filter: var(--analog-saturation) var(--analog-sepia);
}
```

---

## 6. Typography Direction

Synthesized from all analyses and the VISUAL-LANGUAGE document's "Gallery Standard."

### Philosophy

Typography on this site is not decorative. It is architectural. The gallery model: one typeface, maybe two. Confidence lives in the negative space around the text, not the text itself. Every word on screen has earned its place.

### Font Selection Criteria

**Display / Headings:**
- A serif or semi-serif with a thin weight available (200-300)
- Must feel elevated without feeling decorative. Think gallery wall label, not wedding invitation.
- Wide letter-spacing capability. The words do not rush. They arrive.
- Candidates: A high-quality editorial serif with optical sizing. Something between Freight Display and Cormorant Garamond in spirit -- refined but with warmth. Not geometric sans-serif (too corporate). Not a script (too casual).

**Body Text:**
- Sans-serif with humanist proportions
- Regular weight (400) that reads as warm, not clinical
- Must maintain readability at `var(--size-body)` against dark backgrounds with `var(--text-primary)`
- The voice of someone telling you something that matters to them

**Monospace (metadata):**
- Used for technical data: BPM, key signature, duration, file format
- Clean, functional. The data IS the design in these moments. Not stylized -- honest.

### Type Behaviors by Context

| Context | Weight | Size | Tracking | Leading | Color | Behavior |
|---------|--------|------|----------|---------|-------|----------|
| Artist name (hero) | `--weight-light` (300) | `--size-hero-name` | `--tracking-wide` (0.15em) | N/A (single line) | `var(--text-primary)` | Appears slowly. Cinematic reveal. Radiation outward -- glow before letterforms. NOT a giant hero heading. Quietly placed. The eye finds it because it is the only warm thing. |
| Section titles | `--weight-thin` (200) | `--size-section-title` | `--tracking-wide` | `--leading-tight` | `var(--text-primary)` | Thin, wide-set, quiet authority. You notice them because everything else has stepped back. |
| Body text | `--weight-regular` (400) | `--size-body` | `--tracking-normal` | `--leading-normal` (1.6) | `var(--text-primary)` | Readable, warm, human. Not clinical. Comfortable line length (max `var(--content-narrow)`). |
| Store labels | `--weight-medium` (500) | `--size-caption` | `--tracking-normal` | `--leading-tight` | `var(--text-warm)` | Minimal. The product imagery does the talking. Text is a whisper next to the visual. |
| Metadata | `--weight-regular` | `--size-meta` | `--tracking-tight` | `--leading-tight` | `var(--text-secondary)` | Monospace. Technical. Displayed as primary visual content in appropriate contexts (not hidden as footnotes). |
| Links | `--weight-regular` | inherit | inherit | inherit | `var(--teal)` -> `var(--amber)` on hover | No underline by default. Color transition over `var(--duration-normal)`. The teal-to-amber shift = user touching the work. |
| Navigation | `--weight-light` | `--size-caption` | `--tracking-wide` | N/A | `var(--text-secondary)` -> `var(--text-primary)` on active | Navigation does not feel like a toolbar. It feels like a choice. Minimal labels. |

### Anti-Patterns

- NO bold weights above 500. This brand whispers. Lean in, do not shout.
- NO decorative type treatments (outlines, gradients on text, 3D effects).
- NO font sizes above `2.5rem` except for extreme editorial moments. The hero name is SMALL (see img06: the 2% focal point principle).
- NO tight line-height on body text. Let it breathe. `1.6` minimum.
- NO centered body text. Left-aligned or offset. Centered type is for gallery labels and section titles only.

---

## 7. Motion System

All animation and transition patterns consolidated into a unified timing/easing framework.

### Easing Functions

| Name | Value | Usage | Source Metaphor |
|------|-------|-------|----------------|
| `--ease-surface` | `cubic-bezier(0.25, 0.1, 0.25, 1.0)` | Default for all UI transitions. Hover states, color shifts, opacity changes. | Water surface responding to touch. Gentle, natural deceleration. |
| `--ease-reveal` | `cubic-bezier(0.16, 1, 0.3, 1)` | Content appearing on scroll. Elements surfacing. The name reveal. | Something rising from below water. Fast initial impulse, long gentle settle. |
| `--ease-fade` | `cubic-bezier(0.4, 0, 0.2, 1)` | Dissolve transitions between views. Opacity fades. The exit. | Clouds dissipating. Fog clearing. No abrupt start or end. |

### Duration Scale

| Token | Value | Context |
|-------|-------|---------|
| `--duration-instant` | `150ms` | Micro-feedback: active states, press indicators |
| `--duration-quick` | `300ms` | Hover states, button feedback, tooltip reveals |
| `--duration-normal` | `600ms` | Color temperature shifts, card state changes, filter transitions |
| `--duration-slow` | `1200ms` | Scroll-triggered content reveals, section color shifts, desaturation blooms |
| `--duration-cinematic` | `2500ms` | The name reveal. Major section transitions. The held moment. |
| `--duration-drift` | `20s` | Background texture drift (the ocean current) |
| `--duration-breath` | `8s` | Environmental pulse (wind through grass) |
| `--duration-sunset` | `45s` | Imperceptible color temperature cycle (warm -> cool -> warm) |

### Scroll-Triggered Behaviors

All scroll animations use `--ease-reveal`. Content does not pop in. It surfaces.

```css
/* Content surfacing pattern */
.reveal-element {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--duration-slow) var(--ease-reveal),
              transform var(--duration-slow) var(--ease-reveal);
}

.reveal-element.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Rules:**
- No slide-from-left/right. Content rises vertically (from water, from depth).
- No bounce. No overshoot. The deceleration is long and gentle.
- Stagger children by 80-120ms, not more. The reveal is a wave, not a sequence.
- Threshold: trigger at 15-20% visibility, not 50%. Things should begin appearing while still at the edge of perception.

### Hover/Interaction Behaviors

```css
/* Brightness as hierarchy */
.card {
  filter: brightness(0.7);
  transition: filter var(--duration-quick) var(--ease-surface);
}
.card:hover {
  filter: brightness(1.15);
}
.card-container:hover .card:not(:hover) {
  filter: brightness(0.5);
}

/* Color restoration (grey to warm) */
.archival-item {
  filter: grayscale(1);
  transition: filter var(--duration-slow) var(--ease-surface);
}
.archival-item:hover {
  filter: grayscale(0);
}

/* The teal-to-amber touch */
.interactive {
  color: var(--teal);
  transition: color var(--duration-normal) var(--ease-surface);
}
.interactive:hover {
  color: var(--amber);
}
```

### Ambient/Environmental Animations

These run continuously without user input. The site is alive.

```css
/* Background drift -- the ocean current */
@keyframes drift {
  from { background-position: 0 0; }
  to { background-position: -200px 0; }
}
.atmospheric-bg {
  animation: drift var(--duration-drift) linear infinite;
}

/* Wind-wave oscillation */
@keyframes breathe {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(4px) translateY(-2px); }
}
.environment-element {
  animation: breathe var(--duration-breath) ease-in-out infinite;
}

/* Imperceptible color temperature shift */
@keyframes sunset-cycle {
  0%, 100% { filter: sepia(0.02) hue-rotate(0deg); }
  50% { filter: sepia(0.05) hue-rotate(5deg); }
}
.ambient-section {
  animation: sunset-cycle var(--duration-sunset) ease-in-out infinite alternate;
}

/* Ripple interaction -- cursor as presence */
.ripple-surface {
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(200, 212, 232, 0.03) 0%,
    transparent 50%
  );
}
```

### Page/View Transitions

```css
/* Crossfade dissolve -- never cut, always dissolve */
.page-exit {
  animation: dissolve-out 800ms var(--ease-fade) forwards;
}
.page-enter {
  animation: dissolve-in 800ms var(--ease-fade) forwards;
}

@keyframes dissolve-out {
  from { opacity: 1; filter: blur(0); }
  to { opacity: 0; filter: blur(4px); }
}
@keyframes dissolve-in {
  from { opacity: 0; filter: blur(4px); }
  to { opacity: 1; filter: blur(0); }
}
```

### The Name Reveal (Landing Sequence)

The most choreographed animation on the site.

```css
/* Phase 1: Glow before form (0 - 1500ms) */
.hero-name {
  opacity: 0;
  text-shadow: 0 0 60px rgba(232, 224, 200, 0.4);
  animation: name-reveal var(--duration-cinematic) var(--ease-reveal) 3s forwards;
}

/* Phase 2: Letterforms resolve (1500ms - 2500ms) */
@keyframes name-reveal {
  0% {
    opacity: 0;
    text-shadow: 0 0 60px rgba(232, 224, 200, 0.4);
    letter-spacing: 0.3em;
  }
  40% {
    opacity: 0.2;
    text-shadow: 0 0 40px rgba(232, 224, 200, 0.3);
    letter-spacing: 0.2em;
  }
  100% {
    opacity: 1;
    text-shadow: 0 0 0 transparent;
    letter-spacing: var(--tracking-wide);
  }
}
```

### Motion Anti-Patterns

- NO parallax that feels like a tech demo. If parallax is used, it has slight lag -- the world responds at its own pace, like water.
- NO spring/bounce physics. This brand does not bounce. It settles.
- NO entrance animations from the sides. Content rises or materializes. It does not slide in like a presentation deck.
- NO animation on scroll-up. Reveals happen once, downward. The past does not replay.
- NO loading spinners. Use skeleton states that linger 300ms longer than necessary. The reaching is part of the beauty.
- `prefers-reduced-motion`: respect it. Fall back to simple opacity fades at `--duration-quick`.

---

## 8. The 10 Commandments

The top 10 non-negotiable design rules distilled from all 15 image analyses and 4 brand documents, ranked by confirmation density and philosophical centrality.

### I. Darkness Is the Canvas, Not the Absence

The site is 85% dark. The dark is not empty -- it is the vastness before dawn, the deep water, the concert hall after the lights drop. Content exists as luminous islands in a living dark. `var(--void)` is the most important color in the system.

*Confirmed by: img01, img03, img04, img06, img07, img08, img09, img10, img13, img15, VISUAL-LANGUAGE, EMOTIONAL-MAP*

### II. One Thing Glows. Everything Else Recedes.

Every viewport has a single focal point. One warm element, one bright element, one sharp element. Everything around it exists at reduced opacity, brightness, or saturation. The user always knows where to look because there is only one place to look. Hierarchy is not size -- it is light.

*Confirmed by: img01, img06, img07, img08, img09, img13, img14, img15, VISUAL-LANGUAGE ("Single focal points")*

### III. Warmth Is Earned, Not Given

The amber/gold palette (`var(--amber)`, `var(--copper)`) appears only at moments of transition, interaction, or emotional peak. It is the sunset -- rare, temporary, significant. A site drenched in warm tones is a site where warmth means nothing. Restraint creates meaning. The warm accent is the event.

*Confirmed by: img01, img03, img04, img09, img10, img11, BRAND-ESSENCE ("Accent: rare, earned, significant"), VISUAL-LANGUAGE*

### IV. The Site Breathes

Motion is not decoration. It is the environment being alive. Background textures drift at 20-second cycles. Subtle oscillations run at 8-second intervals. Color temperature shifts imperceptibly over 45 seconds. The user may never consciously notice, but they will feel it. A static site is a dead site. A site that moves too much is performing. This site breathes.

*Confirmed by: img06 (wind-wave), img07 (horizontal flow), img08 (ripple interaction), img09 (impermanence animation), VISUAL-LANGUAGE ("Cinematic Pacing")*

### V. Nothing Pops In. Everything Surfaces.

Content does not appear. It rises. The metaphor is: things emerging from below water, clouds parting, fog clearing. The information was always there -- you are just now able to see it. Use `--ease-reveal` with vertical `translateY` and `opacity`. No slides, no bounces, no instant cuts.

*Confirmed by: img07 (motion blur to resolution), img08 (vertical gradient as content), img09 (clouds parting), img13 (name reveal as radiation), VISUAL-LANGUAGE ("The Reveals"), SITE-ARCHITECTURE ("Atmosphere emerges")*

### VI. Teal Belongs to the Audience. Amber Belongs to the Artist.

Interactive elements -- buttons, links, active states, the play control -- are `var(--teal)`. The user's touch point. The work itself -- product names, album titles, the creative output -- glows in `var(--amber)`. When the user interacts with the work, the teal element shifts toward amber. The color transition IS the site's fundamental interaction story.

*Confirmed by: img03 (teal on audience clothing), img10 (teal confirmed as audience color), img07 (teal as immersive environment), img04 (amber as golden-hour creative warmth), EMOTIONAL-MAP*

### VII. The Score Lines Never Stop

Thin horizontal rules (`var(--divider)`) run through the site as a structural motif. Between track listings. Between tour dates. Between store items. They are the staff lines. The piano strings. The horizontal bands of the mechanism. This is the most consistent visual through-line: `border-bottom: var(--border-subtle)` on every list item, every stacked element, every repeating unit.

*Confirmed by: img04 (horizontal rhythm -- hammers, strings, keys), img15 (horizontal band stacking), img03 (horizontal stratification), img07 (horizontal flow), img08 (near-invisible dividers)*

### VIII. Imperfection Is Intentional

The site is not pixel-perfect. It has film grain (`opacity: 0.03`). It has elements 1-2 degrees off-axis. It has margins offset from center. It has the slight color warmth variance of real film. Budget 2-3 "imperfect" details per page -- a margin 3px off grid, an image at `rotate(-1deg)`, a color 5% warmer than its siblings. The site is handmade the way the scores are handmade.

*Confirmed by: img01 (diagonal energy, the "found" quality), img02 (polyphonic rotation), img14 (light leaks as thesis -- "the beauty is in the break"), img05 (grain as texture), BRAND-ESSENCE ("Authenticity over production")*

### IX. The Store Is the Warmest Room

The Store section shifts to `var(--warm-black)` as its background -- the only section that uses warm darkness instead of cool darkness. Products live in amber light. This is where the intangible becomes tangible. The temperature shift signals: this is where desire lives. The Coca-Cola moment. You feel the warmth and your hands know what it would feel like to hold the object.

*Confirmed by: img11 (deep amber as store color), img04 (golden hour as warmth state), img15 (products shown straight-on), BRAND-ESSENCE ("The Coca-Cola Principle"), EMOTIONAL-MAP ("Desire made tangible"), SITE-ARCHITECTURE ("Products as Art Objects")*

### X. The Exit Is a Fade, Not a Wall

The site does not end. It dissolves. The footer region is not a grid of links and a copyright notice. It is a gradient from warm-dark to cool-dark to void. Content becomes sparse. The ambient temperature cools. The last thing the user experiences is not information -- it is the feeling of something beautiful that has ended. The page exhales. `var(--gradient-footer)`.

*Confirmed by: img12 (fading sky -- "the silence after the last song"), img08 (still ocean -- "the silence between songs"), EMOTIONAL-MAP ("The Departure State: a sense of having been somewhere, not having browsed something")*

---

## Appendix A: Quick Reference -- Token-to-Section Map

| Section | `--bg` | `--text` | `--accent` | `--interactive` | Temperature |
|---------|--------|----------|------------|-----------------|-------------|
| Landing | `--void` | `--text-primary` @ 0.6 opacity initially | `--amber` (name only) | None on load | Cold -> void |
| Music | `--void` + teal wash | `--text-primary` | `--amber` on hover | `--teal` (play) | Cool -> warm on engage |
| About | `--void` + golden wash | `--text-primary` full | `--amber`, `--copper` | `--teal` | Warm |
| Store | `--warm-black` | `--text-warm` | `--amber` (dominant) | `--teal` (buy) | Warmest |
| Tour | `--void` + ambient warm glow | `--text-primary` | `--amber` (venues), `--teal` (tickets) | `--teal` | Cool/warm tension |
| Footer | `--gradient-footer` | `--text-muted` @ 0.4 | None | Minimal | Cooling to void |

## Appendix B: Quick Reference -- The Global Overlay Stack

Applied to `<body>` or the root layout element. These run at all times.

```css
/* 1. Film grain -- always present */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/textures/grain.svg');
  opacity: var(--grain-opacity);
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: var(--z-grain);
}

/* 2. Vignette -- always present */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: var(--vignette);
  pointer-events: none;
  z-index: var(--z-overlay);
}

/* 3. Analog color treatment -- on all images */
img {
  filter: var(--analog-filter);
}

/* 4. Ambient color shift -- imperceptible, continuous */
main {
  animation: sunset-cycle var(--duration-sunset) ease-in-out infinite alternate;
}
```

## Appendix C: Accessibility Notes

The atmospheric design system presents specific accessibility considerations that must be addressed without compromising the visual language:

1. **Contrast ratios:** `var(--text-primary)` (#c8d4e8) against `var(--void)` (#0a0a0a) achieves approximately 11.5:1 contrast ratio -- exceeds WCAG AAA. `var(--text-secondary)` (#90a0a0) against `var(--void)` achieves approximately 5.8:1 -- meets WCAG AA. `var(--text-muted)` (#5a5550) against `var(--void)` achieves approximately 2.8:1 -- use only for non-essential decorative text, never for actionable content.

2. **Reduced motion:** All ambient animations and scroll-triggered reveals must respect `prefers-reduced-motion: reduce`. Fall back to simple opacity transitions at `--duration-quick`.

3. **Focus indicators:** Use `outline: 2px solid var(--teal); outline-offset: 4px` for keyboard focus. The teal focus ring is visible against both dark and warm backgrounds.

4. **Interactive target sizes:** All clickable elements maintain 44x44px minimum touch targets despite the minimal visual footprint.

5. **The grain and texture overlays** must use `pointer-events: none` to avoid interfering with interaction.

---

*This document synthesizes: 15 image analyses (01-15), BRAND-ESSENCE.md, VISUAL-LANGUAGE.md, SITE-ARCHITECTURE.md, and EMOTIONAL-MAP.md. Every design decision traces back to at least one confirmed source. Build from this.*
