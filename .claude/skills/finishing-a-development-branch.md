---
name: finishing-a-development-branch
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work - guides completion of development work by presenting structured options for merge, PR, or cleanup
---

# Finishing a Development Branch

**Announce at start:** "I'm using the finishing-a-development-branch skill to complete this work."

## Process

### Step 1: Verify Tests

```bash
npm test  # or equivalent
```

If tests fail → stop, show failures, cannot proceed.

### Step 2: Present 4 Options

```
Implementation complete. What would you like to do?

1. Merge back to <base-branch> locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work

Which option?
```

### Step 3: Execute Choice

**Option 1 — Merge locally:**
```bash
git checkout <base-branch> && git pull && git merge <feature-branch>
# verify tests → git branch -d <feature-branch>
```
Then cleanup worktree.

**Option 2 — Push + PR:**
```bash
git push -u origin <feature-branch>
gh pr create --title "<title>" --body "..."
```
Keep worktree (don't cleanup).

**Option 3 — Keep as-is:** Keep worktree.

**Option 4 — Discard:** Require typed `discard` confirmation → delete branch → cleanup worktree.

## Quick Reference

| Option | Cleanup Worktree? |
|--------|------------------|
| 1. Merge locally | ✅ |
| 2. Create PR | ❌ |
| 3. Keep as-is | ❌ |
| 4. Discard | ✅ |

## Red Flags — Never

- Proceed with failing tests
- Skip confirmation for Option 4
- Auto-cleanup worktree for Options 2 & 3
