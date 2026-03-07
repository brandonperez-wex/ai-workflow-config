# Model Selection Reference

Current as of March 2026. Verify pricing at anthropic.com/pricing.

## Available Models

| Model | ID | Input/Output (per M tokens) | Best For |
|-------|----|---------------------------|----------|
| Opus 4.6 | claude-opus-4-6 | $5 / $25 | Complex reasoning, architecture, review |
| Sonnet 4.6 | claude-sonnet-4-6 | $3 / $15 | Balanced: code gen, analysis, tool use |
| Haiku 4.5 | claude-haiku-4-5-20251001 | $1 / $5 | Fast: classification, extraction, routing |

## Selection Heuristics

| Task Type | Model | Why |
|-----------|-------|-----|
| Orchestrator agent | Opus or Sonnet | Needs complex reasoning for delegation |
| Code generation | Sonnet | Best balance of quality and speed |
| Code review | Opus | Catches subtle issues, understands context |
| Data extraction | Haiku | Fast, cheap, accurate for structured tasks |
| Classification / routing | Haiku | Low latency for high-volume decisions |
| Tool-heavy workflows | Sonnet | Reliable tool calling, good cost efficiency |
| Long-running tasks | Sonnet default, Opus for critical paths | Cost control with quality where it matters |

Default to Sonnet. Upgrade to Opus for tasks where reasoning quality directly impacts correctness. Downgrade to Haiku for high-volume, low-complexity subtasks.

## Multi-Model Strategy

Use different models for different stages:

```
Haiku (triage/classify) -> Sonnet (execute) -> Opus (review/validate)
```

Optimizes cost and latency while preserving quality where it matters.

## In Claude Agent SDK

```typescript
// Agent-level model override
agents: {
  "reviewer": {
    model: "opus",
    // ...
  }
}
```

In skills, use the frontmatter field: `model: sonnet`

## Cost Awareness

Multi-agent systems use around 15x more tokens than single agents. Three factors explain 95% of performance variance: token usage (80%), tool calls (15%), model choice (5%).

Model selection matters least among these factors. Optimize token efficiency and tool design first.
