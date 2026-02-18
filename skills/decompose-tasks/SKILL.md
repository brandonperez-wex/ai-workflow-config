---
name: decompose-tasks
description: Break a technical design into discrete, actionable agent tasks compatible with executing-plans. Use after technical-breakdown to create a step-by-step implementation plan.
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
argument-hint: "[path/to/technical.md or topic name]"
---

# Decompose Tasks

Transform a technical design document into a structured implementation plan with discrete, time-boxed tasks following TDD methodology. Output is compatible with the `executing-plans` skill.

## When to Use

- After a technical breakdown has been completed (via `technical-breakdown` or manually)
- When you need to create an implementation plan for `executing-plans`
- As the final step of the spec → technical → tasks pipeline

## Input Resolution

1. If `$ARGUMENTS` is a file path, read that file as input
2. If `$ARGUMENTS` is a topic name, search `docs/plans/` for the most recent `*-technical.md` matching that topic
3. If no arguments, search `docs/plans/` for the most recently modified `*-technical.md` file
4. If no technical document exists, ask the user if they want to run `technical-breakdown` first

## Collaboration Principles

**The user is the bottleneck, not you.** They read and decide slower than you generate. Optimize for their comprehension, not your throughput.

- **Keep it short.** Summarize phases before detailing tasks. Let the user drill in.
- **Decide together.** If there are multiple ways to slice the work, present options.
- **Build incrementally.** Propose the phase structure first, then flesh out tasks per phase.
- **Respect reading fatigue.** A 20-task plan is a lot to review. Break it into digestible chunks.

## Process

### Step 1: Understand the Technical Design
- Read the technical design document thoroughly
- Read the referenced spec document (linked in the technical doc header)
- Understand the dependency graph: which components depend on others
- Identify the critical path

### Step 2: Explore the Codebase
- Read the actual files that will be modified to understand current state
- Check existing test patterns for the TDD structure
- Identify the test framework, assertion style, and file naming conventions
- Note the project's commit conventions

### Step 3: Propose the Phase Structure
Before writing individual tasks, present the user with:
1. **Proposed phases** — a short name and 1-sentence description per phase
2. **Task count estimate** per phase (e.g., "Phase 1: Foundation — ~3 tasks")
3. **Key ordering decisions** — why phase X must come before phase Y
4. **Anything that feels too big** — flag if the feature should be split into multiple plans

Ask the user: "Does this breakdown make sense? Want to adjust the phases before I detail the tasks?"

### Step 4: Detail Tasks Collaboratively
Once phases are agreed, flesh out tasks phase by phase:
- Present one phase at a time with its tasks
- For each task, include: files, dependencies, TDD steps, commit message
- Pause between phases for feedback, especially if tasks seem too big or too small

Apply the decomposition rules and phase ordering below. Each task must be self-contained with enough detail for an agent to execute without reading the technical design.

### Step 5: Save the Plan
- Derive the filename from the input: replace `-technical.md` with `.md` (the standard plan format)
- If no input file, use format: `docs/plans/YYYY-MM-DD-<topic>.md`
- Get today's date: !`date +%Y-%m-%d`
- Ensure directory exists: `mkdir -p docs/plans`

### Step 6: Present the Plan
- Show the user a brief summary with total task count and phase breakdown
- Highlight any tasks that may need human input or decision
- Let the user know they can run `/executing-plans` to begin implementation

## Plan Template (executing-plans compatible)

The plan file MUST follow this structure:

```markdown
# Implementation Plan: <Feature Name>

> Date: YYYY-MM-DD
> Spec: <path to spec document>
> Technical Design: <path to technical document>

## Goal

<1-2 sentence description of what will be built>

## Architecture Context

<Brief summary of the relevant architecture from the technical design. Include key patterns, state machines, or integration points that tasks will reference.>

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Tech 1 | Why it's used |

## Phase 1: <Phase Name> (Foundation)

### Task 1.1: <Descriptive Task Title>
**Files:** `path/to/new-or-modified-file.ts`
**Depends on:** None

- [ ] Write test: Create `path/to/file.test.ts` with tests for [specific behavior]
  - Test case 1: [description]
  - Test case 2: [description]
- [ ] Run test: Verify tests fail (red)
- [ ] Implement: Create/modify `path/to/file.ts` with [specific implementation]
- [ ] Verify: Run tests, confirm all pass (green)
- [ ] Commit: `feat(scope): add [what was added]`

### Task 1.2: <Descriptive Task Title>
**Files:** `path/to/file.ts`
**Depends on:** Task 1.1

- [ ] Write test: [specific test description]
- [ ] Run test: Verify tests fail (red)
- [ ] Implement: [specific implementation description]
- [ ] Verify: Run tests, confirm all pass (green)
- [ ] Commit: `feat(scope): add [what was added]`

## Phase 2: <Phase Name> (Core Logic)

(continue pattern)

## Summary

| Phase | Tasks | Estimated Time |
|-------|-------|---------------|
| Phase 1 | N tasks | ~X minutes |
| Phase 2 | N tasks | ~X minutes |
| **Total** | **N tasks** | **~X minutes** |

## Notes

- Prerequisites or setup needed before starting
- Environment variables or configuration required
- External dependencies that must be available
```

## Decomposition Rules

1. **Granularity**: Each task = one logical unit of work. If a task touches more than 2-3 files, split it.
2. **TDD Cycle**: Every task that produces code MUST follow: write test → red → implement → green → commit.
3. **Dependencies**: Explicitly state what each task depends on. Never reference code that a previous task has not yet created.
4. **File Specificity**: Every task MUST name the exact file paths to create or modify.
5. **Commit Messages**: Each task includes the exact commit message using conventional commits.
6. **Self-Contained**: Each task must contain enough detail for an agent to execute without reading the technical design. Include type signatures, function names, and expected behavior.
7. **No Standalone Config Tasks**: Setup tasks (install dependencies, create directories) should be folded into the first task that needs them.
8. **Test-First**: The write-test step always comes before the implementation step within each task.

## Phase Ordering

1. **Foundation**: Types, interfaces, data models, constants
2. **Core Logic**: Business logic, state management, utilities
3. **API / Services**: API routes, service functions, integrations
4. **UI Components**: React components, styling
5. **Integration**: Wiring components together, end-to-end flows
6. **Polish**: Error handling improvements, edge cases, final verification

## Guidelines

- Read ACTUAL test files in the project to match test style (describe/it vs test, assertion library, etc.)
- Task estimates should be realistic for an AI agent (2-5 min each)
- If total task count exceeds 20, flag to the user that the feature may need to be split into multiple plans
- Always include a final integration/smoke-test task that verifies the feature works end-to-end
- Reference specific acceptance criteria from the spec in test descriptions where applicable
