import React from 'react';
import Banner from './Banner/Banner';
import CoinsTable from './CoinsTable';

function Dashboard({userProfile}) {
    function name() {
      console.log("x =")
    }
  return (
    <div className='dashboard'style={{width: "880px"}}>
      <h3>Dashboard component</h3>
      {userProfile && userProfile.name}
      <Banner/>
      <button onClick={name}>tuggale</button>
      <CoinsTable />
    </div>
  )
}

export default Dashboard
