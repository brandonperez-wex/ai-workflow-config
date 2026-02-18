---
name: ship
description: Review and delivery phase — user reviews the completed build, then commit, PR, and merge. Use after the build phase completes all vertical slices.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Task
---

# Ship

User reviews the completed build. Then commit, push, and create a PR.

## When to Use

- After the build skill completes all vertical slices
- All tests pass, types check, lint is clean

## Process

### 1. Final Verification

Before presenting to the user, run the full check:
- All integration tests pass
- All unit tests pass
- TypeScript compiles clean
- Linter clean
- The feature works (run the server, try it)

If anything fails, go back to build — don't present broken work.

### 2. Present Summary

Show the user what was built:
- List of completed vertical slices (what each delivers)
- Key files changed/created
- Test results (integration + unit counts)
- Any design doc deviations (what changed from the plan and why)

Keep it concise — they've been in the loop during design.

### 3. User Review

The user reviews the work. They may:
- **Approve** — proceed to commit
- **Request changes** — go back to build for specific fixes
- **Reject** — back to design if the approach was wrong

**Wait for explicit approval before committing.** Never commit without the user's go-ahead.

### 4. Commit

Stage relevant files and create well-structured commits.

**Commit conventions:**
- Conventional commits: `type(scope): description`
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Atomic commits — each commit should compile and pass tests independently
- One logical change per commit (a feature addition, a test, a refactor — not all mixed)

**What to commit:**
- Source code changes
- Test files
- Type definitions
- Schema migrations
- Updated design doc (if it changed during build)

**What to never commit:**
- `.env` files, secrets, credentials
- `node_modules/`, `dist/`, build artifacts
- Large binaries or data files
- Temporary debug code

**Commit sizing:**
- If the work is small (1 slice), one commit may suffice
- If the work spans multiple slices, consider one commit per slice or per logical unit
- Each commit message should explain WHY, not just WHAT

### 5. Push & PR

Push to a feature branch and create a pull request:

**Branch naming:** `feat/short-description`, `fix/short-description`

**PR structure:**
- Title: clear, under 70 chars, describes the outcome (not the process)
- Summary: what changed and why (2-3 sentences)
- Vertical slices: list what was built
- Test plan: what was tested, how to verify
- Design doc link: if one exists

### 6. Done

Return the PR URL to the user. The work is delivered.

## Guidelines

- **Don't commit without approval.** Always wait for the user.
- **Don't push to main.** Use feature branches.
- **Don't force push.** Unless explicitly asked.
- **Don't skip verification.** Run the full check before presenting.
- **Keep commits atomic.** Each commit compiles, passes tests, and does one thing.
- **Explain why, not what.** Commit messages and PR descriptions should explain the reasoning, not narrate the changes the diff already shows.
