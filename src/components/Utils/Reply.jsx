import { useState } from "react"

export default function Reply(props) {

    const [showLess, setShowLess] = useState(false)
    const [text, setText] = useState(props.reply.Content.slice(0, 250) + "...")
    const [status, setStatus] = useState(props.MessageID)

    
    let cl = status === false ? "messageContent unread" : "messageContent"
 
    const moreOrLess = () => {
        
        if (showLess){
            setText(props.reply.Content.slice(0, 250) + "...")
            setShowLess(!showLess)
        }
        else{
            setText(props.reply.Content)
            setShowLess(!showLess)
        }
    }

    

    const updateToRead = () => {
        
        fetch(`/${props.url}`, {
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
          .catch((err) => {
            console.log(err);
          });
    }

    return (
      <div
        className={cl}
        onClick={() => {
          moreOrLess();
          updateToRead();
        }}
      >
        <div className="user">
          {props.reply.Content.length < 250 ? (
            <>
              <div className="nameRoleDate">
                <h4>{props.reply.UserID}</h4>
                <p className="role">Admin@KSA </p>
                <p className="date">
                  {props.reply.createdAt
                    .replace("T", " at ")
                    .replace(/:/, ".")
                    .split(":")[0]
                    .replace(".", ":")}
                </p>
              </div>
              <p>{props.reply.Content}</p>
            </>
          ) : (
            <>
              <div className="nameRoleDate">
                <h4>{props.reply.UserID}</h4>
                <div className="role">
                  <p>Admin@KSA </p>
                </div>
                <div className="date">
                  <p>
                    {props.reply.createdAt
                      .replace("T", " at ")
                      .replace(/:/, ".")
                      .split(":")[0]
                      .replace(".", ":")}
                  </p>
                </div>
              </div>
              <p>
                {text}
                <a
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() => moreOrLess()}
                >
                  {showLess ? "Less" : "More"}
                  <i className="fa fa-angle-down"></i>
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    );
}