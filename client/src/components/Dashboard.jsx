import React from 'react'

function Dashboard({userProfile}) {
    function name() {
      console.log("x =")
    }
  return (
    <div >
      <h3>Dashboard component</h3>
      {userProfile && userProfile.name}
      <button onClick={name}>tuggale</button>
    </div>
  )
}

export default Dashboard
