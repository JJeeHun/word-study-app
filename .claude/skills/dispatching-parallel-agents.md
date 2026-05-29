---
name: dispatching-parallel-agents
description: Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies
---

# Dispatching Parallel Agents

When multiple unrelated failures exist, investigating sequentially wastes time. Dispatch one agent per independent problem domain.

## When to Use

- 3+ test files failing with different root causes
- Multiple subsystems broken independently
- No shared state between investigations

## When NOT to Use

- Failures are related (fix one might fix others)
- Agents would edit same files
- Need full system state to understand

## The Pattern

1. **Identify independent domains** — group failures by what's broken
2. **Create focused agent tasks** — each gets: specific scope, clear goal, constraints, expected output
3. **Dispatch in parallel**
4. **Review and integrate** — verify fixes don't conflict, run full suite

## Good Agent Prompt Structure

- **Focused** — one clear problem domain
- **Self-contained** — all context needed
- **Specific output** — what should agent return?
- **Constraints** — "Do NOT change other code"

```
❌ Too broad: "Fix all the tests"
✅ Specific: "Fix agent-tool-abort.test.ts — 3 failing tests: [list with expected behavior]"
```

## After Agents Return

1. Review each summary
2. Check for conflicts (same files edited?)
3. Run full suite
4. Spot check — agents can make systematic errors
