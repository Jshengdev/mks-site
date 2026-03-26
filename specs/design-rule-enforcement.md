# Design Rule Enforcement

## What This Is
Automated enforcement of the MKS design system rules (no flat black, prefers-reduced-motion fallbacks, opacity-only surfacing) via lint checks in `verify-all.sh`.

## Why This Matters
The design rules in CLAUDE.md are non-negotiable first principles, but they currently rely on human memory to enforce. The audit found 5 violations already shipped: flat `#000` in CSS, missing `prefers-reduced-motion` overrides in 2 CSS files, and a `translateY` entrance animation in MiniPlayer. Automated checks catch these at build time before they compound.

## Acceptance Criteria
- [ ] AC1: `src/index.css` line 36 `background: #000;` replaced with `background: var(--void);`
- [ ] AC2: Every CSS file containing `animation` or `transition` also contains a `@media (prefers-reduced-motion: reduce)` block
- [ ] AC3: `DevTuner.css` has `prefers-reduced-motion` overrides for its 8 transitions
- [ ] AC4: `MiniPlayer.css` has `prefers-reduced-motion` overrides for its 2 keyframes and 8 transitions
- [ ] AC5: `MiniPlayer.css` `playerSlideUp` keyframe replaced with opacity-only entrance (no `translateY`)
- [ ] AC6: `verify-all.sh` includes a "design rules" section that checks all 6 rules below
- [ ] AC7: `verify-all.sh` exits non-zero if any design rule check fails
- [ ] AC8: All checks pass on the current codebase after fixes are applied

## Specification

### Fix: Flat black in index.css
Replace `background: #000;` at `src/index.css:36` with `background: var(--void);`. The `--void` custom property is already defined as `#0a0a0a`.

### Fix: prefers-reduced-motion in DevTuner.css
Add at the end of `DevTuner.css`:
```css
@media (prefers-reduced-motion: reduce) {
  .dev-tuner,
  .dev-tuner * {
    transition: none !important;
  }
}
```

### Fix: prefers-reduced-motion in MiniPlayer.css
Add at the end of `MiniPlayer.css`:
```css
@media (prefers-reduced-motion: reduce) {
  .mini-player,
  .mini-player * {
    animation: none !important;
    transition: none !important;
  }
}
```

### Fix: playerSlideUp entrance animation
Replace the `playerSlideUp` keyframe in `MiniPlayer.css`:
```css
/* BEFORE */
@keyframes playerSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* AFTER — opacity-only surfacing per design rules */
@keyframes playerSlideUp {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```
Note: The keyframe name stays the same so no references need updating.

### DevTuner '#000000' fallback
No fix needed. DevTuner is a dev-only tool, not shipped to users. The `#000000` is a color picker fallback value. Document as accepted exception.

### Borderline: bioluminescent-deep.js '#000005'
No fix needed. This has a blue tint (R:0 G:0 B:5) and lives in JS/GLSL world config, not CSS. It is an intentional near-black with atmospheric color.

### verify-all.sh design rule checks
Add the following section to `scripts/verify-all.sh`:

