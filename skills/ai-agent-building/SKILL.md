---
name: ai-agent-building
description: Building AI agents with Claude — Agent SDK, model selection, tool design, orchestration patterns, LiteLLM proxy, long-running harnesses, and eval-driven testing. Use when designing, building, or debugging AI agent systems.
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

# AI Agent Building

Build AI agents with Claude. Covers the Agent SDK, model selection, tool design, orchestration, proxy configuration, long-running harnesses, and evaluation-driven testing.

## When to Use

- Building a new AI agent or multi-agent system
- Designing tools for agent consumption
- Choosing models and routing strategies
- Setting up LiteLLM proxy for multi-model access
- Debugging agent behavior or tool failures
- Building long-running agent harnesses

## Core Loop: How Agents Work

Every effective agent follows the same loop:

```
Gather Context → Take Action → Verify Work → Iterate
```

1. **Gather Context** — Read files, search code, fetch URLs, query APIs
2. **Take Action** — Write code, run commands, call tools
3. **Verify Work** — Run tests, check output, validate assumptions
4. **Iterate** — If verification fails, adjust and retry (with limits)

The agent loop is not a pipeline — it's a cycle. Agents that skip verification accumulate errors silently.

## Claude Agent SDK

### Installation

**TypeScript:**
```bash
npm install @anthropic-ai/claude-agent-sdk
```

**Python:**
```bash
pip install claude-agent-sdk
```

### Basic Usage (TypeScript)

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

const conversation = await query({
  prompt: "Fix the failing test in src/utils.test.ts",
  options: {
    maxTurns: 10,
    systemPrompt: "You are a code repair agent.",
    allowedTools: ["Read", "Edit", "Bash", "Glob", "Grep"],
  },
});
```

### Basic Usage (Python)

```python
from claude_agent_sdk import query

conversation = query(
    prompt="Fix the failing test in src/utils.test.ts",
    options={
        "max_turns": 10,
        "system_prompt": "You are a code repair agent.",
        "allowed_tools": ["Read", "Edit", "Bash", "Glob", "Grep"],
    },
)
```

### Built-in Tools

The SDK provides these tools out of the box:

| Tool | Purpose | Notes |
|------|---------|-------|
| **Read** | Read files | Supports images, PDFs, notebooks |
| **Write** | Create files | Overwrites existing content |
| **Edit** | Modify files | Exact string replacement |
| **Glob** | Find files by pattern | Fast pattern matching |
| **Grep** | Search file contents | Regex support, ripgrep-based |
| **Bash** | Run shell commands | With timeout and sandboxing |
| **WebSearch** | Search the web | Returns search results |
| **WebFetch** | Fetch URL content | HTML → markdown conversion |
| **Task** | Launch subagents | Parallel work, specialized agents |

### Hooks

Hooks intercept tool calls for validation, logging, or transformation:

```typescript
const conversation = await query({
  prompt: "Refactor the auth module",
  hooks: {
    preToolUse: async (toolName, input) => {
      // Block destructive commands
      if (toolName === "Bash" && input.command.includes("rm -rf")) {
        return { blocked: true, reason: "Destructive command blocked" };
      }
      return { allowed: true };
    },
    postToolUse: async (toolName, input, output) => {
      // Log all tool calls
      console.log(`[${toolName}] ${JSON.stringify(input).slice(0, 100)}`);
    },
    stop: async (response) => {
      // Custom stop conditions
      return { shouldStop: false };
    },
  },
});
```

### Subagents via Task Tool

Use subagents for parallel independent work:

```typescript
// The agent can spawn subagents through the Task tool
// Each subagent gets its own context window and tool access
// Results flow back to the parent agent

// Good: parallel file reads, independent research, concurrent tests
// Bad: shared state modifications, sequential dependencies
```

### Sessions and Resume

```typescript
// First run — save the conversation ID
const result = await query({ prompt: "Start the refactoring" });
const conversationId = result.conversationId;

