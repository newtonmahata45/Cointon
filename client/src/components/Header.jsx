import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
// import axios from "axios";
import { CoinList } from "../config/api";
import { numberWithCommas } from "./Banner/carousal";

const Header = () => {
  const { currency, symbol, setCurrency } = CryptoState();

  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  // const [loding,setLoding] = useState(false);

  const fetchCoins = async () => {
    // setLoding(true);
    // const { data } = await axios.get(CoinList(currency));
    const data = CoinList(currency);
    // console.log("searcheddata=>", data);
    setCoins(data);
    // setLoding(false);
  };

  console.log("coins=>", coins);

  // let endPoint = window.location.pathname; //.slice(-1)

  // let [goToHome, setGoToHome] = useState(false);

  // function gohome() {
  //   // if (goToHome) {
  //     if (endPoint == "/") {
  //       window.location.reload(false);
  //     } else return <Navigate to="/" />;
  //   // }
  // }
  const searchFilter = () => {
    if (!search) return [];
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  useEffect(() => {
    // if(goToHome){
    //   gohome();
    // }
    // else
    fetchCoins();
  }, [search, currency]);

  return (
    <>
      <header className="header">
        <div className="container">
          <Link className="logo" to={"/"}>
            <h1>Cointon</h1>
            <h1> Cointon</h1>
          </Link>
          <div className="search-bar">
            <i
              className="fa fa-search"
              style={{ color: "var(--color-primary)" }}
            ></i>
            <input
              type="search"
              placeholder="Search coins here"
              className="search-input"
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
          <div className="sign">
            <button className="btn btn-primary sign-btn login">LogIn</button>
            <button className="btn btn-primary sign-btn signup">SignUp</button>
          </div>
        </div>

        <div className="search-filter">
          {searchFilter().map((each) => {
            // const profit = each.price_change_percentage_24h >= 0;
            return (
              <Link to={`/coins/${each.id}`} className="coin-bar" key={each.id}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={each.image}
                    alt={each.name}
                    style={{ height: "2.7rem", borderRadius: "50%" }}
                  />
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
      </header>
    </>
  );
};

export default Header;

// mongodb+srv://read_only:OxxrqgRYA1PFs0tf@cluster0.k52jp.mongodb.net/ip

// db.balls.aggregate([{$match: {extras_type: "NA"}},{$group: {_id: "$batsman",totalBalls: { $sum: 1 },totalRuns: { $sum: "$batsman_runs" }}},{$addFields: {strikeRate: { $multiply: [{ $divide: ["$totalRuns", "$totalBalls"] }, 100]}}},{$sort: {strikeRate: -1}}]);

// {$project:{totalBalls: { $gte: [ "$totalBalls", 250 ] }}}