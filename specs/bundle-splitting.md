# Bundle Splitting & Code Splitting

## What This Is
A phased strategy to break the monolithic 1.36MB JS bundle into route-aware chunks using React.lazy(), dynamic imports, and Vite manualChunks, plus moving the 11MB audio asset to lazy-load on play.

## Why This Matters
The current build ships everything eagerly: all 5 world configs, 60+ subsystems, 17 keyframe files, and the audio file in a single chunk. Users arriving at the Canvas 2D entry page download 480KB of WebGL code they cannot use until they click Enter. Splitting the bundle cuts initial load to ~200KB (58% reduction, ~70% faster to interactive), and each world only pays for its own subsystems. The 11MB audio file in dist/ inflates deploy size and delays first paint on slow connections.

## Acceptance Criteria
- [ ] AC1: Entry page loads without downloading any Three.js or WebGL code (EnvironmentScene is React.lazy)
- [ ] AC2: Initial JS chunk (entry page critical path) is under 220KB uncompressed
- [ ] AC3: EnvironmentScene chunk loads on-demand when user clicks Enter
- [ ] AC4: Each world's keyframe file is dynamically imported when that world is entered
- [ ] AC5: World-specific subsystems are dynamically imported per-world, not eagerly bundled
- [ ] AC6: A SubsystemLoader utility exists that resolves dynamic imports for a given world config
- [ ] AC7: Audio MP3 files are not included in the JS bundle; they are fetched on first play
- [ ] AC8: Vite config uses manualChunks to isolate world-specific code into separate chunks
- [ ] AC9: Build produces at least 6 chunks (entry, shared-three, and one per active world)
- [ ] AC10: No functionality regression -- all 5 worlds load and render correctly after splitting
- [ ] AC11: Suspense fallback displays a visually appropriate loading state (not a white flash)

## Specification

### Phase 1 -- Entry Page Split (React.lazy)

**Goal:** The entry page (Canvas 2D flower, audio gate) loads without pulling in Three.js or any world code.

1. In `src/App.jsx`, replace the static `import EnvironmentScene` with:
   ```js
   const EnvironmentScene = React.lazy(() => import('./EnvironmentScene.jsx'));
   ```
2. Wrap the `<EnvironmentScene>` render in `<Suspense fallback={<LoadingShell />}>`.
3. `LoadingShell` should be a minimal component matching the void background (`#0a0a0a`) with a subtle opacity fade -- no spinners, no progress bars. This is a cinematic site; the loading state must feel intentional.
4. Verify that `three`, `postprocessing`, and all `src/meadow/` imports are eliminated from the entry chunk via `npx vite-bundle-visualizer` or build output inspection.

**Files modified:** `src/App.jsx`
**Files created:** `src/LoadingShell.jsx` (or inline)

### Phase 2 -- Keyframe Async Loading

**Goal:** World atmosphere keyframes (~35KB total across 5 worlds) load only when a world is entered.

1. In each environment config (`src/environments/*.js`), replace the inline `atmosphereKeyframes` object with a loader reference:
   ```js
   atmosphereKeyframes: () => import('./keyframes/golden-meadow-keyframes.js')
   ```
2. In `src/meadow/WorldEngine.js`, modify initialization to `await` the keyframe import before passing data to `AtmosphereController`:
   ```js
   const keyframeModule = await config.atmosphereKeyframes();
   this.atmosphereController = new AtmosphereController(keyframeModule.default);
   ```
3. WorldEngine's setup method becomes async. `EnvironmentScene.jsx` must handle this (await engine.init() before starting the render loop).
4. Extract keyframes from each environment config into separate files under `src/environments/keyframes/`.

**Files modified:** `src/environments/golden-meadow.js`, `ocean-cliff.js`, `night-meadow.js`, `storm-field.js`, `ghibli-painterly.js`, `src/meadow/WorldEngine.js`, `src/EnvironmentScene.jsx`
**Files created:** `src/environments/keyframes/golden-meadow-keyframes.js` (and 4 more)

