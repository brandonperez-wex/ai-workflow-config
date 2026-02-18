---
name: design
description: Collaborative design phase — orchestrates research, architecture, TDD, and UI/UX skills into a cohesive plan. Use at the start of any non-trivial feature work. Produces a design doc with vertical slices ready for the build phase.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - WebSearch
  - WebFetch
  - Task
---

# Design

Collaborative phase that produces a design doc. Orchestrates the utility skills (research, architecture, tdd-edd, ui-ux-design) into a cohesive plan the user has validated at every step.

<HARD-GATE>
Do NOT write implementation code during this phase. The output is a design document, not code. Transition to the build skill when the design is approved.
</HARD-GATE>

## When to Use

Use when 3 or more of these apply:

- Uncertainty about the right approach warrants upfront investigation
- Work touches multiple layers, repos, or teams
- Senior engineer input would be valuable beyond code review
- Cross-cutting concerns (security, performance, accessibility) need consideration
- Integration with unfamiliar systems or APIs

**Skip design** if the solution is obvious and non-ambiguous — go directly to build.

## Scale the Effort

Not every feature needs a full design. Match the depth to the complexity:

| Complexity | Design Effort | Example |
|------------|--------------|---------|
| **Small** | 1-2 paragraph spec, skip to slices | Add a new API field, simple UI tweak |
| **Medium** | Focused design doc, 1-2 page | New endpoint with service logic, component with state |
| **Large** | Full design doc with all utility skills | Multi-service integration, new system, agent orchestration |

Default to **medium**. Escalate if you discover unexpected complexity during research.

## Flow

### 1. Understand — Frame the Problem

Ask concise questions to establish what we're solving. One question at a time. Prefer multiple choice when possible.

Establish:
- **Problem** — what's broken, missing, or needed (2-3 sentences)
- **Goals** — what success looks like, quantified where possible
- **Non-goals** — what this feature deliberately does NOT do (prevents scope creep)
- **Constraints** — tech stack, timeline, existing patterns, deployment model

**Output:** A current-state → desired-state spec. "The system currently does X. After this work, it should do Y."

### 2. Research — Explore the Landscape

Invoke the **research** skill to investigate:
- Existing codebase patterns and conventions
- Documentation, specs, and prior art
- External libraries, APIs, or services involved
- Similar implementations for reference

Present findings concisely. Lead with what matters for the decisions ahead, not everything you found.

**Check in with the user** before proceeding. "Here's what I found — does this change our approach?"

### 3. Architecture — Define the Structure

Invoke the **architecture** skill to define:
- Components and their responsibilities
- Data flow through the system
- API contracts (TypeScript interfaces, Zod schemas)
- Integration points and schema changes
- Key decisions with alternatives considered and rationale

**Check in with the user** on each key decision. Present as: "We need to choose between X and Y. I recommend X because [reason]. Y is better if [condition]."

### 4. Test Strategy — Define What Done Looks Like

Invoke the **tdd-edd** skill to define:
- Vertical feature slices (each independently testable)
- Integration test outline for each slice (real controlled deps, mocked uncontrolled deps)
- Unit test strategy per layer
- Eval strategy for any agent behavior (grader types, success criteria, trial count)

Test strategy and architecture inform each other — if tests are hard to define, the architecture may need adjustment. Flag this tension rather than forcing a fit.

**Check in with the user.** "Here are the slices. Does this ordering make sense?"

### 5. UI/UX (if frontend work)

Invoke the **ui-ux-design** skill to define:
- Visual direction and interaction patterns
- Agentic UX patterns (if AI-driven features)
- Component recommendations with specific treatments
- Animation and layout decisions

### 6. Slice and Sequence

Break the design into ordered vertical slices. Each slice should be:
- A complete vertical cut through all layers (UI → API → Service → Data)
- Independently testable with its own integration test
- Independently deliverable (mergeable without breaking anything)
- Ordered by dependency (foundations first, risk first, learning first)

**Slice 0 is always the walking skeleton** — the thinnest possible end-to-end path proving infrastructure works before feature tests.

### 7. Save and Transition

Write the design doc to `docs/plans/YYYY-MM-DD-<topic>-design.md` and commit.

