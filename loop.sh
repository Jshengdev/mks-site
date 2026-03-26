#!/bin/bash
# Ralph Wiggum Loop — deterministically malicking the array.
# Each iteration: fresh context window, one task, commit, restart.
#
# Usage:
#   ./loop.sh                   # Build loop (infinite)
#   ./loop.sh 5                 # Build loop, max 5 iterations
#   ./loop.sh plan              # Plan mode
#   ./loop.sh plan-work "scope" # Scoped planning

set -euo pipefail
cd "$(dirname "$0")"

MODEL_BUILD="${RALPH_MODEL_BUILD:-opus}"
MODEL_PLAN="${RALPH_MODEL_PLAN:-opus}"
MODE="build"
PROMPT_FILE="PROMPT_build.md"

if [ "${1:-}" = "plan" ]; then
    MODE="plan"; PROMPT_FILE="PROMPT_plan.md"; MAX=${2:-0}
elif [ "${1:-}" = "plan-work" ]; then
    [[ -z "${2:-}" ]] && { echo "Usage: ./loop.sh plan-work \"scope\""; exit 1; }
    MODE="plan-work"; WORK_DESCRIPTION="$2"; PROMPT_FILE="PROMPT_plan_work.md"; MAX=${3:-5}
elif [[ "${1:-}" =~ ^[0-9]+$ ]]; then
    MAX=$1
else
    MAX=0
fi

# Select model based on mode (sonnet for build, opus for planning)
MODEL="$MODEL_BUILD"
[[ "$MODE" == "plan" || "$MODE" == "plan-work" ]] && MODEL="$MODEL_PLAN"

ITERATION=0
BRANCH=$(git branch --show-current)

echo "=========================================="
echo "  RALPH WIGGUM LOOP"
echo "  Mode:   $MODE | Model: $MODEL"
echo "  Branch: $BRANCH"
echo "  Max:    $([ "$MAX" -gt 0 ] && echo "$MAX" || echo "unlimited")"
echo "  Start:  $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

while true; do
    [[ "$MAX" -gt 0 ]] && [[ "$ITERATION" -ge "$MAX" ]] && { echo "Done: $MAX iterations"; break; }
    echo -e "\n======================== LOOP $((ITERATION + 1)) ========================"
    echo "  $(date '+%Y-%m-%d %H:%M:%S')"

    if [ "$MODE" = "plan-work" ]; then
        export WORK_SCOPE="$WORK_DESCRIPTION"
        envsubst < "$PROMPT_FILE" | claude -p --dangerously-skip-permissions --model "$MODEL" --verbose
    else
        cat "$PROMPT_FILE" | claude -p --dangerously-skip-permissions --model "$MODEL" --verbose
    fi

    git push origin "$BRANCH" 2>/dev/null || git push -u origin "$BRANCH" 2>/dev/null || true
    ITERATION=$((ITERATION + 1))
    echo -e "\n======================== LOOP $ITERATION COMPLETE ========================\n"
done
