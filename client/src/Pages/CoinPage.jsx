import React from "react";
import Header from "../components/Header";
import { CryptoState } from "../CryptoContext";

function CoinPage() {
  // const { currency, symbol, setCurrency } = CryptoState();
  return (
    <div>
      <div>
        <Header />
      </div>
      <div style={{ marginTop: "7rem" }}>
        CoinPage is working
        <button>Parsurama</button>
      </div>
      <div style={{margin:"12% 35%", fontSize:"5rem"}}>
        {window.location.pathname}
      </div>
    </div>
  );
}

export default CoinPage;
