---
name: skill-creator
description: Create new skills following the Anthropic Agent Skills specification. Use when you need to create a reusable skill.
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
---

# Skill Creator

Create new skills following the [Anthropic Agent Skills](https://github.com/anthropics/skills) specification.

## Skill Structure

```
skills/
└── my-skill/
    ├── SKILL.md        # Required: Main skill definition
    ├── examples/       # Optional: Example files
    └── resources/      # Optional: Supporting resources
```

## SKILL.md Format

```yaml
---
name: my-skill-name              # Required: lowercase with hyphens
description: When to use this    # Required: Clear description
allowed-tools:                   # Optional: Restrict tool access
  - Read
  - Write
  - Bash
disallowed-tools:                # Optional: Block specific tools
  - Edit
model: sonnet                    # Optional: haiku, sonnet, opus, inherit
context: fork                    # Optional: Run in isolated subagent
disable-model-invocation: true   # Optional: Manual-only invocation
user-invocable: false            # Optional: Hide from menu
argument-hint: "[issue-number]"  # Optional: Help text for args
---

# Skill Title

Instructions for Claude when this skill is active.

## When to Use
- Scenario 1
- Scenario 2

## How to Use
Step-by-step instructions.

## Examples
Concrete examples of usage.

## Guidelines
Best practices and constraints.
```

## Frontmatter Reference

| Field | Type | Purpose |
|-------|------|---------|
| `name` | string | Unique identifier (required) |
| `description` | string | When Claude should use it (required) |
| `allowed-tools` | list | Whitelist of tools |
| `disallowed-tools` | list | Blacklist of tools |
| `model` | enum | haiku, sonnet, opus, inherit |
| `context` | enum | fork (isolated), default (shared) |
| `agent` | string | Subagent type (Explore, Plan, etc.) |
| `disable-model-invocation` | bool | Require manual `/skill` |
| `user-invocable` | bool | Show in menu |
| `argument-hint` | string | Help text for arguments |
| `hooks` | object | Lifecycle hooks |

## Dynamic Content

### Shell Command Injection
```markdown
Current branch: !`git branch --show-current`
Recent commits: !`git log --oneline -5`
```

### Arguments
```markdown
Process issue $ARGUMENTS
# Or positional: $0, $1, $2
```

## Installation Locations

| Scope | Location | Visibility |
|-------|----------|------------|
| User | `~/.claude/skills/my-skill/` | All your projects |
| Project | `.claude/skills/my-skill/` | This project only |
| Plugin | Via plugin distribution | Anyone who installs |

## Creating a New Skill

1. **Identify the need**: What task is repeated?
2. **Define scope**: What tools are needed?
3. **Write instructions**: Be specific and actionable
4. **Add examples**: Show concrete usage
5. **Test**: Use `/my-skill` and iterate

## Example: API Documentation Skill

```yaml
---
name: api-docs
description: Generate API documentation from code. Use when documenting endpoints.
allowed-tools:
  - Read
  - Glob
  - Grep
  - Write
---

# API Documentation Generator

Generate OpenAPI-style documentation from code.

## Process
1. Find all route handlers
2. Extract request/response types
3. Generate markdown documentation

## Output Format
- Endpoint path and method
- Request parameters and body
- Response schema
- Example requests/responses
```

## Guidelines

- Keep skills focused on one task
- Use `allowed-tools` to limit scope
- Provide concrete examples
- Test before sharing
- Version control your skills
