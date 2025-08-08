import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// ✨ NEW: Import the entire modular design system globally
import './styles/tokens.css'; // Structural skeleton first
import './styles/theme.css'; // Then themes
import './styles/base.css';
import './styles/layout.css';
// Import all component and view styles
import './styles/components/buttons.css';
import './styles/components/forms.css';
import './styles/components/modal.css';

import './styles/components/loading.css';
import './styles/views/dashboard.css';
import './styles/views/history.css';
import './styles/views/results.css';
import './styles/views/empty-state.css';

import './styles/components/progress-ring.css';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
