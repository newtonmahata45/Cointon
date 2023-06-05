import axios from "axios";
import React, { useEffect, useState } from "react";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
// import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { numberWithCommas } from "./Banner/Carousal";

function CoinsTable() {
  const [coins, setCoins] = useState([]);
  // const [loding, setLoding] = useState(false);
  const { currency, symbol } = CryptoState();

  const fetchCoins = async () => {
    // setLoding(true);
    // const { data } = await axios.get(CoinList(currency));
    const data = CoinList(currency);
    setCoins(data);
    // setLoding(false);
  };

  // const column = [
  //   {
  //     name: "Coin",
  //     selector: (
  //       row // row.symbol.toUpperCase() +
  //     ) => (
  //       <img
  //         src={row.image}
  //         alt={row.name}
  //         style={{ height: "2.5rem", borderRadius: "50%" }}
  //       />
  //     ),
  //   },
  //   // { name: "Coin",
  //   //   selector:(row) => row.symbol.toUpperCase()
  //   // },
  //   { name: "Price", selector: (row) => symbol + " " + row.current_price },
  //   {
  //     name: "24h Change",
  //     selector: (row) => row.price_change_percentage_24h.toFixed(2) + " %",
  //   },
  //   { name: "Market Cap", selector: (row) => symbol + " " + row.market_cap },
  // ];

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  // console.log("FromTable =>", coins);

  // const customStyles = {
  //   rows: {
  //     style: {
  //       fontSize: "1rem",
  //       fontWeight: "bold",
  //       background: "hsl(252, 30%, 95%)",
  //       border: "1px solid black",
  //       paddingLeft: "10%",
  //     },
  //   },
  // };

  // return (
  //   <div>
  //     <div
  //       style={{
  //         textAlign: "center",
  //         marginTop: "2rem",
  //         // padding: "2rem 0",
  //         height: "100%",
  //       }}
  //     >
  //       <h2 style={{ background: "white", fontFamily: "monospace" }}>
  //         Cryptocurrency Prices by Market Cap
  //       </h2>
  //       <DataTable
  //         columns={column}
  //         data={coins}
  //         pagination
  //         fixedHeader
  //         fixedHeaderScrollHeight="550px"
  //         customStyles={customStyles}
  //         onRowClicked= {(row)=><Link to={`/coins/${row.id}`} /> }
  //       ></DataTable>
  //     </div>
  //   </div>
  // );

  // const goto = () => {
  //   console.log("NEwton");
  //   <Link to={`/coins/${"row.id"}`}></Link> ;
  // };
  // console.log(window.location.href)

  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          // alignItems: "center",
        }}
      >
        <h2
          style={{
            color: "var(--color-primary)",
            fontFamily: "monospace",
            padding: "0.5rem",
          }}
        >
          Cryptocurrency Prices by Market Cap
        </h2>
        <table className="table">
          <thead>
            <tr className="thead">
              <th>Coin</th>
              <th>Name</th>
              <th>Price</th>
              <th>24h Change</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((each) => {
              return (
                <tr
                  className="table-row"
                  onClick={() => navigate(`/coins/${each.id}`)}
                  key={each.id}
                >
                  <td>
                    <img
                      src={each.image}
                      alt={each.name}
                      style={{ height: "2.5rem", borderRadius: "50%" }}
                    />
                  </td>
                  <td className="table-coin-name"> {each.name} </td>
                  <td>
                    {symbol} {numberWithCommas(each.current_price.toFixed(2))}
                  </td>
                  <td>{each.price_change_percentage_24h.toFixed(2)} %</td>
                  <td>dummy2</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CoinsTable;
