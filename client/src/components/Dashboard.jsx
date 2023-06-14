import React,{useState,useEffect} from 'react';
import CoinsTable from './CoinsTable';
import { CryptoState } from "../CryptoContext";
import { CoinList } from "../config/api";
import "../style/dashboard.css"
import TradingViewWidget from './TradingViewWidget';
import Carousal from './Banner/Carousal';



function Dashboard({userProfile}) {
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
    useEffect(() => {
    fetchCoins();
  }, [currency]);
  return (
    <div className='dashboard'>
	  <div className="landing">
        <TradingViewWidget/>
	    <section> 
			<div className="top-gainers">
				<h4>Top Gainers</h4>
				{coins.sort((a,b) => b.price_change_percentage_24h - a.price_change_percentage_24h).map((each)=>{
					return (
					<div key={each.id}>{each.name} {each.price_change_percentage_24h}</div>
					)
				}).splice(0,5)}
			</div>
			<div className="top-loosers" >
				<h4>Top Loosers</h4>
				{coins.sort((a,b) => a.price_change_percentage_24h - b.price_change_percentage_24h).map((each)=>{
					return (
					<div key={each.id}>{each.name} {each.price_change_percentage_24h}</div>
					)
				}).splice(0,5)}
			</div>
			
		</section>
	  
	  </div>
      <Carousal/>
      <CoinsTable />
    </div>
  )
}

export default Dashboard
