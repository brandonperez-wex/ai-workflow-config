# Build Skill: Subagent Mode Design

> Date: 2026-02-17
> Status: Draft

## Problem

The build skill only executes slices inline in the main conversation, requiring user approval for each tool call. Long builds pollute context and demand constant attention. There's no way to dispatch work to fresh subagents that run autonomously with quality gates.

## Goals

- Add a subagent execution mode to the build skill
- Each slice dispatched to a fresh subagent following full TDD (double-loop)
- Two-stage review per slice: spec compliance, then code quality
- Subagents commit their own work (atomic, conventional commits)

## Non-Goals

- Not changing the design or ship skills
- Not upgrading the standalone code-review skill
- Not adding a new skill — this extends the existing build skill

## Solution

Add mode selection to build (inline vs subagent). When subagent mode is chosen, the controller dispatches each slice to a fresh `general-purpose` subagent with full TDD instructions, then runs spec compliance review, then code quality review via `superpowers:code-reviewer`. The controller stays clean — subagents do the work.

## Architecture

### Files

```
skills/build/
├── SKILL.md                      # Modified — add mode selection + subagent loop
├── implementer-prompt.md         # New — template for implementer subagent
├── spec-reviewer-prompt.md       # New — template for spec compliance reviewer
└── code-quality-reviewer-prompt.md # New — template for code quality reviewer
```

### Subagent Flow (per slice)

```
Controller reads design doc, extracts all slices
    │
    ▼ (for each slice)
┌─────────────────────┐
│  Implementer        │ Task(general-purpose)
│  - Full TDD         │
│  - Atomic commits   │
│  - Self-review      │
│  - Reports back     │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Spec Reviewer      │ Task(general-purpose)
│  - Reads actual code│
│  - Checks reqs      │
│  - Checks TDD       │
│  - ✅ or ❌         │
└────────┬────────────┘
         │ (if ❌, resume implementer → re-review)
         ▼
┌─────────────────────┐
│  Code Quality       │ Task(superpowers:code-reviewer)
│  - Git diff review  │
│  - Severity tiers   │
│  - ✅ or ❌         │
└────────┬────────────┘
         │ (if issues, resume implementer → re-review)
         ▼
    Mark slice complete → next slice
```

## Vertical Slices

### Slice 0: SKILL.md mode selection + subagent loop

- **What:** Already partially done. Review and finalize the mode selection section and subagent execution loop in SKILL.md.
- **Layers:** SKILL.md only

### Slice 1: Implementer prompt template

- **What:** Template for dispatching implementer subagents. Enforces full TDD double-loop, atomic commits, self-review.
- **Key content:**
  - Slice description + context (pasted in, not file read)
  - TDD process: integration test red → inner loop with unit tests → integration green → verify
  - Commit convention: conventional commits, atomic per layer
  - Self-review checklist: completeness, TDD discipline, quality, YAGNI
  - Report format: what built, test results, files changed, findings
- **Layers:** `implementer-prompt.md`

### Slice 2: Spec reviewer prompt template

- **What:** Template for spec compliance review. Verifies requirements AND TDD compliance by reading actual code.
- **Key content:**
  - Full slice requirements (pasted in)
  - Implementer's report (what they claim)
  - "Do not trust the report" — verify independently
  - Check: missing requirements, extra work, misunderstandings
  - Check: TDD compliance (integration test exists, unit tests per layer)
  - Output: ✅ or ❌ with file:line references
- **Layers:** `spec-reviewer-prompt.md`

### Slice 3: Code quality reviewer prompt template

- **What:** Template for code quality review using `superpowers:code-reviewer` agent type.
- **Key content:**
  - Git SHA range (BASE_SHA..HEAD_SHA)
  - Review checklist: correctness, security, performance, architecture, testing, AI failure patterns
  - Severity tiers: Critical (must fix) / Important (should fix) / Minor (nice to have)
  - Output: strengths, issues with file:line refs, assessment (ready/not/with fixes)
- **Layers:** `code-quality-reviewer-prompt.md`

## Decisions

| Decision | Alternatives | Rationale |
|----------|-------------|-----------|
| Subagent mode as option, not replacement | Replace inline entirely | User wants both — inline for exploratory, subagent for defined specs |
| Full TDD in implementer | Lighter "implement and test" | Matches existing tdd-edd skill; integration test first is the core discipline |
| Subagent commits | Controller commits | Better git history, gives reviewers clean SHAs to diff |
| Spec reviewer checks TDD compliance | Requirements only | TDD is a core part of the process — if it's not enforced, it gets skipped |
| superpowers:code-reviewer for quality | Custom general-purpose prompt | Pre-built agent type already does structured reviews well |

## Boundaries

- **Always:** Spec review before code quality review (wrong order = wasted effort)
- **Always:** Fix issues before moving to next slice
- **Ask first:** If subagent asks questions, answer before letting it proceed
- **Never:** Dispatch parallel implementer subagents (slices depend on each other)
- **Never:** Skip either review stage

## Open Questions

None — all decisions resolved.
