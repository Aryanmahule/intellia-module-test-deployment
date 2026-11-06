// src/components/LuminaFlowDashboard.jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  MarkerType,
} from '@xyflow/react';
import { compileWorkflow, DEFAULT_MODEL } from '../lib/compileWorkflow.js';
import { autoLayout, buildEdge, toReactFlow, KIND_COLORS } from '../lib/layout.js';

const STORAGE_KEY = 'luminaflow:v1';
const KEY_STORAGE = 'luminaflow:apikey';

const EXAMPLES = [
  'When a new Stripe payment arrives, if the amount is over $100 send a Slack alert, otherwise log it in Google Sheets.',
  'Every Monday at 9am fetch the weekly sales report, summarize it with AI, and email it to the team.',
  'When a support email arrives, if it mentions "refund" create a Zendesk ticket and notify finance; if not, check whether it is urgent and either page on-call or add it to the daily digest.',
];

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) return parsed;
  } catch {
    /* corrupted storage: ignore */
  }
  return null;
}
const SAVED = loadSaved();

export default function LuminaFlowDashboard() {
  const [nodes, setNodes, onNodesChange] = useNodesState(SAVED?.nodes ?? []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(SAVED?.edges ?? []);
  const { fitView } = useReactFlow();

  const [apiKey, setApiKey] = useState(() => {
    try {
      return sessionStorage.getItem(KEY_STORAGE) || import.meta.env.VITE_OPENAI_API_KEY || '';
    } catch {
      return import.meta.env.VITE_OPENAI_API_KEY || '';
    }
  });
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [prompt, setPrompt] = useState('');
  const [trustAi, setTrustAi] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | compiling | success | error
  const [logs, setLogs] = useState([
    { id: 0, t: new Date().toLocaleTimeString(), level: 'info', msg: 'Ready. Enter a request and press Compile.' },
  ]);
  const logId = useRef(1);
  const abortRef = useRef(null);

  const log = useCallback((level, msg) => {
    setLogs((prev) => [
      ...prev.slice(-59),
      { id: logId.current++, t: new Date().toLocaleTimeString(), level, msg },
    ]);
  }, []);

  // ---- persistence: API key (session only) ----
  useEffect(() => {
    try {
      if (apiKey) sessionStorage.setItem(KEY_STORAGE, apiKey);
      else sessionStorage.removeItem(KEY_STORAGE);
    } catch {
      /* ignore */
    }
  }, [apiKey]);

  // ---- persistence: canvas (debounced; dragging fires every frame) ----
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
      } catch {
        /* quota exceeded: ignore */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [nodes, edges]);

  // ---- manual wiring ----
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            data: { branch: null },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
            style: { stroke: '#94a3b8', strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  );

  const refit = useCallback(() => {
    setTimeout(() => fitView({ padding: 0.2, duration: 600 }), 60);
  }, [fitView]);

  // ---- compile ----
  const handleCompile = async () => {
    if (status === 'compiling') return;
    if (!apiKey.trim()) {
      setStatus('error');
      return log('error', 'Enter your OpenAI API key first.');
    }
    if (!prompt.trim()) {
      setStatus('error');
      return log('error', 'Describe the automation you want to build.');
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setStatus('compiling');
    log('info', 'Compiling workflow…');

    try {
      const result = await compileWorkflow({
        apiKey,
        model,
        prompt,
        signal: controller.signal,
        onLog: log,
      });

      result.warnings.forEach((w) => log('warn', w));

      const { nodes: n, edges: e } = toReactFlow(result.workflow, { trustAiPositions: trustAi });
      setNodes(n);
      setEdges(e);
      refit();

      const tokens = result.usage?.total_tokens ? ` · ${result.usage.total_tokens} tokens` : '';
      log(
        'success',
        `"${result.workflow.title}": ${n.length} nodes, ${e.length} edges (attempt ${result.attempts})${tokens}`
      );
      setStatus('success');
    } catch (err) {
      if (controller.signal.aborted) {
        log('warn', 'Compilation cancelled.');
        setStatus('idle');
      } else {
        log('error', err.message || 'Compilation failed.');
        setStatus('error');
      }
    } finally {
      abortRef.current = null;
    }
  };

  const handleCancel = () => abortRef.current?.abort();

  // ---- canvas utilities ----
  const handleRelayout = () => {
    if (nodes.length === 0) return;
    const positions = autoLayout(
      nodes.map((n) => n.id),
      edges.map((e) => ({ source: e.source, target: e.target, branch: e.data?.branch ?? null }))
    );
    setNodes((nds) => nds.map((n) => ({ ...n, position: positions.get(n.id) ?? n.position })));
    refit();
    log('info', 'Layout recalculated.');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ nodes, edges }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'luminaflow-workflow.json';
    a.click();
    URL.revokeObjectURL(url);
    log('info', 'Exported workflow JSON.');
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    setStatus('idle');
    log('info', 'Canvas cleared.');
  };

  const onPromptKeyDown = (ev) => {
    if ((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter') handleCompile();
  };

  const statusLabel = { idle: 'Idle', compiling: 'Compiling…', success: 'Compiled', error: 'Error' }[status];

  return (
    <div className="lf-app">
      {/* ================= LEFT: FIXED CONTROL SIDEBAR ================= */}
      <aside className="lf-sidebar">
        <header className="lf-brand">
          <span className="lf-logo">◈</span>
          <div>
            <h1>LuminaFlow</h1>
            <p>Language → visual workflow</p>
          </div>
        </header>

        <section className="lf-section">
          {!import.meta.env.VITE_OPENAI_API_KEY && (
            <>
              <label className="lf-label" htmlFor="apikey">OpenAI API key</label>
              <input
                id="apikey"
                type="password"
                className="lf-input"
                placeholder="sk-…"
                value={apiKey}
                autoComplete="off"
                onChange={(e) => setApiKey(e.target.value)}
              />
            </>
          )}
          <label className="lf-label" htmlFor="model">Model</label>
          <input
            id="model"
            className="lf-input"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            spellCheck={false}
          />
          <p className="lf-hint">
            {import.meta.env.VITE_OPENAI_API_KEY
              ? 'API key loaded from environment.'
              : "Key is kept in this tab's session storage and sent only to OpenAI."}
          </p>
        </section>

        <section className="lf-section">
          <label className="lf-label" htmlFor="prompt">Describe your automation</label>
          <textarea
            id="prompt"
            className="lf-textarea"
            rows={6}
            placeholder="When X happens, if Y then do Z, otherwise do W…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={onPromptKeyDown}
          />
          <div className="lf-chips">
            {EXAMPLES.map((ex, i) => (
              <button key={i} className="lf-chip" onClick={() => setPrompt(ex)} type="button">
                Example {i + 1}
              </button>
            ))}
          </div>

          <label className="lf-check">
            <input type="checkbox" checked={trustAi} onChange={(e) => setTrustAi(e.target.checked)} />
            Use AI-suggested positions (auto-layout still runs if they overlap)
          </label>

          <div className="lf-row">
            <button
              className="lf-btn lf-btn-primary"
              onClick={handleCompile}
              disabled={status === 'compiling'}
              type="button"
            >
              {status === 'compiling' ? 'Compiling…' : 'Compile Workflow'}
            </button>
            {status === 'compiling' && (
              <button className="lf-btn" onClick={handleCancel} type="button">
                Cancel
              </button>
            )}
          </div>
          <p className="lf-hint">Ctrl/⌘ + Enter to compile.</p>
        </section>

        <section className="lf-section">
          <div className="lf-label">Canvas</div>
          <div className="lf-row">
            <button className="lf-btn" onClick={handleRelayout} disabled={!nodes.length} type="button">
              Re-layout
            </button>
            <button className="lf-btn" onClick={handleExport} disabled={!nodes.length} type="button">
              Export JSON
            </button>
            <button className="lf-btn lf-btn-danger" onClick={handleClear} disabled={!nodes.length} type="button">
              Clear
            </button>
          </div>
        </section>

        <section className="lf-section lf-grow">
          <div className="lf-statusbar">
            <span className="lf-label">Compilation log</span>
            <span className={`lf-badge lf-badge-${status}`}>{statusLabel}</span>
          </div>
          <ul className="lf-log" aria-live="polite">
            {[...logs].reverse().map((l) => (
              <li key={l.id} className={`lf-log-${l.level}`}>
                <time>{l.t}</time> {l.msg}
              </li>
            ))}
          </ul>
        </section>
      </aside>

      {/* ================= RIGHT: FLUID CANVAS ================= */}
      <main className="lf-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          colorMode="dark"
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.75}
          deleteKeyCode={['Backspace', 'Delete']}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1.4} />
          <Controls position="bottom-left" />
          <MiniMap
            pannable
            zoomable
            nodeColor={(n) => KIND_COLORS[n.data?.kind] || '#64748b'}
            maskColor="rgba(2, 6, 23, 0.7)"
          />
        </ReactFlow>

        {nodes.length === 0 && (
          <div className="lf-empty">
            <div className="lf-empty-card">
              <div className="lf-empty-logo">◈</div>
              <h2>Your canvas is empty</h2>
              <p>
                Describe an automation on the left and press <strong>Compile Workflow</strong>.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
