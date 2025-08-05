import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { startWorker } = await import('./api/msw/browser')
    try {
      await startWorker()
      console.log('MSW worker successfully started')
    } catch (error) {
      console.error('MSW worker failed to start:', error)
    }
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
  );
})