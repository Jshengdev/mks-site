Study @RALPH_PROMPT.md for system principles and rules.
Study specs/README.md to learn what specifications exist and find the right ones.
Study @IMPLEMENTATION_PLAN.md for the prioritized task list.
Study @AGENTS.md for build/test/run instructions.
Study @CLAUDE.md for 30+ operational learnings specific to this codebase.

Pick the most important uncompleted item. ONE THING PER LOOP.
Search the codebase first -- do not assume something is missing.
Implement it fully. No stubs. No placeholders. Include required tests.
Run `npx vite build` — must pass before committing.
Run `bash scripts/verify-all.sh` — all sections must pass.
Update @IMPLEMENTATION_PLAN.md with findings and mark the task done.
Stage specific files with `git add` (NOT -A), commit with a descriptive message, push.

# MKS-Specific Rules
- NEVER use `#000` or `#000000` in CSS. Use `--void: #0a0a0a` or `--warm-black: #1a1208`.
- NEVER create per-frame allocations (`new THREE.Vector3()` etc in update/tick). Use module-level `_temp` objects.
- NEVER write original GLSL from scratch. All shaders adapted from real GitHub reference repos.
- NEVER add transform-based animations (scale, translateY). Opacity transitions only.
- AtmosphereController overwrites all subsystem values every frame. If you need a value to stick, use the freeze/override pattern.
- Environment configs are PURE DATA. No Three.js imports in `src/environments/*.js`.
- Texture imports must use ES module syntax (`import url from '...'`), not string paths.

# Guardrails (retros add new numbered rules below as the system learns)
