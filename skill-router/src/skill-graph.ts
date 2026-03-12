/**
 * The skill graph definition — macro categories, sub-skills, and edges.
 * Embeddings are added by build-graph.ts.
 */

import type { SkillGraph } from "./graph.js";

export const SKILL_GRAPH_DEFINITION: Omit<SkillGraph, "version" | "model"> = {
  nodes: {
    // ── Macro Categories ──────────────────────────────────────────────
    "software-design": {
      id: "software-design",
      type: "macro",
      description:
        "Feature development, system design, architecture, implementation, and delivery. Use when building new features, designing systems, refactoring, or shipping code.",
      invoke: "design",
      keywords: ["build", "feature", "implement", "architect", "refactor", "create", "add", "develop"],
    },
    "quality": {
      id: "quality",
      type: "macro",
      description:
        "Debugging, code review, testing, and verification. Use when something is broken, needs review, or needs to be validated.",
      invoke: null,
      keywords: ["bug", "error", "broken", "fail", "review", "test", "verify", "wrong", "crash", "500"],
    },
    "product": {
      id: "product",
      type: "macro",
      description:
        "Product management — specs, definitions, task breakdown, and backlog management. Use when defining what to build, writing requirements, or breaking down work.",
      invoke: "write-spec",
      keywords: ["spec", "requirements", "user story", "product", "scope", "MVP", "backlog"],
    },
    "business": {
      id: "business",
      type: "macro",
      description:
        "Business strategy — opportunity evaluation, market analysis, customer research, financial modeling, and experiments. Use when evaluating ideas, sizing markets, or building business cases.",
      invoke: "opportunity-research",
      keywords: ["opportunity", "market", "TAM", "revenue", "business case", "customer", "experiment"],
    },
    "ai-engineering": {
      id: "ai-engineering",
      type: "macro",
      description:
        "AI agent development — building agents, prompt engineering, eval-driven testing, tool discovery, and MCP servers. Use when building AI systems, writing prompts, or creating agent tooling.",
      invoke: null,
      keywords: ["agent", "prompt", "eval", "MCP", "tool", "LLM", "AI", "Claude", "SDK"],
    },
    "infrastructure": {
      id: "infrastructure",
      type: "macro",
      description:
        "Infrastructure and DevOps — project scaffolding, CI/CD, cloud architecture, and workspace management. Use when setting up projects, deploying, or managing environments.",
      invoke: null,
      keywords: ["deploy", "CI", "CD", "scaffold", "infra", "cloud", "AWS", "Docker", "pipeline"],
    },
    "meta": {
      id: "meta",
      type: "macro",
      description:
        "Claude Code workflow management — skill creation, maintenance, evaluation, orchestration, and research. Use when improving Claude Code itself, creating skills, or investigating how things work.",
      invoke: null,
      keywords: ["skill", "workflow", "Claude Code", "improve", "meta", "how does"],
    },
    "delivery": {
      id: "delivery",
      type: "macro",
      description:
        "Shipping and task management — commits, PRs, kanban boards, parallel execution, and workspace isolation. Use when ready to commit, create PRs, manage tasks, or parallelize work.",
      invoke: null,
      keywords: ["commit", "PR", "push", "merge", "kanban", "task", "board", "parallel"],
    },

    // ── Sub-Skills ────────────────────────────────────────────────────

    // Shared across multiple macros
    "research": {
      id: "research",
      type: "skill",
      description:
        "Answer questions about how code works, explore unfamiliar codebases, and compare approaches before making decisions. Use when asking 'how does this work', 'what does this do', 'what are my options', or 'I need to understand this before changing it'.",
      invoke: "research",
      keywords: ["how does", "what is", "explain", "understand", "explore", "unfamiliar", "compare", "options", "look into", "figure out"],
    },
    "prompt-engineering": {
      id: "prompt-engineering",
      type: "skill",
      description:
        "Craft effective instructions, tool descriptions, and structured context for AI models. Use when writing system prompts, skill descriptions, or optimizing prompts.",
      invoke: "prompt-engineering",
      keywords: ["prompt", "system prompt", "instructions", "context", "description"],
    },

    // Software Design sub-skills
    "design": {
      id: "design",
      type: "skill",
      description:
        "Plan and design a new feature, capability, or system before writing code. Use when someone says 'let's build', 'I want to add', 'create a new', or 'implement' something that doesn't exist yet. Produces an approved plan before coding starts.",
      invoke: "design",
      keywords: ["build a feature", "add new", "create new", "implement", "let's build", "I want to add", "new capability", "develop"],
    },
    "architecture": {
      id: "architecture",
      type: "skill",
      description:
        "Define how a system is structured — components, data flow, API contracts, and integration points. Use when deciding 'how should this be organized', 'what talks to what', or 'what's the right pattern for this'.",
      invoke: "architecture",
      keywords: ["system structure", "how should this be organized", "API contract", "data flow", "components", "pattern", "integration"],
    },
    "tdd": {
      id: "tdd",
      type: "skill",
      description:
        "Test-driven development — red-green-refactor loop. Writes integration tests first, builds each vertical slice, verifies green.",
      invoke: "tdd",
      keywords: ["test", "TDD", "red green", "test first"],
    },
    "test-planning": {
      id: "test-planning",
      type: "skill",
      description:
        "Plan what to test and how — vertical slices, integration test contracts, mock boundaries.",
      invoke: "test-planning",
      keywords: ["test plan", "test strategy", "what to test", "mock"],
    },
    "build": {
      id: "build",
      type: "skill",
      description:
        "Execute an already-approved design plan by writing code one vertical slice at a time. Use only after the design skill has produced a plan. Not for starting new work — use design first.",
      invoke: "build",
      keywords: ["execute plan", "start coding", "approved plan", "write the code", "implement the design"],
    },
    "ship": {
      id: "ship",
      type: "skill",
      description:
        "Finalize completed work for delivery — review what was built, run final checks, then decide to merge, create a PR, or keep iterating. Use when coding is done and you're ready to wrap up.",
      invoke: "ship",
      keywords: ["ship it", "we're done", "ready to merge", "finalize", "wrap up"],
    },
    "ui-ux-design": {
      id: "ui-ux-design",
      type: "skill",
      description:
        "Modern UI/UX design principles. Visual design decisions, interaction patterns, agentic UX.",
      invoke: "ui-ux-design",
      keywords: ["UI", "UX", "design", "visual", "interaction", "layout", "responsive"],
    },
    "frontend-build": {
      id: "frontend-build",
      type: "skill",
      description:
        "Implement UI designs with visual verification using browser MCP servers for screenshot-based iteration.",
      invoke: "frontend-build",
      keywords: ["frontend", "component", "React", "CSS", "HTML", "UI implementation"],
    },
    "frontend-design": {
      id: "frontend-design",
      type: "skill",
      description:
        "Create distinctive, production-grade frontend interfaces with high design quality.",
      invoke: "frontend-design",
      keywords: ["frontend", "interface", "web app", "page", "component"],
    },

    // Quality sub-skills
    "systematic-debugging": {
      id: "systematic-debugging",
      type: "skill",
      description:
        "Find and fix bugs by investigating the root cause first. Use when something is broken, returning errors, crashing, failing tests, throwing exceptions, or behaving unexpectedly. Never guess at fixes — investigate first.",
      invoke: "systematic-debugging",
      keywords: ["bug", "error", "broken", "not working", "crash", "failing", "exception", "500", "TypeError", "unexpected", "wrong output"],
    },
    "code-review": {
      id: "code-review",
      type: "skill",
      description:
        "Systematic code review — understand the change before judging it. Context first, strategic reading, severity-ranked findings.",
      invoke: "code-review",
      keywords: ["review", "PR", "code quality", "feedback"],
    },
    "receiving-code-review": {
      id: "receiving-code-review",
      type: "skill",
      description:
        "Handling code review feedback with technical rigor — verification before implementing.",
      invoke: "receiving-code-review",
      keywords: ["review feedback", "comments", "requested changes", "address review"],
    },
    "verification": {
      id: "verification",
      type: "skill",
      description:
        "Verify that work is actually complete — run tests, check edge cases, confirm nothing is broken. Use before claiming any task is done. Evidence over assertions.",
      invoke: "verification",
      keywords: ["is it done", "does it work", "run the tests", "check it", "make sure", "confirm working"],
    },

    // Product sub-skills
    "write-spec": {
      id: "write-spec",
      type: "skill",
      description:
        "Write a formal product requirements document that stakeholders and PMs can review. Use when someone says 'write a spec', 'document the requirements', or 'formalize what we're building'.",
      invoke: "write-spec",
      keywords: ["write a spec", "requirements document", "formalize requirements", "PRD", "stakeholder review"],
    },
    "product-definition": {
      id: "product-definition",
      type: "skill",
      description:
        "Define the product before engineering begins — write personas, map user journeys, prioritize a feature backlog, and scope an MVP. Use when a PM needs to define who the users are and what the product should do, not when an engineer is building something.",
      invoke: "product-definition",
      keywords: ["persona", "user journey", "MVP scope", "product manager", "who are the users", "define the product", "prioritize backlog"],
    },
    "technical-breakdown": {
      id: "technical-breakdown",
      type: "skill",
      description:
        "Convert a product spec into a numbered technical implementation plan that engineers review before coding. Use when a spec is approved and needs to become an engineering plan.",
      invoke: "technical-breakdown",
      keywords: ["technical spec", "engineering plan", "convert spec to plan", "technical implementation"],
    },
    "decompose-tasks": {
      id: "decompose-tasks",
      type: "skill",
      description:
        "Break a technical design into discrete, actionable agent tasks.",
      invoke: "decompose-tasks",
      keywords: ["tasks", "break down", "decompose", "action items", "steps"],
    },

    // Business sub-skills
    "opportunity-research": {
      id: "opportunity-research",
      type: "skill",
      description:
        "Evaluate a new opportunity — customer problem, technical capability, or market signal. GO/YELLOW/RED recommendation.",
      invoke: "opportunity-research",
      keywords: ["opportunity", "evaluate", "idea", "worth pursuing"],
    },
    "opportunity-score": {
      id: "opportunity-score",
      type: "skill",
      description:
        "Score opportunities against Desirability/Viability/Feasibility/Adaptability framework.",
      invoke: "opportunity-score",
      keywords: ["score", "prioritize", "rank", "framework"],
    },
    "market-analysis": {
      id: "market-analysis",
      type: "skill",
      description:
        "TAM/SAM/SOM market sizing and competitive landscape analysis.",
      invoke: "market-analysis",
      keywords: ["market size", "TAM", "competition", "competitive"],
    },
    "business-case": {
      id: "business-case",
      type: "skill",
      description:
        "Evidence-based investment case — revenue model, unit economics, GTM strategy, financial projections.",
      invoke: "business-case",
      keywords: ["business case", "revenue", "unit economics", "investment"],
    },
    "customer-discovery": {
      id: "customer-discovery",
      type: "skill",
      description:
        "Synthesize customer research — interview transcripts, surveys, support tickets — using JTBD and empathy mapping.",
      invoke: "customer-discovery",
      keywords: ["customer", "interview", "survey", "JTBD", "empathy"],
    },
    "experiment-design": {
      id: "experiment-design",
      type: "skill",
      description:
        "Design experiments to test riskiest assumptions. Hypotheses and experiment cards with pre-committed success criteria.",
      invoke: "experiment-design",
      keywords: ["experiment", "hypothesis", "test assumption", "validate"],
    },
    "innovation-status": {
      id: "innovation-status",
      type: "skill",
      description:
        "Auto-generate portfolio status reports by scanning existing artifacts.",
      invoke: "innovation-status",
      keywords: ["status", "report", "portfolio", "update"],
    },

    // AI Engineering sub-skills
    "ai-agent-building": {
      id: "ai-agent-building",
      type: "skill",
      description:
        "Building AI agents with Claude — Agent SDK, tool design, orchestration patterns, and eval-driven testing.",
      invoke: "ai-agent-building",
      keywords: ["agent", "Agent SDK", "orchestration", "tool design"],
    },
    "eval-driven-dev": {
      id: "eval-driven-dev",
      type: "skill",
      description:
        "Eval-driven development for AI agents — eval suite design, grader selection, statistical confidence, transcript review.",
      invoke: "eval-driven-dev",
      keywords: ["eval", "evaluation", "grader", "non-deterministic", "agent testing"],
    },
    "tool-discovery": {
      id: "tool-discovery",
      type: "skill",
      description:
        "Scout for tools that expand capabilities — MCP servers, APIs worth wrapping, software worth adopting.",
      invoke: "tool-discovery",
      keywords: ["tool", "MCP server", "API", "integration", "discover"],
    },
    "mcp-builder": {
      id: "mcp-builder",
      type: "skill",
      description:
        "Build an MCP server to wrap an API, local app, or service so Claude Code can use it as a tool. Use when someone says 'create an MCP server', 'wrap this API', or 'make this service available to Claude'.",
      invoke: "mcp-builder",
      keywords: ["build MCP server", "create MCP", "wrap API as MCP", "new MCP server"],
    },

    // Infrastructure sub-skills
    "boilerplate-cicd": {
      id: "boilerplate-cicd",
      type: "skill",
      description:
        "Project scaffolding and CI/CD — golden path templates for TypeScript/Node.js projects.",
      invoke: "boilerplate-cicd",
      keywords: ["scaffold", "template", "CI/CD", "GitHub Actions", "new project", "setup"],
    },
    "cloud-infrastructure": {
      id: "cloud-infrastructure",
      type: "skill",
      description:
        "Design cloud infrastructure architectures on AWS — deployment, hosting, service selection.",
      invoke: "cloud-infrastructure",
      keywords: ["AWS", "cloud", "deploy", "infrastructure", "hosting", "production"],
    },
    "git-worktrees": {
      id: "git-worktrees",
      type: "skill",
      description:
        "Creating isolated workspaces with git worktrees for parallel branches and subagent isolation.",
      invoke: "git-worktrees",
      keywords: ["worktree", "isolated", "parallel branch", "workspace"],
    },

    // Meta sub-skills
    "skill-creator": {
      id: "skill-creator",
      type: "skill",
      description:
        "Create or improve skills following agent-building best practices.",
      invoke: "skill-creator",
      keywords: ["create skill", "new skill", "improve skill", "skill quality"],
    },
    "skill-eval": {
      id: "skill-eval",
      type: "skill",
      description:
        "Test and validate skills — blind A/B comparison, baseline testing, grading against assessment criteria.",
      invoke: "skill-eval",
      keywords: ["test skill", "validate skill", "compare skills", "A/B"],
    },
    "skill-maintenance": {
      id: "skill-maintenance",
      type: "skill",
      description:
        "Evolve skills based on real-world usage — reads LEARNINGS.md logs and applies targeted updates.",
      invoke: "skill-maintenance",
      keywords: ["update skill", "fix skill", "skill learning", "evolve"],
    },
    "orchestrator": {
      id: "orchestrator",
      type: "skill",
      description:
        "Skill routing and workflow guidance. Detailed guidance on skill sequencing, tiers, and red flags.",
      invoke: "orchestrator",
      keywords: ["which skill", "routing", "workflow", "what skill should I use"],
    },

    // Delivery sub-skills
    "commit-and-pr": {
      id: "commit-and-pr",
      type: "skill",
      description:
        "Stage changes, create commits, push, and create pull requests. Surgical staging and meaningful commit messages.",
      invoke: "commit-and-pr",
      keywords: ["commit", "PR", "pull request", "push", "stage", "git"],
    },
    "parallel-agents": {
      id: "parallel-agents",
      type: "skill",
      description:
        "Dispatching multiple agents for independent problems — 2+ tasks without shared state.",
      invoke: "parallel-agents",
      keywords: ["parallel", "concurrent", "multiple agents", "independent tasks"],
    },
    "sp-kanban": {
      id: "sp-kanban",
      type: "skill",
      description:
        "Manage tasks on Super Productivity kanban board — create, organize, and track tasks.",
      invoke: "sp-kanban",
      keywords: ["kanban", "task board", "Super Productivity", "track tasks"],
    },
    "kanban-breakdown": {
      id: "kanban-breakdown",
      type: "skill",
      description:
        "Break down conversation or meeting notes into well-structured kanban cards.",
      invoke: "kanban-breakdown",
      keywords: ["meeting notes", "action items", "cards", "break down tasks"],
    },

    // Visualization & file format skills
    "presentation": {
      id: "presentation",
      type: "skill",
      description:
        "Create browser-rendered scrollable presentations for demos, meetings, and stakeholder updates. Use when someone says 'make a presentation', 'create slides', 'build a deck', or needs to present information visually.",
      invoke: "presentation",
      keywords: ["presentation", "slides", "deck", "demo", "stakeholder update", "meeting slides"],
    },
    "architecture-diagram": {
      id: "architecture-diagram",
      type: "skill",
      description:
        "Generate interactive architecture diagrams rendered in the browser. Use when someone says 'draw a diagram', 'visualize the architecture', 'show how components connect', or needs a visual system overview.",
      invoke: "architecture-diagram",
      keywords: ["diagram", "visualize", "architecture diagram", "system diagram", "show components", "draw"],
    },
    "simplify": {
      id: "simplify",
      type: "skill",
      description:
        "Review changed code for reuse opportunities, quality issues, and efficiency improvements, then fix them. Use when code works but could be cleaner, or after a build phase to polish.",
      invoke: "simplify",
      keywords: ["simplify", "clean up", "refactor", "reduce complexity", "DRY", "polish code"],
    },
    "pdf": {
      id: "pdf",
      type: "skill",
      description:
        "Read, parse, extract data from, or generate PDF files. Use when working with .pdf documents.",
      invoke: "pdf",
      keywords: ["PDF", "pdf file", "read PDF", "parse PDF"],
    },
    "pptx": {
      id: "pptx",
      type: "skill",
      description:
        "Create, read, or edit PowerPoint files (.pptx). Use when working with PowerPoint presentations.",
      invoke: "pptx",
      keywords: ["PowerPoint", "pptx", "slides file", ".pptx"],
    },
    "mermaid": {
      id: "mermaid",
      type: "skill",
      description:
        "Create diagrams using Mermaid syntax — flowcharts, sequence diagrams, ERDs, and more. Use when someone wants a quick diagram in markdown-compatible format.",
      invoke: "mermaid",
      keywords: ["mermaid", "flowchart", "sequence diagram", "ERD", "diagram code"],
    },

    // ── Cross-Cutting Reference Skills ──────────────────────────────
    // These are not matched by user prompts. They are loaded as active
    // guidance when a referencing skill is invoked.

    "coding-standards": {
      id: "coding-standards",
      type: "reference",
      description:
        "Universal coding quality bar — the rubric for all code written or reviewed. Covers correctness, security, readability, and efficiency. Referenced by skills that write or evaluate code, not invoked directly by users.",
      invoke: "coding-standards",
      keywords: [],
    },
    "communication-protocol": {
      id: "communication-protocol",
      type: "reference",
      description:
        "How to present information, ask questions, and pace conversations with users. Covers chunking, progressive disclosure, decision scaling, and fatigue awareness. Referenced by skills that interact with users, not invoked directly.",
      invoke: "communication-protocol",
      keywords: [],
    },

    // File format skills (in delivery macro)
    "docx": {
      id: "docx",
      type: "skill",
      description: "Create, read, edit, or manipulate Word documents (.docx files).",
      invoke: "docx",
      keywords: ["Word", "docx", "document", "Word doc"],
    },
    "xlsx": {
      id: "xlsx",
      type: "skill",
      description: "Work with spreadsheet files — .xlsx, .xlsm, .csv, .tsv.",
      invoke: "xlsx",
      keywords: ["spreadsheet", "Excel", "xlsx", "csv"],
    },
  },

  edges: [
    // ── software-design contains ──
    { from: "software-design", to: "design", rel: "contains" },
    { from: "software-design", to: "architecture", rel: "contains" },
    { from: "software-design", to: "tdd", rel: "contains" },
    { from: "software-design", to: "test-planning", rel: "contains" },
    { from: "software-design", to: "build", rel: "contains" },
    { from: "software-design", to: "ship", rel: "contains" },
    { from: "software-design", to: "ui-ux-design", rel: "contains" },
    { from: "software-design", to: "frontend-build", rel: "contains" },
    { from: "software-design", to: "frontend-design", rel: "contains" },
    { from: "software-design", to: "research", rel: "contains" },
    { from: "software-design", to: "parallel-agents", rel: "contains" },

    // ── quality contains ──
    { from: "quality", to: "systematic-debugging", rel: "contains" },
    { from: "quality", to: "code-review", rel: "contains" },
    { from: "quality", to: "receiving-code-review", rel: "contains" },
    { from: "quality", to: "verification", rel: "contains" },
    { from: "quality", to: "research", rel: "contains" },

    // ── product contains ──
    { from: "product", to: "write-spec", rel: "contains" },
    { from: "product", to: "product-definition", rel: "contains" },
    { from: "product", to: "technical-breakdown", rel: "contains" },
    { from: "product", to: "decompose-tasks", rel: "contains" },
    { from: "product", to: "research", rel: "contains" },

    // ── business contains ──
    { from: "business", to: "opportunity-research", rel: "contains" },
    { from: "business", to: "opportunity-score", rel: "contains" },
    { from: "business", to: "market-analysis", rel: "contains" },
    { from: "business", to: "business-case", rel: "contains" },
    { from: "business", to: "customer-discovery", rel: "contains" },
    { from: "business", to: "experiment-design", rel: "contains" },
    { from: "business", to: "innovation-status", rel: "contains" },
    { from: "business", to: "research", rel: "contains" },

    // ── ai-engineering contains ──
    { from: "ai-engineering", to: "ai-agent-building", rel: "contains" },
    { from: "ai-engineering", to: "eval-driven-dev", rel: "contains" },
    { from: "ai-engineering", to: "prompt-engineering", rel: "contains" },
    { from: "ai-engineering", to: "tool-discovery", rel: "contains" },
    { from: "ai-engineering", to: "mcp-builder", rel: "contains" },
    { from: "ai-engineering", to: "research", rel: "contains" },

    // ── infrastructure contains ──
    { from: "infrastructure", to: "boilerplate-cicd", rel: "contains" },
    { from: "infrastructure", to: "cloud-infrastructure", rel: "contains" },
    { from: "infrastructure", to: "git-worktrees", rel: "contains" },
    { from: "infrastructure", to: "research", rel: "contains" },

    // ── meta contains ──
    { from: "meta", to: "skill-creator", rel: "contains" },
    { from: "meta", to: "skill-eval", rel: "contains" },
    { from: "meta", to: "skill-maintenance", rel: "contains" },
    { from: "meta", to: "orchestrator", rel: "contains" },
    { from: "meta", to: "research", rel: "contains" },
    { from: "meta", to: "prompt-engineering", rel: "contains" },

    // ── delivery contains ──
    { from: "delivery", to: "commit-and-pr", rel: "contains" },
    { from: "delivery", to: "parallel-agents", rel: "contains" },
    { from: "delivery", to: "sp-kanban", rel: "contains" },
    { from: "delivery", to: "kanban-breakdown", rel: "contains" },
    { from: "delivery", to: "docx", rel: "contains" },
    { from: "delivery", to: "xlsx", rel: "contains" },
    { from: "delivery", to: "pdf", rel: "contains" },
    { from: "delivery", to: "pptx", rel: "contains" },
    { from: "delivery", to: "mermaid", rel: "contains" },
    { from: "delivery", to: "presentation", rel: "contains" },
    { from: "delivery", to: "architecture-diagram", rel: "contains" },

    // simplify belongs in software-design (post-build polish)
    { from: "software-design", to: "simplify", rel: "contains" },
    { from: "build", to: "simplify", rel: "precedes" },

    // ── Ordering: precedes ──
    { from: "design", to: "build", rel: "precedes" },
    { from: "build", to: "ship", rel: "precedes" },
    { from: "ship", to: "commit-and-pr", rel: "precedes" },
    { from: "write-spec", to: "technical-breakdown", rel: "precedes" },
    { from: "technical-breakdown", to: "decompose-tasks", rel: "precedes" },
    { from: "test-planning", to: "tdd", rel: "precedes" },
    { from: "opportunity-research", to: "opportunity-score", rel: "precedes" },
    { from: "opportunity-research", to: "market-analysis", rel: "precedes" },
    { from: "market-analysis", to: "business-case", rel: "precedes" },
    { from: "research", to: "skill-creator", rel: "precedes" },
    { from: "research", to: "design", rel: "precedes" },

    // ── Requirements: requires ──
    { from: "systematic-debugging", to: "verification", rel: "requires" },
    { from: "build", to: "verification", rel: "requires" },
    { from: "code-review", to: "verification", rel: "requires" },

    // ── Cross-cutting: references ──
    // coding-standards: any skill that writes or evaluates code
    { from: "build", to: "coding-standards", rel: "references" },
    { from: "tdd", to: "coding-standards", rel: "references" },
    { from: "code-review", to: "coding-standards", rel: "references" },
    { from: "systematic-debugging", to: "coding-standards", rel: "references" },
    { from: "frontend-build", to: "coding-standards", rel: "references" },
    { from: "frontend-design", to: "coding-standards", rel: "references" },
    { from: "mcp-builder", to: "coding-standards", rel: "references" },
    { from: "receiving-code-review", to: "coding-standards", rel: "references" },
    { from: "simplify", to: "coding-standards", rel: "references" },

    // parallel-agents & ai-agent-building: build uses subagents for parallel execution
    { from: "build", to: "parallel-agents", rel: "references" },
    { from: "build", to: "ai-agent-building", rel: "references" },

    // communication-protocol: any skill that interacts with the user
    { from: "design", to: "communication-protocol", rel: "references" },
    { from: "research", to: "communication-protocol", rel: "references" },
    { from: "systematic-debugging", to: "communication-protocol", rel: "references" },
    { from: "architecture", to: "communication-protocol", rel: "references" },
    { from: "product-definition", to: "communication-protocol", rel: "references" },
    { from: "write-spec", to: "communication-protocol", rel: "references" },
    { from: "opportunity-research", to: "communication-protocol", rel: "references" },
    { from: "customer-discovery", to: "communication-protocol", rel: "references" },
  ],
};
