---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes
---

# Systematic Debugging

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

**Violating the letter of this process is violating the spirit of debugging.**

## Four Phases (complete each before next)

### Phase 1: Root Cause Investigation
1. Read error messages completely (stack traces, line numbers, error codes)
2. Reproduce consistently — exact steps, every time
3. Check recent changes — git diff, new dependencies, config changes
4. Gather evidence at each component boundary (log what enters/exits each layer)
5. Trace data flow — where does bad value originate? Keep tracing up to source.

### Phase 2: Pattern Analysis
- Find working examples similar to broken code
- Compare against references completely (read every line)
- List every difference, however small

### Phase 3: Hypothesis and Testing
- State clearly: "I think X is root cause because Y"
- Make SMALLEST possible change to test hypothesis
- One variable at a time
- Didn't work? Form NEW hypothesis. Don't add more fixes on top.

### Phase 4: Implementation
1. Create failing test reproducing bug
2. Implement single fix (root cause, not symptom)
3. Verify fix
4. **If 3+ fixes failed → STOP. Question the architecture.** Discuss with human partner.

## Red Flags — STOP

- "Quick fix for now, investigate later"
- "Just try changing X and see"
- "It's probably X, let me fix that"
- Proposing solutions before tracing data flow
- "One more fix attempt" (when already tried 2+)

**All mean: Return to Phase 1.**
