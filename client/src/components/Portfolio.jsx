import React from "react";

function Portfolio({ userProfile }) {
  return (
    <div>
      <h3>Portfolio component</h3>
      {userProfile ? userProfile.name :""}
    </div>
  );
}

export default Portfolio;
