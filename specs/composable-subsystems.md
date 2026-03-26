# Composable Subsystem Architecture

## What This Is
Architecture for subsystems as composable layers that can be activated/deactivated per scroll segment in the unified experience.

## Why This Matters
WorldEngine currently instantiates all subsystems at construction based on a single world config. For the unified scroll, subsystems must activate as the camera enters their segment and deactivate when it leaves — with proper dispose, without frame drops.

## Acceptance Criteria
- [ ] AC1: SubsystemRegistry class manages registration, activation, and deactivation of subsystems by scroll segment
- [ ] AC2: Each subsystem implements a standard interface: init(scene, config), update(elapsed, atmosphere), activate(), deactivate(), dispose()
- [ ] AC3: Activation is scroll-driven — subsystems activate when camera enters their t-range and deactivate when leaving
- [ ] AC4: Deactivation hides (visible=false) rather than disposing for fast re-entry. Full dispose only on segment unload.
- [ ] AC5: WorldEngine delegates subsystem management to SubsystemRegistry instead of managing 60+ subsystems directly
- [ ] AC6: No frame drops during activation/deactivation (stagger over 3-5 frames if needed)

## Specification
Architecture: SubsystemRegistry holds a Map<segmentId, SubsystemEntry[]>. Each entry has: class reference, config, instance (null until activated), t-range [start, end]. On scroll update, registry checks which segments are active (camera t within range + margin) and activates/deactivates accordingly.

Staggering: When multiple subsystems need activation (entering a dense segment), spread instantiation across 3-5 frames to avoid frame drop.

Interface: { init(scene, config), update(elapsed, atmosphereState), activate(), deactivate(), dispose() }

## Ralphable vs Human-Taste
- AC1-2, AC4-6: **Ralphable** (architecture, lifecycle, performance)
- AC3: **Partially Human-Taste** (t-ranges for subsystem activation are creative decisions)

## Dependencies
- config-normalization (segment addressing)
- dispose-lifecycle (clean teardown)
- bundle-splitting (dynamic import of subsystem classes)

## Verification
- AC1: SubsystemRegistry.js exists with register/activate/deactivate/dispose methods
- AC2: At least 5 subsystems implement the standard interface
- AC3: Console log shows subsystem activation/deactivation as scroll moves through t-ranges
- AC4: Deactivated subsystems have mesh.visible=false, geometry still in memory
- AC5: WorldEngine constructor delegates to registry (grep for SubsystemRegistry usage)
- AC6: FPS stays above 55 during activation (measured in DevTuner or Chrome DevTools)
