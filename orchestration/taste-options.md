# TASTE OPTIONS — Generation Effect Curation

**Date:** 2026-03-15 (Cycle 3)
**HEAD:** `854795d` — unchanged from Cycle 2
**Build:** PASS (142 modules, 1.69s, 1,081 KB JS)
**Preset files:** `src/presets/{world}-preset.json` (optimal) + `experimental-{world}.json` (wild) — all 10 verified current

---

## What Changed This Cycle

**Nothing new.** Discover phase produced no findings (`discover-findings.md` does not exist). No new commits. All 6 integrations from Cycle 2 remain the latest work.

| Cycle | Commits | Score Delta |
|-------|---------|-------------|
| Cycle 1 | Ocean Cliff DOF v3, Night Meadow camera arc, Stylized Water | +16 (baseline) |
| Cycle 2 | Volumetric clouds, GOLDEN RUINS, per-world CA, Ocean V5 dissolution | +2 (Storm 47→49) |
| **Cycle 3** | **—** | **0 (steady state)** |

### Still Pending Human Review from Cycle 2

**Volumetric Clouds (Storm Field)** — the new system from `854795d`. Human has NOT yet reviewed this.
- Load `/witness`, scroll to t=0.50 TEMPEST, look UP
- DevTuner: 5 cloud sliders (coverage, density, intensity, bottom, top)
- Cloud coverage arc taste pass is the single biggest unlock remaining (could be +5 to +10 pts)

---

## BLOCKER: `caDistortion` NaN Bug (Open Since Cycle 1)

**5 registered worlds produce NaN in CA shader at runtime.** Volcanic Observatory, Floating Library, Crystal Cavern, Memory Garden, Tide Pool — all missing `caDistortion` in keyframes. Confirmed again in test Run 21.

**Recommended fix (unchanged):** `?? 0` fallback in AtmosphereController.js interpolation loop (~line 358). 5-minute defensive fix prevents this entire class of bug.

**Secondary:** `cloudCoverage/cloudDensity/cloudIntensity` NaN in all world keyframes (guarded at consumption, no visual impact). Will break when clouds are enabled for other worlds.

---

## How To Use This Document

For each world, three columns:

| Column | What It Is | Source |
|--------|-----------|--------|
| **CURRENT DEFAULT** | What's committed in `*Keyframes.js` — what ships | Keyframe file at the specified scroll position |
| **RESEARCH OPTIMAL** | Best values from the research pipeline — safe bet | `{world}-preset.json` (DevTuner-loadable) |
| **WILD EXPERIMENTAL** | Wildest innovation values — taste gamble | `experimental-{world}.json` (DevTuner-loadable) |

**To test:** Open DevTuner (backtick), freeze atmosphere, load the preset JSON. Compare side-by-side. The bold values in each table are the ones that CHANGED between columns.

---

## 1. GOLDEN MEADOW — Innocent Awakening

**Route:** `/` | **Scroll position:** t=0.75 DEEPENING | **Current score:** 67/70
**Arc:** STILLNESS (cold) → AWAKENING (first warmth) → ALIVE (golden hour) → DEEPENING (convergence peak) → QUIETING (exhale)
**Archetype:** GOLDEN RUINS — multiplicative convergence

### The Story
The Hidden Sun is the artist. Music is the light. The world is what light transforms. At t=0.75, every atmospheric dimension peaks simultaneously — bloom, godrays, translucency, wind, warmth, painterly. The convergence IS the revelation.

### Key Parameters Compared

