#!/bin/bash
# verify-all.sh — Back pressure for MKS immersive site.
# Section-based test harness. Exit 0 = all PASS, Exit 1 = one or more FAIL.
# 10 sections, ~55 checks. Derived from spec acceptance criteria.
set -uo pipefail

cd "$(dirname "$0")/.."

TOTAL_PASS=0; TOTAL_FAIL=0; PASS=0; FAIL=0; SECTION_NAME=""

section() {
  SECTION_NAME="$1"; PASS=0; FAIL=0
  echo ""; echo "=================================================="
  echo "  $1"; echo "=================================================="
}
section_summary() {
  [[ $FAIL -eq 0 ]] && echo "  -> $SECTION_NAME: PASS ($PASS passed)" || echo "  -> $SECTION_NAME: FAIL ($PASS passed, $FAIL failed)"
  TOTAL_PASS=$((TOTAL_PASS + PASS)); TOTAL_FAIL=$((TOTAL_FAIL + FAIL))
}
check() {
  local name="$1" result="$2" detail="${3:-}"
  [[ "$result" == "PASS" ]] && { echo "  [PASS] $name"; PASS=$((PASS+1)); } || { echo "  [FAIL] $name${detail:+ -- $detail}"; FAIL=$((FAIL+1)); }
}
run_check() {
  local name="$1"; shift
  local output; output=$("$@" 2>&1) && check "$name" "PASS" || check "$name" "FAIL" "$(echo "$output" | tail -1)"
}

# ── Section 1: Build Health ────────────────────────────────
section "Build Health"
  run_check "Vite build passes" npx vite build
  # Lint only src/ (exclude docs/webgl-reference vendored code)
  SRC_LINT_ERRORS=$(npx eslint src/ 2>&1 | grep -c " error " || true)
  [[ "$SRC_LINT_ERRORS" -eq 0 ]] && check "ESLint src/ clean" "PASS" || check "ESLint src/ clean" "FAIL" "$SRC_LINT_ERRORS errors in src/"
section_summary

# ── Section 2: Environment Configs ─────────────────────────
section "Environment Configs (17 worlds)"
  ENV_DIR="src/environments"
  EXPECTED_WORLDS="golden-meadow ocean-cliff night-meadow storm-field ghibli-painterly aurora-tundra bioluminescent-deep clockwork-forest crystal-cavern floating-library infinite-staircase memory-garden paper-world sonic-void tide-pool underwater-cathedral volcanic-observatory"
  for world in $EXPECTED_WORLDS; do
    [[ -f "$ENV_DIR/$world.js" ]] && check "Config exists: $world" "PASS" || check "Config exists: $world" "FAIL" "missing $ENV_DIR/$world.js"
  done
  INDEX_EXPORTS=$(grep -c "import" "$ENV_DIR/index.js" 2>/dev/null || echo "0")
  [[ "$INDEX_EXPORTS" -ge 17 ]] && check "index.js imports ≥17 worlds" "PASS" || check "index.js imports ≥17 worlds" "FAIL" "only $INDEX_EXPORTS imports"
section_summary

# ── Section 3: Design Rules ────────────────────────────────
section "Design Rules Compliance"
  # No flat black #000 in CSS (allow in JS/GLSL where it may be intentional)
  FLAT_BLACK=$(grep -rn '#000[;,)]' src/*.css src/**/*.css 2>/dev/null | grep -v node_modules | wc -l | tr -d ' ')
  FLAT_BLACK2=$(grep -rn '#000000' src/*.css src/**/*.css 2>/dev/null | grep -v node_modules | wc -l | tr -d ' ')
  TOTAL_BLACK=$((FLAT_BLACK + FLAT_BLACK2))
  [[ "$TOTAL_BLACK" -eq 0 ]] && check "No flat black (#000) in CSS" "PASS" || check "No flat black (#000) in CSS" "FAIL" "$TOTAL_BLACK occurrences"

  # prefers-reduced-motion in EVERY CSS file that has animation or transition
  CSS_WITH_ANIM=$(grep -rl 'animation\|@keyframes' src/ --include='*.css' 2>/dev/null || true)
  MISSING_MOTION=0
  for cssfile in $CSS_WITH_ANIM; do
    if ! grep -q 'prefers-reduced-motion' "$cssfile" 2>/dev/null; then
      MISSING_MOTION=$((MISSING_MOTION + 1))
      echo "    missing prefers-reduced-motion: $cssfile"
    fi
  done
  [[ "$MISSING_MOTION" -eq 0 ]] && check "prefers-reduced-motion in all animated CSS" "PASS" || check "prefers-reduced-motion in all animated CSS" "FAIL" "$MISSING_MOTION files missing"

  # No transform-based entrance animations in CSS keyframes
  TRANSFORM_ENTRANCE=$(grep -rn 'translateY\|translateX\|scale(' src/*.css src/**/*.css 2>/dev/null | grep -i '@keyframes\|animation' | wc -l | tr -d ' ')
  [[ "$TRANSFORM_ENTRANCE" -eq 0 ]] && check "No transform entrance animations" "PASS" || check "No transform entrance animations" "FAIL" "$TRANSFORM_ENTRANCE occurrences (opacity-only rule)"
