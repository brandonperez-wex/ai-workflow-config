---
name: design
description: Collaborative design phase — orchestrates write-spec, technical-breakdown, and their sub-skills (research, architecture, test-planning, UI/UX) into a cohesive plan with review gates. Use at the start of any non-trivial feature work.
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

Domain orchestrator for the design phase. Delegates to **write-spec** (business spec with review gate) and **technical-breakdown** (technical spec with review gate), which in turn delegate to research, architecture, test-planning, and ui-ux-design. The user validates at every transition.

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

### 1. Research — Explore the Landscape

Invoke the **research** skill to investigate:
- Existing codebase patterns and conventions
- Documentation, specs, and prior art
- External libraries, APIs, or services involved
- Similar implementations for reference

**For agent/MCP systems:** also invoke **tool-discovery** to find MCP servers, APIs worth wrapping, or software worth adopting that could expand the system's capabilities.

Present findings concisely. Lead with what matters for the decisions ahead, not everything you found.

**Check in with the user** before proceeding. "Here's what I found — does this change our approach?"

### 2. Business Spec — Define What We're Building

Invoke **write-spec** to produce the business specification:
- Problem, goals, non-goals
- User stories with acceptance criteria
- Business-readable acceptance test scenarios (Given/When/Then)
- Technical dependencies surfaced early

write-spec creates the feature directory (`specs/NNN-<topic>/spec.md`) and submits a PR for PM/manager review.

**Review gate:** Business spec PR must be approved before proceeding to technical design. For solo projects, the user can explicitly skip this gate.

### 3. Technical Spec — Define How We're Building It

Invoke **technical-breakdown** to produce the technical design:
- Delegates to **architecture** for system structure and contracts
- Delegates to **test-planning** to translate acceptance scenarios into integration test contracts
- Delegates to **ui-ux-design** if frontend work is involved
- Produces vertical slices with walking skeleton as Slice 0

**For agent/MCP systems:** technical-breakdown should also invoke:
- **ai-agent-building** for tool design, model selection, orchestration patterns
- **prompt-engineering** for system prompt structure
- **eval-driven-dev** for grader types and success criteria

technical-breakdown saves to `specs/NNN-<topic>/technical.md` and submits a PR for engineer review.

**Review gate:** Technical spec PR must be approved before proceeding to build. For solo projects, the user can explicitly skip this gate.

### 4. Transition to Build

After both specs are approved, invoke **decompose-tasks** to break the technical spec into implementation tasks, then transition to **build**.

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

## Spec Directory Structure

Design produces a feature directory under `specs/` at the project root:

```
specs/NNN-<topic>/
├── spec.md              # Business spec (from write-spec)
├── technical.md         # Technical design (from technical-breakdown)
├── research.md          # Investigation notes (from research, if any)
├── tasks.md             # Implementation breakdown (from decompose-tasks)
└── decisions/           # ADRs for key decisions (optional)
```

## After Both Specs Are Approved

The terminal state of design is invoking **build**. Do not invoke any other phase skill.

Follow the communication-protocol skill for all user-facing output and interaction.

## Guidelines

- **Design is a conversation, not a presentation.** Check in at every transition. The user shapes the design with you.
- **Scale to complexity.** A one-page spec for a simple feature. A full doc for a system integration. Don't over-design simple things.
- **Non-goals are as important as goals.** Define what you're NOT doing. This prevents scope creep and sets expectations.
- **Alternatives earn trust.** Showing what you considered and rejected demonstrates thoroughness. From Google's process: the "alternatives considered" section is the most useful to future readers.
- **Test strategy and architecture co-evolve.** If tests are hard to write, the architecture needs to change. If architecture is over-engineered, tests will tell you.
- **The walking skeleton is slice 0.** Always. It proves the path works before you build features on it.
- **Treat the doc as a living artifact.** Commit it to version control. Update it during build when reality surfaces changes.