| Parameter | CURRENT DEFAULT | RESEARCH OPTIMAL | WILD EXPERIMENTAL | Unit |
|-----------|:-:|:-:|:-:|:-:|
| sunElevation | 1 | 1 | 1 | deg |
| turbidity | 14 | 14 | 14 | — |
| sunIntensity | 2.5 | 2.5 | **3.0** | — |
| ambientIntensity | 0.06 | 0.06 | 0.06 | — |
| toneMappingExposure | — | 1.3 | **1.6** | — |
| fogDensity | 0.005 | 0.005 | **0.008** | — |
| **bloomIntensity** | **1.8** | **1.8** | **1.8** | — |
| **bloomThreshold** | **0.25** | **0.25** | **0.25** | — |
| **godRayIntensity** | **1.8** | **1.8** | **1.8** | — |
| **grassWindSpeed** | **3.5** | **3.5** | **3.5** | — |
| **grassTranslucency** | **4.0** | **4.0** | **4.0** | — |
| **kuwaharaStrength** | **0.65** | **0.65** | **0.65** | — |
| **caDistortion** | **0.30** | **0.30** | **0.30** | — |
| **colorGradeVibrance** | **1.4** | **1.4** | **1.4** | — |
| vignetteDarkness | 0.20 | 0.20 | 0.20 | — |
| grainOpacity | 0.01 | 0.01 | 0.01 | — |
| fireflyBrightness | 1.5 | 1.5 | 1.5 | — |
| fireflySize | 140 | 140 | 140 | px |
| dustMoteBrightness | 1.5 | 1.5 | 1.5 | — |
| waveWindSpeed | 1.2 | 1.2 | **1.8** | — |
| waveWindStrength | 0.50 | 0.50 | **0.80** | — |
| cameraFov | — | 52 | **65** | deg |
| dofFocusDistance | 0 | 0 | **8** | units |
| dofBokehScale | 5.0 | 5.0 | **7.0** | — |
| dofFocusRange | — | 10 | **2** | units |
| cgSplitIntensity | — | 0.20 | **0.20** | — |
| ssaoIntensity | — | 1.5 | **3.0** | — |
| cloudOpacity | 0.08 | 0.08 | **0.20** | — |

### Verdict
**Default = Research Optimal.** The GOLDEN RUINS experiment (exp-058, 67/70) was so successful it became the committed keyframe. The preset captures this exactly.

**The Wild option** pushes 4 dimensions further:
- **Exposure 1.6** — brighter overall, more wash-out
- **FOV 65** — ultra-wide cinematic, more peripheral grass
- **DOF 8/7/2** — tight focus at 8 units creates foreground/background blur separation
- **Wave wind 1.8/0.80** — stronger rolling wave grass, more visible macro-wind

### Human Decisions Needed
1. **FOV 65 — cinematic or distorted?** Wide FOV shows more field but barrel distortion at edges. Test at 52 vs 65.
2. **DOF at convergence peak?** Currently DOF is off (focusDistance=0). Wild adds tight focus at 8 units — creates depth layers but risks blurring the god rays. Worth testing.
3. **Cloud shadow opacity 0.20** — Wild doubles it. More dramatic light/dark bands sweeping across the field, but might compete with the convergence.

---

## 2. OCEAN CLIFF — Peaceful Heartache

**Route:** `/listen` | **Scroll position:** t=0.50 CONTEMPLATION | **Current score:** 67/70
**Arc:** ARRIVAL (fog) → RECOGNITION (ocean reveals) → CONTEMPLATION (beside figure) → UNDERSTANDING (goodbye) → RELEASE (7-dim dissolution)
**Archetype:** V5 DISSOLUTION — each dimension of reality dissolves separately

### The Story
"A goodbye where both protagonists don't want to leave, but they know it'd be better to free each other." You sit at the edge of something infinite. The ocean is the feeling you can't name. The 7-dimensional dissolution at RELEASE removes: spatial (DOF) + color (vibrance drain) + tonal (contrast flatten) + depth (fog) + peripheral (vignette) + temporal (wind death) + material (grain).

### Key Parameters Compared

