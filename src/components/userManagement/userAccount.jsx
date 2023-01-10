import React, { } from "react";

export default function UserAccount(props) {

  return (
    <div className="login">
      <div className="container">
        <h3>Account Details</h3>
        <div>
          <p>Name : {props.currentUser.Name}</p>
          <p>Phone : {props.currentUser.Phone}</p>
          <p>Email : {props.currentUser.Email}</p>
          <p>Role: {props.currentUser.Role}</p>
          {props.currentUser.Status && <p>Status : Active</p>}
        </div>
        <h4
          onClick={() => {
            props.setToggleAccount(false)
          }}
        >
          Cancel
        </h4>
      </div>
    </div>
  );
}
