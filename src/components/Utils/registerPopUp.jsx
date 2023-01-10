import React, { useRef, useState } from "react";
import InputMap from "../maps/InputMap";
import Button from "./ButtonMain";
import Loading from "./Loading";

export default function RegisterPopUp(props) {
  const [isError, setIsError] = useState("");
  const [body, updateBody] = useState({
    Email: null,
    Password: null,
    cPassword: null,
    Phone: null,
    Name: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const rfEmail = useRef();
  const rfPassword = useRef();
  const rfcPassword = useRef();
  const rfName = useRef();
  const rfPhone = useRef();

  const loginUser = () => {
    let d = body;
    d.Email = rfEmail.current.value.toLowerCase().trim();
    d.Name = rfName.current.value;
    d.Phone = rfPhone.current.value;
    d.Password = rfPassword.current.value;
    d.cPassword = rfcPassword.current.value;
    updateBody(d);
    setIsError("");
    if (!body.Name) return setIsError("Name is required!");
    if (!body.Phone || body.Phone?.length < 11)
      return setIsError("Phone is required! include country code e.g 254790123123");
    if (!validateEmail(body.Email))
      return setIsError("Please enter a valid email address!");
    if (!validatePassword(body.Password))
      return setIsError("Password must be at least 6 characters!");
    if (body.Password !== body.cPassword)
      return setIsError("Passwords do not match")
    if (validateEmail(body.Email) && validatePassword(body.Password)) {
      setIsLoading(true);
      fetch("/api/users/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else throw Error("Registration failed!!");
        })
        .then((data) => {
          setIsLoading(false);
          if (data.success) {
            setIsError(data.success);
            localStorage.setItem("cilbup_ksa", data.token);
            props.setIsAuthenticated(true);
            props.setToggleRegister(false);
          } else {
            setIsError(data.error);
            props.setIsAuthenticated(false);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
          setIsError("Registration failed!");
        });
    }
  };

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

  return (
    <div className="login">
      <div className="container">
        <h3>Register</h3>
        <h4>{isError}</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <InputMap
            ref={rfName}
            label="Full Name *"
            type="text"
            placeholder="Enter your full name"
          />
          <InputMap
            ref={rfPhone}
            label="Phone Number *"
            type="number"
            placeholder="Enter a valid number"
          />
          <InputMap
            ref={rfEmail}
            label="Email Address *"
            type="email"
            placeholder="Enter Email Address"
          />
          <InputMap
            ref={rfPassword}
            label="Password *"
            type="password"
            placeholder="Enter Password"
          />
          <InputMap
            ref={rfcPassword}
            label="Confirm Password *"
            type="password"
            placeholder="Confirm Password"
          />
          <p>
            Review terms and conditions?{" "}
            <span
              onClick={() => {
                window.location.href = "/terms";
              }}
            >
              Click here
            </span>
          </p>
          <Button label="Submit" handleClick={loginUser} />
        </form>
        <p>
          Already have an account?{" "}
          <span
            onClick={() => {
              props.setToggleLogin(true);
              props.setToggleRegister(false);
            }}
          >
            Login here
          </span>
        </p>
        <h4
          onClick={() => {
            props.setToggleLogin(false);
            props.setToggleRegister(false);
          }}
        >
          Cancel
        </h4>
        {isLoading && <Loading />}
      </div>
    </div>
  );
}
