// src/lib/layout.js
import { MarkerType, Position } from '@xyflow/react';

export const LAYOUT = { X0: 50, Y0: 60, COL: 250, ROW: 130 };

export const KIND_COLORS = {
  trigger: '#22c55e',
  action: '#3b82f6',
  condition: '#f59e0b',
};

/**
 * Deterministic layered layout (left → right).
 * nodeIds: string[]; edges: [{source, target, branch}]
 * Returns Map<id, {x, y}>. Never overlaps: same-column nodes are ≥ ROW apart.
 */
export function autoLayout(nodeIds, edges) {
  const { X0, Y0, COL, ROW } = LAYOUT;
  const known = new Set(nodeIds);
  const valid = edges.filter((e) => known.has(e.source) && known.has(e.target) && e.source !== e.target);

  const out = new Map(nodeIds.map((id) => [id, []]));
  valid.forEach((e) => out.get(e.source).push(e));

  // 1) find back-edges (cycles) with DFS so layering always terminates
  const state = new Map();
  const back = new Set();
  const dfs = (id) => {
    state.set(id, 1);
    for (const e of out.get(id)) {
      const s = state.get(e.target);
      if (s === 1) back.add(e);
      else if (!s) dfs(e.target);
    }
    state.set(id, 2);
  };
  const hasIncoming = new Set(valid.map((e) => e.target));
  nodeIds.filter((id) => !hasIncoming.has(id)).forEach((id) => !state.get(id) && dfs(id));
  nodeIds.forEach((id) => !state.get(id) && dfs(id));

  const fwd = valid.filter((e) => !back.has(e));

  // 2) longest-path depth via Kahn's algorithm
  const depth = new Map(nodeIds.map((id) => [id, 0]));
  const indeg = new Map(nodeIds.map((id) => [id, 0]));
  const fwdOut = new Map(nodeIds.map((id) => [id, []]));
  const fwdIn = new Map(nodeIds.map((id) => [id, []]));
  fwd.forEach((e) => {
    indeg.set(e.target, indeg.get(e.target) + 1);
    fwdOut.get(e.source).push(e);
    fwdIn.get(e.target).push(e);
  });
  const queue = nodeIds.filter((id) => indeg.get(id) === 0);
  while (queue.length) {
    const u = queue.shift();
    for (const e of fwdOut.get(u)) {
      depth.set(e.target, Math.max(depth.get(e.target), depth.get(u) + 1));
      indeg.set(e.target, indeg.get(e.target) - 1);
      if (indeg.get(e.target) === 0) queue.push(e.target);
    }
  }

  // 3) group into layers
  const layers = [];
  nodeIds.forEach((id, idx) => {
    const d = depth.get(id);
    (layers[d] = layers[d] || []).push({ id, idx });
  });

  // 4) assign y per layer: aim at parents' average y, true branch above / false below
  const yOf = new Map();
  const bias = ROW / 3;
  layers.forEach((layer, d) => {
    if (!layer) return;
    const items = layer.map(({ id, idx }) => {
      const parents = fwdIn.get(id);
      let desired;
      if (d === 0 || parents.length === 0) {
        desired = idx * ROW;
      } else {
        const ys = parents.map(
          (e) =>
            (yOf.get(e.source) ?? 0) +
            (e.branch === 'true' ? -bias : e.branch === 'false' ? bias : 0)
        );
        desired = ys.reduce((a, b) => a + b, 0) / ys.length;
      }
      return { id, idx, desired };
    });
    items.sort((a, b) => a.desired - b.desired || a.idx - b.idx);
    let prev = -Infinity;
    items.forEach((it) => {
      const y = Math.max(it.desired, prev + ROW);
      yOf.set(it.id, y);
      prev = y;
    });
  });

  // 5) normalize so the top-most node sits at Y0
  const minY = Math.min(...yOf.values());
  const result = new Map();
  nodeIds.forEach((id) => {
    result.set(id, { x: X0 + depth.get(id) * COL, y: Math.round(yOf.get(id) - minY + Y0) });
  });
  return result;
}

/** True if the AI-provided coordinates would visually collide (node box ≈ 180×70). */
export function hasOverlap(nodes) {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i].position;
      const b = nodes[j].position;
      if (Math.abs(a.x - b.x) < 200 && Math.abs(a.y - b.y) < 100) return true;
    }
  }
  return false;
}

export function buildEdge(e) {
  const color = e.branch === 'true' ? '#22c55e' : e.branch === 'false' ? '#ef4444' : '#94a3b8';
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'smoothstep',
    animated: e.branch === null,
    label: e.label || undefined,
    data: { branch: e.branch },
    markerEnd: { type: MarkerType.ArrowClosed, color },
    style: { stroke: color, strokeWidth: 2 },
    labelStyle: { fill: color, fontWeight: 700, fontSize: 12 },
    labelBgStyle: { fill: '#0f172a', fillOpacity: 0.95 },
    labelBgPadding: [6, 3],
    labelBgBorderRadius: 4,
  };
}

/**
 * Maps validated AI workflow → React Flow nodes/edges.
 *   trigger   → "input"   (source handle only)
 *   condition → "default" (amber styling, two labeled outgoing edges)
 *   action    → "default", or "output" when it has no outgoing edge (terminal step)
 */
export function toReactFlow(workflow, { trustAiPositions = false } = {}) {
  const outDegree = new Map(workflow.nodes.map((n) => [n.id, 0]));
  workflow.edges.forEach((e) => outDegree.set(e.source, outDegree.get(e.source) + 1));

  let positions = null;
  if (!(trustAiPositions && !hasOverlap(workflow.nodes))) {
    positions = autoLayout(
      workflow.nodes.map((n) => n.id),
      workflow.edges
    );
  }

  const nodes = workflow.nodes.map((n) => {
    let rfType = 'default';
    if (n.type === 'trigger') rfType = 'input';
    else if (n.type === 'action' && outDegree.get(n.id) === 0) rfType = 'output';

    return {
      id: n.id,
      type: rfType,
      position: positions ? positions.get(n.id) : n.position,
      className: `lf-node lf-${n.type}`,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        kind: n.type,
        description: n.description,
        label: n.description ? `${n.label}\n${n.description}` : n.label,
      },
    };
  });

  return { nodes, edges: workflow.edges.map(buildEdge) };
}
