import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'react-alice-carousel/lib/alice-carousel.css';
import CryptoContext from './CryptoContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <CryptoContext>
      <App />
    </CryptoContext>
)
