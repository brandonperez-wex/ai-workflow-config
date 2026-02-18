---
name: tdd-edd
description: Test-driven and eval-driven development. Use when defining test strategy, writing tests before implementation, designing vertical feature slices, or building AI agent evaluations. Integration tests for confidence, unit tests for speed, evals for agent behavior.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - Task
---

# TDD / Eval-Driven Development

Define what "done" looks like before writing code. Every feature is a vertical slice tested against the real system.

## Philosophy

**"Write tests. Not too many. Mostly integration."** Integration tests provide the highest confidence-to-cost ratio. They test how components actually work together, not how you imagine they do in isolation.

The **testing trophy** (not the pyramid): static analysis at the base, then unit tests, then a thick band of integration tests, then a thin layer of E2E. Most effort goes to integration.

## Core Concept: Double-Loop TDD

Two loops working together:

**Outer loop** (integration test) — Write a real integration test for the feature. It stays red until the full vertical slice is built. This is the guiding test.

**Inner loop** (unit tests) — As you build each layer, write unit tests for component logic. These go green quickly and drive the design of each piece.

The outer loop tells you WHAT to build. The inner loop tells you HOW to build each piece.

## Vertical Feature Slices

Every feature cuts through all layers:

```
Integration test (no mocks, proves it works)
    ↓
API endpoint / route
    ↓
Service layer
    ↓
Adapter / data layer
    ↓
External system (agent, database, etc.)
```

Build vertically, not horizontally. Don't build all routes, then all services, then all adapters. Build one complete slice at a time.

**A good vertical slice:**
- Has a clear user action ("trigger a workflow run")
- Touches every layer from API to external system
- Can be integration tested independently
- Delivers visible value when complete

## The Mock Boundary

Not everything gets mocked. The rule is about dependency ownership:

| Dependency Type | Mock? | Reasoning |
|----------------|-------|-----------|
| **Controlled** (your database, your file system, your message queue) | No — use real instances | You own it. Test against production-equivalent infrastructure (Testcontainers, test DB). |
| **Uncontrolled** (third-party APIs, payment processors, external services) | Yes — mock at the adapter boundary | You can't guarantee their behavior. Verify you send the right request, not that they process it correctly. |

**In integration tests:** use real controlled dependencies. Mock uncontrolled dependencies at the adapter boundary.

**In unit tests:** mock anything outside the unit under test.

**Never use in-memory substitutes** (e.g., SQLite for Postgres). Test against the same type and version as production.

## Process

### 0. Walking Skeleton (First Slice Only)

For the very first feature, prove the system connects end-to-end:
- Can you build and run the server?
- Can you hit the API and get a response?
- Does the database connect?
- Does CI run tests?

This is the thinnest possible slice that proves infrastructure works. Every subsequent slice builds on it.

### 1. Write the Integration Test

Start here. This test runs against the real system — real API, real database, real controlled dependencies.

