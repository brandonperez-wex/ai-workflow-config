# AI Workflow Config

Personal AI coding assistant configuration - skills, agents, MCP servers, and IDE-agnostic instructions.

## Quick Start

```bash
# 1. Clone this repo
git clone https://github.com/brandonperez-wex/ai-workflow-config.git ~/ai-workflow-config

# 2. Install MCP servers
./scripts/install-mcps.sh

# 3. Symlink skills and agents to Claude Code
./scripts/setup-claude.sh

# 4. Sync instructions to a project
./scripts/sync-to-project.sh /path/to/your/project react-agent
```

## Structure

```
ai-workflow-config/
├── instructions/           # IDE-agnostic canonical instructions
│   ├── base.md             # Core instructions for all projects
│   ├── coding-standards.md # Shared coding standards
│   └── project-types/      # Project-specific additions
│       └── react-agent.md
│
├── skills/                 # Reusable skills (Claude, Gemini conductor)
│   ├── code-review/
│   ├── commit-and-pr/
│   ├── frontend-design/
│   ├── mcp-builder/
│   └── skill-creator/
│
├── agents/                 # Subagent definitions
│   ├── code-reviewer.md
│   ├── researcher.md
│   └── test-runner.md
│
├── ide-adapters/           # IDE-specific transforms
│   ├── claude/
│   ├── cursor/
│   ├── gemini/
│   └── codex/
│
├── mcp/                    # MCP server configurations
│   ├── servers.json
│   └── setup-guides/
│
├── hooks/                  # Reusable hook scripts
│
└── scripts/                # Setup and sync scripts
    ├── install-mcps.sh
    ├── setup-claude.sh
    └── sync-to-project.sh
```

## Skills

Skills follow the [Anthropic Agent Skills](https://github.com/anthropics/skills) specification:

| Skill | Description |
|-------|-------------|
| `code-review` | Thorough code review with security and performance focus |
| `commit-and-pr` | Git workflow: stage, commit, push, create PR |
| `frontend-design` | React/TypeScript UI development with Tailwind |
| `mcp-builder` | Create and configure MCP servers |
| `skill-creator` | Meta-skill for creating new skills |

## Agents

Subagents for specialized tasks with persistent memory:

| Agent | Description | Memory |
|-------|-------------|--------|
| `code-reviewer` | Reviews code changes, tracks patterns | project |
| `researcher` | Deep codebase exploration | user |
| `test-runner` | Runs tests, analyzes failures | project |

## MCP Servers

Priority order for installation:

1. **shadcn/ui** - Component library integration
2. **Atlassian** - Jira + Confluence
3. **Google Workspace** - Gmail, Drive, Docs, Sheets
4. **GitHub** - Enhanced repo operations

## IDE Support

| IDE | Config Location | Sync Command |
|-----|-----------------|--------------|
| Claude Code | `.claude/CLAUDE.md` | `sync-to-project.sh path claude` |
| Cursor | `.cursorrules` | `sync-to-project.sh path cursor` |
| Gemini CLI | `GEMINI.md` + `conductor/` | `sync-to-project.sh path gemini` |
| Codex | `AGENTS.md` | `sync-to-project.sh path codex` |

## Git Worktrees for Parallel Work

Use git worktrees to run multiple Claude Code sessions in parallel:

```bash
# Create worktrees for parallel tasks
git worktree add ../project-feature-a -b feature-a
git worktree add ../project-feature-b -b feature-b

# Each worktree gets its own Claude session
cd ../project-feature-a && claude
cd ../project-feature-b && claude

# Merge when done
git worktree remove ../project-feature-a
```

## License

MIT
