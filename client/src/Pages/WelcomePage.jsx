import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function WelcomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate(`/sign/in`);
  }, []);



  // console.log("token from WC page ", localStorage);

  function logout() {
    localStorage.removeItem("token");
    window.alert("logout successfull");
    navigate("/");
  }

  async function getProfile(){
    let profile = await axios.get("http://localhost:3001/profile",{"x-api-key":0},{"x-api-key":1})
    if(profile.data.message)window.alert(profile.data.message)
    console.log("Profile :", profile)
  }


  return (
    <div>
      Welcome page
      <button onClick={logout}>Logout</button>
      <button onClick= {getProfile} >Get Profile</button>
    </div>
  );
}

export default WelcomePage;
