---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from current workspace or before executing implementation plans - creates isolated git worktrees with smart directory selection and safety verification
---

# Using Git Worktrees

**Announce at start:** "I'm using the using-git-worktrees skill to set up an isolated workspace."

## Directory Selection (priority order)

1. Check existing: `.worktrees/` → `worktrees/` (if found, use it)
2. Check CLAUDE.md for preference
3. Ask user if neither exists

## Safety Verification (project-local only)

```bash
git check-ignore -q .worktrees
```

If NOT ignored → add to `.gitignore` + commit → then create worktree.

## Creation Steps

```bash
git worktree add .worktrees/<branch-name> -b <branch-name>
cd .worktrees/<branch-name>

# Auto-detect setup
[ -f package.json ] && npm install
[ -f Cargo.toml ] && cargo build
[ -f requirements.txt ] && pip install -r requirements.txt

# Verify clean baseline
npm test  # or equivalent
```

If tests fail → report + ask whether to proceed.

## Quick Reference

| Situation | Action |
|-----------|--------|
| `.worktrees/` exists | Use it (verify ignored) |
| Neither exists | Check CLAUDE.md → Ask user |
| Not ignored | Add to .gitignore + commit |
| Tests fail at baseline | Report + ask |

## Red Flags — Never

- Create without verifying it's ignored (project-local)
- Skip baseline test verification
- Assume directory location when ambiguous
