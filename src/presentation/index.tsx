import { createRoot } from "react-dom/client";
import { App } from "./App";
import React from 'react';

import './styles/variables.css';
import './styles/global.css';


const container = document.getElementById('root');

if (!container) {
    throw new Error('Elemento #root no encontrado');
}

createRoot(container).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>    
);