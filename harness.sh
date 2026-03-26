#!/bin/bash
# ============================================================
# Autonomous Ralph Harness — the conductor
#
# Usage:
#   ./harness.sh                  First run: scout -> plan -> auto loop
#   ./harness.sh auto             Resume auto loop (skip scout)
#   ./harness.sh scout            Explore codebase, generate specs + fill AGENTS.md
#   ./harness.sh plan             Generate/update plan from specs
#   ./harness.sh build            One build iteration
#   ./harness.sh retro            Retrospective (pattern analysis)
#   ./harness.sh qa               Quality gate (spec compliance)
#   ./harness.sh spec "feature"   Generate a spec from description
#   ./harness.sh docs             Generate architecture docs
#   ./harness.sh status           Current state
#   ./harness.sh ask "question"   Ask about the system
#
# Config: edit the variables below or set RALPH_MODEL env var.
# Ctrl+C to stop.
# ============================================================

set -euo pipefail
cd "$(dirname "$0")"

# ── Config ─────────────────────────────────────────────────
MODEL_BUILD="${RALPH_MODEL_BUILD:-opus}"      # Builds: default opus
MODEL_PLAN="${RALPH_MODEL_PLAN:-opus}"       # Planning: opus
MODEL_RETRO="${RALPH_MODEL_RETRO:-opus}"     # Retro/QA: opus
MODEL_SCOUT="${RALPH_MODEL_SCOUT:-opus}"     # Scout: opus
MAX_BUILD_BEFORE_REPLAN=10   # Re-plan after this many builds
RETRO_EVERY=5                # Retrospective every N builds
QA_EVERY=8                   # Quality gate every N builds
LOG_DIR="state/logs"
STATE_FILE="state/harness-state.json"

mkdir -p "$LOG_DIR" state findings/retrospectives findings/quality-gates findings/architecture findings/learnings

# ── State ──────────────────────────────────────────────────
init_state() {
  if [[ -f "$STATE_FILE" ]]; then
    if python3 -c "import json; json.load(open('$STATE_FILE'))" 2>/dev/null; then
      return  # Valid state exists
    else
      echo "[harness] WARNING: $STATE_FILE is invalid JSON — backing up and re-initializing" >&2
      mv "$STATE_FILE" "${STATE_FILE}.bak.$(date +%s)"
    fi
  fi
  cat > "$STATE_FILE" << 'STATEINIT'
{
  "total_iterations": 0,
  "build_since_last_plan": 0,
  "builds_since_last_retro": 0,
  "builds_since_last_qa": 0,
  "last_mode": "none",
  "last_run": null,
  "retros_completed": 0,
  "qa_gates_completed": 0,
  "tags_created": [],
  "errors": []
}
STATEINIT
}

rs() { python3 -c "import json; d=json.load(open('$STATE_FILE')); print(d.get('$1','$2'))"; }
us() {
  python3 -c "
import json
with open('$STATE_FILE') as f: d=json.load(f)
d['$1']=$2
with open('$STATE_FILE','w') as f: json.dump(d,f,indent=2)
"
}