| Parameter | CURRENT DEFAULT | RESEARCH OPTIMAL | WILD EXPERIMENTAL | Unit |
|-----------|:-:|:-:|:-:|:-:|
| sunElevation | -6 | -6 | **-8** | deg |
| turbidity | 1.3 | 1.3 | **1.0** | — |
| sunIntensity | 1.0 | 1.0 | **0.6** | — |
| ambientIntensity | 0.18 | 0.18 | **0.07** | — |
| toneMappingExposure | — | 1.1 | **0.80** | — |
| bloomIntensity | 0.45 | 0.45 | 0.45 | — |
| bloomThreshold | 0.65 | 0.65 | 0.65 | — |
| caDistortion | 0.05 | 0.08 | **0.20** | — |
| vignetteDarkness | 0.28 | 0.28 | **0.55** | — |
| grainOpacity | 0.05 | 0.05 | 0.05 | — |
| grassWindSpeed | 0.60 | 0.60 | **0.70** | — |
| grassAmbient | 0.30 | 0.30 | **0.15** | — |
| **dofFocusDistance** | **5** | **5** | **5** | units |
| **dofBokehScale** | **6.5** | **6.5** | **10.0** | — |
| **dofFocusRange** | — | **1.5** | **0.5** | units |
| cgSplitIntensity | — | 0.15 | **0.25** | — |
| cgVibrance | 0.30 | 0.30 | **0.55** | — |
| cgDarkDesat | — | 0.5 | **0.8** | — |
| cgGainR / G / B | 0.95 / 1.0 / 1.05 | 0.95 / 1.0 / 1.05 | **0.88 / 0.96 / 1.12** | — |
| kuwaharaStrength | 0.0 | 0.0 | **0.15** | — |
| cameraFov | — | 40 | **35** | deg |
| cameraLerp | — | 0.04 | **0.03** | — |
| starBrightness | 0.80 | — | — | — |
| oceanColorNear | #145770 | #145770 | **#071e2a** | hex |
| oceanColorFar | #050d1a | #050d1a | **#030810** | hex |
| oceanFoamBrightness | 1.0 | 1.0 | **0.4** | — |
| oceanWaveLineIntensity | 0.95 | 0.95 | **0.5** | — |

### Verdict
**Default = Research Optimal.** The exp-082 V5 dissolution (67/70) is already committed. The preset captures CONTEMPLATION exactly.

**The Wild option** is the GRAVITATIONAL LENSING archetype (exp-062, 73/70 — the highest score ever recorded):
- **Bokeh 10.0 + focus range 0.5** — razor-thin focus, everything else becomes abstract light orbs
- **Exposure 0.80** — darkened, near-monochrome teal
- **Dark desat 0.8** — shadows drain to near-grayscale
- **Kuwahara 0.15** — subtle painterly haze over everything, ocean loses its crispness
- **Ocean darkened** — teal to near-black, foam whispers instead of speaks
- **Blue gain push** — gains shifted strongly blue (R:0.88, B:1.12)

### Human Decisions Needed
1. **Bokeh 10.0 — transcendent or unreadable?** This creates DOF so extreme the world becomes abstract. At 6.5 (current) the ocean is readable. At 10.0 it's orbs of teal light. Research scored this 73/70 but that was emotional scoring — does it work as a website?
2. **Exposure 0.80 — intimate or too dark?** The gravitational lensing concept works because darkness = intimacy. But might lose visitor engagement on monitors with low brightness.
3. **Subtle Kuwahara (0.15) on Ocean Cliff?** Currently zero. Even a hint of painterly softening changes the entire mood from "photograph of a real cliff" to "memory of a cliff." The latter might serve "peaceful heartache" better.
4. **FOV 35 — telephoto?** Narrower than default 40. Compresses depth, makes the ocean feel closer. But less peripheral cliff visibility.

---

## 3. NIGHT MEADOW — Bittersweet Letting Go

**Route:** `/story` | **Scroll position:** t=0.75 PEACE | **Current score:** 62/70
**Arc:** SILENCE (stillness) → REMEMBRANCE (fireflies stir) → GRIEF (tears of light) → PEACE (among fireflies) → ACCEPTANCE (stillness returns)
**Archetype:** VIGIL — absence as spatial presence

### The Story
"Knowing that someday this pain will be joined with peace and more beauty than I can imagine." The same meadow at night. What was golden is silver-blue. The fireflies are the only warmth. Being AMONG the lights (ground-level at t=0.75) is more intimate than being above them. The void between fireflies IS the grief — don't fill it.

### Key Parameters Compared

