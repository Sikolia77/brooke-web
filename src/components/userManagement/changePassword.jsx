import React, { useRef, useState } from "react";
import InputMap from "../maps/InputMap";
import Button from "../Utils/ButtonMain";
import Loading from "../Utils/Loading";

export default function ChangePassword(props) {
  const [isError, setIsError] = useState("");
  const [body, updateBody] = useState({
    Password: null,
    NewPassword: null,
    ConfirmNewPassword: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const rfOldPassword = useRef();
  const rfNewPassword = useRef();
  const rfConfirmNewPassword = useRef();

  const changePassword = () => {
    if (props.isAuthenticated) {
      let d = body;
      d.Password = rfOldPassword.current.value;
      d.NewPassword = rfNewPassword.current.value;
      d.ConfirmNewPassword = rfConfirmNewPassword.current.value;
      updateBody(d);
      setIsError("");
      if (!body.Password) return setIsError("Old password is required!");
      if (!body.NewPassword || body.NewPassword?.length < 6)
        return setIsError("New Password must be at least 6 characters!");
      if (!validatePassword(body.NewPassword, body.ConfirmNewPassword))
        return setIsError("Old Password and New Password do not match");

      if (validatePassword(body.NewPassword, body.ConfirmNewPassword)) {
        setIsLoading(true);
        fetch(`/api/auth/${props.currentUser.UserID}`, {
          method: "PUT",
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
            } else throw Error("Could not Change password!!");
          })
          .then((data) => {
            setIsLoading(false);
            if (data.success) {
              setIsError(data.success);
              //props.setToggleChangePass(false)
              localStorage.clear();
              props.setIsAuthenticated(false);
              window.location.href = "/";
            } else {
              setIsError(data.error);
            }
          })
          .catch((err) => {
            setIsLoading(false);
            setIsError("Could not Change password!");
          });
      }
    } else {
      setIsError("You have been logged out! Please login afresh first!");
    }
  };

  const validatePassword = (newPassword, confirmNewPassword) => {
    return confirmNewPassword === newPassword;
  };

  return (
    <div className="login">
      <div className="container">
        <h3>Change Password for {props.currentUser.Name}</h3>
        <h4>{isError}</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <InputMap
            ref={rfOldPassword}
            label="Enter Old Password *"
            type="password"
            placeholder="Enter Password"
          />

          <InputMap
            ref={rfNewPassword}
            label="Enter your new Password *"
            type="password"
            placeholder="New Password"
          />

          <InputMap
            ref={rfConfirmNewPassword}
            label="Confirm your new Password *"
            type="password"
            placeholder="Confirm Password"
          />
          <br />
          <Button label="Submit" handleClick={changePassword} />
        </form>
        <p>Change your password</p>
        <h4
          onClick={() => {
            props.setToggleChangePass(false);
          }}
        >
          Close
        </h4>
        {isLoading && <Loading />}
      </div>
    </div>
  );
}
