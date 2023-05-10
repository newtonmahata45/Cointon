import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import './App.css'

import Homepage from './Pages/Homepage';
import CoinPage from './Pages/CoinPage';


function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' Component = {Homepage}  />
          <Route path='/coins/:id' Component = {CoinPage} />
        </Routes>
    </BrowserRouter>
  )
}


export default App
