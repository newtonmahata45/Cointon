import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import Homepage from './Pages/Homepage';
import CoinPage from './Pages/CoinPage';
import SignUpLogin from './Pages/SignUpLogin';
import WelcomePage from './Pages/WelcomePage';
import { useEffect } from 'react';

// let onlineStatus = navigator.onLine ? "ONLINE NOW":"OFFLINE NOW";


function App() {
  // useEffect(() => {
    // console.log(onlineStatus)
  // }, [])
  return (
    //  navigator.onLine ?
     <BrowserRouter>
        <Routes>
          <Route path='/' Component = {Homepage}  />
          <Route path='/coins/:id' Component = { CoinPage } />
          <Route path='/sign/:tab' Component = { SignUpLogin } />
          <Route path='/welcome' Component = { WelcomePage } />
        </Routes>
    </BrowserRouter>
     //: <h1  style={{background:"orange",height:"100vh", padding:"25% 0 0 25%"}}>Cheak your Internet Connection</h1>
  )
}


export default App
