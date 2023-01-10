import React, { useRef, useState, useEffect } from "react";
import Button from "../Utils/ButtonMain";

export default function ReplyComment(props) {

    const [isError, setIsError] = useState("");
    const [body, updateBody] = useState({
        MessageID: null,
        UserID: null,
        Content: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const rfContent = useRef();

    const [currentUser, setCurrentUser] = useState()

    var jwt = require("jsonwebtoken")
    useEffect(() => {
      const token = localStorage.getItem("nimda_ksa");
      setCurrentUser(jwt.decode(token))
    }, []);

    const sendReply = () => {   
      let d = body;
      
      d.CommentID = props.commentID;
      d.UserID = props.currentUser?.Name;
      d.Content = rfContent.current.value;
      updateBody(d);
      setIsError("");
      if (!body.Content) return setIsError("Please write a reply!");

      if (body.Content) {
        setIsLoading(true);
        if (props.target === "messages") {
          fetch(`/api/replies/reply`, {
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
              } else throw Error("Could not Send Reply!!");
            })
            .then((data) => {
              setIsLoading(false);
              if (data.success) {
                setIsError(data.success);
                localStorage.clear();
              } else {
                setIsError(data.error);
              }
            })
            .catch((err) => {
              setIsLoading(false);
              setIsError("Could not Send Reply!");
            });
        }
        if (props.target === "comments") {
          fetch(`/api/createcommentsreply/reply`, {
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
              } else throw Error("Could not Send Reply!!");
            })
            .then((data) => {
              setIsLoading(false);
              if (data.success) {
                setIsError(data.success);
                localStorage.clear();
              } else {
                setIsError(data.error);
              }
            })
            .catch((err) => {
              setIsLoading(false);
              setIsError("Could not Send Reply!");
            });
          }
        }
        
    };

  return (
    <div className="login">
      <div className="container">
        <h3>
          {props.target === "messages"
            ? "Reply to Message"
            : "Reply to Comment"}
        </h3>
        <h4>{isError}</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <textarea
            ref={rfContent}
            style={{ width: "100%" }}
            name=""
            id=""
            cols="30"
            rows="10"
          ></textarea>
          <br />
          <br />
          <Button label="Send" handleClick={sendReply} />
        </form>

        <h4
          onClick={() => {
            props.setReplyComment(false);
          }}
        >
          Close
        </h4>
      </div>
    </div>
  );
}
