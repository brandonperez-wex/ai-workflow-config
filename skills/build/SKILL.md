---
name: build
description: Autonomous execution phase — implements the design plan one vertical slice at a time. Integration test first, then build the slice, then verify. Use after the design phase produces an approved plan.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - Task
---

# Build

Autonomous execution of an approved design plan. One vertical slice at a time, integration-test first, working software after every slice.

## When to Use

- After the design skill produces an approved design doc
- When you have a clear list of vertical slices to implement

## Pre-Flight Check

Before starting, verify:
- [ ] Design doc exists and is approved
- [ ] Vertical slices are defined with integration test outlines
- [ ] Dependencies between slices are clear
- [ ] Dev environment works (build runs, tests run, server starts)

If pre-flight fails, fix it before writing any feature code. Infrastructure problems compound.

## Mode Selection

After pre-flight, choose execution mode:

| Mode | When | How |
|------|------|-----|
| **Inline** | Exploratory work, tight iteration needed, or user explicitly wants to stay in conversation | Execute slices directly in this conversation |
| **Subagent** (recommended) | Any feature with clear specs — keeps context clean, runs autonomously with two-stage review | Dispatch each slice to a fresh subagent |

Ask the user which mode to use. Default to **subagent** when slices are well-defined.

---

## Inline Mode

Execute slices directly in the conversation. Good for exploratory work or tight iteration.

### Slice 0: Walking Skeleton

The first slice is always the walking skeleton — the thinnest possible end-to-end path that proves infrastructure works.

- Hardcode all logic (return static values)
- Prove the path works: request flows through all layers, response comes back
- Integration test asserts the path exists and responds, not correctness
- Deploy/run the skeleton before building features on it

If this fails, you've found an infrastructure problem that would have blocked every subsequent slice. Fix it now.

### Execution Loop (per slice)

For each vertical slice in dependency order:

### 1. Integration Test (Red)

Write the real integration test from the design doc outline. Use real controlled dependencies (your database, your file system). Mock uncontrolled dependencies (third-party APIs) at the adapter boundary.

Run it. Confirm it fails for the **right reason** — "not found" or "not implemented," not a test infrastructure problem.

### 2. Build the Slice (Inner Loop)

Implement each layer, bottom-up or top-down depending on the slice:

- Type definitions / interfaces
- Database schema changes (if any)
- Adapter / data layer + unit tests
- Service layer + unit tests
- Route / API endpoint + unit tests
- Client components + unit tests (if frontend)

Each layer gets its own unit tests as you implement. Inner-loop TDD: write a failing unit test, make it pass, refactor.

### 3. Integration Test (Green)

Run the integration test. When it passes, the slice works end-to-end. If it doesn't, the failing assertion tells you which layer needs more work.

### 4. Verify — No Regressions

Run the full verification suite:
- All integration tests pass (current + all previous slices)
- All unit tests pass
- TypeScript compiles clean (`npx tsc --noEmit`)
- Linter passes

**Never move to the next slice with any test red.** A red test that you ignore becomes a test you stop trusting.

### 5. Status Update

Brief status to the user after each slice: "Slice 1 done — integration test green, 4 unit tests added. Moving to slice 2."

### 6. Next Slice

Move to the next vertical slice in the sequence.

---

## Subagent Mode

Fresh subagent per slice + two-stage review (spec compliance, then code quality). The controller (you) stays clean; subagents do the implementation.

### Setup

1. Read the design doc once and extract all slices with their full text
2. Create a TodoWrite task per slice
3. Note the working directory, branch, and any context subagents need (env vars, running services, conventions)

### Subagent Execution Loop (per slice)

For each slice in dependency order:

#### 1. Dispatch Implementer

Use the Task tool (general-purpose) with the template at `./implementer-prompt.md`.

