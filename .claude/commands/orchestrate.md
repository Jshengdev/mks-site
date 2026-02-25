# MKS Orchestration — Launch Command

You are the orchestrator for the MKS website build. Your job is to coordinate 5 parallel Claude Code workers building a scroll-driven cinematic website for composer Michael Kim Sheng.

## STEP 1: Load Your Context

Read these files in order:

1. `/Users/johnnysheng/mks/orchestration/steps/starting-instructions.md` — How this system works
2. `/Users/johnnysheng/mks/orchestration/steps/CONFIG.md` — File locations and worker assignments
3. `/Users/johnnysheng/mks/orchestration/shared/SESSION_STATE.md` — Current progress
4. `/Users/johnnysheng/mks/orchestration/shared/PROJECT_CONTEXT.md` — Full project context
5. `/Users/johnnysheng/mks/orchestration/shared/COMPONENT_REGISTRY.md` — What's been built

## STEP 2: Understand the User's Intent

Ask the user: **"What phase should we start from?"**

Options:
- **Fresh start** — Run from Phase 1 (init tmux, create worktrees, start workers)
- **Resume** — Check SESSION_STATE.md and pick up where we left off
- **Specific phase** — User names a phase (1-5) to jump to

If the user provides additional context with `/orchestrate`, incorporate it: $ARGUMENTS

## STEP 3: Set Up the Environment

Based on the phase, follow the appropriate step file:
- Phase 1: `steps/step-1-init.md` + `steps/step-2-foundation.md`
- Phase 2: `steps/step-3-parallel-build.md`
- Phase 3: `steps/step-4-integration.md`
- Phase 4: `steps/step-5-polish.md`

### tmux Setup (Phase 1 only)

Run these commands to create the tmux session:

```bash
tmux new-session -d -s mks -n orchestrator
tmux new-window -t mks -n w1-foundation
tmux new-window -t mks -n w2-landing-music
tmux new-window -t mks -n w3-about-store
tmux new-window -t mks -n w4-ambient-effects
tmux new-window -t mks -n w5-scroll-integration
tmux select-window -t mks:0
```

### Git Worktrees (Phase 1 only)

```bash
cd /Users/johnnysheng/mks/mks-site
mkdir -p /Users/johnnysheng/mks/worktrees
git worktree add /Users/johnnysheng/mks/worktrees/w1 -b w1-foundation
git worktree add /Users/johnnysheng/mks/worktrees/w2 -b w2-landing-music
git worktree add /Users/johnnysheng/mks/worktrees/w3 -b w3-about-store
git worktree add /Users/johnnysheng/mks/worktrees/w4 -b w4-ambient-effects
git worktree add /Users/johnnysheng/mks/worktrees/w5 -b w5-scroll-integration
```

### Launch Workers

For each worker (1-5), send to their tmux window:

```bash
tmux send-keys -t mks:N "cd /Users/johnnysheng/mks/worktrees/wN && claude --dangerously-skip-permissions" Enter
```

Wait for Claude to load (~5 seconds), then send the initial prompt:

```bash
tmux send-keys -t mks:N "Read /Users/johnnysheng/mks/orchestration/workers/wN-NAME/CLAUDE.md for your identity. Read /Users/johnnysheng/mks/orchestration/shared/PROJECT_CONTEXT.md for project context. Then read /Users/johnnysheng/mks/orchestration/workers/wN-NAME/TASK.md for your current task. Execute the task within your file scope. When done, write DONE.md, FILES.md, and NEEDS.md to your output/ directory." Enter
```

## STEP 4: Monitor and Verify

After launching workers:

1. **Poll worker output** — Check each `workers/wN/output/DONE.md` periodically
2. **Verify builds** — Run `npm run build` in each worktree as workers complete
3. **Review diffs** — Check `git diff` in each worktree to verify quality
4. **Check design compliance** — Does the output match the 10 Commandments?

## STEP 5: Update State

After each phase completes:

1. Update `shared/SESSION_STATE.md` with current status
2. Update `shared/COMPONENT_REGISTRY.md` with completed components
3. Commit worker branches and merge as needed (see step files)

## STEP 6: Assign Next Phase

Write new TASK.md files for the next phase and send workers their new prompts.

## When Done

Run `/save-details` to preserve all session state for next time.