```bash
echo "=== Design Rule Checks ==="
DESIGN_FAIL=0

# Rule 1: No flat black (#000 or #000000) in CSS files
if grep -rn '#000[^0-9a-fA-F]' src/**/*.css 2>/dev/null | grep -v 'DevTuner'; then
  echo "FAIL: Flat black #000 found in CSS (use var(--void) instead)"
  DESIGN_FAIL=1
fi
if grep -rn '#000000' src/**/*.css 2>/dev/null | grep -v 'DevTuner'; then
  echo "FAIL: Flat black #000000 found in CSS (use var(--void) instead)"
  DESIGN_FAIL=1
fi

# Rule 2: prefers-reduced-motion in every CSS file with animation/transition
for css_file in src/**/*.css; do
  if grep -q 'animation\|transition' "$css_file" 2>/dev/null; then
    if ! grep -q 'prefers-reduced-motion' "$css_file" 2>/dev/null; then
      echo "FAIL: $css_file has animation/transition but no prefers-reduced-motion override"
      DESIGN_FAIL=1
    fi
  fi
done

# Rule 3: No transform-based entrance animations in CSS keyframes
if grep -A2 '@keyframes' src/**/*.css 2>/dev/null | grep -E 'transform:\s*(translateY|scale)'; then
  echo "FAIL: Transform-based entrance animation found (use opacity-only surfacing)"
  DESIGN_FAIL=1
fi

# Rule 4: Backgrounds should use CSS custom properties, not raw hex
if grep -rn 'background.*#[0-9a-fA-F]' src/**/*.css 2>/dev/null | grep -v 'DevTuner' | grep -v 'var(--'; then
  echo "WARN: Raw hex background found in CSS (prefer var(--void), var(--warm-black), var(--surface))"
  # Warning only — some gradients may need raw hex
fi

# Rule 5: --amber and --teal max 5 uses per CSS file
for css_file in src/**/*.css; do
  amber_count=$(grep -c 'var(--amber)' "$css_file" 2>/dev/null || echo 0)
  teal_count=$(grep -c 'var(--teal)' "$css_file" 2>/dev/null || echo 0)
  if [ "$amber_count" -gt 5 ]; then
    echo "FAIL: $css_file uses --amber $amber_count times (max 5)"
    DESIGN_FAIL=1
  fi
  if [ "$teal_count" -gt 5 ]; then
    echo "FAIL: $css_file uses --teal $teal_count times (max 5)"
    DESIGN_FAIL=1
  fi
done

# Rule 6: --red-felt / --pink max 1 use across entire CSS
red_total=$(grep -rc 'var(--red-felt)\|var(--pink)' src/**/*.css 2>/dev/null | awk -F: '{s+=$2} END {print s}')
if [ "$red_total" -gt 1 ]; then
  echo "FAIL: --red-felt/--pink used $red_total times across CSS (max 1 — 'used exactly ONCE')"
  DESIGN_FAIL=1
fi

if [ "$DESIGN_FAIL" -eq 1 ]; then
  echo "Design rule checks FAILED"
  exit 1
else
  echo "Design rule checks passed"
fi
```

## Ralphable vs Human-Taste

| Item | Classification | Reason |
|------|---------------|--------|
| AC1: Replace #000 with var(--void) | Ralphable | Mechanical find-and-replace |
| AC2: prefers-reduced-motion audit | Ralphable | Presence check + boilerplate block |
| AC3: DevTuner.css reduced-motion | Ralphable | Boilerplate CSS block |
| AC4: MiniPlayer.css reduced-motion | Ralphable | Boilerplate CSS block |
| AC5: playerSlideUp opacity-only | Human-taste needed | The translateY removal is mechanical, but the replacement entrance feel (timing curve, duration, delay) may need human review to ensure it still feels right without the slide |
| AC6: verify-all.sh checks | Ralphable | Shell scripting, pattern matching |
| AC7: Exit code wiring | Ralphable | Script logic |
| AC8: All checks pass | Ralphable | Run and verify |

## Dependencies
- `scripts/verify-all.sh` must exist (it does, currently untracked)
- CSS custom properties `--void`, `--warm-black`, `--surface` must be defined in `src/index.css` (they are)
- No external tool dependencies — all checks use `grep` and shell builtins

## Verification
```bash
# After fixes, run design rule checks
bash scripts/verify-all.sh

# Spot-check: no flat black in CSS
grep -rn '#000' src/**/*.css | grep -v DevTuner
# Expected: no output

# Spot-check: reduced-motion in all animated CSS
for f in src/**/*.css; do
  if grep -q 'animation\|transition' "$f"; then
    echo -n "$f: "
    grep -c 'prefers-reduced-motion' "$f"
  fi
done
# Expected: every file shows count >= 1

# Spot-check: no translateY in keyframes
grep -A2 '@keyframes' src/**/*.css | grep translateY
# Expected: no output

# Build still passes
npx vite build
```
