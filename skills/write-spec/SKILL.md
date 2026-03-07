---
name: write-spec
description: Formalize requirements into a non-technical product specification with business-reviewable test scenarios. Produces a numbered spec document that PMs and managers approve via PR before engineering begins.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - Skill
argument-hint: "[path/to/design.md or topic name]"
---

# Write Product Specification

A spec is a contract between business and engineering. If PMs can't validate the test scenarios and engineers are surprised during implementation, the spec failed. Both audiences must be able to read it — business people for the "what and why," engineers for the acceptance boundaries.

<HARD-GATE>
Don't spec what you don't understand. If you can't state the problem in 2 sentences, invoke research first.
</HARD-GATE>

## Input Resolution

1. If `$ARGUMENTS` is a file path, read that file as input
2. If `$ARGUMENTS` is a topic name, search `specs/`, `docs/plans/` for the most recent matching file
3. If no arguments, search for the most recently modified design or product-definition file
4. If nothing exists, ask the user to describe the feature

## Process

### Step 1: Frame the Problem

- State the problem in 2-3 sentences from the user's perspective
- List 3-5 goals (what success looks like)
- List non-goals (what this explicitly does NOT do)
- Ask: "Does this capture it?"

Do NOT proceed until the user confirms problem + goals + scope.

### Step 2: User Stories

For each persona/scenario:
- **As a** [user type] **I want** [capability] **So that** [benefit]
- Acceptance criteria in Given/When/Then format

Pause: "Are these the right scenarios?"

### Step 3: Requirements

- **Functional requirements** — what the system must do (testable, unambiguous)
- **Non-functional requirements** — performance, security, reliability (only what's relevant)

Keep language non-technical. "System responds within 2 seconds" not "p99 latency < 2s with Redis cache."

### Step 4: Acceptance Test Scenarios

Invoke **test-planning** (or **eval-driven-dev** for AI/agent features) to draft acceptance test scenarios in business language.

For each major feature area:

```
Feature: [Name]
  Scenario: [Happy path description]
    Given [context]
    When [action]
    Then [expected outcome]

  Scenario: [Error/edge case]
    Given [context]
    When [action]
    Then [expected outcome]
```

These are behavior specifications, not implementation tests. The audience is PMs and managers who validate: "Yes, if the system does X when the user does Y, that's correct."

Pause: "Can your PM/manager validate these test scenarios?"

### Step 5: Surface Technical Dependencies

Capture technical questions and constraints that could affect business decisions. Don't ignore them, don't solve them — name them.

Examples:
- "This requires real-time sync, which affects infrastructure cost"
- "The API rate limits cap throughput at X requests/minute"
- "This feature depends on [system] which doesn't exist yet"

These flow into technical-breakdown. If any are deal-breakers, surface them NOW.

### Step 6: Save the Spec

**Spec document protocol:**
- Directory: `specs/` at project root (create with `mkdir -p specs` if needed)
- Create a numbered feature directory: find the highest existing `NNN-*` prefix in `specs/`, increment by 1. Start at `001` if empty.
- Feature directory: `specs/NNN-<topic>/`
- Save as: `specs/NNN-<topic>/spec.md`
- All related artifacts go in this same directory (technical.md, research.md, tasks.md, decisions/)

Get today's date: !`date +%Y-%m-%d`

Example structure:
```
specs/
├── 001-user-authentication/
│   ├── spec.md              # Business spec (this file)
│   ├── technical.md         # Technical design (next step)
│   ├── research.md          # Investigation notes (if any)
│   └── tasks.md             # Implementation breakdown (later)
├── 002-payment-processing/
│   ├── spec.md
│   └── ...
```

### Step 7: Submit for Review

The business spec is a reviewable artifact. Before engineering begins:
1. Commit the spec to the feature branch
2. Push the branch
3. Create a PR for PM/manager review

Invoke **commit-and-pr** to handle staging, commit, push, and PR creation. The PR description should explain that this is a business spec for review, not code.

**Do NOT proceed to technical-breakdown until the business spec PR is approved.** If the user wants to continue immediately (e.g., solo project, time pressure), get explicit confirmation before skipping the review gate.

### Step 8: Hand Off

After approval (or explicit skip):
- Summarize key decisions
- Confirm user is ready to proceed
- Invoke **technical-breakdown** with the spec path

## Spec Structure

See `references/template.md` for the full template. Required sections:

1. Problem Statement
2. Goals / Non-Goals
3. User Stories with Acceptance Criteria
4. Functional Requirements
5. Non-Functional Requirements (only relevant ones)
6. Acceptance Test Scenarios (business-readable)
7. Technical Dependencies & Open Questions
8. Success Metrics

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| **Technical spec in disguise** | Implementation language ("use Redis," "add endpoint"). PMs can't review it. | Translate to behavior: "System caches for fast repeat access" |
| **No test scenarios** | Engineers guess what "correct" means. PM surprised at demo. | Every feature area gets Given/When/Then scenarios |
| **Scope without boundaries** | "Improve search" with no non-goals. Everything creeps in. | Non-goals are mandatory. Name what you're NOT doing. |
| **Silent assumptions** | Assumes API exists, team has capacity. Never stated. | Write down every assumption. |
| **Gold-plated spec** | 30 pages for a 2-day feature. Nobody reads it. | Scale depth to complexity. |

## Coupling with Technical Decisions

Business and technical decisions influence each other. This skill doesn't pretend they're independent.

- **During spec writing**: If you discover technical constraints that affect business decisions, surface them immediately (Step 5). Don't wait for technical-breakdown.
- **After technical-breakdown**: If technical constraints change the business spec, loop back and update. The spec is a living document until the PR is approved.
- **The design skill** manages this back-and-forth when orchestrating the full pipeline.

## Guidelines

- Keep language non-technical — no implementation details, no code references
- Every user story must have concrete acceptance criteria
- Functional requirements should be testable and unambiguous
- Capture open questions rather than making assumptions silently
- Include non-goals explicitly to prevent scope creep
- Scale spec depth to feature complexity — don't over-spec simple things
