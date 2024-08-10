import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Favorites from "../components/Favorites";
import Portfolio from "../components/Portfolio";
import Funds from "../components/Funds";
import Dashboard from "../components/Dashboard";
import "./welcome.css";
import { CryptoState } from "../CryptoContext";
import Header from "../components/Header";
let url = "https://cointon-newtonmahata45.vercel.app"; //"http://localhost:3001";

function WelcomePage() {
  const [search, setSearch] = useState("");
  const { currency, symbol, setCurrency } = CryptoState();
  const navigate = useNavigate();
  const userProfile = useLocation().state;
  const [activComponent, setActiveComponent] = useState(<Dashboard userProfile={userProfile} />);

  console.log("props =>", userProfile);
  // console.log("activComponent  =>",activComponent)
  // useEffect(() => {
  //   if(!userProfile || !localStorage.getItem("token")) navigate(`/sign/in`);
  // }, []);

  // console.log("token from WC page ", localStorage);

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
    window.alert("logout successfull");
  }
	function checked(){
		console.log("cheaking...")
	}
  // function active(e) {
  //   setActiveComponent(e.target.value);
  // }
  return (
    <div className="welcome" onClick={checked()}>
      <nav className="navbar">
        <Header theUser={userProfile}/>
      </nav>

      <div className="content">
        <aside className="menu">
          <ul>
            <li
              onClick={() =>
                setActiveComponent(<Dashboard userProfile={userProfile} />)
              }
            >
              <i className="fa-solid fa-trowel-bricks fa-flip-horizontal"></i>
              <span> Dashboard</span>
            </li>
            <li
              onClick={() =>
                setActiveComponent(<Portfolio userProfile={userProfile} />)
              }
            >
              <i className="fa-solid fa-briefcase"></i>
              <span> Portfolio</span>
            </li>
            <li
              onClick={() =>
                setActiveComponent(<Favorites userProfile={userProfile} />)
              }
            >
              <i className="fa-solid fa-heart"></i>
              <span> Favorites</span>
            </li>
            <li
              onClick={() =>
                setActiveComponent(<Funds userProfile={userProfile} />)
              }
            >
              <i className="fa-solid fa-wallet"></i>
              <span> Funds</span>
            </li>
            <li onClick={logout} className="logout">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span> Logout</span>
            </li>
          </ul>
        </aside>
        <main className="main">{activComponent}</main>
      </div>
      {/* <button onClick={logout}>Logout</button>
      <button onClick={getProfile}>Get Profile</button> */}
    </div>
  );
}

export default WelcomePage;
