import React from "react";

export default function Prompt(props) {

  return (
    <div className="login">
      <div className="container">
        <h3>{props.target === "messages" ? "Reply to Message" : "Reply to Comment"}</h3>
      

          <h5 style={{"color":"red", "text-align":"center"}}>Log in to reply to this comment</h5>

        <h4
          onClick={() => {
            props.setReplyComment(false)
          }}
        >
          Okay
        </h4>
      </div>
    </div>
  );
}
