import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import './App.css'

import Homepage from './Pages/Homepage';
import CoinPage from './Pages/CoinPage';
import SignUpLogin from './Pages/SignUpLogin';
import WelcomePage from './Pages/WelcomePage';


function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' Component = {Homepage}  />
          <Route path='/coins/:id' Component = { CoinPage } />
          <Route path='/sign/:tab' Component = { SignUpLogin } />
          <Route path='/welcome' Component = { WelcomePage } />
        </Routes>
    </BrowserRouter>
  )
}


export default App
