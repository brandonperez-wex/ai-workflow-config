---
name: research
description: Systematic investigation — codebase exploration, documentation, web research. Use before design decisions, when entering unfamiliar code, when multiple approaches exist, or when you need evidence to support a recommendation. Produces triangulated findings from multiple sources.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - WebSearch
  - WebFetch
  - Task
---

# Research

Investigate before you act. Form hypotheses and test them — don't passively read.

## When to Use

- Entering an unfamiliar codebase or module
- Before proposing architecture or design decisions
- When multiple approaches exist and you need evidence for trade-offs
- Investigating bugs or unexpected behavior
- Understanding an existing system before integrating with it
- Looking up library APIs, patterns, or best practices

## Core Principles

**Active over passive.** Form a specific question, hypothesize an answer, then seek evidence. Don't wander.

**Triangulate.** Never conclude from a single source. Findings supported by multiple independent sources (code + docs + tests, or multiple web sources) get high confidence. Contradictions between sources get flagged — they're often more interesting than agreements.

**Seek disconfirmation.** Actively look for evidence that contradicts your initial hypothesis. First impressions anchor you — fight it. If a pattern looks like the obvious answer, search for cases where it doesn't apply.

**Negative evidence matters.** A search that returns zero results is informative. Missing tests, missing docs, missing error handling — absence tells you something about the system's assumptions and blind spots.

**Iterate depth.** Research is not one pass. Round 1 reveals what you don't know. Use those gaps to form sharper questions for round 2. Each round should go deeper on fewer threads.

## Scoping the Investigation

Not all research is the same. Size the effort to the question:

| Type | When | Depth | Example |
|------|------|-------|---------|
| **Quick lookup** | Known question, likely one source | Single search or file read | "What's the API for library X?" |
| **Exploration** | Understand a system or module | Multi-source, 1 round | "How does auth work in this app?" |
| **Deep investigation** | Design decision with trade-offs | Multi-source, 2-3 rounds | "Should we use SSE or WebSockets?" |
| **Comprehensive review** | New domain, high-stakes decision | Multi-source, iterative rounds with follow-ups | "How should we architect the agent integration?" |

Default to **exploration**. Escalate to deep investigation when you find contradictions, multiple valid approaches, or surprising complexity.

## Process

### 1. Frame the Question

State what you need to learn in one sentence. If you can't, the scope is too broad — break it into sub-questions.

For each question, note:
- What you already know or suspect (your hypothesis)
- What sources are likely to have the answer
- What a useful answer looks like (so you know when to stop)

**Match the question to the right strategy:**
- "What does this code do?" → codebase-focused, edge-first exploration
- "What's the best approach for X?" → web-focused, multiple perspectives, comparison
- "Why was this built this way?" → git history, commit messages, docs, ADRs
- "Is this pattern correct?" → web search for best practices + codebase comparison

### 2. Diverge — Explore Broadly

Launch parallel investigations across multiple source types. Don't explore sequentially when you can explore simultaneously.

**Codebase exploration (edge-first):**
- Start from system boundaries: entry points, API routes, exports, event handlers
- Trace inward: follow imports, function calls, data flow
- Cycle between bottom-up (known APIs → callstacks → abstractions) and top-down (data structures → ownership → relationships)
- Read types and interfaces before implementations
- Read tests — they document expected behavior and edge cases

**Search strategy (multi-layer):**
1. **Broad keyword search** — Glob for file patterns, Grep for terms across the codebase
2. **Structural refinement** — narrow using regex patterns, directory scoping
3. **Targeted reading** — deep-read files identified in steps 1-2, with `file:line` precision

**Documentation:**
- Project docs: `README.md`, `ARCHITECTURE.md`, `docs/`, `.context/`
- Inline: JSDoc, comments on key interfaces and non-obvious logic
- Git history: recent commits on relevant files reveal intent and evolution

**Web research:**
- Use Context7 for library documentation when available
- Search for reference implementations, known issues, migration guides
- Look for multiple perspectives — not just the first Stack Overflow answer
- When initial results are too theoretical, follow up with implementation-specific searches

