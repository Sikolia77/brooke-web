import React, { useRef, useState, useEffect } from "react";
import InputMap from "../maps/InputMap";
import Button from "../Utils/ButtonMain";

export default function EditUserDetails(props) {
  const [isError, setIsError] = useState("");
  const [msg, setMsg] = useState("");
  const [body, updateBody] = useState({
    Name: null,
    Phone: null,
    Position: null,
    Department: null,
  });
  const rfPhone = useRef();
  const rfName = useRef();
  const rfDept = useRef();
  const rfPositiion = useRef();

  const editDetails = () => {
    const d = body;
    d.Phone = rfPhone.current.value;
    d.Name = rfName.current.value;
    d.Position = rfPositiion.current.value;
    d.Department = rfDept.current.value;

    updateBody(d);
    setIsError("");
    fetch(`/api/auth/${props.userID}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("Update Failed!");
      })
      .then((data) => {
        setMsg("Change User Details Successfull");
        props.setChanged(!props.changed);
      })
      .catch((e) => {
        setIsError("Update Failed!!");
      });
  };

  const phonePlaceholder = `${props.phone}`;
  const namePlaceholder = `${props.name}`;
  const deptPlaceholder = `${props.department}`;
  const posPlaceholder = `${props.position}`;

  return (
    <div className="login">
      <div className="container">
        <h3>Edit Account Details </h3>
        <h4>{isError}</h4>
        <h4 style={{ color: "green" }}>{msg}</h4>
        <div className="create">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            autoComplete="none"
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
            <InputMap
              ref={rfDept}
              label="Change Department"
              type="text"
              placeholder={deptPlaceholder}
            />
            <InputMap
              ref={rfPositiion}
              label="Change Position"
              type="text"
              placeholder={posPlaceholder}
            />
            <br />
            <Button label="Submit" handleClick={editDetails} />
          </form>
        </div>
        <h4
          onClick={() => {
            props.toggleEditForm();
          }}
        >
          Cancel
        </h4>
      </div>
    </div>
  );
}