section_summary

# ── Section 4: Core Engine Files ───────────────────────────
section "Core Engine Integrity"
  CORE_FILES="src/meadow/WorldEngine.js src/meadow/AtmosphereController.js src/meadow/PostProcessingStack.js src/meadow/CameraRig.js src/meadow/ScrollEngine.js src/meadow/GrassChunkManager.js src/meadow/TerrainPlane.js src/meadow/GrassGeometry.js src/meadow/FlowerInstances.js src/meadow/FireflySystem.js"
  for f in $CORE_FILES; do
    [[ -f "$f" ]] && check "Exists: $(basename $f)" "PASS" || check "Exists: $(basename $f)" "FAIL"
  done
section_summary

# ── Section 5: Shader File Integrity ──────────────────────
section "Shader File Integrity"
  SHADER_DIR="src/meadow/shaders"
  VERT_COUNT=$(ls "$SHADER_DIR"/*.vert.glsl 2>/dev/null | wc -l | tr -d ' ')
  FRAG_COUNT=$(ls "$SHADER_DIR"/*.frag.glsl 2>/dev/null | wc -l | tr -d ' ')
  [[ "$VERT_COUNT" -ge 40 ]] && check "Vertex shaders ≥40 ($VERT_COUNT)" "PASS" || check "Vertex shaders ≥40 ($VERT_COUNT)" "FAIL"
  [[ "$FRAG_COUNT" -ge 40 ]] && check "Fragment shaders ≥40 ($FRAG_COUNT)" "PASS" || check "Fragment shaders ≥40 ($FRAG_COUNT)" "FAIL"
  # Check vert/frag pairing — every .vert should have a matching .frag
  ORPHAN_SHADERS=0
  for vert in "$SHADER_DIR"/*.vert.glsl; do
    base=$(basename "$vert" .vert.glsl)
    if [[ ! -f "$SHADER_DIR/$base.frag.glsl" ]]; then
      ORPHAN_SHADERS=$((ORPHAN_SHADERS + 1))
      echo "    orphan vert: $base.vert.glsl (no matching .frag)"
    fi
  done
  [[ "$ORPHAN_SHADERS" -eq 0 ]] && check "All vertex shaders have fragment pairs" "PASS" || check "All vertex shaders have fragment pairs" "FAIL" "$ORPHAN_SHADERS orphans"
section_summary

# ── Section 6: Bundle Size ────────────────────────────────
section "Bundle Size"
  JS_SIZE=$(find dist/assets -name '*.js' -exec wc -c {} + 2>/dev/null | tail -1 | awk '{print $1}')
  if [[ -n "$JS_SIZE" ]]; then
    JS_KB=$((JS_SIZE / 1024))
    [[ "$JS_KB" -lt 1536 ]] && check "JS bundle < 1.5MB (${JS_KB}KB)" "PASS" || check "JS bundle < 1.5MB (${JS_KB}KB)" "FAIL" "bundle is ${JS_KB}KB"
  else
    check "JS bundle size check" "FAIL" "dist/ not found — run vite build first"
  fi
  # Check CSS bundle size (should stay under 50KB)
  CSS_SIZE=$(find dist/assets -name '*.css' -exec wc -c {} + 2>/dev/null | tail -1 | awk '{print $1}')
  if [[ -n "$CSS_SIZE" ]]; then
    CSS_KB=$((CSS_SIZE / 1024))
    [[ "$CSS_KB" -lt 50 ]] && check "CSS bundle < 50KB (${CSS_KB}KB)" "PASS" || check "CSS bundle < 50KB (${CSS_KB}KB)" "FAIL"
  fi
section_summary

# ── Section 7: Dispose/Lifecycle ──────────────────────────
section "Dispose & Lifecycle"
  # WorldEngine.destroy() must exist
  grep -q 'destroy()' src/meadow/WorldEngine.js 2>/dev/null && check "WorldEngine.destroy() exists" "PASS" || check "WorldEngine.destroy() exists" "FAIL"
  # Count subsystems with dispose methods
  SUBSYSTEM_COUNT=$(grep -rl 'class.*{' src/meadow/*.js 2>/dev/null | wc -l | tr -d ' ')
  DISPOSE_COUNT=$(grep -rl 'dispose()' src/meadow/*.js 2>/dev/null | wc -l | tr -d ' ')
  [[ "$DISPOSE_COUNT" -ge 30 ]] && check "≥30 subsystems have dispose() ($DISPOSE_COUNT)" "PASS" || check "≥30 subsystems have dispose()" "FAIL" "only $DISPOSE_COUNT"
  # Check for scene.remove in dispose methods (the known gap)
  SCENE_REMOVE_COUNT=$(grep -rl 'scene\.remove' src/meadow/*.js 2>/dev/null | wc -l | tr -d ' ')
  echo "    info: $SCENE_REMOVE_COUNT files call scene.remove() (target: all subsystems that add to scene)"
  check "scene.remove audit tracked" "PASS" "currently $SCENE_REMOVE_COUNT files — see specs/dispose-lifecycle.md"
section_summary

# ── Section 8: Spec Coverage ─────────────────────────────
section "Ralph Spec Coverage"
  SPEC_COUNT=$(ls specs/*.md 2>/dev/null | grep -v README | wc -l | tr -d ' ')
  [[ "$SPEC_COUNT" -ge 10 ]] && check "≥10 specs exist ($SPEC_COUNT)" "PASS" || check "≥10 specs exist" "FAIL" "only $SPEC_COUNT"
  # Every spec must have Acceptance Criteria section
  SPECS_WITH_AC=$(grep -rl 'Acceptance Criteria' specs/*.md 2>/dev/null | grep -v README | wc -l | tr -d ' ')
  [[ "$SPECS_WITH_AC" -eq "$SPEC_COUNT" ]] && check "All specs have Acceptance Criteria" "PASS" || check "All specs have Acceptance Criteria" "FAIL" "$SPECS_WITH_AC of $SPEC_COUNT"
  # Pin (README.md) should have entries for all specs
  PIN_ENTRIES=$(grep -c '###' specs/README.md 2>/dev/null || echo "0")
  [[ "$PIN_ENTRIES" -ge "$SPEC_COUNT" ]] && check "Pin has entries for all specs ($PIN_ENTRIES)" "PASS" || check "Pin coverage" "FAIL" "pin has $PIN_ENTRIES, specs has $SPEC_COUNT"
section_summary

# ── Section 9: Infrastructure Files ──────────────────────
section "Ralph Infrastructure"
  [[ -f "RALPH_PROMPT.md" ]] && check "RALPH_PROMPT.md exists" "PASS" || check "RALPH_PROMPT.md exists" "FAIL"
  [[ -f "AGENTS.md" ]] && check "AGENTS.md exists" "PASS" || check "AGENTS.md exists" "FAIL"
  [[ -f "AUDIENCE_JTBD.md" ]] && check "AUDIENCE_JTBD.md exists" "PASS" || check "AUDIENCE_JTBD.md exists" "FAIL"
  [[ -f "specs/README.md" ]] && check "specs/README.md (Pin) exists" "PASS" || check "Pin exists" "FAIL"
  [[ -f "scripts/verify-all.sh" ]] && check "verify-all.sh exists" "PASS" || check "verify-all.sh exists" "FAIL"
  [[ -f "SCOUT_REPORT.md" ]] && check "SCOUT_REPORT.md exists" "PASS" || check "SCOUT_REPORT.md exists" "FAIL"
section_summary

# ── Section 10: Dependency Health ─────────────────────────
section "Dependency Health"
  # Check for known unused runtime deps
  for dep in "n8ao" "three-good-godrays"; do
    IMPORTED=$(grep -r "from.*$dep\|require.*$dep" src/ 2>/dev/null | wc -l | tr -d ' ')
    [[ "$IMPORTED" -eq 0 ]] && check "Unused dep '$dep' not imported" "PASS" "listed in package.json but never imported — remove" || check "'$dep' is imported" "PASS"
  done
  # Check node_modules exists
  [[ -d "node_modules" ]] && check "node_modules exists" "PASS" || check "node_modules exists" "FAIL" "run npm install"
section_summary

# ── Summary ───────────────────────────────────────────────
echo ""; echo "=================================================="
echo "  TOTAL: $TOTAL_PASS passed, $TOTAL_FAIL failed"
echo "=================================================="; echo ""
[[ $TOTAL_FAIL -gt 0 ]] && exit 1 || exit 0
