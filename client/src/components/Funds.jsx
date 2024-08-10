import React from 'react'

function Funds({userProfile}) {
  return (
    <div>
      <h3>Funds component</h3>
      {userProfile ? <p>Your available Fund is {userProfile.fund}</p> : ""}
    </div>
  )
}

export default Funds
