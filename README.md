# AI Workflow Config

Personal AI coding assistant configuration - skills, agents, MCP servers, plugins, and IDE-agnostic instructions.

## Quick Start

```bash
# 1. Clone this repo
git clone https://github.com/brandonperez-wex/ai-workflow-config.git ~/ai-workflow-config

# 2. Install MCP servers
./scripts/install-mcps.sh

# 3. Setup Claude Code (symlinks skills, installs plugins)
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
│   ├── code-review/        # Code review workflow
│   ├── commit-and-pr/      # Git commit and PR creation
│   ├── docx/               # Word document manipulation
│   ├── frontend-design/    # React/TypeScript UI with Tailwind
│   ├── mcp-builder/        # MCP server creation
│   ├── pdf/                # PDF operations
│   ├── pptx/               # PowerPoint presentations
│   ├── skill-creator/      # Meta-skill for creating skills
│   └── xlsx/               # Excel spreadsheets
│
├── agents/                 # Subagent definitions
│   ├── code-reviewer.md
│   ├── researcher.md
│   └── test-runner.md
│
├── plugins/                # Claude Code plugin configuration
│   ├── plugins.json        # Plugins to install from marketplaces
│   └── settings.template.json  # Settings with enabled plugins
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
| `docx` | Create, read, edit Word documents (.docx) |
| `frontend-design` | React/TypeScript UI development with Tailwind |
| `mcp-builder` | Create and configure MCP servers |
| `pdf` | Read, merge, split, watermark, OCR PDF files |
| `pptx` | Create and edit PowerPoint presentations |
| `skill-creator` | Meta-skill for creating new skills |
| `xlsx` | Create and edit Excel spreadsheets |

## Plugins

Marketplace plugins installed by `setup-claude.sh`:

| Plugin | Marketplace | Description |
|--------|-------------|-------------|
| `frontend-design` | claude-plugins-official | Production-ready React UI components |
| `context7` | claude-plugins-official | Library documentation lookup |
| `github` | claude-plugins-official | GitHub MCP integration |
| `atlassian` | claude-plugins-official | Jira + Confluence skills |
| `superpowers` | claude-plugins-official | TDD, debugging, code review, planning |
| `superpowers-lab` | superpowers-marketplace | Slack, tmux, MCP CLI, duplicate finder |

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
5. **Context7** - Library documentation
6. **Sequential Thinking** - Enhanced reasoning

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

## Portability

To set up on a new machine:

```bash
# Clone your config
git clone https://github.com/brandonperez-wex/ai-workflow-config.git ~/ai-workflow-config

# Run setup (installs everything)
cd ~/ai-workflow-config
./scripts/setup-claude.sh
./scripts/install-mcps.sh
```

This will:
- Symlink all skills to `~/.claude/skills/`
- Symlink all agents to `~/.claude/agents/`
- Install marketplace plugins (requires `jq`)
- Apply settings template if no settings exist

## License

MIT