| Parameter | CURRENT DEFAULT | RESEARCH OPTIMAL | WILD EXPERIMENTAL | Unit |
|-----------|:-:|:-:|:-:|:-:|
| sunElevation | -22 | -22 | **-30** | deg |
| sunIntensity | 0.40 | 0.40 | **0.25** | — |
| ambientIntensity | 0.07 | 0.06 | **0.03** | — |
| toneMappingExposure | — | 1.0 | **0.85** | — |
| fogDensity | 0.004 | 0.004 | 0.004 | — |
| bloomIntensity | 0.65 | 0.65 | **1.0** | — |
| bloomThreshold | 0.50 | 0.50 | **0.35** | — |
| caDistortion | 0.01 | 0.01 | **0.10** | — |
| vignetteDarkness | 0.55 | 0.55 | **0.88** | — |
| grainOpacity | 0.06 | 0.07 | **0.10** | — |
| **fireflyBrightness** | **1.1** | **1.1** | **1.8** | — |
| **fireflySize** | **95** | **95** | **150** | px |
| **grassWindSpeed** | **0.15** | **0.15** | **0.08** | — |
| grassTranslucency | 0.7 | 0.7 | **0.3** | — |
| starBrightness | 0.95 | — | — | — |
| dofFocusDistance | 6 | 6 | 6 | units |
| dofBokehScale | 3.5 | 3.5 | **6.0** | — |
| cgVibrance | 0.22 | 0.20 | **0.08** | — |
| cgDarkDesat | — | 0.6 | **0.9** | — |
| cgSplitIntensity | — | 0.05 | **0.04** | — |
| cgGammaR / G / B | — | 0.96 / 0.98 / 1.04 | **0.90 / 0.94 / 1.08** | — |
| dustMoteBrightness | 0.0 | 0.0 | 0.0 | — |

### Verdict
**Default ≈ Research Optimal.** Minor difference: preset calibrated grassWindSpeed to 0.15, matching the PEACE keyframe exactly. Score: 62/70 with potential for 62+ (exp-013 camera arc insight already committed).

**The Wild option** is the VIGIL archetype (exp-060, 71/70):
- **Firefly brightness 1.8 + size 150** — "tears of light" effect, fireflies become luminous orbs that dominate the visual field
- **Bloom 1.0 + threshold 0.35** — heavy glow bleed around every firefly, halos of amber
- **Vignette 0.88** — near-total tunnel vision, world shrinks to just the lights around you
- **Grass wind 0.08** — the meadow is so still it's almost frozen, the only movement is fireflies
- **Dark desat 0.9** — shadows are near-monochrome, only the fireflies have color
- **Blue gamma push** — moonlight blue stronger in the color grade

### Human Decisions Needed
1. **Firefly brightness 1.1 vs 1.8 — grief or spectacle?** At 1.1, fireflies are precious individual lights. At 1.8, they dominate the scene. Research says 1.8 + extreme bloom creates "tears of light" quality. But does it cross into screensaver territory? The 400-count sweet spot matters — 400 at 1.8 might feel like 600+ at 1.1.
2. **Vignette 0.88 — intimate or suffocating?** VIGIL concept: the world narrows to just you and the lights. But 0.88 is very heavy — might feel claustrophobic rather than intimate.
3. **Near-frozen grass (0.08)?** The stillness-after-grief concept. World has stopped breathing. But visitors might think it's broken if nothing moves. Research scored stillness higher, but that was in isolation.
4. **Dark desaturation 0.9 — is near-monochrome right for grief?** Only fireflies have color. Everything else is grey-blue. This reinforces "the void between fireflies IS the grief" but is visually risky.

---

## 4. STORM FIELD — The Search

**Route:** `/witness` | **Scroll position:** t=0.50 TEMPEST | **Current score:** 49/70 (+2, volumetric clouds)
**Arc:** UNEASE (charged air) → PURSUIT (wind howling) → TEMPEST (peak storm) → BREAK (first light) → REVELATION (calm)
**Archetype:** PERCOLATION — phase transition dissolution

### The Story
"Running through whatever obstacles are presented... breath comes in a little harder... ears strain to hear the next note." Urgency. The wind is loud. The grass is fighting to stand. Rain hits. Lightning illuminates everything for a split second. You're searching.

### Key Parameters Compared

