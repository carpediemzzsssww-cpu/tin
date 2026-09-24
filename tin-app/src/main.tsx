import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './styles.css';
function fitViewport(){document.documentElement.style.setProperty('--app-height',`${window.visualViewport?.height||innerHeight}px`);}
fitViewport();window.addEventListener('resize',fitViewport);window.visualViewport?.addEventListener('resize',fitViewport);
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