# Detect state drift (iteration count vs log file count)
_validate_state() {
  local state_iters
  state_iters=$(python3 -c "import json; d=json.load(open('$STATE_FILE')); print(d.get('total_iterations', 0))" 2>/dev/null || echo "0")
  local log_count
  log_count=$(ls "$LOG_DIR"/*.log 2>/dev/null | wc -l | tr -d ' ')
  if [[ "$state_iters" -gt "$((log_count + 5))" ]]; then
    echo "[harness] WARNING: state.total_iterations=$state_iters but log files=$log_count — state drift detected" >&2
  fi
}

# Sync git tags into state after builds
_sync_tags() {
  local tags_json
  tags_json=$(git tag --sort=v:refname 2>/dev/null | python3 -c "
import sys, json
tags = [t.strip() for t in sys.stdin if t.strip()]
print(json.dumps(tags))
") || tags_json="[]"
  python3 -c "
import json
with open('$STATE_FILE') as f: d = json.load(f)
d['tags_created'] = $tags_json
with open('$STATE_FILE', 'w') as f: json.dump(d, f, indent=2)
" 2>/dev/null || true
}

# Model selection per mode
_model_for() {
  case "$1" in
    build)        echo "$MODEL_BUILD" ;;
    plan)         echo "$MODEL_PLAN" ;;
    retro)        echo "$MODEL_RETRO" ;;
    quality-gate) echo "$MODEL_RETRO" ;;
    scout)        echo "$MODEL_SCOUT" ;;
    docs)         echo "$MODEL_PLAN" ;;
    spec)         echo "$MODEL_PLAN" ;;
    *)            echo "$MODEL_PLAN" ;;
  esac
}

# ── Mode prompts ───────────────────────────────────────────
get_prompt() {
  local mode="$1"; shift; local extra="${*:-}"

  case "$mode" in
    scout)
cat << 'SCOUTPROMPT'
# Scout Mode — Explore this codebase and set up Ralph infrastructure.

FIRST: Read RALPH_PROMPT.md COMPLETELY. It contains:
- System principles (how Ralph works)
- THE BIG PIVOT (17 worlds → one continuous experience)
- Taste axes from portpoo (the aesthetic fingerprint)
- Phase sequence (refactor → ideation → implementation)
- What's Ralphable vs human-taste
- Scout-specific instructions

This is NOT a generic web app. It's a scroll-driven cinematic WebGL experience for a composer. Every spec you write must serve the FEELING, not just the function.

## Parallelism: 5 subagents max at a time
RAM constraint. Run batches of 5 sequentially. Each batch should fully map one area.

## Phase 1: Map the codebase (Batch 1-3)

**Batch 1 (5 agents):** Core engine
- Agent 1: Read WorldEngine.js (988 lines) — map the orchestration pattern, config schema, subsystem wiring
- Agent 2: Read AtmosphereController.js — map the 5-keyframe interpolation, 38 params, emotional arc
- Agent 3: Read PostProcessingStack.js — map the 12-effect chain, performance cost of each
- Agent 4: Read CameraRig.js + ScrollEngine.js — map spline path, terrain following, Lenis integration
- Agent 5: Read CLAUDE.md — extract ALL 30+ learnings, design rules, known issues

**Batch 2 (5 agents):** Environment worlds — catalog EVERY subsystem across all 17 configs
- Agent 1: golden-meadow, ocean-cliff, night-meadow (the originals)
- Agent 2: storm-field, ghibli-painterly, aurora-tundra
- Agent 3: bioluminescent-deep, clockwork-forest, crystal-cavern
- Agent 4: floating-library, infinite-staircase, memory-garden
- Agent 5: paper-world, sonic-void, tide-pool, underwater-cathedral, volcanic-observatory

For EACH world config, extract: terrain type, unique subsystems, shader techniques, atmosphere keyframes, particle systems, post-FX recipe. Note which elements are UNIQUE vs duplicated.

**Batch 3 (5 agents):** Supporting systems
- Agent 1: All 97 shaders in src/meadow/shaders/ — catalog by category (terrain, particles, effects, lighting)
- Agent 2: Entry page, content overlay, MiniPlayer, routing
- Agent 3: Build system (Vite config, ESLint, package.json), bundle analysis
- Agent 4: Design philosophy docs in mks-design-philosophy/
- Agent 5: Git history (git log --oneline -40), existing specs in docs/superpowers/specs/

## Phase 2: Assess for the Big Pivot (Batch 4)

**Batch 4 (5 agents):** Consolidation analysis
- Agent 1: Identify the TOP 10 most impressive/unique subsystems across all 17 worlds (by visual impact, technical quality, emotional service)
- Agent 2: Identify ALL shared/duplicated code across configs (terrain algorithms, particle systems, atmosphere patterns)
- Agent 3: Map dispose/lifecycle gaps — which subsystems lack proper cleanup?
- Agent 4: Bundle analysis — what can be lazy-loaded? What's dead code?
- Agent 5: Read portpoo taste profile + technical taste notes — identify which portpoo techniques map to MKS subsystems

## Phase 3: Generate Infrastructure (Batch 5)

For each subsystem cataloged, include:
- **WHAT** it does (one sentence)
- **WHY** it exists (what emotional/visual purpose)
- **HOW** it works (key algorithm/technique)
- **HOW IT COULD IMPROVE** (what's generic that could become specific, anti-clustering)
- **REUSABILITY** for the unified experience (1-5 score)

**Generate specs focused on the phase sequence:**

### Refactor Specs (Phase 1 priority):
- `specs/bundle-splitting.md` — code splitting via dynamic import(), lazy subsystem loading
- `specs/subsystem-extraction.md` — extracting reusable subsystems from world-specific code
- `specs/dispose-lifecycle.md` — systematic cleanup audit across 99 files
- `specs/config-normalization.md` — unified config schema for scroll segments
- `specs/lint-cleanup.md` — fix 97 ESLint errors
- `specs/design-rule-enforcement.md` — no #000, prefers-reduced-motion, opacity-only transitions

### Ideation Specs (Phase 2):
- `specs/unified-scroll-arc.md` — the ONE continuous experience design
- `specs/research-integration.md` — integrating 72+ experiment winners + portpoo techniques
- `specs/algorithmic-art.md` — where mathematical legitimacy adds beauty (attractors, curl noise, Voronoi)
- `specs/front-end-design.md` — typography-as-environment, content surfacing, glass-card evolution

### Implementation Specs (Phase 3):
- `specs/composable-subsystems.md` — subsystem layer architecture for unified scroll
- `specs/source-research.md` — finding and integrating real GitHub source code
- `specs/performance-optimization.md` — progressive loading, tier scaling, FX budget

**Update specs/README.md (the Pin)** with MANY descriptive words per entry.

**Update scripts/verify-all.sh** — add/refine sections based on what you find. The current version has 6 sections and 33 checks. Add more if you find gaps.

**Write SCOUT_REPORT.md** with:
- Codebase summary (language, framework, LOC, maturity)
- Structure map (directory tree with purpose annotations)
- Subsystem catalog (the full inventory across all 17 worlds with reusability scores)
- Top 10 most impressive subsystems (the keepers for consolidation)
- Redundancy map (what's duplicated, what can be merged)
- Dispose/lifecycle gap list
- Bundle breakdown (what's heavy, what can be split)
- Portpoo technique crosswalk (which taste notes map to which MKS subsystems)
- Ralph Readiness Score (1-10)
- Recommended harness config
- Commit everything.

## Rules
- Be thorough but context-efficient. Don't dump raw file contents — extract meaning.
- Use real commands, real paths, real techniques — not placeholders.
- Every spec must have the WHY, not just the WHAT.
- Classify every spec task as Ralphable or Human-Taste using the Generation Effect framework.
- The project has no test framework. Testing = build passes + lint passes + verify-all.sh + visual verification.
- AGENTS.md is already filled in. Update it if you learn something new, but don't overwrite.
- specs/EXAMPLE-SPEC.md is already deleted.
SCOUTPROMPT
      ;;

    plan)
      cat PROMPT_plan.md
      ;;

    build)
      cat PROMPT_build.md
      ;;

    retro)
cat << RETROPROMPT
RETROSPECTIVE: Analyze patterns across recent build iterations.

1. Read state/logs/ (last 5-10 iteration logs)
2. Read git log --oneline -20
3. Read IMPLEMENTATION_PLAN.md (done vs remaining)
4. Read findings/learnings/ and findings/retrospectives/ (do not repeat prior findings)

ANALYZE for:
- Recurring failures — Ralph getting stuck on the same thing? Add a guardrail.
- Pattern drift — implementation diverging from specs? Update specs or add tests.
- Velocity — tasks getting slower? Scope too big, split specs.
- Mock gaps — mocks not realistic enough? Will break going live.
- Missing specs — implementation revealed requirements specs don't cover? Draft specs.
- What worked well — what should we keep doing?

OUTPUT:
1. Write findings/retrospectives/$(date +%Y-%m-%d)-retro.md with findings
2. If guardrails needed — append numbered rules to PROMPT_build.md (999, 9999, etc.)
3. If spec updates needed — update the specs/* files
4. If learnings found — append to findings/learnings/patterns.md (create if missing)
5. If priorities should change — update IMPLEMENTATION_PLAN.md
6. Commit everything

This is the system's self-improvement loop. Be honest about what's going wrong.
RETROPROMPT
      ;;

    quality-gate)
cat << QAPROMPT
QUALITY GATE: Verify that what was built actually matches specs.

For EACH spec in specs/* that has corresponding code:
  a. Read the spec's acceptance criteria
  b. Read the implementation
  c. Run the verification commands listed in the spec
  d. Grade: PASS (all ACs met) / PARTIAL (some met) / FAIL (broken or missing)

Run scripts/verify-all.sh. Check for regressions.
Check git log for recent commits — did anything break?

OUTPUT:
1. Write findings/quality-gates/$(date +%Y-%m-%d)-qa.md with:
   - Per-spec grades table
   - Test suite results
   - Regression check
   - Readiness score (X/N specs passing)
2. If FAILs found — add fix tasks to TOP of IMPLEMENTATION_PLAN.md (regressions > new features)
3. If PARTIALs found — note what's missing in IMPLEMENTATION_PLAN.md
4. Commit the QA report

Regressions take priority over new work. Fix what's broken before building more.
QAPROMPT
      ;;

    spec)
cat << SPECPROMPT
SPEC GENERATION for: $extra

1. Study specs/README.md (the Pin) and existing specs/* to understand conventions and avoid overlap.
2. Study the codebase — architecture, patterns, dependencies, existing related functionality.
3. Think through the feature:
   - What does it need to do? What are the acceptance criteria?
   - What existing code does it touch? What new code does it need?
   - What external dependencies? Can they be mocked?
   - Edge cases? What could go wrong?
4. Write specs/[feature-name].md with:
   - What This Is (one sentence)
   - Acceptance Criteria (checkboxes — specific, testable by a command)
   - Specification (architecture, data flow, decisions)
   - Dependencies
   - Verification (exact commands to verify each AC)
5. Update specs/README.md (the Pin) — add an entry with MANY descriptive words.
6. Commit both files.

Specs must be specific and testable. Every AC should be verifiable by a command.
SPECPROMPT
      ;;

    docs)
cat << 'DOCSPROMPT'
ARCHITECTURE DOCS: Generate documentation from WHAT ACTUALLY EXISTS.

Study the entire codebase using subagents. Generate:
- findings/architecture/SYSTEM-OVERVIEW.md — summary, architecture, data flow, current state
- findings/architecture/DATA-MODEL.md — tables, relationships, data flow between components
- findings/architecture/DECISION-LOG.md — decisions from git log and retros (date | decision | why | outcome)

This is for humans to understand what the system IS — not what it aspires to be.
Commit all docs.
DOCSPROMPT
      ;;

    status)
cat << 'STATUSPROMPT'
STATUS: Report on current state.

1. Read IMPLEMENTATION_PLAN.md — how many tasks done vs remaining?
2. Check what exists and works (run scripts/verify-all.sh if it has real sections)
3. Check git log --oneline -10 for recent activity
4. Report: what works, what's next, any blockers

Be concise.
STATUSPROMPT
      ;;

    ask)
      echo "Answer this based on actual code state (read files as needed, don't assume): $extra"
      ;;
  esac
}

# ── Run a mode ─────────────────────────────────────────────
HARNESS_LAST_LOG=""  # Tracked for retro validation

run_mode() {
  local mode="$1"; shift; local extra="${*:-}"
  local timestamp=$(date '+%Y-%m-%d_%H-%M-%S')
  local log="$LOG_DIR/${timestamp}_${mode}.log"
  HARNESS_LAST_LOG="$log"
  local model=$(_model_for "$mode")

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  MODE:  $mode"
  echo "  Model: $model"
  echo "  Time:  $(date '+%Y-%m-%d %H:%M:%S')"
  echo "  Log:   $log"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  # Write prompt to temp file (avoids pipe truncation on large prompts)
  local prompt_file
  prompt_file=$(mktemp)

  # Assemble conductor prompt: state context + mode instructions + guardrails
  local state_json
  state_json=$(cat "$STATE_FILE" 2>/dev/null || echo '{}')

  cat > "$prompt_file" << CONDUCTOR_HEADER
# Ralph Conductor — $mode mode

## Current State
$state_json

## Source of Truth
- RALPH_PROMPT.md — system context: first principles, eval design, file layout, rules
- specs/README.md — THE PIN: lookup table for all specs (read FIRST)
- specs/* — specification files with acceptance criteria
- IMPLEMENTATION_PLAN.md — prioritized task list with linkage to specs
- AGENTS.md — operational guide (how to build/test/run)
- AUDIENCE_JTBD.md — who we're building for

## Instructions
CONDUCTOR_HEADER

  get_prompt "$mode" "$extra" >> "$prompt_file"

  # Append guardrails from PROMPT_build.md (always present)
  if [[ -f "PROMPT_build.md" ]]; then
    local guardrails
    guardrails=$(grep -E '^[0-9]+\.' PROMPT_build.md 2>/dev/null || true)
    if [[ -n "$guardrails" ]]; then
      echo "" >> "$prompt_file"
      echo "## Guardrails" >> "$prompt_file"
      echo "$guardrails" >> "$prompt_file"
    fi
  fi

  claude -p \
    --dangerously-skip-permissions \
    --model "$model" \
    --verbose \
    < "$prompt_file" 2>&1 | tee "$log"

  local exit_code=${PIPESTATUS[0]:-0}
  rm -f "$prompt_file"

  # Push if there are changes
  if ! git diff --quiet HEAD 2>/dev/null; then
    local branch=$(git branch --show-current)
    git push origin "$branch" 2>/dev/null || git push -u origin "$branch" 2>/dev/null || true
  fi

  return $exit_code
}

# ── Autonomous flow ────────────────────────────────────────
run_auto() {
  init_state
  local iteration=0

  echo ""
  echo "========================================================"
  echo "  AUTONOMOUS RALPH HARNESS | Build: $MODEL_BUILD | Plan: $MODEL_PLAN"
  echo "  Ctrl+C to stop"
  echo "========================================================"
  echo ""

  while true; do
    iteration=$((iteration + 1))
    local bc=$(rs build_since_last_plan 0)
    local rc=$(rs builds_since_last_retro 0)
    local qc=$(rs builds_since_last_qa 0)

    # Decide mode (priority order)
    local mode="build"
    if [[ ! -f "IMPLEMENTATION_PLAN.md" ]]; then
      echo "[harness] No IMPLEMENTATION_PLAN.md found -> PLAN mode"
      mode="plan"
    elif [[ "$qc" -ge "$QA_EVERY" ]]; then
      echo "[harness] $qc builds since last QA -> QUALITY GATE mode"
      mode="quality-gate"
    elif [[ "$rc" -ge "$RETRO_EVERY" ]]; then
      echo "[harness] $rc builds since last retro -> RETROSPECTIVE mode"
      mode="retro"
    elif [[ "$bc" -ge "$MAX_BUILD_BEFORE_REPLAN" ]]; then
      echo "[harness] $bc builds since last plan -> RE-PLAN mode"
      mode="plan"
    fi

    echo ""
    echo "════════════════════════════════════════════════════════"
    echo "  ITERATION $iteration | $mode | build:$bc retro:$rc qa:$qc"
    echo "════════════════════════════════════════════════════════"

    run_mode "$mode"

    # Post-replan: also generate architecture docs
    if [[ "$mode" == "plan" && "$bc" -ge "$MAX_BUILD_BEFORE_REPLAN" ]]; then
      echo "[harness] Re-plan complete -> generating architecture docs..."
      run_mode docs
    fi

    # Validate retro was substantive (>100 bytes = real output, not a crash)
    local retro_valid=true
    if [[ "$mode" == "retro" ]]; then
      local log_size=0
      if [[ -n "${HARNESS_LAST_LOG:-}" && -f "$HARNESS_LAST_LOG" ]]; then
        log_size=$(wc -c < "$HARNESS_LAST_LOG" | tr -d ' ')
      fi
      if [[ "$log_size" -lt 100 ]]; then
        echo "[harness] WARNING: retro log only ${log_size} bytes — retro incomplete, counter NOT reset"
        retro_valid=false
      fi
    fi

    # Sync git tags after builds
    [[ "$mode" == "build" ]] && _sync_tags

    # Validate state integrity
    _validate_state

    # Update state
    us total_iterations "$(($(rs total_iterations 0) + 1))"
    us last_mode "'$mode'"
    us last_run "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"

    case "$mode" in
      plan)          us build_since_last_plan 0 ;;
      retro)         if [[ "$retro_valid" == "true" ]]; then
                       us builds_since_last_retro 0
                       us retros_completed "$(($(rs retros_completed 0) + 1))"
                     fi ;;
      quality-gate)  us builds_since_last_qa 0
                     us qa_gates_completed "$(($(rs qa_gates_completed 0) + 1))" ;;
      build)         us build_since_last_plan "$((bc + 1))"
                     us builds_since_last_retro "$((rc + 1))"
                     us builds_since_last_qa "$((qc + 1))" ;;
    esac

    echo ""
    echo "[harness] Iteration #$iteration complete. Sleeping 3s..."
    sleep 3
  done
}

# ── Entry point ────────────────────────────────────────────
init_state

case "${1:-}" in
  "")
    # First run: scout -> plan -> auto
    if [[ ! -f "SCOUT_REPORT.md" ]]; then
      echo "[harness] First run detected — scouting codebase..."
      run_mode scout
    fi
    if [[ ! -f "IMPLEMENTATION_PLAN.md" ]]; then
      echo "[harness] No plan — generating from specs..."
      run_mode plan
      us build_since_last_plan 0
    fi
    run_auto
    ;;
  auto)       run_auto ;;
  scout)      run_mode scout
              us total_iterations "$(($(rs total_iterations 0) + 1))"
              us last_mode "'scout'"
              us last_run "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'" ;;
  plan)       run_mode plan
              us total_iterations "$(($(rs total_iterations 0) + 1))"
              us last_mode "'plan'"
              us last_run "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
              us build_since_last_plan 0 ;;
  build)      run_mode build
              _sync_tags
              us total_iterations "$(($(rs total_iterations 0) + 1))"
              us last_mode "'build'"
              us last_run "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
              us build_since_last_plan "$(($(rs build_since_last_plan 0) + 1))"
              us builds_since_last_retro "$(($(rs builds_since_last_retro 0) + 1))"
              us builds_since_last_qa "$(($(rs builds_since_last_qa 0) + 1))" ;;
  retro)      run_mode retro
              us total_iterations "$(($(rs total_iterations 0) + 1))"
              us last_mode "'retro'"
              us last_run "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
              us builds_since_last_retro 0 ;;
  qa)         run_mode quality-gate
              us total_iterations "$(($(rs total_iterations 0) + 1))"
              us last_mode "'quality-gate'"
              us last_run "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
              us builds_since_last_qa 0 ;;
  spec)       shift; [[ -z "${1:-}" ]] && { echo "Usage: ./harness.sh spec \"feature description\""; exit 1; }
              run_mode spec "$*" ;;
  docs)       run_mode docs
              us total_iterations "$(($(rs total_iterations 0) + 1))"
              us last_mode "'docs'"
              us last_run "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'" ;;
  status)     run_mode status ;;
  ask)        shift; [[ -z "${1:-}" ]] && { echo "Usage: ./harness.sh ask \"question\""; exit 1; }
              run_mode ask "$*" ;;
  help|--help|-h|*)
    echo "Ralph Harness — Autonomous Build Loop"
    echo ""
    echo "Usage:"
    echo "  ./harness.sh              First run: scout -> plan -> auto loop"
    echo "  ./harness.sh auto         Resume auto loop"
    echo "  ./harness.sh scout        Explore codebase, generate specs + fill AGENTS.md"
    echo "  ./harness.sh plan         Generate/update implementation plan"
    echo "  ./harness.sh build        One build iteration"
    echo "  ./harness.sh retro        Retrospective (pattern analysis)"
    echo "  ./harness.sh qa           Quality gate (spec compliance)"
    echo "  ./harness.sh spec \"...\"   Generate a spec from description"
    echo "  ./harness.sh docs         Generate architecture docs"
    echo "  ./harness.sh status       Current state report"
    echo "  ./harness.sh ask \"...\"    Ask about the system"
    echo ""
    echo "Flow: scout -> plan -> build x10 -> retro -> build x3 -> qa -> re-plan + docs -> ..."
    echo ""
    echo "Models (all opus by default, override per mode):"
    echo "  RALPH_MODEL_BUILD=opus     Builds"
    echo "  RALPH_MODEL_PLAN=opus      Planning + docs + specs"
    echo "  RALPH_MODEL_RETRO=opus     Retro + QA"
    echo "  RALPH_MODEL_SCOUT=opus     Scout"
    echo ""
    echo "Screwdriver first (one iteration by hand):"
    echo "  cat PROMPT_build.md | claude -p --model opus --dangerously-skip-permissions --verbose"
    ;;
esac
