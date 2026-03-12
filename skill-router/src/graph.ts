/**
 * Skill graph schema and types.
 *
 * Nodes = skills (macro + sub), each with an embedding vector.
 * Edges = typed relationships between skills.
 */

export type NodeType = "macro" | "skill" | "reference";

export type EdgeType =
  | "contains"    // macro → sub-skill
  | "precedes"    // skill A should run before skill B
  | "requires"    // skill A requires skill B after completion
  | "shares"      // bidirectional: both macros contain this sub-skill
  | "references"; // skill A should load skill B as active guidance during execution

export interface SkillNode {
  id: string;
  type: NodeType;
  description: string;
  /** The skill to invoke via /skill-name. Null for macro nodes unless they have a default entry point. */
  invoke: string | null;
  /** Pre-computed embedding vector (768-dim for nomic-embed-text) */
  embedding?: number[];
  /** Optional keywords to boost matching */
  keywords?: string[];
}

export interface SkillEdge {
  from: string;
  to: string;
  rel: EdgeType;
  /** Optional weight for ranking (default 1.0) */
  weight?: number;
}

export interface SkillGraph {
  version: string;
  model: string;
  nodes: Record<string, SkillNode>;
  edges: SkillEdge[];
}

/** A match result from the router */
export interface RouteMatch {
  /** The matched node */
  node: SkillNode;
  /** Cosine similarity score */
  score: number;
  /** Parent macro skill(s) if this is a sub-skill */
  macros: string[];
  /** Graph path: prerequisites, co-skills, etc. */
  path: GraphPath;
}

export interface GraphPath {
  /** Skills that should run before this one */
  prerequisites: string[];
  /** Skills that should run after this one */
  postrequisites: string[];
  /** Sibling skills in the same macro */
  siblings: string[];
  /** Cross-cutting skills to load as active guidance */
  references: string[];
  /** The recommended skill to invoke */
  invoke: string;
  /** Human-readable reasoning chain */
  reasoning: string;
}
