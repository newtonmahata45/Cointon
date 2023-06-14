import React, { useState } from "react";
import Banner from "../components/Banner/Banner";
import Header from "../components/Header";
import "../Home.css";
import CoinsTable from "../components/CoinsTable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
let url = "https://cointon-newtonmahata45.vercel.app"; 
          //"http://localhost:3001";

const Homepage = () => {
  let navigate = useNavigate();
  
  async function getStart() {
    try {
      if (!localStorage.getItem("token")) return navigate(`/sign/in`);
      
      let userProfile = await axios.get(`${url}/profile`, { headers: { "x-api-key": localStorage.getItem("token") }});
      console.log("profile=>",userProfile.data.userDetail)
      navigate(`/welcome`, { state: userProfile.data.userDetail });
    } catch (err) {
        err.response ? window.alert(err.response.data.message): window.alert(err.message);
    }
  }

  function color(e) {
    document.documentElement.style.setProperty("--color-primary", e);
  }
  return (
    <div className="home">
      <Header />
      <div className="landing">
        {/* <div className="home-bg"> */}
        {/* <img src="../cryptocurrencylanding-page.jpeg" className="hidden-bg" /> */}
        <img src="../ethimg.png" alt="gold-eth" className="gold-eth" />
        <div className="landing-text">
          <div>
            <h1>Crypto Currency Web App for Paper Trading </h1>
            <article>
              It is just a web application to pactice trading on crypto. So
              don't worry there are no payments required. Buy & sell crypto easy
              and fast with us.
            </article>
          </div>
          <button className="get-started" onClick={getStart}> Get Started </button>
        </div>
      </div>
      <div className="banner">
        {/* <Banner /> */}
      </div>
      <div>
        <button onClick={() => color("green")}>green color</button>
        <button onClick={() => color("purple")}>purple color</button>
        <button onClick={() => color("orange")}>orange color</button>
        <button onClick={() => color("blue")}>blue color</button>
      </div>
      {/* <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus
        possimus magnam distinctio nostrum esse iste, natus voluptatem repellat
        nobis libero soluta similique deleniti sint explicabo quisquam eligendi
        temporibus sequi nesciunt. Lorem, ipsum dolor sit amet consectetur
        adipisicing elit. Repellendus possimus magnam distinctio nostrum esse
        iste, natus voluptatem repellat nobis libero soluta similique deleniti
        sint explicabo quisquam eligendi temporibus sequi nesciunt. Lorem, ipsum
        dolor sit amet consectetur adipisicing elit. Repellendus possimus magnam
        distinctio nostrum esse iste, natus voluptatem repellat nobis libero
        soluta similique deleniti sint explicabo quisquam eligendi temporibus
        sequi nesciunt. Lorem, ipsum dolor sit amet consectetur adipisicing
        elit. Repellendus possimus magnam distinctio nostrum esse iste, natus
        voluptatem repellat nobis libero soluta similique deleniti sint
        explicabo quisquam eligendi temporibus sequi nesciunt. Lorem, ipsum
        dolor sit amet consectetur adipisicing elit. Repellendus possimus magnam
        distinctio nostrum esse iste, natus voluptatem repellat nobis libero
        soluta similique deleniti sint explicabo quisquam eligendi temporibus
        sequi nesciunt. Lorem, ipsum dolor sit amet consectetur adipisicing
        elit. Repellendus possimus magnam distinctio nostrum esse iste, natus
        voluptatem repellat nobis libero soluta similique deleniti sint
        explicabo quisquam eligendi temporibus sequi nesciunt. Lorem, ipsum
        dolor sit amet consectetur adipisicing elit. Repellendus possimus magnam
        distinctio nostrum esse iste, natus voluptatem repellat nobis libero
        soluta similique deleniti sint explicabo quisquam eligendi temporibus
        sequi nesciunt. Lorem, ipsum dolor sit amet consectetur adipisicing
        elit. Repellendus possimus magnam distinctio nostrum esse iste, natus
        voluptatem repellat nobis libero soluta similique deleniti sint
        explicabo quisquam eligendi temporibus sequi nesciunt. Lorem, ipsum
        dolor sit amet consectetur adipisicing elit. Repellendus possimus magnam
        distinctio nostrum esse iste, natus voluptatem repellat nobis libero
        soluta similique deleniti sint explicabo quisquam eligendi temporibus
        sequi nesciunt. Lorem, ipsum dolor sit amet consectetur adipisicing
        elit. Repellendus possimus magnam distinctio nostrum esse iste, natus
        voluptatem repellat nobis libero soluta similique deleniti sint
        explicabo quisquam eligendi temporibus sequi nesciunt. Lorem, ipsum
        dolor sit amet consectetur adipisicing elit. Repellendus possimus magnam
        distinctio nostrum esse iste, natus voluptatem repellat nobis libero
        soluta similique deleniti sint explicabo quisquam eligendi temporibus
        sequi nesciunt. Lorem, ipsum dolor sit amet consectetur adipisicing
        elit. Repellendus possimus magnam distinctio nostrum esse iste, natus
        voluptatem repellat nobis libero soluta similique deleniti sint
        explicabo quisquam eligendi temporibus sequi nesciunt. Lorem, ipsum
        dolor sit amet consectetur adipisicing elit. Repellendus possimus magnam
        distinctio nostrum esse iste, natus voluptatem repellat nobis libero
        soluta similique deleniti sint explicabo quisquam eligendi temporibus
        sequi nesciunt. Lorem, ipsum dolor sit amet consectetur adipisicing
        elit. Repellendus possimus magnam distinctio nostrum esse iste, natus
        voluptatem repellat nobis libero soluta similique deleniti sint
        explicabo quisquam eligendi temporibus sequi nesciunt. Lorem, ipsum
        dolor sit amet consectetur adipisicing elit. Repellendus possimus magnam
        distinctio nostrum esse iste, natus voluptatem repellat nobis libero
        soluta similique deleniti sint explicabo quisquam eligendi temporibus
        sequi nesciunt. Lorem, ipsum dolor sit amet consectetur adipisicing
        elit. Repellendus possimus magnam distinctio nostrum esse iste, natus
        voluptatem repellat nobis libero soluta similique deleniti sint
        explicabo quisquam eligendi temporibus sequi nesciunt. Lorem, ipsum
        dolor sit amet consectetur adipisicing elit. Repellendus possimus magnam
        distinctio nostrum esse iste, natus voluptatem repellat nobis libero
        soluta similique deleniti sint explicabo quisquam eligendi temporibus
        sequi nesciunt. Lorem, ipsum dolor sit amet consectetur adipisicing
        elit. Repellendus possimus magnam distinctio nostrum esse iste, natus
        voluptatem repellat nobis libero soluta similique deleniti sint
        explicabo quisquam eligendi temporibus sequi nesciunt.
      </p> */}
	   {/* <CoinsTable /> */}
       
    </div>
  );
};
export default Homepage;
