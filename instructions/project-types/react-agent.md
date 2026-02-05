# React Agent Project

Instructions specific to React-based AI agent projects.

## Tech Stack

- **Framework**: React 19+ with TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Animation**: Framer Motion
- **Testing**: Vitest
- **AI**: LiteLLM proxy for multi-model support

## Architecture

### State Machine Pattern

Agent workflows use a finite state machine:

```
IDLE → PROCESSING → REVIEW_NEEDED → RESOLVING → COMPLETED
                         ↓
                      [HITL]
```

### Human-in-the-Loop (HITL)

- Agent proposes actions, human approves/overrides
- All decisions logged for auditability
- Override requires rationale capture

### Eval-Driven Development

1. Define expected behavior in test cases first
2. Write deterministic assertions
3. Build implementation to pass tests
4. Add LLM-as-judge for subjective quality

## Component Patterns

### Agent Proposal Card

```typescript
interface AgentProposal {
  id: string;
  action: ProposedAction;
  confidence: number;
  rationale: string;
}

// UI shows proposal with approve/override buttons
```

### Activity Log

- Log all agent and human actions
- Include before/after state
- Support filtering and drill-down

## File Structure

```
src/
├── components/
│   ├── ui/              # shadcn components
│   ├── agent/           # Agent-specific UI
│   │   ├── ProposalCard.tsx
│   │   └── ActivityLog.tsx
│   └── workflow/        # Workflow UI
├── lib/
│   ├── agent/           # Agent core logic
│   │   ├── core.ts
│   │   └── tools/       # Agent tools
│   ├── mock/            # Mock data for dev
│   └── utils.ts
├── types/
│   ├── agent.ts
│   ├── workflow.ts
│   └── log.ts
└── evals/               # Evaluation test cases
    ├── setup.ts
    └── [feature]/
        ├── test-cases.json
        └── [feature].test.ts
```

## Conventions

### Workflow States

Use TypeScript unions for state:

```typescript
type WorkflowState =
  | 'IDLE'
  | 'FETCHING'
  | 'REVIEW_NEEDED'
  | 'RESOLVING'
  | 'COMPLETED'
  | 'ERROR';
```

### Agent Tools

Each tool is a pure function:

```typescript
interface ToolInput { ... }
interface ToolOutput { ... }

async function myTool(input: ToolInput): Promise<ToolOutput> {
  // Implementation
}
```

### Mock Data

Keep mocks realistic and use them in evals:

```typescript
// src/lib/mock/shipments.ts
export const mockShipments: Shipment[] = [
  { id: 'SHIP-001', ... },
];
```
