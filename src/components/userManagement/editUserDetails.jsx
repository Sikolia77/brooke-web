import React, { useRef, useState } from "react";
import InputMap from "../maps/InputMap";
import Button from "../Utils/ButtonMain";

export default function EditUserDetails(props) {
  const [isError, setIsError] = useState("");
  const [body, updateBody] = useState({
    Phone: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const rfPhone = useRef();
  const rfName = useRef();

  const editDetails = () => {
    if (props.isAuthenticated) {
      let d = body;
      d.Phone = rfPhone.current.value;
      d.Name = rfName.current.value;
      if (d.Phone.length < 10) {
        setIsError("Phone Number must be usually 10 digits");
      }
      if (!d.Name.includes(" ")) {
        setIsError("Enter a valid name including your Surname and Firstname)");
      }
      if (d.Name.length < 3) {
        setIsError("Name too short");
      }
      if (d.Name.includes(" ") && d.Name.length > 3 && d.Phone.length === 10) {
        updateBody(d);
        setIsError("");

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
            } else throw Error("Change of details failed");
          })
          .then((data) => {
            setIsLoading(false);
            if (data.success) {
              //props.setToggleEditDetails(false);
              setIsError(data.success);
              setTimeout(() => {
                localStorage.clear();
                props.setIsAuthenticated(false);
                window.location.href = "/";
              }, 1000);
            } else {
              console.log(data.error);
            }
          })
          .catch((err) => {
            setIsLoading(false);
            setIsError("Login failed!");
          });
      }
    }
  };

  const phonePlaceholder = `${props.currentUser.Phone}`;
  const namePlaceholder = `${props.currentUser.Name}`;

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
            ref={rfName}
            label="Change Name"
            type="text"
            placeholder={namePlaceholder}
          />
          <InputMap
            ref={rfPhone}
            label="Change Phone Number"
            type="number"
            placeholder={phonePlaceholder}
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
            props.setToggleEditDetails(false);
          }}
        >
          Cancel
        </h4>
      </div>
    </div>
  );
}
