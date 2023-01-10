import React, { useRef, useState } from "react";
import Button from "../components/Utils/ButtonMain";
import ForgotPassword from "../components/Utils/forgotPassword";
import Header from "../components/Utils/header";
import Loading from "../components/Utils/Loading";
import "../Styles/Login.scss";

export default function LoginPage(props) {
  const [body, updateBody] = useState({
    Email: null,
    Password: null,
  });
  const [isError, setIsError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toggleForgotPassword, showForgotPassword] = useState(false);

  const rfEmail = useRef();
  const rfPassword = useRef();

  const login = () => {
    let d = body;
    d.Email = rfEmail.current.value.toLowerCase().trim();
    d.Password = rfPassword.current.value;
    updateBody(d);
    setIsError("");

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const validatePassword = (password) => {
      return password.length >= 6;
    };

    if (!validateEmail(body.Email))
      return setIsError("Please enter a valid email address!");
    if (!validatePassword(body.Password))
      return setIsError("Password must be at least 6 characters!");

    if (validateEmail(body.Email) && validatePassword(body.Password)) {
      setIsLoading(true);
      fetch("/api/auth/login", {
        method: "post",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else throw Error("Login Failed");
        })
        .then((data) => {
          console.log(data);
          setIsLoading(false);
          if (data.success) {
            localStorage.setItem("token", data.token);
            window.location.href = "/admin";
          } else {
            setIsError(data.error);
          }
        })
        .catch((err) => {
          console.log(err);
          localStorage.clear();
          setIsLoading(false);
          setIsError("Login Failed!");
        });
    }
  };

  return (
    <div className="MainsContent">
      <Header active="Admin" />
      <div className="login">
        <div className="overlay">
          <div className="container">
            <div className="rowItems">
              <div className="columnLeft">
                <h3>Admin Portal</h3>
                <h5>
                  Welcome to the Admin Page of Brooke EA GIS Portal. Please
                  login to publish data and administer the Portal.
                </h5>
                <p>
                  Powered by{" "}
                  <a href="https://neatline.co.ke" target="_blank">
                    Neatline Consultancy.
                  </a>
                </p>
              </div>
              <div className="columnRight">
                {toggleForgotPassword && (
                  <ForgotPassword showForgotPassword={showForgotPassword} />
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault(e);
                  }}
                >
                  <h5>Get Started</h5>
                  <span className="err">{isError}</span>
                  <p id="label">Email Address *</p>
                  <input
                    ref={rfEmail}
                    type="email"
                    label="Email Address"
                    placeholder="Enter Email Address"
                  />
                  <p id="label">Password *</p>
                  <input
                    ref={rfPassword}
                    type="password"
                    placeholder="Enter Password"
                  />
                  <p>
                    Forgot password?{" "}
                    <span
                      onClick={() => {
                        showForgotPassword(true);
                      }}
                    >
                      Click Here
                    </span>
                  </p>
                  <Button
                    handleClick={() => {
                      login();
                    }}
                    label="Login"
                  />
                </form>
              </div>
            </div>
            {isLoading && <Loading />}
          </div>
        </div>
      </div>
    </div>
  );
}
