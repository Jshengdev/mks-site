# Save Session Details — End-of-Session Preservation

You MUST run this at the end of every orchestration session. It saves the current state so the next session can resume exactly where you left off.

## What to Save

### 1. Update SESSION_STATE.md

Read the current state at `/Users/johnnysheng/mks/orchestration/shared/SESSION_STATE.md` and UPDATE it with:

- **Current Phase:** Which phase are we in? (1-5, or "complete")
- **Worker Status:** For each worker (W1-W5), record: idle / in-progress / done / error
- **Current Task:** What task each worker is currently working on or last completed
- **Branch Status:** Which branches exist, which are merged
- **Last Updated:** Current timestamp

### 2. Update COMPONENT_REGISTRY.md

Read `/Users/johnnysheng/mks/orchestration/shared/COMPONENT_REGISTRY.md` and UPDATE the checklist:

- Check off `[x]` for any completed components
- Mark `[~]` for in-progress components
- Add notes for any blockers or issues

### 3. Update CONFIG.md

Read `/Users/johnnysheng/mks/orchestration/steps/CONFIG.md` and UPDATE:

- **Last Updated** date
- **Phase** number
- **Session** count (increment by 1)
- Any new files or directories that were created during this session

### 4. Collect Worker Outputs

For each worker (W1-W5), check their output directory:

```
/Users/johnnysheng/mks/orchestration/workers/wN-NAME/output/
```

Read DONE.md, FILES.md, NEEDS.md from each worker that completed work.
Summarize findings in:

```
/Users/johnnysheng/mks/orchestration/output/session-log.md
```

Format:

```markdown
# Session Log — [DATE]

## Phase Completed: [N]

## Worker Summaries

### W1 — Foundation
- Status: [done/in-progress/idle]
- Completed: [summary from DONE.md]
- Files: [from FILES.md]
- Needs: [from NEEDS.md]

### W2 — Landing+Music
...

### W3 — About+Store
...

### W4 — Ambient Effects
...

### W5 — Scroll Engine
...

## Build Status
- Main branch builds: [yes/no]
- Dev server runs: [yes/no]
- Visual check: [notes]

## Open Issues
- [any unresolved problems]

## Next Session Should
1. [first thing to do]
2. [second thing to do]
3. [etc.]
```

### 5. Commit All State

```bash
cd /Users/johnnysheng/mks
git add orchestration/
git commit -m "chore: save orchestration session state — Phase [N]"
```

If the orchestration directory is not in a git repo, just ensure files are saved.

### 6. Report to User

After saving, tell the user:
- What phase was completed
- What the next session should start with
- Any blockers or issues discovered
- The file paths where state was saved

$ARGUMENTS
