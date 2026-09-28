import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { runAppDiagnostics } from './utils/appDiagnostics';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );

  // Run diagnostics after initial frame render to verify DOM injection & Tailwind styles
  requestAnimationFrame(() => {
    setTimeout(() => {
      runAppDiagnostics();
    }, 100);
  });
} else {
  console.error("FATAL: Root container '#root' was not found in the HTML document.");
}