### 3. Deepen — Follow-Up Rounds

After the first pass, assess what you've learned vs what's still unclear:

- **Sharpen questions.** Round 1 answers should produce better questions for round 2. "How does X work?" becomes "Why does X use pattern Y instead of Z?"
- **Fill gaps.** If one source type was thin (e.g., no docs), compensate with another (e.g., tests, git history).
- **Resolve contradictions.** If sources disagree, investigate the context behind each. Often both are right in different situations.
- **Go deeper on fewer threads.** Each round should narrow scope and increase depth.

Skip this step for quick lookups. For deep investigations, expect 2-3 rounds.

### 4. Converge — Evaluate and Triangulate

Compare findings across sources with attention to source quality:

- **Convergent findings** (multiple sources agree) → high confidence, note as established
- **Divergent findings** (sources contradict) → investigate the contradiction, don't dismiss either side. Often reveals context-dependent trade-offs.
- **Single-source findings** → flag as unverified, note the source

**Weight sources by credibility:**
- Official docs, source code, and tests > blog posts and Stack Overflow
- Recent sources > old sources (especially for libraries and frameworks)
- Code that runs > documentation that claims

For each key finding, ask:
- Does the code actually do what the docs say?
- Do the tests cover what the comments claim?
- Is this pattern used because it's good, or because it's cargo-culted?

### 5. Synthesize and Present

Compile into a structured summary. Every finding gets a source reference. Lead with the answer. The user needs conclusions with evidence, not a narration of your search process.

## Output Format

```markdown
## Answer
[Direct answer to the research question — 1-3 sentences]

## Key Findings
1. **Finding** — Evidence with `path/file.ts:42` reference. [Confidence: high/medium/low]
2. **Finding** — Evidence from multiple sources

## How It Works
[Architecture/data flow relevant to the question. Trace the path.]

## Relevant Files
- `path/to/file.ts` — What it does, why it matters
- `path/to/other.ts` — What it does

## Contradictions & Surprises
[Anything that conflicted between sources, or deviated from expectations]

## Open Questions
[What's still unclear. What would need a deeper investigation.]
```

## Parallel Exploration Patterns

For understanding a system, launch multiple agents targeting different facets:

```
Agent 1: Structure — Glob + Read entry points, package.json, config
Agent 2: API surface — Grep for routes, exports, interfaces, types
Agent 3: Documentation — Read docs/, README, .context/, specs
Agent 4: External context — Web search for library patterns, known issues
```

Wait for all agents, then synthesize across their findings. Contradictions between agents are valuable — they reveal gaps in understanding.

## Bias Guards

| Trap | Antidote |
|------|----------|
| **Confirmation bias** — only finding evidence that supports your hypothesis | Explicitly search for counterexamples |
| **Anchoring** — over-weighting the first thing you found | Check at least 2-3 sources before concluding |
| **Cargo cult** — "they do it this way so it must be right" | Ask WHY the pattern exists. Check if the context still applies |
| **Availability bias** — favoring the familiar solution | Search for alternatives you haven't used before |
| **Premature convergence** — jumping to a conclusion before exploring enough | Ensure you've done the divergent phase before narrowing |

## Stopping Criteria

Stop researching when:
- The original question has a clear, evidence-backed answer
- Key findings are triangulated from 2+ independent sources
- Contradictions have been investigated (not just noted)
- Follow-up rounds are returning diminishing new information
- You can articulate what's known, what's uncertain, and what's unknown

Don't stop just because you found *an* answer. Stop because you found *the right* answer with evidence.

## Guidelines

- **Start broad, narrow fast.** Glob first, then targeted reads.
- **Don't read everything.** Entry points, types, and tests first. Implementation details when needed.
- **Always include source references.** Every finding links to evidence.
- **Flag uncertainty.** Ambiguous? Say so. Don't guess.
- **Be concise.** Conclusions, not process narration.
- **Use Context7** for library docs instead of guessing at APIs.
- **Parallelize aggressively.** Independent questions = parallel agents.
