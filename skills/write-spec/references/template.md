# Business Spec Template

```markdown
# Product Specification: <Feature Name>

> Date: YYYY-MM-DD
> Status: Draft | In Review | Approved
> Feature: specs/NNN-<topic>/
> Source: <path to input document, if any>

## Problem Statement

A clear, concise description of the problem this feature solves. Written from the user's perspective. 2-3 sentences maximum.

## Goals

- [ ] Goal 1: What success looks like
- [ ] Goal 2: What success looks like
- [ ] Goal 3: What success looks like

## Non-Goals (Out of Scope)

- What this feature explicitly does NOT address
- Boundaries to prevent scope creep

## User Stories

### Story 1: <Title>

**As a** [type of user]
**I want** [capability]
**So that** [benefit]

**Acceptance Criteria:**
- Given [context], when [action], then [outcome]
- Given [context], when [action], then [outcome]

### Story 2: <Title>
...

## Functional Requirements

### FR-1: <Requirement Name>
- What the system must do
- Expected behavior
- Testable success condition

### FR-2: <Requirement Name>
...

## Non-Functional Requirements

Include only sections that are relevant. Remove the rest.

- **Performance**: Response time, throughput expectations
- **Reliability**: Uptime, error handling expectations
- **Security**: Authentication, authorization, data protection needs
- **Accessibility**: Standards to meet (WCAG, etc.)

## Acceptance Test Scenarios

Business-readable test scenarios for PM/manager validation.

### Feature: <Feature Area 1>

Scenario: <Happy path>
  Given <context>
  When <action>
  Then <expected outcome>

Scenario: <Error case>
  Given <context>
  When <action>
  Then <expected outcome>

### Feature: <Feature Area 2>
...

## Technical Dependencies & Constraints

- Known technical constraints that affect business decisions
- External system dependencies
- Open technical questions that need investigation

## Assumptions

- Dependencies on other systems or teams
- Assumptions about user context or behavior

## Open Questions

- [ ] Question 1: What still needs to be decided?
- [ ] Question 2: What information is missing?

## Success Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| Metric 1 | N/A | Target | Method |
```
