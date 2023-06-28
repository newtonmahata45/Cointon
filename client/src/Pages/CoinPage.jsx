import React, { useState, useEffect } from "react";
import axios from "axios";
import { CryptoState } from "../CryptoContext";
import { useParams } from "react-router-dom";
import { SingleCoin } from "../config/api";
import Header from "../components/Header";
import CoinInfo from "../components/CoinInfo";
import "../style/coinpage.css"

function CoinPage() {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const { currency, symbol } = CryptoState();
  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data)
  }
  // console.log(coin)
  useEffect(() => { fetchCoin() }, [])
  return (
    <div>
      <Header />
      <div className="container">
        <div className="sidebar">
          <img src={coin?.image.large} alt={coin?.name} height="200" style={{ marginBottom: 20 }} />
          <h3>{coin?.name}</h3>
          <div className="description">
            {/*ReactHtmlParser(coin?.description.en.split(". ")[0])*/}
          </div>
          <div className="marketdata">
            <span style={{ display: "flex" }} >
              <h5 className="heading">Rank: </h5>
              &nbsp;&nbsp;
              <h5 style={{ fontFamily: "Montserrat" }}></h5>
            </span>
          </div>
        </div>
        <CoinInfo coin={coin} />
      </div>

    </div>
  );
}

export default CoinPage;
