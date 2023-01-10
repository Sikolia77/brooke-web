import { useState, useEffect } from "react";
import "../../Styles/Commentcontent.scss";
import Prompt from "./prompt";

import Reply from "./Reply";
import ReplyComment from "./ReplyComment";

export default function Commentcontent(props) {
  const [showLess, setShowLess] = useState(false);
  const [text, setText] = useState(props.message.Content.slice(0, 250) + "...");
  const [status, setStatus] = useState(props.message.Status);
  const [replies, setReplies] = useState();
  const [viewReplies, setViewReplies] = useState(false);
  const [replyComment, setReplyComment] = useState(false);

  useEffect(() => {
    setReplies(null);
    fetch(`/${props.replies_url}`, {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw Error("Could not fetch messages!!!");
        }
        return res.json();
      })
      .then((data) => {
        setReplies(data);
        props.setTotal(data.total);
        props.setActive(data.active);
        props.setInactive(data.inactive);
        var today = new Date();
        var date =
          today.getFullYear() +
          "-" +
          (today.getMonth() + 1) +
          "-" +
          today.getDate();
        var time =
          today.getHours() +
          ":" +
          today.getMinutes() +
          ":" +
          today.getSeconds();
        var dateTime = date + " " + time;
        props.setTime(dateTime);
      })
      .catch((err) => {});
  }, [viewReplies]);

  let cl = status === false ? "messageContent" : "messageContent";
  const moreOrLess = () => {
    if (showLess) {
      setText(props.message.Content.slice(0, 250) + "...");
      setShowLess(!showLess);
    } else {
      setText(props.message.Content);
      setShowLess(!showLess);
    }
  };

  const updateToRead = () => {
    fetch(`/${props.update_url}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ Status: true }),
    })
      .then((response) => {
        if (response.ok) {
          setStatus(true);
          return response.json();
        } else throw Error("");
      })
      .then((data) => {})
      .catch((err) => {});
  };

  return (
    <div>
      {replyComment &&
        (props.currentUser ? (
          <ReplyComment
            setReplyComment={setReplyComment}
            commentID={props.message.CommentID}
            target="comments"
            currentUser={props.currentUser}
          />
        ) : (
          <Prompt setReplyComment={setReplyComment} />
        ))}
      <div className="messageContet">
        <div
          className={cl}
          onClick={() => {
            moreOrLess();
            updateToRead();
          }}
        >
          <div className="symbol">{props.message.From.charAt(0)}</div>
          <div className="user">
            {props.message.Content.length < 250 ? (
              <>
                <div className="nameDate">
                  <h4>{props.message.From}</h4>
                  <div className="date">
                    <p>
                      {props.message.createdAt
                        .replace("T", " at ")
                        .replace(/:/, ".")
                        .split(":")[0]
                        .replace(".", ":")}
                    </p>
                  </div>
                </div>
                <p>{props.message.Content}</p>
              </>
            ) : (
              <>
                <div className="nameNDate">
                  <h4>{props.message.From}</h4>
                  <p className="timestamp">
                    {props.message.createdAt
                      .replace("T", " at ")
                      .replace(/:/, ".")
                      .split(":")[0]
                      .replace(".", ":")}
                  </p>
                </div>
                <p>
                  {text}
                  <a
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => moreOrLess()}
                  >
                    {showLess ? (
                      <span>
                        Less <i className="fa fa-angle-up"></i>
                      </span>
                    ) : (
                      <span>
                        More <i className="fa fa-angle-down"></i>
                      </span>
                    )}
                  </a>
                </p>
              </>
            )}

            <button
              onClick={() => setReplyComment(true)}
              style={{ "margin-right": "20px" }}
            >
              Reply
            </button>
            <button onClick={() => setViewReplies(!viewReplies)}>
              View Replies
            </button>
            {viewReplies &&
              replies &&
              replies.map((reply) => {
                return (
                  <div>
                    <Reply reply={reply} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