| Parameter | CURRENT DEFAULT | RESEARCH OPTIMAL | WILD EXPERIMENTAL | Unit |
|-----------|:-:|:-:|:-:|:-:|
| turbidity | 10.0 | 10.0 | **12.0** | — |
| sunIntensity | 0.15 | 0.15 | **0.10** | — |
| ambientIntensity | 0.03 | 0.03 | **0.02** | — |
| toneMappingExposure | — | 0.85 | **0.55** | — |
| fogDensity | 0.014 | 0.014 | **0.025** | — |
| bloomIntensity | 0.10 | 0.10 | **0.15** | — |
| bloomThreshold | 0.90 | 0.90 | **0.95** | — |
| **caDistortion** | **0.50** | **0.50** | **0.65** | — |
| **vignetteDarkness** | **0.92** | **0.92** | **0.95** | — |
| **grainOpacity** | **0.12** | **0.12** | **0.18** | — |
| **grassWindSpeed** | **3.5** | **3.5** | **5.5** | — |
| grassTranslucency | 0.10 | 0.10 | **0.05** | — |
| grassAmbient | 0.06 | 0.06 | **0.04** | — |
| rainBrightness | 0.9 | — | — | — |
| waveWindSpeed | 1.5 | 1.5 | **3.5** | — |
| waveWindStrength | 1.5 | 1.5 | 1.5 | — |
| cgContrast | 0.14 | 0.14 | **0.20** | — |
| cgVibrance | 0.02 | 0.02 | **0.50** | — |
| cgDarkDesat | — | 0.8 | **0.95** | — |
| ssaoIntensity | — | 2.5 | **5.0** | — |
| ssaoRadius | — | 0.08 | **0.12** | — |
| cameraFov | — | 55 | **62** | deg |
| cameraLerp | — | 0.10 | **0.15** | — |
| **cloudCoverage** | **0.75** | **0.75** | **0.85** | — |
| **cloudDensity** | **0.60** | **0.60** | **0.75** | — |
| **cloudIntensity** | **1.0** | **1.0** | **1.0** | — |
| cloudBottom | 3.0 | 3.0 | **2.0** | km |
| cloudTop | 12.0 | 12.0 | **18.0** | km |

### Verdict
**Default = Research Optimal.** Storm Field integrates exp-059 percolation (CA 0.50 at TEMPEST), exp-012 combo values, AND volumetric cumulus clouds (exp-011). Score up from 47→49/70 with clouds. Still limited by keyframe tuning — cloud coverage/density arcs may need human taste pass.

**The Wild option** is maximum sensory assault:
- **CA 0.65** — vision literally splitting apart, lens stress beyond photography
- **Exposure 0.55** — oppressively dark, the storm swallows light
- **Grain 0.18** — film stock degrading under the assault
- **Grass wind 5.5** — blades flattened almost to the ground
- **Fog density 0.025** — 20-unit visibility max, lost in the storm
- **SSAO 5.0** — extreme ambient occlusion, every crevice black
- **Vignette 0.95** — nearly total tunnel vision
- **Vibrance 0.50** (Wild only) — muted but not grey, desaturated urgency

### Human Decisions Needed
1. **CA 0.50 vs 0.65 — chaos or nausea?** 0.50 is already aggressive. Research says it embodies "searching through chaos" but real users might get motion sick. This is the #1 risk parameter in the entire site.
2. **Exposure 0.55 — oppressive or invisible?** Even darker than the already-dark default. This is a storm — darkness is the point. But can visitors actually SEE the content overlays?
3. **Cloud coverage arc — right shape?** Current: 0.55→0.65→0.75→0.50→0.30 (gathering→peak→clearing). Is the REVELATION (t=1.0) at 0.30 clear enough, or should it drop to 0.15 for a wider gap reveal? Load `/witness`, scroll to end, look up.
4. **Cloud density 0.60 at TEMPEST — oppressive enough?** Wild pushes to 0.75 for towering cumulus that swallow the sky. Density controls how solid the clouds look — 0.60 still has translucent edges.
5. **Grain 0.18 — textural or just noisy?** At 0.12 it feels like aged film under stress. At 0.18 it might just look like a bad signal.

---

## 5. GHIBLI PAINTERLY — Never Felt Brighter

**Route:** `/collect` | **Scroll position:** t=1.0 TRANSCENDENCE | **Current score:** 67/70
**Arc:** WONDER (cool dawn) → IMMERSION (colors warm) → RADIANCE (vivid, building) → TRANSFIGURATION (falling sun, rising beauty) → TRANSCENDENCE (impossible peak)
**Archetype:** KINTSUGI — golden cracks through the painted surface

