---
name: technical-breakdown
description: Convert a product spec into a technical architecture and design document. Use after write-spec to create implementation architecture with data models, APIs, and component design.
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
  - Skill
argument-hint: "[path/to/spec.md or topic name]"
---

# Technical Breakdown

Transform a product specification into a detailed technical architecture and design document.

## When to Use

- After a product spec has been written (via `write-spec` or manually)
- When you need to plan the technical implementation of a feature
- As the second step of the spec → technical → tasks pipeline

## Input Resolution

1. If `$ARGUMENTS` is a file path, read that file as input
2. If `$ARGUMENTS` is a topic name, search `docs/plans/` for the most recent `*-spec.md` matching that topic
3. If no arguments, search `docs/plans/` for the most recently modified `*-spec.md` file
4. If no spec file exists, ask the user if they want to run `write-spec` first

## Collaboration Principles

**The user is the bottleneck, not you.** They read and decide slower than you generate. Optimize for their comprehension, not your throughput.

- **Keep it short.** Prefer bullet points over paragraphs. One idea per message.
- **Decide together.** Present architectural choices as options with trade-offs, not conclusions.
- **Build incrementally.** Walk through the design section by section, not all at once.
- **Respect reading fatigue.** If you're about to send a wall of text, break it up or summarize first and offer details on request.

## Process

### Step 1: Understand the Spec and Codebase
- Read the product specification thoroughly
- Read the project's existing codebase to understand current architecture:
  - Check for `package.json`, `tsconfig.json`, or equivalent to identify tech stack
  - Scan `src/` directory structure for architectural patterns
  - Look at existing data models, API routes, and component patterns
- Identify which user stories and requirements drive architectural decisions

### Step 2: Align on Approach
Before writing the full design, have a short conversation with the user:
1. **Summarize the current architecture** briefly (what exists, what patterns are used)
2. **Propose the high-level approach** in a few bullets. Ask: "Does this direction make sense?"
3. **Surface key architectural decisions** as choices with trade-offs. Let the user pick.
4. **Flag open technical questions** from the spec that need answers before designing

Only move on once the user confirms the overall approach and key decisions.

### Step 3: Build the Design Collaboratively
Work through the template section by section. For each section:
- Draft it concisely, grounded in actual codebase patterns
- Present it to the user for feedback
- Incorporate changes before moving on

Group related sections where it makes sense. Move faster when aligned, slow down on decisions.

**Key decision points to always pause on:**
- Architecture approach (how components connect)
- Data models (are the interfaces right?)
- API design (are these the right endpoints/functions?)
- Any section where multiple valid approaches exist

### Step 4: Save the Artifact
- Derive the filename from the input file: replace `-spec.md` with `-technical.md`
- If no input file, use format: `docs/plans/YYYY-MM-DD-<topic>-technical.md`
- Get today's date: !`date +%Y-%m-%d`
- Ensure directory exists: `mkdir -p docs/plans`

### Step 5: Hand Off to Task Decomposition
After saving, give the user a brief summary of the key decisions and let them know the next step is `decompose-tasks`. Invoke it:
```
Skill: decompose-tasks
Args: <path-to-technical-file>
```

Do NOT skip asking — confirm the user is ready to move on.

## Technical Design Template

The document MUST follow this structure:

```markdown
# Technical Design: <Feature Name>

> Date: YYYY-MM-DD
> Status: Draft
> Spec: <path to product spec>

## Overview

1-2 paragraph summary of the technical approach. What are we building and what is the high-level strategy?

## Architecture Context

### Current State
- Description of relevant existing architecture
- Key files and modules that will be affected
- Existing patterns to follow

### Target State
- How the architecture will look after implementation
- New modules/components being introduced

### Architecture Diagram
(ASCII diagram showing component relationships)

## Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Layer 1 | Tech | Why |

## Data Models

### <Model Name>
- TypeScript interface with fields and types
- Storage: Where this lives (database table, API response, etc.)
- Relationships: How it connects to other models
- Validation: Key constraints

(repeat for each model)

## API Design

### <Endpoint or Function>
- **Purpose**: What it does
- **Signature**: `GET /api/resource` or `function name(params): ReturnType`
- **Input**: Parameters, request body
- **Output**: Response shape
- **Errors**: Error cases and codes

(repeat for each endpoint/function)

## Component Design

### <Component Name>
- **Purpose**: What it renders/manages
- **Props**: Input interface
- **State**: Internal state it manages
- **Dependencies**: Other components, hooks, services
- **File Location**: Where it will live in the codebase

(repeat for each component)

## Integration Points

- How this feature connects to existing code
- External service dependencies
- Event/message flows

## State Management

- How state flows through the feature
- State machine transitions (if applicable)
- Side effects and their triggers

## Error Handling Strategy

- Expected error scenarios
- Recovery strategies
- User-facing error messages

## Security Considerations

- Input validation approach
- Authentication/authorization checks
- Data sanitization

## Testing Strategy

- Unit test targets (functions, utilities)
- Component test targets (rendering, interactions)
- Integration test targets (API flows, state transitions)
- Edge cases to cover

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Risk 1 | High/Med/Low | High/Med/Low | Strategy |

## Open Technical Questions

- [ ] Decision 1: Options and trade-offs
- [ ] Decision 2: Options and trade-offs
```

## Guidelines

- Ground everything in the ACTUAL codebase — read existing files, reference real paths
- Follow existing patterns; do not introduce new architectural paradigms without justification
- Data models should include TypeScript interfaces that match existing conventions
- API design should follow existing route/function patterns in the project
- Every component should have a clear file location based on existing structure
- Testing strategy should use the project's existing test framework and patterns
- Be explicit about what files will be created vs. modified
