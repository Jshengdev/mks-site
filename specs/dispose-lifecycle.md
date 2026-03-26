# Dispose & Lifecycle Audit

## What This Is
A systematic fix for memory leaks caused by incomplete dispose() methods across ~40 subsystems — adding missing scene.remove() calls, disposing leaked textures/geometries, and closing unclosed AudioContexts.

## Why This Matters
Every world transition calls destroy() on the current WorldEngine and instantiates a new one. Without proper cleanup, each transition leaks GPU memory (textures, geometries stuck on the GPU), retains scene graph references (preventing GC of entire Object3D trees), and accumulates orphaned AudioContexts. After 3-4 world transitions, this will cause visible frame drops on Tier 2 hardware and potential WebGL context loss on mobile.

## Acceptance Criteria
- [ ] AC1: Every subsystem dispose() calls `this.scene.remove()` on its mesh/points/group BEFORE calling geometry.dispose() and material.dispose()
- [ ] AC2: WorldEngine.destroy() disposes terrain mesh (PlaneGeometry up to 1200x1200 subdivisions) and all sceneSetup objects (Sky dome SphereGeometry, DirectionalLight, AmbientLight)
- [ ] AC3: ArtistFigure.dispose() disposes the loaded texture (not just the material). ScoreSheetCloth.dispose() disposes its DataTexture
- [ ] AC4: AudioReactive.dispose() calls audioCtx.close() (matching MusicTrigger's existing correct pattern)
- [ ] AC5: VolumetricCloudSystem and TransitionRenderer dispose their fullscreen quad PlaneGeometry
- [ ] AC6: PostProcessingStack.dispose() disposes RenderPass and EffectPass instances (not just individual effects)
- [ ] AC7: Zero console warnings about "disposed geometry/material still in scene" after a full world transition cycle (enter world -> scroll -> transition to different world -> scroll -> transition back)

## Specification

### AC1: scene.remove() in all subsystem dispose() methods

**Affected files (44 classes):**
FireflySystem, DustMotes, RainSystem, PetalSystem, SnowParticle, EmberSystem, AshSystem, MarineSnow, BioluminescenceSystem, VoidParticle, BubbleSystem, SteamVent, StylizedOcean, CloudShadows, StarField, LavaLake, LavaCrack, IceSpike, AuroraCurtain, FogWisp, OrigamiGrass, PaperTree, FoldLine, FloatingPlatform, StairSegment, FloatingBook, ShelfSegment, WarmLightOrb, CopperLeaf, WiltingGrass, DissolvingFlower, GiantAnemone, Starfish, KelpStrand, CoralCluster, AnemoneSystem, JellyfishSystem, CrystalFormation, GlowMushroom, GearTree, LightRibbon, PulseOrb, AnglerLight, FlowerInstances.

**Fix pattern for each class:**

1. Ensure constructor stores scene reference: `this.scene = scene;`
2. In dispose(), add scene.remove BEFORE geometry/material disposal:

```js
dispose() {
  // Step 1: Remove from scene graph (enables GC of Object3D tree)
  if (this.mesh) this.scene.remove(this.mesh);
  if (this.points) this.scene.remove(this.points);
  if (this.group) this.scene.remove(this.group);

  // Step 2: Dispose GPU resources (existing code)
  if (this.geometry) this.geometry.dispose();
  if (this.material) this.material.dispose();
}
```

**Order matters:** scene.remove() first, then dispose(). Disposing a geometry while its mesh is still in the scene graph can cause renderer warnings on the next frame.

**Edge cases:**
- Classes using `this.group` with multiple children: iterate `group.children` and dispose each child's geometry/material, then `this.scene.remove(this.group)`
- InstancedMesh classes (FlowerInstances, GrassChunkManager): remove the InstancedMesh, not just the geometry
- Classes that add helpers or debug objects: remove those too

### AC2: WorldEngine.destroy() terrain and sceneSetup disposal

In `WorldEngine.js` destroy() method, add:

```js
// Dispose terrain
if (this.terrain) {
  this.scene.remove(this.terrain.mesh);
  this.terrain.mesh.geometry.dispose();
  this.terrain.mesh.material.dispose();
}

// Dispose sceneSetup objects
if (this.sceneSetup) {
  if (this.sceneSetup.sky) {
    this.scene.remove(this.sceneSetup.sky);
    this.sceneSetup.sky.geometry.dispose();
    this.sceneSetup.sky.material.dispose();
  }
  if (this.sceneSetup.directionalLight) {
    this.scene.remove(this.sceneSetup.directionalLight);
  }
  if (this.sceneSetup.ambientLight) {
    this.scene.remove(this.sceneSetup.ambientLight);
  }
}
```

The terrain PlaneGeometry at 1200x1200 subdivisions is ~34 MB of vertex data. This is the single largest leak per transition.

### AC3: Texture disposal

**ArtistFigure.js:**
```js
dispose() {
  this.scene.remove(this.mesh);
  if (this.texture) this.texture.dispose();  // ADD THIS
  this.mesh.geometry.dispose();
  this.mesh.material.dispose();
}
```
The texture is loaded via `new TextureLoader().load()` and stored — ensure it's assigned to `this.texture` in the load callback if not already.

**ScoreSheetCloth.js:**
```js
dispose() {
  this.scene.remove(this.mesh);
  if (this.dataTexture) this.dataTexture.dispose();  // ADD THIS
  this.mesh.geometry.dispose();
  this.mesh.material.dispose();
}
```

### AC4: AudioReactive AudioContext closure

**AudioReactive.js** — in dispose():
```js
dispose() {
  if (this.analyser) this.analyser.disconnect();
  if (this.audioCtx && this.audioCtx.state !== 'closed') {
    this.audioCtx.close();  // ADD THIS — matches MusicTrigger pattern
  }
}
```

Check `audioCtx.state !== 'closed'` to avoid errors if dispose() is called twice.

### AC5: Fullscreen quad geometry disposal

**VolumetricCloudSystem** and **TransitionRenderer** both create `new PlaneGeometry(2, 2)` for fullscreen passes.

```js
dispose() {
  if (this.quadGeometry) this.quadGeometry.dispose();
  if (this.quadMaterial) this.quadMaterial.dispose();
  // ... existing cleanup
}
```

Ensure the quad geometry is stored as `this.quadGeometry` (or equivalent) in the constructor.

### AC6: PostProcessingStack pass disposal

**PostProcessingStack.js** — in dispose():
```js
dispose() {
  // Dispose passes (ADD THIS)
  if (this.renderPass) this.renderPass.dispose();
  if (this.effectPass) this.effectPass.dispose();

  // Dispose individual effects (existing code)
  // ...

  // Dispose composer last
  if (this.composer) this.composer.dispose();
}
```

### AC7: Integration verification

After all fixes, a full transition cycle must produce zero dispose-related console warnings. Test by:
1. Open DevTools console, filter for "dispose" or "WebGL"
2. Enter Golden Meadow, scroll to 50%
3. Switch to Ocean Cliff via MiniPlayer
4. Scroll to 50%
5. Switch back to Golden Meadow
6. Verify: no warnings, no frame rate degradation vs. fresh load

## Ralphable vs Human-Taste

| AC | Classification | Reason |
|----|---------------|--------|
| AC1 | Ralphable | Mechanical — add scene.remove() before existing dispose() calls in 44 files |
| AC2 | Ralphable | Mechanical — add terrain/sceneSetup disposal to WorldEngine.destroy() |
| AC3 | Ralphable | Mechanical — add texture.dispose() calls in 2 files |
| AC4 | Ralphable | Mechanical — add audioCtx.close() matching existing MusicTrigger pattern |
| AC5 | Ralphable | Mechanical — add quadGeometry.dispose() in 2 files |
| AC6 | Ralphable | Mechanical — add pass.dispose() calls in PostProcessingStack |
| AC7 | Ralphable | Verification — run transition cycle, check console output |

**All ACs are Ralphable.** No taste decisions involved. Every fix follows an established pattern already present somewhere in the codebase.

## Dependencies

- None. This spec is self-contained and can be implemented independently.
- Does NOT require any new packages or APIs.
- Does NOT modify any visual behavior, atmosphere keyframes, or render output.
- Safe to implement on any branch — changes are purely additive (adding cleanup calls to existing dispose methods).

## Verification

```bash
# 1. Build must pass clean
npx vite build

# 2. Grep: every subsystem file with dispose() must contain scene.remove
# Run from project root. Expect zero results (all files fixed):
grep -rn "\.dispose()" src/meadow/ --include="*.js" -l | \
  xargs -I{} sh -c 'grep -L "scene\.remove" {} 2>/dev/null' | \
  grep -v "constants.js\|index.js\|shaders/"

# 3. Grep: confirm no dispose() method lacks scene.remove in particle/mesh subsystems
# This should return matches in ALL 44 affected files:
grep -rn "this\.scene\.remove" src/meadow/ --include="*.js" -l | wc -l
# Expected: >= 44

# 4. Grep: texture disposal in ArtistFigure and ScoreSheetCloth
grep -n "texture\.dispose" src/meadow/ArtistFigure.js src/meadow/ScoreSheetCloth.js
# Expected: one match per file

# 5. Grep: AudioContext close in AudioReactive
grep -n "audioCtx\.close\|AudioContext.*close" src/meadow/AudioReactive.js
# Expected: at least one match

# 6. Grep: quad geometry disposal
grep -rn "quadGeometry\.dispose\|quad.*geometry.*dispose" src/meadow/ --include="*.js"
# Expected: matches in VolumetricCloudSystem and TransitionRenderer

# 7. Grep: PostProcessingStack pass disposal
grep -n "renderPass\.dispose\|effectPass\.dispose" src/meadow/PostProcessingStack.js
# Expected: at least two matches

# 8. Manual test: Run dev server, open browser, perform transition cycle per AC7
npx vite dev
# Then in browser: navigate between worlds, check console for WebGL warnings
```
