---
name: test-driven-development
description: Use when implementing any feature or bugfix, before writing implementation code
---

# Test-Driven Development (TDD)

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Write code before the test? Delete it. Start over. No exceptions.

**Violating the letter of the rules is violating the spirit of the rules.**

## Red-Green-Refactor

### RED — Write Failing Test
One minimal test. Clear name. Tests real behavior. One thing.

### Verify RED — Watch It Fail (MANDATORY)
```bash
npm test path/to/test.test.ts
```
- Test fails (not errors)
- Fails because feature missing (not typos)
- Test passes? You're testing existing behavior. Fix test.

### GREEN — Minimal Code
Write simplest code to pass. Don't add features, refactor, or "improve" beyond the test.

### Verify GREEN — Watch It Pass (MANDATORY)
All tests pass. Output pristine.

### REFACTOR — Clean Up
Remove duplication, improve names. Keep tests green. Don't add behavior.

## Red Flags — STOP and Start Over

- Code before test
- "I already manually tested it"
- "Tests after achieve the same purpose"
- "Deleting X hours of work is wasteful" (sunk cost fallacy)
- "TDD is dogmatic, I'm being pragmatic"
- "This is different because..."
- "Keep as reference" or "adapt existing code"

**All mean: Delete code. Start over with TDD.**

## Verification Checklist

- [ ] Every new function has a test
- [ ] Watched each test fail before implementing
- [ ] Each test failed for expected reason
- [ ] Wrote minimal code to pass
- [ ] All tests pass
- [ ] Output pristine
