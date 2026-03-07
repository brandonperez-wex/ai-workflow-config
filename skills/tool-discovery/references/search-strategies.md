# Search Strategies Reference

Concrete commands, URLs, and patterns for finding tools. Read this during the search phase.

## MCP Server Registries

Search these in order of reliability:

| Registry | URL | Notes |
|----------|-----|-------|
| **Official MCP Registry** | https://registry.modelcontextprotocol.io/ | Authoritative, REST API available |
| **PulseMCP** | https://www.pulsemcp.com/servers | 8,600+ servers, daily updates, largest collection |
| **FastMCP** | https://fastmcp.me/ | Ranked by real usage (views + installs) |
| **Glama** | https://glama.ai/mcp/servers | 76 categories, security scoring |
| **Smithery AI** | https://smithery.ai/ | Hub + hosting, 500+ servers |
| **MCP.so** | https://mcp.so | 18,000+ listed, less curated |
| **MCPServers.org** | https://mcpservers.org/ | Category browsing |
| **MCP-Awesome.com** | https://mcp-awesome.com/ | Quality-verified, tutorials included |

**Search strategy:** Start with PulseMCP (largest) and Glama (best categorized). Use the Official Registry for authoritative/verified servers.

### Official Registry API (programmatic search)

The Official MCP Registry has a REST API you can query directly:

```bash
# Search by keyword
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=<keyword>&limit=20"

# Get a specific server
curl "https://registry.modelcontextprotocol.io/v0.1/servers/com.example/my-server"

# Filter by recent updates
curl "https://registry.modelcontextprotocol.io/v0.1/servers?updated_since=2025-10-01T00:00:00Z&limit=50"
```

Parameters: `search` (substring, case-insensitive), `limit` (default 10), `cursor` (pagination), `updated_since` (RFC3339 timestamp), `version` (only "latest" supported).

API docs: https://registry.modelcontextprotocol.io/docs

## npm Search Commands

```bash
# Domain-specific search
npm search "mcp <domain>"          # e.g., npm search "mcp postgres"
npm search "mcp-server <domain>"   # e.g., npm search "mcp-server slack"

# Browse by common naming patterns
npm search "@modelcontextprotocol"  # Official packages
npm search "mcp-server-"            # Generic pattern: mcp-server-postgres, mcp-server-redis
npm search "-mcp"                   # Service-specific: slack-mcp, github-mcp
```

### Common npm Package Naming Patterns
- `mcp-server-<service>` — generic convention
- `<service>-mcp` — service-first naming
- `@scope/mcp-<service>` — scoped packages
- `@modelcontextprotocol/<name>` — official packages
- `@anthropic-ai/<name>-mcp-server` — Anthropic-published

## GitHub Search

### Topic Pages
- https://github.com/topics/mcp-server
- https://github.com/topics/mcp-servers
- https://github.com/topics/mcp-integration
- https://github.com/topics/model-context-protocol

### Search Queries
```
# In GitHub search:
"mcp server" <domain>              # e.g., "mcp server" postgres
"mcp" language:TypeScript <domain>  # TypeScript MCP servers (most common)
"mcp" language:Python <domain>      # Python MCP servers
```

### Curated Lists
- https://github.com/modelcontextprotocol/servers — Official reference implementations
- https://github.com/punkpeye/awesome-mcp-servers — Large curated list
- https://github.com/wong2/awesome-mcp-servers — General curated
- https://github.com/appcypher/awesome-mcp-servers — Production + experimental
- https://github.com/collabnix/awesome-mcp-lists — Servers, clients, and toolkits

## Claude Code Plugin Marketplace

Check what's available as official plugins:
```bash
# View installed/available plugins
cat ~/.claude/settings.json | grep -A 20 enabledPlugins
```

Known official plugins: context7, github, atlassian, playwright, frontend-design, slack, firebase, linear, stripe, supabase, asana, gitlab, greptile, serena, laravel-boost

## API Directory Search

For Layer 2 (APIs worth wrapping):

**Web searches:**
- "best `<domain>` tools with REST API"
- "`<service>` API documentation"
- "`<domain>` developer API"
- "open source `<domain>` with API"

**API directories:**
- RapidAPI (https://rapidapi.com/) — large API marketplace
- APIs.guru (https://apis.guru/) — curated API directory
- Public APIs list (https://github.com/public-apis/public-apis) — categorized free APIs

## Software Discovery (Layer 3)

For finding software worth adopting for its API:

**Web searches:**
- "self-hosted `<domain>` with REST API"
- "open source `<domain>` alternative API"
- "`<domain>` software local API"
- "headless `<domain>` tool"
- "programmable `<domain>` tool"

**Directories:**
- awesome-selfhosted (https://github.com/awesome-selfhosted/awesome-selfhosted) — self-hosted software by category
- AlternativeTo (https://alternativeto.net/) — find alternatives to known tools, filter by open source
- Product Hunt — browse by category for newer tools

**What to look for in software:**
- "API" or "REST" mentioned in the README or docs
- A `/api` or `/docs/api` section on the website
- "headless" mode or CLI interface (often means API-first)
- Docker support (suggests self-hosted, likely has API)
- Integration/webhook support (means there's a programmable interface)

## Checking What's Already Installed

Before recommending anything:

```bash
# Claude Code MCP servers
claude mcp list

# Global MCP config
cat ~/.mcp.json 2>/dev/null

# Project MCP config
cat .mcp.json 2>/dev/null

# Claude plugins
cat ~/.claude/settings.json 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin); [print(f'  {k}: {\"enabled\" if v else \"disabled\"}') for k,v in d.get('enabledPlugins',{}).items()]"
```