## Collaboration Style

The user reviews every transition — not just the final document.

- **Be concise.** Don't dump walls of text. The user is human.
- **Lead with decisions.** "We need to choose between X and Y" — not "Here's everything I know about X and Y."
- **One question at a time.** Don't ask 5 things in one message.
- **Flag uncertainty.** "I'm unsure about X, here are the options" — not silent assumptions.
- **Check in at every transition.** After research, before architecture. After architecture, before test strategy. The user should feel in the loop, not surprised.
- **Scale sections to complexity.** A few sentences if straightforward, up to 200-300 words if nuanced. Don't write 500 words when 50 will do.

## Design Doc Anti-Patterns

Avoid these — they make design docs fail:

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| **Implementation manual** | Describes HOW without WHY. No trade-offs discussed. | Every decision needs alternatives and rationale. |
| **Novel-length doc** | Too long to review. Nobody reads it. | 10-20 pages max. Scale to complexity. Cut ruthlessly. |
| **Vague spec** | "Make it fast" or "improve UX." No measurable criteria. | Quantify: "Response time < 200ms at p99." |
| **Missing non-goals** | Scope creeps because boundaries weren't defined. | Explicitly state what this does NOT do. |
| **Stale before implementation** | Written, never updated, drifts from reality. | Treat as living doc. Update during build. |
| **Context dump** | Everything the author knows, not what the reader needs. | Write for the reader, not for yourself. |

## Boundaries

Include boundaries in every design doc:

- **Always:** Invariants that must hold (e.g., "Always validate input at API boundary")
- **Ask first:** Decisions that need human approval before acting (e.g., "Ask before adding new dependencies")
- **Never:** Hard constraints (e.g., "Never commit secrets," "Never mock controlled dependencies in integration tests")

## Design Doc Format

```markdown
# [Feature Name] Design

> Date: YYYY-MM-DD
> Status: Draft | Approved

## Problem
[What problem does this solve? 2-3 sentences.]

## Goals
- [Measurable outcome 1]
- [Measurable outcome 2]

## Non-Goals
- [What this deliberately does NOT do]

## Solution
[High-level approach. 2-3 sentences. Current state → desired state.]

## Architecture
[Components, data flow, contracts — from architecture skill]

## Vertical Slices
[Ordered list of feature slices — each with integration test outline]

### Slice 0: Walking Skeleton
- **What:** Thinnest end-to-end path proving infrastructure works
- **Integration test:** [Basic connectivity assertion]
- **Layers:** [Minimal path through all layers]

### Slice 1: [Name]
- **What:** [User-visible behavior]
- **Integration test:** [What the real test asserts]
- **Layers:** [Route → Service → Adapter → External]
- **Types:** [Key interfaces]

### Slice 2: [Name]
...

## UI/UX
[Design direction, patterns, components — if frontend work]

## Decisions
| Decision | Alternatives | Rationale |
|----------|-------------|-----------|

## Boundaries
- **Always:** [Invariants]
- **Ask first:** [Human-approval items]
- **Never:** [Hard constraints]

## Open Questions
[Anything still unresolved]
```

## After Design Approval

When the user approves the design:
1. Save to `docs/plans/`
2. Commit the design doc
3. Transition to the **build** skill to execute

The terminal state of design is invoking **build**. Do not invoke any other phase skill.

## Guidelines

- **Design is a conversation, not a presentation.** Check in at every transition. The user shapes the design with you.
- **Scale to complexity.** A one-page spec for a simple feature. A full doc for a system integration. Don't over-design simple things.
- **Non-goals are as important as goals.** Define what you're NOT doing. This prevents scope creep and sets expectations.
- **Alternatives earn trust.** Showing what you considered and rejected demonstrates thoroughness. From Google's process: the "alternatives considered" section is the most useful to future readers.
- **Test strategy and architecture co-evolve.** If tests are hard to write, the architecture needs to change. If architecture is over-engineered, tests will tell you.
- **The walking skeleton is slice 0.** Always. It proves the path works before you build features on it.
- **Treat the doc as a living artifact.** Commit it to version control. Update it during build when reality surfaces changes.
