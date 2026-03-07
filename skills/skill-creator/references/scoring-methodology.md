# Skill Scoring Methodology

Two-phase scoring eliminates false negatives by separating objective detection from subjective evaluation.

## Phase 1: Structural Fact Sheet (Automated)

Before any subjective scoring, generate an objective fact sheet for the skill. These markers can be detected by scanning the file — no judgment needed.

### Markers to detect

| Category | What to scan | How to detect |
|---|---|---|
| **Frontmatter** | `allowed-tools` list | YAML between `---` markers |
| **Frontmatter** | `Skill` in allowed-tools | `- Skill` in the YAML block |
| **Frontmatter** | Other tools listed | Each `- ToolName` entry |
| **Hard gates** | `<HARD-GATE>` tags | Literal tag scan |
| **Anti-patterns** | Anti-patterns section/table | `## Anti-Patterns` or `Anti-Pattern` in table headers |
| **Delegation** | Explicit skill invocations | Patterns: `invoke **name**`, `Invoke **name**`, `delegates to **name**` |
| **Which skills** | Named skills referenced | Extract skill names from bold markers after invoke/delegate |
| **Central thesis** | Opening sentence after `# Title` | First non-empty line after the H1 heading |
| **Guidelines** | `## Guidelines` section | Heading scan |
| **When to Use** | `## When to Use` section | Heading scan |
| **Decision tables** | Tables with conditional routing | Pipe-delimited rows with When/If/Scenario columns |
| **References** | `references/` directory | Directory existence + file count |
| **Line count** | Total lines in SKILL.md | `wc -l` |
| **Sections** | All H2/H3 headings | Heading scan |

### Fact sheet format

```
SKILL: <name>
LINES: <count>

FRONTMATTER:
  allowed-tools: [Bash, Read, Glob, Grep, Skill]
  other-fields: ...

STRUCTURAL MARKERS:
  hard-gates: <count> — "<text of each gate>"
  anti-patterns: <yes/no> — <count of anti-patterns listed>
  guidelines: <yes/no> — <count of guideline bullets>
  when-to-use: <yes/no>
  decision-tables: <count>
  references-dir: <count of files>

DELEGATION:
  has-Skill-tool: <yes/no>
  explicit-invocations:
    - invoke **verification** (line N)
    - invoke **commit-and-pr** (line N)
    - delegates to **architecture** (line N)

CENTRAL THESIS:
  opening-line: "<first sentence after H1>"

SECTIONS:
  - ## When to Use
  - ## Process
  - ## Anti-Patterns
  - ## Guidelines
```

## Phase 2: Subjective Quality Evaluation (LLM)

Score each of the 7 dimensions using the rubric from skill-creator. The scorer receives:
1. The full SKILL.md content
2. The Phase 1 fact sheet (so structural markers can't be missed)

### Scoring rules

For each dimension, the scorer MUST:

1. **Quote the specific evidence** — cite the line or section that supports the score
2. **Reference the fact sheet** — if the fact sheet says `hard-gates: 2` and the scorer gives failure-prevention = 0, that's a contradiction that must be explained
3. **Explain the gap** — if scoring below 2, state what's missing to reach 2

### Dimension-specific anchors

These prevent drift in scoring standards.

#### Additive value (0-2)
- **0**: The skill is a reformatted version of something Claude already knows (e.g., generic git commands, standard library API)
- **1**: Adds team conventions, specific decision frameworks, or domain context Claude doesn't have
- **2**: Teaches a methodology — a way of thinking about a class of problems that Claude doesn't do by default

#### Central thesis (0-2)
- **0**: No opening principle. The skill jumps straight into steps or sections
- **1**: Has a thesis but it's buried mid-document, or it's generic ("do good work")
- **2**: Clear, opinionated thesis in the first line after the H1. Everything in the skill flows from it. Quote the thesis.

#### Failure prevention (0-2)
- **0**: No `<HARD-GATE>` tags AND no anti-patterns section AND no bias guards
- **1**: Has EITHER a hard gate OR anti-patterns, but not both. Or has them but they're generic
- **2**: Has `<HARD-GATE>` tags + anti-patterns table + bias guards or red flags specific to this domain
- **IMPORTANT**: If the fact sheet shows `hard-gates: >= 1`, the minimum score is 1. A score of 0 requires justifying why the detected hard gate doesn't count.

#### Decision support (0-2)
- **0**: Linear "do these steps" with no branching or conditional logic
- **1**: Some conditional paths (if X then Y), sizing tables, or method selection
- **2**: Full decision/routing table that matches situations to approaches, with clear criteria

#### Structure (0-2)
- **0**: Wall of text, no phases, no entry/exit criteria
- **1**: Organized sections but linear flow, no checkpoints
- **2**: Phased process with entry/exit criteria per phase, checkpoints for human validation

#### Tool design (0-2)
- **0**: No allowed-tools in frontmatter AND no delegation to other skills AND no MCP/script usage
- **1**: Has allowed-tools appropriate to the task OR delegates to other skills
- **2**: Tools actively researched and well-matched. Uses `Skill` tool for delegation, MCP servers, scripts, or custom tools where appropriate
- **IMPORTANT**: If the fact sheet shows `has-Skill-tool: yes` AND `explicit-invocations` lists delegations, the minimum score is 1. A score of 0 requires justifying why the detected delegation doesn't count.

#### Context efficiency (0-2)
- **0**: 500+ lines of generic advice that Claude already knows, or massive code snippets for standard operations
- **1**: Right-sized but some filler — sections that could be trimmed without losing value
- **2**: Every paragraph justifies its token cost. Reference material is in `references/` not inline. Under 300 lines for methodology skills, under 200 for utility skills.

### Output format

```
SKILL: <name>

SCORES:
  additive-value:     X/2 — "<evidence quote>" [gap if < 2]
  central-thesis:     X/2 — "<evidence quote>" [gap if < 2]
  failure-prevention: X/2 — "<evidence quote>" [gap if < 2]
  decision-support:   X/2 — "<evidence quote>" [gap if < 2]
  structure:          X/2 — "<evidence quote>" [gap if < 2]
  tool-design:        X/2 — "<evidence quote>" [gap if < 2]
  context-efficiency: X/2 — "<evidence quote>" [gap if < 2]

TOTAL: XX/14

FACT SHEET CONFLICTS: [any cases where the score contradicts the fact sheet — must be explained]

TOP IMPROVEMENTS:
1. [Most impactful improvement to raise the score]
2. [Second most impactful]
```

## Scoring at scale

When scoring multiple skills:
1. Generate fact sheets for all skills first (batch)
2. Score skills in small batches (5-8) to maintain calibration
3. After each batch, check for scoring drift by comparing similar skills
4. Flag any score that contradicts the fact sheet

## Known bias patterns

| Bias | How it manifests | Countermeasure |
|---|---|---|
| **Missed structural markers** | Scoring 0 on failure-prevention when `<HARD-GATE>` exists | Fact sheet makes markers impossible to miss |
| **Missed delegation** | Scoring 0 on tool-design when `Skill` is in allowed-tools | Fact sheet explicitly lists delegation targets |
| **Inflation** | Scoring 2 on everything because "it seems good" | Require quoted evidence for every score |
| **Context recency** | Last skill scored gets harsher treatment | Score in small batches, calibrate between batches |
| **Halo effect** | Well-written prose gets high structure score | Check structural elements independently of prose quality |
