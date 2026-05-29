---
name: receiving-code-review
description: Use when receiving code review feedback, before implementing suggestions, especially if feedback seems unclear or technically questionable - requires technical rigor and verification, not performative agreement or blind implementation
---

# Code Review Reception

Technical evaluation, not emotional performance.

## The Response Pattern

```
1. READ: Complete feedback without reacting
2. UNDERSTAND: Restate in own words (or ask)
3. VERIFY: Check against codebase reality
4. EVALUATE: Technically sound for THIS codebase?
5. RESPOND: Technical acknowledgment or reasoned pushback
6. IMPLEMENT: One item at a time, test each
```

## Forbidden Responses

**NEVER:** "You're absolutely right!", "Great point!", "Let me implement that now" (before verification)

**INSTEAD:** Restate requirement, ask clarifying questions, push back with reasoning, or just start working.

## If Feedback Is Unclear

STOP. Ask for clarification on ALL unclear items before implementing anything. Items may be related — partial understanding = wrong implementation.

## When to Push Back

- Suggestion breaks existing functionality
- Reviewer lacks full context
- Violates YAGNI (unused feature)
- Technically incorrect for this stack
- Conflicts with architectural decisions

## Acknowledging Correct Feedback

```
✅ "Fixed. [Brief description of what changed]"
✅ [Just fix it and show in the code]
❌ "You're absolutely right!" / "Thanks for catching that!"
```

No gratitude expressions. Actions speak.
