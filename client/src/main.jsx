import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'react-alice-carousel/lib/alice-carousel.css';
import CryptoContext from './CryptoContext';
let onlineStatus = navigator.onLine ? "ONLINE NOW":"OFFLINE NOW";
// { navigator.onLine ? <App />: <h1  style={{background:"orange",height:"100vh", padding:"25% 0 0 25%"}}>Cheak your Internet Connection</h1>}  

// function cheakonlineStatus() {
//     console.log(onlineStatus)
//   }
ReactDOM.createRoot(document.getElementById('root')).render(

    <CryptoContext>
     {/* { navigator.onLine ? <App />: <h1  style={{background:"orange",height:"100vh", padding:"25% 0 0 25%"}}>Cheak your Internet Connection</h1>} */}
     <App/>
    </CryptoContext>
)
