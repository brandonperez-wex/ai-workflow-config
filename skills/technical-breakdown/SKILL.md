---
name: technical-breakdown
description: Convert a product spec into a technical implementation plan. Produces a numbered technical spec that engineers review via PR before coding begins. Delegates to architecture, test-planning, and UI/UX skills.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - Skill
argument-hint: "[path/to/spec.md or topic name]"
---

# Technical Breakdown

A technical design is a set of decisions, not a template to fill. Every section answers a question — if there's no question, skip the section. The output is a document that engineers review and approve via PR before anyone writes code.

<HARD-GATE>
Read the actual codebase before designing. Never design against an imagined architecture.
</HARD-GATE>

## Input Resolution

1. If `$ARGUMENTS` is a file path, read that file as input
2. If `$ARGUMENTS` is a topic name, search `specs/` for a directory matching that topic, then read `spec.md` within it
3. If no arguments, search `specs/` for the most recently modified `spec.md`
4. If no spec file exists, ask the user if they want to run `write-spec` first

## Process

### Step 1: Understand Spec and Codebase

- Read the product specification thoroughly
- Read the project's existing codebase:
  - `package.json`, `tsconfig.json` or equivalent for tech stack
  - `src/` directory structure for architectural patterns
  - Existing data models, API routes, component patterns
- Map spec requirements to architectural decisions needed

### Step 2: Align on Approach

Before designing:
1. **Summarize current architecture** — what exists, what patterns are used
2. **Propose high-level approach** — 3-5 bullets. Ask: "Does this direction make sense?"
3. **Surface key decisions** — present as choices with trade-offs, let the user pick
4. **Flag constraints** that affect the business spec (loop back to write-spec if needed)

Do NOT proceed until the user confirms the overall approach.

### Step 3: Architecture

Invoke **architecture** skill to define:
- Components and responsibilities
- Data flow and contracts (TypeScript interfaces, Zod schemas)
- Integration points and schema changes
- Key decisions with alternatives considered and rationale

### Step 4: API & Data Design

For each interface boundary:
- Endpoint/function signature
- Input/output shapes
- Error cases and codes
- Validation rules

Ground everything in actual codebase conventions. Follow existing patterns.

### Step 5: Test Strategy

Invoke **test-planning** skill to translate the business spec's acceptance scenarios into implementable test contracts:
- Acceptance scenarios from write-spec become integration test contracts
- Mock boundaries (real controlled deps, mocked uncontrolled deps)
- Unit test targets per layer

For AI/agent features, invoke **eval-driven-dev** for grader types, success criteria, and trial counts.

The business spec's Given/When/Then scenarios are the starting point. This step makes them technically precise.

### Step 6: UI/UX (if frontend work)

Invoke **ui-ux-design** skill for:
- Visual direction and interaction patterns
- Component recommendations
- Agentic UX patterns (if AI features)

### Step 7: Vertical Slices

Break the design into ordered slices:
- Each slice is a complete vertical cut through all layers
- Each is independently testable and deliverable
- Order: dependencies first, then risk, then learning
- **Slice 0 is always the walking skeleton** — thinnest end-to-end path proving infrastructure works

### Step 8: Save the Technical Spec

**Spec document protocol:**
- Save into the **same feature directory** as the business spec
- Filename: `specs/NNN-<topic>/technical.md`
- If research was done during this phase, save notes to `specs/NNN-<topic>/research.md`
- Key architectural decisions can go in `specs/NNN-<topic>/decisions/` as individual ADRs

### Step 9: Submit for Review

The technical spec is a reviewable artifact. Before coding begins:
1. Commit the technical spec to the feature branch
2. Push the branch
3. Create a PR for engineer review (or update the existing spec PR)

Invoke **commit-and-pr** to handle staging, commit, push, and PR creation.

**Do NOT proceed to build until the technical spec PR is approved.** If the user wants to continue immediately (e.g., solo project, time pressure), get explicit confirmation before skipping the review gate.

### Step 10: Hand Off

After approval (or explicit skip):
- Summarize key decisions and vertical slices
- Confirm user is ready to proceed
- Invoke **decompose-tasks** with the technical spec path

## Which Sections to Include

Not every feature needs every section. Match depth to complexity:

| Section | Always | Medium+ | Large Only |
|---|---|---|---|
| Architecture overview | yes | yes | yes |
| Data models | yes | yes | yes |
| API design | yes | yes | yes |
| Vertical slices | yes | yes | yes |
| Architecture diagram | | yes | yes |
| Component design | | if frontend | yes |
| State management | | if complex state | yes |
| Security considerations | | if auth/data | yes |
| Performance considerations | | if scale concern | yes |
| Migration plan | | | if changing existing |

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| **Designing without reading code** | Proposes patterns that clash with existing architecture | Hard gate: read the codebase first |
| **Template-filling** | Every section filled regardless of relevance. 20 pages for a 2-day feature. | Skip sections that don't answer a question |
| **No alternatives discussed** | Single approach presented as inevitable. Hides trade-offs. | Every key decision needs alternatives and rationale |
| **Imaginary architecture** | Describes ideal state without accounting for current reality | Current state to target state, with migration path |
| **Test strategy as afterthought** | "We'll add tests later." Tests shape architecture. | Test strategy co-evolves with architecture |

## Coupling with Business Spec

- **Technical constraints change business decisions**: If architecture makes a feature impractical or expensive, loop back to write-spec and update.
- **Business spec tests are your starting point**: Acceptance scenarios from write-spec become integration test contracts here.
- **The design skill** manages iteration between business and technical specs when orchestrating the full pipeline.

## Guidelines

- Ground everything in the ACTUAL codebase — read existing files, reference real paths
- Follow existing patterns; don't introduce new paradigms without justification
- Data models should match existing conventions
- Be explicit about what files will be created vs. modified
- Testing strategy should use the project's existing test framework
