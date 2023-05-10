import React from 'react'

import Banner from '../components/Banner/Banner'
import Header from "../components/Header";
import "../Home.css"
import CoinsTable from '../components/CoinsTable';


const Homepage = () => {
    return (
        <div className='home'>
            <div>
                <Header />
            </div>
            <div className='banner' style={{  }}>
                <Banner />
            </div>
            <div>
                <CoinsTable/>
            </div>
        </div>
    )
}


export default Homepage