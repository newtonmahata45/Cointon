import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import axios from "axios";
import { TrendingCoins } from "../config/api";
import { numberWithCommas } from "./Banner/Carousal";
const Header = ({theUser}) => {
  let CoinList = TrendingCoins;
  const navigate = useNavigate();
  
  const { currency, symbol, setCurrency } = CryptoState();

  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  // const [loding,setLoding] = useState(false);

  
  const fetchCoins = async () => {
    console.log("theUser=>",theUser)
    // setLoding(true);
    const { data } = await axios.get(CoinList(currency));
    // const data = await CoinList(currency);
    console.log("searcheddata=>", data);
    setCoins(data);
    // setLoding(false);
  };

  // console.log("header coins=>", coins);

  const searchFilter = () => {
    if (!search) return [];
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  useEffect(() => {
    fetchCoins();
  }, [search, currency]);

  function sign(e) {
    if (localStorage.getItem("token")) {
      window.alert("already loged in");
      navigate(`/welcome`);
    } else if (e) navigate(`/sign/in`);
    else navigate(`/sign/up`);
  }

  return (
    <header className="header">
      <div className="container">
        <Link to={"/"} className="homelink">
          <img src="../cointonlogo3.png" className="logoimg" />
          <div className="logoname">
            <h1>Cointon</h1>
            <h1> Cointon</h1>
          </div>
        </Link>
        <div className="menu">
          <a href="#home" className="active">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="input-section">
          <div className="search-bar">
            <i className="fa fa-search"></i>
            <input
              type="search"
              placeholder="Search coins"
              className="search-input"
              id="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
          </div>
          <select
            variant="outlined"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value={"USD"}>$ USD</option>
            <option value={"INR"}>₹ INR</option>
          </select>
        </div>
        {localStorage.getItem("token") ? (
          <div className="profile-section">
            <img src={(theUser && theUser.profileImage) ? theUser.profileImage:"../defaultprofileimg.png"} alt="profile-img"></img>
            {theUser && <p> {theUser.name}</p>}
          </div>
        ) : (
          <div className="sign">
            <button
              className="btn btn-primary sign-btn login"
              onClick={() => sign(true)}
            >
              LogIn
            </button>
            <button
              className="btn btn-primary sign-btn signup"
              onClick={() => sign(false)}
            >
              SignUp
            </button>
          </div>
        )}
      </div> 
	<div style={{width:"100%",background:`${search ? "rgba(0,0,0,0.5)" : "none"}`,minHeight:`${search ? "100vh" : "0"}`}}>
      <div className="search-filter">
        {searchFilter().map((each) => {
          // const profit = each.price_change_percentage_24h >= 0;
          return (
            <Link to={`/coins/${each.id}`} className="coin-bar" key={each.id}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={each.image}
                  style={{ height: "2.7rem", borderRadius: "50%" }}/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>{each.symbol.toUpperCase()}</span>
              </div>
              <div>{each.name}</div>
              <div>
                {symbol} {numberWithCommas(each.current_price.toFixed(2))}
              </div>
            </Link>
          );
        })}
      </div>
	  </div>
    </header>
  );
};

export default Header;


// mongodb+srv://read_only:OxxrqgRYA1PFs0tf@cluster0.k52jp.mongodb.net/ip

// db.balls.aggregate([{$match: {extras_type: "NA"}},{$group: {_id: "$batsman",totalBalls: { $sum: 1 },totalRuns: { $sum: "$batsman_runs" }}},{$addFields: {strikeRate: { $multiply: [{ $divide: ["$totalRuns", "$totalBalls"] }, 100]}}},{$sort: {strikeRate: -1}}]);

// {$project:{totalBalls: { $gte: [ "$totalBalls", 250 ] }}}
