import React, { useState } from "react";

import "./SignUpLogin.css"; // Import the CSS file for styling
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
let url = "http://localhost:3001";

const SignUpLogin = () => {
const navigate = useNavigate();
  if(localStorage.getItem("token")){
    navigate(`/welcome`);
  }
  let { tab } = useParams();
  let up = tab == "in" ? false : true;

  const [isSignUp, setIsSignUp] = useState(up); // State to toggle between sign up and login

  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    referCode: "",
  });

  const handleTabToggle = () => {
    setIsSignUp(!isSignUp);
  };
  const [eye, setEye] = useState(true);
  const handleEye = () => {
    setEye(!eye);
  };

  async function submit(e) {
    e.preventDefault();
    const { name, phone, email, password, referCode } = user;
    // console.log("bo", user);
    // const res = await axios.post(`${url}register`,{name, phone, email, password, referCode})
    if (isSignUp) {
      try {
        const res = await axios.post(`${url}/register`, {
          name,
          phone,
          email,
          password,
          referCode,
        });
        // const res = await fetch(`${url}register`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ name, phone, email, password, referCode }),
        // });10
        // const createdUser = await res.json();

        // window.alert("Success");

        // console.log("sign up responce => ", createdUser.status);

        if (res.status == 201) {
          window.alert(res.data.message);
          setUser({
            name: "",
            phone: "",
            email,
            password,
            referCode: "",
          });
          handleTabToggle();
        }
      } catch (err) {
        console.log("result",err.response.data.message);
        window.alert(err.response.data.message);
      }
    } else {
      // When Login button Clicked
      console.log("headd");
      try{
      const res = await axios.post(`${url}/login`, { email, password });
      // const res = await fetch(`${url}login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // const loginUser = await res.json();

      console.log("login responce=>", res.status);

      if (res.data.token) {
        localStorage.setItem("token", JSON.stringify(res.data.token));
        navigate(`/welcome`);
      }
     }catch(err) {
        console.log("the login error =>",err.response.data.message);
        window.alert(err.response.data.message);
      }
    }
  }

  function handle(e) {
    const newUser = { ...user };
    newUser[e.target.id] = e.target.value;
    setUser(newUser);
    console.log(newUser);
  }
  return (
    <div className="body">
      {/* <div className="background">0</div> */}
      <div className="container">
        {/* <div className="card"> */}
        <div className="drop">
          <div className="content">
            <div className="tabs">
              <div
                className={`tab ${isSignUp ? "active" : "inactive"}`}
                onClick={handleTabToggle}
              >
                <h2>Sign up</h2>
              </div>
              <div
                className={`tab ${!isSignUp ? "activ" : "inactiv"}`}
                onClick={handleTabToggle}
              >
                <h2>Log in</h2>
              </div>
            </div>
            <form className="form" onSubmit={(e) => submit(e)}>
              {/* Sign Up Form */}
              {isSignUp && (
                <React.Fragment>
                  <div className="inputs">
                    <div className="input">
                      <input
                        onChange={(e) => handle(e)}
                        value={user.name}
                        type="text"
                        placeholder="Full Name"
                        id="name"
                        required
                      />
                    </div>
                    <div className="input">
                      <input
                        onChange={(e) => handle(e)}
                        value={user.phone}
                        type="text"
                        placeholder="Mobile Number"
                        id="phone"
                        required
                      />
                    </div>
                    <div className="input">
                      <input
                        onChange={(e) => handle(e)}
                        value={user.email}
                        type="email"
                        placeholder="Email"
                        id="email"
                        required
                      />
                    </div>
                    <div className="input">
                      <input
                        onChange={(e) => handle(e)}
                        value={user.password}
                        type={eye ? "password" : "text"}
                        placeholder="Password"
                        id="password"
                        required
                      />
                      <i
                        className={eye ? "fa fa-eye-slash" : "fa fa-eye"}
                        onClick={handleEye}
                      ></i>
                    </div>
                    <div className="input">
                      <input
                        onChange={(e) => handle(e)}
                        value={user.referCode}
                        type="text"
                        placeholder="Refer Code"
                        id="referCode"
                      />
                    </div>
                  </div>
                  <button type="submit">Sign up</button>
                </React.Fragment>
              )}
              {/* Login Form */}
              {!isSignUp && (
                <React.Fragment>
                  <div className="inputs">
                    <div className="input">
                      <input
                        onChange={(e) => handle(e)}
                        value={user.email}
                        type="email"
                        placeholder="Email"
                        id="email"
                        required
                      />
                    </div>
                    <div className="input">
                      <input
                        onChange={(e) => handle(e)}
                        value={user.password}
                        type={eye ? "password" : "text"}
                        placeholder="Password"
                        id="password"
                        required
                      />
                      <i
                        className={eye ? "fa fa-eye-slash" : "fa fa-eye"}
                        onClick={handleEye}
                      ></i>
                    </div>
                  </div>
                  <button type="submit">Log In </button>
                </React.Fragment>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}; //name, phone, email, password, city, referCode

export default SignUpLogin;