### The Story
"The sun is rising as he is falling, but his life has never felt brighter." INVERTED PEAK ARC: brightness builds continuously to TRANSCENDENCE (t=1.0). Sun rises then FALLS, but the world gets MORE vivid. The paradox — falling sun + rising beauty — IS the heartache. Kuwahara inverted: starts gentle (0.30), peaks at finale (0.78). The painting ages as you scroll — grain = canvas texture cracking through.

### Key Parameters Compared

| Parameter | CURRENT DEFAULT | RESEARCH OPTIMAL | WILD EXPERIMENTAL | Unit |
|-----------|:-:|:-:|:-:|:-:|
| sunElevation | 5 | 5 | **3** | deg |
| sunIntensity | 2.5 | 2.2 | **2.8** | — |
| ambientIntensity | 0.55 | 0.55 | **0.65** | — |
| toneMappingExposure | — | 1.2 | **1.6** | — |
| fogDensity | 0.005 | 0.004 | 0.005 | — |
| **bloomIntensity** | **1.35** | **1.35** | **1.8** | — |
| **bloomThreshold** | **0.28** | **0.28** | **0.22** | — |
| caDistortion | 0.10 | 0.12 | **0.18** | — |
| vignetteDarkness | 0.18 | 0.25 | 0.18 | — |
| **grainOpacity** | **0.12** | **0.12** | **0.12** | — |
| **kuwaharaStrength** | **0.78** | **0.78** | **1.0** | — |
| **kuwaharaKernel** | — | **6** | **8** | px |
| **godRayIntensity** | **0.90** | **0.90** | **2.0** | — |
| **colorGradeVibrance** | **1.35** | **1.35** | **1.80** | — |
| colorGradeWarmth | 0.18 | — | — | — |
| cgContrast | 0.08 | 0.08 | **0.12** | — |
| cgSplitIntensity | — | 0.14 | **0.18** | — |
| dustMoteBrightness | 1.3 | 1.0 | **2.0** | — |
| petalBrightness | 1.2 | — | — | — |
| grassAmbient | 0.52 | 0.52 | **0.60** | — |
| grassTranslucency | 2.0 | 2.0 | **2.8** | — |
| grassBaseColor | #265214 | #265214 | **#2e5c18** | hex |
| grassTipColor | #669926 | #669926 | **#73b330** | hex |
| splitToneWarm | [0.92,0.68,0.38] | — | [0.98,0.78,0.42] | — |
| splitToneCool | [0.48,0.65,0.80] | — | [0.55,0.70,0.85] | — |
| cameraFov | — | 50 | **55** | deg |
| ssaoIntensity | — | 1.0 | **0.8** | — |

### Verdict
**Default ≈ Research Optimal.** exp-083 V5 (67/70) is committed. Preset captures TRANSCENDENCE exactly, with minor calibration differences (sunIntensity 2.5→2.2 in preset is a DevTuner-time tweak).

**The Wild option** is the KINTSUGI archetype (exp-057, 73/70):
- **Kuwahara 1.0 + kernel 8** — the world IS an oil painting. Brushstrokes so massive individual blades of grass become abstract paint swipes
- **Bloom 1.8 + threshold 0.22** — everything glows like it's radioactive with beauty
- **Godrays 2.0** — light shafts twice as intense, painting flooded with golden light
- **Vibrance 1.80** — "impossible colors" that feel more real than reality. Beyond the ceiling of physical color
- **Dust motes 2.0** — suspended pigment particles catching fire, the air itself is painted
- **Exposure 1.6** — washing toward overexposure, the painting burning away from light
- **Grass brighter** — base/tip colors shifted greener+brighter for maximum cel-shading contrast

