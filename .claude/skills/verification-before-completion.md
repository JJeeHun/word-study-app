---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires running verification commands and confirming output before making any success claims; evidence before assertions always
---

# Verification Before Completion

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

## The Gate Function

```
BEFORE claiming any status:
1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
5. ONLY THEN: Make the claim
```

## Red Flags — STOP

- Using "should", "probably", "seems to"
- "Great!", "Perfect!", "Done!" before verification
- About to commit/push/PR without verification
- Trusting agent success reports
- ANY wording implying success without running verification

## Common Failures

| Claim | Requires |
|-------|----------|
| Tests pass | Test command: 0 failures |
| Build succeeds | Build command: exit 0 |
| Bug fixed | Test original symptom: passes |
| Agent completed | VCS diff shows changes |

No shortcuts. Run the command. Read the output. THEN claim the result.
