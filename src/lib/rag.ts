/**
 * Resource Allocation Graph - Core Logic
 * Detects deadlocks via cycle detection on the directed graph.
 */

export type NodeType = "process" | "resource";

export interface RAGNode {
  id: string;
  type: NodeType;
  label: string;
}

export type EdgeType = "request" | "allocation";

export interface RAGEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
}

export interface RAGState {
  nodes: RAGNode[];
  edges: RAGEdge[];
}

export interface CycleResult {
  hasCycle: boolean;
  cycleNodes: string[];
  cycleEdges: string[];
}

/**
 * Detect a directed cycle using DFS. Returns the first cycle found.
 */
export function detectCycle(state: RAGState): CycleResult {
  const adj = new Map<string, { target: string; edgeId: string }[]>();
  state.nodes.forEach((n) => adj.set(n.id, []));
  state.edges.forEach((e) => {
    adj.get(e.source)?.push({ target: e.target, edgeId: e.id });
  });

  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>();
  state.nodes.forEach((n) => color.set(n.id, WHITE));
  const parent = new Map<string, { node: string; edgeId: string } | null>();
  state.nodes.forEach((n) => parent.set(n.id, null));

  let cycleStart: string | null = null;
  let cycleEnd: string | null = null;
  let closingEdge: string | null = null;

  function dfs(u: string): boolean {
    color.set(u, GRAY);
    for (const { target: v, edgeId } of adj.get(u) ?? []) {
      if (color.get(v) === WHITE) {
        parent.set(v, { node: u, edgeId });
        if (dfs(v)) return true;
      } else if (color.get(v) === GRAY) {
        cycleStart = v;
        cycleEnd = u;
        closingEdge = edgeId;
        return true;
      }
    }
    color.set(u, BLACK);
    return false;
  }

  for (const n of state.nodes) {
    if (color.get(n.id) === WHITE) {
      if (dfs(n.id)) break;
    }
  }

  if (!cycleStart || !cycleEnd) {
    return { hasCycle: false, cycleNodes: [], cycleEdges: [] };
  }

  // Reconstruct cycle from cycleEnd back to cycleStart
  const path: string[] = [cycleEnd];
  const edgePath: string[] = [closingEdge!];
  let cur = cycleEnd;
  while (cur !== cycleStart) {
    const p = parent.get(cur);
    if (!p) break;
    path.push(p.node);
    edgePath.push(p.edgeId);
    cur = p.node;
  }
  path.reverse();
  edgePath.reverse();
  return { hasCycle: true, cycleNodes: path, cycleEdges: edgePath };
}

export function nextProcessId(state: RAGState): string {
  const used = state.nodes.filter((n) => n.type === "process").map((n) => parseInt(n.id.slice(1)));
  const next = used.length ? Math.max(...used) + 1 : 1;
  return `P${next}`;
}

export function nextResourceId(state: RAGState): string {
  const used = state.nodes.filter((n) => n.type === "resource").map((n) => parseInt(n.id.slice(1)));
  const next = used.length ? Math.max(...used) + 1 : 1;
  return `R${next}`;
}

export function exampleDeadlock(): RAGState {
  return {
    nodes: [
      { id: "P1", type: "process", label: "P1" },
      { id: "P2", type: "process", label: "P2" },
      { id: "R1", type: "resource", label: "R1" },
      { id: "R2", type: "resource", label: "R2" },
    ],
    edges: [
      { id: "e1", source: "P1", target: "R1", type: "request" },
      { id: "e2", source: "R1", target: "P2", type: "allocation" },
      { id: "e3", source: "P2", target: "R2", type: "request" },
      { id: "e4", source: "R2", target: "P1", type: "allocation" },
    ],
  };
}

export function exampleSafe(): RAGState {
  return {
    nodes: [
      { id: "P1", type: "process", label: "P1" },
      { id: "P2", type: "process", label: "P2" },
      { id: "P3", type: "process", label: "P3" },
      { id: "R1", type: "resource", label: "R1" },
      { id: "R2", type: "resource", label: "R2" },
    ],
    edges: [
      { id: "e1", source: "R1", target: "P1", type: "allocation" },
      { id: "e2", source: "P2", target: "R1", type: "request" },
      { id: "e3", source: "R2", target: "P3", type: "allocation" },
      { id: "e4", source: "P1", target: "R2", type: "request" },
    ],
  };
}
