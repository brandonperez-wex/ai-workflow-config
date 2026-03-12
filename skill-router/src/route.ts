/**
 * Hook entry point — reads user prompt from stdin, routes through skill graph,
 * outputs JSON for Claude Code's UserPromptSubmit hook.
 *
 * Usage (as UserPromptSubmit hook):
 *   node dist/route.js
 *
 * Reads hook input from stdin: { "userMessage": "..." }
 * Outputs: { "hookSpecificOutput": { "additionalContext": "..." } }
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { SkillGraph } from "./graph.js";
import { route } from "./router.js";
import { formatRouteContext } from "./traverse.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GRAPH_PATH = resolve(__dirname, "..", "skill-graph.json");
const THRESHOLD = parseFloat(process.env.ROUTE_THRESHOLD ?? "0.45");
const TOP_K = parseInt(process.env.ROUTE_TOP_K ?? "2", 10);

async function main() {
  // Read hook input from stdin
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  let userMessage: string;
  try {
    const hookInput = JSON.parse(input);
    userMessage = hookInput.userMessage ?? hookInput.message ?? input;
  } catch {
    // If not JSON, treat the raw input as the message
    userMessage = input.trim();
  }

  if (!userMessage) {
    // No message, nothing to route
    process.exit(0);
  }

  // Load pre-computed graph
  const graph: SkillGraph = JSON.parse(readFileSync(GRAPH_PATH, "utf-8"));

  // Route
  const matches = await route(graph, userMessage, {
    threshold: THRESHOLD,
    topK: TOP_K,
  });

  if (matches.length === 0) {
    // No strong match — don't inject anything
    process.exit(0);
  }

  // Output for Claude Code hook
  const context = formatRouteContext(matches);
  const output = {
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext: context,
    },
  };

  process.stdout.write(JSON.stringify(output));
}

main().catch((err) => {
  console.error("Skill router error:", err.message);
  process.exit(0); // Exit cleanly so we don't block the user's prompt
});