// Later — resume with full context preserved
const continued = await query({
  prompt: "Continue with the next step",
  resume: conversationId,
});
```

### MCP Integration

Agents can use MCP (Model Context Protocol) servers for additional tools:

```typescript
const conversation = await query({
  prompt: "Check the database status",
  options: {
    mcpServers: [
      {
        name: "database",
        command: "npx",
        args: ["@myorg/db-mcp-server"],
      },
    ],
  },
});
```

### Permissions Model

Control what agents can do:

| Level | Behavior |
|-------|----------|
| **allowedTools** | Whitelist specific tools |
| **Hooks (preToolUse)** | Fine-grained per-call validation |
| **Bash sandboxing** | Restrict shell command scope |
| **MCP permissions** | Per-server tool access |

**Principle of least privilege.** Start with minimal tools, add as needed. An agent with `Bash` access can do almost anything — restrict it unless required.

## Model Selection

### Current Models (Feb 2026)

| Model | ID | Input/Output (per M tokens) | Best For |
|-------|----|-----------------------------|----------|
| **Opus 4.6** | `claude-opus-4-6` | $5 / $25 | Complex reasoning, architecture, multi-step |
| **Sonnet 4.5** | `claude-sonnet-4-5-20250929` | $3 / $15 | Balanced: code gen, analysis, tool use |
| **Haiku 4.5** | `claude-haiku-4-5-20251001` | $1 / $5 | Fast: classification, extraction, simple tasks |

### Selection Heuristics

| Task Type | Recommended Model | Why |
|-----------|-------------------|-----|
| Orchestrator agent | Opus or Sonnet | Needs complex reasoning for delegation |
| Code generation | Sonnet | Best balance of quality and speed |
| Code review | Opus | Catches subtle issues, understands context |
| Data extraction | Haiku | Fast, cheap, accurate for structured tasks |
| Classification / routing | Haiku | Low latency for high-volume decisions |
| Tool-heavy workflows | Sonnet | Reliable tool calling, good cost efficiency |
| Long-running tasks | Sonnet (default), Opus (critical paths) | Cost control with quality where it matters |

**Default to Sonnet.** Upgrade to Opus for tasks where reasoning quality directly impacts correctness. Downgrade to Haiku for high-volume, low-complexity subtasks.

### Multi-Model Strategy

Use different models for different stages:

```
Haiku (triage/classify) → Sonnet (execute) → Opus (review/validate)
```

This optimizes cost and latency while preserving quality where it matters.

## Tool Design for Agents

Tools are the primary way agents interact with external systems. Well-designed tools make agents more reliable; poorly designed tools cause hallucination and failure loops.

### Naming

- **Verb-noun format:** `searchUsers`, `createTask`, `getFileContents`
- **Namespace related tools:** `jira_createIssue`, `jira_searchIssues`, `jira_getIssue`
- **Avoid generic names:** `process`, `handle`, `run` — agents can't distinguish them

### Parameters

- **Descriptive names** with clear types and constraints
- **Required vs optional** — mark explicitly. Agents hallucinate optional params when confused
- **Enums over free text** — `status: "open" | "closed"` not `status: string`
- **Defaults documented** — "If omitted, defaults to the current directory"

### Error Responses

Return structured, actionable errors:

```typescript
// Good — agent can reason about what went wrong
{ error: "NOT_FOUND", message: "Issue PROJ-123 not found", suggestion: "Check the project key" }

// Bad — agent will retry blindly
{ error: "Something went wrong" }
```

Include:
- Error code (machine-readable)
- Human-readable message
- Suggested fix or next action
- Whether the error is retryable

### Response Format

- **Return only high-signal fields.** Don't dump entire database rows
- **Implement pagination** for list endpoints — agents can't process unbounded results
- **Truncate large responses** at ~25k tokens — beyond this, agents lose context
- **Consider a ResponseFormat enum** (`DETAILED` | `CONCISE`) so agents can request what they need

### Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| **Kitchen-sink responses** | Agent drowns in data, misses key info | Return only what's needed for the task |
| **Silent failures** | Tool returns empty/null instead of error | Always return explicit error states |
| **Ambiguous parameters** | Agent guesses wrong param format | Use enums, examples, clear constraints |
| **No pagination** | Agent gets truncated results without knowing | Add cursor-based pagination |
| **Nested tool calls** | Tool requires calling other tools first | Flatten workflows, combine related operations |

### Eval-Driven Tool Development

Don't guess if tools work — measure:

1. **Define success criteria** — what does correct tool use look like?
2. **Build eval cases** — representative inputs + expected outputs
3. **Run agent with tools** — measure success rate, error patterns
4. **Iterate on tool design** — fix the most common failure modes first

## LiteLLM Proxy

LiteLLM provides a unified OpenAI-compatible gateway to 100+ LLM providers. Use it when you need multi-provider routing, cost tracking, or API key management.

### Basic Setup

**config.yaml:**
```yaml
model_list:
  - model_name: claude-sonnet
    litellm_params:
      model: anthropic/claude-sonnet-4-5-20250929
      api_key: os.environ/ANTHROPIC_API_KEY

  - model_name: claude-haiku
    litellm_params:
      model: anthropic/claude-haiku-4-5-20251001
      api_key: os.environ/ANTHROPIC_API_KEY

  - model_name: claude-opus
    litellm_params:
      model: anthropic/claude-opus-4-6
      api_key: os.environ/ANTHROPIC_API_KEY

