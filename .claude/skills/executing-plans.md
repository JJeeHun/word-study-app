---
name: executing-plans
description: Use when you have a written implementation plan to execute in a separate session with review checkpoints
---

# Executing Plans

Load plan, review critically, execute all tasks, report when complete.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

**Note:** Prefer superpowers:subagent-driven-development if subagents are available — higher quality.

## Process

1. **Load and Review Plan** — read file, identify concerns, raise before starting, create TodoWrite
2. **Execute Tasks** — mark in_progress → follow steps exactly → run verifications → mark completed
3. **Complete** — invoke superpowers:finishing-a-development-branch

## When to Stop

- Hit a blocker (missing dependency, test fails, unclear instruction)
- Verification fails repeatedly
- Don't understand an instruction

**Ask for clarification rather than guessing.**

## Required Skills

- superpowers:using-git-worktrees — REQUIRED before starting
- superpowers:finishing-a-development-branch — REQUIRED after completion