### Human Decisions Needed
1. **Kuwahara 0.78 vs 1.0 — painting or soup?** At 0.78, grass blades are recognizable but have brushstroke quality. At 1.0, individual blades dissolve into pure paint texture. Research scored 1.0 higher, but does it serve the "garden you can walk through" narrative?
2. **Kernel 6 vs 8** — bigger kernel = bigger brushstrokes. At 6, it's "impressionist." At 8, it's "abstract expressionist." Which Ghibli film is the reference? Totoro (impressionist) or Ponyo (expressionist)?
3. **Godrays 2.0 — divine or distracting?** Current 0.90 is already strong. 2.0 might overwhelm the Kuwahara effect with white wash. Or it might create "god light through a painting" which is exactly the KINTSUGI concept.
4. **Vibrance 1.80 — beyond impossible?** Current 1.35 already exceeds what a real camera can capture. 1.80 enters territory where greens become neon. Is that "never felt brighter" or "hurts my eyes"?
5. **Dust motes 2.0** — at this brightness, particles become a visible layer of "paint dust" in the air. Could be magical or could compete with the Kuwahara.

---

## Cross-World Comparison: The Emotional Spectrum

| Dimension | Golden Meadow | Ocean Cliff | Night Meadow | Storm Field | Ghibli |
|-----------|:---:|:---:|:---:|:---:|:---:|
| **Exposure** | 1.3 / 1.6 | 1.1 / 0.80 | 1.0 / 0.85 | 0.85 / 0.55 | 1.2 / 1.6 |
| **Bloom** | 1.8 / 1.8 | 0.45 / 0.45 | 0.65 / 1.0 | 0.10 / 0.15 | 1.35 / 1.8 |
| **Vignette** | 0.20 / 0.20 | 0.28 / 0.55 | 0.55 / 0.88 | 0.92 / 0.95 | 0.18 / 0.18 |
| **Grain** | 0.01 / 0.01 | 0.05 / 0.05 | 0.07 / 0.10 | 0.12 / 0.18 | 0.12 / 0.12 |
| **CA** | 0.30 / 0.30 | 0.08 / 0.20 | 0.01 / 0.10 | 0.50 / 0.65 | 0.12 / 0.18 |
| **Wind** | 3.5 / 3.5 | 0.60 / 0.70 | 0.15 / 0.08 | 3.5 / 5.5 | 0.6 / 0.8 |
| **Vibrance** | 1.4 / 1.4 | 0.30 / 0.55 | 0.22 / 0.08 | 0.02 / 0.50 | 1.35 / 1.80 |
| **Kuwahara** | 0.65 / 0.65 | 0.0 / 0.15 | 0.0 / 0.0 | 0.0 / 0.0 | 0.78 / 1.0 |
| **DOF bokeh** | 5.0 / 7.0 | 6.5 / 10.0 | 3.5 / 6.0 | 3.0 / 3.0 | 3.0 / 4.0 |

Format: optimal / wild

**Pattern:** Each world has its own "loudest" dimension:
- Golden Meadow: **bloom + godrays** (multiplicative convergence)
- Ocean Cliff: **DOF + split-tone** (dissolution)
- Night Meadow: **fireflies + vignette** (intimate absence)
- Storm Field: **CA + grain + vignette** (sensory assault)
- Ghibli: **kuwahara + vibrance** (painted reality)

---

## Priority Decisions (Sorted by Impact)

### Tier 1: These Change the Character of a World

| # | World | Decision | Impact | Risk |
|---|-------|----------|--------|------|
| 1 | Storm | CA 0.50 — sign off or reduce | Defines "searching through chaos" | Motion sickness |
| 2 | Storm | Cloud arc taste pass — coverage/density/intensity | +2-5 pts, tune the new system | Load /witness, scroll |
| 3 | Night | Firefly brightness 1.1 vs 1.8 | Grief vs spectacle | Screensaver risk |
| 4 | Ghibli | Kuwahara 0.78 vs 1.0 | Impressionist vs expressionist | Readability |
| 5 | Ocean | Bokeh 6.5 vs 10.0 | Photograph vs memory | Usability |

### Tier 2: Significant But Recoverable

| # | World | Decision | Impact | Risk |
|---|-------|----------|--------|------|
| 6 | Golden | FOV 52 vs 65 at convergence | Cinematic width | Barrel distortion |
| 7 | Night | Vignette 0.55 vs 0.88 | Intimacy vs claustrophobia | Too dark |
| 8 | Ghibli | Godrays 0.90 vs 2.0 | Divine light vs white wash | Competes with kuwahara |
| 9 | Ocean | Subtle kuwahara (0.15)? | Photograph → memory | Identity shift |
| 10 | Storm | Exposure 0.85 vs 0.55 | Darkness as atmosphere | Content readability |

