import React from 'react'

function Favorites({ userProfile }) {
  return (
    <div>
      <h3>Favorites component</h3>
      {(userProfile && userProfile.favorites.length == 0) ? 
      <p>You have not added coins in Favorites</p> : 
      (userProfile && userProfile.favorites) ? 
      userProfile.favorites.map((fav) => {return (<p>{fav}</p>)}) : ""}
    </div>
  )
}

export default Favorites

