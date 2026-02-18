---
name: write-spec
description: Formalize brainstorming output into a non-technical product specification. Use after brainstorming to create a product spec with user stories, requirements, and acceptance criteria.
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - Bash
  - Skill
argument-hint: "[path/to/design.md or topic name]"
---

# Write Product Specification

Transform brainstorming output or a design document into a formal, non-technical product specification.

## When to Use

- After a brainstorming session that produced a design document in `docs/plans/`
- When you need to formalize loose requirements into structured product specs
- As the first step of the spec → technical → tasks pipeline

## Input Resolution

1. If `$ARGUMENTS` is a file path, read that file as input
2. If `$ARGUMENTS` is a topic name, search `docs/plans/` for the most recent `*-design.md` matching that topic
3. If no arguments, search `docs/plans/` for the most recently modified `*-design.md` file
4. If no design file exists, ask the user to describe the feature

## Collaboration Principles

**The user is the bottleneck, not you.** They read and decide slower than you generate. Optimize for their comprehension, not your throughput.

- **Keep it short.** Prefer bullet points over paragraphs. One idea per message.
- **Decide together.** Don't fill in answers to open questions — present options and ask.
- **Build incrementally.** Walk through the spec section by section, not all at once.
- **Respect reading fatigue.** If you're about to send a wall of text, break it up or summarize first and offer details on request.

## Process

### Step 1: Understand the Input
- Read the brainstorming/design document thoroughly
- Identify the core problem being solved
- Extract all mentioned features, constraints, and goals

### Step 2: Align on Scope
Before writing anything, have a short conversation with the user:
1. **State the problem** in 2-3 sentences. Ask: "Does this capture it?"
2. **List the goals** as bullets (3-5 max). Ask: "Anything missing or wrong?"
3. **Propose non-goals** to set boundaries. Ask: "Agree these are out of scope?"
4. **Surface open questions** that need the user's input before you can proceed

Only move on once the user confirms alignment on problem + goals + scope.

### Step 3: Build the Spec Collaboratively
Work through the spec template section by section. For each section:
- Draft it concisely
- Present it to the user for feedback
- Incorporate changes before moving on

You do NOT need to present every section individually — group related ones (e.g., user stories + acceptance criteria together). Use your judgment on pacing: if things are flowing and the user is aligned, move faster. If there's uncertainty, slow down and ask.

**Key decision points to always pause on:**
- User stories (are these the right scenarios?)
- Functional requirements (is anything missing?)
- Open questions (get answers, don't assume)

### Step 4: Save the Artifact
- Derive the filename from the input file: replace `-design.md` with `-spec.md`
- If no input file, use format: `docs/plans/YYYY-MM-DD-<topic>-spec.md`
- Get today's date: !`date +%Y-%m-%d`
- Ensure directory exists: `mkdir -p docs/plans`

### Step 5: Hand Off to Technical Breakdown
After saving, give the user a brief summary of what was decided and let them know the next step is `technical-breakdown`. Invoke it:
```
Skill: technical-breakdown
Args: <path-to-spec-file>
```

Do NOT skip asking — confirm the user is ready to move on.

## Spec Template

The spec file MUST follow this structure:

```markdown
# Product Specification: <Feature Name>

> Date: YYYY-MM-DD
> Status: Draft
> Source: <path to input design document>

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
- [ ] Given [context], when [action], then [outcome]
- [ ] Given [context], when [action], then [outcome]

(repeat for each story)

## Functional Requirements

### FR-1: <Requirement Name>
- Description of what the system must do
- Expected behavior
- Input/output expectations

(repeat for each requirement)

## Non-Functional Requirements

- **Performance**: Response time, throughput expectations
- **Reliability**: Uptime, error handling expectations
- **Security**: Authentication, authorization, data protection needs
- **Accessibility**: Standards to meet (WCAG, etc.)
- **Scalability**: Expected load, growth considerations

## Assumptions

- List of assumptions being made
- Dependencies on other systems or teams

## Open Questions

- [ ] Question 1: What still needs to be decided?
- [ ] Question 2: What information is missing?

## Success Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| Metric 1 | N/A | Target | Method |
```

## Guidelines

- Keep language non-technical — no implementation details, no code references
- Every user story must have concrete acceptance criteria
- Functional requirements should be testable and unambiguous
- If the brainstorming doc mentions technical solutions, translate them into requirements ("system should do X" not "use library Y to do X")
- Capture open questions rather than making assumptions silently
- Include non-goals explicitly to prevent scope creep
