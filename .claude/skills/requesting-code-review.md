---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements
---

# Requesting Code Review

Dispatch code-reviewer subagent to catch issues before they cascade.

## When to Request

**Mandatory:**
- After each task in subagent-driven development
- After completing major feature
- Before merge to main

## How to Request

1. Get git SHAs:
```bash
BASE_SHA=$(git rev-parse HEAD~1)
HEAD_SHA=$(git rev-parse HEAD)
```

2. Dispatch code-reviewer subagent with:
   - What was implemented
   - Plan/requirements it should meet
   - BASE_SHA and HEAD_SHA

3. Act on feedback:
   - **Critical** → fix immediately
   - **Important** → fix before proceeding
   - **Minor** → note for later
   - Push back if reviewer is wrong (with technical reasoning)

## Red Flags — Never

- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Important issues
