import React, { useEffect, useState } from "react";

import "./SignUpLogin.css"; // Import the CSS file for styling
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
let url = "https://cointon-newtonmahata45.vercel.app";
//"http://localhost:3001";

const SignUpLogin = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (localStorage.getItem("token")) navigate(`/welcome`);
  // }, []);
  let { tab } = useParams();
  let up = tab == "in" ? false : true;

  const [isSignUp, setIsSignUp] = useState(up); // State to toggle between sign up and login;
  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    referCode: "",
  });
  const [eye, setEye] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabToggle = () => {
    setIsSignUp(!isSignUp);
  };
  const handleEye = () => {
    setEye(!eye);
  };

  async function submit(e) {
    e.preventDefault();
    const { name, phone, email, password, referCode } = user;
    if (isSignUp) {
      setIsLoading(true)
      axios
        .post(`${url}/register`, {
          name,
          phone,
          email,
          password,
          referCode,
        })
        .then((res) => {
          setIsLoading(false)
          window.alert(res.data.message);
          setUser({
            name: "",
            phone: "",
            email,
            password,
            referCode: "",
          });
          setEye(false);
          handleTabToggle();
        })
        .catch((err) => {
          setIsLoading(false)
          console.log(err);
          err.response ? window.alert(err.response.data.message) : window.alert(err.message);
        });
    } else {
      // When Login button Clicked
      console.log("Login button Clicked");
      setIsLoading(true)
      await axios
        .post(`${url}/login`, { email, password })
        .then((res) => {
          setIsLoading(false)
          console.log("login responce=>", res);
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            window.alert(res.data.message);
            navigate(`/welcome`, { state: res.data.userDetail });
          }
        })
        .catch((error) => {
          setIsLoading(false)
          console.log(error);
          error.response ? window.alert(error.response.data.message) : window.alert(error.message);
        });
    }
  }

  function handle(e) {
    const newUser = { ...user };
    newUser[e.target.id] = e.target.value;
    setUser(newUser);
    console.log(    newUser);
  }
  return (
    <div className="body">
      {isLoading
        ? <div className="spinner-container">
          <div className="loading-spinner"></div>
        </div> :
        <div className="container">
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
        </div>}
    </div>
  );
}; //name, phone, email, password, city, referCode

export default SignUpLogin;