### Phase 3 -- Subsystem Lazy Loading

**Goal:** World-specific subsystems (rain, lightning, stars, petal particles, Kuwahara, cloth, etc.) load only for the world that uses them. Shared subsystems (terrain, grass, camera, post-processing core) remain in the shared chunk.

1. Create `src/meadow/SubsystemLoader.js`:
   ```js
   // Maps subsystem names to dynamic import functions
   const SUBSYSTEM_REGISTRY = {
     fireflies: () => import('./FireflySystem.js'),
     rain: () => import('./RainSystem.js'),
     lightning: () => import('./LightningSystem.js'),
     stars: () => import('./StarField.js'),
     petals: () => import('./PetalSystem.js'),
     cloth: () => import('./ScoreSheetCloth.js'),
     // ... etc
   };

   export async function loadSubsystems(config) {
     const needed = config.subsystems; // e.g. ['fireflies', 'cloth']
     const modules = await Promise.all(
       needed.map(name => SUBSYSTEM_REGISTRY[name]())
     );
     return Object.fromEntries(
       needed.map((name, i) => [name, modules[i].default])
     );
   }
   ```
2. Each environment config declares a `subsystems` array listing which subsystems it needs.
3. `WorldEngine.js` calls `loadSubsystems(config)` during async init and instantiates only the returned classes.
4. Shared subsystems that every world uses (TerrainPlane, CameraRig, GrassChunkManager, PostProcessingStack, AtmosphereController, ScrollEngine) remain as static imports in WorldEngine.

**Files modified:** `src/meadow/WorldEngine.js`, all environment configs
**Files created:** `src/meadow/SubsystemLoader.js`

### Phase 4 -- Audio Streaming

**Goal:** MP3 files are not in the JS bundle or eagerly fetched. They load when the user presses play or enters a world.

1. Move audio files to `public/audio/` so Vite serves them as static assets without hashing into the JS bundle.
2. In MiniPlayer, change audio source references from ES module imports to URL paths (`/audio/In a Field of Silence.mp3`).
3. Set `<audio preload="none">` to prevent browser from buffering before play intent.

**Files modified:** `src/MiniPlayer.jsx`
**Files moved:** `src/assets/audio/*.mp3` to `public/audio/`

### Phase 5 -- Vite Config (manualChunks)

**Goal:** Explicit chunk boundaries so Vite does not merge world-specific code back into a shared chunk.

1. In `vite.config.js`, add `build.rollupOptions.output.manualChunks`:
   ```js
   manualChunks(id) {
     if (id.includes('node_modules/three')) return 'three';
     if (id.includes('node_modules/postprocessing')) return 'postprocessing';
     if (id.includes('environments/golden-meadow')) return 'world-golden-meadow';
     if (id.includes('environments/ocean-cliff')) return 'world-ocean-cliff';
     if (id.includes('environments/night-meadow')) return 'world-night-meadow';
     if (id.includes('environments/storm-field')) return 'world-storm-field';
     if (id.includes('environments/ghibli-painterly')) return 'world-ghibli-painterly';
   }
   ```
2. Verify chunk output with `npx vite build` and inspect `dist/assets/`.

**Files modified:** `vite.config.js`

## Ralphable vs Human-Taste

| AC | Classification | Rationale |
|----|---------------|-----------|
| AC1 | Ralphable | Mechanical: wrap import in React.lazy, verify chunk contents |
| AC2 | Ralphable | Measurable: build output size check |
| AC3 | Ralphable | Mechanical: Suspense boundary wiring |
| AC4 | Ralphable | Mechanical: extract keyframes, add dynamic import |
| AC5 | **Human review** | Deciding which subsystems are world-specific vs shared requires architectural judgment. The SubsystemLoader registry (which systems go where) needs human sign-off. Implementation after classification is Ralphable. |
| AC6 | Ralphable | Mechanical: create utility, wire into WorldEngine |
| AC7 | Ralphable | Mechanical: move files, change paths, set preload=none |
| AC8 | Ralphable | Mechanical: Vite config addition |
| AC9 | Ralphable | Measurable: count chunks in build output |
| AC10 | **Human review** | Functional regression requires visual verification across all 5 worlds. Automated build check is necessary but not sufficient -- someone must confirm each world renders correctly. |
| AC11 | **Human-taste** | The Suspense fallback must match the cinematic feel (void black, opacity surface, no spinners). Design decision. |