Provide the subagent with:
- Full slice text from the design doc (don't make it read the file)
- Context: where this fits, what previous slices built, architectural decisions
- Working directory
- Integration test outline from the design doc

If the implementer asks questions, answer them completely before letting it proceed.

When done, the implementer reports: what it built, test results, files changed, self-review findings.

#### 2. Spec Compliance Review

Dispatch a reviewer subagent using the Task tool (general-purpose) with the template at `./spec-reviewer-prompt.md`.

Provide:
- Full slice requirements from the design doc
- Implementer's report (what they claim they built)

The spec reviewer reads the actual code and verifies independently — it does NOT trust the implementer's report.

- **If ✅ spec compliant** → proceed to code quality review
- **If ❌ issues found** → resume the implementer subagent to fix, then re-review

#### 3. Code Quality Review

Only after spec compliance passes. Dispatch using the Task tool (superpowers:code-reviewer) with the template at `./code-quality-reviewer-prompt.md`.

Provide:
- What was implemented (from implementer's report)
- Plan/requirements reference
- BASE_SHA (commit before slice) and HEAD_SHA (current commit)
- Brief description

- **If approved** → mark slice complete, move to next
- **If issues found** → resume implementer to fix, then re-review code quality

#### 4. Mark Complete

Update the TodoWrite task. Brief status to user: "Slice N done — spec ✅, code quality ✅. Moving to slice N+1."

### After All Slices (Subagent Mode)

1. Dispatch a final code quality reviewer for the entire implementation (BASE_SHA from before slice 0, HEAD_SHA current)
2. Fix any cross-cutting issues found
3. Run the full verification checklist (below)
4. Transition to **ship**

### Subagent Mode Red Flags

- **Never** dispatch multiple implementer subagents in parallel (slices depend on each other)
- **Never** skip spec review — "it looks right" is not verification
- **Never** start code quality review before spec compliance passes
- **Never** move to the next slice with open review issues
- **If subagent fails** — dispatch a fix subagent with specific instructions, don't fix manually (context pollution)

---

## Guidance (Both Modes)

### When You're Stuck

Strategies in order of escalation:

| Situation | Strategy | Max Attempts |
|-----------|----------|-------------|
| **Test fails for wrong reason** | Fix test setup, not implementation. Check test infrastructure (DB connection, env vars, ports). | 2 |
| **Implementation doesn't satisfy test** | Re-read the test assertion. What behavior is it actually checking? Work backward from the assertion. | 3 |
| **Unclear requirement** | Check the design doc first. If it doesn't answer, ask the user. Don't guess on ambiguous requirements. | 1 (then ask) |
| **Dependency missing** | Check if a previous slice was supposed to provide it. Check the design doc's slice ordering. | 2 |
| **External service issue** | Check adapter configuration, env vars, network. If the external service is genuinely down, mock it temporarily and flag for the user. | 2 |
| **Same error after 2 attempts** | Stop. Explain what you tried, what failed, and what you think the root cause is. Ask the user. Don't spin. | 0 (escalate) |

**Key principle:** Don't brute-force. If the same approach fails twice, change the approach or ask. Spinning wastes time and degrades code quality.

### Recovery Patterns

When something goes wrong mid-slice:

- **Checkpoint after each green state.** If a refactoring breaks things, you know the last known-good state.
- **Verify state changes actually happened.** After writing a file, check it exists. After a schema migration, verify the table. Silent failures propagate.
- **Roll back, don't patch forward.** If a refactoring breaks multiple tests, revert to the last green state and try a different approach rather than patching the broken version.

### Common AI Code Failure Patterns

Watch for these in your own output:

| Pattern | Detection | Fix |
|---------|-----------|-----|
| **Hallucinated APIs** | Import errors, methods that seem too convenient | Verify packages exist in registries before using |
| **Happy-path-only error handling** | try-catch that only logs, no actual handling | Implement structured error boundaries with recovery |
| **Missing edge cases** | Empty arrays, null values, boundary conditions untested | Add defensive checks; test with empty/null/boundary inputs |
| **Data model mismatches** | Runtime crashes on property access | Validate structures against actual API contracts, not assumptions |
| **Outdated library usage** | Deprecation warnings, security scanner alerts | Check library docs for current API; don't assume training data is current |

### Parallel Work Within a Slice

Use subagents for independent work within a single slice:
- Reading multiple files simultaneously
- Running tests while exploring code
- Researching library APIs

**Don't parallelize across slices.** Slices build on each other. Parallel cross-slice work creates merge conflicts and broken assumptions.

### Verification Checklist (per slice)

Before marking a slice complete:
- [ ] Integration test passes (real controlled deps, mocked uncontrolled deps)
- [ ] Unit tests pass at every layer
- [ ] TypeScript compiles clean
- [ ] Linter clean
- [ ] No regressions (all previous slices still pass)

### Verification Checklist (all slices done)

Before transitioning to ship:
- [ ] All integration tests pass
- [ ] All unit tests pass
- [ ] Full typecheck passes
- [ ] Full lint passes
- [ ] The feature works when you actually use it (run the server, try it)
- [ ] Design doc updated if reality diverged from the plan

### After Build

When all slices are complete and verified, transition to the **ship** skill for user review and delivery.

### Guidelines

- **One slice at a time.** Complete and green before moving on.
- **Integration test is the source of truth.** If it passes, the slice works.
- **Working software after every slice.** Each merge should leave the system in a deployable state.
- **Don't skip verification.** Run tests after every slice, not just at the end.
- **Small commits, frequent verification.** Commit after each layer within a slice. Keep commits atomic — each should compile and pass tests.
- **Ask when stuck, don't spin.** Two failed attempts on the same problem = escalate to the user.
- **Update the design doc.** When reality diverges from the plan, update the doc. It's a living artifact, not a contract.
- **Verify your own output.** AI-generated code has known failure patterns. Check imports exist, error handling is real, edge cases are covered.
