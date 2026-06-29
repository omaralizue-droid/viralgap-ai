import React, {StrictMode, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean; error: any }> {
  state: { hasError: boolean; error: any };

  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', color: '#ef4444', background: '#0f172a', border: '1px solid #3b82f6', borderRadius: '12px', margin: '24px', fontFamily: 'monospace' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#f43f5e' }}>Runtime Crash Captured</h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>The React application encountered a runtime exception during rendering or state initialization:</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#020617', padding: '16px', borderRadius: '8px', color: '#e2e8f0', border: '1px solid #1e293b' }}>
            {this.state.error?.toString()}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#020617', padding: '16px', borderRadius: '8px', color: '#94a3b8', border: '1px solid #1e293b', marginTop: '12px', fontSize: '11px' }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
