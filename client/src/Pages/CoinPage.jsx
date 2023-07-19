import React, { useState, useEffect } from "react";
import axios from "axios";
import { CryptoState } from "../CryptoContext";
import { useNavigate, useParams } from "react-router-dom";
import { SingleCoin } from "../config/api";
import Header from "../components/Header";
import CoinInfo from "../components/CoinInfo";
import "../style/coinpage.css";
let url = "https://cointon-newtonmahata45.vercel.app";


function CoinPage() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const [coinprice,setCoinprice]=useState();
  // const [buy,setBuy] = useState(true)
  const [trade, setTrade] = useState({leverage:1,quantity:1, buyAt:false, sellAt:false, symbol:id});
  const { currency } = CryptoState();
  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id,currency));
    setCoin(data);
    const coinx = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${currency.toLowerCase()}`
    )
    setCoinprice(coinx["data"][`${id}`][`${currency.toLowerCase()}`])
  };

  useEffect(() => {
    fetchCoin();
  }, []);
  console.log("coin",coin)
  console.log("coinp",coinprice,id)

  async function submit(e) {
    e.preventDefault();
    if(!localStorage.getItem("token"))navigate("/login");
    const { leverage, quantity, buyAt,sellAt,symbol } = trade;
    axios
    .post(`${url}/createtrade`, trade,{headers: {
      'Content-Type': 'application/json',
      "x-api-key": localStorage.getItem("token")
  }})
    .then((res) => {
      console.log("login responce=>", res);
      if (res) {
        window.alert(res.data.message);
      }
    }).catch((err)=>{
      console.log(err);
      err.response? window.alert(err.response.data.message): window.alert(err.message);
    })
  }


  function handle(e) {
    const newTrade = { ...trade };
    newTrade[e.target.id] = +e.target.value;
    setTrade(newTrade);
    console.log(newTrade);
  }
  return (
    <div>
      {/* <Header /> */}
      <div className="container">
        <div className="sidebar">
          <img
            src={coin?.image.large}
            alt={coin?.name}
            height="200"
            style={{ marginBottom: 20 }}
          />
          <h3>{coin?.name}</h3>
          <div className="description">
            {/*ReactHtmlParser(coin?.description.en.split(". ")[0])*/}

          </div>
          <div className="marketdata">
            <span style={{ display: "flex" }}>
              <h5 className="heading">Rank: </h5>
              &nbsp;&nbsp;
              <h5 style={{ fontFamily: "Montserrat" }}>{coin?.coingecko_rank}</h5>
            </span>
          </div>
          {coinprice && <h4>Price: {coinprice}</h4>}
        </div>
        <CoinInfo coin={coin} />
      </div>
      <div>
        <form action="" onSubmit={(e) => submit(e)}>
          <p>Leverage: </p>
          <input
            type="number"
            onChange={(e) => handle(e)}
            value={trade.leverage}
            id="leverage"
          ></input>
          <p>Quantity: </p>
          <input
            type="number"
            onChange={(e) => handle(e)}
            value={trade.quantity}
            id="quantity"
          ></input>
          <div>
          <button type="submit" onClick={()=>{trade.buyAt = true; trade.sellAt = false}}>buy</button>
          <button type="submit" onClick={()=>{trade.sellAt = true;trade.buyAt = false;}}>sell</button>
        </div>
        </form>
      </div>
    </div>
  );
}

export default CoinPage;
