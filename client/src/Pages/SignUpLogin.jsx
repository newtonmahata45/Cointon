import React, { useState } from "react";

import "./SignUpLogin.css"; // Import the CSS file for styling
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

let url = "http://localhost:3001/";

const SignUpLogin = () => {
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
    setEye(!eye)
  }
  "fa fa-eye-slash"
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const { name, phone, email, password, referCode } = user;
    // console.log("bo", user);
    // const res = await axios.post(`${url}register`,{name, phone, email, password, referCode})
    if (isSignUp) {
      const res = await axios.post("http://localhost:3001/register", {
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
      // });
      // const createdUser = await res.json();

      // window.alert("Success");

      console.log("responce => ", res.status);

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
      } else {
        window.alert(res.data.message);
      }
    } else {
      // When Login button Clicked

      const res = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });
      // const res = await fetch(`${url}login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // const loginUser = await res.json();

      console.log("login responce", res);
      console.log("headd");
      if (res.data.token) {
        localStorage.setItem("token", JSON.stringify(res.data.token));
        navigate(`/welcome`);
      } else {
        window.alert(res.data.message);
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
      <div className="container">
        {/* <div className="card"> */}
        <div className="drop">
          <div className="content">
            <div className="tabs">
              <div
                className={`tab ${isSignUp ? "active" : "inactive"}`}
                onClick={handleTabToggle}
              >
                <h2>Sign Up</h2>
              </div>
              <div
                className={`tab ${!isSignUp ? "activ" : "inactiv"}`}
                onClick={handleTabToggle}
              >
                <h2>Login</h2>
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
                        placeholder="Name"
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
                      /><i className={eye ? "fa fa-eye-slash" : "fa fa-eye"} onClick={handleEye}></i>
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
                    <button type="submit">Sign Up</button>
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
                      /><i className={eye ? "fa fa-eye-slash" : "fa fa-eye"}  onClick={handleEye}></i>
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
