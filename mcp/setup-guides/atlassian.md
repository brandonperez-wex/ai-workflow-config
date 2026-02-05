# Atlassian MCP Setup (Jira + Confluence)

## Prerequisites

- Atlassian Cloud account
- API token from https://id.atlassian.com/manage-profile/security/api-tokens

## Option 1: Official Atlassian Rovo MCP (Recommended)

The official MCP uses OAuth 2.1 and is fully managed by Atlassian.

### Setup

1. Visit https://www.atlassian.com/platform/remote-mcp-server
2. Follow the OAuth flow to authorize
3. Add to Claude Code:

```bash
claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp
```

### Capabilities

- Search Jira issues
- Create/update issues
- Search Confluence pages
- Create/update pages
- Summarize content

## Option 2: Open-Source mcp-atlassian

For self-hosted or custom setups.

### Installation

```bash
pip install mcp-atlassian
```

### Environment Variables

```bash
export ATLASSIAN_URL="https://your-domain.atlassian.net"
export ATLASSIAN_USERNAME="your-email@company.com"
export ATLASSIAN_API_TOKEN="your-api-token"
```

### Add to Claude Code

```bash
claude mcp add --transport stdio atlassian -- python -m mcp_atlassian
```

### Or add to .mcp.json

```json
{
  "mcpServers": {
    "atlassian": {
      "type": "stdio",
      "command": "python",
      "args": ["-m", "mcp_atlassian"],
      "env": {
        "ATLASSIAN_URL": "${ATLASSIAN_URL}",
        "ATLASSIAN_USERNAME": "${ATLASSIAN_USERNAME}",
        "ATLASSIAN_API_TOKEN": "${ATLASSIAN_API_TOKEN}"
      }
    }
  }
}
```

## Usage Examples

Once configured, you can:

```
Search for all bugs assigned to me in PROJECT
Create a task: "Update documentation for API v2"
Find the onboarding guide in Confluence
Summarize the sprint retrospective page
```

## Troubleshooting

### "Permission denied" errors

- Verify your API token is valid
- Check you have access to the project/space
- Ensure the token has the required scopes

### Connection issues

- Verify ATLASSIAN_URL is correct (include https://)
- Check firewall/VPN settings
- Try the API directly: `curl -u email:token https://your-domain.atlassian.net/rest/api/3/myself`
