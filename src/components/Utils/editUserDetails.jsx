import React, { useRef, useState } from "react";
import InputMap from "../maps/InputMap";
import Button from "./ButtonMain";

export default function EditUserDetails(props) {

    const [isError, setIsError] = useState("");
    const [body, updateBody] = useState({
        Phone: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const rfPhone = useRef();

    const editDetails = () => {
        if (props.isAuthenticated){
        let d = body;
        d.Phone = rfPhone.current.value;
        updateBody(d);
        setIsError("");

        fetch(`/api/users/${props.currentUser.UserID}`, {
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
            } else throw Error("Change of details failed");
          })
          .then((data) => {
            setIsLoading(false);
            if (data.success) {
              //props.setToggleEditDetails(false);
              localStorage.clear();
              props.setIsAuthenticated(false);
            } else {
            }
          })
          .catch((err) => {
            setIsLoading(false);
            setIsError("Login failed!");
          });
        }
        else{
            setIsError("You have been logged out! Please login afresh first!")
        }
    };

    const placeholder = `Current phone no: ${props.currentUser.Phone}`

    return (
        <div className="login">
        <div className="container">
            <h3>Edit Account Details for {props.currentUser.Name}</h3>
            <h4>{isError}</h4>
            <form
            onSubmit={(e) => {
                e.preventDefault();
            }}
            >
            <InputMap
                ref={rfPhone}
                label="Change Phone Number"
                type="number"
                placeholder={placeholder}
            />
            <br />
            <Button label="Submit" handleClick={editDetails} />
            </form>
            <p>
            Change your password?{" "}
            <span
                onClick={() => {
                props.setToggleEditDetails(false);
                props.setToggleChangePass(true);
                }}
            >
                Click here
            </span>
            </p>
            <h4
            onClick={() => {
                props.setToggleEditDetails(false)
            }}
            >
            Cancel
            </h4>
        </div>
        </div>
    );
}
