import { useState, useEffect } from "react";
import Commentcontent from "./Commentcontent";
import Pagination from "./pagination";

export default function CommentsSection(props) {
  const [data, setData] = useState(null);
  const [offset, setOffset] = useState(0);
  const [sNo, setSNo] = useState(offset * 12 + 1);
  const [time, setTime] = useState();

  useEffect(() => {
    setData(null);
    setSNo(offset * 12 + 1);
    fetch(`/api/instance/comments/${props.instanceID}`, {
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

        setTime(dateTime);
        setData(data);
      })
      .catch((err) => {});
  }, [props.refresh, props.changed, offset]);

  function scrollPages(offset) {
    setOffset(offset);
  }

  return (
    <>
      <h2>Comments</h2>
      {data && data ? (
        <p className="display">
          Displaying {data.length} of {data.total} Comments. (No. {sNo} -{" "}
          {data.length === 12 ? (offset + 1) * 12 : sNo + (data.length - 1)})
        </p>
      ) : (
        <p className="display">There are no Messages currently</p>
      )}
      <div className="messagecontent">
        {data &&
          data &&
          data.map((message) => {
            return (
              <Commentcontent
                message={message}
                update_url={`api/comments/${message.CommentID}`}
                replies_url={`api/repliesbycommentsid/${message.CommentID}`}
                currentUser={props.currentUser}
              />
            );
          })}
      </div>
      {data && (
        <Pagination
          scrollPages={scrollPages}
          page={offset}
          count={data.total}
        />
      )}
    </>
  );
}
