import { useState } from "react";

export default function Thumbnail(props) {
  const [show, setShow] = useState(false);

  const showMore = () => {
    setShow(!show);
  };

  const deleteMap = () => {
    fetch(`/api/gis/${props.item.ID}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        console.log(data);
      })
      .catch((e) => {});
  };

  return (
    <div
      onClick={() => {
        showMore();
      }}
      className="thumbnail"
    >
      <img src={props.item.Thumbnail} alt="" />
      <div className="desc">
        <h4>{props.item.Title}</h4>
        <p>{props.item.updatedAt.split("T")[0]}</p>
      </div>
      {show && (
        <div className="options">
          <p
            onClick={() => {
              window.location.href = `/admin/instances/${props.item.Category.split(
                " "
              )[0].toLowerCase()}/preview/${props.item.ID}`;
            }}
          >
            Preview
          </p>
        </div>
      )}
    </div>
  );
}
