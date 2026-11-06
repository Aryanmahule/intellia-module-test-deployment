// src/App.jsx
import { ReactFlowProvider } from '@xyflow/react';
import LuminaFlowDashboard from './components/LuminaFlowDashboard.jsx';

export default function App() {
  // Provider is required so the dashboard can call useReactFlow() (fitView).
  return (
    <ReactFlowProvider>
      <LuminaFlowDashboard />
    </ReactFlowProvider>
  );
}
