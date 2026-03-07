# Technical Spec Template

```markdown
# Technical Design: <Feature Name>

> Date: YYYY-MM-DD
> Status: Draft | In Review | Approved
> Feature: specs/NNN-<topic>/
> Business Spec: specs/NNN-<topic>/spec.md

## Overview

1-2 paragraph summary of the technical approach. Current state and target state.

## Architecture

### Current State
- Relevant existing architecture
- Key files and modules affected
- Existing patterns to follow

### Target State
- How architecture looks after implementation
- New modules/components being introduced

### Architecture Diagram
[Use project diagramming tools]

## Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Layer 1 | Tech | Why |

## Data Models

### <Model Name>

```typescript
interface ModelName {
  field: type;
}
```

- Storage: Where this lives
- Relationships: How it connects to other models
- Validation: Key constraints

## API Design

### <Endpoint or Function>
- **Purpose**: What it does
- **Signature**: `GET /api/resource` or `function name(params): ReturnType`
- **Input**: Parameters, request body
- **Output**: Response shape
- **Errors**: Error cases and codes

## Test Strategy

### Integration Tests (from business spec acceptance scenarios)

| Business Scenario | Test Contract | Mock Boundary |
|---|---|---|
| Given X, When Y, Then Z | `test('should Z when Y given X')` | Mock: external API |

### Unit Test Targets
- [Function/module]: [What to test]

## Component Design (if frontend)

### <Component Name>
- **Purpose**: What it renders/manages
- **Props**: Input interface
- **State**: Internal state
- **File Location**: Where it lives

## Vertical Slices

### Slice 0: Walking Skeleton
- **What:** Thinnest end-to-end path proving infrastructure works
- **Integration test:** [Basic connectivity assertion]
- **Layers:** [Minimal path through all layers]

### Slice 1: [Name]
- **What:** [User-visible behavior]
- **Integration test:** [What the test asserts]
- **Layers:** [Route → Service → Adapter → External]
- **Types:** [Key interfaces]
- **Files:** [Created / modified]

### Slice 2: [Name]
...

## Decisions

| Decision | Alternatives Considered | Rationale |
|----------|------------------------|-----------|
| Decision 1 | A, B, C | Why we chose A |

## Security Considerations
[Only if relevant — input validation, auth, data protection]

## Performance Considerations
[Only if relevant — caching, optimization, load expectations]

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Risk 1 | High/Med/Low | Strategy |

## Open Technical Questions

- [ ] Question 1: Options and trade-offs
- [ ] Question 2: Options and trade-offs
```