general_settings:
  master_key: sk-your-master-key
```

**Start the proxy:**
```bash
litellm --config config.yaml
# Runs on http://0.0.0.0:4000
```

**Docker:**
```bash
docker run -v $(pwd)/config.yaml:/app/config.yaml \
  -p 4000:4000 \
  ghcr.io/berriai/litellm:main-latest \
  --config /app/config.yaml
```

### Model Aliases and Routing

Route requests to different models dynamically:

```yaml
model_list:
  - model_name: fast-tier
    litellm_params:
      model: anthropic/claude-haiku-4-5-20251001
      api_key: os.environ/ANTHROPIC_API_KEY

  - model_name: quality-tier
    litellm_params:
      model: anthropic/claude-sonnet-4-5-20250929
      api_key: os.environ/ANTHROPIC_API_KEY

router_settings:
  routing_strategy: least-busy  # or: simple-shuffle, latency-based
```

### Virtual Keys

Generate per-user or per-agent API keys with budget limits:

```bash
curl -X POST http://0.0.0.0:4000/key/generate \
  -H "Authorization: Bearer sk-your-master-key" \
  -d '{"models": ["fast-tier"], "max_budget": 10.0, "duration": "7d"}'
```

### When to Use LiteLLM

| Scenario | Use LiteLLM? |
|----------|-------------|
| Single provider, single model | No — direct API is simpler |
| Multiple providers or models | Yes — unified interface |
| Per-agent budget tracking | Yes — virtual keys with limits |
| Load balancing across deployments | Yes — routing strategies |
| Development proxy for testing | Yes — easy model swapping |

## Long-Running Agent Harnesses

For tasks that exceed a single session (large refactors, multi-file features, complex investigations):

### Initializer + Worker Pattern

Split the work into two agents:

1. **Initializer Agent** — Reads the codebase, creates a structured plan, writes it to a file
2. **Worker Agent** — Reads the plan, executes one step at a time, updates progress

```
Initializer → plan.json → Worker (step 1) → Worker (step 2) → ... → Done
```

### Progress Tracking

Use a progress file for session handoff:

```markdown
# Progress

## Completed
- [x] Step 1: Set up database schema
- [x] Step 2: Create API endpoints

## Current
- [ ] Step 3: Build service layer (IN PROGRESS — adapter done, service pending)

## Remaining
- [ ] Step 4: Add integration tests
- [ ] Step 5: Wire up frontend
```

The worker reads this file at the start of each session, picks up where it left off, and updates it as it works.

### Feature Lists (JSON)

For complex features, define the work as structured JSON:

```json
{
  "feature": "user-authentication",
  "slices": [
    {
      "name": "walking-skeleton",
      "status": "completed",
      "integration_test": "tests/auth/skeleton.test.ts"
    },
    {
      "name": "login-flow",
      "status": "in_progress",
      "layers": ["route", "service", "adapter"],
      "current_layer": "service"
    },
    {
      "name": "session-management",
      "status": "pending",
      "blocked_by": ["login-flow"]
    }
  ]
}
```

### Session Resume

Use the SDK's resume capability to continue work across sessions:

```typescript
// Save conversation ID after each session
fs.writeFileSync(".agent-session", result.conversationId);

