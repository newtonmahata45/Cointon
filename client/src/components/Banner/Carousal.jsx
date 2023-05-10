import React, { useEffect, useState } from 'react';;
import axios from 'axios';
import { TrendingCoins } from "../../config/api";
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';
import { CryptoState } from '../../CryptoContext';

// axios.request(options).then(function (response) {
//     console.log(response.data);
// }).catch(function (error) {
//     console.error(error);
// });
// const options = {
//     method: 'GET',
//     url: 'https://coinranking1.p.rapidapi.com/coin/Qwsogvtv82FCd/ohlc',
//     params: {
//         referenceCurrencyUuid: 'yhjMzLPhuIDl',
//         search: '',
//         limit: '10'
//     },
//     headers: {
//         'X-RapidAPI-Key': '3a3e31a429msh8f30e4f835682c1p10c6e4jsne84db28887f1',
//         'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
//     }
// };


export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
const Carousal = () => {
    const { currency, symbol, setCurrency } = CryptoState();
    
    const [tranding, setTranding] = useState([]);
    
    const fetchTrandingCoins =  () => { 
        // const { data } = await axios.get(TrendingCoins(currency));
        const  data  =  TrendingCoins(currency);
        // // let result = await axios.get("https://api.coingecko.com/api/v3/coins/");
        // // let result = await axios.request(options);
        // // let data = result.data.data.coins
        console.log(data)
        setTranding(data)
    };
    useEffect(() => {
        
        console.log("Krishna");
        fetchTrandingCoins();
    }, [currency]);

    let items = tranding.map((coin) => {

        let profit = coin.price_change_percentage_24h >= 0;

        return (
            <div>
                <Link className='corousel-item' to={`/coins/${coin.id}`}>
                    <img
                        src={coin?.image}
                        alt={coin.name}
                    />
                    <span>{coin?.symbol}
                    &nbsp;&nbsp;
                    <span
                    style={{color: profit  ? "rgb(1, 194, 10)": "red" }}>
                         {profit && "+"}{coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color:"navy" }}>
                        {symbol} {numberWithCommas(coin.current_price.toFixed(2))}
                    </span>
                </Link>
            </div>
        )
    })

    const responsive = { 
        0: { items: 2 },
        512: { items: 4 }
    }
    return (
        <div className='carousel'> 
            <AliceCarousel
                mouseTracking
                infinite
                autoPlayInterval={1000}
                animationDuration={1500}
                disableDotsControls
                disableButtonsControls
                responsive={responsive}
                
                autoPlay
                items={items}
            />
        </div>

    )
}

export default Carousal
