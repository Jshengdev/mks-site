# Lint Cleanup & ESLint Configuration

## What This Is
Eliminate all 98 ESLint errors and remove unused dependencies to achieve a zero-warning, zero-error lint baseline.

## Why This Matters
18 real errors in src/ mask legitimate issues — unused variables indicate dead code or incomplete refactors, ref-during-render violations cause subtle React bugs, and the 80 errors from vendored reference code create noise that makes developers ignore lint output entirely. A clean lint baseline means every future error is a real signal. Removing unused dependencies shrinks install time and eliminates phantom resolution conflicts.

## Acceptance Criteria
- [ ] AC1: `npx eslint . 2>&1 | grep -c "error"` returns 0
- [ ] AC2: `docs/webgl-reference/` is excluded from ESLint config (vendored reference code, not project source)
- [ ] AC3: All 12 `no-unused-vars` errors in src/ are resolved (removed or prefixed with `_`)
- [ ] AC4: All 4 `react-hooks` ref-during-render errors in DevTuner.jsx are resolved
- [ ] AC5: WorldContext.jsx setState-in-effect error is resolved
- [ ] AC6: ContentOverlay.jsx react-refresh/only-export-components error is resolved
- [ ] AC7: Unused dependencies removed from package.json: `n8ao`, `three-good-godrays`, `@types/react`, `@types/react-dom`, `playwright`
- [ ] AC8: `npx vite build` still passes clean after all changes
- [ ] AC9: No functional behavior changes — all fixes are mechanical cleanup only

## Specification

### Step 1: Exclude vendored reference code from ESLint

Add `docs/webgl-reference/` to the ESLint `ignorePatterns` (or `.eslintignore`, depending on config format). This eliminates 80 of 98 errors instantly. These files are reference shader code from external repos — they are read-only learning material, not project source.

### Step 2: Fix 12 `no-unused-vars` errors in src/

Files affected:
- `src/meadow/TerrainPlane.js`
- `src/meadow/CrystalFormation.js`
- `src/meadow/GlowMushroom.js`
- `src/meadow/PortalDoor.js`
- `src/meadow/StarField.js`
- `src/meadow/MusicTrigger.js`
- `src/entry/EntryPage.jsx`
- `src/environments/EnvironmentScene.jsx`

For each unused variable:
- If it is a genuinely dead import or declaration, **remove it**
- If it is a destructured parameter that must remain for positional reasons (e.g., `(scene, _camera, renderer)`), **prefix with `_`**
- Do not add `// eslint-disable` comments — fix the root cause

### Step 3: Fix 4 DevTuner.jsx ref-during-render errors

The 4 `react-hooks` errors ("Cannot access refs during render") indicate ref reads happening in the render body instead of inside `useEffect` or `useCallback`. Wrap the ref accesses in the appropriate hook. Do not change DevTuner's external behavior or parameter wiring.

### Step 4: Fix WorldContext.jsx setState-in-effect

The `setState synchronously within effect` error indicates a state update that should be restructured. Options:
- Move the initialization logic into the effect's body with proper sequencing
- Use a ref for the initial value and sync to state after mount
- Restructure to use lazy initializer in `useState`

Choose whichever approach is simplest and does not change WorldContext's public API.

### Step 5: Fix ContentOverlay.jsx export structure

The `react-refresh/only-export-components` error fires because ContentOverlay.jsx exports constants (like `SECTION_T_VALUES` re-exports) alongside React components. Fix by either:
- Moving the constant exports to a separate file (preferred — `constants.js` already exists in `src/meadow/`)
- Restructuring so the module only exports components

Ensure all import sites are updated to point to the new location.

### Step 6: Remove unused dependencies

Remove from `package.json`:
- `n8ao` — was explored for SSAO but never used in runtime code
- `three-good-godrays` — replaced by custom GodRayPass implementation
- `@types/react` — no TypeScript in this project
- `@types/react-dom` — no TypeScript in this project
- `playwright` — belongs in the research/web-extractor project, not the site

Run `npm install` (or equivalent) after removal to update lockfile.

## Ralphable vs Human-Taste

**All ACs are fully Ralphable.** Every fix is mechanical:
- Removing unused imports/variables is objective (ESLint identifies them precisely)
- Wrapping ref reads in useEffect is a known React pattern with no taste component
- Restructuring exports is mechanical file reorganization
- Removing unused deps is objective (grep for imports confirms they are unused)

No human-taste decisions required. No visual, emotional, or architectural judgment calls.

## Dependencies

- None. This spec has no prerequisites and does not depend on other specs.
- This spec should be completed **before** any feature work to establish the clean baseline.

## Verification

```bash
# Primary: zero ESLint errors
npx eslint . 2>&1 | grep -c "error"
# Expected: 0

# Build still passes
npx vite build
# Expected: clean build, no errors

# Vendored code excluded
npx eslint docs/webgl-reference/ 2>&1 | head -5
# Expected: no files linted (ignored)

# Unused deps removed
node -e "const p = require('./package.json'); const bad = ['n8ao','three-good-godrays','@types/react','@types/react-dom','playwright']; const found = bad.filter(d => (p.dependencies||{})[d] || (p.devDependencies||{})[d]); console.log(found.length === 0 ? 'PASS' : 'FAIL: ' + found.join(', '))"
# Expected: PASS

# No functional regressions (dev server starts)
npx vite --open false &
sleep 3 && curl -s http://localhost:5173 | head -1 && kill %1
# Expected: HTML response
```
