/**
 * Graph traversal — given a matched node, walk edges to build context.
 */

import type { SkillGraph, SkillNode, SkillEdge, GraphPath, RouteMatch } from "./graph.js";

/** Find all edges where a node appears as source or target */
function edgesFor(graph: SkillGraph, nodeId: string): SkillEdge[] {
  return graph.edges.filter((e) => e.from === nodeId || e.to === nodeId);
}

/** Get parent macro(s) for a skill node */
export function getMacros(graph: SkillGraph, nodeId: string): string[] {
  return graph.edges
    .filter((e) => e.to === nodeId && e.rel === "contains")
    .map((e) => e.from);
}

/** Get children of a macro node */
export function getChildren(graph: SkillGraph, nodeId: string): string[] {
  return graph.edges
    .filter((e) => e.from === nodeId && e.rel === "contains")
    .map((e) => e.to);
}

/** Get prerequisites (what must run before this skill) */
function getPrerequisites(graph: SkillGraph, nodeId: string): string[] {
  return graph.edges
    .filter((e) => e.to === nodeId && e.rel === "precedes")
    .map((e) => e.from);
}

/** Get postrequisites (what must run after this skill) */
function getPostrequisites(graph: SkillGraph, nodeId: string): string[] {
  const after = graph.edges
    .filter((e) => e.from === nodeId && e.rel === "precedes")
    .map((e) => e.to);

  const required = graph.edges
    .filter((e) => e.from === nodeId && e.rel === "requires")
    .map((e) => e.to);

  return [...after, ...required];
}

/** Get cross-cutting reference skills (coding-standards, communication-protocol, etc.) */
function getReferences(graph: SkillGraph, nodeId: string): string[] {
  return graph.edges
    .filter((e) => e.from === nodeId && e.rel === "references")
    .map((e) => e.to);
}

/** Get sibling skills (other skills in the same macro) */
function getSiblings(graph: SkillGraph, nodeId: string): string[] {
  const macros = getMacros(graph, nodeId);
  const siblings = new Set<string>();
  for (const macro of macros) {
    for (const child of getChildren(graph, macro)) {
      if (child !== nodeId) siblings.add(child);
    }
  }
  return [...siblings];
}

/** Determine which skill to actually invoke */
function resolveInvoke(graph: SkillGraph, nodeId: string): string {
  const node = graph.nodes[nodeId];

  // If the matched node is directly invocable, use it
  if (node?.invoke) return node.invoke;

  // If it's a macro, find its entry point or first child
  if (node?.type === "macro") {
    const children = getChildren(graph, nodeId);
    // Look for a child that has no prerequisites within this macro
    for (const childId of children) {
      const prereqs = getPrerequisites(graph, childId);
      if (prereqs.length === 0 || !prereqs.some((p) => children.includes(p))) {
        const child = graph.nodes[childId];
        if (child?.invoke) return child.invoke;
      }
    }
    // Fallback: first child with an invoke
    for (const childId of children) {
      const child = graph.nodes[childId];
      if (child?.invoke) return child.invoke;
    }
  }

  return nodeId; // last resort: use the node ID as the skill name
}

/** Build the full graph path for a matched node */
export function buildPath(graph: SkillGraph, nodeId: string): GraphPath {
  const prerequisites = getPrerequisites(graph, nodeId);
  const postrequisites = getPostrequisites(graph, nodeId);
  const siblings = getSiblings(graph, nodeId);
  const directRefs = getReferences(graph, nodeId);
  const invoke = resolveInvoke(graph, nodeId);
  const macros = getMacros(graph, nodeId);
  const node = graph.nodes[nodeId];

  // For macro nodes, also collect references from all children
  const references = new Set(directRefs);
  if (node?.type === "macro") {
    for (const childId of getChildren(graph, nodeId)) {
      for (const ref of getReferences(graph, childId)) {
        references.add(ref);
      }
    }
  }
  const refArray = [...references];

  // Build reasoning chain
  const parts: string[] = [];

  if (node?.type === "macro") {
    parts.push(`Matched macro category '${nodeId}'`);
    const children = getChildren(graph, nodeId);
    if (children.length > 0) {
      parts.push(`contains: ${children.join(", ")}`);
    }
  } else {
    parts.push(`Matched skill '${nodeId}'`);
    if (macros.length > 0) {
      parts.push(`in category: ${macros.join(", ")}`);
    }
  }

  if (prerequisites.length > 0) {
    parts.push(`run first: ${prerequisites.join(", ")}`);
  }

  if (postrequisites.length > 0) {
    parts.push(`then run: ${postrequisites.join(", ")}`);
  }

  if (refArray.length > 0) {
    parts.push(`also load: ${refArray.join(", ")}`);
  }

  parts.push(`INVOKE: /${invoke}`);

  return {
    prerequisites,
    postrequisites,
    siblings,
    references: refArray,
    invoke,
    reasoning: parts.join(" → "),
  };
}

/** Format a RouteMatch into the additionalContext string */
export function formatRouteContext(matches: RouteMatch[]): string {
  if (matches.length === 0) return "";

  const lines = ["SKILL ROUTING:"];

  for (const match of matches) {
    lines.push(
      `  ${match.path.reasoning} (confidence: ${match.score.toFixed(2)})`
    );
  }

  const primary = matches[0];
  lines.push("");
  lines.push(
    `ACTION: Invoke /${primary.path.invoke} skill before proceeding.`
  );

  return lines.join("\n");
}
