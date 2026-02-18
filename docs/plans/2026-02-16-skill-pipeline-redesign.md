# Skill Pipeline Redesign

> Date: 2026-02-16
> Status: Approved

## Problem

Two competing skill pipelines exist:
- **Superpowers plugin:** brainstorming → writing-plans → executing-plans → verification → finishing
- **Custom skills:** write-spec → technical-breakdown → decompose-tasks

They don't connect and create confusion about which flow to use.

## Solution: Minimal Pipeline

Three phase skills, four utility skills. Research available throughout.

```
research ──→ design ──→ build ──→ ship
 (utility)   (collab)   (auto)   (review)
```

## Skills

### Phase Skills

| Skill | Purpose |
|-------|---------|
| **design** | Thin orchestrator. Collaborative spec + architecture + task breakdown. Invokes utility skills. |
| **build** | Autonomous execution + verification. Implements the plan, runs tests, fixes issues. |
| **ship** | User reviews work. Commit, PR, merge. |

### Utility Skills

| Skill | Invoked by | Purpose |
|-------|-----------|---------|
| **research** | Any phase | Codebase exploration, doc reading, web search. Full-spectrum investigation. |
| **tdd-edd** | design, build | Test/eval-first thinking. Define acceptance criteria, test cases, eval strategies. |
| **ui-ux-design** | design | Modern design principles for AI apps. Visual trends, interaction patterns, UX theory. |
| **architecture** | design | Technical design. Components, data flow, APIs, integration points. |

### Kept As-Is

- `code-review` — standalone
- `commit-and-pr` — used within ship
- `frontend-design` (superpowers plugin) — code generation, separate from UX theory
- `skill-creator` — meta skill
- Document skills (pdf, docx, xlsx, pptx)

### Retired

- `write-spec` → absorbed into `design`
- `technical-breakdown` → absorbed into `design` + `architecture`
- `decompose-tasks` → absorbed into `design`
- Superpowers pipeline skills replaced by our phase skills

## Design Phase Flow

1. **Understand** — Concise questions about what we're building
2. **Research** — Invoke research skill to explore codebase/docs/web
3. **Architecture** — Invoke architecture skill for technical design
4. **TDD/EDD** — Invoke tdd-edd skill for test definitions
5. **UI/UX** — Invoke ui-ux-design skill if frontend work
6. **Tasks** — Break into ordered implementation steps
7. **Save** — Write design doc to `docs/plans/`

User is in the loop throughout: concise updates, flag key decisions, ask when unsure.

## Build Order

1. research (helps build the others)
2. tdd-edd
3. ui-ux-design
4. architecture
5. design (orchestrator)
6. build
7. ship