## Dependencies

- **No external dependencies.** All tools are already available (React.lazy is built-in, Vite supports manualChunks natively, dynamic import() is ES standard).
- **Prerequisite knowledge:** Must understand which subsystems are world-specific before implementing Phase 3. Current candidates for world-specific: FireflySystem (night-meadow, golden-meadow), RainSystem (storm-field), LightningSystem (storm-field), StarField (night-meadow), PetalSystem (ghibli-painterly), ScoreSheetCloth (golden-meadow), KuwaharaEffect (ghibli-painterly).
- **Ordering:** Phases 1-2 can proceed independently. Phase 3 depends on human classification of subsystems. Phase 4 is independent. Phase 5 should come last to verify final chunk layout.
- **Risk:** Making WorldEngine.init() async (Phase 2-3) touches a critical code path. Must ensure the render loop does not start before subsystems are ready.

## Verification

**AC1 -- Entry page isolation:**
```bash
npx vite build && ls -la dist/assets/*.js | head -20
# Inspect the entry chunk (smallest JS file). Confirm no 'three' or 'postprocessing' strings:
grep -l "THREE" dist/assets/*.js
# Entry chunk should NOT appear in this list
```

**AC2 -- Entry chunk size:**
```bash
npx vite build 2>&1 | grep -E "\.js\s+"
# Entry chunk (index-*.js) must be < 220KB
# Also check gzip: gzip -c dist/assets/index-*.js | wc -c  (should be < 70KB)
```

**AC3 -- Lazy EnvironmentScene:**
```bash
# Build and inspect chunk graph:
npx vite build
# Confirm EnvironmentScene-*.js exists as a separate chunk:
ls dist/assets/ | grep -i environment
```

**AC4 -- Keyframe dynamic imports:**
```bash
# After build, keyframe chunks should exist:
ls dist/assets/ | grep keyframe
# Or verify by searching for dynamic import in source:
grep -r "import(" src/environments/*.js | grep keyframe
```

**AC5 -- World-specific subsystem chunks:**
```bash
# After build, subsystem chunks should exist separately:
ls dist/assets/ | grep -E "(firefly|rain|lightning|star|petal|cloth|kuwahara)"
```

**AC6 -- SubsystemLoader exists and exports loadSubsystems:**
```bash
grep "export.*loadSubsystems" src/meadow/SubsystemLoader.js
```

**AC7 -- Audio not in bundle:**
```bash
# MP3 should be in public/audio, not in dist/assets as a hashed file:
ls public/audio/*.mp3
# Confirm no large (>1MB) files in dist/assets:
find dist/assets -size +1M -type f
# Should return nothing (or only source maps)
```

**AC8 -- Vite manualChunks configured:**
```bash
grep "manualChunks" vite.config.js
```

**AC9 -- Chunk count:**
```bash
npx vite build && ls dist/assets/*.js | wc -l
# Must be >= 6
```

**AC10 -- No regression (automated portion):**
```bash
# Build must succeed with zero errors:
npx vite build 2>&1 | tail -5
# Dev server must start without errors:
timeout 10 npx vite 2>&1 | head -20
# Manual: navigate to /, /listen, /story, /collect, /witness and confirm rendering
```

**AC11 -- Suspense fallback (manual):**
```
# Throttle network to Slow 3G in DevTools
# Navigate to / and click Enter
# Observe: should see void-black (#0a0a0a) screen with subtle opacity transition
# Must NOT see: white flash, spinner, "Loading..." text, layout shift
```
