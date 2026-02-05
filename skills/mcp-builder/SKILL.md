---
name: mcp-builder
description: Create, configure, and debug MCP (Model Context Protocol) servers. Use when setting up new MCP integrations.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
---

# MCP Builder

Create and configure Model Context Protocol servers for AI assistant integrations.

## MCP Basics

MCP servers extend AI assistants with external capabilities:
- **Tools**: Functions the AI can call
- **Resources**: Data the AI can read
- **Prompts**: Reusable prompt templates

## Adding MCP Servers

### HTTP Servers (Recommended)
```bash
claude mcp add --transport http myserver https://api.example.com/mcp
```

### Stdio Servers (Local)
```bash
claude mcp add --transport stdio myserver -- npx my-mcp-server
```

### With Environment Variables
```bash
claude mcp add --transport http myserver https://api.example.com/mcp \
  --header "Authorization: Bearer ${API_KEY}"
```

## Project Configuration

Create `.mcp.json` in project root for shared team config:

```json
{
  "mcpServers": {
    "shadcn": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@anthropic-ai/shadcn-mcp-server"]
    },
    "company-api": {
      "type": "http",
      "url": "${API_URL}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  }
}
```

## Common MCP Servers

### shadcn/ui
```bash
# Official shadcn MCP
npx shadcn@latest mcp
```

### Atlassian (Jira + Confluence)
```bash
claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp
```

### Google Workspace
```bash
npx google-workspace-mcp
```

### GitHub
```bash
claude mcp add --transport http github https://api.github.com/mcp
```

## Creating Custom MCP Server

### TypeScript Template

```typescript
import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";

const server = new Server({
  name: "my-mcp-server",
  version: "1.0.0",
});

// Define tools
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "my_tool",
      description: "Does something useful",
      inputSchema: {
        type: "object",
        properties: {
          param: { type: "string", description: "Parameter" }
        },
        required: ["param"]
      }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "my_tool") {
    const { param } = request.params.arguments;
    return { content: [{ type: "text", text: `Result: ${param}` }] };
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Debugging

```bash
# Check MCP status
claude mcp list

# Test specific server
claude mcp get myserver

# Debug in Claude Code
/mcp
```

## Guidelines

- Use HTTP transport for cloud services
- Use stdio for local tools
- Store credentials in environment variables
- Use project scope (`.mcp.json`) for team sharing
- Test tools manually before relying on them
