# Unified Scroll Arc — One Continuous Experience

## What This Is
Design spec for transforming 17 discrete environment worlds into ONE continuous scroll-driven experience where atmosphere, terrain, and emotional temperature transform as you scroll deeper.

## Why This Matters
The original emotional atlas insight: "It's ONE song. The visual shifts are scenes WITHIN that song, expressed through atmosphere." The 17 worlds contain excellent subsystems but are currently isolated configs with route-based teleportation. The unified arc creates a journey, not a menu.

## Acceptance Criteria
- [ ] AC1: A documented scroll arc design defines the emotional sequence (which territories, in what order, at what scroll positions)
- [ ] AC2: The arc has defined "money moments" — singular peak visual experiences at 3-5 key scroll positions
- [ ] AC3: Transitions between emotional territories are atmospheric (fog, color grade, lighting) not hard-cuts
- [ ] AC4: Camera path is one continuous spline through all territories (not reset per world)
- [ ] AC5: Content sections surface at designed emotional peaks (not arbitrary positions)
- [ ] AC6: The arc serves ALL 4 audience JTBDs — feel-the-music, assess-range, share-deep-link, discover-artist

## Specification
### Emotional Sequence Design (Human-Taste)
The order of emotional territories must follow musical logic:
- Opening: cold, vast, anticipatory (stillness before first note)
- Rise: warmth arrives, life emerges (innocent awakening)
- Peak: golden hour, full bloom, climax (alive, radiant)
- Turn: introspection, deepening, darkness returns (bittersweet)
- Resolution: quiet acceptance, drift, fade (the exhale)

### Technical Architecture
1. Single config with `segments` array (from config-normalization spec)
2. AtmosphereController already supports 5 keyframes — extend to N keyframes with configurable t-positions
3. Subsystems lazy-loaded as scroll reaches their segment (from bundle-splitting spec)
4. Camera spline becomes one long path with emotional waypoints
5. Terrain morphs between types using transition zones (cross-fade height functions)

### Subsystem Selection for Unified Experience
Top 10 keepers (from scout): VolumetricCloudSystem (5/5), AuroraCurtain (4/5), KuwaharaEffect (4/5), GodRayPass (5/5), JellyfishSystem (3/5), LavaLake (2/5), GearTree (2/5), CrystalFormation (3/5), AnemoneSystem (3/5), MarineSnow (5/5).

Universal subsystems: VolumetricCloudSystem, GodRayPass, MarineSnow (work everywhere).
Territory-specific: Jellyfish (deep section), Lava (volcanic section), Aurora (cold section), Kuwahara (painterly section).

## Ralphable vs Human-Taste
- AC1-2, AC5: **Human-Taste** (emotional sequence, money moments, content placement are creative decisions)
- AC3-4, AC6: **Partially Ralphable** (technical implementation of transitions and spline is mechanical once design is decided)

## Dependencies
- Requires config-normalization (segment addressing)
- Requires bundle-splitting (lazy subsystem loading)
- Requires dispose-lifecycle (clean world transitions)
- AUDIENCE_JTBD.md defines the serving criteria

## Verification
- AC1: Document exists with scroll position → emotional territory mapping
- AC2: Document defines ≥3 money moments with scroll t-values and visual descriptions
- AC3: No hard-cuts visible during scroll (visual verification)
- AC4: Camera position is continuous (no teleportation) verified via console log
- AC5: Content opacity peaks align with documented money moments
- AC6: Each JTBD has a stated solution path in the design doc
