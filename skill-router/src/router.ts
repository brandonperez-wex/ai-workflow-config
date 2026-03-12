/**
 * Core router — embed query, find top matches, traverse graph.
 */

import type { SkillGraph, RouteMatch } from "./graph.js";
import { embed, cosineSimilarity } from "./embed.js";
import { buildPath, getMacros } from "./traverse.js";

const DEFAULT_THRESHOLD = 0.45;
const DEFAULT_TOP_K = 2;

export interface RouterOptions {
  threshold?: number;
  topK?: number;
}

export async function route(
  graph: SkillGraph,
  query: string,
  options: RouterOptions = {}
): Promise<RouteMatch[]> {
  const threshold = options.threshold ?? DEFAULT_THRESHOLD;
  const topK = options.topK ?? DEFAULT_TOP_K;

  // Embed the user's query
  const queryEmbedding = await embed(query);

  // Score every node (skip reference nodes — they're only reached via graph traversal)
  const scored: { id: string; score: number }[] = [];
  for (const [id, node] of Object.entries(graph.nodes)) {
    if (!node.embedding) continue;
    if (node.type === "reference") continue;
    const score = cosineSimilarity(queryEmbedding, node.embedding);
    scored.push({ id, score });
  }

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Filter by threshold and take top-k
  const topMatches = scored
    .filter((s) => s.score >= threshold)
    .slice(0, topK);

  // Build full route matches with graph traversal
  const matches: RouteMatch[] = topMatches.map((s) => ({
    node: graph.nodes[s.id],
    score: s.score,
    macros: getMacros(graph, s.id),
    path: buildPath(graph, s.id),
  }));

  return matches;
}