// Resume in next session
const sessionId = fs.readFileSync(".agent-session", "utf-8");
const result = await query({
  prompt: "Continue with the next step in the plan",
  resume: sessionId,
});
```

## Agent Orchestration Patterns

Choose the simplest pattern that works. Complexity has costs — coordination overhead, latency, failure modes.

| Pattern | How It Works | Best For | Watch For |
|---------|-------------|----------|-----------|
| **Single agent + tools** | One agent with multiple tools | Most tasks | Tool overload (>15 tools) |
| **Sequential pipeline** | Agent A → Agent B → Agent C | Step-by-step refinement | Early failures propagate |
| **Fan-out/fan-in** | Parallel agents, merge results | Independent analysis | Conflict resolution |
| **Orchestrator-worker** | Central agent delegates to specialists | Cross-domain tasks | Orchestrator bottleneck |
| **Handoff chain** | Dynamic delegation, one active agent | Specialist routing | Infinite loops |

**Default to single agent with tools.** Only add orchestration when you can demonstrate a single agent fails due to prompt complexity, tool count, or security boundaries.

### When to Split Into Multiple Agents

- **Tool count > 15** — agents get confused with too many options
- **Conflicting system prompts** — one agent can't be both "be creative" and "be strict"
- **Security boundaries** — different agents need different access levels
- **Specialist knowledge** — domain-specific prompts improve quality

## Testing Agents

### Eval-Driven Development

Don't ship agents without evals. Agent behavior is non-deterministic — you need statistical confidence.

```typescript
// Define eval cases
const evals = [
  {
    input: "Fix the type error in src/utils.ts",
    grader: async (result) => {
      // Run tsc and check for errors
      const { exitCode } = await exec("npx tsc --noEmit");
      return exitCode === 0;
    },
  },
  {
    input: "Add a unit test for the parseDate function",
    grader: async (result) => {
      // Check test file exists and passes
      const { exitCode } = await exec("npx jest src/parseDate.test.ts");
      return exitCode === 0;
    },
  },
];

// Run evals
for (const eval of evals) {
  const results = [];
  for (let i = 0; i < 5; i++) {  // 5 trials per case
    const result = await query({ prompt: eval.input });
    results.push(await eval.grader(result));
  }
  const passRate = results.filter(Boolean).length / results.length;
  console.log(`${eval.input}: ${passRate * 100}% pass rate`);
}
```

### Grader Types

| Grader | How It Works | Use When |
|--------|-------------|----------|
| **Deterministic** | Exact match, regex, exit code | Clear right/wrong answer |
| **LLM-as-judge** | Another model evaluates output | Subjective quality assessment |
| **Human review** | Manual inspection of results | Novel tasks, high stakes |
| **Composite** | Multiple graders combined | Complex success criteria |

### What to Measure

- **Success rate** — does the agent complete the task correctly?
- **Tool call efficiency** — how many tool calls to reach the answer?
- **Error recovery** — does the agent recover from tool failures?
- **Cost per task** — total token usage across all turns
- **Latency** — end-to-end time for the complete task

## Common Agent Failure Patterns

| Pattern | Symptom | Fix |
|---------|---------|-----|
| **Infinite retry loops** | Agent retries same failing action | Add max retry limits, change approach after 2 failures |
| **Context window overflow** | Agent loses early context, repeats work | Use subagents, summarize intermediate results |
| **Tool hallucination** | Agent calls non-existent tool or wrong params | Validate tool names, use strict schemas |
| **Over-eager execution** | Agent acts before understanding the problem | System prompt: "Read and understand before acting" |
| **Verification skipping** | Agent claims success without checking | Require explicit verification steps in system prompt |
| **Scope creep** | Agent "improves" unrelated code | Constrain scope in system prompt, use hooks to flag |

## Process: Building a New Agent

### 1. Define the Task

- What does the agent do? (one sentence)
- What tools does it need?
- What does success look like? (measurable)

### 2. Start Simple

- Single agent, minimal tools
- Hardcode what you can, make dynamic later
- Get one happy path working end-to-end

### 3. Add Tools Incrementally

- One tool at a time
- Test after each addition
- Watch for tool confusion (agent picks wrong tool)

### 4. Write Evals

- 5-10 representative tasks
- Mix easy, medium, hard
- Run 3-5 trials per task (non-determinism)
- Target >80% pass rate before shipping

### 5. Harden

- Add error handling to tools
- Set max turn limits
- Add hooks for safety rails
- Test edge cases (empty input, large files, network failures)

### 6. Monitor

- Log all tool calls and results
- Track cost per task
- Alert on failure rate spikes
- Review agent traces regularly

## Guidelines

- **Start with one agent.** Multi-agent systems are harder to debug, test, and reason about. Earn complexity.
- **Tools are the interface.** Well-designed tools make agents reliable. Invest time here.
- **Verify, don't trust.** Agents hallucinate. Always verify tool results and agent claims programmatically.
- **Eval before shipping.** Non-deterministic systems need statistical confidence. 5 trials minimum per eval case.
- **Cost-aware model selection.** Use Haiku for simple subtasks, Sonnet for main work, Opus for critical decisions. Don't use Opus for everything.
- **Constrain scope.** Agents with broad mandates produce unpredictable results. Narrow the task, narrow the tools.
- **Log everything.** Agent debugging without logs is guessing. Log tool calls, results, decisions, errors.
- **Fail fast, fail loud.** Agents that silently fail are worse than agents that crash. Surface errors immediately.
