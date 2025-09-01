import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import FinancialDashboard from './components/FinancialDashboard';
//import FinancialDashboard from './App.js';
//import FinancialDashboard from './Drawdown.js';
//import FinancialDashboard from './Org.js';
import FinancialDashboard from './Spanish.js';
//import FinancialDashboard from './vacancy.js';
import SpanishLeaeningGame from ../src/components/SpanishLearningGame.js

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FinancialDashboard />
  </React.StrictMode>
);

