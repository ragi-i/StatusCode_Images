import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import ReactGA from "react-ga4";
import TrackPageView from "./TrackPageView";

ReactGA.initialize("G-QGRVBLPNLT");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
     <TrackPageView />
    <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();


