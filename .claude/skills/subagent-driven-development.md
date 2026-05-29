---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session
---

# Subagent-Driven Development

Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration.

**Core principle:** Subagents get isolated context you construct precisely. They never inherit your session history.

## Process

1. Read plan, extract all tasks with full text, create TodoWrite
2. Per task:
   - Dispatch implementer subagent (full task text + context)
   - If subagent asks questions → answer, re-dispatch
   - Dispatch spec compliance reviewer → fixes if issues → re-review until ✅
   - Dispatch code quality reviewer → fixes if issues → re-review until ✅
   - Mark task complete
3. After all tasks → dispatch final reviewer → superpowers:finishing-a-development-branch

## Implementer Status Handling

- **DONE** → proceed to spec review
- **DONE_WITH_CONCERNS** → read concerns, address if correctness issue, then review
- **NEEDS_CONTEXT** → provide missing info, re-dispatch
- **BLOCKED** → provide more context / upgrade model / break task smaller / escalate to human

## Model Selection

- 1-2 files, clear spec → cheap/fast model
- Multi-file integration → standard model
- Architecture/design/review → most capable model

## Red Flags — Never

- Start on main/master without explicit consent
- Skip spec compliance review OR code quality review
- Proceed with unfixed issues
- Dispatch parallel implementation subagents (conflicts)
- Make subagent read plan file (provide full text instead)
- Accept "close enough" on spec compliance
- Start code quality review before spec compliance is ✅
