# MCP Builder Patterns Reference

Code templates and patterns for building MCP servers. Referenced by the main skill when implementation begins.

## Standard File Structure

### Production Agent MCP

```
src/
├── types/
│   ├── provider.ts              # Single provider interface
│   └── common.ts                # Result<T>, AppError
├── providers/
│   ├── index.ts                 # createProvider() factory
│   ├── mock/
│   │   ├── adapter.ts           # MockAdapter implements Provider
│   │   └── data/                # Fixture data (trades-specific)
│   └── [service-name]/
│       ├── adapter.ts           # LiveAdapter implements Provider
│       ├── client.ts            # API client wrapper
│       └── mapper.ts            # Response mapping
├── tools/                       # Tool handlers — delegate to provider
├── lib/
│   ├── config.ts                # loadConfig() — reads MODE, validates creds
│   └── errors.ts                # succeed(), fail(), toMcpError()
├── server.ts                    # createMcpServer(provider) — registers tools
├── stdio.ts                     # Stdio entry point
└── http.ts                      # HTTP entry point (Hono, multi-tenant)
```

### Local Utility MCP

```
src/
├── index.ts                     # Entry point (stdio)
├── server.ts                    # createMcpServer() — registers tools
├── tools/                       # Tool handlers (can call APIs directly)
├── lib/
│   ├── config.ts                # loadConfig() — env vars, paths
│   └── client.ts                # API/IPC client (if wrapping a service)
└── types/                       # Shared types
```

## Result Type

```typescript
// src/types/common.ts
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: AppError };

export interface AppError {
  code: string;
  message: string;
  cause?: unknown;
}
```

```typescript
// src/lib/errors.ts
export function succeed<T>(data: T): Result<T> {
  return { success: true, data };
}

export function fail<T>(code: string, message: string, cause?: unknown): Result<T> {
  return { success: false, error: { code, message, cause } };
}

export function toMcpError(error: AppError) {
  return {
    isError: true as const,
    content: [{ type: 'text' as const, text: `[${error.code}] ${error.message}` }],
  };
}
```

## Provider Interface

```typescript
// src/types/provider.ts
export interface MyServiceProvider {
  readonly name: string;  // 'mock' | 'live'

  listItems(options?: ListOptions): Promise<Result<Item[]>>;
  getItem(id: string): Promise<Result<Item>>;
  createItem(input: CreateInput): Promise<Result<Item>>;
}
```

- One interface, all methods the agent needs
- Every method returns `Promise<Result<T>>`
- `readonly name` identifies which adapter is active

## Factory

```typescript
// src/providers/index.ts
export function createProvider(config: Config): MyServiceProvider {
  switch (config.mode) {
    case 'mock':
      return new MockAdapter();
    case 'live':
      if (!config.credentials) {
        throw new Error('Live mode requires credentials (set env vars)');
      }
      return new LiveAdapter(createApiClient(config.credentials));
  }
}
```

## Config

```typescript
// src/lib/config.ts
export function loadConfig(): Config {
  const mode = process.env['MODE'];
  if (mode !== 'mock' && mode !== 'live') {
    throw new Error('MODE environment variable must be set to "mock" or "live"');
  }
  return {
    mode,
    port: parseInt(process.env['PORT'] ?? '3000', 10),
    credentials: mode === 'live' ? {
      clientId: requireEnv('CLIENT_ID'),
      clientSecret: requireEnv('CLIENT_SECRET'),
    } : undefined,
  };
}
```

## Tool Handler

```typescript
// src/tools/my-tool.ts
export async function myTool(
  args: Record<string, unknown>,
  provider: MyServiceProvider,
): Promise<CallToolResult> {
  const id = args.id as string;
  const result = await provider.getItem(id);
  if (!result.success) return toMcpError(result.error);
  return { content: [{ type: 'text', text: JSON.stringify(result.data, null, 2) }] };
}
```

- Tool handlers are thin — validate args, call provider, format response
- Never contain business logic — that lives in the provider

## Server Factory

```typescript
// src/server.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MyServiceProvider } from './types/provider.js';
import { myTool } from './tools/my-tool.js';

export function createMcpServer(provider: MyServiceProvider): McpServer {
  const server = new McpServer({
    name: 'my-mcp-server',
    version: '0.1.0',
  });

  server.tool(
    'my_tool',
    'Does something useful',
    { param: z.string().describe('Parameter description') },
    async (args) => myTool(args as Record<string, unknown>, provider),
  );

  return server;
}
```

## Entry Points

### Stdio (local dev + local utility)

```typescript
// src/stdio.ts
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadConfig } from './lib/config.js';
import { createProvider } from './providers/index.js';
import { createMcpServer } from './server.js';

async function main(): Promise<void> {
  const config = loadConfig();
  const provider = createProvider(config);
  const server = createMcpServer(provider);
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error(`my-mcp-server started (mode: ${config.mode})`);

  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
```

### HTTP (deployed/multi-tenant)

```typescript
// src/http.ts — uses Hono for multi-tenant deployed servers
```

## Mock Adapter Rules

- Implements the **full** provider interface — no partial implementations
- Mutable in-memory state for writes (create/update/delete persist during server lifetime)
- Fixture data is **domain-specific** and realistic
- Returns data shaped exactly like the live API
- Uses `succeed()` / `fail()` for all returns

## Live Adapter Rules

- Constructor-injected API client (testable, swappable)
- Try-catch on all async operations → mapped to `Result` codes via `fail()`
- Response transformation in separate `mapper.ts` module
- Never exposes raw API errors — always map to domain-specific codes

## Auth Integration (Production Agent Only)

MCP servers are **stateless** regarding auth. The credential-vault + LiteLLM gateway handle tokens:

1. Agent calls tool via LiteLLM gateway
2. Gateway calls credential-vault: `GET /tokens/{userId}/{provider}`
3. Gateway injects fresh access token into request to MCP server
4. MCP server receives pre-authenticated request — no token storage

For Google services (Drive, Gmail, Ads): one unified "google" OAuth connection with combined scopes.

## Standard Stack

- **Runtime:** Node.js + TypeScript (ESM)
- **MCP SDK:** `@modelcontextprotocol/sdk`
- **Validation:** Zod v4
- **Testing:** Vitest
- **HTTP transport:** Hono (when multi-tenant / deployed)
- **Linting:** Biome

## .mcp.json Configuration

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["tsx", "/path/to/src/stdio.ts"],
      "env": { "MODE": "mock" }
    }
  }
}
```

## Debugging

```bash
# Check MCP status in Claude Code
claude mcp list

# Test specific server
claude mcp get myserver

# Debug interactively
/mcp
```
