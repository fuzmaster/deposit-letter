import React from 'react';
import ReactDOM from 'react-dom/client';
import posthog from 'posthog-js';
import App from './App.jsx';

// Initialize PostHog analytics
// Replace with your project API key from app.posthog.com
posthog.init('YOUR_POSTHOG_PROJECT_API_KEY', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
  capture_pageview: true,
  autocapture: false, // Manual event tracking only — keeps it lightweight
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