```typescript
describe('Feature: Trigger workflow run', () => {
  it('should start a workflow and return task status', async () => {
    const response = await fetch(`${BASE_URL}/api/agents/${agentId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ type: 'workflow_run' }),
    })
    expect(response.status).toBe(201)

    const task = await response.json()
    expect(task.data.status).toBe('queued')
  })
})
```

### 2. Watch It Fail

Run the test. It should fail because the feature doesn't exist. Confirm it fails for the **right reason** — "not found" or "not implemented," not because the test itself is broken.

### 3. Build the Slice

Implement each layer. Add unit tests at each layer as you go:
- Route handler + route unit tests
- Service method + service unit tests
- Adapter implementation + adapter unit tests
- Type definitions
- Schema changes if needed

### 4. Integration Test Goes Green

When the full slice is implemented, the integration test passes. The feature is done.

### 5. Refactor

Clean up while all tests stay green. If refactoring breaks tests, the tests were testing implementation, not behavior — fix the tests.

### 6. Next Slice

Move on. Never start a new slice while the current integration test is red.

## Three Test Layers

| Layer | Mocks? | Speed | Confidence | When |
|-------|--------|-------|------------|------|
| **Integration** | Controlled deps: no. Uncontrolled: mock at adapter. | Slow | High | First — before any implementation |
| **Unit** | Yes — isolate the component | Fast | Medium | During implementation, at each layer |
| **Eval** | No — real LLM calls | Very slow | Varies | When building agent/LLM features |

### Integration Tests
- One per vertical feature slice
- Run against real running system (server, database, controlled dependencies)
- Slow is fine — confidence over speed
- Test the contract, not the implementation

### Unit Tests
- Mock external dependencies
- Test logic, edge cases, error handling, transformations
- Fast, isolated, run frequently
- Colocated with implementation files

## Eval-Driven Development (for AI Agent Features)

Classical TDD doesn't fit LLM agents directly — agents are non-deterministic, operate in open-ended contexts, and their "correct" behavior may have multiple valid forms.

Eval-driven development adapts TDD principles for this reality.

### Core Vocabulary

- **Task** — A single test scenario with defined inputs and success criteria
- **Trial** — One attempt at a task (multiple trials account for non-determinism)
- **Grader** — Logic that scores agent performance on a task
- **Transcript** — Complete record of outputs, tool calls, and reasoning

### Three Grader Types

| Type | When | Strengths | Weaknesses |
|------|------|-----------|------------|
| **Code-based** | Deterministic outcomes (did the file get created? did the API return 200?) | Fast, cheap, reproducible | Brittle to valid variations |
| **Model-based** | Subjective quality (was the response helpful? did it follow the rubric?) | Flexible, captures nuance | Non-deterministic, needs calibration |
| **Human** | High-stakes or ambiguous (is this medically accurate?) | Gold standard | Slow, expensive |

Use code-based graders wherever possible. Reserve model-based for quality assessment. Calibrate model graders against human judgment.

### Eval Process

1. **Define success criteria** before building. What does "good" look like? Be specific enough that a grader can check it.
2. **Start small** — 20-50 tasks from real use cases and known failures.
3. **Use multiple trials** — Run each task 3-5 times. Use pass@k (succeeds at least once) and pass^k (succeeds every time) to measure reliability.
4. **Grade at multiple levels** — End-to-end outcomes AND intermediate steps (did it use the right tool? did the plan make sense?).
5. **Read transcripts** — Regularly review agent traces. This is how you catch failure modes that graders miss.
6. **Iterate the evals themselves** — Evals are living artifacts. Update them as the product evolves.

### Eval Anti-Patterns

- **Exact string matching** for LLM output — use structural and semantic checks instead
- **Single trial** per task — non-determinism means one run proves nothing
- **Shared state** between trials — previous trials corrupting current ones
- **Testing implementation** — "did it call tool X?" vs "did it achieve the outcome?"
- **Ignoring transcripts** — passing evals with bad process indicates brittle grading

### During Design Phase

When invoked by the design skill, produce:

```markdown
## Test Plan

### Vertical Slices
1. **Slice: [Name]** — [User action → path through system]
   - Integration: [What the real test asserts]
   - Unit: [Key component tests at each layer]

2. **Slice: [Name]** — ...

### Eval Strategy (if agent behavior involved)
- **Task:** [What the agent should do]
- **Grader:** [Code-based / model-based / human]
- **Success criteria:** [Specific, measurable outcome]
- **Trials:** [How many, pass@k threshold]
```

### During Build Phase

For each vertical slice, enforce this order:
1. Integration test exists and fails (red)
2. Build the slice layer by layer, adding unit tests (inner loop)
3. Integration test passes (green)
4. Refactor while green
5. Run all previous slices' tests — no regressions
6. Move to next slice

## Guidelines

- **Integration test is the source of truth.** If it passes, the feature works.
- **Vertical over horizontal.** Complete one slice before starting another.
- **Test behavior, not implementation.** Refactoring shouldn't break tests.
- **Mock at the boundary, not everywhere.** Real controlled deps. Mocked uncontrolled deps.
- **Evals are not unit tests.** Expect variance. Use ranges and structural checks.
- **Start evals early.** Even 20 tasks catches regressions. Don't wait for hundreds.
- **Read the transcripts.** Automated evals alone miss subtle failures.
