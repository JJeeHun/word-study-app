---
name: writing-skills
description: Use when creating new skills, editing existing skills, or verifying skills work before deployment
---

# Writing Skills

Writing skills IS TDD applied to process documentation.

RED (baseline without skill) → GREEN (write skill) → REFACTOR (close loopholes)

**Personal skills:** `~/.claude/skills` for Claude Code

## What is a Skill?

A reusable reference guide for proven techniques, patterns, or tools.

**Skills are:** Reusable techniques, patterns, reference guides  
**Skills are NOT:** Narratives about how you solved a problem once

## SKILL.md Structure

```markdown
---
name: skill-name-with-hyphens
description: Use when [specific triggering conditions — NOT workflow summary]
---

# Skill Name

## Overview
## When to Use
## Core Pattern
## Quick Reference
## Common Mistakes
```

## Description Field Rules

**CRITICAL:** Description = When to Use ONLY. Never summarize the skill's workflow.

```yaml
# ❌ BAD: Summarizes workflow — Claude follows description instead of reading skill
description: Use when executing plans — dispatches subagent per task with code review

# ✅ GOOD: Triggering conditions only
description: Use when executing implementation plans with independent tasks in the current session
```

Start with "Use when...". Third person. Under 500 characters.

## Token Efficiency

- getting-started skills: <150 words
- Frequently-loaded skills: <200 words
- Others: <500 words

## TDD Cycle for Skills

**RED:** Run pressure scenario WITHOUT skill → document exact rationalizations  
**GREEN:** Write minimal skill addressing those specific failures → verify agents comply  
**REFACTOR:** Find new rationalizations → add explicit counters → re-test until bulletproof

## Iron Law

```
NO SKILL WITHOUT A FAILING TEST FIRST
```

Same as code TDD. No exceptions.

## Creation Checklist

- [ ] RED: Run baseline scenarios, document rationalizations
- [ ] Name: letters, numbers, hyphens only
- [ ] Description: "Use when...", triggering conditions only, third person
- [ ] GREEN: Write skill, verify agents comply
- [ ] REFACTOR: Add rationalization table, red flags list
- [ ] Commit
