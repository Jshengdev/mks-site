# Config Normalization

## What This Is
Unified config schema for scroll segments replacing 17 discrete world configs, preparing for the Big Pivot to one continuous experience.

## Why This Matters
The 17 separate environment configs contain massive duplication in structure (54+ atmosphere params, identical field names, similar terrain configs). Normalizing them into a single schema with scroll-segment addressing enables the unified experience AND reduces maintenance burden.

## Acceptance Criteria
- [ ] AC1: A documented config schema exists in `src/environments/config-schema.js` defining all valid fields, types, defaults, and constraints
- [ ] AC2: All 17 existing configs validate against the schema without errors
- [ ] AC3: Schema supports scroll-segment addressing (a config can define multiple segments with t-ranges, not just a single world)
- [ ] AC4: WorldEngine can consume both legacy single-world configs AND new segment-based configs (backward compatible)
- [ ] AC5: A validation function `validateConfig(config)` returns errors/warnings for invalid or deprecated fields
- [ ] AC6: Terrain type registry maps string keys to height functions (extensible without modifying TerrainPlane.js switch statement)

## Specification
Current: Each world is a flat object in src/environments/<world>.js with ~100+ fields. No validation. Missing fields silently fall through to defaults scattered across WorldEngine, AtmosphereController, and subsystems.

Target:
1. **Config Schema** — JSON-schema-like definition listing every field, its type, default value, and which subsystem consumes it. Grouped by: terrain, sky, lighting, grass, fog, particles, postFX, camera, audio, ocean, special-subsystems.
2. **Segment Addressing** — New optional `segments` array where each entry defines a t-range and its own atmosphere keyframes + subsystem enables. For the unified scroll, one config would have multiple segments.
3. **Validation** — Runtime validation at WorldEngine construction. Warns on unknown fields, errors on wrong types. Dev-only (stripped in production build).
4. **Terrain Registry** — Map of string → height function. TerrainPlane.js reads from registry instead of switch. New terrain types can be registered without touching TerrainPlane.

## Ralphable vs Human-Taste
- AC1-2, AC5-6: **Ralphable** (mechanical schema extraction from existing configs)
- AC3-4: **Human-Taste** (segment addressing design requires creative direction on how the unified scroll should work)

## Dependencies
- Depends on understanding all 17 configs (done in scout)
- Should precede unified-scroll-arc spec (which designs the segment layout)
- Independent of bundle-splitting (can run in parallel)

## Verification
- AC1: `test -f src/environments/config-schema.js`
- AC2: `node -e "const {validateConfig}=require('./src/environments/config-schema.js'); const configs=require('./src/environments/index.js'); Object.values(configs.ENVIRONMENTS).forEach(c => { const r=validateConfig(c); if(r.errors.length) { console.error(c.id, r.errors); process.exit(1); } })"`
- AC3: Schema file contains 'segments' field definition
- AC4: Build passes with existing configs unchanged
- AC5: validateConfig returns errors for `{terrain: {type: 999}}` and warnings for `{unknownField: true}`
- AC6: `grep 'terrainRegistry\|HEIGHT_FN_MAP\|registerTerrain' src/meadow/TerrainPlane.js`
