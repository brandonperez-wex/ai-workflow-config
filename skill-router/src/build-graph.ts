/**
 * Build script — computes embeddings for all skill nodes and writes the full graph to disk.
 * Run: npm run build && npm run build-graph
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { embedBatch } from "./embed.js";
import { SKILL_GRAPH_DEFINITION } from "./skill-graph.js";
import type { SkillGraph } from "./graph.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "..", "skill-graph.json");

async function main() {
  console.log("Building skill graph with embeddings...");

  const nodeIds = Object.keys(SKILL_GRAPH_DEFINITION.nodes);
  console.log(`  ${nodeIds.length} nodes to embed`);

  // Build embedding texts: description + keywords for richer embedding
  const texts = nodeIds.map((id) => {
    const node = SKILL_GRAPH_DEFINITION.nodes[id];
    const parts = [node.description];
    if (node.keywords?.length) {
      parts.push(`Keywords: ${node.keywords.join(", ")}`);
    }
    return parts.join(" ");
  });

  console.log("  Computing embeddings via Ollama...");
  const embeddings = await embedBatch(texts);

  // Attach embeddings to nodes
  const nodes = { ...SKILL_GRAPH_DEFINITION.nodes };
  for (let i = 0; i < nodeIds.length; i++) {
    nodes[nodeIds[i]] = {
      ...nodes[nodeIds[i]],
      embedding: embeddings[i],
    };
  }

  const graph: SkillGraph = {
    version: "1.0.0",
    model: process.env.EMBED_MODEL ?? "nomic-embed-text",
    nodes,
    edges: SKILL_GRAPH_DEFINITION.edges,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(graph));
  const sizeKB = (Buffer.byteLength(JSON.stringify(graph)) / 1024).toFixed(0);
  console.log(`  Written to ${OUTPUT_PATH} (${sizeKB} KB)`);
  console.log("Done.");
}

main().catch((err) => {
  console.error("Failed to build graph:", err);
  process.exit(1);
});