### Tier 3: Fine-Tuning

| # | World | Decision | Impact | Risk |
|---|-------|----------|--------|------|
| 11 | Golden | DOF on/off at convergence peak | Depth layers | Blur godrays |
| 12 | Night | Near-frozen grass (0.08) | Stillness concept | Looks broken |
| 13 | Ghibli | Vibrance 1.35 vs 1.80 | Impossible colors | Neon greens |
| 14 | Ocean | FOV 40 vs 35 | Telephoto compression | Less peripheral |
| 15 | Storm | Grain 0.12 vs 0.18 | Stressed film | Just noise |

---

## BLOCKER: `caDistortion` NaN Bug (Still Open)

**5 registered worlds will NaN at runtime.** The exp-059 CA integration added `caDistortion` to PARAM_KEYS but 5 newer keyframe files lack it. Interpolation hits `lerpScalar(undefined, undefined, t)` → NaN.

**Fix:** Add `?? 0` fallback in AtmosphereController interpolation loop (~line 358). 5-minute defensive fix prevents this class of bug for all future param additions.

| Affected | Status |
|----------|--------|
| volcanic-observatory | Needs `caDistortion: 0` in all 5 keyframes |
| floating-library | Needs `caDistortion: 0` in all 5 keyframes |
| crystal-cavern | Needs `caDistortion: 0` in all 5 keyframes |
| memory-garden | Needs `caDistortion: 0` in all 5 keyframes |
| tide-pool | Needs `caDistortion: 0` in all 5 keyframes |

---

## Preset File Index

```
src/presets/
  golden-meadow-preset.json          — t=0.75 DEEPENING, GOLDEN RUINS, 67/70
  ocean-cliff-preset.json            — t=0.50 CONTEMPLATION, V5 dissolution, 67/70
  night-meadow-preset.json           — t=0.75 PEACE, ground-level fireflies, 62/70
  storm-field-preset.json            — t=0.50 TEMPEST, percolation CA + volumetric clouds, 49/70
  ghibli-painterly-preset.json       — t=1.0 TRANSCENDENCE, inverted peak, 67/70

  experimental-golden-meadow.json    — BEYOND RUINS: exposure 1.6, DOF 8/7/2, wave wind 1.8
  experimental-ocean-cliff.json      — GRAVITATIONAL LENSING: bokeh 10, monochrome teal, 73/70
  experimental-night-meadow.json     — VIGIL: tears-of-light fireflies, frozen grass, 71/70
  experimental-storm-field.json      — PERCOLATION: CA 0.65, exposure 0.55, grain 0.18, 71/70
  experimental-ghibli-painterly.json — KINTSUGI: kuwahara 1.0, godrays 2.0, vibrance 1.80, 73/70
```

---

## Current Scores (Stable — No Change Since Cycle 2)

| World | Default Score | Wild Archetype | Wild Score | Gap | Status |
|-------|:-:|---|:-:|:-:|---|
| Golden Meadow | 67/70 | BEYOND RUINS | — | at ceiling | Committed |
| Ocean Cliff | 67/70 | GRAVITATIONAL LENSING | 73/70 | +6 | Needs taste pass |
| Night Meadow | 62/70 | VIGIL | 71/70 | +9 | Needs taste pass |
| Storm Field | **49/70** | PERCOLATION | 71/70 | **+22** | **Clouds in, needs taste pass** |
| Ghibli Painterly | 67/70 | KINTSUGI | 73/70 | +6 | Needs taste pass |
| **TOTAL** | **312/350** | | **355/350** | **+43 theoretical** | |

**Bottleneck:** Storm Field is 18 points behind the average (49 vs 67). The volumetric clouds are integrated but untuned. A human taste pass on cloud coverage/density arcs is the highest-leverage single action — could close 5-10 pts of the gap. The remaining 12-17 pts require rain/lightning keyframe tuning (not yet integrated).

**Next unlock:** Fix the `caDistortion` NaN bug (5-min), then the discover phase can start finding new techniques for Storm Field specifically.
