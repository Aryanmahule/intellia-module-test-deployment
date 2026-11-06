// src/lib/workflowSchema.js
export const NODE_KINDS = ['trigger', 'action', 'condition'];

/**
 * Validates and normalizes raw model output.
 * Returns { workflow, errors, warnings }.
 *  - errors   → fatal, triggers the repair retry
 *  - warnings → auto-fixed, shown in the status log
 */
export function validateWorkflow(raw) {
  const errors = [];
  const warnings = [];

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { workflow: null, errors: ['Root value must be a JSON object.'], warnings };
  }

  const rawNodes = Array.isArray(raw.nodes) ? raw.nodes : [];
  const rawEdges = Array.isArray(raw.edges) ? raw.edges : [];
  if (rawNodes.length === 0) errors.push('"nodes" is missing or empty.');

  // ---- nodes ----
  const ids = new Set();
  const nodes = [];
  rawNodes.forEach((n, i) => {
    const id = String(n?.id ?? '').trim();
    if (!id) return errors.push(`nodes[${i}] has no id.`);
    if (ids.has(id)) return errors.push(`Duplicate node id "${id}".`);
    if (!NODE_KINDS.includes(n.type)) {
      return errors.push(`Node "${id}" has invalid type "${n.type}". Allowed: trigger, action, condition.`);
    }
    ids.add(id);
    const px = Number(n?.position?.x);
    const py = Number(n?.position?.y);
    nodes.push({
      id,
      type: n.type,
      label: String(n.label || id).trim().slice(0, 60),
      description: String(n.description || '').trim().slice(0, 90),
      position: {
        x: Number.isFinite(px) ? px : 0,
        y: Number.isFinite(py) ? py : 0,
      },
    });
  });

  // ---- edges ----
  const edges = [];
  const edgeIds = new Set();
  const pairs = new Set();
  rawEdges.forEach((e, i) => {
    const source = String(e?.source ?? '').trim();
    const target = String(e?.target ?? '').trim();
    if (!ids.has(source) || !ids.has(target)) {
      return warnings.push(`Dropped edge ${i}: "${source}" → "${target}" references a missing node.`);
    }
    if (source === target) return warnings.push(`Dropped self-loop on "${source}".`);
    const key = `${source}->${target}`;
    if (pairs.has(key)) return warnings.push(`Dropped duplicate edge ${key}.`);
    pairs.add(key);

    let id = String(e?.id ?? '').trim() || `e${i + 1}`;
    while (edgeIds.has(id)) id = `${id}_${i}`;
    edgeIds.add(id);

    let branch = String(e?.branch ?? '').toLowerCase();
    if (branch !== 'true' && branch !== 'false') {
      const l = String(e?.label ?? '').trim().toLowerCase();
      if (['true', 'yes'].includes(l)) branch = 'true';
      else if (['false', 'no'].includes(l)) branch = 'false';
      else branch = null;
    }
    edges.push({ id, source, target, label: String(e?.label ?? '').trim(), branch });
  });

  // ---- structural checks ----
  const triggers = nodes.filter((n) => n.type === 'trigger');
  if (triggers.length === 0) errors.push('Workflow has no trigger node.');
  if (triggers.length > 1) warnings.push(`Workflow has ${triggers.length} triggers (expected 1).`);

  const outgoing = new Map(nodes.map((n) => [n.id, []]));
  const incomingCount = new Map(nodes.map((n) => [n.id, 0]));
  edges.forEach((e) => {
    outgoing.get(e.source).push(e);
    incomingCount.set(e.target, incomingCount.get(e.target) + 1);
  });

  for (const t of triggers) {
    if (incomingCount.get(t.id) > 0) warnings.push(`Trigger "${t.id}" has incoming edges.`);
  }

  for (const n of nodes) {
    const outs = outgoing.get(n.id);

    if (n.type === 'condition') {
      if (outs.length !== 2) {
        errors.push(
          `Condition "${n.id}" must have exactly 2 outgoing edges (one "true", one "false") but has ${outs.length}.`
        );
        continue;
      }
      const branches = outs.map((e) => e.branch);
      const hasBoth = branches.includes('true') && branches.includes('false');
      if (!hasBoth) {
        if (branches.every((b) => b === null)) {
          outs[0].branch = 'true';
          outs[1].branch = 'false';
          warnings.push(`Condition "${n.id}": unlabeled branches auto-assigned (first=True, second=False).`);
        } else {
          errors.push(`Condition "${n.id}" must have one edge with branch "true" and one with branch "false".`);
          continue;
        }
      }
      outs.forEach((e) => {
        e.label = e.branch === 'true' ? 'True' : 'False';
      });
    } else {
      outs.forEach((e) => {
        if (e.branch !== null) {
          warnings.push(`Edge "${e.id}" leaves a non-condition node; branch label cleared.`);
          e.branch = null;
        }
      });
    }
  }

  // reachability from the trigger
  if (triggers.length > 0) {
    const seen = new Set();
    const stack = [triggers[0].id];
    while (stack.length) {
      const id = stack.pop();
      if (seen.has(id)) continue;
      seen.add(id);
      outgoing.get(id).forEach((e) => stack.push(e.target));
    }
    const unreachable = nodes.filter((n) => !seen.has(n.id) && n.type !== 'trigger');
    if (unreachable.length) {
      warnings.push(`Unreachable nodes: ${unreachable.map((n) => n.id).join(', ')}.`);
    }
  }

  return {
    workflow: { title: String(raw.title || 'Untitled Workflow').slice(0, 80), nodes, edges },
    errors,
    warnings,
  };
}
